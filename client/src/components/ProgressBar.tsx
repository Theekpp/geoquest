interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
}

export default function ProgressBar({ current, max, label }: ProgressBarProps) {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">{label}</span>
          <span className="text-sm text-muted-foreground">
            {current} / {max}
          </span>
        </div>
      )}

      <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
