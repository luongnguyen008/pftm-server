export enum INDICATOR_TYPE {
  PMI = "PMI",
  SERVICE_PMI = "SERVICE_PMI",
  CONSUMER_SENTIMENT = "CONSUMER_SENTIMENT",
  BUILDING_PERMITS = "BUILDING_PERMITS",
  M2 = "M2",
  M3 = "M3",
  IR = "IR",
  CPI = "CPI",
  CORE_CPI = "CORE_CPI",
  PPI = "PPI",
  CORE_PPI = "CORE_PPI",
  EMPLOYMENT_CHANGE = "EMPLOYMENT_CHANGE",
  UNEMPLOYMENT_RATE = "UNEMPLOYMENT_RATE",
  GDP_NOMINAL = "GDP_NOMINAL",
  GDP_GROWTH = "GDP_GROWTH",
  GOVT_DEBT = "GOVT_DEBT",
  GOVT_RECEIPTS = "GOVT_RECEIPTS",
  GOVT_PAYMENTS = "GOVT_PAYMENTS",
  GOVT_INTEREST_BILLS = "GOVT_INTEREST_BILLS",
  DEBT_TO_GDP = "DEBT_TO_GDP",
  SURPLUS_DEFICIT = "SURPLUS_DEFICIT",
  SURPLUS_DEFICIT_TO_GDP = "SURPLUS_DEFICIT_TO_GDP",
  INTEREST_BILLS_TO_GDP = "INTEREST_BILLS_TO_GDP",
  LIQUIDITY_COVER = "LIQUIDITY_COVER",
  TREASURY_10_YEAR = "TREASURY_10_YEAR",
  CBBS_TOTAL_ASSETS = "CBBS_TOTAL_ASSETS",
  CBBS_TOTAL_ASSETS_TO_GDP = "CBBS_TOTAL_ASSETS_TO_GDP",
}

export enum FREQUENCY {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  YEARLY = "YEARLY",
}

export enum TRADABLE_TYPES {
  EX_COMMOD_MAJ = "EX_COMMOD_MAJ",
  EX_COMMOD_MIN = "EX_COMMOD_MIN",
  COMMOD_MAJ = "COMMOD_MAJ",
  COMMOD_MIN = "COMMOD_MIN",
}

export enum UNIT {
  THOUSANDS = "THOUSANDS",
  BILLIONS = "BILLIONS",
  MILLIONS = "MILLIONS",
  PERCENT = "PERCENT",
  INDEX = "INDEX",
  POINTS = "NUMBER",
  CURRENCY = "CURRENCY",
}

export interface IndicatorValue {
  country: COUNTRY_CODE;
  indicator_type: INDICATOR_TYPE;
  frequency: FREQUENCY;
  timestamp: number; // timestamp in seconds
  actual: number;
  actual_formatted?: string;
  forecast?: number;
  forecast_formatted?: string;
  unit?: UNIT;
  currency?: Currency;
}

export enum COUNTRY_CODE {
  USA = "usa",
  EUROZONE = "emu",
  AUSTRALIA = "aus",
  JAPAN = "jpn",
  CANADA = "can",
  NEW_ZEALAND = "nzl",
  UNITED_KINGDOM = "gbr",
  SWITZERLAND = "che",
  NORWAY = "nor",
  SWEDEN = "swe",
  HUNGARY = "hun",
  SOUTH_AFRICA = "zaf",
  RUSSIA = "rus",
}

export enum Currency {
  EUR = "EUR",
  USD = "USD",
  AUD = "AUD",
  JPY = "JPY",
  CAD = "CAD",
  NZD = "NZD",
  GBP = "GBP",
  CHF = "CHF",
  NOK = "NOK",
  SEK = "SEK",
  HUF = "HUF",
  ZAR = "ZAR",
  RUB = "RUB",
}

