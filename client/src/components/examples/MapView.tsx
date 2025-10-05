import MapView from '../MapView';

export default function MapViewExample() {
  return (
    <div className="h-screen w-full">
      <MapView onPOIClick={(id) => console.log('POI clicked:', id)} />
    </div>
  );
}
