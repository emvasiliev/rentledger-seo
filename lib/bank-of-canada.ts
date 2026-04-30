/**
 * Bank of Canada Valet API integration
 * Used to fetch official USD/CAD annual average exchange rates
 * CRA accepts these rates for converting US rental income to CAD
 *
 * API docs: https://www.bankofcanada.ca/valet/docs
 */

export interface ExchangeRateData {
  year: number;
  usdToCad: number;      // 1 USD = X CAD (annual average)
  cadToUsd: number;      // 1 CAD = X USD (annual average)
  source: string;
  fetchedAt: string;
}

export interface ExchangeRateHistory {
  rates: ExchangeRateData[];
  lastUpdated: string;
}

const BOC_API_BASE = "https://www.bankofcanada.ca/valet";
const SERIES_CODE = "FXUSDCAD"; // USD/CAD daily noon rate

/**
 * Fetch annual average USD/CAD exchange rates from the Bank of Canada API
 * for a given range of years.
 */
export async function fetchAnnualExchangeRates(
  startYear: number = 1990,
  endYear: number = new Date().getFullYear()
): Promise<ExchangeRateData[]> {
  const startDate = `${startYear}-01-01`;
  const endDate = `${endYear}-12-31`;

  const url = `${BOC_API_BASE}/observations/${SERIES_CODE}/json?start_date=${startDate}&end_date=${endDate}`;

  const response = await fetch(url, {
    headers: { "Accept": "application/json" },
    next: { revalidate: 86400 }, // cache for 24 hours in Next.js
  });

  if (!response.ok) {
    throw new Error(`Bank of Canada API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const observations: Array<{ d: string; FXUSDCAD: { v: string } }> = data.observations;

  // Group by year and compute annual average
  const byYear: Record<number, number[]> = {};
  for (const obs of observations) {
    const year = parseInt(obs.d.slice(0, 4));
    const rate = parseFloat(obs.FXUSDCAD.v);
    if (!isNaN(rate)) {
      if (!byYear[year]) byYear[year] = [];
      byYear[year].push(rate);
    }
  }

  const rates: ExchangeRateData[] = [];
  for (let year = startYear; year <= endYear; year++) {
    const dailyRates = byYear[year];
    if (!dailyRates || dailyRates.length === 0) continue;

    const avg = dailyRates.reduce((sum, r) => sum + r, 0) / dailyRates.length;
    const usdToCad = parseFloat(avg.toFixed(4));
    rates.push({
      year,
      usdToCad,
      cadToUsd: parseFloat((1 / usdToCad).toFixed(4)),
      source: "Bank of Canada — FXUSDCAD annual average",
      fetchedAt: new Date().toISOString(),
    });
  }

  return rates.sort((a, b) => b.year - a.year); // most recent first
}

/**
 * Get the exchange rate for a specific year.
 * Used on individual exchange-rate year pages.
 */
export async function getExchangeRateForYear(year: number): Promise<ExchangeRateData | null> {
  const rates = await fetchAnnualExchangeRates(year, year);
  return rates[0] ?? null;
}

/**
 * Hardcoded recent exchange rates as a fallback
 * so the site doesn't break if the BoC API is down.
 * Update these annually.
 */
export const FALLBACK_EXCHANGE_RATES: ExchangeRateData[] = [
  { year: 2024, usdToCad: 1.3606, cadToUsd: 0.7350, source: "Bank of Canada annual average (fallback)", fetchedAt: "2025-01-01" },
  { year: 2023, usdToCad: 1.3497, cadToUsd: 0.7409, source: "Bank of Canada annual average (fallback)", fetchedAt: "2024-01-01" },
  { year: 2022, usdToCad: 1.3013, cadToUsd: 0.7685, source: "Bank of Canada annual average (fallback)", fetchedAt: "2023-01-01" },
  { year: 2021, usdToCad: 1.2535, cadToUsd: 0.7978, source: "Bank of Canada annual average (fallback)", fetchedAt: "2022-01-01" },
  { year: 2020, usdToCad: 1.3415, cadToUsd: 0.7454, source: "Bank of Canada annual average (fallback)", fetchedAt: "2021-01-01" },
  { year: 2019, usdToCad: 1.3269, cadToUsd: 0.7537, source: "Bank of Canada annual average (fallback)", fetchedAt: "2020-01-01" },
  { year: 2018, usdToCad: 1.2957, cadToUsd: 0.7718, source: "Bank of Canada annual average (fallback)", fetchedAt: "2019-01-01" },
  { year: 2017, usdToCad: 1.2986, cadToUsd: 0.7700, source: "Bank of Canada annual average (fallback)", fetchedAt: "2018-01-01" },
  { year: 2016, usdToCad: 1.3248, cadToUsd: 0.7548, source: "Bank of Canada annual average (fallback)", fetchedAt: "2017-01-01" },
  { year: 2015, usdToCad: 1.2787, cadToUsd: 0.7820, source: "Bank of Canada annual average (fallback)", fetchedAt: "2016-01-01" },
  { year: 2014, usdToCad: 1.1045, cadToUsd: 0.9054, source: "Bank of Canada annual average (fallback)", fetchedAt: "2015-01-01" },
  { year: 2013, usdToCad: 1.0299, cadToUsd: 0.9710, source: "Bank of Canada annual average (fallback)", fetchedAt: "2014-01-01" },
  { year: 2012, usdToCad: 0.9996, cadToUsd: 1.0004, source: "Bank of Canada annual average (fallback)", fetchedAt: "2013-01-01" },
  { year: 2011, usdToCad: 0.9891, cadToUsd: 1.0110, source: "Bank of Canada annual average (fallback)", fetchedAt: "2012-01-01" },
  { year: 2010, usdToCad: 1.0299, cadToUsd: 0.9710, source: "Bank of Canada annual average (fallback)", fetchedAt: "2011-01-01" },
];

export function getFallbackRate(year: number): ExchangeRateData | undefined {
  return FALLBACK_EXCHANGE_RATES.find((r) => r.year === year);
}

/**
 * Safe wrapper — tries live API first, falls back to hardcoded data
 */
export async function getExchangeRateSafe(year: number): Promise<ExchangeRateData | null> {
  try {
    const live = await getExchangeRateForYear(year);
    if (live) return live;
  } catch {
    // API down — use fallback
  }
  return getFallbackRate(year) ?? null;
}
