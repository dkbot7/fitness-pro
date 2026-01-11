/**
 * Equipment mapping from frontend values (English) to database values (Portuguese)
 * This ensures compatibility between user selections and exercise filtering
 */
export const EQUIPMENT_MAPPING: Record<string, string> = {
  // Frontend value → Database value
  full_gym: 'academia_completa',
  bodyweight: 'bodyweight', // Same in both
  dumbbells: 'halteres',
  resistance_bands: 'faixas_elasticas',
  pull_up_bar: 'barra_fixa',
  bench: 'banco',
  barbell: 'barra',
  squat_rack: 'rack',
  cable_machine: 'cabo',
  leg_press_machine: 'leg_press',
  leg_extension_machine: 'cadeira_extensora',
  shoulder_press_machine: 'maquina_desenvolvimento',
} as const;

/**
 * Reverse mapping from database values (Portuguese) to frontend values (English)
 */
export const EQUIPMENT_REVERSE_MAPPING: Record<string, string> = {
  academia_completa: 'full_gym',
  bodyweight: 'bodyweight',
  halteres: 'dumbbells',
  faixas_elasticas: 'resistance_bands',
  barra_fixa: 'pull_up_bar',
  banco: 'bench',
  barra: 'barbell',
  rack: 'squat_rack',
  cabo: 'cable_machine',
  leg_press: 'leg_press_machine',
  cadeira_extensora: 'leg_extension_machine',
  maquina_desenvolvimento: 'shoulder_press_machine',
  // Additional database variants
  cadeira: 'bench', // Some exercises use 'cadeira' for chair/bench
  mesa: 'bench', // Table can be used as bench
  barra_t: 'barbell', // T-bar is a barbell variation
  smith_machine: 'barbell', // Smith machine uses barbell
  roda_abdominal: 'bodyweight', // Ab wheel - treat as bodyweight accessory
  banco_inclinado: 'bench', // Incline bench variant
} as const;

/**
 * Translate user equipment selections from frontend format to database format
 */
export function translateEquipmentToDatabase(frontendEquipment: string[]): string[] {
  return frontendEquipment
    .map(eq => EQUIPMENT_MAPPING[eq] || eq)
    .filter(Boolean);
}

/**
 * Translate database equipment values to frontend format
 */
export function translateEquipmentFromDatabase(databaseEquipment: string[]): string[] {
  return databaseEquipment
    .map(eq => EQUIPMENT_REVERSE_MAPPING[eq] || eq)
    .filter(Boolean);
}
