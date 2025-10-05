import { useState } from "react";
import MapView from "@/components/MapView";
import POIContentModal from "@/components/POIContentModal";
import { useLocationContext } from "@/contexts/LocationContext";

// TODO: remove mock data - will be fetched from backend
const mockPOIs = {
  '1': {
    id: '1',
    title: "Берег Москвы-реки",
    quote: "Ещё через три часа ковёр-гидросамолёт благополучно снизился у пологого берега Москвы-реки",
    description: "Конец одного из приключений — приземление ковра-гидросамолёта «ВК-1» именно здесь. Хотя «Архангельский порт» в Москве — это скорее метафора, сам факт посадки на берегу Москвы-реки — реальная часть повести.",
    points: 50,
    imageUrl: "https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&q=80",
    coordinates: [37.5876, 55.7558] as [number, number]
  },
  '2': {
    id: '2',
    title: "Стадион «Динамо»",
    quote: "Первые ещё задолго до начала матча устремляются со всех концов города к высоким воротам стадиона «Динамо»",
    description: "Реальный стадион, существовавший в Москве с 1928 года, расположен на Ленинградском проспекте. Одна из центральных локаций приключений — футбольный матч.",
    points: 75,
    imageUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80",
    coordinates: [37.5594, 55.7917] as [number, number]
  }
};

export default function MapPage() {
  const [selectedPOI, setSelectedPOI] = useState<string | null>(null);
  const [activatedPOIs, setActivatedPOIs] = useState<Set<string>>(new Set());
  const { currentPOI: contextCurrentPOI, visitedPOIIds, markCurrentAsViewed } = useLocationContext();

  const handlePOIClick = (poiId: string) => {
    setSelectedPOI(poiId);
    if (contextCurrentPOI && poiId === contextCurrentPOI.id) {
      markCurrentAsViewed(); // Mark as viewed when user opens current POI on map
    }
  };

  const handleActivatePOI = () => {
    if (selectedPOI) {
      setActivatedPOIs(prev => new Set(prev).add(selectedPOI));
      console.log('POI activated:', selectedPOI);
      // TODO: Send activation to backend via /trigger/{userId}/{pointId}
    }
  };

  const currentMapPOI = contextCurrentPOI ? mockPOIs[contextCurrentPOI.id as keyof typeof mockPOIs] : null;
  const selectedPOIData = selectedPOI ? mockPOIs[selectedPOI as keyof typeof mockPOIs] : null;

  return (
    <div className="h-full w-full">
      <MapView 
        onPOIClick={handlePOIClick}
        currentPOI={currentMapPOI ? {
          id: currentMapPOI.id,
          coordinates: currentMapPOI.coordinates,
          title: currentMapPOI.title
        } : null}
      />

      {selectedPOI && selectedPOIData && (
        <POIContentModal
          title={selectedPOIData.title}
          quote={selectedPOIData.quote}
          description={selectedPOIData.description}
          points={selectedPOIData.points}
          imageUrl={selectedPOIData.imageUrl}
          onClose={() => setSelectedPOI(null)}
          onActivate={handleActivatePOI}
          isActivated={visitedPOIIds.has(selectedPOI)}
        />
      )}
    </div>
  );
}
