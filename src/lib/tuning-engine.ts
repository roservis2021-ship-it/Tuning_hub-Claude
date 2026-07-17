import { getEngineCodes } from "@/lib/car-catalog";

export type Aspiracion = "Atmosférico" | "Turbo" | "Híbrido" | "Eléctrico";

const TURBO_MARKERS = [
  "TSI", "TFSI", "T-GDI", "TGDI", "ECOBOOST", "BOOSTERJET", "PURETECH", "TCE",
  "DIG-T", "IG-T", "VTEC TURBO", "TURBO", "TDI", "CDTI", "BLUEHDI", "CRDI",
  "DCI", "HDI", "D-4D", "CTDI", "I-DTEC", "MULTIJET", "1.8T", "1.4T", "2.0T",
  "MPS", "OPC", "VXR", "T3", "T4",
];

export function deriveAspiracion(engine: string, fuelType: string): Aspiracion {
  if (fuelType === "ELECTRICO") return "Eléctrico";
  if (fuelType === "DIESEL") return "Turbo";
  if (fuelType === "HIBRIDO") {
    const upper = engine.toUpperCase();
    return TURBO_MARKERS.some((m) => upper.includes(m)) ? "Híbrido" : "Híbrido";
  }
  const upper = engine.toUpperCase();
  return TURBO_MARKERS.some((m) => upper.includes(m)) ? "Turbo" : "Atmosférico";
}

const PERFORMANCE_MARKERS = [
  "GTI", "CUPRA", " R ", " R", "RS", "ST", "M3", "M340I", "M135I", "M40I",
  "AMG", "TYPE R", "JCW", "MPS", "OPC", "VXR", "GR",
];

function parseExplicitFigure(engine: string): number | null {
  const cvMatch = engine.match(/(\d{2,3})\s*cv/i);
  if (cvMatch) return Number(cvMatch[1]);
  const kwMatch = engine.match(/(\d{2,3})\s*kw/i);
  if (kwMatch) return Math.round(Number(kwMatch[1]) * 1.359);
  return null;
}

function parseDisplacement(engine: string): number | null {
  const match = engine.match(/(\d\.\d)/);
  return match ? Number(match[1]) : null;
}

function isHighPerformance(engine: string): boolean {
  const upper = ` ${engine.toUpperCase()} `;
  return PERFORMANCE_MARKERS.some((m) => upper.includes(m));
}

export type PowerEstimate = { label: string; low: number; high: number };

export function estimatePower(engine: string, fuelType: string, aspiracion: Aspiracion): PowerEstimate {
  const explicit = parseExplicitFigure(engine);
  if (explicit) {
    return { label: `${explicit} CV`, low: explicit, high: explicit };
  }

  if (aspiracion === "Eléctrico") {
    return { label: "120-230 CV (según versión)", low: 120, high: 230 };
  }
  if (aspiracion === "Híbrido") {
    return { label: "140-200 CV sistema combinado (estimado)", low: 140, high: 200 };
  }

  const displacement = parseDisplacement(engine) ?? 1.6;
  let cvPerLiter = 68;
  if (aspiracion === "Turbo" && fuelType === "DIESEL") cvPerLiter = 85;
  else if (aspiracion === "Turbo") cvPerLiter = 115;

  let low = Math.round(displacement * cvPerLiter * 0.9);
  let high = Math.round(displacement * cvPerLiter * 1.15);

  if (isHighPerformance(engine)) {
    low = Math.round(low * 1.5);
    high = Math.round(high * 1.9);
  }

  return { label: `${low}-${high} CV (estimado)`, low, high };
}

export function estimateTorque(power: PowerEstimate, fuelType: string, aspiracion: Aspiracion): string {
  let factor = 1.0;
  if (aspiracion === "Turbo" && fuelType === "DIESEL") factor = 2.2;
  else if (aspiracion === "Turbo") factor = 1.35;
  else if (aspiracion === "Híbrido" || aspiracion === "Eléctrico") factor = 1.6;

  const low = Math.round((power.low * factor) / 10) * 10;
  const high = Math.round((power.high * factor) / 10) * 10;
  return low === high ? `${low} Nm (estimado)` : `${low}-${high} Nm (estimado)`;
}

