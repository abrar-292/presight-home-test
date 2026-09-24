# Presight User Directory - Architecture & Running Instructions

This guide provides complete instructions for setup, running locally, database seeding, Docker deployment, architectural decisions, and detailed answers to the evaluation criteria.

---

## 1. Quick Start Guide

### Prerequisites
- **Node.js**: v18+ (tested on Node v20/v22)
- **npm**: v9+ (or Yarn / pnpm)
- **Docker & Docker Compose** (optional, for containerized execution)

---

### Option A: Running Locally with npm

#### 1. Install all dependencies
From the root workspace directory:
```bash
npm install
npm --prefix server install
npm --prefix client install
```

#### 2. Seed the Database
The database is SQLite (`server/data/presight.db`). You can seed it with 3,000 realistic records:
```bash
npm run seed
```
*(Note: If the database is missing on initial server startup, the server will also automatically initialize and seed it).*

#### 3. Start Both Server and Client
```bash
npm run dev
```
- **React Client**: [http://localhost:3000](http://localhost:3000)
- **Node API Server**: [http://localhost:5001](http://localhost:5001)

Or run them individually in separate terminals:
```bash
# Terminal 1: Backend API
npm run dev:server

# Terminal 2: Frontend Client
npm run dev:client
```

---

### Option B: Running with Docker Compose

To start both the client and server in production-ready containerized mode:

```bash
docker compose up --build
```

- **Client**: [http://localhost:3000](http://localhost:3000) (served via Nginx with API reverse proxy)
- **Server**: [http://localhost:5001](http://localhost:5001) (Express + SQLite with persistent volume in `./data`)

To stop:
```bash
docker compose down
```

---

## 2. Architecture & Data Model

### SQLite Schema (`server/src/db/schema.sql`)
The database schema uses a normalized relational model optimized for high-performance faceted search:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  avatar TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  nationality TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Unique hobbies table
CREATE TABLE IF NOT EXISTS hobbies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE COLLATE NOCASE
);

-- Junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS user_hobbies (
  user_id INTEGER NOT NULL,
  hobby_id INTEGER NOT NULL,
  PRIMARY KEY (user_id, hobby_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (hobby_id) REFERENCES hobbies(id) ON DELETE CASCADE
);

-- Optimized composite indexes
CREATE INDEX IF NOT EXISTS idx_users_first_name ON users(first_name COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_users_last_name ON users(last_name COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_users_nationality ON users(nationality COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_users_age ON users(age);
CREATE INDEX IF NOT EXISTS idx_user_hobbies_user_id ON user_hobbies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_hobbies_hobby_id ON user_hobbies(hobby_id);
CREATE INDEX IF NOT EXISTS idx_hobbies_name ON hobbies(name COLLATE NOCASE);
```

### Performance Optimizations
- **`better-sqlite3`**: Synchronous native bindings with zero event-loop overhead.
- **WAL Mode (`PRAGMA journal_mode = WAL`)**: Allows concurrent reads without blocking writes.
- **Normalized Junction Table**: Prevents JSON parsing overhead and allows fast index-backed joins for facet aggregations.

---

## 3. API Specification & Filter Semantics

### Endpoint: `GET /api/users`

#### Query Parameters:
| Parameter | Type | Description |
|---|---|---|
| `search` / `q` | `string` | Case-insensitive search across `first_name` and `last_name` |
| `nationalities` / `nat` | `string` | Comma-separated list of nationalities (**OR** logic) |
| `hobbies` / `hob` | `string` | Comma-separated list of hobbies (**AND** logic) |
| `sortField` | `string` | One of `first_name`, `last_name`, `age`, `nationality` |
| `sortOrder` | `string` | `asc` or `desc` |
| `page` | `number` | Page number (default `1`) |
| `limit` | `number` | Page size (default `24`) |

#### Filter Logic Implemented:
1. **Text Search**:
   ```sql
   (u.first_name LIKE ? OR u.last_name LIKE ? OR (u.first_name || ' ' || u.last_name) LIKE ?)
   ```
2. **Nationalities (OR Logic)**:
   ```sql
   u.nationality IN (?, ?, ...)
   ```
3. **Hobbies (AND Logic)**:
   Matches users who have *all* selected hobbies:
   ```sql
   u.id IN (
     SELECT uh.user_id
     FROM user_hobbies uh
     JOIN hobbies h ON uh.hobby_id = h.id
     WHERE LOWER(h.name) IN (LOWER(?), LOWER(?))
     GROUP BY uh.user_id
     HAVING COUNT(DISTINCT uh.hobby_id) = ?
   )
   ```
4. **Dynamic Top 20 Facets Calculation**:
   Top 20 hobbies and nationalities are computed dynamically against the **active filtered user dataset**, ensuring facet counts accurately reflect the current search results.
5. **Deterministic Sorting**:
   ```sql
   ORDER BY u.${sortField} ${sortOrder}, u.id ASC
   ```

---

## 4. Frontend Implementation Highlights

- **Framework**: React 19 + TypeScript + Vite.
- **Styling**: Tailwind CSS v4 + Modular SCSS (`src/styles/custom.scss`) for custom card animations and scrollbars.
- **Strict User Card Layout**:
  ```text
  |----------------------------------|
  | avatar      first_name+last_name |
  |             nationality      age |
  |                                  |
  |             (2 hobbies) (+n)     |
  |----------------------------------|
  ```
  - Displays up to 2 hobby badges.
  - Remaining hobbies displayed with interactive `+n` pill and popover.
- **Smooth Virtualized Infinite Scroll**:
  - Implemented using `@tanstack/react-virtual`.
  - Dynamic responsive column layout (1 col on mobile, 2 cols on tablet, 3 cols on desktop).
  - Automatically fetches the next page when the user scrolls near the end of the loaded items.
- **URL-Synchronized State**:
  - `q`, `nat`, `hob`, `sort`, and `order` are synchronized with URL query params.
  - Deep-linking and browser back/forward navigation preserve state perfectly.
- **Loading, Empty, & Error States**:
  - Animated skeleton cards on initial load.
  - Friendly empty state with "Clear all filters" button.
  - Error state with "Try Again" retry action.

---

## 5. Evaluation Focus Answers & Future Production Enhancements

### 1. Correct Data Persistence and API Behavior
- **Current Approach**: Normalized SQLite with WAL mode, foreign keys, cascade deletes, and transaction-wrapped batch inserts.
- **Further Scaling**: In a massive production deployment, migrate to PostgreSQL or distributed SQLite (such as Turso / libSQL or LiteFS) with read replicas.

### 2. Correct Filtering, Sorting, Pagination, and Top 20 Counts
- **Faceted Search Semantics**: Multi-hobby is strictly **AND** (users must have all selected hobbies), while multi-nationality is **OR** (users from any selected nationality).
- **Facet Scoping**: Aggregations use the same `WHERE` predicate as the main query so that facet counts reflect active filters in real-time.
- **Determinism**: Sorting uses `id ASC` as a secondary tie-breaker so pagination never produces duplicate or missing rows.
- **Full-Text Search (FTS)**: For millions of users, SQLite `FTS5` extension or Elasticsearch / Meilisearch can be used for typo tolerance and phonetic matching.

### 3. Smooth Infinite Scrolling with Virtualization
- **Current Approach**: `@tanstack/react-virtual` with dynamic window resize observer and element measurement, preventing DOM bloat even with 100,000+ items.
- **Optimizations**: `overscan: 5` prevents blank flickers during rapid scrolling.

### 4. URL-Synced State
- **Current Approach**: Custom `useUrlFilters` hook built on `useSearchParams`, providing immediate URL serialization without full-page reloads.

### 5. Local and Docker-Based Setup
- **Current Approach**: Single-command `docker compose up --build` with Nginx reverse proxy and persistent SQLite volume.
