'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LIMITATIONS_OPTIONS } from '@fitness-pro/shared';

interface LimitationsSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function LimitationsSelector({ value, onChange }: LimitationsSelectorProps) {
  const toggleLimitation = (limitationValue: string) => {
    if (value.includes(limitationValue)) {
      onChange(value.filter((l) => l !== limitationValue));
    } else {
      onChange([...value, limitationValue]);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Selecione qualquer limitação física ou lesão que devemos considerar (opcional)
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {LIMITATIONS_OPTIONS.map((limitation) => (
          <Card
            key={limitation.value}
            className={cn(
              'cursor-pointer transition-all hover:border-primary',
              value.includes(limitation.value) && 'border-primary bg-primary/5'
            )}
            onClick={() => toggleLimitation(limitation.value)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{limitation.label}</span>
                {value.includes(limitation.value) && (
                  <span className="text-primary">✓</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