const VAG_BRANDS = ["Volkswagen", "SEAT", "Cupra", "Audi", "Skoda"];

export function deriveDistribucion(brand: string, engine: string, fuelType: string): string {
  const upper = engine.toUpperCase();

  if (VAG_BRANDS.includes(brand)) {
    if (fuelType === "DIESEL") {
      if (upper.includes("1.9 TDI") || upper.includes("1.6 TDI") && upper.includes("EA1")) {
        return "Correa de distribución — cambiar cada 90.000-120.000 km";
      }
      return "Cadena de distribución (motores TDI recientes) — revisar tensor cada 150.000-180.000 km";
    }
    if (upper.includes("TSI") || upper.includes("TFSI") || upper.includes("1.8T")) {
      return "Cadena de distribución — vigilar estiramiento y tensor cada 100.000-120.000 km";
    }
    return "Correa de distribución — cambiar cada 60.000-90.000 km (motores atmosféricos antiguos)";
  }

  if (brand === "Peugeot" || brand === "Citroën") {
    if (upper.includes("PURETECH")) {
      return "Correa húmeda (en baño de aceite) — riesgo conocido de degradación prematura, vigilar cada 60.000-80.000 km";
    }
    return "Correa de distribución — cambiar cada 120.000-160.000 km según manual";
  }

  if (brand === "Renault" || brand === "Dacia") {
    if (upper.includes("TCE") || upper.includes("SCE")) {
      return "Cadena de distribución — vigilar tensor con alto kilometraje";
    }
    return "Correa de distribución — cambiar cada 100.000-120.000 km";
  }

  if (brand === "Ford") {
    if (upper.includes("ECOBOOST") && (upper.includes("1.0") || upper.includes("1.5"))) {
      return "Cadena de distribución — atención: problema conocido de estiramiento en motores EcoBoost pequeños";
    }
    if (fuelType === "DIESEL") return "Correa de distribución — cambiar cada 120.000-160.000 km";
    return "Cadena de distribución — mantenimiento mínimo";
  }

  if (["Hyundai", "Kia"].includes(brand)) {
    if (fuelType === "DIESEL" && (upper.includes("CRDI"))) {
      return "Correa de distribución — cambiar cada 90.000-120.000 km";
    }
    return "Cadena de distribución";
  }

  if (["Toyota", "Honda", "Mazda", "Nissan", "Suzuki"].includes(brand)) {
    return "Cadena de distribución — mantenimiento mínimo, vigilar tensor con alto kilometraje";
  }

  if (["BMW", "Mercedes-Benz", "Volvo", "MINI"].includes(brand)) {
    return "Cadena de distribución — vigilar guías y tensor de cadena con alto kilometraje";
  }

  return "Consultar manual del fabricante";
}

export function deriveCentralita(brand: string, fuelType: string): string {
  if (VAG_BRANDS.includes(brand)) {
    return fuelType === "DIESEL" ? "Bosch EDC17 (familia)" : "Bosch MED17 (familia)";
  }
  if (["Peugeot", "Citroën"].includes(brand)) return "Bosch / Continental (según motor)";
  if (["Renault", "Dacia"].includes(brand)) return "Continental / Siemens (según motor)";
  if (brand === "Ford") return fuelType === "DIESEL" ? "Ford EEC-V / Bosch EDC (según motor)" : "Bosch MG1 / Ford EEC-V";
  if (["Toyota", "Honda", "Mazda", "Nissan", "Suzuki"].includes(brand)) return "Denso (fabricante original)";
  if (["Hyundai", "Kia"].includes(brand)) return "Bosch / Continental (según motor)";
  if (["BMW"].includes(brand)) return "Bosch MEVD / MG1 (según motor)";
  if (brand === "Mercedes-Benz") return "Bosch MED / EDC (según motor)";
  if (brand === "Volvo") return "Bosch MED17 (familia)";
  return "Depende del proveedor OEM del modelo";
}

