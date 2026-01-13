'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LIMITATIONS_OPTIONS } from '@fitness-pro/shared';

interface LimitationsSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  limitationsDescription?: string;
  onDescriptionChange?: (value: string) => void;
}

export function LimitationsSelector({ value, onChange, limitationsDescription, onDescriptionChange }: LimitationsSelectorProps) {
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

      {/* Campo para descrever limitações em detalhes */}
      <div className="space-y-2">
        <label htmlFor="limitationsDescription" className="text-sm font-medium text-gray-700">
          Descreva suas limitações físicas em detalhes (opcional)
        </label>
        <textarea
          id="limitationsDescription"
          value={limitationsDescription || ''}
          onChange={(e) => onDescriptionChange?.(e.target.value)}
          placeholder="Descreva qualquer lesão, dor crônica, condição médica ou limitação física que o trainer deve considerar..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent min-h-[100px] resize-y"
          maxLength={1000}
        />
        <p className="text-xs text-gray-500">
          {(limitationsDescription?.length || 0)}/1000 caracteres
        </p>
      </div>
    </div>
  );
}
