import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { US_STATES, getStateBySlug } from "@/data/us-states";
import { PROVINCES } from "@/data/provinces";
import JsonLd, { breadcrumbSchema } from "@/components/JsonLd";

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

  const title = `${state.name} Landlord with Canadian Rental Property — Tax Guides by Province`;
  const description = `Tax guides for ${state.name} residents who own rental property in Canada. IRS Schedule E reporting, CRA Part XIII withholding, Section 216 election, and the Canada-US tax treaty — explained for every Canadian province.`;

  return {
    title,
    description,
    alternates: { canonical: `https://rentledger.ca/guides/us/${stateSlug}` },
    openGraph: { title, description, siteName: "RentLedger" },
  };
}

export default async function UsStateLandlordHubPage({ params }: Props) {
  const { state: stateSlug } = await params;
  const state = getStateBySlug(stateSlug);
  if (!state) notFound();

  // Sort provinces: BC, ON, AB, QC first (most US landlords buy in these)
  const popularProvinceCodes = ["BC", "ON", "AB", "QC", "MB", "SK"];
  const popularProvinces = PROVINCES.filter((p) => popularProvinceCodes.includes(p.code));
  const otherProvinces = PROVINCES.filter((p) => !popularProvinceCodes.includes(p.code));

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://rentledger.ca" },
          { name: "Guides", url: "https://rentledger.ca/guides" },
          { name: "US Landlords", url: "https://rentledger.ca/guides/us" },
          { name: state.name, url: `https://rentledger.ca/guides/us/${stateSlug}` },
        ])}
      />

      <div className="mx-auto max-w-4xl px-4 py-12">
        <nav className="mb-6 text-sm text-gray-500">
          <a href="/" className="hover:underline">Home</a> {" › "}
          <a href="/guides" className="hover:underline">Guides</a> {" › "}
          <a href="/guides/us" className="hover:underline">US Landlords</a> {" › "}
          <span>{state.name}</span>
        </nav>

        <h1 className="mb-3 text-3xl font-bold text-gray-900">
          {state.name} Landlord — Canadian Rental Property Tax Guides
        </h1>
        <p className="mb-8 text-lg text-gray-600">
          Select the Canadian province where your rental property is located to get a complete guide
          covering your IRS obligations in the US and your CRA obligations in Canada.
        </p>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Most Popular Provinces</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {popularProvinces.map((province) => (
              <a
                key={province.code}
                href={`/guides/us/${stateSlug}/${province.slug}`}
                className="rounded-lg border border-[hsl(152_60%_85%)] bg-[hsl(152_60%_96%)] p-4 hover:border-[hsl(152_60%_60%)] hover:bg-[hsl(152_60%_90%)] transition-colors"
              >
                <div className="font-semibold text-[hsl(222_30%_12%)]">{province.name}</div>
                <div className="mt-1 text-xs text-[hsl(152_60%_36%)]">
                  {province.majorCities[0]} · IRS + CRA guide →
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">All Canadian Provinces &amp; Territories</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {otherProvinces.map((province) => (
              <a
                key={province.code}
                href={`/guides/us/${stateSlug}/${province.slug}`}
                className="rounded border p-3 text-sm hover:border-[hsl(152_60%_75%)] hover:bg-[hsl(152_60%_96%)] transition-colors"
              >
                <span className="font-medium text-gray-800">{province.name}</span>
              </a>
            ))}
          </div>
        </section>

        <div className="rounded-xl bg-[hsl(152_60%_96%)] p-6 text-center">
          <h2 className="text-xl font-bold text-[hsl(222_30%_12%)]">
            Automate your cross-border rental accounting
          </h2>
          <p className="mt-2 text-[hsl(152_60%_36%)]">
            RentLedger tracks Canadian rental income in CAD, converts to USD for IRS reporting,
            and monitors your Part XIII withholding obligations.
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