export function deriveCodigoMotor(brand: string, engine: string, fuelType: string): string {
  const upper = engine.toUpperCase();

  if (VAG_BRANDS.includes(brand)) {
    if (fuelType === "DIESEL") {
      if (upper.includes("1.9 TDI")) return "Familia EA188/ALH (TDI pre common-rail)";
      return "Familia EA288 (TDI common-rail reciente)";
    }
    if (upper.includes("1.0") || upper.includes("1.2") || (upper.includes("1.5") && upper.includes("TSI"))) {
      return "Familia EA211";
    }
    if (upper.includes("1.4") || upper.includes("1.8T") || upper.includes("2.0 TSI") || upper.includes("2.0 TFSI")) {
      return "Familia EA888";
    }
    if (upper.includes("VR6")) return "Familia VR6 (EA390)";
    return "Familia EA (VAG genérico)";
  }

  if (brand === "Renault" || brand === "Dacia") {
    if (upper.includes("DCI") && upper.includes("1.5")) return "Familia K9K";
    if (upper.includes("DCI") && upper.includes("2.0")) return "Familia M9R";
    if (upper.includes("TCE")) return "Familia H4Bt / H5Ht (según cilindrada)";
    return "Familia genérica Renault";
  }

  if (["Peugeot", "Citroën"].includes(brand)) {
    if (upper.includes("PURETECH")) return "Familia EB2 (PureTech)";
    if (upper.includes("BLUEHDI") || upper.includes("HDI")) return "Familia DV / DW (según cilindrada)";
    return "Familia genérica PSA";
  }

  if (brand === "Ford" && upper.includes("ECOBOOST")) return "Familia EcoBoost (Sigma/Fox)";

  if (brand === "Toyota" && (upper.includes("HYBRID"))) return "Familia de motor híbrido Toyota (serie ZR/A25A)";

  return "No disponible — consulta la ficha técnica oficial";
}

const RWD_BRANDS = ["BMW"];

const AWD_MODELS: Record<string, string[]> = {
  BMW: ["X1", "X3"],
  Audi: ["Q3", "Q5"],
  Volvo: ["XC60", "XC90"],
};

const FWD_WITH_4X4_OPTION: Record<string, string[]> = {
  Audi: ["A1", "A3", "A4"],
  Volvo: ["XC40"],
  MINI: ["Countryman"],
  Jeep: ["Renegade", "Compass"],
  Dacia: ["Duster"],
  Suzuki: ["Vitara", "S-Cross"],
  Fiat: ["500X"],
  Nissan: ["Qashqai", "X-Trail"],
  Skoda: ["Karoq", "Kodiaq"],
  Toyota: ["RAV4", "C-HR"],
  Honda: ["CR-V"],
};

export function deriveTraccion(brand: string, model: string): string {
  if (AWD_MODELS[brand]?.includes(model)) {
    return "Total (AWD/xDrive/quattro) — configuración habitual en este modelo";
  }
  if (RWD_BRANDS.includes(brand)) {
    return "Trasera (RWD); xDrive (4x4) disponible en algunas versiones";
  }
  if (FWD_WITH_4X4_OPTION[brand]?.includes(model)) {
    return "Delantera (FWD); tracción total (4x4) opcional según versión";
  }
  return "Delantera (FWD)";
}

export type VehicleSpecs = {
  aspiracion: Aspiracion;
  potencia: PowerEstimate;
  par: string;
  distribucion: string;
  centralita: string;
  codigoMotor: string;
  traccion: string;
};

export function computeSpecs(
  brand: string,
  model: string,
  engine: string,
  fuelType: string,
  motorCode?: string
): VehicleSpecs {
  const aspiracion = deriveAspiracion(engine, fuelType);
  let potencia = estimatePower(engine, fuelType, aspiracion);
  const distribucion = deriveDistribucion(brand, engine, fuelType);
  const centralita = deriveCentralita(brand, fuelType);
  let codigoMotor = deriveCodigoMotor(brand, engine, fuelType);
  const traccion = deriveTraccion(brand, model);

  if (motorCode) {
    const known = getEngineCodes(engine).find((c) => c.code === motorCode);
    if (known) {
      const parsed = Number(known.power.match(/\d+/)?.[0]);
      if (!Number.isNaN(parsed)) {
        potencia = { label: known.power, low: parsed, high: parsed };
      }
      codigoMotor = motorCode;
    }
  }

  const par = estimateTorque(potencia, fuelType, aspiracion);
  return { aspiracion, potencia, par, distribucion, centralita, codigoMotor, traccion };
}

