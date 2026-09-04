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
  /** Frase corta debajo del título. */
  bajada: string;
  /** Uno o dos párrafos que explican qué es y para quién. */
  descripcion: string;
  /** Qué se lleva quien lo descarga. Se muestra como lista. */
  puntos: string[];
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
