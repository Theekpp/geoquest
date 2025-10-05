import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ApiTestPage() {
  const { toast } = useToast();
  const [telegramId, setTelegramId] = useState("12345678");
  const [selectedMotifId, setSelectedMotifId] = useState<string>("");

  const { data: motifs, isLoading: motifsLoading } = useQuery({
    queryKey: ["/api/motifs"],
  });

  const { data: achievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ["/api/achievements"],
  });

  const { data: pois, isLoading: poisLoading } = useQuery({
    queryKey: [`/api/motifs/${selectedMotifId}/pois`],
    enabled: !!selectedMotifId,
  });

  const createUserMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telegramId,
          name: "Тестовый Пользователь",
          role: "студент",
          birthDate: "2000-01-01",
        }),
      });
      return res.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Пользователь создан",
        description: `ID: ${data.id}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
  });

  return (
    <div className="min-h-screen bg-background p-4 space-y-6" data-testid="page-api-test">
      <h1 className="text-2xl font-bold text-foreground">API Test Page</h1>

      <Card className="p-4 space-y-4" data-testid="card-user-test">
        <h2 className="text-xl font-semibold">Создать пользователя</h2>
        <div className="flex gap-2">
          <Input
            value={telegramId}
            onChange={(e) => setTelegramId(e.target.value)}
            placeholder="Telegram ID"
            data-testid="input-telegram-id"
          />
          <Button
            onClick={() => createUserMutation.mutate()}
            disabled={createUserMutation.isPending}
            data-testid="button-create-user"
          >
            {createUserMutation.isPending ? "Создание..." : "Создать"}
          </Button>
        </div>
      </Card>

      <Card className="p-4 space-y-4" data-testid="card-motifs">
        <h2 className="text-xl font-semibold">Мотивы ({Array.isArray(motifs) ? motifs.length : 0})</h2>
        {motifsLoading ? (
          <p>Загрузка...</p>
        ) : (
          <div className="space-y-2">
            {Array.isArray(motifs) && motifs.map((motif: any) => (
              <div
                key={motif.id}
                className="p-3 border rounded-lg cursor-pointer hover:bg-accent"
                onClick={() => setSelectedMotifId(motif.id)}
                data-testid={`card-motif-${motif.id}`}
              >
                <h3 className="font-semibold">{motif.name}</h3>
                <p className="text-sm text-muted-foreground">{motif.description}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {selectedMotifId && (
        <Card className="p-4 space-y-4" data-testid="card-pois">
          <h2 className="text-xl font-semibold">Точки интереса ({Array.isArray(pois) ? pois.length : 0})</h2>
          {poisLoading ? (
            <p>Загрузка...</p>
          ) : (
            <div className="space-y-2">
              {Array.isArray(pois) && pois.map((poi: any) => (
                <div
                  key={poi.id}
                  className="p-3 border rounded-lg"
                  data-testid={`card-poi-${poi.id}`}
                >
                  <h3 className="font-semibold">{poi.name}</h3>
                  <p className="text-sm text-muted-foreground">{poi.description}</p>
                  <p className="text-xs mt-2">
                    Координаты: {poi.latitude}, {poi.longitude}
                  </p>
                  <p className="text-xs">Баллы: {poi.points}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      <Card className="p-4 space-y-4" data-testid="card-achievements">
        <h2 className="text-xl font-semibold">Достижения ({Array.isArray(achievements) ? achievements.length : 0})</h2>
        {achievementsLoading ? (
          <p>Загрузка...</p>
        ) : (
          <div className="space-y-2">
            {Array.isArray(achievements) && achievements.map((achievement: any) => (
              <div
                key={achievement.id}
                className="p-3 border rounded-lg"
                data-testid={`card-achievement-${achievement.id}`}
              >
                <h3 className="font-semibold">{achievement.name}</h3>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                <p className="text-xs mt-2">Баллы: {achievement.points}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
