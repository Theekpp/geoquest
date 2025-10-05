import ProgressBar from '../ProgressBar';

export default function ProgressBarExample() {
  return (
    <div className="space-y-6 p-4 bg-background">
      <ProgressBar 
        current={350}
        max={500}
        label="Опыт до следующего уровня"
      />

      <ProgressBar 
        current={3}
        max={5}
        label="Пройдено локаций"
      />

      <ProgressBar 
        current={750}
        max={1000}
      />
    </div>
  );
}
