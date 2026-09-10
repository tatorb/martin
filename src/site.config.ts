/**
 * Configuración de la landing.
 *
 * Este es el único archivo que hace falta tocar para poner la página en producción.
 * Mientras VSL_EMBED_URL y CALENDAR_EMBED_URL estén vacíos, las secciones 2 y 6
 * muestran un marco de reserva con la instrucción a la vista, no un iframe roto.
 */

/**
 * URL de embed del VSL (no la URL de la página del video).
 *
 *   YouTube  ->  https://www.youtube-nocookie.com/embed/ID_DEL_VIDEO
 *   Vimeo    ->  https://player.vimeo.com/video/ID_DEL_VIDEO
 *   Loom     ->  https://www.loom.com/embed/ID_DEL_VIDEO
 */
export const VSL_EMBED_URL = 'https://www.youtube-nocookie.com/embed/OUzXlHylp60';

/**
 * Imagen de portada del video, opcional. Se muestra mientras el VSL no está cargado.
 * Ruta relativa a /public, por ejemplo '/vsl-poster.jpg'.
 */
export const VSL_POSTER_URL = '';

/**
 * URL de embed del calendario. Hoy, la página de citas de Google Calendar.
 *
 *   Google Calendar  ->  https://calendar.google.com/calendar/appointments/schedules/ID?gv=true
 *   HubSpot Meetings ->  https://meetings.hubspot.com/USUARIO?embed=true
 *   Calendly         ->  https://calendly.com/USUARIO/reunion
 *   Cal.com          ->  https://cal.com/USUARIO/reunion
 */
export const CALENDAR_EMBED_URL =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ3j8YnCOwIEJfKZSVPEpJ83figEEplUbkSf7Ku2rDUrbKyhFs3BBD-XUnyRkoHq-56cRQ8APCcs?gv=true';

/**
 * Alto del iframe del calendario, en píxeles.
 *
 * El scroll que aparece dentro del calendario es del contenido de Google, y no
 * se puede tocar desde acá: es otro dominio. Lo único que lo hace desaparecer
 * es darle al iframe más alto que el que ocupa su contenido.
 *
 * Van dos valores porque el ancho cambia mucho el alto que hace falta. En un
 * teléfono Google apila el mes y la lista de horarios uno debajo del otro, así
 * que necesita bastante más.
 *
 * Si sobra blanco abajo, bajalos. Si vuelve a aparecer el scroll, subilos.
 */
export const CALENDAR_HEIGHT = 1150;
export const CALENDAR_HEIGHT_MOBILE = 1600;

/** Foto del fundador. Ruta relativa a /public. El original sin comprimir queda
 * en src/assets, fuera del build. */
export const FOUNDER_PHOTO_URL = '/martin.webp';

export const CONTACT = {
  name: 'Martín Rodriguez Brusco',
  role: 'Executive Director',
  email: 'martin@studiomrb.com',
  phone: '+54 9 351 5925185',
  phoneHref: '+5493515925185',
  site: 'https://studiomrb.com',
  linkedin: '',
} as const;

export const SEO = {
  title: 'Apertura de Cuentas | Studio MRB',
  description:
    'Reuniones con los decisores de las empresas que te importan, todas las semanas, ' +
    'sin depender de referidos. Studio MRB opera el sistema completo por vos.',
  ogImage: '/og.png',
} as const;

/**
 * Foto de fondo del hero, debajo del degradé oscuro.
 *
 * Alcanza con dejar el archivo en public/ llamado "hero", con cualquiera de
 * estas extensiones. Se usa la primera que exista, en este orden. Si no hay
 * ninguna, el hero muestra sólo el degradé.
 */
export const HERO_BG_CANDIDATOS = ['/hero.webp', '/hero.jpg', '/hero.jpeg', '/hero.png'];
