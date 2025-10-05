import { useState, useEffect } from "react";
import { isWithinProximity, calculateDistance } from "@/lib/distance";

interface POI {
  id: string;
  coordinates: [number, number];
}

interface UseLocationUnlockingProps {
  pois: POI[];
  userLat?: number;
  userLon?: number;
  proximityRadius?: number;
}

interface UseLocationUnlockingResult {
  currentPOI: POI | null;
  visitedPOIIds: Set<string>;
  isNewCurrentPOI: boolean;
  markCurrentAsViewed: () => void;
}

export function useLocationUnlocking({
  pois,
  userLat,
  userLon,
  proximityRadius = 100,
}: UseLocationUnlockingProps): UseLocationUnlockingResult {
  const [currentPOI, setCurrentPOI] = useState<POI | null>(null);
  const [visitedPOIIds, setVisitedPOIIds] = useState<Set<string>>(new Set());
  const [isNewCurrentPOI, setIsNewCurrentPOI] = useState(false);
  const [initialLocationSet, setInitialLocationSet] = useState(false);

  // Find closest unvisited POI
  const findClosestUnvisitedPOI = (lat: number, lon: number, visited: Set<string>): POI | null => {
    let closestPOI: POI | null = null;
    let minDistance = Infinity;

    pois.forEach((poi) => {
      if (!visited.has(poi.id)) {
        const [poiLon, poiLat] = poi.coordinates;
        const distance = calculateDistance(lat, lon, poiLat, poiLon);
        
        if (distance < minDistance) {
          minDistance = distance;
          closestPOI = poi;
        }
      }
    });

    return closestPOI;
  };

  // Set initial current POI based on first location
  useEffect(() => {
    if (!userLat || !userLon || initialLocationSet || currentPOI) return;

    const closest = findClosestUnvisitedPOI(userLat, userLon, visitedPOIIds);
    if (closest) {
      setCurrentPOI(closest);
      setInitialLocationSet(true);
      setIsNewCurrentPOI(true);
    }
  }, [userLat, userLon, initialLocationSet, currentPOI, pois, visitedPOIIds]);

  // Check if user visited current POI
  useEffect(() => {
    if (!userLat || !userLon || !currentPOI) return;

    const [poiLon, poiLat] = currentPOI.coordinates;
    
    if (isWithinProximity(userLat, userLon, poiLat, poiLon, proximityRadius)) {
      // User has visited current POI
      if (!visitedPOIIds.has(currentPOI.id)) {
        // Create new visited set with current POI
        const newVisitedIds = new Set([...Array.from(visitedPOIIds), currentPOI.id]);
        setVisitedPOIIds(newVisitedIds);
        
        // Find next closest unvisited POI using the NEW visited set
        const nextPOI = findClosestUnvisitedPOI(userLat, userLon, newVisitedIds);
        if (nextPOI) {
          setCurrentPOI(nextPOI);
          setIsNewCurrentPOI(true);
        } else {
          // All POIs visited
          setCurrentPOI(null);
        }
      }
    }
  }, [userLat, userLon, currentPOI, proximityRadius, visitedPOIIds, pois]);

  const markCurrentAsViewed = () => {
    setIsNewCurrentPOI(false);
  };

  return {
    currentPOI,
    visitedPOIIds,
    isNewCurrentPOI,
    markCurrentAsViewed,
  };
}
