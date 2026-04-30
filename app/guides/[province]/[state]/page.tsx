import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PROVINCES, getProvinceBySlug } from "@/data/provinces";
import { US_STATES, getStateBySlug } from "@/data/us-states";
import { getContentByPath } from "@/lib/content";
import Disclaimer from "@/components/Disclaimer";
import JsonLd, { articleSchema, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

interface Props {
  params: Promise<{ province: string; state: string }>;
}

// Generate all province × state combinations at build time
export async function generateStaticParams() {
  const params: { province: string; state: string }[] = [];
  for (const province of PROVINCES) {
    for (const state of US_STATES) {
      params.push({ province: province.slug, state: state.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { province: provinceSlug, state: stateSlug } = await params;
  const province = getProvinceBySlug(provinceSlug);
  const state = getStateBySlug(stateSlug);

  if (!province || !state) return {};

  const title = `${province.name} Landlord with ${state.name} Rental Property — Tax Guide`;
  const description = `Complete tax guide for ${province.name} residents who own rental property in ${state.name}. Covers CRA reporting (T776, T1135), IRS obligations (1040-NR, Schedule E), Part XIII withholding, and how to avoid double taxation.`;

  return {
    title,
    description,
    keywords: [
      `${province.name.toLowerCase()} landlord ${state.name.toLowerCase()} property`,
      `canadian landlord ${state.name.toLowerCase()} rental taxes`,
      `${province.code} resident ${state.code} rental income CRA`,
      `${province.name.toLowerCase()} resident US rental property IRS`,
    ],
    alternates: {
      canonical: `https://rentledger.ca/guides/${provinceSlug}/${stateSlug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://rentledger.ca/guides/${provinceSlug}/${stateSlug}`,
      siteName: "RentLedger",
      type: "article",
    },
  };
}

export default async function ProvinceStatePage({ params }: Props) {
  const { province: provinceSlug, state: stateSlug } = await params;
  const province = getProvinceBySlug(provinceSlug);
  const state = getStateBySlug(stateSlug);

  if (!province || !state) notFound();

  // Try to load pre-generated MDX content; fall back to dynamic template
  const content = getContentByPath("guides", provinceSlug, stateSlug);

  const pageUrl = `https://rentledger.ca/guides/${provinceSlug}/${stateSlug}`;
  const title = `${province.name} Landlord with ${state.name} Rental Property`;

  const faqs = [
    {
      question: `Do I need to report my ${state.name} rental income to CRA?`,
      answer: `Yes. As a ${province.name} resident, you must report your worldwide income to CRA, including rental income from ${state.name}. You report this on your T1 return and complete Form T776 (or equivalent) for the rental income and expenses. If the property cost more than CAD $100,000, you must also file Form T1135.`,
    },
    {
      question: `What US tax forms do I need as a ${province.name} landlord with ${state.name} rental income?`,
      answer: `You will typically need: Form W-7 (to get an ITIN if you don't have one), Form 1040-NR (US non-resident tax return), Schedule E (to report rental income and expenses), and Form 4562 (to claim depreciation on the property). You should also make a Section 871(d) election to treat the income as effectively connected so you can deduct expenses.`,
    },
    {
      question: `Will I be taxed twice on my ${state.name} rental income?`,
      answer: `Generally no. The Canada-US Tax Treaty prevents double taxation. You pay US tax first (via Form 1040-NR), then claim a foreign tax credit on your Canadian return to offset the US tax paid. The credit cannot exceed the Canadian tax payable on that income.`,
    },
    {
      question: `What exchange rate should I use to convert ${state.name} rental income to CAD for CRA?`,
      answer: `CRA accepts the Bank of Canada annual average exchange rate for the tax year. You can find the official rate on the Bank of Canada website or use RentLedger's exchange rate tool.`,
    },
    {
      question: `Do I need to withhold tax if I sell my ${state.name} property?`,
      answer: `Yes — under FIRPTA (Foreign Investment in Real Property Tax Act), the buyer must withhold 15% of the gross sale price when a foreign person (including Canadians) sells US real estate. You can apply for a withholding certificate (Form 8288-B) to reduce this if your actual tax liability is less than 15%.`,
    },
  ];

  if (state.hasStateTax) {
    faqs.push({
      question: `Does ${state.name} impose its own income tax on my rental income?`,
      answer: `Yes. ${state.name} has a state income tax rate of up to ${state.incomeTaxRate}% on rental income. As a non-resident of ${state.name}, you will need to file a ${state.name} state non-resident income tax return in addition to your federal Form 1040-NR.`,
    });
  }

  return (
    <>
      {/* JSON-LD structured data */}
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://rentledger.ca" },
        { name: "Guides", url: "https://rentledger.ca/guides" },
        { name: province.name, url: `https://rentledger.ca/guides/${provinceSlug}` },
        { name: state.name, url: pageUrl },
      ])} />
      <JsonLd data={articleSchema({
        title,
        description: `Tax guide for ${province.name} residents with ${state.name} rental property.`,
        url: pageUrl,
        publishedAt: content?.frontmatter.publishedAt ?? "2025-01-01",
        updatedAt: content?.frontmatter.updatedAt ?? new Date().toISOString().slice(0, 10),
      })} />
      <JsonLd data={faqSchema(faqs)} />

      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <a href="/" className="hover:underline">Home</a>
          {" › "}
          <a href="/guides" className="hover:underline">Guides</a>
          {" › "}
          <a href={`/guides/${provinceSlug}`} className="hover:underline">{province.name}</a>
          {" › "}
          <span>{state.name}</span>
        </nav>

        <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900">
          {province.name} Landlord with {state.name} Rental Property
        </h1>
        <p className="mb-2 text-lg text-gray-600">
          A complete guide to your CRA and IRS obligations as a <strong>{province.name} resident</strong> who
          owns rental property in <strong>{state.name}</strong>.
        </p>

        <Disclaimer />

        {/* Key numbers at a glance */}
        <div className="my-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Federal US withholding" value="30%" note="or 15% with treaty" />
          <StatCard label={`${state.name} state tax`} value={state.hasStateTax ? `${state.incomeTaxRate}%` : "None"} note={state.hasStateTax ? "state income tax" : "no state income tax"} />
          <StatCard label="CRA foreign credit" value="Available" note="via T1 return" />
          <StatCard label="Avg property tax" value={`${state.propertyTaxAvgRate}%`} note={`${state.name} effective rate`} />
        </div>

        {/* Pre-generated MDX content if it exists */}
        {content ? (
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{content.content}</p>
          </div>
        ) : (
          <DynamicContent province={province} state={state} />
        )}

        {/* FAQ Section */}
        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-lg border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-12 rounded-xl bg-blue-50 p-6 text-center">
          <h2 className="text-xl font-bold text-blue-900">
            Automate your cross-border rental accounting
          </h2>
          <p className="mt-2 text-blue-700">
            RentLedger tracks your {state.name} rental income in USD and automatically converts to CAD
            using CRA-approved Bank of Canada exchange rates.
          </p>
          <a
            href="https://app.rentledger.ca"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Try RentLedger Free →
          </a>
        </div>

        {/* Internal links */}
        <RelatedLinks provinceSlug={provinceSlug} stateSlug={stateSlug} province={province} state={state} />
      </div>
    </>
  );
}

function StatCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
      <div className="text-2xl font-bold text-blue-600">{value}</div>
      <div className="mt-1 text-xs font-medium text-gray-700">{label}</div>
      <div className="mt-0.5 text-xs text-gray-400">{note}</div>
    </div>
  );
}

