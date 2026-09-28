/**
 * Catálogo de lead magnets.
 *
 * Cada entrada genera una página en /lm/[slug] con su formulario y su
 * descarga. Para publicar uno nuevo alcanza con dejar el PDF en
 * public/lm/ y agregar acá un objeto más. No hay que tocar nada del código.
 */

export interface LeadMagnet {
  /** Parte final de la URL: /lm/linkedin */
  slug: string;
  /** Título de la página. */
  titulo: string;
  /** Frase corta debajo del título. Opcional. */
  bajada?: string;
  /** Uno o dos párrafos que explican qué es y para quién. Opcional. */
  descripcion?: string;
  /** Qué se lleva quien lo descarga. Se muestra como lista. Opcional. */
  puntos?: string[];
  /** Ruta del PDF dentro de public. */
  archivo: string;
  /** Nombre con el que se guarda el archivo en la computadora del visitante. */
  nombreDescarga: string;
  /** Texto del botón de descarga. */
  etiquetaDescarga: string;
  /** Título y descripción para buscadores y para cuando se comparte el link. */
  seo: { titulo: string; descripcion: string };
}

export const LEAD_MAGNETS: LeadMagnet[] = [
  {
    // Lead magnet de la campaña de outbound de envases. FALTA el PDF: hay que
    // dejarlo en public/lm/packaging-market-report.pdf. Hasta entonces la
    // descarga no tiene archivo y el build avisa.
    //
    // El slug va con guion y no con punto. Un punto en el último tramo de la
    // URL hace que los servidores estáticos lo lean como la extensión de un
    // archivo y no encuentren la página. La dirección con punto sigue
    // funcionando: entra por la redirección declarada en astro.config.mjs.
    slug: 'packaging-market-report',
    titulo: 'Presencia digital del mercado comprador de envases en Latinoamérica',
    archivo: '/lm/packaging-market-report.pdf',
    nombreDescarga: 'studio-mrb-presencia-digital-mercado-envases-latam.pdf',
    etiquetaDescarga: 'Descargar el informe en PDF',
    seo: {
      titulo: 'Presencia digital del mercado comprador de envases en Latinoamérica | Studio MRB',
      descripcion:
        'Relevamiento de la presencia digital del mercado comprador de envases en ' +
        'Latinoamérica, por Studio MRB.',
    },
  },
  {
    slug: 'linkedin',
    titulo: 'Las 9 herramientas con las que abrimos cuentas clave B2B',
    bajada: 'El stack real, paso por paso.',
    descripcion:
      'Ninguna herramienta sola resuelve la prospección. A mano no llegás al volumen que ' +
      'necesita una operación de cuentas nombradas, y los all in one funcionaban en 2022. ' +
      'Hoy cada paso del proceso pide una herramienta que lo ejecute a fondo. Esta guía ' +
      'muestra el stack completo que usamos en Studio MRB, en el orden en que lo usamos.',
    puntos: [
      'El flujo completo, de la definición del perfil de cuenta objetivo hasta el primer contacto',
      'Qué herramienta resuelve cada paso y por qué esa y no otra',
      'Cómo se encadenan los filtros para que el alcance escale sin perder precisión',
      'Cómo lo operamos nosotros, y qué necesitamos de tu lado',
    ],
    archivo: '/lm/linkedin.pdf',
    nombreDescarga: 'studio-mrb-9-herramientas-apertura-de-cuentas.pdf',
    etiquetaDescarga: 'Descargar la guía en PDF',
    seo: {
      titulo: 'Las 9 herramientas con las que abrimos cuentas clave B2B | Studio MRB',
      descripcion:
        'El stack real de prospección B2B de Studio MRB, paso por paso: definición, datos, ' +
        'validación y motores de contacto.',
    },
  },
];

export function buscarLeadMagnet(slug: string): LeadMagnet | undefined {
  return LEAD_MAGNETS.find((lm) => lm.slug === slug);
}

/**
 * Aviso durante la compilación si algún material no tiene su archivo. Sin esto,
 * un lead magnet publicado con el PDF faltante se descubre recién cuando un
 * interesado toca el botón de descarga y no baja nada.
 */
if (typeof process !== 'undefined' && process.env?.npm_lifecycle_event === 'build') {
  const fs = await import('node:fs');
  for (const lm of LEAD_MAGNETS) {
    if (!fs.existsSync(`public${lm.archivo}`)) {
      console.warn(`[lead magnets] falta el archivo de "${lm.slug}": public${lm.archivo}`);
    }
  }
}
