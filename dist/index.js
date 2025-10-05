var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  achievements: () => achievements,
  achievementsRelations: () => achievementsRelations,
  insertAchievementSchema: () => insertAchievementSchema,
  insertMotifSchema: () => insertMotifSchema,
  insertPoiSchema: () => insertPoiSchema,
  insertUserAchievementSchema: () => insertUserAchievementSchema,
  insertUserMotifProgressSchema: () => insertUserMotifProgressSchema,
  insertUserPoiVisitSchema: () => insertUserPoiVisitSchema,
  insertUserSchema: () => insertUserSchema,
  motifs: () => motifs,
  motifsRelations: () => motifsRelations,
  pointsOfInterest: () => pointsOfInterest,
  pointsOfInterestRelations: () => pointsOfInterestRelations,
  userAchievements: () => userAchievements,
  userAchievementsRelations: () => userAchievementsRelations,
  userMotifProgress: () => userMotifProgress,
  userMotifProgressRelations: () => userMotifProgressRelations,
  userPoiVisits: () => userPoiVisits,
  userPoiVisitsRelations: () => userPoiVisitsRelations,
  users: () => users,
  usersRelations: () => usersRelations
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  telegramId: varchar("telegram_id").notNull().unique(),
  name: text("name").notNull(),
  birthDate: text("birth_date"),
  role: text("role").notNull(),
  avatarUrl: text("avatar_url"),
  totalPoints: integer("total_points").notNull().default(0),
  level: integer("level").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var motifs = pgTable("motifs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  legend: text("legend").notNull(),
  theme: jsonb("theme").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var pointsOfInterest = pgTable("points_of_interest", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  motifId: varchar("motif_id").notNull().references(() => motifs.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  quote: text("quote"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),
  order: integer("order").notNull(),
  radius: integer("radius").notNull().default(50),
  points: integer("points").notNull().default(10),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  iconUrl: text("icon_url"),
  condition: text("condition").notNull(),
  points: integer("points").notNull().default(50),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var userMotifProgress = pgTable("user_motif_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  motifId: varchar("motif_id").notNull().references(() => motifs.id, { onDelete: "cascade" }),
  currentPoiIndex: integer("current_poi_index").notNull().default(0),
  isCompleted: boolean("is_completed").notNull().default(false),
  points: integer("points").notNull().default(0),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at")
});
var userPoiVisits = pgTable("user_poi_visits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  poiId: varchar("poi_id").notNull().references(() => pointsOfInterest.id, { onDelete: "cascade" }),
  visitedAt: timestamp("visited_at").notNull().defaultNow(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 })
});
var userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  achievementId: varchar("achievement_id").notNull().references(() => achievements.id, { onDelete: "cascade" }),
  unlockedAt: timestamp("unlocked_at").notNull().defaultNow()
});
var usersRelations = relations(users, ({ many }) => ({
  motifProgress: many(userMotifProgress),
  poiVisits: many(userPoiVisits),
  achievements: many(userAchievements)
}));
var motifsRelations = relations(motifs, ({ many }) => ({
  pois: many(pointsOfInterest),
  userProgress: many(userMotifProgress)
}));
var pointsOfInterestRelations = relations(pointsOfInterest, ({ one, many }) => ({
  motif: one(motifs, {
    fields: [pointsOfInterest.motifId],
    references: [motifs.id]
  }),
  visits: many(userPoiVisits)
}));
var achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements)
}));
var userMotifProgressRelations = relations(userMotifProgress, ({ one }) => ({
  user: one(users, {
    fields: [userMotifProgress.userId],
    references: [users.id]
  }),
  motif: one(motifs, {
    fields: [userMotifProgress.motifId],
    references: [motifs.id]
  })
}));
var userPoiVisitsRelations = relations(userPoiVisits, ({ one }) => ({
  user: one(users, {
    fields: [userPoiVisits.userId],
    references: [users.id]
  }),
  poi: one(pointsOfInterest, {
    fields: [userPoiVisits.poiId],
    references: [pointsOfInterest.id]
  })
}));
var userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id]
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id]
  })
}));
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});
var insertMotifSchema = createInsertSchema(motifs).omit({
  id: true,
  createdAt: true
});
var insertPoiSchema = createInsertSchema(pointsOfInterest).omit({
  id: true,
  createdAt: true
});
var insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true
});
var insertUserMotifProgressSchema = createInsertSchema(userMotifProgress).omit({
  id: true,
  startedAt: true
});
var insertUserPoiVisitSchema = createInsertSchema(userPoiVisits).omit({
  id: true,
  visitedAt: true
});
var insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  unlockedAt: true
});

