import express from "express";
import cors from "cors";

import config from "./config/env";
import { db, initializeDatabase } from "./db/database";
import { seedDatabase } from "./db/seed";
import { requestLogger } from "./middleware/requestLogger";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";
import userRoutes from "./routes/userRoutes";

// ---------------------------------------------------------------------------
// App setup
// ---------------------------------------------------------------------------

const app = express();

// ---------------------------------------------------------------------------
// Core middleware
// ---------------------------------------------------------------------------

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(requestLogger);

// ---------------------------------------------------------------------------
// Database initialisation
// ---------------------------------------------------------------------------

initializeDatabase();

try {
  const row = db.prepare("SELECT COUNT(*) AS count FROM users").get() as { count: number };
  if (!row || row.count === 0) {
    console.log("Empty database — running initial seed...");
    seedDatabase(config.seedCount);
  } else {
    console.log(`Database ready with ${row.count} users.`);
  }
} catch {
  console.warn("Database not ready — running seed...");
  seedDatabase(config.seedCount);
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

app.get("/", (_req, res) => {
  res.json({
    name: "Presight User Directory API",
    version: "1.0.0",
    endpoints: {
      users: "/api/users",
      facets: "/api/users/facets",
    },
  });
});

app.use("/api/users", userRoutes);

// ---------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------

app.use(notFound);
app.use(errorHandler);

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------

app.listen(config.port, "0.0.0.0", () => {
  console.log(`\x1b[36m[server]\x1b[0m Listening on http://localhost:${config.port} (${config.nodeEnv})`);
});
