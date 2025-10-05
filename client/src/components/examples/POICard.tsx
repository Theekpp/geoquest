import POICard from '../POICard';

export default function POICardExample() {
  return (
    <div className="space-y-3 p-4 bg-background">
      <POICard 
        id="1"
        title="Берег Москвы-реки"
        description="Место, где ковёр-самолёт приземлился на тихие воды реки"
        distance={250}
        points={50}
        status="available"
        onClick={() => console.log('POI clicked: Берег Москвы-реки')}
      />
      
      <POICard 
        id="2"
        title="Стадион «Динамо»"
        description="Футбольный матч, где Хоттабыч показал свою магию"
        points={75}
        status="completed"
        onClick={() => console.log('POI clicked: Стадион Динамо')}
      />
      
      <POICard 
        id="3"
        title="Метро «Динамо»"
        description="Первая поездка Хоттабыча в московском метро"
        points={60}
        status="locked"
        onClick={() => console.log('POI clicked: Метро Динамо')}
      />
    </div>
  );
}
