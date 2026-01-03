'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FrequencySelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const frequencies = [
  { value: 2, label: '2x/semana', description: 'Full body' },
  { value: 3, label: '3x/semana', description: 'Upper/Lower/Full' },
  { value: 4, label: '4x/semana', description: 'Upper/Lower split' },
  { value: 5, label: '5x/semana', description: 'Push/Pull/Legs' },
  { value: 6, label: '6x/semana', description: 'PPL 2x' },
];

export function FrequencySelector({ value, onChange }: FrequencySelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {frequencies.map((freq) => (
        <Card
          key={freq.value}
          className={cn(
            'cursor-pointer transition-all hover:border-primary',
            value === freq.value && 'border-primary bg-primary/5'
          )}
          onClick={() => onChange(freq.value)}
        >
          <CardContent className="p-4">
            <div className="font-semibold">{freq.label}</div>
            <div className="text-sm text-muted-foreground">{freq.description}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
