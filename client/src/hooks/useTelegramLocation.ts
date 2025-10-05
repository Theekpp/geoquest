import { useState, useEffect } from "react";

interface TelegramLocation {
  latitude: number;
  longitude: number;
}

interface UseTelegramLocationResult {
  location: TelegramLocation | null;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => void;
}

export function useTelegramLocation(): UseTelegramLocationResult {
  const [location, setLocation] = useState<TelegramLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = () => {
    setIsLoading(true);
    setError(null);

    const telegram = window.Telegram?.WebApp;

    if (!telegram) {
      // Fallback to browser geolocation if not in Telegram
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            setIsLoading(false);
          },
          (err) => {
            setError(err.message);
            setIsLoading(false);
          }
        );
      } else {
        setError("Геолокация недоступна");
        setIsLoading(false);
      }
      return;
    }

    // Всегда использовать WebView геолокацию - работает во всех версиях Telegram
    // Telegram сам показывает диалог разрешений
    {
      console.log('[Geolocation] Using WebView geolocation');
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('[Geolocation] Got location from WebView:', position.coords);
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            setIsLoading(false);
          },
          (err) => {
            console.error('[Geolocation] WebView geolocation error:', err);
            setError(err.message);
            setIsLoading(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      } else {
        setError("Геолокация недоступна");
        setIsLoading(false);
      }
    }
  };

  // Auto-request location on mount
  useEffect(() => {
    requestLocation();
  }, []);

  return { location, isLoading, error, requestLocation };
}
