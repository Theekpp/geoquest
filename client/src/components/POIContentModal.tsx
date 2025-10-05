import { Button } from "@/components/ui/button";
import { X, Star, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface POIContentModalProps {
  title: string;
  quote: string;
  description: string;
  points: number;
  imageUrl?: string;
  onClose: () => void;
  onActivate?: () => void;
  onNext?: () => void;
  isActivated?: boolean;
  hasNext?: boolean;
}

export default function POIContentModal({ 
  title, 
  quote, 
  description, 
  points, 
  imageUrl,
  onClose,
  onActivate,
  onNext,
  isActivated = false,
  hasNext = false
}: POIContentModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-t-3xl sm:rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 sm:animate-in sm:fade-in mb-20">
        {/* Handle Bar (mobile) */}
        <div className="flex justify-center pt-3 pb-2 sm:hidden">
          <div className="w-12 h-1 bg-muted rounded-full" />
        </div>

        {/* Close Button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={onClose}
          data-testid="button-close-modal"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Image */}
        {imageUrl && (
          <div className="w-full h-48 sm:h-64 overflow-hidden">
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 pb-24 space-y-6 overflow-y-auto max-h-[calc(85vh-200px)]">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {title}
            </h2>
            
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Москва</span>
              
              <div className="flex items-center gap-1 ml-auto">
                <Star className="w-4 h-4 text-accent fill-accent" />
                <span className="text-sm font-semibold text-foreground">+{points}</span>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className="bg-accent/10 border-l-4 border-accent p-4 rounded-r-lg">
            <p className="font-serif italic text-base text-foreground/90">
              "{quote}"
            </p>
            <p className="text-xs text-muted-foreground mt-2">— Лев Лагин, «Старик Хоттабыч»</p>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          {/* Action */}
          <div className="pt-4 space-y-3">
            {isActivated ? (
              <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 px-4 py-2">
                ✓ Точка пройдена
              </Badge>
            ) : (
              <Button 
                className="w-full" 
                size="lg"
                onClick={onActivate}
                data-testid="button-activate-poi"
              >
                Активировать точку
              </Button>
            )}
            
            {hasNext && (
              <Button 
                variant="outline"
                className="w-full" 
                size="lg"
                onClick={onNext}
                data-testid="button-next-poi"
              >
                Далее →
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
