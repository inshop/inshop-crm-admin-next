# API Config Admin

Next.js admin panel for API Config.

## Prerequisites

- Node.js 22+
- Yarn
- Running [inshop-crm-api-nest](../inshop-crm-api-nest) backend (or compatible API)

## Setup

```bash
yarn install
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
BACKEND_BASE_URL=http://localhost:4000
```

## Run

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## Generate API client

After the backend is running and exposes OpenAPI at `/api-json`:

```bash
yarn api-generate
```

## Tests

Unit, component, and API route tests use Vitest with MSW mocks (no backend required):

```bash
yarn test

# Watch mode
yarn test:watch

# Coverage
yarn test:coverage
```

E2E smoke tests use Playwright against the Next.js dev server (install browsers once):

```bash
npx playwright install chromium
yarn test:e2e
```

Playwright starts `yarn dev` automatically unless a server is already running on port 3000.

For full-stack testing, start the API and its Postgres database first — see the [API README](../inshop-crm-api-nest/README.md#tests).

CI runs `yarn test`, `yarn build`, and `yarn test:e2e`; see [`.github/workflows/test.yml`](.github/workflows/test.yml).