export type ModStage = {
  title: string;
  items: string[];
  note?: string;
};

export function generateModPlan(params: {
  aspiracion: Aspiracion;
  objectives: string[];
  mileage: number;
  potencia: PowerEstimate;
}): ModStage[] {
  const { aspiracion, objectives, mileage } = params;
  const stages: ModStage[] = [];
  const highMileage = mileage >= 150000;
  const wantsDaily = objectives.includes("DIARIO");
  const wantsTramos = objectives.includes("TRAMOS");
  const wantsCircuito = objectives.includes("CIRCUITO");
  const wantsCompeticion = objectives.includes("COMPETICION");

  if (highMileage) {
    stages.push({
      title: "Etapa 0 — Puesta a punto previa",
      items: [
        "Diagnóstico de compresión y estanqueidad del motor antes de tocar potencia",
        "Revisión de distribución (correa/cadena) si no se ha cambiado recientemente",
        "Sustitución de líquidos, filtros y bujías/inyectores según kilometraje",
        "Revisión de soportes de motor y estado de la transmisión",
      ],
      note: "Con más de 150.000 km, cualquier plan de potencia debe partir de un motor en buen estado. Modificar un motor desgastado multiplica el riesgo de avería.",
    });
  }

  if (aspiracion === "Turbo") {
    stages.push({
      title: "Etapa 1 — Reprogramación ECU (Stage 1)",
      items: [
        "Remap Stage 1 sobre software original (sin cambios físicos)",
        "Filtro de aire de alto flujo",
        "Ganancia típica: +20-40 CV y +30-60 Nm según motor",
      ],
      note: "Es la modificación con mejor relación coste/beneficio y menor riesgo mecánico.",
    });
  } else if (aspiracion === "Atmosférico") {
    stages.push({
      title: "Etapa 1 — Optimización básica",
      items: [
        "Admisión de aire directa/deportiva",
        "Línea de escape deportiva (colector + silencioso)",
        "Reprogramación ligera de la centralita (ganancia modesta, +5-10 CV)",
      ],
      note: "Los motores atmosféricos tienen mucho menos margen de reprogramación que los turbo; el grueso de la ganancia viene de admisión/escape.",
    });
  } else {
    stages.push({
      title: "Etapa 1 — Ajustes ligeros",
      items: [
        "Neumáticos de mayor grip",
        "Filtro de aire de alto flujo",
        "Revisión de la gestión de baterías/potencia si es híbrido o eléctrico",
      ],
      note: "Los sistemas híbridos y eléctricos tienen mucho menos recorrido de modificación de potencia por el momento; el margen de mejora está más en chasis y frenos.",
    });
  }

  if (wantsDaily && !wantsTramos && !wantsCircuito && !wantsCompeticion) {
    stages.push({
      title: "Etapa 2 — Confort y fiabilidad",
      items: [
        "Mantener remap conservador orientado a suavidad, no a máxima potencia",
        "Amortiguación de confort de calidad (sin bajar excesivamente la altura)",
        "Insonorización y neumáticos silenciosos",
      ],
    });
  }

  if (wantsTramos) {
    stages.push({
      title: "Etapa 2 — Manejo en carretera abierta",
      items: [
        "Suspensión deportiva (muelles progresivos o coilovers de calle)",
        "Barras estabilizadoras delantera/trasera",
        "Neumáticos de altas prestaciones",
        "Discos y pastillas de freno de mayor rendimiento",
      ],
    });
  }

  if (wantsCircuito || wantsCompeticion) {
    stages.push({
      title: `Etapa 2 — Preparación para ${wantsCompeticion ? "competición" : "circuito"}`,
      items: [
        "Kit de frenos de altas prestaciones (discos ventilados + pastillas de pista)",
        "Coilovers ajustables en dureza y altura",
        "Refuerzo de chasis (barras de torreta, subchasis)",
        "Refrigeración adicional (radiador de aceite, intercooler si aplica)",
        wantsCompeticion
          ? "Jaula antivuelco y asientos/arneses homologados para competición reglada"
          : "Asientos deportivos y arnés de 4/5 puntos para track days",
      ],
      note: aspiracion === "Turbo"
        ? "Si se sube a Stage 2, revisa embrague, inyectores y sistema de admisión de aire para soportar el par extra."
        : undefined,
    });
  }

  if (aspiracion === "Turbo" && (wantsCircuito || wantsCompeticion) && !highMileage) {
    stages.push({
      title: "Etapa 3 — Stage 2/3 (uso intensivo)",
      items: [
        "Intercooler de mayor capacidad",
        "Turbo de mayor caudal (según objetivo de potencia)",
        "Sistema de inyección de combustible reforzado",
        "Embrague reforzado o volante bimasa por uno rígido",
      ],
      note: "Esta etapa exige un motor sano y mantenimiento estricto; no recomendable si el motor no ha pasado una revisión completa reciente.",
    });
  }

  return stages;
}

