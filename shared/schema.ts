import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  telegramId: varchar("telegram_id").notNull().unique(),
  name: text("name").notNull(),
  birthDate: text("birth_date"),
  role: text("role").notNull(),
  avatarUrl: text("avatar_url"),
  totalPoints: integer("total_points").notNull().default(0),
  level: integer("level").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const motifs = pgTable("motifs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  legend: text("legend").notNull(),
  theme: jsonb("theme").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const pointsOfInterest = pgTable("points_of_interest", {
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
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  iconUrl: text("icon_url"),
  condition: text("condition").notNull(),
  points: integer("points").notNull().default(50),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userMotifProgress = pgTable("user_motif_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  motifId: varchar("motif_id").notNull().references(() => motifs.id, { onDelete: "cascade" }),
  currentPoiIndex: integer("current_poi_index").notNull().default(0),
  isCompleted: boolean("is_completed").notNull().default(false),
  points: integer("points").notNull().default(0),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const userPoiVisits = pgTable("user_poi_visits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  poiId: varchar("poi_id").notNull().references(() => pointsOfInterest.id, { onDelete: "cascade" }),
  visitedAt: timestamp("visited_at").notNull().defaultNow(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
});

export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  achievementId: varchar("achievement_id").notNull().references(() => achievements.id, { onDelete: "cascade" }),
  unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  motifProgress: many(userMotifProgress),
  poiVisits: many(userPoiVisits),
  achievements: many(userAchievements),
}));

export const motifsRelations = relations(motifs, ({ many }) => ({
  pois: many(pointsOfInterest),
  userProgress: many(userMotifProgress),
}));

export const pointsOfInterestRelations = relations(pointsOfInterest, ({ one, many }) => ({
  motif: one(motifs, {
    fields: [pointsOfInterest.motifId],
    references: [motifs.id],
  }),
  visits: many(userPoiVisits),
}));

export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}));

export const userMotifProgressRelations = relations(userMotifProgress, ({ one }) => ({
  user: one(users, {
    fields: [userMotifProgress.userId],
    references: [users.id],
  }),
  motif: one(motifs, {
    fields: [userMotifProgress.motifId],
    references: [motifs.id],
  }),
}));

export const userPoiVisitsRelations = relations(userPoiVisits, ({ one }) => ({
  user: one(users, {
    fields: [userPoiVisits.userId],
    references: [users.id],
  }),
  poi: one(pointsOfInterest, {
    fields: [userPoiVisits.poiId],
    references: [pointsOfInterest.id],
  }),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertMotifSchema = createInsertSchema(motifs).omit({
  id: true,
  createdAt: true,
});

export const insertPoiSchema = createInsertSchema(pointsOfInterest).omit({
  id: true,
  createdAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true,
});

export const insertUserMotifProgressSchema = createInsertSchema(userMotifProgress).omit({
  id: true,
  startedAt: true,
});

export const insertUserPoiVisitSchema = createInsertSchema(userPoiVisits).omit({
  id: true,
  visitedAt: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  unlockedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMotif = z.infer<typeof insertMotifSchema>;
export type Motif = typeof motifs.$inferSelect;

export type InsertPoi = z.infer<typeof insertPoiSchema>;
export type Poi = typeof pointsOfInterest.$inferSelect;

export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;

export type InsertUserMotifProgress = z.infer<typeof insertUserMotifProgressSchema>;
export type UserMotifProgress = typeof userMotifProgress.$inferSelect;

export type InsertUserPoiVisit = z.infer<typeof insertUserPoiVisitSchema>;
export type UserPoiVisit = typeof userPoiVisits.$inferSelect;

export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;
