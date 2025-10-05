import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProgressBar from "@/components/ProgressBar";
import { Star, MapPin, Trophy, Settings, LogOut, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useQuery } from "@tanstack/react-query";
import type { UserPoiVisit, Poi } from "@shared/schema";

function calculateLevelProgress(totalPoints: number) {
  const baseXP = 100;
  const level = Math.floor(1 + Math.sqrt(totalPoints / baseXP));
  const xpForCurrentLevel = baseXP * (level - 1) * (level - 1);
  const xpForNextLevel = baseXP * level * level;
  const currentXP = totalPoints - xpForCurrentLevel;
  const nextLevelXP = xpForNextLevel - xpForCurrentLevel;
  
  return { level, currentXP, nextLevelXP };
}

export default function ProfilePage() {
  const { user, isLoading: isUserLoading } = useCurrentUser();
  
  const { data: visits, isLoading: isVisitsLoading } = useQuery<UserPoiVisit[]>({
    queryKey: user ? [`/api/visits/${user.id}`] : [],
    enabled: !!user,
  });

  const { data: userAchievements, isLoading: isAchievementsLoading } = useQuery<any[]>({
    queryKey: user ? [`/api/achievements/${user.id}`] : [],
    enabled: !!user,
  });

  const { data: allPois, isLoading: isPoisLoading } = useQuery<Poi[]>({
    queryKey: ["/api/pois"],
    enabled: !!user,
  });

  const { data: leaderboard } = useQuery<any[]>({
    queryKey: ["/api/leaderboard"],
    queryFn: async () => {
      const res = await fetch("/api/leaderboard?limit=100");
      if (!res.ok) throw new Error("Failed to fetch leaderboard");
      return res.json();
    },
    enabled: !!user,
  });

  const isLoading = isUserLoading || isVisitsLoading || isAchievementsLoading || isPoisLoading;

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" data-testid="loader-profile" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-full w-full flex items-center justify-center p-4">
        <Card className="p-6 text-center max-w-md">
          <p className="text-muted-foreground mb-4" data-testid="text-no-user">
            Не удалось загрузить данные пользователя
          </p>
          <p className="text-sm text-muted-foreground">
            Попробуйте запустить приложение через Telegram бота
          </p>
        </Card>
      </div>
    );
  }

  const { level, currentXP, nextLevelXP } = calculateLevelProgress(user.totalPoints);
  const completedLocations = visits?.length || 0;
  const totalLocations = allPois?.length || 0;
  const achievementsCount = userAchievements?.length || 0;
  
  const userRank = leaderboard?.findIndex(u => u.id === user.id) ?? -1;
  const displayRank = userRank >= 0 ? userRank + 1 : null;

  const userName = user.name || "Путешественник";
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="h-full w-full overflow-y-auto pb-24">
      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20 border-4 border-accent" data-testid="avatar-profile">
              <AvatarImage src={user.avatarUrl || ""} alt={userName} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                {userInitials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-1" data-testid="text-username">
                {userName}
              </h2>
              <Badge className="bg-primary text-primary-foreground mb-3" data-testid="badge-level">
                Уровень {level}
              </Badge>

              <ProgressBar 
                current={currentXP}
                max={nextLevelXP}
                label="Прогресс уровня"
              />
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-xl">
                <Star className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Очки</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-points">{user.totalPoints}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Локации</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-locations">
                  {completedLocations}/{totalLocations}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <Trophy className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Награды</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-achievements">{achievementsCount}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500/10 rounded-xl">
                <span className="text-2xl">🏅</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Рейтинг</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-rank">
                  {displayRank ? `#${displayRank}` : '-'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Настройки</h3>

          <Link href="/api-test">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3"
              data-testid="button-api-test"
            >
              <Settings className="w-5 h-5" />
              API Test (DEV)
            </Button>
          </Link>

          <Button 
            variant="outline" 
            className="w-full justify-start gap-3"
            data-testid="button-settings"
            onClick={() => console.log('Open settings')}
          >
            <Settings className="w-5 h-5" />
            Настройки приложения
          </Button>

          <Button 
            variant="outline" 
            className="w-full justify-start gap-3 text-destructive border-destructive/20 hover:bg-destructive/10"
            data-testid="button-logout"
            onClick={() => console.log('Logout')}
          >
            <LogOut className="w-5 h-5" />
            Выйти из аккаунта
          </Button>
        </div>

        {/* App Info */}
        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>Старик Хоттабыч v1.0.0</p>
          <p className="text-xs mt-1">Литературный квест-платформа</p>
        </div>
      </div>
    </div>
  );
}
