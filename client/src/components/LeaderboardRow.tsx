import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal } from "lucide-react";

interface LeaderboardRowProps {
  rank: number;
  userName: string;
  userAvatar?: string;
  points: number;
  level: number;
  isCurrentUser?: boolean;
}

export default function LeaderboardRow({ 
  rank, 
  userName, 
  userAvatar, 
  points, 
  level,
  isCurrentUser = false 
}: LeaderboardRowProps) {
  const getRankBadge = () => {
    if (rank === 1) return { icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-500/10" };
    if (rank === 2) return { icon: Medal, color: "text-gray-400", bg: "bg-gray-400/10" };
    if (rank === 3) return { icon: Medal, color: "text-orange-600", bg: "bg-orange-600/10" };
    return null;
  };

  const rankBadge = getRankBadge();

  return (
    <div 
      className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
        isCurrentUser 
          ? 'bg-primary/10 border-2 border-primary' 
          : 'bg-card hover-elevate'
      }`}
      data-testid={`leaderboard-row-${rank}`}
    >
      {/* Rank */}
      <div className="flex items-center justify-center w-12 h-12">
        {rankBadge ? (
          <div className={`w-10 h-10 rounded-full ${rankBadge.bg} flex items-center justify-center`}>
            <rankBadge.icon className={`w-5 h-5 ${rankBadge.color}`} />
          </div>
        ) : (
          <span className="font-bold text-xl text-muted-foreground">#{rank}</span>
        )}
      </div>

      {/* Avatar and Name */}
      <div className="flex items-center gap-3 flex-1">
        <Avatar className="h-10 w-10 border-2 border-accent">
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
            {userName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <p className="font-semibold text-foreground">
            {userName}
            {isCurrentUser && (
              <Badge variant="secondary" className="ml-2 text-xs bg-primary/20 text-primary">
                Вы
              </Badge>
            )}
          </p>
          <p className="text-xs text-muted-foreground">Уровень {level}</p>
        </div>
      </div>

      {/* Points */}
      <div className="text-right">
        <p className="font-bold text-lg text-foreground">{points}</p>
        <p className="text-xs text-muted-foreground">очков</p>
      </div>
    </div>
  );
}
