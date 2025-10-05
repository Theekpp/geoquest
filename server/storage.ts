import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import type {
  User, InsertUser,
  Motif, InsertMotif,
  Poi, InsertPoi,
  Achievement, InsertAchievement,
  UserMotifProgress, InsertUserMotifProgress,
  UserPoiVisit, InsertUserPoiVisit,
  UserAchievement, InsertUserAchievement
} from "@shared/schema";
import {
  users,
  motifs,
  pointsOfInterest,
  achievements,
  userMotifProgress,
  userPoiVisits,
  userAchievements
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByTelegramId(telegramId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(userId: string, points: number): Promise<void>;
  
  getAllMotifs(): Promise<Motif[]>;
  getMotif(id: string): Promise<Motif | undefined>;
  createMotif(motif: InsertMotif): Promise<Motif>;
  
  getPoisByMotifId(motifId: string): Promise<Poi[]>;
  getPoi(id: string): Promise<Poi | undefined>;
  createPoi(poi: InsertPoi): Promise<Poi>;
  
  getAllAchievements(): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  
  getUserMotifProgress(userId: string, motifId: string): Promise<UserMotifProgress | undefined>;
  createUserMotifProgress(progress: InsertUserMotifProgress): Promise<UserMotifProgress>;
  updateUserMotifProgress(userId: string, motifId: string, currentPoiIndex: number, points: number): Promise<void>;
  completeMotif(userId: string, motifId: string): Promise<void>;
  
  createPoiVisit(visit: InsertUserPoiVisit): Promise<UserPoiVisit>;
  getUserPoiVisits(userId: string): Promise<UserPoiVisit[]>;
  
  getUserAchievements(userId: string): Promise<Achievement[]>;
  unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement>;
  
  getLeaderboard(limit?: number): Promise<User[]>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByTelegramId(telegramId: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.telegramId, telegramId)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUserPoints(userId: string, points: number): Promise<void> {
    await db.update(users)
      .set({ totalPoints: points })
      .where(eq(users.id, userId));
  }

  async getAllMotifs(): Promise<Motif[]> {
    return await db.select().from(motifs).where(eq(motifs.isActive, true));
  }

  async getMotif(id: string): Promise<Motif | undefined> {
    const result = await db.select().from(motifs).where(eq(motifs.id, id)).limit(1);
    return result[0];
  }

  async createMotif(motif: InsertMotif): Promise<Motif> {
    const result = await db.insert(motifs).values(motif).returning();
    return result[0];
  }

  async getPoisByMotifId(motifId: string): Promise<Poi[]> {
    return await db.select()
      .from(pointsOfInterest)
      .where(eq(pointsOfInterest.motifId, motifId))
      .orderBy(pointsOfInterest.order);
  }

  async getPoi(id: string): Promise<Poi | undefined> {
    const result = await db.select().from(pointsOfInterest).where(eq(pointsOfInterest.id, id)).limit(1);
    return result[0];
  }

  async createPoi(poi: InsertPoi): Promise<Poi> {
    const result = await db.insert(pointsOfInterest).values(poi).returning();
    return result[0];
  }

  async getAllAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements);
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const result = await db.insert(achievements).values(achievement).returning();
    return result[0];
  }

  async getUserMotifProgress(userId: string, motifId: string): Promise<UserMotifProgress | undefined> {
    const result = await db.select()
      .from(userMotifProgress)
      .where(and(
        eq(userMotifProgress.userId, userId),
        eq(userMotifProgress.motifId, motifId)
      ))
      .limit(1);
    return result[0];
  }

  async createUserMotifProgress(progress: InsertUserMotifProgress): Promise<UserMotifProgress> {
    const result = await db.insert(userMotifProgress).values(progress).returning();
    return result[0];
  }

  async updateUserMotifProgress(userId: string, motifId: string, currentPoiIndex: number, points: number): Promise<void> {
    await db.update(userMotifProgress)
      .set({ currentPoiIndex, points })
      .where(and(
        eq(userMotifProgress.userId, userId),
        eq(userMotifProgress.motifId, motifId)
      ));
  }

  async completeMotif(userId: string, motifId: string): Promise<void> {
    await db.update(userMotifProgress)
      .set({ isCompleted: true, completedAt: new Date() })
      .where(and(
        eq(userMotifProgress.userId, userId),
        eq(userMotifProgress.motifId, motifId)
      ));
  }

  async createPoiVisit(visit: InsertUserPoiVisit): Promise<UserPoiVisit> {
    const result = await db.insert(userPoiVisits).values(visit).returning();
    return result[0];
  }

  async getUserPoiVisits(userId: string): Promise<UserPoiVisit[]> {
    return await db.select()
      .from(userPoiVisits)
      .where(eq(userPoiVisits.userId, userId))
      .orderBy(desc(userPoiVisits.visitedAt));
  }

  async getUserAchievements(userId: string): Promise<Achievement[]> {
    const result = await db.select({ achievement: achievements })
      .from(userAchievements)
      .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
      .where(eq(userAchievements.userId, userId));
    return result.map(r => r.achievement);
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement> {
    const result = await db.insert(userAchievements).values({ userId, achievementId }).returning();
    return result[0];
  }

  async getLeaderboard(limit: number = 10): Promise<User[]> {
    return await db.select()
      .from(users)
      .orderBy(desc(users.totalPoints))
      .limit(limit);
  }
}

export const storage = new DbStorage();
