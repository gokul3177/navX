<div align="center">

# 🤖 NavX

### Pathfinding Algorithm Visualizer

[![React](https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

*An interactive, production-grade visualizer that brings pathfinding algorithms to life*

</div>

---

## ✨ Features

- **Interactive Grid** — Click and drag to place walls, and reposition start/end nodes in real-time.
- **4 Algorithms** — BFS, DFS, Dijkstra, and A* with animated, step-by-step visualization.
- **Maze Generation** — Instantly generate complex mazes using Recursive Backtracking.
- **Speed Control** — Adjust animation playback speed from slow-motion to instant.
- **Real-time Stats** — Live panel showing nodes explored, path length, and execution time.
- **History & Persistence** — Every simulation is saved to a cloud PostgreSQL database and displayed in a paginated history table, persisting across sessions.

---

## 🧠 Algorithms

| Algorithm | Weighted | Shortest Path | Time Complexity |
|-----------|----------|---------------|-----------------|
| **BFS** (Breadth-First Search) | ❌ | ✅ Guaranteed | O(V + E) |
| **DFS** (Depth-First Search) | ❌ | ❌ Not guaranteed | O(V + E) |
| **Dijkstra's** | ✅ | ✅ Guaranteed | O((V + E) log V) |
| **A\*** | ✅ | ✅ Guaranteed | O(E log V) |

> A* uses the **Manhattan distance** heuristic, giving it a targeted advantage over Dijkstra in grid-based environments.

---

## 🏗️ Architecture

```
NavX
├── Frontend (React + Vite)         → Vercel
│   ├── Algorithm execution          (client-side for instant animation)
│   ├── Interactive Grid UI
│   ├── Real-time Stats & History
│   └── REST API integration
│
├── Backend (Node.js + Express)     → Render
│   ├── POST /api/simulate           (save simulation result)
│   ├── GET  /api/history            (paginated history)
│   ├── GET  /api/history/stats      (aggregate per-algorithm stats)
│   ├── GET  /api/health             (health check)
│   ├── Rate limiting & CORS
│   └── Input validation (Joi)
│
└── Database (PostgreSQL)           → Render
    └── simulations table
```

### Folder Structure

```
navX/
├── server/                       # Backend (Node.js / Express)
│   ├── scripts/
│   │   ├── schema.sql            # PostgreSQL schema (run once)
│   │   └── migrate_sqlite_to_pg.js
│   └── src/
│       ├── config/               # DB pool, environment vars
│       ├── controllers/          # Route handlers
│       ├── middlewares/          # Error handling, rate limiting
│       ├── models/               # Raw database queries
│       ├── routes/               # Express routers
│       ├── services/             # Business logic
│       └── validation/           # Joi schemas
├── src/                          # Frontend (React + Vite)
│   ├── algorithms/               # BFS, DFS, Dijkstra, A*, Maze
│   ├── components/               # Grid, ControlPanel, Navbar, etc.
│   ├── hooks/                    # usePathfinder, custom logic
│   ├── services/                 # API fetch wrappers
│   └── styles/                   # CSS variables & global styles
├── vite.config.js
├── vercel.json                   # SPA routing for Vercel
└── render.yaml                   # Render Blueprint
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health, uptime, DB status |
| `GET` | `/api/algorithms` | List of supported algorithms |
| `POST` | `/api/simulate` | Save a simulation result |
| `GET` | `/api/history` | Paginated simulation history |
| `GET` | `/api/history/stats` | Aggregate stats by algorithm |

**POST `/api/simulate` — Request Body:**
```json
{
  "algorithm": "ASTAR",
  "gridSize": 20,
  "start": [0, 0],
  "goal": [19, 19],
  "obstacles": [[1,1], [1,2]],
  "path": [[0,0], "...", [19,19]],
  "visitedCount": 142,
  "pathLength": 38,
  "timeTaken": 12.5
}
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js v18+
- PostgreSQL (or use the SQLite fallback for local dev)

### 1. Clone & Install
```bash
git clone https://github.com/gokul3177/navX.git
cd navX

# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install
```

### 2. Configure Environment

**Root `.env` (Frontend):**
```env
VITE_API_URL=http://localhost:4000/api
```

**`server/.env` (Backend):**
```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@host:5432/dbname
ALLOWED_ORIGINS=http://localhost:3000
```

### 3. Initialize Database
```bash
# Apply the schema to your PostgreSQL instance
cd server
psql $DATABASE_URL < scripts/schema.sql
```

### 4. Run the App
```bash
# From the root directory — starts both frontend and backend concurrently
npm start
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000/api`

---

## ☁️ Deployment

### Backend → Render

1. Go to [Render Dashboard](https://dashboard.render.com/) → **New → Web Service**
2. Connect your GitHub repository (`gokul3177/navX`)
3. Set **Root Directory** to `server`
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`
6. Add environment variables:
   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `DATABASE_URL` | *(your Render PostgreSQL External URL)* |
   | `CORS_ORIGIN` | *(your Vercel frontend URL)* |
7. **First deployment**: Apply schema via the Render Shell:
   ```bash
   psql $DATABASE_URL < scripts/schema.sql
   ```

### Frontend → Vercel

1. Go to [Vercel Dashboard](https://vercel.com/) → **Add New → Project**
2. Import your GitHub repository (`gokul3177/navX`)
3. **Framework Preset:** Vite (auto-detected)
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`
6. Add environment variable:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | *(your Render backend URL + `/api`)* |
7. Deploy!

> **CI/CD:** Both platforms auto-redeploy on every push to the `main` branch.

---

## 🛡️ Engineering Highlights

- **Performance**: A* and Dijkstra use a binary Min-Heap `O(log n)` priority queue instead of a naive array, dramatically reducing search time on large grids.
- **React Optimization**: Grid rendering uses `useMemo` and `useCallback` to prevent expensive re-renders during high-frequency animation ticks.
- **Security**: Backend uses `helmet` (HTTP headers), `express-rate-limit` (abuse prevention), `cors` (origin whitelisting), and Joi schema validation on all inputs.
- **SOLID Architecture**: Controllers, services, models, and routes are fully decoupled — changes to the database layer require zero frontend changes.
- **Production Database**: PostgreSQL hosted on Render with indexed queries on `algorithm` and `created_at` columns for fast history retrieval.

---

## 📄 License

[MIT](LICENSE)

---

<div align="center">
  Built with ❤️ by <a href="https://github.com/gokul3177">Gokul</a>
</div>
