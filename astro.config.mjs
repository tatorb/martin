// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://studiomrb.com',

  // El sitio sigue siendo estático. El adaptador está sólo para que las rutas
  // que se declaran con prerender = false, hoy únicamente /api/reserva, se
  // ejecuten como función de servidor en Vercel.
  adapter: vercel(),

  // La dirección que se comparte en la campaña lleva un punto. Como ruta de
  // archivo eso es problemático, así que la página vive en la versión con guion
  // y esta redirección atiende la otra. Se resuelve en la tabla de rutas, antes
  // de buscar en el sistema de archivos, así que el punto no molesta.
  redirects: {
    '/lm/packaging-market.report': '/lm/packaging-market-report',
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
