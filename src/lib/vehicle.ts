export const FUEL_TYPES = ["GASOLINA", "DIESEL", "HIBRIDO", "ELECTRICO", "GLP_GNC"] as const;
export const TRANSMISSIONS = ["MANUAL", "AUTOMATICA"] as const;

export type FuelType = (typeof FUEL_TYPES)[number];
export type Transmission = (typeof TRANSMISSIONS)[number];
