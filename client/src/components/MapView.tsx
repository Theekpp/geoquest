import { useEffect, useRef, useState } from "react";
import { load } from "@2gis/mapgl";
import { Button } from "@/components/ui/button";
import { Navigation, ZoomIn, ZoomOut } from "lucide-react";
import { useTelegramLocation } from "@/hooks/useTelegramLocation";

interface MapViewProps {
  onPOIClick?: (poiId: string) => void;
  currentPOI?: { id: string; coordinates: [number, number]; title: string } | null;
}

function parseLineString(lineString: string): Array<[number, number]> {
  const coordsStr = lineString.replace('LINESTRING(', '').replace(')', '');
  const coords = coordsStr.split(', ').map(pair => {
    const [lon, lat] = pair.split(' ').map(Number);
    return [lon, lat] as [number, number];
  });
  return coords;
}

async function fetchPedestrianRoute(
  fromLon: number,
  fromLat: number,
  toLon: number,
  toLat: number
): Promise<Array<[number, number]> | null> {
  try {
    const apiKey = import.meta.env.VITE_2GIS_API_KEY;
    if (!apiKey || apiKey === 'demo') {
      console.warn('2GIS API key not configured, skipping route request');
      return null;
    }

    const requestBody = {
      points: [
        {
          type: 'walking',
          lon: fromLon,
          lat: fromLat,
        },
        {
          type: 'walking',
          lon: toLon,
          lat: toLat,
        },
      ],
      transport: 'walking',
    };

    console.log('🔄 Requesting pedestrian route:', requestBody);

    const response = await fetch(
      `https://routing.api.2gis.com/routing/7.0.0/global?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Route API error:', response.status, errorText);
      return null;
    }

    const data = await response.json();
    
    if (data.result && data.result.length > 0) {
      const route = data.result[0];
      
      // Collect all geometry segments
      const allCoords: Array<[number, number]> = [];
      
      // Add begin pedestrian path if exists
      if (route.begin_pedestrian_path?.geometry?.selection) {
        const beginCoords = parseLineString(route.begin_pedestrian_path.geometry.selection);
        allCoords.push(...beginCoords);
      }
      
      // Add main route geometry from maneuvers
      if (route.maneuvers && route.maneuvers.length > 0) {
        route.maneuvers.forEach((maneuver: any) => {
          if (maneuver.outcoming_path?.geometry) {
            maneuver.outcoming_path.geometry.forEach((geom: any) => {
              if (geom.selection) {
                const segmentCoords = parseLineString(geom.selection);
                allCoords.push(...segmentCoords);
              }
            });
          }
        });
      }
      
      // Add end pedestrian path if exists
      if (route.end_pedestrian_path?.geometry?.selection) {
        const endCoords = parseLineString(route.end_pedestrian_path.geometry.selection);
        allCoords.push(...endCoords);
      }
      
      if (allCoords.length > 0) {
        console.log(`✅ Построен маршрут из ${allCoords.length} точек`);
        return allCoords;
      }
    }
    
    console.warn('⚠️ No route geometry in response');
    return null;
  } catch (error) {
    console.error('❌ Error fetching pedestrian route:', error);
    return null;
  }
}

export default function MapView({ onPOIClick, currentPOI }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const poiMarkerRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const routeLineRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { location, isLoading: isLocationLoading } = useTelegramLocation();

  useEffect(() => {
    if (!mapContainerRef.current) return;

    let map: any;

    const initMap = async () => {
      try {
        const mapglAPI = await load();

        // Check if browser is supported
        if (!mapglAPI.isSupported()) {
          const reason = mapglAPI.notSupportedReason();
          setError(`Браузер не поддерживается: ${reason}`);
          return;
        }

        // Initialize map centered on current POI or Moscow
        const initialCenter = currentPOI?.coordinates || [37.6173, 55.7558];
        map = new mapglAPI.Map(mapContainerRef.current!, {
          center: initialCenter,
          zoom: 14,
          key: import.meta.env.VITE_2GIS_API_KEY || 'demo',
          lang: 'ru',
        });

        mapInstanceRef.current = map;
        setMapReady(true);
      } catch (err) {
        console.error('Map initialization error:', err);
        setError('Ошибка инициализации карты');
      }
    };

    initMap();

    // Cleanup
    return () => {
      if (poiMarkerRef.current) {
        poiMarkerRef.current.destroy();
      }
      if (userMarkerRef.current) {
        userMarkerRef.current.destroy();
      }
      if (routeLineRef.current) {
        routeLineRef.current.destroy();
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
      }
    };
  }, []);

  // Handle current POI marker
  useEffect(() => {
    if (!mapInstanceRef.current || !currentPOI || !mapReady) return;

    const updatePOIMarker = async () => {
      try {
        const mapglAPI = await load();

        // Remove existing POI marker
        if (poiMarkerRef.current) {
          poiMarkerRef.current.destroy();
        }

        // Create POI marker
        const marker = new mapglAPI.Marker(mapInstanceRef.current, {
          coordinates: currentPOI.coordinates,
        });

        // Add click event
        marker.on('click', () => {
          onPOIClick?.(currentPOI.id);
        });

        poiMarkerRef.current = marker;

        // Center map to show both user and POI if user location exists
        if (location) {
          const bounds = [
            [location.longitude, location.latitude],
            currentPOI.coordinates
          ];
          // Fit map to show both points
          mapInstanceRef.current.fitBounds(bounds, { padding: 100 });
        } else {
          // Just center on POI
          mapInstanceRef.current.setCenter(currentPOI.coordinates);
          mapInstanceRef.current.setZoom(14);
        }
      } catch (err) {
        console.error('Error updating POI marker:', err);
      }
    };

    updatePOIMarker();
  }, [currentPOI, mapReady, onPOIClick, location]);

  // Handle user location updates and route
  useEffect(() => {
    if (!mapInstanceRef.current || !location || !mapReady) return;

    const updateUserMarkerAndRoute = async () => {
      try {
        const mapglAPI = await load();
        const userCoords: [number, number] = [location.longitude, location.latitude];

        // Remove existing user marker
        if (userMarkerRef.current) {
          userMarkerRef.current.destroy();
        }

        // Create user marker
        const userMarker = new mapglAPI.Marker(mapInstanceRef.current, {
          coordinates: userCoords,
        });

        userMarkerRef.current = userMarker;

        // Draw route if current POI exists
        if (currentPOI) {
          // Remove existing route
          if (routeLineRef.current) {
            routeLineRef.current.destroy();
          }

          // Fetch pedestrian route from 2GIS Routing API
          const routeCoordinates = await fetchPedestrianRoute(
            userCoords[0], // from lon
            userCoords[1], // from lat
            currentPOI.coordinates[0], // to lon
            currentPOI.coordinates[1]  // to lat
          );

          // Use real route geometry if available, otherwise fall back to straight line
          const finalCoordinates = routeCoordinates || [userCoords, currentPOI.coordinates];

          // Create polyline for route
          const routeLine = new mapglAPI.Polyline(mapInstanceRef.current, {
            coordinates: finalCoordinates,
            color: '#3b82f6',
            width: 4,
          });

          routeLineRef.current = routeLine;

          // Log route info
          if (routeCoordinates) {
            console.log('🚶 Построен пешеходный маршрут через 2GIS Routing API');
          } else {
            console.log('📍 Построена прямая линия (fallback)');
          }
        }
      } catch (err) {
        console.error('Error updating user marker and route:', err);
      }
    };

    updateUserMarkerAndRoute();
  }, [location, mapReady, currentPOI]);

  const centerOnUser = () => {
    if (mapInstanceRef.current && location) {
      mapInstanceRef.current.setCenter([location.longitude, location.latitude]);
      mapInstanceRef.current.setZoom(14);
    }
  };

  const zoomIn = () => {
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom();
      mapInstanceRef.current.setZoom(currentZoom + 1);
    }
  };

  const zoomOut = () => {
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom();
      mapInstanceRef.current.setZoom(currentZoom - 1);
    }
  };

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background">
        <div className="text-center space-y-4 p-6">
          <div className="text-6xl">⚠️</div>
          <p className="text-destructive font-semibold">{error}</p>
          <p className="text-sm text-muted-foreground">
            Проверьте настройки API ключа 2GIS
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div 
        ref={mapContainerRef}
        className="w-full h-full"
        data-testid="map-container"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Loading overlay */}
      {!mapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center space-y-2">
            <div className="text-6xl animate-pulse">🗺️</div>
            <p className="text-sm text-muted-foreground font-mono">
              Загрузка карты 2GIS...
            </p>
          </div>
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute bottom-24 right-4 flex flex-col gap-2">
        <Button
          size="icon"
          variant="secondary"
          className="bg-card/95 backdrop-blur-md shadow-lg"
          onClick={zoomIn}
          data-testid="button-zoom-in"
          disabled={!mapReady}
        >
          <ZoomIn className="w-5 h-5" />
        </Button>

        <Button
          size="icon"
          variant="secondary"
          className="bg-card/95 backdrop-blur-md shadow-lg"
          onClick={zoomOut}
          data-testid="button-zoom-out"
          disabled={!mapReady}
        >
          <ZoomOut className="w-5 h-5" />
        </Button>

        <Button
          size="icon"
          className="bg-primary text-primary-foreground shadow-lg"
          onClick={centerOnUser}
          data-testid="button-center-user"
          disabled={!mapReady}
        >
          <Navigation className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
