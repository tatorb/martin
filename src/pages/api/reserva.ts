/**
 * Aviso de reserva confirmada -> API de conversiones de Meta.
 *
 * La reserva ocurre dentro del iframe de Google Calendar, así que el navegador
 * no la ve. Un Google Apps Script detecta el evento nuevo en el calendario y
 * le pega a este endpoint, que arma el evento Schedule y lo manda a Meta desde
 * el servidor.
 *
 * Nada sensible vive en este archivo. El identificador del conjunto de datos,
 * el token y el secreto compartido se leen de variables de entorno.
 */
import type { APIRoute } from 'astro';

// Ruta de servidor, no se prerenderiza.
export const prerender = false;

/**
 * Lectura de variables de entorno en tiempo de ejecución.
 *
 * A propósito no se usa import.meta.env para los secretos: Astro reemplaza esas
 * expresiones durante la compilación, con lo cual el token terminaría escrito
 * dentro del archivo publicado. process.env se resuelve recién cuando la
 * función corre, así que el valor nunca queda en el código.
 */
function entorno(nombre: string): string {
  return (globalThis as any).process?.env?.[nombre] ?? '';
}

/** Versión de la API de Meta. Se puede pisar por entorno cuando quede vieja. */
const VERSION_API = entorno('META_API_VERSION') || 'v21.0';

/** De dónde sale la conversión, para el campo event_source_url. */
const URL_ORIGEN = 'https://martin.studiomrb.com/';

interface CuerpoReserva {
  email?: unknown;
  nombre?: unknown;
  apellido?: unknown;
  telefono?: unknown;
  event_id?: unknown;
  test_event_code?: unknown;
}

function json(datos: unknown, status: number): Response {
  return new Response(JSON.stringify(datos), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

/**
 * Comparación de tiempo constante. Un `===` común corta apenas encuentra la
 * primera letra distinta, y esa diferencia de milisegundos deja adivinar el
 * secreto de a un carácter por vez.
 */
function igualSinFiltrar(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let dif = 0;
  for (let i = 0; i < a.length; i++) dif |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return dif === 0;
}

async function sha256(texto: string): Promise<string> {
  const bytes = new TextEncoder().encode(texto);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function texto(valor: unknown): string {
  return typeof valor === 'string' ? valor : '';
}

/**
 * Normalización de nombre y apellido según Meta: minúsculas, sin espacios
 * sobrantes, sin acentos y sin puntuación. Así "Rodríguez" y "rodriguez"
 * dan el mismo hash y la coincidencia no se pierde por una tilde.
 */
function normalizarNombre(valor: unknown): string {
  return texto(valor)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '');
}

/** Email en minúsculas y sin espacios, como pide la especificación. */
function normalizarEmail(valor: unknown): string {
  return texto(valor).trim().toLowerCase();
}

/**
 * Teléfono: sólo dígitos, con código de país y sin el 00 internacional que
 * usan algunos países al marcar. Meta descarta el número si no lo lleva.
 */
function normalizarTelefono(valor: unknown): string {
  const digitos = texto(valor).replace(/\D/g, '');
  return digitos.startsWith('00') ? digitos.slice(2) : digitos;
}

export const POST: APIRoute = async ({ request }) => {
  const secreto = entorno('RESERVA_WEBHOOK_SECRET');
  const dataset = entorno('META_DATASET_ID');
  const token = entorno('META_ACCESS_TOKEN');

  // Falta de configuración, no culpa de quien llama. Se avisa en el log para
  // que se vea en Vercel, pero sin decir hacia afuera qué falta.
  if (!secreto || !dataset || !token) {
    console.error('[reserva] faltan variables de entorno', {
      RESERVA_WEBHOOK_SECRET: Boolean(secreto),
      META_DATASET_ID: Boolean(dataset),
      META_ACCESS_TOKEN: Boolean(token),
    });
    return json({ ok: false, error: 'endpoint sin configurar' }, 500);
  }

  const recibido = request.headers.get('x-reserva-secret') ?? '';
  if (!igualSinFiltrar(recibido, secreto)) {
    console.warn('[reserva] secreto inválido, petición rechazada');
    return json({ ok: false, error: 'no autorizado' }, 401);
  }

  let cuerpo: CuerpoReserva;
  try {
    cuerpo = (await request.json()) as CuerpoReserva;
  } catch {
    console.warn('[reserva] cuerpo que no es JSON');
    return json({ ok: false, error: 'cuerpo inválido' }, 400);
  }

  const eventId = texto(cuerpo.event_id).trim();
  if (!eventId) {
    console.warn('[reserva] falta event_id');
    return json({ ok: false, error: 'falta event_id' }, 400);
  }

  const email = normalizarEmail(cuerpo.email);
  const nombre = normalizarNombre(cuerpo.nombre);
  const apellido = normalizarNombre(cuerpo.apellido);
  const telefono = normalizarTelefono(cuerpo.telefono);

  // Sin ningún dato de contacto, Meta no puede atribuir la conversión a nadie
  // y el evento se descarta igual. Mejor cortar acá y que se vea en el log.
  if (!email && !telefono) {
    console.warn('[reserva] sin email ni teléfono, no se envía', { eventId });
    return json({ ok: false, error: 'hacen falta email o telefono' }, 400);
  }

  // Todo lo personal viaja hasheado. En claro no sale nada.
  const userData: Record<string, string[]> = {};
  if (email) userData.em = [await sha256(email)];
  if (nombre) userData.fn = [await sha256(nombre)];
  if (apellido) userData.ln = [await sha256(apellido)];
  if (telefono) userData.ph = [await sha256(telefono)];

  const carga: Record<string, unknown> = {
    data: [
      {
        event_name: 'Schedule',
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: 'website',
        event_source_url: URL_ORIGEN,
        user_data: userData,
      },
    ],
  };

  // Modo de prueba. Con este código el evento cae en "Probar eventos" y no
  // ensucia los datos reales.
  const codigoPrueba = texto(cuerpo.test_event_code).trim();
  if (codigoPrueba) carga.test_event_code = codigoPrueba;

  const destino = `https://graph.facebook.com/${VERSION_API}/${dataset}/events`;

  try {
    const respuesta = await fetch(destino, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(carga),
    });

    const detalle = await respuesta.text();

    if (!respuesta.ok) {
      console.error('[reserva] Meta rechazó el evento', {
        eventId,
        status: respuesta.status,
        respuesta: detalle,
      });
      return json({ ok: false, error: 'Meta rechazó el evento', detalle }, 502);
    }

    console.log('[reserva] evento Schedule enviado', {
      eventId,
      prueba: Boolean(codigoPrueba),
      campos: Object.keys(userData).join(','),
      respuesta: detalle,
    });
    return json({ ok: true, event_id: eventId }, 200);
  } catch (error) {
    console.error('[reserva] no se pudo contactar a Meta', {
      eventId,
      error: error instanceof Error ? error.message : String(error),
    });
    return json({ ok: false, error: 'no se pudo contactar a Meta' }, 502);
  }
};

/** Cualquier método que no sea POST. Evita respuestas confusas al probar. */
export const ALL: APIRoute = () =>
  json({ ok: false, error: 'usar POST' }, 405);
