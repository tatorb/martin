/**
 * Prepara la URL de embed del video.
 *
 * El video ya trae los subtítulos incrustados en la imagen, así que hay que
 * evitar que YouTube encienda los suyos, o se ven los dos a la vez.
 *
 * Van dos cosas. cc_load_policy=0 desactiva los subtítulos que el que mira
 * tenga activados por preferencia. Y enablejsapi=1 habilita la API del
 * reproductor, que es lo único que apaga los automáticos, los que YouTube
 * genera solo. Eso se hace desde SinSubtitulos.astro.
 */
export function urlDeEmbed(url: string): string {
  if (!url) return '';

  const esYouTube = url.includes('youtube.com') || url.includes('youtube-nocookie.com');
  if (!esYouTube) return url;

  const separador = url.includes('?') ? '&' : '?';
  return `${url}${separador}cc_load_policy=0&enablejsapi=1`;
}
