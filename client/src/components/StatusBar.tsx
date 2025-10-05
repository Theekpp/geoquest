import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Sparkles } from "lucide-react";

interface StatusBarProps {
  userName: string;
  userAvatar?: string;
  points: number;
  level: number;
}

export default function StatusBar({ userName, userAvatar, points, level }: StatusBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-card/95 backdrop-blur-md border-b border-accent/20 px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border-2 border-accent">
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
            {userName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">{userName}</span>
          <span className="text-xs text-muted-foreground">Путешественник</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 bg-accent/10 px-3 py-1.5 rounded-full" data-testid="points-display">
          <Star className="w-4 h-4 text-accent fill-accent" />
          <span className="text-sm font-semibold text-foreground">{points}</span>
        </div>

        <Badge variant="secondary" className="bg-primary text-primary-foreground font-semibold px-3 py-1" data-testid="level-badge">
          <Sparkles className="w-3 h-3 mr-1" />
          Ур. {level}
        </Badge>
      </div>
    </div>
  );
}
