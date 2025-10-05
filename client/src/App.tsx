import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LocationProvider } from "@/contexts/LocationContext";
import StatusBar from "@/components/StatusBar";
import BottomNav from "@/components/BottomNav";
import LocationErrorBanner from "@/components/LocationErrorBanner";
import { useTelegramLocation } from "@/hooks/useTelegramLocation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import MapPage from "@/pages/MapPage";
import LocationsPage from "@/pages/LocationsPage";
import AchievementsPage from "@/pages/AchievementsPage";
import RatingPage from "@/pages/RatingPage";
import ProfilePage from "@/pages/ProfilePage";
import ApiTestPage from "@/pages/ApiTestPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={MapPage} />
      <Route path="/locations" component={LocationsPage} />
      <Route path="/achievements" component={AchievementsPage} />
      <Route path="/rating" component={RatingPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/api-test" component={ApiTestPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { error: locationError } = useTelegramLocation();
  const { user, isLoading: isUserLoading, error: userError, telegramUser } = useCurrentUser();

  return (
    <ThemeProvider>
      <LocationProvider>
        <TooltipProvider>
          <div className="h-screen w-full overflow-hidden bg-background">
            <StatusBar 
              userName={user?.name || (telegramUser ? `${telegramUser.firstName}` : "Загрузка...")}
              userAvatar={user?.avatarUrl || ""}
              points={user?.totalPoints || 0}
              level={user?.level || 1}
            />
            
            <LocationErrorBanner error={locationError} />
            
            <main className="h-full pt-16 pb-18 overflow-hidden">
              {userError ? (
                <div className="flex items-center justify-center h-full p-6">
                  <div className="text-center max-w-md">
                    <div className="text-destructive text-5xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold mb-2" data-testid="error-title">Ошибка загрузки</h2>
                    <p className="text-muted-foreground mb-4" data-testid="error-message">
                      {userError instanceof Error ? userError.message : "Не удалось загрузить данные профиля"}
                    </p>
                    <button 
                      onClick={() => window.location.reload()} 
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                      data-testid="button-reload"
                    >
                      Перезагрузить
                    </button>
                  </div>
                </div>
              ) : isUserLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" data-testid="loading-spinner"></div>
                    <p className="text-muted-foreground" data-testid="loading-text">Загрузка профиля...</p>
                  </div>
                </div>
              ) : (
                <Router />
              )}
            </main>

            <BottomNav />
          </div>
          <Toaster />
        </TooltipProvider>
      </LocationProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