function DynamicContent({
  province,
  state,
}: {
  province: ReturnType<typeof getProvinceBySlug>;
  state: ReturnType<typeof getStateBySlug>;
}) {
  if (!province || !state) return null;

  return (
    <div className="prose prose-gray max-w-none">
      <h2>Overview</h2>
      <p>
        As a <strong>{province.name}</strong> resident owning rental property in{" "}
        <strong>{state.name}</strong>, you face tax obligations on <em>both sides of the border</em>.
        Canada taxes you on your worldwide income; the US taxes you on US-source income. The
        Canada-US Tax Treaty coordinates these two systems so you don&apos;t pay full tax twice.
      </p>

      <h2>Step 1: Your CRA (Canadian) Obligations</h2>
      <p>
        You must report all {state.name} rental income on your Canadian T1 return. Key forms:
      </p>
      <ul>
        <li>
          <strong>T776</strong> — Statement of Real Estate Rentals. Report your gross US rent
          (converted to CAD using the Bank of Canada annual average rate) and all eligible expenses.
        </li>
        <li>
          <strong>T1135</strong> — Foreign Income Verification. If the cost of your {state.name}{" "}
          property (and other foreign assets) exceeded CAD $100,000 at any point in the year, you
          must file this form.
        </li>
        <li>
          <strong>Foreign Tax Credit</strong> — You can claim a credit for US income tax paid on
          your {state.name} rental income to avoid double taxation.
        </li>
      </ul>

      <h2>Step 2: Your IRS (US Federal) Obligations</h2>
      <p>
        As a non-resident alien (NRA) with US rental property, you have two options under the IRS
        rules:
      </p>
      <ul>
        <li>
          <strong>Default (30% flat withholding)</strong> — Your tenant withholds 30% of gross rent
          and remits to the IRS. No deductions allowed. Almost always a bad option.
        </li>
        <li>
          <strong>Section 871(d) Election (recommended)</strong> — You elect to treat the rental
          income as Effectively Connected Income (ECI). You then file Form 1040-NR with Schedule E
          and can deduct mortgage interest, property taxes, depreciation (27.5 years), management
          fees, and other expenses. You pay tax only on net income at graduated US rates.
        </li>
      </ul>
      <p>
        To file Form 1040-NR, you need either a US Social Security Number or an Individual
        Taxpayer Identification Number (ITIN) obtained via Form W-7.
      </p>

      {state.hasStateTax && (
        <>
          <h2>Step 3: {state.name} State Tax</h2>
          <p>
            {state.name} imposes state income tax of up to{" "}
            <strong>{state.incomeTaxRate}%</strong> on rental income. As a non-resident of{" "}
            {state.name}, you must file a {state.name} non-resident state income tax return in
            addition to your federal Form 1040-NR. The state tax paid may also be creditable on
            your Canadian T1 return, subject to foreign tax credit limits.
          </p>
        </>
      )}

      {!state.hasStateTax && (
        <>
          <h2>Step 3: {state.name} State Tax</h2>
          <p>
            <strong>Good news:</strong> {state.name} has no state income tax. You only need to
            worry about federal US tax via Form 1040-NR and your Canadian CRA obligations.
          </p>
        </>
      )}

      <h2>When You Sell the {state.name} Property</h2>
      <p>
        When a Canadian sells US real estate, FIRPTA (Foreign Investment in Real Property Tax Act)
        requires the buyer to withhold <strong>15% of the gross sale price</strong> and remit it to
        the IRS. You can apply for a withholding certificate (Form 8288-B) before closing to reduce
        this if your actual tax liability is less. The sale is also reported on your Canadian T1
        return as a capital gain (or loss), with a foreign tax credit for US tax paid.
      </p>

      <h2>Key Deadlines</h2>
      <ul>
        <li>
          <strong>April 30</strong> — Canadian T1 return due (or June 15 if self-employed)
        </li>
        <li>
          <strong>April 15</strong> — US Form 1040-NR due (or June 15 if no wages subject to
          withholding)
        </li>
        <li>
          <strong>April 15</strong> — FBAR (FinCEN 114) due if you have Canadian bank accounts
          over $10,000 and are a US person
        </li>
      </ul>

      {state.specialNotes && (
        <>
          <h2>{state.name}-Specific Notes</h2>
          <p>{state.specialNotes}</p>
        </>
      )}
    </div>
  );
}

