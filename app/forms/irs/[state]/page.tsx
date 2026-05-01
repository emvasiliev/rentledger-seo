import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { US_STATES, getStateBySlug } from "@/data/us-states";
import { IRS_FORMS } from "@/data/tax-forms";

interface Props {
  params: Promise<{ state: string }>;
}

export async function generateStaticParams() {
  return US_STATES.map((s) => ({ state: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const state = getStateBySlug(stateSlug);
  if (!state) return {};

  const title = `IRS Forms for Canadian Landlords in ${state.name} | Tax Guide`;
  const description = `Complete IRS form guides for Canadian landlords with rental property in ${state.name}. Covers Schedule E, Form 1040-NR, FIRPTA, ITIN, and more — with ${state.name}-specific tax rates and rules.`;

  return {
    title,
    description,
    keywords: [
      `canadian landlord ${state.name.toLowerCase()} IRS forms`,
      `${state.name.toLowerCase()} rental property non-resident tax`,
      `schedule e ${state.name.toLowerCase()} canadian landlord`,
      `form 1040-nr ${state.name.toLowerCase()} rental income`,
    ],
    alternates: { canonical: `https://rentledger.ca/forms/irs/${stateSlug}` },
    openGraph: { title, description, siteName: "RentLedger" },
  };
}

export default async function IrsStateHubPage({ params }: Props) {
  const { state: stateSlug } = await params;
  const state = getStateBySlug(stateSlug);
  if (!state) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <nav className="mb-6 text-sm text-gray-500">
        <a href="/" className="hover:underline">Home</a>{" › "}
        <a href="/forms" className="hover:underline">Tax Forms</a>{" › "}
        <a href="/forms/irs" className="hover:underline">IRS by State</a>{" › "}
        <span>{state.name}</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold text-gray-900">
        IRS Forms for Canadian Landlords in {state.name}
      </h1>
      <p className="mb-6 text-lg text-gray-600">
        Your IRS obligations as a Canadian landlord with {state.name} rental property. Each guide
        is tailored to {state.name}&apos;s specific tax rules.
      </p>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {state.hasStateTax ? `${state.incomeTaxRate}%` : "None"}
          </div>
          <div className="mt-1 text-xs font-medium text-gray-700">{state.name} state income tax</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{state.propertyTaxAvgRate}%</div>
          <div className="mt-1 text-xs font-medium text-gray-700">Avg property tax rate</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">15%</div>
          <div className="mt-1 text-xs font-medium text-gray-700">FIRPTA withholding on sale</div>
        </div>
      </div>

      {state.specialNotes && (
        <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>{state.name} note:</strong> {state.specialNotes}
        </div>
      )}

      <h2 className="mb-4 text-xl font-semibold text-gray-900">IRS Form Guides for {state.name}</h2>
      <div className="space-y-3">
        {IRS_FORMS.map((form) => (
          <a
            key={form.id}
            href={`/forms/irs/${stateSlug}/${form.slug}`}
            className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="min-w-[90px]">
              <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-bold text-blue-800">
                {form.code}
              </span>
            </div>
            <div>
              <div className="font-medium text-gray-900">{form.name}</div>
              <div className="mt-1 text-sm text-gray-500">{form.description.slice(0, 120)}…</div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-10 rounded-xl bg-blue-50 p-6 text-center">
        <h2 className="text-xl font-bold text-blue-900">Track your {state.name} rental income</h2>
        <p className="mt-2 text-blue-700">
          RentLedger automatically converts {state.name} rental income to CAD using CRA-approved
          rates and generates the reports you need for Schedule E and Form 1040-NR.
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
