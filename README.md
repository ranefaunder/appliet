# App Studo

Build, remix and share apps in minutes.

App Studo is a platform where anyone can create small personal apps without traditional software development. Describe what you need, use the app immediately, edit it later, share it, or remix community apps.

## Stack

Same architecture as [Cuukbuuk](../cuukbuuk):

- **Runtime:** Bun
- **UI:** Preact + Signals + htm
- **Routing:** preact-iso (SSR + SPA)
- **Database:** SQLite (`bun:sqlite`)
- **Auth:** Email login codes + session cookies
- **Styling:** Faunder UI

## Development

```bash
# Install Bun: https://bun.sh
bun install
cp .env.example .env
bun run dev
```

Open http://localhost:8040

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Dev server with hot reload (port 8040) |
| `bun run start` | Production server |
| `bun test` | Unit tests |
| `bun run test:e2e` | Playwright E2E tests |

## Project structure

```
appstudo/
├── app/              # Preact client (routes, components, stores)
├── server/           # Bun server (API, SSR, database)
├── utils/            # Shared utilities
├── types/            # TypeScript types
├── i18n/             # Translations
├── static/           # CSS, images, fonts
└── test/             # Unit + E2E tests
```

## Current status

This is the initial scaffold:

- Landing page with product vision
- App creation prompt (creates draft app in database)
- Explore gallery (public apps)
- My apps (user's apps)
- Auth (register + login code)
- App runtime view (placeholder)

Next steps: AI app generation, in-platform app runtime, remix, publishing, version history.
