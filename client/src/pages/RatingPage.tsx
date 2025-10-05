import LeaderboardRow from "@/components/LeaderboardRow";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Loader2 } from "lucide-react";
import type { User } from "@shared/schema";

function calculateLevel(totalPoints: number) {
  const baseXP = 100;
  return Math.floor(1 + Math.sqrt(totalPoints / baseXP));
}

export default function RatingPage() {
  const { user, isLoading: isUserLoading } = useCurrentUser();
  
  const { data: leaderboard, isLoading: isLeaderboardLoading } = useQuery<User[]>({
    queryKey: ["/api/leaderboard"],
    queryFn: async () => {
      const res = await fetch("/api/leaderboard?limit=50");
      if (!res.ok) throw new Error("Failed to fetch leaderboard");
      return res.json();
    },
  });

  const isLoading = isUserLoading || isLeaderboardLoading;

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" data-testid="loader-rating" />
      </div>
    );
  }

  const userRank = leaderboard?.findIndex(u => u.id === user?.id) ?? -1;
  const displayRank = userRank >= 0 ? userRank + 1 : null;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const weeklyLeaderboard = leaderboard?.slice(0, 20) || [];
  
  return (
    <div className="h-full w-full overflow-y-auto pb-24">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            Рейтинг
          </h1>
          <p className="text-sm text-muted-foreground">
            Соревнуйтесь с другими путешественниками
          </p>
        </div>

        {/* Stats Card */}
        {user && (
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ваша позиция</p>
                <p className="text-3xl font-bold text-foreground" data-testid="text-user-rank">
                  {displayRank ? `#${displayRank}` : '-'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Ваши очки</p>
                <p className="text-3xl font-bold text-foreground" data-testid="text-user-points">
                  {user.totalPoints}
                </p>
              </div>
              <div className="text-5xl">🏅</div>
            </div>
          </Card>
        )}

        {/* Leaderboard Tabs */}
        <Tabs defaultValue="global" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="global" data-testid="tab-global">
              Общий
            </TabsTrigger>
            <TabsTrigger value="weekly" data-testid="tab-weekly">
              За неделю
            </TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="space-y-3 mt-4">
            {leaderboard && leaderboard.length > 0 ? (
              leaderboard.map((leaderUser, index) => (
                <LeaderboardRow
                  key={leaderUser.id}
                  rank={index + 1}
                  userName={leaderUser.name}
                  points={leaderUser.totalPoints}
                  level={calculateLevel(leaderUser.totalPoints)}
                  isCurrentUser={user?.id === leaderUser.id}
                />
              ))
            ) : (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground" data-testid="text-no-data">
                  Пока нет данных рейтинга
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="weekly" className="space-y-3 mt-4">
            {weeklyLeaderboard && weeklyLeaderboard.length > 0 ? (
              weeklyLeaderboard.map((leaderUser, index) => (
                <LeaderboardRow
                  key={leaderUser.id}
                  rank={index + 1}
                  userName={leaderUser.name}
                  points={leaderUser.totalPoints}
                  level={calculateLevel(leaderUser.totalPoints)}
                  isCurrentUser={user?.id === leaderUser.id}
                />
              ))
            ) : (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground" data-testid="text-no-weekly-data">
                  Пока нет данных за неделю
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
