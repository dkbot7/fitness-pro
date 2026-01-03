'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { EQUIPMENT_OPTIONS } from '@fitness-pro/shared';

interface EquipmentSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function EquipmentSelector({ value, onChange }: EquipmentSelectorProps) {
  const toggleEquipment = (equipmentValue: string) => {
    if (value.includes(equipmentValue)) {
      onChange(value.filter((e) => e !== equipmentValue));
    } else {
      onChange([...value, equipmentValue]);
    }
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {EQUIPMENT_OPTIONS.map((equipment) => (
        <Card
          key={equipment.value}
          className={cn(
            'cursor-pointer transition-all hover:border-primary',
            value.includes(equipment.value) && 'border-primary bg-primary/5'
          )}
          onClick={() => toggleEquipment(equipment.value)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">{equipment.label}</span>
              {value.includes(equipment.value) && (
                <span className="text-primary">✓</span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
