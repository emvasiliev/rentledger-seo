import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools for Canadian Landlords with US Property",
  description: "Free tools for Canadian landlords — CRA exchange rate converter, withholding calculators, and more.",
  alternates: { canonical: "https://rentledger.ca/tools" },
};

export default function ToolsIndexPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <nav className="mb-6 text-sm text-gray-500">
        <a href="/" className="hover:underline">Home</a> {" › "}
        <span>Tools</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold text-gray-900">Free Tools for Cross-Border Landlords</h1>
      <p className="mb-10 text-lg text-gray-600">
        Practical calculators and reference tools for Canadian landlords with US rental property.
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <a href="/tools/exchange-rate"
          className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6 hover:border-blue-400 transition">
          <div className="text-3xl mb-3">🏦</div>
          <div className="font-bold text-gray-900 text-lg">CRA Exchange Rate Tool</div>
          <p className="mt-2 text-gray-600 text-sm">
            Official Bank of Canada annual average USD/CAD rates accepted by CRA — every year from 2010 to present.
          </p>
          <div className="mt-4 text-blue-600 text-sm font-medium">View all years →</div>
        </a>

        <a href="/guides"
          className="rounded-xl border-2 border-gray-200 p-6 hover:border-blue-400 transition">
          <div className="text-3xl mb-3">🗺️</div>
          <div className="font-bold text-gray-900 text-lg">Province × State Guide Finder</div>
          <p className="mt-2 text-gray-600 text-sm">
            Find your exact tax guide — every Canadian province paired with every US state.
          </p>
          <div className="mt-4 text-blue-600 text-sm font-medium">Browse guides →</div>
        </a>
      </div>

      <div className="mt-12 rounded-xl bg-blue-50 p-6 text-center">
        <h2 className="text-xl font-bold text-blue-900">The ultimate tool: RentLedger</h2>
        <p className="mt-2 text-blue-700">
          Automates currency conversion, tracks expenses, and generates CRA-ready reports for your accountant.
        </p>
        <a href="https://app.rentledger.ca"
          className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
          Try RentLedger Free →
        </a>
      </div>
    </div>
  );
}
