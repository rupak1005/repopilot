# RepoPilot

**Live:** [https://repopilot-pi.vercel.app](https://repopilot-pi.vercel.app)

Home page for **RepoPilot**, an engineering intelligence product: a local AST/graph of architecture, dependencies, Git history, and pull requests. Answers with evidence, not speculation.

Interactive panels on the page are a **demo fixture** from a local graph, not a live parse. There are no fake testimonials, logos, or user counts.

## Run

```bash
npm install
npm run dev
```

Build: `npm run build` then `npm run preview`.

## Waitlist

**Get started** opens a waitlist. Emails are stored in this browser. To collect them for real, set `VITE_FORMSPREE_ID` to a [Formspree](https://formspree.io) form id.

## Deploy

Production: [https://repopilot-pi.vercel.app](https://repopilot-pi.vercel.app)

Static Vite app. The GitHub repo is connected to Vercel, so pushes to `main` deploy automatically. After changing the production domain, update `index.html` (`canonical`, `og:url`, `og:image`), `public/robots.txt`, and `public/sitemap.xml`.

## Decisions

See [DECISIONS.md](./DECISIONS.md).
