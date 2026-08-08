# Apertura de Cuentas | Studio MRB

Landing page del servicio de Apertura de Cuentas. Sitio estático hecho con Astro y
Tailwind, sin dependencias externas en tiempo de ejecución.

## Correr el proyecto

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # genera dist/
npm run preview    # sirve dist/ para revisar el build
```

## Qué falta cargar para publicar

Todo se configura en un solo archivo, [`src/site.config.ts`](src/site.config.ts). Mientras
esos valores estén vacíos la página funciona igual, muestra un marco de reserva con la
instrucción en pantalla en lugar de un iframe roto.

| Variable | Qué va | Dónde impacta |
| --- | --- | --- |
| `VSL_EMBED_URL` | URL de **embed** del video, no la de la página del video | Sección 2, el VSL |
| `VSL_POSTER_URL` | Imagen de portada, opcional. Si la cargás, el video recién se descarga cuando alguien le da play | Sección 2 |
| `CALENDAR_EMBED_URL` | URL de embed de HubSpot Meetings, Calendly o Cal.com | Sección 6, la agenda |
| `FOUNDER_PHOTO_URL` | Foto de Martín, subida a `public/` | Sección 4 |

Formatos de embed:

- YouTube, `https://www.youtube-nocookie.com/embed/ID`
- Vimeo, `https://player.vimeo.com/video/ID`
- Loom, `https://www.loom.com/embed/ID`
- HubSpot Meetings, `https://meetings.hubspot.com/USUARIO?embed=true`
- Calendly, `https://calendly.com/USUARIO/reunion`

## Estructura de la página

Siete secciones, en este orden, una por componente en `src/components/`:

1. `Hero.astro`, encabezado con la promesa y la oferta
2. `Vsl.astro`, el video, con autoridad, problema y solución
3. `Casos.astro`, casos de éxito
4. `Fundador.astro`, presentación breve del fundador
5. `Sistema.astro`, las cuatro etapas, los plazos y qué incluye el programa
6. `Agenda.astro`, el calendario para agendar la reunión
7. `Faqs.astro`, preguntas frecuentes

Todos los CTA de la página apuntan al ancla `#agenda`, que es la sección 6.

## Contenido

El copy sale de la propuesta de trabajo de Apertura de Cuentas y de la presentación
institucional de Studio MRB. Los casos de éxito son cualitativos a propósito, no incluyen
métricas porque no hay cifras verificadas y publicables. Si más adelante querés sumarlas,
el lugar es el array `casos` en `src/components/Casos.astro`.

El copy sigue las reglas de voz de MRB, voseo argentino, sin guiones largos, sin negritas
en el texto que ve un prospecto y el resultado antes que el vehículo.

## Marca

Paleta monocroma, `#000000`, `#5B7382` como acento, `#CFCFCF` para bordes y fondos, y
blanco. Tipografía Urbanist, autohospedada vía `@fontsource-variable/urbanist`. Los tokens
están definidos en `src/styles/global.css`.

El logotipo es un lockup tipográfico armado en `src/components/Logo.astro`. Si tenés el
archivo original del isologo, reemplazá ese componente por la imagen y actualizá también
`public/logo-mrb.svg`, que se usa como favicon.

## Deploy

`npm run build` deja el sitio estático en `dist/`. Se puede publicar tal cual en Vercel,
Netlify o Cloudflare Pages, sin configuración adicional.
