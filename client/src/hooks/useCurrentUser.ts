import { useQuery, useMutation } from "@tanstack/react-query";
import { useTelegramUser } from "./useTelegramUser";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { User, InsertUser } from "@shared/schema";
import { useEffect, useRef } from "react";

export function useCurrentUser() {
  const { telegramUser, isLoading: isTelegramLoading } = useTelegramUser();
  const creationAttempted = useRef(false);

  const createUserMutation = useMutation({
    mutationFn: async (userData: InsertUser) => {
      const res = await apiRequest("POST", "/api/users", userData);
      return await res.json() as User;
    },
    onSuccess: () => {
      if (telegramUser) {
        queryClient.invalidateQueries({ 
          queryKey: [`/api/users/${telegramUser.id.toString()}`] 
        });
      }
    },
  });

  const { data: user, isLoading: isUserLoading, error } = useQuery<User | null>({
    queryKey: telegramUser ? [`/api/users/${telegramUser.id.toString()}`] : [],
    queryFn: async () => {
      if (!telegramUser) throw new Error("No telegram user");
      const res = await fetch(`/api/users/${telegramUser.id.toString()}`);
      if (!res.ok) {
        if (res.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch user: ${res.statusText}`);
      }
      return await res.json();
    },
    enabled: !!telegramUser && !isTelegramLoading,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (
      !isTelegramLoading && 
      telegramUser && 
      !isUserLoading && 
      user === null && 
      !createUserMutation.isPending && 
      !creationAttempted.current
    ) {
      creationAttempted.current = true;
      const userName = telegramUser.firstName + (telegramUser.lastName ? ` ${telegramUser.lastName}` : "");
      const userData: InsertUser = {
        telegramId: telegramUser.id.toString(),
        name: userName,
        role: "traveler",
        avatarUrl: telegramUser.photoUrl || null,
        birthDate: null,
        totalPoints: 0,
        level: 1,
      };
      createUserMutation.mutate(userData);
    }
  }, [isTelegramLoading, telegramUser, isUserLoading, user, createUserMutation.isPending]);

  return {
    user: user || null,
    telegramUser,
    isLoading: isTelegramLoading || isUserLoading || createUserMutation.isPending,
    error: error || createUserMutation.error,
  };
}
