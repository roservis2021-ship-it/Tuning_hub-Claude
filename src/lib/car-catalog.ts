export type Generation = {
  code: string;
  label: string;
  years: string;
  engines: string[];
};

type ModelCatalog = Record<string, Generation[]>;

export const CAR_CATALOG: Record<string, ModelCatalog> = {
  SEAT: {
    Ibiza: [
      { code: "1", label: "1ª generación", years: "1984-1993", engines: ["1.2", "1.5", "1.7 Diésel", "System Porsche 1.5 GLX"] },
      { code: "2", label: "2ª generación", years: "1993-2002", engines: ["1.4", "1.6", "1.8 16V GTI", "1.9 TDI", "2.0 16V Cupra"] },
      { code: "3", label: "3ª generación", years: "2002-2008", engines: ["1.2", "1.4", "1.9 TDI", "1.9 TDI Cupra"] },
      { code: "4", label: "4ª generación", years: "2008-2017", engines: ["1.2 TSI", "1.4 TSI", "1.6 TDI", "2.0 TDI Cupra"] },
      { code: "5", label: "5ª generación", years: "2017-presente", engines: ["1.0 MPI", "1.0 TSI", "1.5 TSI", "1.6 TDI"] },
    ],
    León: [
      { code: "1", label: "1ª generación (Typ 1M)", years: "1999-2005", engines: ["1.4", "1.6", "1.8", "1.9 TDI", "1.8T Cupra"] },
      { code: "2", label: "2ª generación (Typ 1P)", years: "2005-2012", engines: ["1.2 TSI", "1.6", "1.9 TDI", "2.0 TDI", "2.0 TFSI Cupra"] },
      { code: "3", label: "3ª generación", years: "2012-2020", engines: ["1.2 TSI", "1.4 TSI", "1.6 TDI", "2.0 TDI", "2.0 TSI Cupra"] },
      { code: "4", label: "4ª generación", years: "2020-presente", engines: ["1.0 TSI", "1.5 TSI", "2.0 TDI", "1.4 eHybrid"] },
    ],
    Arona: [{ code: "1", label: "1ª generación", years: "2017-presente", engines: ["1.0 TSI", "1.5 TSI", "1.6 TDI"] }],
    Ateca: [{ code: "1", label: "1ª generación", years: "2016-presente", engines: ["1.0 TSI", "1.5 TSI", "2.0 TSI Cupra", "2.0 TDI"] }],
    Tarraco: [{ code: "1", label: "1ª generación", years: "2018-presente", engines: ["1.5 TSI", "2.0 TSI", "2.0 TDI"] }],
  },
  Cupra: {
    Formentor: [{ code: "1", label: "1ª generación", years: "2020-presente", engines: ["1.5 TSI", "2.0 TSI", "2.0 TSI VZ5", "2.0 TDI"] }],
    León: [{ code: "1", label: "1ª generación", years: "2020-presente", engines: ["1.5 TSI", "2.0 TSI 300cv", "1.4 eHybrid"] }],
    Ateca: [{ code: "1", label: "1ª generación", years: "2018-2020", engines: ["2.0 TSI 300cv"] }],
    Born: [{ code: "1", label: "1ª generación", years: "2021-presente", engines: ["Eléctrico 150kW", "Eléctrico 170kW", "Eléctrico 77kWh"] }],
  },
  Volkswagen: {
    Golf: [
      { code: "Mk1", label: "Mk1", years: "1974-1983", engines: ["1.1", "1.3", "1.6", "1.6 GTI", "1.8 GTI"] },
      { code: "Mk2", label: "Mk2", years: "1983-1991", engines: ["1.3", "1.6", "1.8 GTI", "1.8 GTI 16V", "G60"] },
      { code: "Mk3", label: "Mk3", years: "1991-1997", engines: ["1.4", "1.6", "1.8", "2.0 GTI", "VR6"] },
      { code: "Mk4", label: "Mk4", years: "1997-2004", engines: ["1.4", "1.6", "1.9 TDI", "1.8T GTI", "3.2 R32"] },
      { code: "Mk5", label: "Mk5", years: "2003-2009", engines: ["1.4 TSI", "1.9 TDI", "2.0 TDI", "2.0 TFSI GTI"] },
      { code: "Mk6", label: "Mk6", years: "2008-2012", engines: ["1.2 TSI", "1.6 TDI", "2.0 TDI", "2.0 TSI GTI"] },
      { code: "Mk7", label: "Mk7", years: "2012-2020", engines: ["1.0 TSI", "1.5 TSI", "2.0 TDI", "2.0 TSI GTI", "2.0 TSI R"] },
      { code: "Mk8", label: "Mk8", years: "2020-presente", engines: ["1.0 TSI", "1.5 TSI", "2.0 TDI", "2.0 TSI GTI", "1.4 eHybrid", "2.0 TSI R"] },
    ],
    Polo: [
      { code: "1", label: "1ª generación", years: "1975-1981", engines: ["0.9", "1.1", "1.3"] },
      { code: "2", label: "2ª generación", years: "1981-1994", engines: ["1.0", "1.3", "1.3 GT", "1.6 GT"] },
      { code: "3", label: "3ª generación", years: "1994-2001", engines: ["1.0", "1.4", "1.6", "1.9 SDI/TDI", "1.6 GTI"] },
      { code: "4", label: "4ª generación", years: "2001-2009", engines: ["1.2", "1.4", "1.9 TDI", "1.8T GTI"] },
      { code: "5", label: "5ª generación", years: "2009-2017", engines: ["1.0 MPI", "1.2 TSI", "1.4 TDI"] },
      { code: "6", label: "6ª generación", years: "2017-presente", engines: ["1.0 MPI", "1.0 TSI", "1.6 TDI", "2.0 TSI GTI"] },
    ],
    Tiguan: [
      { code: "1", label: "1ª generación", years: "2007-2016", engines: ["1.4 TSI", "2.0 TDI"] },
      { code: "2", label: "2ª generación", years: "2016-presente", engines: ["1.5 TSI", "2.0 TSI", "2.0 TDI"] },
    ],
    "T-Roc": [{ code: "1", label: "1ª generación", years: "2017-presente", engines: ["1.0 TSI", "1.5 TSI", "2.0 TSI R", "2.0 TDI"] }],
    Passat: [
      { code: "B5", label: "B5", years: "1996-2005", engines: ["1.6", "1.8T", "1.9 TDI", "2.8 V6"] },
      { code: "B6", label: "B6", years: "2005-2010", engines: ["1.6 FSI", "2.0 TSI", "2.0 TDI"] },
      { code: "B7", label: "B7", years: "2010-2014", engines: ["1.4 TSI", "2.0 TDI"] },
      { code: "B8", label: "B8", years: "2014-presente", engines: ["1.5 TSI", "2.0 TSI", "2.0 TDI", "GTE Híbrido enchufable"] },
    ],
    "T-Cross": [{ code: "1", label: "1ª generación", years: "2018-presente", engines: ["1.0 TSI", "1.5 TSI"] }],
  },
  Renault: {
    Clio: [
      { code: "I", label: "Clio I", years: "1990-1998", engines: ["1.2", "1.4", "1.8 16V", "Williams 2.0"] },
      { code: "II", label: "Clio II", years: "1998-2012", engines: ["1.2", "1.5 dCi", "Sport 172cv"] },
      { code: "III", label: "Clio III", years: "2005-2012", engines: ["1.2 16V", "1.5 dCi", "Sport 2.0 197cv"] },
      { code: "IV", label: "Clio IV", years: "2012-2019", engines: ["0.9 TCe 90cv", "1.2 TCe 120cv", "1.5 dCi", "RS 200cv"] },
      { code: "V", label: "Clio V", years: "2019-presente", engines: ["1.0 TCe 90/100cv", "1.5 dCi", "E-Tech Híbrido 140cv"] },
    ],
    Captur: [
      { code: "1", label: "1ª generación", years: "2013-2019", engines: ["0.9 TCe", "1.5 dCi"] },
      { code: "2", label: "2ª generación", years: "2019-presente", engines: ["1.0 TCe", "1.3 TCe", "E-Tech Híbrido enchufable"] },
    ],
    Megane: [
      { code: "I", label: "Megane I", years: "1995-2002", engines: ["1.4", "1.6", "1.9 dTi", "2.0 16V"] },
      { code: "II", label: "Megane II", years: "2002-2008", engines: ["1.4", "1.6", "1.9 dCi", "2.0 turbo RS 225"] },
      { code: "III", label: "Megane III", years: "2008-2016", engines: ["1.2 TCe", "1.5 dCi", "RS 2.0 265cv"] },
      { code: "IV", label: "Megane IV", years: "2016-presente", engines: ["1.3 TCe", "1.5 dCi", "RS 1.8 300cv"] },
    ],
    Kadjar: [{ code: "1", label: "1ª generación", years: "2015-2022", engines: ["1.3 TCe", "1.5 dCi", "1.7 dCi"] }],
    Arkana: [{ code: "1", label: "1ª generación", years: "2021-presente", engines: ["1.3 TCe", "E-Tech Híbrido 145cv"] }],
    Austral: [{ code: "1", label: "1ª generación", years: "2022-presente", engines: ["1.3 TCe mild hybrid", "E-Tech Híbrido 200/230cv"] }],
  },
  Dacia: {
    Sandero: [
      { code: "2", label: "2ª generación", years: "2012-2020", engines: ["1.2 75cv", "0.9 TCe 90cv", "1.5 dCi 90cv"] },
      { code: "3", label: "3ª generación", years: "2020-presente", engines: ["1.0 SCe 65cv", "1.0 TCe 90/100cv", "1.0 TCe GLP"] },
    ],
    Duster: [
      { code: "1", label: "1ª generación", years: "2010-2017", engines: ["1.6 105cv", "1.5 dCi 90/110cv"] },
      { code: "2", label: "2ª generación", years: "2018-presente", engines: ["1.0 TCe 90/100/130cv", "1.5 dCi 115cv", "1.3 TCe 150cv"] },
    ],
    Spring: [{ code: "1", label: "1ª generación", years: "2021-presente", engines: ["Eléctrico 45cv", "Eléctrico 65cv"] }],
    Jogger: [{ code: "1", label: "1ª generación", years: "2022-presente", engines: ["1.0 TCe 100/110cv", "1.6 Hybrid 140cv"] }],
  },
  Toyota: {
    Corolla: [
      { code: "E100", label: "7ª generación", years: "1991-1997", engines: ["1.3", "1.6", "2.0 GTI"] },
      { code: "E110", label: "8ª generación", years: "1997-2002", engines: ["1.4", "1.6", "2.0 D"] },
      { code: "E120", label: "9ª generación", years: "2002-2007", engines: ["1.4", "1.6", "1.8", "2.0 D-4D"] },
      { code: "E150", label: "10ª generación", years: "2006-2013", engines: ["1.4", "1.6", "1.8", "2.0 D-4D"] },
      { code: "E170", label: "11ª generación", years: "2012-2018", engines: ["1.4 D-4D", "1.6", "1.8 Hybrid"] },
      { code: "E210", label: "12ª generación", years: "2018-presente", engines: ["1.8 Hybrid 122cv", "2.0 Hybrid 196cv", "1.2 Turbo"] },
    ],
    Yaris: [
      { code: "3", label: "3ª generación", years: "2011-2020", engines: ["1.0", "1.33", "1.5 Hybrid", "1.4 D-4D"] },
      { code: "4", label: "4ª generación", years: "2020-presente", engines: ["1.5 Hybrid 116cv", "1.5 Hybrid 130cv GR"] },
    ],
    "C-HR": [
      { code: "1", label: "1ª generación", years: "2016-2023", engines: ["1.2 Turbo", "1.8 Hybrid", "2.0 Hybrid"] },
      { code: "2", label: "2ª generación", years: "2023-presente", engines: ["1.8 Hybrid", "2.0 Hybrid"] },
    ],
    RAV4: [{ code: "5", label: "5ª generación", years: "2019-presente", engines: ["2.5 Hybrid", "2.5 Plug-in Hybrid"] }],
    "Aygo X": [{ code: "1", label: "1ª generación", years: "2022-presente", engines: ["1.0 VVT-i 72cv"] }],
    "Yaris Cross": [{ code: "1", label: "1ª generación", years: "2021-presente", engines: ["1.5 Hybrid 116/130cv"] }],
  },
  Peugeot: {
    "208": [
      { code: "I", label: "208 I", years: "2012-2019", engines: ["1.2 VTi", "1.6 e-HDi", "1.6 THP GTi"] },
      { code: "II", label: "208 II", years: "2019-presente", engines: ["1.2 PureTech 75/100/130cv", "1.5 BlueHDi", "Eléctrico e-208"] },
    ],
    "2008": [
      { code: "I", label: "2008 I", years: "2013-2019", engines: ["1.2 PureTech", "1.6 BlueHDi"] },
      { code: "II", label: "2008 II", years: "2019-presente", engines: ["1.2 PureTech", "1.5 BlueHDi", "Eléctrico e-2008"] },
    ],
    "308": [
      { code: "I", label: "308 I", years: "2007-2013", engines: ["1.6 VTi", "2.0 HDi", "1.6 THP GTi"] },
      { code: "II", label: "308 II", years: "2013-2021", engines: ["1.2 PureTech", "1.6 BlueHDi", "1.6 THP GTi"] },
      { code: "III", label: "308 III", years: "2021-presente", engines: ["1.2 PureTech", "1.5 BlueHDi", "Hybrid 225cv"] },
    ],
    "3008": [
      { code: "II", label: "3008 II", years: "2016-2023", engines: ["1.2 PureTech", "1.5 BlueHDi", "Hybrid4 300cv"] },
      { code: "III", label: "3008 III", years: "2023-presente", engines: ["Hybrid 136/195cv", "Eléctrico"] },
    ],
    "5008": [{ code: "II", label: "5008 II", years: "2017-presente", engines: ["1.2 PureTech", "1.5 BlueHDi", "2.0 BlueHDi"] }],
    "508": [{ code: "II", label: "508 II", years: "2018-presente", engines: ["1.6 PureTech", "1.5 BlueHDi", "Hybrid 225/360cv"] }],
  },
  Citroën: {
    C3: [
      { code: "1", label: "1ª generación", years: "2002-2009", engines: ["1.1", "1.4", "1.6 HDi"] },
      { code: "2", label: "2ª generación", years: "2009-2016", engines: ["1.0", "1.4", "1.6 HDi", "1.6 THP"] },
      { code: "3", label: "3ª generación", years: "2016-presente", engines: ["1.2 PureTech", "1.5 BlueHDi"] },
    ],
    C4: [
      { code: "1", label: "1ª generación", years: "2004-2010", engines: ["1.4", "1.6", "2.0 HDi", "VTS 180cv"] },
      { code: "2", label: "2ª generación", years: "2010-2020", engines: ["1.2 PureTech", "1.6 HDi", "2.0 HDi"] },
      { code: "3", label: "3ª generación", years: "2020-presente", engines: ["1.2 PureTech", "1.5 BlueHDi", "Eléctrico ë-C4"] },
    ],
    "C5 Aircross": [{ code: "1", label: "1ª generación", years: "2018-presente", engines: ["1.2 PureTech", "1.5 BlueHDi", "Hybrid 225cv"] }],
    Berlingo: [{ code: "3", label: "3ª generación", years: "2018-presente", engines: ["1.2 PureTech", "1.5 BlueHDi", "Eléctrico ë-Berlingo"] }],
    "C3 Aircross": [{ code: "1", label: "1ª generación", years: "2017-presente", engines: ["1.2 PureTech", "1.5 BlueHDi"] }],
  },
  Opel: {
    Corsa: [
      { code: "C", label: "3ª generación (C)", years: "2000-2006", engines: ["1.0", "1.2", "1.7 CDTI", "1.6 OPC"] },
      { code: "D", label: "4ª generación (D)", years: "2006-2014", engines: ["1.0", "1.2", "1.3 CDTI", "1.6 OPC"] },
      { code: "E", label: "5ª generación (E)", years: "2014-2019", engines: ["1.2", "1.4", "1.4 Turbo", "1.3 CDTI"] },
      { code: "F", label: "6ª generación (F)", years: "2019-presente", engines: ["1.2", "1.2 Turbo", "Eléctrico e-Corsa"] },
    ],
    Astra: [
      { code: "G", label: "Astra G", years: "1998-2004", engines: ["1.4", "1.6", "1.7 CDTI", "2.0 Turbo OPC"] },
      { code: "H", label: "Astra H", years: "2004-2010", engines: ["1.4", "1.6", "1.7 CDTI", "2.0 Turbo OPC"] },
      { code: "J", label: "Astra J", years: "2009-2015", engines: ["1.4 Turbo", "1.6", "1.7 CDTI", "2.0 CDTI"] },
      { code: "K", label: "Astra K", years: "2015-2021", engines: ["1.2 Turbo", "1.4 Turbo", "1.5 Diésel"] },
      { code: "L", label: "Astra L", years: "2021-presente", engines: ["1.2 Turbo", "Hybrid", "Eléctrico"] },
    ],
    Mokka: [{ code: "2", label: "2ª generación", years: "2020-presente", engines: ["1.2 Turbo", "1.5 Diésel", "Eléctrico e-Mokka"] }],
    Crossland: [{ code: "1", label: "1ª generación", years: "2017-presente", engines: ["1.2", "1.2 Turbo", "1.5 Diésel"] }],
    Grandland: [{ code: "1", label: "1ª generación", years: "2017-presente", engines: ["1.2 Turbo", "1.5 Diésel", "Hybrid", "Hybrid4"] }],
  },
  Hyundai: {
    Tucson: [
      { code: "JM", label: "1ª generación (JM)", years: "2004-2009", engines: ["2.0", "2.7 V6", "2.0 CRDi"] },
      { code: "LM", label: "2ª generación / ix35 (LM)", years: "2009-2015", engines: ["1.6", "2.0", "1.7 CRDi", "2.0 CRDi"] },
      { code: "TL", label: "3ª generación (TL)", years: "2015-2020", engines: ["1.6 GDI", "2.0 CRDi"] },
      { code: "NX4", label: "4ª generación (NX4)", years: "2020-presente", engines: ["1.6 T-GDI", "1.6 CRDi", "Hybrid", "Plug-in Hybrid"] },
    ],
    i20: [
      { code: "2", label: "2ª generación", years: "2014-2020", engines: ["1.2", "1.4", "1.1 CRDi"] },
      { code: "3", label: "3ª generación", years: "2020-presente", engines: ["1.0 T-GDI", "1.2 MPI"] },
    ],
    i30: [
      { code: "1", label: "1ª generación", years: "2007-2012", engines: ["1.4", "1.6", "1.6 CRDi"] },
      { code: "2", label: "2ª generación", years: "2012-2017", engines: ["1.4", "1.6", "1.6 CRDi"] },
      { code: "3", label: "3ª generación", years: "2017-presente", engines: ["1.0 T-GDI", "1.4 T-GDI", "1.6 CRDi"] },
    ],
    Kona: [
      { code: "1", label: "1ª generación", years: "2017-2023", engines: ["1.0 T-GDI", "1.6 T-GDI", "Eléctrico"] },
      { code: "2", label: "2ª generación", years: "2023-presente", engines: ["1.0 T-GDI", "Hybrid", "Eléctrico"] },
    ],
    Bayon: [{ code: "1", label: "1ª generación", years: "2021-presente", engines: ["1.0 T-GDI", "1.2 MPI"] }],
  },
  Kia: {
    Sportage: [
      { code: "QL", label: "4ª generación (QL)", years: "2016-2021", engines: ["1.6 GDI", "1.6 CRDi", "2.0 CRDi"] },
      { code: "NQ5", label: "5ª generación (NQ5)", years: "2021-presente", engines: ["1.6 T-GDI", "Hybrid", "Plug-in Hybrid"] },
    ],
    Ceed: [
      { code: "1", label: "1ª generación", years: "2006-2012", engines: ["1.4", "1.6", "1.6 CRDi"] },
      { code: "2", label: "2ª generación", years: "2012-2018", engines: ["1.4", "1.6", "1.6 CRDi"] },
      { code: "3", label: "3ª generación", years: "2018-presente", engines: ["1.0 T-GDI", "1.4 T-GDI", "1.6 CRDi"] },
    ],
    Niro: [
      { code: "1", label: "1ª generación", years: "2016-2022", engines: ["Hybrid", "Plug-in Hybrid", "Eléctrico e-Niro"] },
      { code: "2", label: "2ª generación", years: "2022-presente", engines: ["Hybrid", "Eléctrico"] },
    ],
    Picanto: [{ code: "3", label: "3ª generación", years: "2017-presente", engines: ["1.0", "1.2"] }],
    Stonic: [{ code: "1", label: "1ª generación", years: "2017-presente", engines: ["1.0 T-GDI", "1.4 CRDi"] }],
  },
  Ford: {
    Fiesta: [
      { code: "Mk5", label: "Mk5", years: "1995-2002", engines: ["1.25", "1.4", "1.8 D"] },
      { code: "Mk6", label: "Mk6", years: "2002-2008", engines: ["1.25", "1.4", "1.6 TDCi", "ST 2.0"] },
      { code: "Mk7", label: "Mk7", years: "2008-2017", engines: ["1.25", "1.4", "1.6 TDCi", "1.0 EcoBoost", "ST 1.6"] },
      { code: "Mk8", label: "Mk8", years: "2017-2023", engines: ["1.1", "1.0 EcoBoost", "1.5 TDCi", "ST 1.5 EcoBoost"] },
    ],
    Focus: [
      { code: "1", label: "1ª generación", years: "1998-2004", engines: ["1.4", "1.6", "1.8", "1.8 TDCi", "RS 2.0T"] },
      { code: "2", label: "2ª generación", years: "2004-2011", engines: ["1.4", "1.6", "1.8", "2.0 TDCi", "ST 2.5", "RS 2.5T"] },
      { code: "3", label: "3ª generación", years: "2011-2018", engines: ["1.0 EcoBoost", "1.5 TDCi", "ST 2.0"] },
      { code: "4", label: "4ª generación", years: "2018-presente", engines: ["1.0 EcoBoost", "1.5 EcoBlue", "ST 2.3"] },
    ],
    Puma: [{ code: "1", label: "1ª generación", years: "2019-presente", engines: ["1.0 EcoBoost", "1.0 EcoBoost Híbrido", "ST 1.5 EcoBoost"] }],
    Kuga: [{ code: "3", label: "3ª generación", years: "2019-presente", engines: ["1.5 EcoBoost", "2.0 EcoBlue", "Hybrid", "Plug-in Hybrid"] }],
  },
  Nissan: {
    Qashqai: [
      { code: "J11", label: "2ª generación (J11)", years: "2013-2021", engines: ["1.2 DIG-T", "1.6 dCi", "1.5 dCi"] },
      { code: "J12", label: "3ª generación (J12)", years: "2021-presente", engines: ["1.3 DIG-T", "e-Power"] },
    ],
    Juke: [
      { code: "1", label: "1ª generación", years: "2010-2019", engines: ["1.2 DIG-T", "1.6", "1.5 dCi"] },
      { code: "2", label: "2ª generación", years: "2019-presente", engines: ["1.0 DIG-T", "Hybrid"] },
    ],
    Micra: [
      { code: "K11", label: "3ª generación (K11)", years: "1992-2002", engines: ["1.0", "1.3"] },
      { code: "K12", label: "4ª generación (K12)", years: "2002-2010", engines: ["1.2", "1.4", "1.5 dCi"] },
      { code: "K13", label: "5ª generación (K13)", years: "2010-2017", engines: ["1.2", "1.2 DIG-S"] },
      { code: "K14", label: "6ª generación (K14)", years: "2017-2022", engines: ["1.0", "0.9 IG-T", "1.5 dCi"] },
    ],
    "X-Trail": [
      { code: "T32", label: "3ª generación (T32)", years: "2013-2022", engines: ["1.6 dCi", "1.7 dCi", "2.0 dCi"] },
      { code: "T33", label: "4ª generación (T33)", years: "2022-presente", engines: ["e-Power", "Mild Hybrid"] },
    ],
  },
  Fiat: {
    "500": [
      { code: "1", label: "1ª generación (clásico)", years: "1957-1975", engines: ["500cc bicilíndrico", "594cc bicilíndrico"] },
      { code: "2", label: "2ª generación", years: "2007-presente", engines: ["1.2", "0.9 TwinAir", "Hybrid mild", "500e Eléctrico"] },
    ],
    Panda: [
      { code: "1", label: "1ª generación", years: "1980-2003", engines: ["650", "750", "900", "1.1", "1.7 Diésel"] },
      { code: "2", label: "2ª generación", years: "2003-2012", engines: ["1.1", "1.2", "1.3 Multijet", "100HP 1.4"] },
      { code: "3", label: "3ª generación", years: "2011-presente", engines: ["1.0 Hybrid", "0.9 TwinAir", "1.3 Multijet"] },
    ],
    Tipo: [{ code: "1", label: "1ª generación", years: "2015-presente", engines: ["1.0 Turbo", "1.4", "1.6 Multijet"] }],
    "500X": [{ code: "1", label: "1ª generación", years: "2014-presente", engines: ["1.0 Turbo", "1.3 Turbo", "1.6 Multijet"] }],
  },
  Skoda: {
    Octavia: [
      { code: "1", label: "1ª generación", years: "1996-2010", engines: ["1.6", "1.8T", "1.9 TDI", "RS 1.8T/1.9TDI"] },
      { code: "2", label: "2ª generación", years: "2004-2013", engines: ["1.6", "1.9 TDI", "2.0 TDI", "RS 2.0 TFSI/TDI"] },
      { code: "3", label: "3ª generación", years: "2013-2019", engines: ["1.0 TSI", "1.5 TSI", "2.0 TDI", "RS 2.0 TSI/TDI"] },
      { code: "4", label: "4ª generación", years: "2019-presente", engines: ["1.0 TSI", "1.5 TSI", "2.0 TDI", "RS 2.0 TSI"] },
    ],
    Fabia: [
      { code: "1", label: "1ª generación", years: "1999-2007", engines: ["1.2", "1.4", "1.4 TDI", "1.9 TDI vRS"] },
      { code: "2", label: "2ª generación", years: "2007-2014", engines: ["1.2", "1.2 TSI", "1.6 TDI", "1.4 TSI vRS"] },
      { code: "3", label: "3ª generación", years: "2014-2021", engines: ["1.0 MPI", "1.0 TSI", "1.4 TDI"] },
      { code: "4", label: "4ª generación", years: "2021-presente", engines: ["1.0 MPI", "1.0 TSI"] },
    ],
    Kamiq: [{ code: "1", label: "1ª generación", years: "2019-presente", engines: ["1.0 TSI", "1.5 TSI", "2.0 TDI"] }],
    Karoq: [{ code: "1", label: "1ª generación", years: "2017-presente", engines: ["1.0 TSI", "1.5 TSI", "2.0 TDI"] }],
    Scala: [{ code: "1", label: "1ª generación", years: "2019-presente", engines: ["1.0 TSI", "1.5 TSI", "1.6 TDI"] }],
  },
  BMW: {
    "Serie 1": [
      { code: "E81/E87", label: "E81/E87", years: "2004-2013", engines: ["116i", "118i", "120i", "116d", "120d"] },
      { code: "F20", label: "F20", years: "2011-2019", engines: ["116i", "118i", "120i", "118d", "120d", "M140i"] },
      { code: "F40", label: "F40", years: "2019-presente", engines: ["116i", "118i", "120i", "116d", "118d", "M135i"] },
    ],
    "Serie 3": [
      { code: "E30", label: "E30", years: "1982-1994", engines: ["316i", "318i", "320i", "324d", "324td", "325i", "M3 2.3"] },
      { code: "E36", label: "E36", years: "1990-2000", engines: ["316i", "318i", "320i", "325tds", "328i", "M3 3.0/3.2"] },
      { code: "E46", label: "E46", years: "1998-2007", engines: ["316i", "318i", "320i", "318d", "320d", "330d", "330i", "M3 3.2"] },
      { code: "E90", label: "E90", years: "2005-2013", engines: ["316i", "320i", "330i", "318d", "320d", "325d", "330d", "335d", "M3 4.0 V8"] },
      { code: "F30", label: "F30", years: "2012-2019", engines: ["318i", "320i", "330i", "316d", "318d", "320d", "325d", "330d", "335d", "M340i"] },
      { code: "G20", label: "G20", years: "2019-presente", engines: ["318i", "320i", "330i", "318d", "320d", "330d", "M340i", "M340d"] },
    ],
    X1: [
      { code: "F48", label: "F48", years: "2015-2022", engines: ["sDrive18i", "sDrive20i", "sDrive18d", "xDrive18d", "xDrive20d", "xDrive25d"] },
      { code: "U11", label: "U11", years: "2022-presente", engines: ["sDrive18i", "xDrive20d", "xDrive23d"] },
    ],
    X3: [{ code: "G01", label: "G01", years: "2017-presente", engines: ["sDrive20i", "xDrive20d", "xDrive25d", "xDrive30d", "M40i", "M40d"] }],
    "Serie 2": [{ code: "F44/F22", label: "1ª generación", years: "2014-presente", engines: ["218i", "220i", "218d", "220d", "225d"] }],
  },
  "Mercedes-Benz": {
    "Clase A": [
      { code: "W168", label: "W168", years: "1997-2004", engines: ["A140", "A160", "A170 CDI"] },
      { code: "W169", label: "W169", years: "2004-2012", engines: ["A150", "A160", "A170", "A200 CDI"] },
      { code: "W176", label: "W176", years: "2012-2018", engines: ["A180", "A200", "A200d", "A250", "A45 AMG"] },
      { code: "W177", label: "W177", years: "2018-presente", engines: ["A180", "A200", "A200d", "A35 AMG", "A45 AMG"] },
    ],
    "Clase C": [
      { code: "W202", label: "W202", years: "1993-2000", engines: ["C180", "C200", "C220D", "C36 AMG"] },
      { code: "W203", label: "W203", years: "2000-2007", engines: ["C180", "C200", "C220CDI", "C55 AMG"] },
      { code: "W204", label: "W204", years: "2007-2014", engines: ["C180", "C200", "C220CDI", "C63 AMG"] },
      { code: "W205", label: "W205", years: "2014-2021", engines: ["C180", "C200", "C220d", "C300", "C63 AMG"] },
      { code: "W206", label: "W206", years: "2021-presente", engines: ["C200", "C220d", "C300", "C63 AMG"] },
    ],
    GLA: [{ code: "H247", label: "H247", years: "2020-presente", engines: ["GLA200", "GLA200d", "GLA250", "GLA35 AMG"] }],
    GLC: [
      { code: "X253", label: "X253", years: "2015-2022", engines: ["GLC200", "GLC220d", "GLC300"] },
      { code: "X254", label: "X254", years: "2022-presente", engines: ["GLC200", "GLC220d", "GLC300"] },
    ],
    "Clase B": [{ code: "W247", label: "W247", years: "2011-presente", engines: ["B180", "B200", "B200d"] }],
  },
  Audi: {
    A3: [
      { code: "8L", label: "8L", years: "1996-2003", engines: ["1.6", "1.8T", "1.9 TDI", "S3 1.8T"] },
      { code: "8P", label: "8P", years: "2003-2012", engines: ["1.6", "1.9 TDI", "2.0 TDI", "S3 2.0 TFSI"] },
      { code: "8V", label: "8V", years: "2012-2020", engines: ["1.0 TFSI", "1.5 TFSI", "2.0 TDI", "S3 2.0 TFSI"] },
      { code: "8Y", label: "8Y", years: "2020-presente", engines: ["1.0 TFSI", "1.5 TFSI", "2.0 TDI", "S3 2.0 TFSI"] },
    ],
    A4: [
      { code: "B5", label: "B5", years: "1994-2001", engines: ["1.6", "1.8T", "1.9 TDI", "S4 2.7 biturbo"] },
      { code: "B6/B7", label: "B6/B7", years: "2000-2008", engines: ["1.6", "1.8T", "2.0 TDI", "S4 4.2 V8"] },
      { code: "B9", label: "B9", years: "2015-presente", engines: ["35 TFSI", "40 TFSI", "35 TDI", "40 TDI", "S4"] },
    ],
    Q3: [
      { code: "8U", label: "8U", years: "2011-2018", engines: ["1.4 TFSI", "2.0 TDI"] },
      { code: "F3", label: "F3", years: "2018-presente", engines: ["35 TFSI", "35 TDI", "45 TFSI", "RS Q3"] },
    ],
    Q5: [{ code: "FY", label: "FY", years: "2016-presente", engines: ["40 TDI", "45 TFSI", "55 TFSI e"] }],
    A1: [{ code: "GB", label: "GB", years: "2018-presente", engines: ["25 TFSI", "30 TFSI", "35 TFSI"] }],
  },
  Volvo: {
    XC40: [{ code: "1", label: "1ª generación", years: "2017-presente", engines: ["T3", "T4", "B4 Mild Hybrid", "Recharge Eléctrico"] }],
    XC60: [
      { code: "1", label: "1ª generación", years: "2008-2017", engines: ["2.0T", "2.4D", "T6"] },
      { code: "2", label: "2ª generación", years: "2017-presente", engines: ["B4", "B5", "T8 Recharge Híbrido enchufable"] },
    ],
    XC90: [
      { code: "1", label: "1ª generación", years: "2002-2014", engines: ["2.5T", "D5", "T6"] },
      { code: "2", label: "2ª generación", years: "2014-presente", engines: ["B5", "T8 Recharge Híbrido enchufable"] },
    ],
  },
  Mazda: {
    Mazda2: [{ code: "3", label: "3ª generación", years: "2014-presente", engines: ["1.5 Skyactiv-G 75/90/115cv"] }],
    Mazda3: [
      { code: "1", label: "1ª generación", years: "2003-2009", engines: ["1.6", "2.0", "MPS 2.3 Turbo"] },
      { code: "2", label: "2ª generación", years: "2009-2013", engines: ["1.6", "2.0", "MPS 2.3 Turbo"] },
      { code: "3", label: "3ª generación", years: "2013-2019", engines: ["1.5 Skyactiv-G", "2.0 Skyactiv-G", "2.2 Skyactiv-D"] },
      { code: "4", label: "4ª generación", years: "2019-presente", engines: ["2.0 Skyactiv-G", "2.0 e-Skyactiv X", "1.8 Skyactiv-D"] },
    ],
    "CX-30": [{ code: "1", label: "1ª generación", years: "2019-presente", engines: ["2.0 Skyactiv-G", "2.0 e-Skyactiv X", "1.8 Skyactiv-D"] }],
    "CX-5": [{ code: "2", label: "2ª generación", years: "2017-presente", engines: ["2.0 Skyactiv-G", "2.5 Skyactiv-G", "2.2 Skyactiv-D"] }],
  },
  Honda: {
    Civic: [
      { code: "6", label: "6ª generación", years: "1995-2001", engines: ["1.4", "1.6", "1.6 VTi", "Type R 1.8 VTEC"] },
      { code: "7", label: "7ª generación", years: "2001-2005", engines: ["1.4", "1.6", "1.7 CTDi", "Type R 2.0"] },
      { code: "8", label: "8ª generación", years: "2005-2011", engines: ["1.4", "1.8", "2.2 CTDi", "Type R 2.0"] },
      { code: "9", label: "9ª generación", years: "2011-2017", engines: ["1.4", "1.8", "1.6 i-DTEC", "Type R 2.0 Turbo"] },
      { code: "10", label: "10ª generación", years: "2017-2022", engines: ["1.0 VTEC Turbo", "1.5 VTEC Turbo", "Type R 2.0"] },
      { code: "11", label: "11ª generación", years: "2022-presente", engines: ["e:HEV Hybrid 184cv", "Type R 2.0"] },
    ],
    "HR-V": [{ code: "2", label: "2ª generación", years: "2021-presente", engines: ["e:HEV Hybrid 131cv"] }],
    "CR-V": [
      { code: "5", label: "5ª generación", years: "2018-2023", engines: ["1.5 VTEC Turbo", "Hybrid"] },
      { code: "6", label: "6ª generación", years: "2023-presente", engines: ["Hybrid", "Plug-in Hybrid"] },
    ],
    Jazz: [{ code: "4", label: "4ª generación", years: "2020-presente", engines: ["e:HEV Hybrid 109cv"] }],
  },
  MINI: {
    Cooper: [
      { code: "R50/R56", label: "1ª/2ª generación (MINI moderno)", years: "2001-2014", engines: ["Cooper 1.6", "Cooper S 1.6 Turbo/Supercharged", "John Cooper Works"] },
      { code: "F55/F56", label: "3ª generación", years: "2014-2024", engines: ["Cooper 1.5", "Cooper S 2.0", "John Cooper Works 2.0"] },
      { code: "F66", label: "4ª generación", years: "2024-presente", engines: ["Cooper C", "Cooper S", "Eléctrico E/SE"] },
    ],
    Countryman: [
      { code: "F60", label: "2ª generación", years: "2017-2024", engines: ["Cooper 1.5", "Cooper S 2.0", "Cooper SE Híbrido enchufable"] },
      { code: "U25", label: "3ª generación", years: "2024-presente", engines: ["Cooper C", "Cooper S", "Eléctrico E/SE ALL4"] },
    ],
    Clubman: [{ code: "F54", label: "2ª generación", years: "2015-2023", engines: ["Cooper 1.5", "Cooper S 2.0", "John Cooper Works"] }],
  },
  Jeep: {
    Renegade: [{ code: "1", label: "1ª generación", years: "2014-presente", engines: ["1.0 T3", "1.3 T4", "1.6 Multijet", "4xe Híbrido enchufable"] }],
    Compass: [{ code: "2", label: "2ª generación", years: "2017-presente", engines: ["1.3 T4", "1.5 Hybrid", "4xe Híbrido enchufable"] }],
    Avenger: [{ code: "1", label: "1ª generación", years: "2022-presente", engines: ["1.2 Turbo", "Eléctrico"] }],
  },
  Suzuki: {
    Vitara: [{ code: "4", label: "4ª generación", years: "2015-presente", engines: ["1.4 Boosterjet", "1.6", "Hybrid"] }],
    Swift: [{ code: "4", label: "4ª generación", years: "2017-presente", engines: ["1.2 Dualjet", "1.2 Hybrid", "Sport 1.4 Boosterjet"] }],
    "S-Cross": [{ code: "2", label: "2ª generación", years: "2013-presente", engines: ["1.4 Boosterjet", "1.5 Hybrid"] }],
    Ignis: [{ code: "3", label: "3ª generación", years: "2016-presente", engines: ["1.2 Dualjet Hybrid"] }],
  },
  MG: {
    ZS: [{ code: "1", label: "1ª generación", years: "2017-presente", engines: ["1.0 Turbo", "1.5", "Eléctrico ZS EV"] }],
    MG4: [{ code: "1", label: "1ª generación", years: "2022-presente", engines: ["Eléctrico 51kWh", "Eléctrico 64kWh", "Eléctrico XPower"] }],
    HS: [{ code: "1", label: "1ª generación", years: "2019-presente", engines: ["1.5 Turbo", "Plug-in Hybrid"] }],
  },
};

