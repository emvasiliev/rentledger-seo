import { PROVINCES } from "@/data/provinces";
import { TOPICS } from "@/data/topics";
import { getExchangeRateSafe, FALLBACK_EXCHANGE_RATES } from "@/lib/bank-of-canada";

import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://rentledger.ca" },
};

export const revalidate = 86400;

export default async function HomePage() {
  const targetTaxYear = new Date().getFullYear() - 1;
  const liveRate = await getExchangeRateSafe(targetTaxYear);
  const currentRate = liveRate ?? FALLBACK_EXCHANGE_RATES[0];
  const isFallback = currentRate.year !== targetTaxYear;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[hsl(220_23%_97%)] to-white py-20 px-4 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Tax Guides for Canadian Landlords<br className="hidden sm:block" /> with US Rental Property
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
          Clear, accurate guides covering your CRA obligations in Canada and IRS obligations in the US —
          every province, every state, every form explained.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/guides"
            className="rounded-lg bg-[hsl(218_28%_22%)] px-6 py-3 font-semibold text-white hover:bg-[hsl(218_28%_30%)]"
          >
            Browse all guides →
          </a>
          <a
            href="https://app.rentledger.ca"
            className="rounded-lg border border-[hsl(152_60%_36%)] px-6 py-3 font-semibold text-[hsl(152_60%_36%)] hover:bg-[hsl(152_60%_96%)]"
          >
            Try the app free →
          </a>
        </div>

        {currentRate && (
          <div className="mt-8 inline-block rounded-full bg-white border border-gray-200 shadow-sm px-5 py-2 text-sm text-gray-600">
            🏦 {targetTaxYear} CRA Annual Exchange Rate: <strong>1 USD = {currentRate.usdToCad} CAD</strong>
            <br />
            {isFallback ? (
              <>Using latest available rate from {currentRate.year}{" · "}Official {targetTaxYear} rate pending</>
            ) : (
              <>
                Used for {targetTaxYear} tax reporting{" · "}
                <a href={`/tools/exchange-rate/${targetTaxYear}`} className="text-[hsl(152_60%_36%)] hover:underline">
                  See all years →
                </a>
              </>
            )}
          </div>
        )}
      </section>

      {/* Province picker */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Where are you based?</h2>
        <p className="mb-6 text-gray-500">Select your province to see US rental guides tailored to your CRA obligations.</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {PROVINCES.map((province) => (
            <a
              key={province.slug}
              href={`/guides/${province.slug}`}
              className="rounded-xl border border-gray-200 p-4 hover:border-[hsl(152_60%_60%)] hover:bg-[hsl(152_60%_96%)] transition-colors"
            >
              <div className="font-semibold text-gray-900">{province.name}</div>
              <div className="mt-1 text-xs text-gray-400">{province.majorCities[0]}</div>
            </a>
          ))}
        </div>
      </section>

      {/* US landlord CTA strip */}
      <section className="border-y border-amber-200 bg-amber-50 py-6 px-4">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-amber-900">🇺🇸 Are you a US landlord with Canadian rental property?</p>
            <p className="mt-1 text-sm text-amber-700">We cover IRS + CRA obligations for Americans who own in Canada — Part XIII withholding, Section 216 election, Form 1116.</p>
          </div>
          <a
            href="/guides/us"
            className="shrink-0 rounded-lg border border-amber-400 bg-white px-5 py-2.5 text-sm font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
          >
            US landlord guides →
          </a>
        </div>
      </section>

      {/* Popular combos */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">Most Popular Guides</h2>
          <p className="mb-6 text-gray-500">The most common cross-border landlord situations.</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {[
              { province: "ontario", state: "florida", label: "Ontario → Florida" },
              { province: "british-columbia", state: "arizona", label: "BC → Arizona" },
              { province: "alberta", state: "florida", label: "Alberta → Florida" },
              { province: "ontario", state: "texas", label: "Ontario → Texas" },
              { province: "british-columbia", state: "washington", label: "BC → Washington" },
              { province: "quebec", state: "florida", label: "Quebec → Florida" },
            ].map(({ province, state, label }) => (
              <a
                key={`${province}-${state}`}
                href={`/guides/${province}/${state}`}
                className="rounded-xl border bg-white p-4 hover:border-[hsl(152_60%_60%)] hover:shadow-sm transition"
              >
                <div className="font-semibold text-gray-900">{label}</div>
                <div className="mt-1 text-xs text-[hsl(152_60%_36%)]">Tax guide →</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Free Tools */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Free Tax Tools</h2>
        <p className="mb-6 text-gray-500">Calculators built specifically for Canadian landlords with US rental income.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* CRA Remittance Calculator — featured */}
          <a
            href="/tools/cra-remittance-calculator"
            className="group rounded-xl border-2 border-[hsl(152_60%_46%)] bg-[hsl(152_60%_97%)] p-6 hover:bg-[hsl(152_60%_92%)] transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 h-11 w-11 rounded-xl bg-[hsl(152_60%_46%)] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="3" width="20" height="14" rx="2"/>
                  <path d="M8 21h8M12 17v4"/>
                  <path d="M7 8h.01M12 8h.01M17 8h.01M7 12h.01M12 12h.01M17 12h.01"/>
                </svg>
              </div>
              <div>
                <div className="font-bold text-gray-900 text-lg group-hover:text-[hsl(152_60%_30%)] transition-colors">
                  CRA Remittance Calculator
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  Calculate your Part XIII non-resident withholding tax. Supports multiple properties, NR6 elections, and deposit cash-basis handling.
                </p>
                <div className="mt-3 text-sm font-semibold text-[hsl(152_60%_36%)]">Open calculator →</div>
              </div>
            </div>
          </a>

          {/* Exchange Rate tool */}
          <a
            href="/tools/exchange-rate"
            className="group rounded-xl border border-gray-200 bg-white p-6 hover:border-[hsl(152_60%_60%)] hover:bg-[hsl(152_60%_96%)] transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 h-11 w-11 rounded-xl bg-[hsl(218_28%_22%)] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/>
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <div>
                <div className="font-bold text-gray-900 text-lg group-hover:text-[hsl(152_60%_30%)] transition-colors">
                  USD/CAD Exchange Rates
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  Official Bank of Canada annual average exchange rates for CRA reporting. Every year back to 2015.
                </p>
                <div className="mt-3 text-sm font-semibold text-[hsl(152_60%_36%)]">See all years →</div>
              </div>
            </div>
          </a>

          {/* Schedule E Calculator */}
          <a
            href="/tools/schedule-e-calculator"
            className="group rounded-xl border border-gray-200 bg-white p-6 hover:border-[hsl(152_60%_60%)] hover:bg-[hsl(152_60%_96%)] transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 h-11 w-11 rounded-xl bg-[hsl(218_28%_22%)] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              <div>
                <div className="font-bold text-gray-900 text-lg group-hover:text-[hsl(152_60%_30%)] transition-colors">
                  Schedule E Calculator
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  Estimate rental income, expenses, and net income for US rental properties.
                </p>
                <div className="mt-3 text-sm font-semibold text-[hsl(152_60%_36%)]">Calculate Schedule E →</div>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Featured topics */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Key Topics</h2>
        <p className="mb-6 text-gray-500">Deep dives into the forms and rules every cross-border landlord needs to know.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TOPICS.slice(0, 6).map((topic) => (
            <a
              key={topic.slug}
              href={`/topics/${topic.slug}`}
              className="rounded-xl border p-5 hover:border-[hsl(152_60%_60%)] hover:bg-[hsl(152_60%_96%)] transition"
            >
              <div className="font-semibold text-gray-900">{topic.title}</div>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">{topic.description}</p>
            </a>
          ))}
        </div>
        <div className="mt-6 text-center">
          <a href="/topics" className="text-[hsl(152_60%_36%)] hover:underline text-sm font-medium">View all topics →</a>
        </div>
      </section>

      {/* App CTA */}
      <section className="bg-[hsl(218_28%_22%)] py-16 px-4 text-white text-center">
        <h2 className="text-3xl font-bold">Stop doing the math manually.</h2>
        <p className="mt-3 text-lg text-[hsl(210_40%_90%)] max-w-xl mx-auto">
          RentLedger tracks your US rental income, converts to CAD at official Bank of Canada rates,
          and gives you CRA-ready reports for your accountant.
        </p>
        <a
          href="https://app.rentledger.ca"
          className="mt-6 inline-block rounded-lg bg-white px-8 py-3 font-bold text-[hsl(152_60%_36%)] hover:bg-[hsl(152_60%_96%)]"
        >
          Try RentLedger Free →
        </a>
      </section>
    </div>
  );
}
