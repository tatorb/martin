/**
 * Prepara la URL de embed del video.
 *
 * Van varias cosas.
 *
 * El video ya trae los subtítulos incrustados en la imagen, así que hay que
 * evitar que YouTube encienda los suyos, o se ven los dos a la vez.
 * cc_load_policy=0 desactiva los subtítulos que el que mira tenga activados
 * por preferencia. Y enablejsapi=1 habilita la API del reproductor, que es lo
 * único que apaga los automáticos, los que YouTube genera solo. Eso se hace
 * desde Reproductor.astro.
 *
 * Y arranca solo. Todos los navegadores bloquean la reproducción automática
 * con sonido, así que la única forma de que empiece sin que nadie toque nada
 * es que empiece en silencio: de ahí mute=1. El botón para activar el sonido
 * también lo pone Reproductor.astro. playsinline=1 evita que en el iPhone el
 * video se apodere de toda la pantalla al arrancar.
 */
export function urlDeEmbed(url: string): string {
  if (!url) return '';

  const esYouTube = url.includes('youtube.com') || url.includes('youtube-nocookie.com');
  if (!esYouTube) return url;

  const separador = url.includes('?') ? '&' : '?';
  return `${url}${separador}cc_load_policy=0&enablejsapi=1&autoplay=1&mute=1&playsinline=1`;
}
