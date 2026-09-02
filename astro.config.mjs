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

  vite: {
    plugins: [tailwindcss()],
  },
});
