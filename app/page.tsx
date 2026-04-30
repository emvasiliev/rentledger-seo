import { PROVINCES } from "@/data/provinces";
import { TOPICS } from "@/data/topics";
import { FALLBACK_EXCHANGE_RATES } from "@/lib/bank-of-canada";

export default function HomePage() {
  const currentRate = FALLBACK_EXCHANGE_RATES[0];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-4 text-center">
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
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Browse all guides →
          </a>
          <a
            href="https://app.rentledger.ca"
            className="rounded-lg border border-blue-600 px-6 py-3 font-semibold text-blue-600 hover:bg-blue-50"
          >
            Try the app free →
          </a>
        </div>

        {currentRate && (
          <div className="mt-8 inline-block rounded-full bg-white border border-gray-200 shadow-sm px-5 py-2 text-sm text-gray-600">
            🏦 {currentRate.year} CRA Exchange Rate: <strong>1 USD = {currentRate.usdToCad} CAD</strong>
            {" · "}
            <a href={`/tools/exchange-rate/${currentRate.year}`} className="text-blue-600 hover:underline">
              See all years →
            </a>
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
              className="rounded-xl border border-gray-200 p-4 hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <div className="font-semibold text-gray-900">{province.name}</div>
              <div className="mt-1 text-xs text-gray-400">{province.majorCities[0]}</div>
            </a>
          ))}
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
                className="rounded-xl border bg-white p-4 hover:border-blue-400 hover:shadow-sm transition"
              >
                <div className="font-semibold text-gray-900">{label}</div>
                <div className="mt-1 text-xs text-blue-600">Tax guide →</div>
              </a>
            ))}
          </div>
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
              className="rounded-xl border p-5 hover:border-blue-400 hover:bg-blue-50 transition"
            >
              <div className="font-semibold text-gray-900">{topic.title}</div>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">{topic.description}</p>
            </a>
          ))}
        </div>
        <div className="mt-6 text-center">
          <a href="/topics" className="text-blue-600 hover:underline text-sm font-medium">View all topics →</a>
        </div>
      </section>

      {/* App CTA */}
      <section className="bg-blue-700 py-16 px-4 text-white text-center">
        <h2 className="text-3xl font-bold">Stop doing the math manually.</h2>
        <p className="mt-3 text-lg text-blue-100 max-w-xl mx-auto">
          RentLedger tracks your US rental income, converts to CAD at official Bank of Canada rates,
          and gives you CRA-ready reports for your accountant.
        </p>
        <a
          href="https://app.rentledger.ca"
          className="mt-6 inline-block rounded-lg bg-white px-8 py-3 font-bold text-blue-700 hover:bg-blue-50"
        >
          Try RentLedger Free →
        </a>
      </section>
    </div>
  );
}
