import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LocationErrorBannerProps {
  error: string | null;
}

export default function LocationErrorBanner({ error }: LocationErrorBannerProps) {
  if (!error) return null;

  return (
    <div className="fixed top-16 left-4 right-4 z-40 animate-in slide-in-from-top duration-300">
      <Alert variant="destructive" className="bg-destructive/90 backdrop-blur-md border-destructive shadow-lg">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="ml-2 text-sm font-medium text-destructive-foreground">
          {error}
        </AlertDescription>
      </Alert>
    </div>
  );
}
