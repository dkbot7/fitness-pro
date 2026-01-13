'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { EQUIPMENT_OPTIONS } from '@fitness-pro/shared';

interface EquipmentSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  otherEquipment?: string;
  onOtherEquipmentChange?: (value: string) => void;
}

export function EquipmentSelector({ value, onChange, otherEquipment, onOtherEquipmentChange }: EquipmentSelectorProps) {
  const toggleEquipment = (equipmentValue: string) => {
    if (value.includes(equipmentValue)) {
      onChange(value.filter((e) => e !== equipmentValue));
    } else {
      onChange([...value, equipmentValue]);
    }
  };

  return (
    <div className="space-y-4">
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

      {/* Campo para outros equipamentos */}
      <div className="space-y-2">
        <label htmlFor="otherEquipment" className="text-sm font-medium text-gray-700">
          Outros equipamentos (opcional)
        </label>
        <textarea
          id="otherEquipment"
          value={otherEquipment || ''}
          onChange={(e) => onOtherEquipmentChange?.(e.target.value)}
          placeholder="Descreva outros equipamentos que você possui e que não estão listados acima..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent min-h-[80px] resize-y"
          maxLength={500}
        />
        <p className="text-xs text-gray-500">
          {(otherEquipment?.length || 0)}/500 caracteres
        </p>
      </div>
    </div>
  );
}
