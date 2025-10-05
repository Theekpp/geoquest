import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useTelegramLocation } from "@/hooks/useTelegramLocation";
import { useLocationUnlocking } from "@/hooks/useLocationUnlocking";
import { useQuery } from "@tanstack/react-query";

interface POI {
  id: string;
  name: string;
  description: string;
  quote: string;
  latitude: string;
  longitude: string;
  order: number;
  radius: number;
  points: number;
  imageUrl: string | null;
}

async function fetchPOIs(): Promise<POI[]> {
  const response = await fetch('/api/pois');
  if (!response.ok) {
    throw new Error('Failed to fetch POIs');
  }
  return response.json();
}

interface LocationContextValue {
  userLocation: { latitude: number; longitude: number } | null;
  currentPOI: POI | null;
  visitedPOIIds: Set<string>;
  isNewCurrentPOI: boolean;
  markCurrentAsViewed: () => void;
  pois: POI[];
  isLoadingPOIs: boolean;
}

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const { location } = useTelegramLocation();
  const { data: poisData = [], isLoading: isLoadingPOIs } = useQuery({
    queryKey: ['pois'],
    queryFn: fetchPOIs,
  });
  
  // Convert POIs to format needed by useLocationUnlocking
  const poiCoordinates = poisData.map(poi => ({
    id: poi.id,
    coordinates: [parseFloat(poi.longitude), parseFloat(poi.latitude)] as [number, number],
  }));
  
  const {
    currentPOI: currentPOICoords,
    visitedPOIIds,
    isNewCurrentPOI,
    markCurrentAsViewed,
  } = useLocationUnlocking({
    pois: poiCoordinates,
    userLat: location?.latitude,
    userLon: location?.longitude,
    proximityRadius: 100,
  });

  // Find full POI data for current POI
  const currentPOI = currentPOICoords 
    ? poisData.find(poi => poi.id === currentPOICoords.id) || null
    : null;

  return (
    <LocationContext.Provider
      value={{
        userLocation: location,
        currentPOI,
        visitedPOIIds,
        isNewCurrentPOI,
        markCurrentAsViewed,
        pois: poisData,
        isLoadingPOIs,
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
