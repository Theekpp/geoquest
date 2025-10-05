import { useState } from "react";
import MapView from "@/components/MapView";
import POIContentModal from "@/components/POIContentModal";
import { useLocationContext } from "@/contexts/LocationContext";

export default function MapPage() {
  const [selectedPOI, setSelectedPOI] = useState<string | null>(null);
  const [activatedPOIs, setActivatedPOIs] = useState<Set<string>>(new Set());
  const { currentPOI, visitedPOIIds, markCurrentAsViewed, pois } = useLocationContext();

  const handlePOIClick = (poiId: string) => {
    setSelectedPOI(poiId);
    if (currentPOI && poiId === currentPOI.id) {
      markCurrentAsViewed();
    }
  };

  const handleActivatePOI = () => {
    if (selectedPOI) {
      setActivatedPOIs(prev => new Set(prev).add(selectedPOI));
      console.log('POI activated:', selectedPOI);
    }
  };

  const selectedPOIData = pois.find(poi => poi.id === selectedPOI);

  return (
    <div className="h-full w-full">
      <MapView 
        onPOIClick={handlePOIClick}
        currentPOI={currentPOI ? {
          id: currentPOI.id,
          coordinates: [parseFloat(currentPOI.longitude), parseFloat(currentPOI.latitude)] as [number, number],
          title: currentPOI.name
        } : null}
      />

      {selectedPOI && selectedPOIData && (
        <POIContentModal
          title={selectedPOIData.name}
          quote={selectedPOIData.quote || ""}
          description={selectedPOIData.description}
          points={selectedPOIData.points}
          imageUrl={selectedPOIData.imageUrl || "https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&q=80"}
          onClose={() => setSelectedPOI(null)}
          onActivate={handleActivatePOI}
          isActivated={visitedPOIIds.has(selectedPOI)}
        />
      )}
    </div>
  );
}
