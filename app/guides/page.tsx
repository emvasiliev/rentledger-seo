import type { Metadata } from "next";
import { PROVINCES } from "@/data/provinces";

export const metadata: Metadata = {
  title: "Cross-Border Landlord Tax Guides — All Canadian Provinces",
  description:
    "Tax guides for Canadian landlords with US rental property. Select your province to find guides for every US state — CRA, IRS, exchange rates, FIRPTA and more.",
  alternates: { canonical: "https://rentledger.ca/guides" },
};

export default function GuidesIndexPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <nav className="mb-6 text-sm text-gray-500">
        <a href="/" className="hover:underline">Home</a> {" › "}
        <span>Guides</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold text-gray-900">
        Cross-Border Landlord Tax Guides
      </h1>
      <p className="mb-10 text-lg text-gray-600">
        Select your Canadian province to see tax guides for every US state —
        covering your CRA obligations in Canada and IRS obligations in the US.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {PROVINCES.map((province) => (
          <a
            key={province.slug}
            href={`/guides/${province.slug}`}
            className="rounded-xl border border-gray-200 p-5 hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <div className="font-bold text-gray-900 text-lg">{province.name}</div>
            <div className="mt-1 text-sm text-gray-500">
              {province.majorCities.slice(0, 2).join(", ")}
            </div>
            <div className="mt-3 text-xs text-blue-600 font-medium">
              {51} US state guides →
            </div>
          </a>
        ))}
      </div>

      <div className="mt-16 rounded-xl bg-blue-50 p-6 text-center">
        <h2 className="text-xl font-bold text-blue-900">
          Automate your cross-border rental accounting
        </h2>
        <p className="mt-2 text-blue-700">
          RentLedger tracks your US rental income in USD, converts to CAD using
          official Bank of Canada rates, and generates CRA-ready reports.
        </p>
        <a
          href="https://app.rentledger.ca"
          className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Try RentLedger Free →
        </a>
      </div>
    </div>
  );
}
