# Doclab — Hospital Admin Portal

A hospital management portal with a **React + MUI** frontend (`client/`) and a
**Node/Express + MongoDB** REST API (`server/`). JWT auth, bcrypt-hashed
passwords. In production the Express server also serves the built React app, so
the whole thing runs as a single web service.

## Prerequisites

- **Node.js** 18+ and npm
- A **MongoDB** connection string (e.g. MongoDB Atlas)

## 1. Install dependencies

From this `Hospital/` folder:

```bash
npm run install:all
```

This installs the root, `server/`, and `client/` dependencies in one go.

## 2. Configure environment variables

Create `server/.env` with:

```bash
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<any-long-random-string>
# PORT is optional — defaults to 3094. Leave unset on hosts like Render.
```

The server refuses to start if `MONGO_URI` or `JWT_SECRET` is missing.

## 3. Run in development

From this `Hospital/` folder:

```bash
npm run dev
```

This starts both servers together:

- **API** — http://localhost:3094
- **Web (Vite)** — http://localhost:8125

Open **http://localhost:8125**. The Vite dev server proxies `/api` requests to
the backend, so the frontend uses same-origin relative URLs.

> Run them separately instead, if you prefer:
> ```bash
> npm --prefix server run dev   # API only (auto-reload)
> npm --prefix client run dev   # Web only
> ```

## 4. Production build & run

```bash
npm run build --prefix client   # builds the SPA into client/dist
npm start                       # starts the Express server (serves API + SPA)
```

Then open the server URL (default **http://localhost:3094**) — Express serves
both the API at `/api/*` and the built React app for everything else.

## Deploying to Render (single web service)

The app is already deployed on Render as one web service. Use these settings:

| Setting | Value |
| --- | --- |
| **Root Directory** | `Hospital` |
| **Build Command** | `npm install --prefix server && npm install --include=dev --prefix client && npm run build --prefix client` |
| **Start Command** | `node server/index.js` |
| **Instance Type** | Free |

Add environment variables `MONGO_URI` and `JWT_SECRET` in the Render dashboard.
**Do not set `PORT`** — Render injects it automatically.

## Project structure

```
Hospital/
├── client/        React + MUI + Vite frontend
│   └── src/
├── server/        Express REST API (MongoDB, JWT)
│   ├── routes/    /api/auth, /api/hospitals, /api/users
│   └── index.js   App entry point (also serves client/dist in prod)
└── package.json   Root scripts (dev / start / install:all)
```
