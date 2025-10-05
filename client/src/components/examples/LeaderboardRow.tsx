import LeaderboardRow from '../LeaderboardRow';

export default function LeaderboardRowExample() {
  return (
    <div className="space-y-3 p-4 bg-background">
      <LeaderboardRow 
        rank={1}
        userName="Мария Иванова"
        points={1250}
        level={12}
      />

      <LeaderboardRow 
        rank={2}
        userName="Алексей Петров"
        points={980}
        level={10}
      />

      <LeaderboardRow 
        rank={3}
        userName="Елена Сидорова"
        points={750}
        level={8}
      />

      <LeaderboardRow 
        rank={4}
        userName="Вы"
        points={620}
        level={6}
        isCurrentUser={true}
      />

      <LeaderboardRow 
        rank={5}
        userName="Дмитрий Козлов"
        points={500}
        level={5}
      />
    </div>
  );
}
