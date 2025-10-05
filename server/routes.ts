import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertUserMotifProgressSchema, insertUserPoiVisitSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/users", async (req, res, next) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByTelegramId(validatedData.telegramId);
      if (existingUser) {
        return res.json(existingUser);
      }

      const user = await storage.createUser(validatedData);
      res.status(201).json(user);
    } catch (error: any) {
      next(error);
    }
  });

  app.get("/api/users/:telegramId", async (req, res, next) => {
    try {
      const user = await storage.getUserByTelegramId(req.params.telegramId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      next(error);
    }
  });

  app.get("/api/motifs", async (req, res, next) => {
    try {
      const motifs = await storage.getAllMotifs();
      res.json(motifs);
    } catch (error: any) {
      next(error);
    }
  });

  app.get("/api/motifs/:id", async (req, res, next) => {
    try {
      const motif = await storage.getMotif(req.params.id);
      if (!motif) {
        return res.status(404).json({ message: "Motif not found" });
      }
      res.json(motif);
    } catch (error: any) {
      next(error);
    }
  });

  app.get("/api/motifs/:motifId/pois", async (req, res, next) => {
    try {
      const pois = await storage.getPoisByMotifId(req.params.motifId);
      res.json(pois);
    } catch (error: any) {
      next(error);
    }
  });

  app.get("/api/pois", async (req, res, next) => {
    try {
      const allMotifs = await storage.getAllMotifs();
      let allPois: any[] = [];
      for (const motif of allMotifs) {
        const pois = await storage.getPoisByMotifId(motif.id);
        allPois = allPois.concat(pois);
      }
      res.json(allPois);
    } catch (error: any) {
      next(error);
    }
  });

  app.get("/api/pois/:id", async (req, res, next) => {
    try {
      const poi = await storage.getPoi(req.params.id);
      if (!poi) {
        return res.status(404).json({ message: "POI not found" });
      }
      res.json(poi);
    } catch (error: any) {
      next(error);
    }
  });

  app.post("/api/progress", async (req, res, next) => {
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
    } catch (error: any) {
      next(error);
    }
  });

  app.get("/api/progress/:userId/:motifId", async (req, res, next) => {
    try {
      const progress = await storage.getUserMotifProgress(
        req.params.userId,
        req.params.motifId
      );
      if (!progress) {
        return res.status(404).json({ message: "Progress not found" });
      }
      res.json(progress);
    } catch (error: any) {
      next(error);
    }
  });

  app.post("/api/visits", async (req, res, next) => {
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

        const user = await storage.getUser(validatedData.userId);
        if (user) {
          await storage.updateUserPoints(
            validatedData.userId,
            user.totalPoints + poi.points
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
      const userAchievements = await storage.getUserAchievements(validatedData.userId);
      const unlockedAchievementIds = new Set(userAchievements.map(a => a.id));

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
    } catch (error: any) {
      next(error);
    }
  });

  app.get("/api/visits/:userId", async (req, res, next) => {
    try {
      const visits = await storage.getUserPoiVisits(req.params.userId);
      res.json(visits);
    } catch (error: any) {
      next(error);
    }
  });

  app.get("/api/achievements", async (req, res, next) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json(achievements);
    } catch (error: any) {
      next(error);
    }
  });

  app.get("/api/achievements/:userId", async (req, res, next) => {
    try {
      const achievements = await storage.getUserAchievements(req.params.userId);
      res.json(achievements);
    } catch (error: any) {
      next(error);
    }
  });

  app.post("/api/achievements/:userId/:achievementId", async (req, res, next) => {
    try {
      const { userId, achievementId } = req.params;
      const userAchievement = await storage.unlockAchievement(userId, achievementId);
      res.status(201).json(userAchievement);
    } catch (error: any) {
      next(error);
    }
  });

  app.get("/api/leaderboard", async (req, res, next) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const leaderboard = await storage.getLeaderboard(limit);
      res.json(leaderboard);
    } catch (error: any) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
