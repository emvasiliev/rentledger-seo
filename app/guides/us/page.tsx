import type { Metadata } from "next";
import { US_STATES } from "@/data/us-states";
import JsonLd, { breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "US Landlord with Canadian Rental Property — Tax Guides by State",
  description:
    "Tax guides for US landlords who own rental property in Canada. Covers IRS reporting of Canadian rental income, CRA Part XIII withholding, Section 216 election, and the Canada-US tax treaty.",
  alternates: { canonical: "https://rentledger.ca/guides/us" },
  openGraph: {
    title: "US Landlord with Canadian Rental Property — Tax Guides",
    description:
      "Complete IRS + CRA tax guides for American landlords who own property in Canada.",
    siteName: "RentLedger",
  },
};

const POPULAR_STATES = ["texas", "california", "florida", "new-york", "washington", "michigan", "ohio", "minnesota", "north-dakota", "montana"];

export default function UsLandlordsIndexPage() {
  const popular = US_STATES.filter((s) => POPULAR_STATES.includes(s.slug));
  const others = US_STATES.filter((s) => !POPULAR_STATES.includes(s.slug));

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://rentledger.ca" },
          { name: "Guides", url: "https://rentledger.ca/guides" },
          { name: "US Landlords with Canadian Property", url: "https://rentledger.ca/guides/us" },
        ])}
      />

      <div className="mx-auto max-w-4xl px-4 py-12">
        <nav className="mb-6 text-sm text-gray-500">
          <a href="/" className="hover:underline">Home</a> {" › "}
          <a href="/guides" className="hover:underline">Guides</a> {" › "}
          <span>US Landlords with Canadian Property</span>
        </nav>

        <h1 className="mb-3 text-3xl font-bold text-gray-900">
          US Landlord with Canadian Rental Property
        </h1>
        <p className="mb-2 text-lg text-gray-600">
          Own a rental property in Canada? As a US resident, you face obligations on <strong>both sides of the border</strong> — the IRS taxes your worldwide income, and CRA withholds tax on Canadian rents paid to non-residents.
        </p>
        <p className="mb-8 text-gray-600">
          Select your home state below to find guides tailored to your situation.
        </p>

        {/* What you need to know banner */}
        <div className="mb-10 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="mb-2 font-semibold text-amber-900">Key things US landlords need to know about Canadian property</h2>
          <ul className="space-y-1 text-sm text-amber-800">
            <li>🇨🇦 Your Canadian property manager must withhold <strong>25% of gross rent</strong> every month and remit to CRA (Part XIII tax)</li>
            <li>📋 You can file a <strong>Section 216 election</strong> to pay tax on net income instead — most landlords get a significant refund</li>
            <li>🇺🇸 You must also report Canadian rental income on your <strong>US return (Schedule E)</strong> and claim a foreign tax credit (Form 1116)</li>
            <li>💱 IRS accepts the Bank of Canada annual average rate to convert CAD income to USD</li>
          </ul>
        </div>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Popular States for US Landlords with Canadian Property
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {popular.map((state) => (
              <a
                key={state.code}
                href={`/guides/us/${state.slug}`}
                className="rounded-lg border border-[hsl(152_60%_85%)] bg-[hsl(152_60%_96%)] p-4 hover:border-[hsl(152_60%_60%)] hover:bg-[hsl(152_60%_90%)] transition-colors"
              >
                <div className="font-semibold text-[hsl(222_30%_12%)]">{state.name}</div>
                <div className="mt-1 text-xs text-[hsl(152_60%_36%)]">
                  Pick your Canadian province →
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">All US States</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {others.map((state) => (
              <a
                key={state.code}
                href={`/guides/us/${state.slug}`}
                className="rounded border p-3 text-sm hover:border-[hsl(152_60%_75%)] hover:bg-[hsl(152_60%_96%)] transition-colors"
              >
                <span className="font-medium text-gray-800">{state.name}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Quick topic links */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Key Topics for US Landlords</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { href: "/topics/part-xiii-withholding-tax-non-resident-canada", label: "Part XIII Withholding Tax (25% on gross rents)", desc: "How CRA taxes non-resident landlords" },
              { href: "/topics/section-216-election-non-resident-rental-canada", label: "Section 216 Election — Get a Refund", desc: "Pay tax on net income, not gross rents" },
              { href: "/topics/nr4-slip-guide-non-resident-landlords", label: "NR4 Slip Guide", desc: "What the NR4 means for your US return" },
              { href: "/topics/foreign-tax-credit-canadian-landlord", label: "Foreign Tax Credit (Form 1116)", desc: "Avoid double taxation on your US return" },
              { href: "/topics/canada-us-tax-treaty-rental-income", label: "Canada-US Tax Treaty", desc: "How the treaty protects US landlords" },
              { href: "/tools/exchange-rate", label: "CAD/USD Exchange Rates", desc: "Convert Canadian rental income to USD for IRS" },
            ].map(({ href, label, desc }) => (
              <a
                key={href}
                href={href}
                className="rounded-lg border p-4 hover:border-[hsl(152_60%_75%)] hover:bg-[hsl(152_60%_96%)] transition-colors"
              >
                <div className="font-medium text-gray-900">{label}</div>
                <div className="mt-1 text-sm text-gray-500">{desc}</div>
              </a>
            ))}
          </div>
        </section>

        <div className="rounded-xl bg-[hsl(152_60%_96%)] p-6 text-center">
          <h2 className="text-xl font-bold text-[hsl(222_30%_12%)]">
            Track your Canadian rental income in USD
          </h2>
          <p className="mt-2 text-[hsl(152_60%_36%)]">
            RentLedger handles CAD→USD conversion using official Bank of Canada rates,
            tracks Part XIII withholding, and exports IRS-ready reports.
          </p>
          <a
            href="https://app.rentledger.ca"
            className="mt-4 inline-block rounded-lg bg-[hsl(218_28%_22%)] px-6 py-3 font-semibold text-white hover:bg-[hsl(218_28%_30%)]"
          >
            Try RentLedger Free →
          </a>
        </div>
      </div>
    </>
  );
}
