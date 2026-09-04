/**
 * Recibe los datos de quien descarga un lead magnet y los manda por mail.
 *
 * El envío se hace con Resend. Si el mail llegara a fallar, el lead igual
 * queda escrito en los registros de Vercel y la descarga se habilita: un
 * problema del proveedor de correo no tiene por qué frustrar al visitante.
 */
import type { APIRoute } from 'astro';
import { limpiarDatos, normalizarEmpresa, validarLead } from '../../lib/validacion';
import { buscarLeadMagnet } from '../../leadmagnets';

export const prerender = false;

/** Variables de entorno leídas en tiempo de ejecución, nunca en la compilación. */
function entorno(nombre: string): string {
  return (globalThis as any).process?.env?.[nombre] ?? '';
}

const DESTINO_POR_DEFECTO = 'martin@studiomrb.com';

function json(datos: unknown, status: number): Response {
  return new Response(JSON.stringify(datos), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function escaparHtml(valor: string): string {
  return valor
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let cuerpo: Record<string, unknown>;
  try {
    cuerpo = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: 'cuerpo inválido' }, 400);
  }

  // Trampa para robots. El campo va oculto: una persona nunca lo completa.
  if (typeof cuerpo.sitio === 'string' && cuerpo.sitio.trim() !== '') {
    console.warn('[lead] descartado por la trampa antirrobots');
    return json({ ok: true }, 200); // se le responde bien para no darle pistas
  }

  const slug = typeof cuerpo.slug === 'string' ? cuerpo.slug : '';
  const magnet = buscarLeadMagnet(slug);
  if (!magnet) {
    console.warn('[lead] lead magnet desconocido', { slug });
    return json({ ok: false, error: 'material desconocido' }, 400);
  }

  const datos = limpiarDatos(cuerpo);
  const errores = validarLead(datos);
  if (Object.keys(errores).length > 0) {
    return json({ ok: false, errores }, 400);
  }

  const empresa = normalizarEmpresa(datos.empresa);
  const momento = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Cordoba' });

  // Queda en los registros de Vercel pase lo que pase con el correo.
  console.log('[lead] nuevo interesado', {
    material: magnet.slug,
    nombre: datos.nombre,
    empresa,
    email: datos.email,
    telefono: datos.telefono,
    origen: clientAddress,
  });

  const apiKey = entorno('RESEND_API_KEY');
  const destino = entorno('LEAD_EMAIL_TO') || DESTINO_POR_DEFECTO;
  const remitente = entorno('LEAD_EMAIL_FROM') || 'Landing Studio MRB <onboarding@resend.dev>';

  if (!apiKey) {
    console.error('[lead] falta RESEND_API_KEY, el mail no se envía');
    // La descarga se habilita igual. El dato ya quedó en el registro de arriba.
    return json({ ok: true, correo: false }, 200);
  }

  const filas: [string, string][] = [
    ['Material', `${magnet.titulo} (/lm/${magnet.slug})`],
    ['Nombre', datos.nombre],
    ['Empresa', empresa],
    ['Email', datos.email],
    ['Teléfono', datos.telefono],
    ['Fecha', momento],
  ];

  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#111">
  <p style="margin:0 0 16px">Alguien descargó un lead magnet.</p>
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse">
    ${filas
      .map(
        ([etiqueta, valor]) =>
          `<tr><td style="padding:4px 16px 4px 0;color:#55606a">${etiqueta}</td>` +
          `<td style="padding:4px 0"><strong>${escaparHtml(valor)}</strong></td></tr>`
      )
      .join('')}
  </table>
</div>`;

  const texto = filas.map(([etiqueta, valor]) => `${etiqueta}: ${valor}`).join('\n');

  try {
    const respuesta = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: remitente,
        to: [destino],
        // Así se puede contestar directo al interesado desde el mismo mail.
        reply_to: datos.email,
        subject: `Nuevo lead: ${datos.nombre} (${magnet.slug})`,
        html,
        text: texto,
      }),
    });

    if (!respuesta.ok) {
      const detalle = await respuesta.text();
      console.error('[lead] Resend rechazó el envío', { status: respuesta.status, detalle });
      return json({ ok: true, correo: false }, 200);
    }

    console.log('[lead] mail enviado', { destino, material: magnet.slug });
    return json({ ok: true, correo: true }, 200);
  } catch (error) {
    console.error('[lead] no se pudo contactar a Resend', {
      error: error instanceof Error ? error.message : String(error),
    });
    return json({ ok: true, correo: false }, 200);
  }
};

export const ALL: APIRoute = () => json({ ok: false, error: 'usar POST' }, 405);