export interface TradableFX {
  id: string;
  name: string;
  type: TRADABLE_TYPES;
  yahooFinanceName: string;
}
export const TRADABLE_FX: TradableFX[] = [
  {
    id: "EURJPY",
    name: "EUR/JPY",
    type: TRADABLE_TYPES.EX_COMMOD_MAJ,
    yahooFinanceName: "EURJPY=X",
  },
  {
    id: "GBPJPY",
    name: "GBP/JPY",
    type: TRADABLE_TYPES.EX_COMMOD_MAJ,
    yahooFinanceName: "GBPJPY=X",
  },
  {
    id: "CHFJPY",
    name: "CHF/JPY",
    type: TRADABLE_TYPES.EX_COMMOD_MAJ,
    yahooFinanceName: "CHFJPY=X",
  },
  {
    id: "USDCHF",
    name: "USD/CHF",
    type: TRADABLE_TYPES.EX_COMMOD_MAJ,
    yahooFinanceName: "USDCHF=X",
  },
  {
    id: "GBPCHF",
    name: "GBP/CHF",
    type: TRADABLE_TYPES.EX_COMMOD_MAJ,
    yahooFinanceName: "GBPCHF=X",
  },
  {
    id: "USDJPY",
    name: "USD/JPY",
    type: TRADABLE_TYPES.EX_COMMOD_MAJ,
    yahooFinanceName: "USDJPY=X",
  },
  {
    id: "EURUSD",
    name: "EUR/USD",
    type: TRADABLE_TYPES.EX_COMMOD_MAJ,
    yahooFinanceName: "EURUSD=X",
  },
  {
    id: "GBPUSD",
    name: "GBP/USD",
    type: TRADABLE_TYPES.EX_COMMOD_MAJ,
    yahooFinanceName: "GBPUSD=X",
  },
  {
    id: "EURCHF",
    name: "EUR/CHF",
    type: TRADABLE_TYPES.EX_COMMOD_MAJ,
    yahooFinanceName: "EURCHF=X",
  },
  {
    id: "GBPEUR",
    name: "GBP/EUR",
    type: TRADABLE_TYPES.EX_COMMOD_MAJ,
    yahooFinanceName: "GBPEUR=X",
  },
  {
    id: "USDSEK",
    name: "USD/SEK",
    type: TRADABLE_TYPES.EX_COMMOD_MIN,
    yahooFinanceName: "USDSEK=X",
  },
  {
    id: "EURHUF",
    name: "EUR/HUF",
    type: TRADABLE_TYPES.EX_COMMOD_MIN,
    yahooFinanceName: "EURHUF=X",
  },
  {
    id: "AUDJPY",
    name: "AUD/JPY",
    type: TRADABLE_TYPES.COMMOD_MAJ,
    yahooFinanceName: "AUDJPY=X",
  },
  {
    id: "AUDUSD",
    name: "AUD/USD",
    type: TRADABLE_TYPES.COMMOD_MAJ,
    yahooFinanceName: "AUDUSD=X",
  },
  {
    id: "AUDCAD",
    name: "AUD/CAD",
    type: TRADABLE_TYPES.COMMOD_MAJ,
    yahooFinanceName: "AUDCAD=X",
  },
  {
    id: "USDCAD",
    name: "USD/CAD",
    type: TRADABLE_TYPES.COMMOD_MAJ,
    yahooFinanceName: "USDCAD=X",
  },
  {
    id: "AUDNZD",
    name: "AUD/NZD",
    type: TRADABLE_TYPES.COMMOD_MAJ,
    yahooFinanceName: "AUDNZD=X",
  },
  {
    id: "USDZAR",
    name: "USD/ZAR",
    type: TRADABLE_TYPES.COMMOD_MIN,
    yahooFinanceName: "USDZAR=X",
  },
  {
    id: "GBPZAR",
    name: "GBP/ZAR",
    type: TRADABLE_TYPES.COMMOD_MIN,
    yahooFinanceName: "GBPZAR=X",
  },
  {
    id: "USDNOK",
    name: "USD/NOK",
    type: TRADABLE_TYPES.COMMOD_MIN,
    yahooFinanceName: "USDNOK=X",
  },
  {
    id: "USDRUB",
    name: "USD/RUB",
    type: TRADABLE_TYPES.COMMOD_MIN,
    yahooFinanceName: "USDRUB=X",
  },
  {
    id: "EURRUB",
    name: "EUR/RUB",
    type: TRADABLE_TYPES.COMMOD_MIN,
    yahooFinanceName: "EURRUB=X",
  },
  {
    id: "EURNOK",
    name: "EUR/NOK",
    type: TRADABLE_TYPES.COMMOD_MIN,
    yahooFinanceName: "EURNOK=X",
  },
];

export interface CountryList {
  code: COUNTRY_CODE;
  flagIcon: string;
  name: string;
  shortName: string;
  currency: string;
  currencyName: string;
  cftcCode: string;
}