export const CAR_BRANDS = Object.keys(CAR_CATALOG).sort((a, b) => a.localeCompare(b));

export function getModels(brand: string): string[] {
  return Object.keys(CAR_CATALOG[brand] ?? {});
}

export function getGenerations(brand: string, model: string): Generation[] {
  return CAR_CATALOG[brand]?.[model] ?? [];
}

export type EngineCode = { code: string; power: string };

/**
 * Códigos de motor reales conocidos por denominación comercial, para motores que
 * históricamente se vendieron bajo el mismo nombre con distintas potencias/pares
 * según el código de motor exacto. Cubre las familias más habituales (grupo VAG,
 * BMW diésel, Mercedes CDI, Renault/Dacia dCi, Ford TDCi/EcoBlue, PSA/Fiat diésel,
 * Opel CDTI, Hyundai/Kia CRDi). No es una lista exhaustiva de cada mercado/año.
 */
export const ENGINE_CODES: Record<string, EngineCode[]> = {
  // Grupo VAG — diésel
  "1.9 TDI": [
    { code: "AHU", power: "90 CV" },
    { code: "ALH", power: "110 CV" },
    { code: "AFN", power: "90 CV" },
    { code: "ATD", power: "110 CV" },
    { code: "AJM", power: "115 CV" },
    { code: "ASZ", power: "130 CV" },
    { code: "AUY", power: "100 CV" },
    { code: "BLS", power: "105 CV" },
    { code: "BXE", power: "105 CV" },
    { code: "BJB", power: "90 CV" },
    { code: "BKC", power: "105 CV" },
  ],
  "1.9 TDI Cupra": [
    { code: "ASZ", power: "130 CV" },
    { code: "AJM", power: "150 CV" },
  ],
  "1.9 SDI/TDI": [
    { code: "AEY", power: "68 CV (SDI)" },
    { code: "1Z", power: "90 CV (TDI)" },
    { code: "AHU", power: "90 CV (TDI)" },
  ],
  "1.6 TDI": [
    { code: "CAYA", power: "90 CV" },
    { code: "CAYC", power: "105 CV" },
    { code: "CLHA", power: "90/95 CV" },
    { code: "DCXA", power: "115 CV" },
    { code: "DDAB", power: "116 CV" },
  ],
  "2.0 TDI": [
    { code: "BKD", power: "140 CV" },
    { code: "AZV", power: "140 CV" },
    { code: "BMM", power: "105 CV" },
    { code: "BMN", power: "100 CV" },
    { code: "CBAB", power: "140 CV" },
    { code: "CFFB", power: "150 CV" },
    { code: "CFGB", power: "170 CV" },
    { code: "CJAA", power: "105 CV" },
    { code: "CUNA", power: "150 CV" },
    { code: "DTUA", power: "150 CV" },
    { code: "DTSB", power: "200 CV" },
  ],
  "2.0 TDI Cupra": [
    { code: "CFGB", power: "170 CV" },
    { code: "CFHC", power: "184 CV" },
  ],
  // Grupo VAG — gasolina turbo
  "1.8T": [
    { code: "AGU", power: "150 CV" },
    { code: "AUQ", power: "180 CV" },
    { code: "AWU", power: "150 CV" },
    { code: "APP", power: "150 CV" },
    { code: "AWP", power: "150 CV" },
    { code: "ARZ", power: "180 CV" },
    { code: "ARY", power: "150 CV" },
  ],
  "1.8T GTI": [
    { code: "AGU", power: "150 CV" },
    { code: "APP", power: "150 CV" },
    { code: "AWU", power: "150 CV" },
  ],
  "1.8T Cupra": [
    { code: "AUQ", power: "180 CV" },
    { code: "ARZ", power: "180 CV" },
  ],
  "1.4 TSI": [
    { code: "CAXA", power: "122 CV" },
    { code: "CTHE", power: "125 CV" },
    { code: "CZCA", power: "125 CV" },
    { code: "CHPA", power: "150 CV" },
    { code: "CZDA", power: "150 CV" },
  ],
  "1.4 TSI vRS": [
    { code: "CTHE", power: "140 CV" },
    { code: "CHPA", power: "150 CV" },
  ],
  "2.0 TSI": [
    { code: "CCZA", power: "200 CV" },
    { code: "CCZB", power: "210 CV" },
    { code: "CDAA", power: "211 CV" },
    { code: "CHHA", power: "220 CV" },
    { code: "CJXC", power: "230 CV" },
    { code: "DNUE", power: "245 CV" },
  ],
  "2.0 TSI GTI": [
    { code: "CDAA", power: "211 CV" },
    { code: "CHHA", power: "220 CV" },
    { code: "CJXC", power: "230 CV" },
    { code: "DNUE", power: "245 CV" },
  ],
  "2.0 TFSI GTI": [
    { code: "AXX", power: "200 CV" },
    { code: "BWA", power: "200 CV" },
    { code: "BPY", power: "200 CV" },
  ],
  "2.0 TSI R": [
    { code: "CDLA", power: "270 CV" },
    { code: "CDLJ", power: "270 CV" },
    { code: "DNPC", power: "300 CV" },
  ],
  "2.0 TSI Cupra": [
    { code: "CDLA", power: "265 CV" },
    { code: "CJXG", power: "300 CV" },
    { code: "DNUD", power: "300 CV" },
  ],
  "2.0 TFSI Cupra": [
    { code: "AXX", power: "240 CV" },
    { code: "BWA", power: "240 CV" },
  ],
  // BMW diésel (misma denominación, distinta familia/potencia según generación)
  "116d": [
    { code: "N47D20", power: "116 CV" },
    { code: "B37", power: "116 CV" },
  ],
  "118d": [
    { code: "N47D20", power: "143 CV" },
    { code: "B47D20", power: "150 CV" },
  ],
  "120d": [
    { code: "N47D20", power: "177 CV" },
    { code: "B47D20", power: "190 CV" },
  ],
  "316d": [{ code: "N47D20", power: "116 CV" }],
  "318d": [
    { code: "M47D20", power: "116/122 CV" },
    { code: "N47D20", power: "143 CV" },
    { code: "B47D20", power: "150 CV" },
  ],
  "320d": [
    { code: "M47D20", power: "136-150 CV" },
    { code: "N47D20", power: "163-184 CV" },
    { code: "B47D20", power: "190 CV" },
  ],
  "325d": [
    { code: "M57D25", power: "197 CV" },
    { code: "N47D30", power: "218 CV" },
  ],
  "330d": [
    { code: "M57D30", power: "231 CV" },
    { code: "N57D30", power: "245-258 CV" },
    { code: "B57D30", power: "265 CV" },
  ],
  "335d": [
    { code: "M57D30TU2", power: "286 CV" },
    { code: "N57D30", power: "313 CV" },
  ],
  "340d": [{ code: "B57D30", power: "340 CV" }],
  "M340d": [{ code: "B57D30", power: "340 CV" }],
  "218d": [{ code: "B37", power: "150 CV" }],
  "220d": [{ code: "B47D20", power: "190 CV" }],
  "225d": [{ code: "B47D20", power: "224 CV" }],
  xDrive20d: [
    { code: "N47D20", power: "184 CV" },
    { code: "B47D20", power: "190 CV" },
  ],
  xDrive25d: [{ code: "B47D20", power: "231 CV" }],
  xDrive30d: [
    { code: "N57D30", power: "258 CV" },
    { code: "B57D30", power: "286 CV" },
  ],
  M40d: [{ code: "B57D30", power: "326 CV" }],
  // Mercedes-Benz CDI
  "A170 CDI": [{ code: "OM668", power: "60 CV" }],
  "A200 CDI": [{ code: "OM640", power: "140 CV" }],
  C220D: [{ code: "OM604", power: "95 CV" }],
  C220CDI: [
    { code: "OM646", power: "150 CV" },
    { code: "OM651", power: "170 CV" },
  ],
  C220d: [
    { code: "OM651", power: "170 CV" },
    { code: "OM654", power: "194 CV" },
  ],
  GLC220d: [{ code: "OM654", power: "194 CV" }],
  GLA200d: [{ code: "OM607", power: "116 CV" }],
  B200d: [{ code: "OM607", power: "116 CV" }],
  // Renault / Dacia dCi (familia K9K y M9R, muchas variantes de potencia)
  "1.5 dCi": [
    { code: "K9K 792", power: "75 CV" },
    { code: "K9K 796", power: "90 CV" },
    { code: "K9K 608", power: "100 CV" },
    { code: "K9K 636", power: "110 CV" },
    { code: "K9K 837", power: "115 CV" },
  ],
  "1.9 dCi": [
    { code: "F9Q", power: "80 CV" },
    { code: "F9Q", power: "105 CV" },
  ],
  "1.9 dTi": [{ code: "F8Q", power: "80 CV" }],
  "2.0 dCi": [
    { code: "M9R 602", power: "150 CV" },
    { code: "M9R 837", power: "160 CV" },
    { code: "M9R 815", power: "173 CV" },
  ],
  "1.7 dCi": [{ code: "M9T", power: "150 CV" }],
  // Ford diésel (Duratorq TDCi / EcoBlue)
  "1.6 TDCi": [
    { code: "Duratorq DV6", power: "90 CV" },
    { code: "Duratorq DV6", power: "110 CV" },
  ],
  "1.8 TDCi": [{ code: "Duratorq DLD", power: "115 CV" }],
  "2.0 TDCi": [
    { code: "Duratorq DW10", power: "115 CV" },
    { code: "Duratorq DW10", power: "136 CV" },
  ],
  "1.5 TDCi": [
    { code: "Duratorq DV5", power: "75 CV" },
    { code: "Duratorq DV5", power: "95/120 CV" },
  ],
  "1.5 EcoBlue": [
    { code: "Panther", power: "95 CV" },
    { code: "Panther", power: "120 CV" },
  ],
  "2.0 EcoBlue": [
    { code: "Panther", power: "150 CV" },
    { code: "Panther", power: "190 CV" },
  ],
  // PSA (Peugeot/Citroën) y Fiat diésel
  "1.6 HDi": [
    { code: "DV6", power: "90 CV" },
    { code: "DV6", power: "110 CV" },
  ],
  "1.6 BlueHDi": [
    { code: "DV6", power: "100 CV" },
    { code: "DV6", power: "120 CV" },
  ],
  "1.5 BlueHDi": [
    { code: "DV5", power: "100 CV" },
    { code: "DV5", power: "130 CV" },
  ],
  "2.0 HDi": [
    { code: "DW10", power: "109 CV" },
    { code: "DW10", power: "136 CV" },
  ],
  "2.0 BlueHDi": [{ code: "DW10", power: "150 CV" }],
  "1.3 Multijet": [
    { code: "199A2.000", power: "75 CV" },
    { code: "199A3.000", power: "85 CV" },
    { code: "199B4.000", power: "95 CV" },
  ],
  "1.6 Multijet": [
    { code: "198A2.000", power: "105 CV" },
    { code: "198A3.000", power: "120 CV" },
  ],
  // Opel CDTI
  "1.3 CDTI": [{ code: "Multijet 199A", power: "75-95 CV" }],
  "1.7 CDTI": [
    { code: "Isuzu 4EE1", power: "75 CV" },
    { code: "Isuzu 4EE1", power: "100/125 CV" },
  ],
  "2.0 CDTI": [
    { code: "Fiat/GM 2.0D", power: "130 CV" },
    { code: "Fiat/GM 2.0D", power: "170 CV" },
  ],
  "1.5 Diésel": [{ code: "PSA DV5/DL5", power: "102-122 CV" }],
  // Hyundai / Kia CRDi
  "1.1 CRDi": [{ code: "U-II 1.1", power: "75 CV" }],
  "1.6 CRDi": [
    { code: "U-II 1.6", power: "90/110 CV" },
    { code: "U-II 1.6", power: "115/136 CV" },
  ],
  "1.7 CRDi": [{ code: "U-II 1.7", power: "115/136 CV" }],
  "2.0 CRDi": [
    { code: "D4EA", power: "113 CV" },
    { code: "R 2.0", power: "136/184 CV" },
  ],
};

export function getEngineCodes(engineName: string): EngineCode[] {
  return ENGINE_CODES[engineName] ?? [];
}
