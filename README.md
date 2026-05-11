# GitReview

Purpose-built pull request review UI (see `PRD.md` and `ARCHITECTURE.md`).

## Setup

1. Copy `.env.example` to `.env.local` and fill in values.
2. `pnpm install`
3. `pnpm db:push` (or run migrations) against your Postgres database.
4. `pnpm dev` (or `pnpm dev:lan` if you open the app from another device on your network — see below)

### GitHub OAuth on your local network

GitHub checks the **authorization callback URL** exactly. If you visit the app as `http://192.168.x.x:3000` but only registered `http://localhost:3000/...` in GitHub, the callback fails.

1. **GitHub → Settings → Developer settings → OAuth Apps → your app**
   - **Homepage URL:** e.g. `http://192.168.1.10:3000` (the URL you actually use in the browser).
   - **Authorization callback URL:** add **one entry per origin** you use, for example:
     - `http://localhost:3000/api/auth/callback/github`
     - `http://192.168.1.10:3000/api/auth/callback/github` (replace with your machine’s LAN IP)

2. **`.env` / `.env.local`** — use the **same** origin as in the address bar:

   ```env
   NEXTAUTH_URL=http://192.168.1.10:3000
   NEXT_PUBLIC_APP_URL=http://192.168.1.10:3000
   ```

3. **Listen on all interfaces** so phones / other PCs can reach the dev server:

   ```bash
   pnpm dev:lan
   ```

4. Restart `pnpm dev` / `pnpm dev:lan` after changing env vars.

If you switch between **localhost** and **LAN IP**, keep **both** callback URLs in GitHub and align `NEXTAUTH_URL` with whichever URL you are using for that session.

### Dashboard: “Sign in to load pull requests” while already signed in

On **HTTPS** (e.g. Vercel), the session cookie name is `__Secure-authjs.session-token`. Server-side `getToken()` must use the matching **secure cookie** mode, or it cannot read the JWT and the GitHub token is missing. This is fixed in `getGitHubAccessTokenFromCookies()`; redeploy after pulling the latest code.

For a quick compile without real secrets (e.g. CI):

```bash
SKIP_ENV_VALIDATION=1 DATABASE_URL=postgresql://localhost:5432/x NEXTAUTH_SECRET=x NEXTAUTH_URL=http://localhost:3000 NEXT_PUBLIC_APP_URL=http://localhost:3000 GITHUB_CLIENT_ID=x GITHUB_CLIENT_SECRET=x GEMINI_API_KEY=x pnpm build
```

## Scripts

| Script          | Description                |
| --------------- | -------------------------- |
| `pnpm dev`      | Next.js dev (Turbopack, localhost only) |
| `pnpm dev:lan`  | Same, bound to `0.0.0.0` for LAN devices |
| `pnpm build`    | Production build           |
| `pnpm lint`     | ESLint                     |
| `pnpm typecheck`| TypeScript                 |
| `pnpm db:generate` | Drizzle SQL migrations |
| `pnpm db:push`  | Push schema (dev)          |
