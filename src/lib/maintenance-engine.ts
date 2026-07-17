export type MaintenanceItem = {
  name: string;
  intervalKm: number;
  intervalMonths: number;
  description: string;
};

export function generateMaintenanceGuide(
  brand: string,
  engine: string,
  fuelType: string,
  distribucion: string
): MaintenanceItem[] {
  const items: MaintenanceItem[] = [
    { name: "Aceite y filtro de aceite", intervalKm: 15000, intervalMonths: 12, description: "Cambio de aceite motor y filtro" },
    { name: "Filtro de aire", intervalKm: 30000, intervalMonths: 24, description: "Filtro de admisión de aire" },
    { name: "Filtro de habitáculo", intervalKm: 20000, intervalMonths: 12, description: "Filtro de polen/climatización" },
    { name: "Líquido de frenos", intervalKm: 40000, intervalMonths: 24, description: "Purgado y cambio de líquido de frenos" },
    { name: "Refrigerante", intervalKm: 60000, intervalMonths: 48, description: "Cambio de líquido refrigerante" },
    { name: "Pastillas y discos de freno", intervalKm: 35000, intervalMonths: 36, description: "Revisión/sustitución según desgaste" },
  ];

  if (fuelType === "DIESEL") {
    items.push({ name: "Filtro de combustible", intervalKm: 30000, intervalMonths: 24, description: "Filtro de gasoil" });
    items.push({ name: "Inyectores", intervalKm: 100000, intervalMonths: 96, description: "Revisión de inyectores diésel" });
  } else if (fuelType === "GASOLINA") {
    items.push({ name: "Bujías", intervalKm: 40000, intervalMonths: 48, description: "Sustitución de bujías" });
  }

  const belt = distribucion.toLowerCase().includes("correa");
  items.push({
    name: "Distribución",
    intervalKm: belt ? 100000 : 150000,
    intervalMonths: belt ? 60 : 96,
    description: belt ? "Cambio de correa de distribución (y bomba de agua si aplica)" : "Revisión de cadena de distribución y tensor",
  });

  return items;
}

export type MaintenanceStatus = "sin_registro" | "ok" | "proximo" | "atrasado";

export type MaintenanceLogEntry = {
  item: string;
  mileage: number;
  date: string;
  notes?: string | null;
};

export type ItemStatus = {
  item: MaintenanceItem;
  status: MaintenanceStatus;
  lastMileage: number | null;
  lastDate: string | null;
  nextDueKm: number | null;
  nextDueDate: string | null;
};

function addMonths(dateStr: string, months: number): Date {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d;
}

export function computeItemStatus(
  item: MaintenanceItem,
  logs: MaintenanceLogEntry[],
  currentMileage: number,
  now: Date = new Date()
): ItemStatus {
  const relevant = logs
    .filter((l) => l.item === item.name)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const last = relevant[0];

  if (!last) {
    return { item, status: "sin_registro", lastMileage: null, lastDate: null, nextDueKm: null, nextDueDate: null };
  }

  const nextDueKm = last.mileage + item.intervalKm;
  const nextDueDateObj = addMonths(last.date, item.intervalMonths);
  const nextDueDate = nextDueDateObj.toISOString().slice(0, 10);

  const remainingKm = nextDueKm - currentMileage;
  const remainingDays = Math.floor((nextDueDateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const remaining = Math.min(remainingKm, remainingDays * 30);

  let status: MaintenanceStatus;
  if (remainingKm <= 0 || remainingDays <= 0) status = "atrasado";
  else if (remaining <= 1500 || remainingDays <= 30) status = "proximo";
  else status = "ok";

  return { item, status, lastMileage: last.mileage, lastDate: last.date, nextDueKm, nextDueDate };
}
