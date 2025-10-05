import AchievementCard from '../AchievementCard';

export default function AchievementCardExample() {
  return (
    <div className="space-y-3 p-4 bg-background">
      <AchievementCard 
        id="1"
        title="Первый шаг"
        description="Активируйте первую точку маршрута"
        icon="🎯"
        unlocked={true}
        unlockedAt="2 дня назад"
      />

      <AchievementCard 
        id="2"
        title="Знаток географии"
        description="Посетите все локации маршрута"
        icon="🗺️"
        unlocked={false}
      />

      <AchievementCard 
        id="3"
        title="Джинн-покровитель"
        description="Наберите 500 очков опыта"
        icon="✨"
        unlocked={true}
        unlockedAt="вчера"
      />
    </div>
  );
}