// server/db.ts
neonConfig.webSocketConstructor = ws;
if (process.env.NODE_ENV === "development") {
  neonConfig.pipelineConnect = false;
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var connectionString = process.env.DATABASE_URL.replace("?sslmode=disable", "");
var pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, and, desc } from "drizzle-orm";
var DbStorage = class {
  async getUser(id) {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }
  async getUserByTelegramId(telegramId) {
    const result = await db.select().from(users).where(eq(users.telegramId, telegramId)).limit(1);
    return result[0];
  }
  async createUser(user) {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }
  async updateUserPoints(userId, points) {
    await db.update(users).set({ totalPoints: points }).where(eq(users.id, userId));
  }
  async getAllMotifs() {
    return await db.select().from(motifs).where(eq(motifs.isActive, true));
  }
  async getMotif(id) {
    const result = await db.select().from(motifs).where(eq(motifs.id, id)).limit(1);
    return result[0];
  }
  async createMotif(motif) {
    const result = await db.insert(motifs).values(motif).returning();
    return result[0];
  }
  async getPoisByMotifId(motifId) {
    return await db.select().from(pointsOfInterest).where(eq(pointsOfInterest.motifId, motifId)).orderBy(pointsOfInterest.order);
  }
  async getPoi(id) {
    const result = await db.select().from(pointsOfInterest).where(eq(pointsOfInterest.id, id)).limit(1);
    return result[0];
  }
  async createPoi(poi) {
    const result = await db.insert(pointsOfInterest).values(poi).returning();
    return result[0];
  }
  async getAllAchievements() {
    return await db.select().from(achievements);
  }
  async createAchievement(achievement) {
    const result = await db.insert(achievements).values(achievement).returning();
    return result[0];
  }
  async getUserMotifProgress(userId, motifId) {
    const result = await db.select().from(userMotifProgress).where(and(
      eq(userMotifProgress.userId, userId),
      eq(userMotifProgress.motifId, motifId)
    )).limit(1);
    return result[0];
  }
  async createUserMotifProgress(progress) {
    const result = await db.insert(userMotifProgress).values(progress).returning();
    return result[0];
  }
  async updateUserMotifProgress(userId, motifId, currentPoiIndex, points) {
    await db.update(userMotifProgress).set({ currentPoiIndex, points }).where(and(
      eq(userMotifProgress.userId, userId),
      eq(userMotifProgress.motifId, motifId)
    ));
  }
  async completeMotif(userId, motifId) {
    await db.update(userMotifProgress).set({ isCompleted: true, completedAt: /* @__PURE__ */ new Date() }).where(and(
      eq(userMotifProgress.userId, userId),
      eq(userMotifProgress.motifId, motifId)
    ));
  }
  async createPoiVisit(visit) {
    const result = await db.insert(userPoiVisits).values(visit).returning();
    return result[0];
  }
  async getUserPoiVisits(userId) {
    return await db.select().from(userPoiVisits).where(eq(userPoiVisits.userId, userId)).orderBy(desc(userPoiVisits.visitedAt));
  }
  async getUserAchievements(userId) {
    const result = await db.select({ achievement: achievements }).from(userAchievements).innerJoin(achievements, eq(userAchievements.achievementId, achievements.id)).where(eq(userAchievements.userId, userId));
    return result.map((r) => r.achievement);
  }
  async unlockAchievement(userId, achievementId) {
    const result = await db.insert(userAchievements).values({ userId, achievementId }).returning();
    return result[0];
  }
  async getLeaderboard(limit = 10) {
    return await db.select().from(users).orderBy(desc(users.totalPoints)).limit(limit);
  }
};
var storage = new DbStorage();

