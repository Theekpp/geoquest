import { createContext, useContext, ReactNode } from "react";
import { useTelegramLocation } from "@/hooks/useTelegramLocation";
import { useLocationUnlocking } from "@/hooks/useLocationUnlocking";

// All POIs with coordinates
const allPOIs = [
  { id: "1", coordinates: [37.5876, 55.7558] as [number, number] },
  { id: "2", coordinates: [37.5594, 55.7917] as [number, number] },
  { id: "3", coordinates: [37.5584, 55.7897] as [number, number] },
  { id: "4", coordinates: [37.6173, 55.7558] as [number, number] },
  { id: "5", coordinates: [37.6053, 55.7497] as [number, number] },
];

interface LocationContextValue {
  userLocation: { latitude: number; longitude: number } | null;
  currentPOI: { id: string; coordinates: [number, number] } | null;
  visitedPOIIds: Set<string>;
  isNewCurrentPOI: boolean;
  markCurrentAsViewed: () => void;
}

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const { location } = useTelegramLocation();
  
  const {
    currentPOI,
    visitedPOIIds,
    isNewCurrentPOI,
    markCurrentAsViewed,
  } = useLocationUnlocking({
    pois: allPOIs,
    userLat: location?.latitude,
    userLon: location?.longitude,
    proximityRadius: 100, // 100 meters
  });

  return (
    <LocationContext.Provider
      value={{
        userLocation: location,
        currentPOI,
        visitedPOIIds,
        isNewCurrentPOI,
        markCurrentAsViewed,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocationContext must be used within LocationProvider");
  }
  return context;
}