export function generateRisks(params: {
  aspiracion: Aspiracion;
  objectives: string[];
  mileage: number;
  stages: ModStage[];
}): string[] {
  const { aspiracion, mileage, stages } = params;
  const risks: string[] = [
    "Modificar el motor o la centralita anula la garantía del fabricante si el vehículo todavía la tiene.",
    "En España, cualquier reprogramación o cambio de escape/suspensión que altere las características homologadas requiere pasar por ITV con ficha de reforma; circular sin homologar es ilegal y puede anular el seguro en caso de siniestro.",
  ];

  if (mileage >= 150000) {
    risks.push(
      "Con este kilometraje, aumentar potencia sin revisar antes el estado del motor incrementa notablemente el riesgo de fallos (juntas, turbo, distribución)."
    );
  }

  if (aspiracion === "Turbo") {
    risks.push(
      "Subir potencia en un motor turbo incrementa el estrés térmico y de presión sobre turbo, juntas e inyectores; sin soporte adecuado (intercooler, inyección), el riesgo de avería sube con cada etapa."
    );
  }

  if (stages.some((s) => s.title.includes("Etapa 3"))) {
    risks.push(
      "Las etapas Stage 2/3 exigen revisar la capacidad del embrague y la transmisión: un aumento grande de par puede dañar componentes no preparados para ello."
    );
  }

  risks.push(
    "El seguro del vehículo puede no cubrir siniestros si las modificaciones no están declaradas a la aseguradora."
  );

  return risks;
}

export function generateMaintenance(params: {
  aspiracion: Aspiracion;
  mileage: number;
  stages: ModStage[];
}): string[] {
  const { aspiracion, stages } = params;
  const maintenance: string[] = [
    "Cambios de aceite más frecuentes de lo estándar (cada 7.500-10.000 km en uso exigente en vez del intervalo de fábrica).",
  ];

  if (aspiracion === "Turbo") {
    maintenance.push("Vigilar el estado del turbo y del intercooler; revisar fugas de aceite/presión periódicamente.");
  }

  maintenance.push("Revisar el estado de la distribución (correa o cadena) según la familia de motor antes de subir de etapa.");

  if (stages.some((s) => s.title.includes("Circuito") || s.title.includes("competición"))) {
    maintenance.push("Revisar discos, pastillas y líquido de frenos tras cada track day (desgaste acelerado por uso en pista).");
    maintenance.push("Comprobar el estado de neumáticos y presiones antes y después de cada sesión.");
  }

  if (stages.some((s) => s.title.includes("Etapa 2")) || stages.some((s) => s.title.includes("Etapa 3"))) {
    maintenance.push("Revisar el embrague periódicamente si se ha aumentado el par motor de forma notable.");
  }

  maintenance.push("Mantener un registro de las modificaciones y sus fechas para facilitar el mantenimiento y la reventa del vehículo.");

  return maintenance;
}
