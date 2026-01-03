'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GoalSelectorProps {
  value: string;
  onChange: (value: 'lose_weight' | 'gain_muscle' | 'maintenance') => void;
}

const goals = [
  {
    value: 'lose_weight' as const,
    title: 'Emagrecer',
    description: 'Perder gordura e definir o corpo',
    icon: '🔥',
  },
  {
    value: 'gain_muscle' as const,
    title: 'Ganhar Massa',
    description: 'Aumentar força e massa muscular',
    icon: '💪',
  },
  {
    value: 'maintenance' as const,
    title: 'Manter Forma',
    description: 'Manter saúde e condicionamento',
    icon: '✨',
  },
];

export function GoalSelector({ value, onChange }: GoalSelectorProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {goals.map((goal) => (
        <Card
          key={goal.value}
          className={cn(
            'cursor-pointer transition-all hover:border-primary',
            value === goal.value && 'border-primary bg-primary/5'
          )}
          onClick={() => onChange(goal.value)}
        >
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-3">{goal.icon}</div>
            <h3 className="font-semibold text-lg mb-2">{goal.title}</h3>
            <p className="text-sm text-muted-foreground">{goal.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
