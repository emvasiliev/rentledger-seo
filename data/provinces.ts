export interface Province {
  code: string;       // e.g. "ON"
  slug: string;       // e.g. "ontario"
  name: string;       // e.g. "Ontario"
  taxRate: number;    // provincial income tax top marginal rate (%)
  nrwtRate: number;   // non-resident withholding rate note (Part XIII is federal 25%, provinces differ for some)
  capitalCity: string;
  majorCities: string[];
  craRegion: string;  // CRA tax centre serving this province
  commonUsStates: string[]; // US states where landlords from this province commonly own property
}

export const PROVINCES: Province[] = [
  {
    code: "ON",
    slug: "ontario",
    name: "Ontario",
    taxRate: 53.53,
    nrwtRate: 25,
    capitalCity: "Toronto",
    majorCities: ["Toronto", "Ottawa", "Mississauga", "Brampton", "Hamilton"],
    craRegion: "Southern Ontario",
    commonUsStates: ["FL", "AZ", "TX", "CA", "NY"],
  },
  {
    code: "BC",
    slug: "british-columbia",
    name: "British Columbia",
    taxRate: 53.5,
    nrwtRate: 25,
    capitalCity: "Victoria",
    majorCities: ["Vancouver", "Surrey", "Burnaby", "Richmond", "Kelowna"],
    craRegion: "Pacific",
    commonUsStates: ["WA", "CA", "AZ", "NV", "FL"],
  },
  {
    code: "AB",
    slug: "alberta",
    name: "Alberta",
    taxRate: 48,
    nrwtRate: 25,
    capitalCity: "Edmonton",
    majorCities: ["Calgary", "Edmonton", "Red Deer", "Lethbridge", "Medicine Hat"],
    craRegion: "Prairie",
    commonUsStates: ["AZ", "FL", "TX", "NV", "CA"],
  },
  {
    code: "QC",
    slug: "quebec",
    name: "Quebec",
    taxRate: 53.31,
    nrwtRate: 25,
    capitalCity: "Quebec City",
    majorCities: ["Montreal", "Quebec City", "Laval", "Gatineau", "Longueuil"],
    craRegion: "Quebec",
    commonUsStates: ["FL", "NY", "MA", "CT", "ME"],
  },
  {
    code: "MB",
    slug: "manitoba",
    name: "Manitoba",
    taxRate: 50.4,
    nrwtRate: 25,
    capitalCity: "Winnipeg",
    majorCities: ["Winnipeg", "Brandon", "Steinbach", "Thompson", "Portage la Prairie"],
    craRegion: "Prairie",
    commonUsStates: ["FL", "AZ", "TX", "MN", "ND"],
  },
  {
    code: "SK",
    slug: "saskatchewan",
    name: "Saskatchewan",
    taxRate: 47.5,
    nrwtRate: 25,
    capitalCity: "Regina",
    majorCities: ["Saskatoon", "Regina", "Prince Albert", "Moose Jaw", "Swift Current"],
    craRegion: "Prairie",
    commonUsStates: ["AZ", "FL", "TX", "MT", "ND"],
  },
  {
    code: "NS",
    slug: "nova-scotia",
    name: "Nova Scotia",
    taxRate: 54,
    nrwtRate: 25,
    capitalCity: "Halifax",
    majorCities: ["Halifax", "Dartmouth", "Sydney", "Truro", "New Glasgow"],
    craRegion: "Atlantic",
    commonUsStates: ["FL", "ME", "MA", "NY", "SC"],
  },
  {
    code: "NB",
    slug: "new-brunswick",
    name: "New Brunswick",
    taxRate: 52.5,
    nrwtRate: 25,
    capitalCity: "Fredericton",
    majorCities: ["Moncton", "Saint John", "Fredericton", "Dieppe", "Riverview"],
    craRegion: "Atlantic",
    commonUsStates: ["FL", "ME", "MA", "CT", "NY"],
  },
  {
    code: "NL",
    slug: "newfoundland-and-labrador",
    name: "Newfoundland and Labrador",
    taxRate: 54.8,
    nrwtRate: 25,
    capitalCity: "St. John's",
    majorCities: ["St. John's", "Mount Pearl", "Corner Brook", "Conception Bay South", "Grand Falls-Windsor"],
    craRegion: "Atlantic",
    commonUsStates: ["FL", "MA", "NY", "SC", "NC"],
  },
  {
    code: "PE",
    slug: "prince-edward-island",
    name: "Prince Edward Island",
    taxRate: 51.37,
    nrwtRate: 25,
    capitalCity: "Charlottetown",
    majorCities: ["Charlottetown", "Summerside", "Stratford", "Cornwall", "Montague"],
    craRegion: "Atlantic",
    commonUsStates: ["FL", "MA", "ME", "NY", "NC"],
  },
  {
    code: "NT",
    slug: "northwest-territories",
    name: "Northwest Territories",
    taxRate: 47.05,
    nrwtRate: 25,
    capitalCity: "Yellowknife",
    majorCities: ["Yellowknife", "Inuvik", "Hay River", "Fort Smith", "Behchokǫ̀"],
    craRegion: "Northern",
    commonUsStates: ["AK", "AZ", "FL", "TX", "WA"],
  },
  {
    code: "YT",
    slug: "yukon",
    name: "Yukon",
    taxRate: 48,
    nrwtRate: 25,
    capitalCity: "Whitehorse",
    majorCities: ["Whitehorse", "Dawson City", "Watson Lake", "Haines Junction", "Carmacks"],
    craRegion: "Northern",
    commonUsStates: ["AK", "WA", "AZ", "FL", "TX"],
  },
  {
    code: "NU",
    slug: "nunavut",
    name: "Nunavut",
    taxRate: 44.5,
    nrwtRate: 25,
    capitalCity: "Iqaluit",
    majorCities: ["Iqaluit", "Rankin Inlet", "Arviat", "Baker Lake", "Cambridge Bay"],
    craRegion: "Northern",
    commonUsStates: ["AK", "FL", "TX", "AZ", "WA"],
  },
];

export function getProvinceBySlug(slug: string): Province | undefined {
  return PROVINCES.find((p) => p.slug === slug);
}

export function getProvinceByCode(code: string): Province | undefined {
  return PROVINCES.find((p) => p.code === code);
}