function RelatedLinks({
  provinceSlug,
  stateSlug,
  province,
  state,
}: {
  provinceSlug: string;
  stateSlug: string;
  province: NonNullable<ReturnType<typeof getProvinceBySlug>>;
  state: NonNullable<ReturnType<typeof getStateBySlug>>;
}) {
  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Related Guides</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <a href={`/guides/${provinceSlug}`} className="rounded-lg border p-4 hover:border-blue-300 hover:bg-blue-50">
          <div className="font-medium text-gray-900">All {province.name} Cross-Border Guides →</div>
          <div className="mt-1 text-sm text-gray-500">Every US state guide for {province.name} landlords</div>
        </a>
        <a href="/forms/t1135" className="rounded-lg border p-4 hover:border-blue-300 hover:bg-blue-50">
          <div className="font-medium text-gray-900">T1135 Foreign Property Report →</div>
          <div className="mt-1 text-sm text-gray-500">Report your {state.name} property to CRA</div>
        </a>
        <a href="/forms/schedule-e" className="rounded-lg border p-4 hover:border-blue-300 hover:bg-blue-50">
          <div className="font-medium text-gray-900">Schedule E Guide →</div>
          <div className="mt-1 text-sm text-gray-500">How to deduct {state.name} rental expenses on your US return</div>
        </a>
        <a href={`/tools/exchange-rate/${new Date().getFullYear() - 1}`} className="rounded-lg border p-4 hover:border-blue-300 hover:bg-blue-50">
          <div className="font-medium text-gray-900">CRA Exchange Rate Tool →</div>
          <div className="mt-1 text-sm text-gray-500">Convert {state.name} rental income to CAD</div>
        </a>
      </div>
    </div>
  );
}
