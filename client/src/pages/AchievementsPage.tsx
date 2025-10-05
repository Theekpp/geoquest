import AchievementCard from "@/components/AchievementCard";
import ProgressBar from "@/components/ProgressBar";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Loader2 } from "lucide-react";
import type { Achievement } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

const achievementIcons: Record<string, string> = {
  visit_first_poi: "🎯",
  visit_3_pois: "🗺️",
  complete_hottabych: "👑",
  reach_500_points: "✨",
  visit_before_9am: "🌅",
};

export default function AchievementsPage() {
  const { user, isLoading: isUserLoading } = useCurrentUser();
  
  const { data: allAchievements, isLoading: isAllAchievementsLoading } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
  });

  const { data: userAchievements, isLoading: isUserAchievementsLoading } = useQuery<any[]>({
    queryKey: user ? [`/api/achievements/${user.id}`] : [],
    enabled: !!user,
  });

  const isLoading = isUserLoading || isAllAchievementsLoading || isUserAchievementsLoading;

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" data-testid="loader-achievements" />
      </div>
    );
  }

  const unlockedAchievementIds = new Set(userAchievements?.map((ua: any) => ua.id) || []);
  
  const achievementsWithStatus = (allAchievements || []).map(achievement => {
    const isUnlocked = unlockedAchievementIds.has(achievement.id);
    const userAchievement = userAchievements?.find((ua: any) => ua.id === achievement.id);
    
    let unlockedAt = null;
    if (isUnlocked && userAchievement) {
      try {
        const unlockedDate = new Date(userAchievement.unlockedAt || userAchievement.createdAt);
        unlockedAt = formatDistanceToNow(unlockedDate, { addSuffix: true, locale: ru });
      } catch (e) {
        unlockedAt = "недавно";
      }
    }

    return {
      id: achievement.id,
      title: achievement.name,
      description: achievement.description,
      icon: achievementIcons[achievement.condition] || "🏆",
      unlocked: isUnlocked,
      unlockedAt,
    };
  });

  const unlockedCount = achievementsWithStatus.filter(a => a.unlocked).length;
  const totalCount = achievementsWithStatus.length;

  return (
    <div className="h-full w-full overflow-y-auto pb-24">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            Достижения
          </h1>
          <p className="text-sm text-muted-foreground">
            Отслеживайте свой прогресс и получайте награды
          </p>
        </div>

        {/* Progress Summary */}
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Общий прогресс</h3>
                <p className="text-2xl font-bold text-foreground" data-testid="text-progress">
                  {unlockedCount} из {totalCount}
                </p>
              </div>
              <div className="text-5xl">🏆</div>
            </div>
            
            <ProgressBar 
              current={unlockedCount}
              max={totalCount}
            />
          </div>
        </Card>

        {/* Achievements Grid */}
        <div className="space-y-3">
          <h2 className="font-semibold text-lg text-foreground">Все достижения</h2>
          
          {achievementsWithStatus.length > 0 ? (
            achievementsWithStatus.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                id={achievement.id}
                title={achievement.title}
                description={achievement.description}
                icon={achievement.icon}
                unlocked={achievement.unlocked}
                unlockedAt={achievement.unlockedAt || undefined}
              />
            ))
          ) : (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground" data-testid="text-no-achievements">
                Пока нет достижений
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
