import { MapPin, List, Trophy, BarChart3, User } from "lucide-react";
import { useLocation } from "wouter";
import { useLocationContext } from "@/contexts/LocationContext";

const navItems = [
  { id: "map", label: "Карта", icon: MapPin, path: "/" },
  { id: "locations", label: "Локации", icon: List, path: "/locations" },
  { id: "achievements", label: "Награды", icon: Trophy, path: "/achievements" },
  { id: "rating", label: "Рейтинг", icon: BarChart3, path: "/rating" },
  { id: "profile", label: "Профиль", icon: User, path: "/profile" },
];

export default function BottomNav() {
  const [location, setLocation] = useLocation();
  const { isNewCurrentPOI } = useLocationContext();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-18 bg-card/95 backdrop-blur-md border-t border-accent/20">
      <div className="flex items-center justify-around h-full px-2">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => setLocation(item.path)}
              className="relative flex flex-col items-center justify-center gap-1 py-2 px-3 min-w-[60px] hover-elevate active-elevate-2 rounded-lg transition-all"
              data-testid={`nav-${item.id}`}
            >
              <div className="relative">
                <Icon 
                  className={`w-6 h-6 transition-colors ${
                    isActive ? 'text-accent' : 'text-muted-foreground'
                  }`}
                />
                {item.id === "locations" && isNewCurrentPOI && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-card animate-pulse" data-testid="badge-new-locations" />
                )}
              </div>
              <span 
                className={`text-xs font-medium transition-colors ${
                  isActive ? 'text-accent' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
