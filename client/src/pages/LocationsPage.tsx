import { useState } from "react";
import POICard from "@/components/POICard";
import POIContentModal from "@/components/POIContentModal";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useLocationContext } from "@/contexts/LocationContext";

// TODO: remove mock data - will be fetched from backend
const mockLocations = [
  {
    id: "1",
    title: "Берег Москвы-реки",
    description: "Место, где ковёр-самолёт приземлился на тихие воды реки",
    distance: 250,
    points: 50,
    status: "available" as const,
    quote: "Ещё через три часа ковёр-гидросамолёт благополучно снизился у пологого берега Москвы-реки",
    fullDescription: "Конец одного из приключений — приземление ковра-гидросамолёта «ВК-1» именно здесь.",
    imageUrl: "https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&q=80"
  },
  {
    id: "2",
    title: "Стадион «Динамо»",
    description: "Футбольный матч, где Хоттабыч показал свою магию",
    points: 75,
    status: "completed" as const,
    quote: "Первые ещё задолго до начала матча устремляются со всех концов города к высоким воротам стадиона «Динамо»",
    fullDescription: "Реальный стадион, существовавший в Москве с 1928 года, расположен на Ленинградском проспекте.",
    imageUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80"
  },
  {
    id: "3",
    title: "Метро «Динамо»",
    description: "Первая поездка Хоттабыча в московском метро",
    points: 60,
    status: "locked" as const,
    quote: "Этот весёлый и солнечный летний день, когда наши друзья отправились на футбольный матч, приключения начались ещё в вестибюле метро",
    fullDescription: "Московское метро, открытое в 1935 году. Сцены в вестибюле и на платформе происходят в московском метро.",
    imageUrl: "https://images.unsplash.com/photo-1581262177000-8c85c9646d9b?w=800&q=80"
  },
  {
    id: "4",
    title: "Центральное экскурсионное бюро",
    description: "Хоттабыч приходит с древним свитком",
    points: 65,
    status: "locked" as const,
    quote: "Тот же день в канцелярию Центрального экскурсионного бюро пришёл старичок в белом полотняном костюме",
    fullDescription: "Организация, организующая поездки. Часть городской инфраструктуры 1930-х.",
    imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80"
  },
  {
    id: "5",
    title: "Первый Строительный переулок",
    description: "Вымышленный переулок с дворцами Хоттабыча",
    points: 80,
    status: "locked" as const,
    quote: "Соблаговоли, о мой повелитель, осмотреть дворцы",
    fullDescription: "Вымышленное преображение реального переулка. Ключевая локация повести в Москве.",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"
  }
];

export default function LocationsPage() {
  const [selectedPOI, setSelectedPOI] = useState<typeof mockLocations[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { currentPOI: contextCurrentPOI, markCurrentAsViewed } = useLocationContext();

  const handlePOIClick = (location: typeof mockLocations[0]) => {
    setSelectedPOI(location);
    markCurrentAsViewed(); // Mark as viewed when user opens the card
  };

  // Show only current location (if any) 
  const filteredLocations = mockLocations
    .filter(loc => contextCurrentPOI && loc.id === contextCurrentPOI.id)
    .filter(loc =>
      loc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleNext = () => {
    if (!selectedPOI) return;
    
    const currentIndex = mockLocations.findIndex(loc => loc.id === selectedPOI.id);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < mockLocations.length) {
      const nextLocation = mockLocations[nextIndex];
      if (nextLocation.status !== "locked") {
        setSelectedPOI(nextLocation);
      }
    }
  };

  const hasNext = selectedPOI ? 
    mockLocations.findIndex(loc => loc.id === selectedPOI.id) < mockLocations.length - 1 &&
    mockLocations[mockLocations.findIndex(loc => loc.id === selectedPOI.id) + 1]?.status !== "locked"
    : false;

  return (
    <div className="h-full w-full overflow-y-auto pb-24">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            Локации маршрута
          </h1>
          <p className="text-sm text-muted-foreground">
            По следам «Старика Хоттабыча» Льва Лагина
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Поиск локаций..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-locations"
          />
        </div>

        {/* Locations List */}
        <div className="space-y-3">
          {filteredLocations.map((location) => (
            <POICard
              key={location.id}
              id={location.id}
              title={location.title}
              description={location.description}
              distance={location.distance}
              points={location.points}
              status={location.status}
              onClick={() => handlePOIClick(location)}
            />
          ))}
        </div>
      </div>

      {selectedPOI && (
        <POIContentModal
          title={selectedPOI.title}
          quote={selectedPOI.quote}
          description={selectedPOI.fullDescription}
          points={selectedPOI.points}
          imageUrl={selectedPOI.imageUrl}
          onClose={() => setSelectedPOI(null)}
          onActivate={() => console.log('Activate:', selectedPOI.id)}
          onNext={handleNext}
          isActivated={selectedPOI.status === "completed"}
          hasNext={hasNext}
        />
      )}
    </div>
  );
}
