# News Aggregator API

A lightweight REST API built with Node.js and Express that aggregates news from the sources.
Includes user-based topic preferences for delivering a personalized news feed.

Requirements

- Node.js >= 18 (the test runner checks this)

Features implemented
- User signup and login with password hashing (bcrypt) and JWT authentication.
- Persistent users stored in `data/users.json` (simple file store for the guided project).
- User preferences (GET/PUT) protected by JWT.
- `/news` endpoint that uses an external news provider when configured, otherwise returns mock news. Responses are cached in-memory for a configurable TTL.

Quick start

1. Install dependencies

```bash
npm install
```

2. Run tests

```bash
npm test
```

3. Run the server

```bash
# optional: set a strong JWT secret
JWT_SECRET="your-secret" node app.js
```

Project structure (important files)

- `app.js` — small wrapper that starts the server when run directly and exports the Express app (used by tests).
- `src/app.js` — main Express app wiring routes and middleware.
- `src/routes/*` — route definitions (`users.js`, `news.js`).
- `src/controllers/*` — controllers for auth, preferences, and news.
- `src/middleware/auth.js` — JWT authentication middleware.
- `src/models/userStore.js` — simple file-backed user persistence (`data/users.json`).
- `test/` — test suite (uses tap + supertest).

API endpoints

- POST /users/signup
  - Body: { name, email, password, preferences }
  - Creates or replaces a user (password will be hashed).

Authentication & registration

- POST /register
  - Body: { name, email, password, preferences }
  - Alias for `/users/signup` for assignment compatibility. Creates or replaces a user (password will be hashed with bcrypt).

- POST /login
  - Body: { email, password }
  - Alias for `/users/login`. Returns { token } on success. Use this token in Authorization: Bearer <token>.

User preferences

- GET /preferences
  - Requires Authorization header. Returns { preferences } for the authenticated user.

- PUT /preferences
  - Requires Authorization header. Body: { preferences: [ ... ] } — updates and persists preferences.

Legacy/route-names also available under /users

- POST /users/signup
- POST /users/login
- GET /users/preferences
- PUT /users/preferences

News

- GET /news
  - Requires Authorization header. Returns { news: [...] }.
  - If `GNEWS_API_KEY` is set the server will call GNews. Otherwise it will use a generic provider if `NEWS_API_URL` + `NEWS_API_KEY` are configured. If external calls fail or no provider is configured, the endpoint returns a small mock response (keeps tests stable).
  - Responses are cached in-memory for `NEWS_CACHE_TTL_SECONDS` seconds.

Environment variables

- `JWT_SECRET` — secret used to sign JWTs. Defaults to `dev-secret-change-me` if not set.
- `GNEWS_API_KEY` — GNews API key (preferred for GNews integration).
- `NEWS_API_URL` — optional generic news API base URL (e.g., `https://newsapi.org/v2/everything`).
- `NEWS_API_KEY` — key for the generic news API.
- `NEWS_CACHE_TTL_SECONDS` — cache TTL for news responses in seconds (default: 60).
- `PORT` — server port (default: 3000).

Notes and recommendations

- Passwords are hashed with `bcryptjs` before persistence.
- JWTs are stateless and signed with `jsonwebtoken`.
- Users are persisted to `data/users.json` using a simple file-backed store in `src/models/userStore.js`. For production replace this with a real DB (SQLite/Postgres).
- External requests use `axios` and include basic timeout/error handling; failures fall back to mock data.
- Add request validation (e.g., `express-validator` or `joi`) and centralized logging for production readiness.

Security notice

- `.env.example` is provided. Keep real secrets out of the repository. The repo includes `.env` currently — if you prefer I can remove it and keep only `.env.example` (recommended for public repos).

Development commands

```bash
npm install
npm test
node app.js
```

License

This project is for learning purposes.
