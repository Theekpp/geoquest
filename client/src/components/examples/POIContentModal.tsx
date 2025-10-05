import { useState } from 'react';
import POIContentModal from '../POIContentModal';
import { Button } from '@/components/ui/button';

export default function POIContentModalExample() {
  const [isOpen, setIsOpen] = useState(true);
  const [isActivated, setIsActivated] = useState(false);

  if (!isOpen) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Button onClick={() => setIsOpen(true)}>
          Открыть модальное окно
        </Button>
      </div>
    );
  }

  return (
    <POIContentModal
      title="Берег Москвы-реки"
      quote="Ещё через три часа ковёр-гидросамолёт благополучно снизился у пологого берега Москвы-реки"
      description="Конец одного из приключений — приземление ковра-гидросамолёта «ВК-1» именно здесь. Хотя «Архангельский порт» в Москве — это скорее метафора, сам факт посадки на берегу Москвы-реки — реальная часть повести."
      points={50}
      imageUrl="https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&q=80"
      onClose={() => setIsOpen(false)}
      onActivate={() => {
        console.log('POI activated');
        setIsActivated(true);
      }}
      isActivated={isActivated}
    />
  );
}
