import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Lock, CheckCircle2, Star } from "lucide-react";

interface POICardProps {
  id: string;
  title: string;
  description: string;
  distance?: number;
  points: number;
  status: "locked" | "available" | "completed";
  onClick?: () => void;
}

export default function POICard({ title, description, distance, points, status, onClick }: POICardProps) {
  const statusConfig = {
    locked: { icon: Lock, color: "text-muted-foreground", bgColor: "bg-muted" },
    available: { icon: MapPin, color: "text-primary", bgColor: "bg-primary/10" },
    completed: { icon: CheckCircle2, color: "text-green-500", bgColor: "bg-green-500/10" },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Card 
      className={`p-4 hover-elevate active-elevate-2 transition-all cursor-pointer ${
        status === "locked" ? "opacity-60" : ""
      }`}
      onClick={onClick}
      data-testid={`poi-card-${title}`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${config.bgColor}`}>
          <StatusIcon className={`w-6 h-6 ${config.color}`} />
        </div>

        <div className="flex-1">
          <h3 className="font-serif text-lg font-semibold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>

          <div className="flex items-center gap-3">
            {distance !== undefined && status === "available" && (
              <span className="text-xs text-muted-foreground">
                📍 {distance} м
              </span>
            )}
            
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-accent fill-accent" />
              <span className="text-xs font-semibold text-foreground">+{points}</span>
            </div>

            {status === "completed" && (
              <Badge variant="secondary" className="bg-green-500/20 text-green-700 dark:text-green-400 text-xs">
                Пройдено
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
