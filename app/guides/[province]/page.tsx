import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PROVINCES, getProvinceBySlug } from "@/data/provinces";
import { US_STATES, getPopularStates } from "@/data/us-states";
import JsonLd, { breadcrumbSchema } from "@/components/JsonLd";

interface Props {
  params: Promise<{ province: string }>;
}

export async function generateStaticParams() {
  return PROVINCES.map((p) => ({ province: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { province: provinceSlug } = await params;
  const province = getProvinceBySlug(provinceSlug);
  if (!province) return {};

  const title = `${province.name} Landlord Cross-Border Tax Guides — All US States`;
  const description = `Tax guides for ${province.name} residents who own rental property in the United States. Covers every US state — CRA T776, T1135, IRS Schedule E, 1040-NR, FIRPTA, and more.`;

  return {
    title,
    description,
    alternates: { canonical: `https://rentledger.ca/guides/${provinceSlug}` },
    openGraph: { title, description, siteName: "RentLedger" },
  };
}

export default async function ProvinceHubPage({ params }: Props) {
  const { province: provinceSlug } = await params;
  const province = getProvinceBySlug(provinceSlug);
  if (!province) notFound();

  const popularStates = getPopularStates();
  const otherStates = US_STATES.filter(
    (s) => s.canadianLandlordPopularity !== "very-high" && s.canadianLandlordPopularity !== "high"
  );

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://rentledger.ca" },
        { name: "Guides", url: "https://rentledger.ca/guides" },
        { name: province.name, url: `https://rentledger.ca/guides/${provinceSlug}` },
      ])} />

      <div className="mx-auto max-w-4xl px-4 py-12">
        <nav className="mb-6 text-sm text-gray-500">
          <a href="/" className="hover:underline">Home</a> {" › "}
          <a href="/guides" className="hover:underline">Guides</a> {" › "}
          <span>{province.name}</span>
        </nav>

        <h1 className="mb-3 text-3xl font-bold text-gray-900">
          {province.name} Landlord — US Rental Property Tax Guides
        </h1>
        <p className="mb-8 text-lg text-gray-600">
          Select the US state where your rental property is located to get a complete guide
          covering your CRA obligations in Canada and your IRS obligations in the US.
        </p>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Most Popular for {province.name} Landlords
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {province.commonUsStates.map((code) => {
              const state = US_STATES.find((s) => s.code === code);
              if (!state) return null;
              return (
                <a
                  key={code}
                  href={`/guides/${provinceSlug}/${state.slug}`}
                  className="rounded-lg border border-blue-200 bg-blue-50 p-4 hover:border-blue-400 hover:bg-blue-100"
                >
                  <div className="font-semibold text-blue-900">{state.name}</div>
                  <div className="mt-1 text-xs text-blue-600">
                    {state.hasStateTax ? `State tax: ${state.incomeTaxRate}%` : "No state income tax"} ·{" "}
                    Avg property tax: {state.propertyTaxAvgRate}%
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">All US States</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {US_STATES.map((state) => (
              <a
                key={state.code}
                href={`/guides/${provinceSlug}/${state.slug}`}
                className="rounded border p-3 text-sm hover:border-blue-300 hover:bg-blue-50"
              >
                <span className="font-medium text-gray-800">{state.name}</span>
                {!state.hasStateTax && (
                  <span className="ml-1 text-xs text-green-600">No state tax</span>
                )}
              </a>
            ))}
          </div>
        </section>

        <div className="rounded-xl bg-blue-50 p-6 text-center">
          <h2 className="text-xl font-bold text-blue-900">Track your cross-border rental income</h2>
          <p className="mt-2 text-blue-700">
            RentLedger handles USD→CAD conversion using official Bank of Canada rates,
            tracks your expenses, and exports CRA-ready reports.
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
