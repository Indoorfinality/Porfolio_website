# Anushna Chaulagain — Portfolio

Production portfolio for AI, automation, and data work.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + Lucide React
- React Three Fiber / Three.js (hero scene; optional Sketchfab `.glb`)
- Framer Motion + GSAP ScrollTrigger
- `/api/contact` (optional Resend)

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production

```bash
npm run build
npm start
```

### Deploy on Vercel

1. Push this repo to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Set env vars:
   - `NEXT_PUBLIC_SITE_URL` — your live URL
   - `RESEND_API_KEY` (optional) — for contact emails
   - `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL` (optional)

`vercel.json` is included for Next.js defaults.

## Content

Edit typed content in `src/data/`:

- `site.ts` — name, links, tagline, `heroModel` path
- `projects.ts` — work items
- `experience.ts` — roles
- `skills.ts` — skill groups

Drop a Sketchfab `.glb` at `public/models/hero.glb` to replace the procedural hero orb. On mobile / reduced-motion, a static gradient fallback is used instead of WebGL.
