/**
 * Validación de los datos del formulario de lead magnets.
 *
 * El mismo archivo lo usan el navegador y el servidor. El navegador lo usa
 * para avisar al instante, y el servidor lo vuelve a correr porque cualquiera
 * puede saltear el formulario y pegarle directo al endpoint.
 */

export interface DatosLead {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
}

/** Campo -> mensaje de error. Vacío significa que está todo bien. */
export type Errores = Partial<Record<keyof DatosLead, string>>;

function texto(valor: unknown): string {
  return typeof valor === 'string' ? valor.trim() : '';
}

function validarNombre(valor: string): string | null {
  if (!valor) return 'Escribí tu nombre';
  if (valor.length < 2) return 'El nombre es muy corto';
  if (valor.length > 80) return 'El nombre es muy largo';
  // Al menos una letra, para que no pase un nombre hecho sólo de números.
  if (!/\p{L}/u.test(valor)) return 'Escribí tu nombre';
  return null;
}

/**
 * La empresa se pide como dirección web. Se acepta escrita como sea,
 * "studiomrb.com", "www.studiomrb.com" o la URL entera, y se exige que tenga
 * una forma de dominio creíble: nombre, punto y una extensión de dos letras
 * o más.
 */
function validarEmpresa(valor: string): string | null {
  if (!valor) return 'Escribí el sitio web de tu empresa';
  if (valor.length > 200) return 'La dirección es muy larga';

  const sinProtocolo = valor.replace(/^https?:\/\//i, '').replace(/^www\./i, '');
  const dominio = sinProtocolo.split(/[/?#]/)[0];

  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$/i.test(dominio))
    return 'Escribí una dirección válida, por ejemplo studiomrb.com';

  return null;
}

function validarEmail(valor: string): string | null {
  if (!valor) return 'Escribí tu email';
  if (valor.length > 254) return 'El email es muy largo';
  // Sin espacios, con una arroba, y un dominio con punto y extensión.
  if (!/^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/i.test(valor))
    return 'Ese email no parece válido';
  return null;
}

/**
 * Teléfono con código de país. Se admite cualquier separador, pero tienen que
 * quedar entre 8 y 15 dígitos, que es el rango del estándar internacional.
 */
function validarTelefono(valor: string): string | null {
  if (!valor) return 'Escribí tu teléfono';
  if (/[^\d\s+()-]/.test(valor)) return 'El teléfono sólo lleva números';
  const digitos = valor.replace(/\D/g, '');
  if (digitos.length < 8) return 'Faltan dígitos, incluí el código de área';
  if (digitos.length > 15) return 'El teléfono tiene demasiados dígitos';
  return null;
}

/** Deja la empresa siempre como una URL completa, para poder abrirla de un clic. */
export function normalizarEmpresa(valor: string): string {
  const limpio = texto(valor);
  if (!limpio) return '';
  return /^https?:\/\//i.test(limpio) ? limpio : `https://${limpio}`;
}

export function limpiarDatos(origen: Record<string, unknown>): DatosLead {
  return {
    nombre: texto(origen.nombre),
    empresa: texto(origen.empresa),
    email: texto(origen.email).toLowerCase(),
    telefono: texto(origen.telefono),
  };
}

export function validarLead(datos: DatosLead): Errores {
  const errores: Errores = {};
  const nombre = validarNombre(datos.nombre);
  const empresa = validarEmpresa(datos.empresa);
  const email = validarEmail(datos.email);
  const telefono = validarTelefono(datos.telefono);

  if (nombre) errores.nombre = nombre;
  if (empresa) errores.empresa = empresa;
  if (email) errores.email = email;
  if (telefono) errores.telefono = telefono;

  return errores;
}
