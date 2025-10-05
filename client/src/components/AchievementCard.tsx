import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Lock } from "lucide-react";

interface AchievementCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export default function AchievementCard({ title, description, icon, unlocked, unlockedAt }: AchievementCardProps) {
  return (
    <Card className={`p-4 transition-all ${unlocked ? 'hover-elevate active-elevate-2' : 'opacity-50'}`}>
      <div className="flex items-start gap-4">
        <div className={`relative w-16 h-16 rounded-xl flex items-center justify-center ${
          unlocked 
            ? 'bg-gradient-to-br from-accent/20 to-primary/20 border-2 border-accent' 
            : 'bg-muted border-2 border-muted-foreground/20'
        }`}>
          <span className={`text-3xl ${unlocked ? '' : 'grayscale'}`}>
            {unlocked ? icon : '🔒'}
          </span>
          
          {unlocked && (
            <div className="absolute -top-1 -right-1 bg-accent rounded-full p-1">
              <Trophy className="w-3 h-3 text-accent-foreground" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-semibold text-foreground">{title}</h3>
            {!unlocked && (
              <Lock className="w-4 h-4 text-muted-foreground" />
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-2">
            {description}
          </p>

          {unlocked && unlockedAt && (
            <Badge variant="secondary" className="text-xs bg-accent/10 text-accent-foreground">
              Получено {unlockedAt}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
