import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getExchangeRateSafe, FALLBACK_EXCHANGE_RATES } from "@/lib/bank-of-canada";
import JsonLd, { breadcrumbSchema, faqSchema } from "@/components/JsonLd";
import Disclaimer from "@/components/Disclaimer";

interface Props {
  params: Promise<{ year: string }>;
}

const MIN_YEAR = 2010;
const MAX_YEAR = new Date().getFullYear();

export async function generateStaticParams() {
  const params: { year: string }[] = [];
  for (let year = MIN_YEAR; year <= MAX_YEAR; year++) {
    params.push({ year: year.toString() });
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = await params;
  const yearNum = parseInt(year);
  if (isNaN(yearNum) || yearNum < MIN_YEAR || yearNum > MAX_YEAR) return {};

  return {
    title: `${year} CRA USD/CAD Exchange Rate — Bank of Canada Annual Average`,
    description: `The official Bank of Canada annual average USD to CAD exchange rate for ${year}, as accepted by CRA for reporting US rental income on your Canadian tax return.`,
    keywords: [
      `${year} USD CAD exchange rate CRA`,
      `Bank of Canada ${year} annual average exchange rate`,
      `convert US rental income CAD ${year}`,
      `CRA foreign income exchange rate ${year}`,
    ],
    alternates: { canonical: `https://rentledger.ca/tools/exchange-rate/${year}` },
  };
}

export default async function ExchangeRateYearPage({ params }: Props) {
  const { year } = await params;
  const yearNum = parseInt(year);
  if (isNaN(yearNum) || yearNum < MIN_YEAR || yearNum > MAX_YEAR) notFound();

  const rateData = await getExchangeRateSafe(yearNum);
  if (!rateData) notFound();

  const prevYear = yearNum > MIN_YEAR ? yearNum - 1 : null;
  const nextYear = yearNum < MAX_YEAR ? yearNum + 1 : null;
  const prevRate = prevYear ? FALLBACK_EXCHANGE_RATES.find((r) => r.year === prevYear) : null;

  const changeVsPrevYear = prevRate
    ? ((rateData.usdToCad - prevRate.usdToCad) / prevRate.usdToCad * 100).toFixed(2)
    : null;

  const faqs = [
    {
      question: `What was the Bank of Canada average USD/CAD exchange rate for ${year}?`,
      answer: `The Bank of Canada annual average USD to CAD exchange rate for ${year} was ${rateData.usdToCad} (1 USD = ${rateData.usdToCad} CAD). This means 1 Canadian dollar was worth ${rateData.cadToUsd} US dollars on average.`,
    },
    {
      question: `Can I use the ${year} Bank of Canada rate to report US rental income to CRA?`,
      answer: `Yes. CRA accepts the Bank of Canada annual average rate for converting foreign income to Canadian dollars when filing your T1 return. For the ${year} tax year, you can use ${rateData.usdToCad} to convert your US rental income.`,
    },
    {
      question: `Where does CRA say I can find the exchange rate for foreign income?`,
      answer: `CRA's guidance (Income Tax Folio S5-F4-C1) states that you can use the Bank of Canada exchange rate. Specifically, you can use the average annual rate for the year, the rate on the date of each transaction, or the rate on December 31 of the year. Most landlords use the annual average for simplicity.`,
    },
    {
      question: `How do I convert my ${year} US rental income using the Bank of Canada rate?`,
      answer: `Multiply your gross USD rental income by ${rateData.usdToCad} to get the CAD equivalent. For example, $12,000 USD × ${rateData.usdToCad} = $${(12000 * rateData.usdToCad).toFixed(2)} CAD. Apply the same rate to your US expenses before calculating net income on Form T776.`,
    },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://rentledger.ca" },
        { name: "Tools", url: "https://rentledger.ca/tools" },
        { name: "Exchange Rate", url: "https://rentledger.ca/tools/exchange-rate" },
        { name: year, url: `https://rentledger.ca/tools/exchange-rate/${year}` },
      ])} />
      <JsonLd data={faqSchema(faqs)} />

      <div className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-gray-500">
          <a href="/" className="hover:underline">Home</a> {" › "}
          <a href="/tools" className="hover:underline">Tools</a> {" › "}
          <a href="/tools/exchange-rate" className="hover:underline">Exchange Rate</a> {" › "}
          <span>{year}</span>
        </nav>

        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          {year} CRA Exchange Rate: USD to CAD
        </h1>
        <p className="mb-6 text-gray-600">
          The official Bank of Canada annual average exchange rate for {year}, accepted by CRA
          for reporting US rental income on your Canadian T1 return.
        </p>

        <Disclaimer />

        {/* Rate hero card */}
        <div className="my-8 rounded-2xl bg-blue-600 p-8 text-white text-center">
          <div className="text-sm font-medium uppercase tracking-widest opacity-80">
            {year} Annual Average Rate
          </div>
          <div className="mt-2 text-6xl font-bold">{rateData.usdToCad}</div>
          <div className="mt-2 text-lg opacity-90">1 USD = {rateData.usdToCad} CAD</div>
          <div className="mt-1 text-sm opacity-70">Source: {rateData.source}</div>
          {changeVsPrevYear && prevRate && (
            <div className="mt-3 text-sm opacity-80">
              {parseFloat(changeVsPrevYear) > 0 ? "▲" : "▼"} {Math.abs(parseFloat(changeVsPrevYear))}%
              vs {prevYear} ({prevRate.usdToCad})
            </div>
          )}
        </div>

        {/* Quick converter */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
          <h2 className="mb-4 font-semibold text-gray-900">Quick Conversion Reference</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 pr-6">USD Amount</th>
                  <th className="pb-2">CAD Equivalent ({year})</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[500, 1000, 5000, 10000, 15000, 20000, 25000, 30000, 50000].map((usd) => (
                  <tr key={usd}>
                    <td className="py-2 pr-6 font-mono">${usd.toLocaleString()} USD</td>
                    <td className="py-2 font-mono text-blue-700">
                      ${(usd * rateData.usdToCad).toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Year navigation */}
        <div className="mt-8 flex items-center justify-between">
          {prevYear ? (
            <a href={`/tools/exchange-rate/${prevYear}`} className="text-blue-600 hover:underline">
              ← {prevYear} Rate {prevRate ? `(${prevRate.usdToCad})` : ""}
            </a>
          ) : <div />}
          {nextYear && (
            <a href={`/tools/exchange-rate/${nextYear}`} className="text-blue-600 hover:underline">
              {nextYear} Rate →
            </a>
          )}
        </div>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-5">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-lg border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* All years table */}
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Historical Exchange Rates</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Year</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">1 USD = CAD</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">1 CAD = USD</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {FALLBACK_EXCHANGE_RATES.map((r) => (
                  <tr key={r.year} className={r.year === yearNum ? "bg-blue-50 font-semibold" : "hover:bg-gray-50"}>
                    <td className="px-4 py-2">
                      <a href={`/tools/exchange-rate/${r.year}`} className="text-blue-600 hover:underline">
                        {r.year}
                      </a>
                    </td>
                    <td className="px-4 py-2 font-mono">{r.usdToCad}</td>
                    <td className="px-4 py-2 font-mono">{r.cadToUsd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-12 rounded-xl bg-blue-50 p-6 text-center">
          <h2 className="text-xl font-bold text-blue-900">Let RentLedger handle the math</h2>
          <p className="mt-2 text-blue-700">
            RentLedger automatically applies the correct Bank of Canada annual average rate to your
            US rental income so you never have to look it up again.
          </p>
          <a
            href="https://app.rentledger.ca"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Try RentLedger Free →
          </a>
        </div>
      </div>
    </>
  );
}
