/**
 * Prepara la URL de embed del video.
 *
 * El video ya trae los subtítulos incrustados en la imagen, así que hay que
 * pedirle a YouTube que no encienda los suyos, o se ven los dos a la vez.
 * El parámetro es cc_load_policy=0.
 *
 * Ojo, YouTube no lo garantiza. Si el que mira tiene los subtítulos siempre
 * activados en su propia cuenta, esa preferencia gana sobre el parámetro.
 */
export function urlDeEmbed(url: string): string {
  if (!url) return '';

  const esYouTube = url.includes('youtube.com') || url.includes('youtube-nocookie.com');
  if (!esYouTube) return url;

  const separador = url.includes('?') ? '&' : '?';
  return `${url}${separador}cc_load_policy=0`;
}