export const COUNTRY_LIST: CountryList[] = [
  {
    code: COUNTRY_CODE.USA,
    flagIcon: "flag:us-4x3",
    name: "United States",
    shortName: "USA",
    currency: "USD",
    currencyName: "United States Dollar",
    cftcCode: "098662",
  },
  {
    code: COUNTRY_CODE.EUROZONE,
    flagIcon: "flag:eu-4x3",
    name: "Eurozone",
    shortName: "EUR",
    currency: "EUR",
    currencyName: "Euro",
    cftcCode: "099741",
  },
  {
    code: COUNTRY_CODE.AUSTRALIA,
    flagIcon: "flag:au-4x3",
    name: "Australia",
    shortName: "AUS",
    currency: "AUD",
    currencyName: "Australian Dollar",
    cftcCode: "232741",
  },
  {
    code: COUNTRY_CODE.JAPAN,
    flagIcon: "flag:jp-4x3",
    name: "Japan",
    shortName: "JPN",
    currency: "JPY",
    currencyName: "Japanese Yen",
    cftcCode: "097741",
  },
  {
    code: COUNTRY_CODE.CANADA,
    flagIcon: "flag:ca-4x3",
    name: "Canada",
    shortName: "CAN",
    currency: "CAD",
    currencyName: "Canadian Dollar",
    cftcCode: "090741",
  },
  {
    code: COUNTRY_CODE.NEW_ZEALAND,
    flagIcon: "flag:nz-4x3",
    name: "New Zealand",
    shortName: "NZL",
    currency: "NZD",
    currencyName: "New Zealand Dollar",
    cftcCode: "112741",
  },
  {
    code: COUNTRY_CODE.UNITED_KINGDOM,
    flagIcon: "flag:gb-4x3",
    name: "United Kingdom",
    shortName: "GBR",
    currency: "GBP",
    currencyName: "British Pound Sterling",
    cftcCode: "096742",
  },
  {
    code: COUNTRY_CODE.SWITZERLAND,
    flagIcon: "flag:ch-4x3",
    name: "Switzerland",
    shortName: "CHE",
    currency: "CHF",
    currencyName: "Swiss Franc",
    cftcCode: "092741",
  },
  {
    code: COUNTRY_CODE.NORWAY,
    flagIcon: "flag:no-4x3",
    name: "Norway",
    shortName: "NOR",
    currency: "NOK",
    currencyName: "Norwegian Krone",
    cftcCode: "",
  },
  {
    code: COUNTRY_CODE.SWEDEN,
    flagIcon: "flag:se-4x3",
    name: "Sweden",
    shortName: "SWE",
    currency: "SEK",
    currencyName: "Swedish Krona",
    cftcCode: "",
  },
  {
    code: COUNTRY_CODE.HUNGARY,
    flagIcon: "flag:hu-4x3",
    name: "Hungary",
    shortName: "HUN",
    currency: "HUF",
    currencyName: "Hungarian Forint",
    cftcCode: "",
  },
  {
    code: COUNTRY_CODE.SOUTH_AFRICA,
    flagIcon: "flag:za-4x3",
    name: "South Africa",
    shortName: "ZAF",
    currency: "ZAR",
    currencyName: "South African Rand",
    cftcCode: "",
  },
  {
    code: COUNTRY_CODE.RUSSIA,
    flagIcon: "flag:ru-4x3",
    name: "Russia",
    shortName: "RUS",
    currency: "RUB",
    currencyName: "Russian Ruble",
    cftcCode: "089741",
  },
];

export interface IAttrInvesting {
  actual: number;
  actual_formatted: string;
  actual_state: string;
  forecast: number;
  forecast_formatted: string;
  revised: number | null;
  revised_formatted: string;
  timestamp: number;
}

export interface InvestingDataType {
  data: [number, number, string][];
  attr: IAttrInvesting[];
}

export interface FredDataType {
  realtime_start: string;
  realtime_end: string;
  observation_start: string;
  observation_end: string;
  units: string;
  output_type: number;
  file_type: string;
  order_by: string;
  sort_order: string;
  count: number;
  offset: number;
  limit: number;
  observations: FredDataObservation[];
}

export interface FredDataObservation {
  realtime_start: string;
  realtime_end: string;
  date: string;
  value: number;
}
