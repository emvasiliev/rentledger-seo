import type { Metadata } from "next";
import { US_STATES } from "@/data/us-states";
import { IRS_FORMS } from "@/data/tax-forms";

export const metadata: Metadata = {
  title: "IRS Form Guides by US State | Canadian Landlord Tax Help",
  description:
    "State-specific IRS form guides for Canadian landlords. Select your US state to see how Schedule E, Form 1040-NR, FIRPTA, and other IRS forms apply to your rental property.",
  alternates: { canonical: "https://rentledger.ca/forms/irs" },
};

export default function IrsFormsIndexPage() {
  const popularStates = US_STATES.filter(
    (s) => s.canadianLandlordPopularity === "very-high" || s.canadianLandlordPopularity === "high"
  );
  const otherStates = US_STATES.filter(
    (s) => s.canadianLandlordPopularity !== "very-high" && s.canadianLandlordPopularity !== "high"
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <nav className="mb-6 text-sm text-gray-500">
        <a href="/" className="hover:underline">Home</a>{" › "}
        <a href="/forms" className="hover:underline">Tax Forms</a>{" › "}
        <span>IRS Guides by State</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold text-gray-900">
        IRS Form Guides by US State
      </h1>
      <p className="mb-8 text-lg text-gray-600">
        As a Canadian landlord, your IRS obligations depend on which US state your rental property
        is in. Select your state for a guide covering Schedule E, Form 1040-NR, FIRPTA, and other
        forms specific to that state.
      </p>

      <div className="mb-8 rounded-lg border border-[hsl(152_60%_85%)] bg-[hsl(152_60%_96%)] p-5">
        <h2 className="mb-3 font-semibold text-[hsl(222_30%_12%)]">Forms covered for each state</h2>
        <div className="flex flex-wrap gap-2">
          {IRS_FORMS.map((form) => (
            <span
              key={form.id}
              className="rounded-full bg-white px-3 py-1 text-sm font-medium text-[hsl(222_30%_12%)] shadow-sm"
            >
              {form.code}
            </span>
          ))}
        </div>
      </div>

      <h2 className="mb-4 text-xl font-semibold text-gray-900">Popular states for Canadian landlords</h2>
      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {popularStates.map((state) => (
          <a
            key={state.slug}
            href={`/forms/irs/${state.slug}`}
            className="rounded-lg border border-gray-200 p-4 hover:border-[hsl(152_60%_75%)] hover:bg-[hsl(152_60%_96%)] transition-colors"
          >
            <div className="font-medium text-gray-900">{state.name}</div>
            <div className="mt-1 text-xs text-gray-500">
              {state.hasStateTax ? `${state.incomeTaxRate}% state tax` : "No state tax"}
            </div>
          </a>
        ))}
      </div>

      <h2 className="mb-4 text-xl font-semibold text-gray-900">All US states</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {otherStates.map((state) => (
          <a
            key={state.slug}
            href={`/forms/irs/${state.slug}`}
            className="rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-700 hover:border-[hsl(152_60%_75%)] hover:text-[hsl(152_60%_36%)] transition-colors"
          >
            {state.name}
          </a>
        ))}
      </div>
    </div>
  );
}