// server/routes.ts
async function registerRoutes(app2) {
  app2.post("/api/users", async (req, res, next) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByTelegramId(validatedData.telegramId);
      if (existingUser) {
        return res.json(existingUser);
      }
      const user = await storage.createUser(validatedData);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/users/:telegramId", async (req, res, next) => {
    try {
      const user = await storage.getUserByTelegramId(req.params.telegramId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/motifs", async (req, res, next) => {
    try {
      const motifs2 = await storage.getAllMotifs();
      res.json(motifs2);
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/motifs/:id", async (req, res, next) => {
    try {
      const motif = await storage.getMotif(req.params.id);
      if (!motif) {
        return res.status(404).json({ message: "Motif not found" });
      }
      res.json(motif);
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/motifs/:motifId/pois", async (req, res, next) => {
    try {
      const pois = await storage.getPoisByMotifId(req.params.motifId);
      res.json(pois);
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/pois", async (req, res, next) => {
    try {
      const allMotifs = await storage.getAllMotifs();
      let allPois = [];
      for (const motif of allMotifs) {
        const pois = await storage.getPoisByMotifId(motif.id);
        allPois = allPois.concat(pois);
      }
      res.json(allPois);
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/pois/:id", async (req, res, next) => {
    try {
      const poi = await storage.getPoi(req.params.id);
      if (!poi) {
        return res.status(404).json({ message: "POI not found" });
      }
      res.json(poi);
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/progress", async (req, res, next) => {
    try {
      const validatedData = insertUserMotifProgressSchema.parse(req.body);
      const existingProgress = await storage.getUserMotifProgress(
        validatedData.userId,
        validatedData.motifId
      );
      if (existingProgress) {
        return res.json(existingProgress);
      }
      const progress = await storage.createUserMotifProgress(validatedData);
      res.status(201).json(progress);
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/progress/:userId/:motifId", async (req, res, next) => {
    try {
      const progress = await storage.getUserMotifProgress(
        req.params.userId,
        req.params.motifId
      );
      if (!progress) {
        return res.status(404).json({ message: "Progress not found" });
      }
      res.json(progress);
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/visits", async (req, res, next) => {
    try {
      const validatedData = insertUserPoiVisitSchema.parse(req.body);
      const visit = await storage.createPoiVisit(validatedData);
      const poi = await storage.getPoi(validatedData.poiId);
      if (!poi) {
        return res.status(404).json({ message: "POI not found" });
      }
      const progress = await storage.getUserMotifProgress(
        validatedData.userId,
        poi.motifId
      );
      if (progress) {
        const newPoints = progress.points + poi.points;
        const newIndex = progress.currentPoiIndex + 1;
        await storage.updateUserMotifProgress(
          validatedData.userId,
          poi.motifId,
          newIndex,
          newPoints
        );
        const user2 = await storage.getUser(validatedData.userId);
        if (user2) {
          await storage.updateUserPoints(
            validatedData.userId,
            user2.totalPoints + poi.points
          );
        }
        const allPois = await storage.getPoisByMotifId(poi.motifId);
        if (newIndex >= allPois.length) {
          await storage.completeMotif(validatedData.userId, poi.motifId);
        }
      }
      const allVisits = await storage.getUserPoiVisits(validatedData.userId);
      let user = await storage.getUser(validatedData.userId);
      const allAchievements = await storage.getAllAchievements();
      const userAchievements2 = await storage.getUserAchievements(validatedData.userId);
      const unlockedAchievementIds = new Set(userAchievements2.map((a) => a.id));
      let totalAchievementPoints = 0;
      for (const achievement of allAchievements) {
        if (unlockedAchievementIds.has(achievement.id)) {
          continue;
        }
        let shouldUnlock = false;
        switch (achievement.condition) {
          case "visit_first_poi":
            shouldUnlock = allVisits.length >= 1;
            break;
          case "visit_3_pois":
            shouldUnlock = allVisits.length >= 3;
            break;
          case "reach_500_points":
            shouldUnlock = !!(user && user.totalPoints >= 500);
            break;
          case "complete_hottabych":
            const hottabychProgress = await storage.getUserMotifProgress(
              validatedData.userId,
              poi.motifId
            );
            shouldUnlock = hottabychProgress?.isCompleted || false;
            break;
          case "visit_before_9am":
            const visitHour = new Date(visit.visitedAt).getHours();
            shouldUnlock = visitHour < 9;
            break;
        }
        if (shouldUnlock) {
          try {
            await storage.unlockAchievement(validatedData.userId, achievement.id);
            totalAchievementPoints += achievement.points;
          } catch (error) {
            console.error(`Failed to unlock achievement ${achievement.id}:`, error);
          }
        }
      }
      if (totalAchievementPoints > 0 && user) {
        await storage.updateUserPoints(
          validatedData.userId,
          user.totalPoints + totalAchievementPoints
        );
      }
      res.status(201).json(visit);
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/visits/:userId", async (req, res, next) => {
    try {
      const visits = await storage.getUserPoiVisits(req.params.userId);
      res.json(visits);
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/achievements", async (req, res, next) => {
    try {
      const achievements2 = await storage.getAllAchievements();
      res.json(achievements2);
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/achievements/:userId", async (req, res, next) => {
    try {
      const achievements2 = await storage.getUserAchievements(req.params.userId);
      res.json(achievements2);
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/achievements/:userId/:achievementId", async (req, res, next) => {
    try {
      const { userId, achievementId } = req.params;
      const userAchievement = await storage.unlockAchievement(userId, achievementId);
      res.status(201).json(userAchievement);
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/leaderboard", async (req, res, next) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const leaderboard = await storage.getLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      next(error);
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: "0.0.0.0",
    port: 5e3,
    strictPort: true,
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
