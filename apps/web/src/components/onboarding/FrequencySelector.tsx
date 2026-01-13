'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FrequencySelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const frequencies = [
  { value: 2, label: '2x/semana' },
  { value: 3, label: '3x/semana' },
  { value: 4, label: '4x/semana' },
  { value: 5, label: '5x/semana' },
  { value: 6, label: '6x/semana' },
  { value: 7, label: '7x/semana' },
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
          <CardContent className="p-4 text-center">
            <div className="font-semibold">{freq.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
