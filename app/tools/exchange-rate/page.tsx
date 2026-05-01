import type { Metadata } from "next";
import { FALLBACK_EXCHANGE_RATES } from "@/lib/bank-of-canada";

export const metadata: Metadata = {
  title: "CRA USD/CAD Exchange Rates — Bank of Canada Annual Averages",
  description: "Official Bank of Canada annual average USD to CAD exchange rates accepted by CRA for reporting US rental income on your Canadian tax return.",
  alternates: { canonical: "https://rentledger.ca/tools/exchange-rate" },
};

export default function ExchangeRateIndexPage() {
  const currentRate = FALLBACK_EXCHANGE_RATES[0];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <nav className="mb-6 text-sm text-gray-500">
        <a href="/" className="hover:underline">Home</a> {" › "}
        <a href="/tools" className="hover:underline">Tools</a> {" › "}
        <span>Exchange Rate</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold text-gray-900">CRA USD/CAD Exchange Rates</h1>
      <p className="mb-8 text-lg text-gray-600">
        Bank of Canada annual average exchange rates accepted by CRA for converting US rental income to Canadian dollars on your T1 return.
      </p>

      {currentRate && (
        <div className="mb-8 rounded-2xl bg-[hsl(218_28%_22%)] p-8 text-white text-center">
          <div className="text-sm font-medium uppercase tracking-widest opacity-80">
            {currentRate.year} Annual Average Rate
          </div>
          <div className="mt-2 text-6xl font-bold">{currentRate.usdToCad}</div>
          <div className="mt-2 text-lg opacity-90">1 USD = {currentRate.usdToCad} CAD</div>
          <a href={`/tools/exchange-rate/${currentRate.year}`}
            className="mt-4 inline-block rounded-lg bg-white px-5 py-2 text-sm font-semibold text-[hsl(152_60%_36%)] hover:bg-[hsl(152_60%_96%)]">
            Full {currentRate.year} details →
          </a>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Tax Year</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">1 USD = CAD</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">1 CAD = USD</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {FALLBACK_EXCHANGE_RATES.map((r) => (
              <tr key={r.year} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{r.year}</td>
                <td className="px-4 py-3 font-mono text-[hsl(152_60%_36%)]">{r.usdToCad}</td>
                <td className="px-4 py-3 font-mono text-gray-600">{r.cadToUsd}</td>
                <td className="px-4 py-3">
                  <a href={`/tools/exchange-rate/${r.year}`}
                    className="text-xs text-[hsl(152_60%_36%)] hover:underline">
                    Details →
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-12 rounded-xl bg-[hsl(152_60%_96%)] p-6 text-center">
        <h2 className="text-xl font-bold text-[hsl(222_30%_12%)]">Let RentLedger handle the conversion</h2>
        <p className="mt-2 text-[hsl(152_60%_36%)]">
          RentLedger automatically applies the correct Bank of Canada rate to your US rental income every year.
        </p>
        <a href="https://app.rentledger.ca"
          className="mt-4 inline-block rounded-lg bg-[hsl(218_28%_22%)] px-6 py-3 font-semibold text-white hover:bg-[hsl(218_28%_30%)]">
          Try RentLedger Free →
        </a>
      </div>
    </div>
  );
}
