import { useState, useEffect } from "react";

export interface TelegramUser {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
  languageCode?: string;
}

export function useTelegramUser() {
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    
    if (tg) {
      tg.ready();
      
      if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const user = tg.initDataUnsafe.user;
        setTelegramUser({
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          username: user.username,
          photoUrl: user.photo_url,
          languageCode: user.language_code,
        });
        setIsLoading(false);
      } else {
        console.warn("Telegram WebApp: no user data (try launching via bot button)");
        setIsLoading(false);
      }
    } else {
      console.warn("Telegram WebApp API not available");
      setIsLoading(false);
    }
  }, []);

  return { telegramUser, isLoading };
}
