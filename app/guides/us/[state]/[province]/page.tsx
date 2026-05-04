import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { US_STATES, getStateBySlug } from "@/data/us-states";
import { PROVINCES, getProvinceBySlug } from "@/data/provinces";
import { getContentByPath } from "@/lib/content";
import Disclaimer from "@/components/Disclaimer";
import JsonLd, { articleSchema, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

interface Props {
  params: Promise<{ state: string; province: string }>;
}

// Generate all US state × Canadian province combinations at build time
export async function generateStaticParams() {
  const params: { state: string; province: string }[] = [];
  for (const state of US_STATES) {
    for (const province of PROVINCES) {
      params.push({ state: state.slug, province: province.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug, province: provinceSlug } = await params;
  const state = getStateBySlug(stateSlug);
  const province = getProvinceBySlug(provinceSlug);

  if (!state || !province) return {};

  const title = `${state.name} Landlord with ${province.name} Rental Property — Tax Guide`;
  const description = `Complete tax guide for ${state.name} residents who own rental property in ${province.name}, Canada. Covers IRS reporting (Schedule E, Form 1116), CRA Part XIII withholding, Section 216 election, and how to avoid double taxation.`;

  return {
    title,
    description,
    keywords: [
      `${state.name.toLowerCase()} landlord ${province.name.toLowerCase()} canada rental`,
      `US landlord canadian rental property taxes`,
      `${state.code} resident ${province.code} rental income IRS`,
      `american owns property in ${province.name.toLowerCase()} tax`,
    ],
    alternates: {
      canonical: `https://rentledger.ca/guides/us/${stateSlug}/${provinceSlug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://rentledger.ca/guides/us/${stateSlug}/${provinceSlug}`,
      siteName: "RentLedger",
      type: "article",
    },
  };
}

export default async function UsStateProviPage({ params }: Props) {
  const { state: stateSlug, province: provinceSlug } = await params;
  const state = getStateBySlug(stateSlug);
  const province = getProvinceBySlug(provinceSlug);

  if (!state || !province) notFound();

  // Try to load pre-generated MDX content; fall back to dynamic template
  const content = getContentByPath("guides", "us", stateSlug, provinceSlug);

  const pageUrl = `https://rentledger.ca/guides/us/${stateSlug}/${provinceSlug}`;
  const title = `${state.name} Landlord with ${province.name} Rental Property`;

  const faqs = [
    {
      question: `Do I need to report my ${province.name} rental income to the IRS?`,
      answer: `Yes. As a US resident, the IRS taxes your worldwide income, including rental income from ${province.name}, Canada. You report it on Schedule E attached to your Form 1040. You must convert Canadian dollars to USD using the yearly average exchange rate published by the IRS or the Bank of Canada.`,
    },
    {
      question: `What is Part XIII withholding and how does it affect me?`,
      answer: `Under the Canadian Income Tax Act, any person who pays rent to a non-resident of Canada (including you, as a US landlord) must withhold 25% of the gross rent every month and remit it to CRA. This is called Part XIII withholding. Your Canadian property manager should be doing this. If they aren't, you and they may both face penalties.`,
    },
    {
      question: `What is a Section 216 election and should I file one?`,
      answer: `A Section 216 election lets you file a special Canadian income tax return to pay tax on your net rental income (after expenses) instead of the flat 25% on gross rents. In most cases, the net income tax is significantly lower than what was withheld, so you receive a refund from CRA. Most US landlords with Canadian rental property benefit from filing a Section 216 return.`,
    },
    {
      question: `Will I be taxed twice on my ${province.name} rental income?`,
      answer: `Generally no. The Canada-US Tax Treaty prevents double taxation. You pay Canadian tax first (via Part XIII withholding and any Section 216 return), then claim a Foreign Tax Credit on Form 1116 on your US return to offset the Canadian tax paid. The credit is limited to the US tax on that income.`,
    },
    {
      question: `What exchange rate do I use to convert ${province.name} rent to USD for my US return?`,
      answer: `The IRS accepts the yearly average exchange rate. You can use the Bank of Canada annual average USD/CAD rate (the same rate CRA accepts) and simply invert it (CAD to USD = 1 ÷ USD/CAD rate). RentLedger's exchange rate tool has every year's rate.`,
    },
    {
      question: `Do I need to report my ${province.name} property to the IRS or FinCEN?`,
      answer: `The property itself does not need to be reported (unlike FBAR, which covers financial accounts, not real estate). However, if you have Canadian bank accounts holding rental proceeds exceeding $10,000 at any time during the year, you must file an FBAR (FinCEN 114). You may also need to file Form 8938 (FATCA) if the total value of your foreign financial assets exceeds the threshold.`,
    },
  ];

  return (
    <>
      {/* JSON-LD structured data */}
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://rentledger.ca" },
          { name: "Guides", url: "https://rentledger.ca/guides" },
          { name: "US Landlords", url: "https://rentledger.ca/guides/us" },
          { name: state.name, url: `https://rentledger.ca/guides/us/${stateSlug}` },
          { name: province.name, url: pageUrl },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title,
          description: `Tax guide for ${state.name} residents with ${province.name} rental property in Canada.`,
          url: pageUrl,
          publishedAt: content?.frontmatter.publishedAt ?? "2025-01-01",
          updatedAt: content?.frontmatter.updatedAt ?? new Date().toISOString().slice(0, 10),
        })}
      />
      <JsonLd data={faqSchema(faqs)} />

      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <a href="/" className="hover:underline">Home</a>
          {" › "}
          <a href="/guides" className="hover:underline">Guides</a>
          {" › "}
          <a href="/guides/us" className="hover:underline">US Landlords</a>
          {" › "}
          <a href={`/guides/us/${stateSlug}`} className="hover:underline">{state.name}</a>
          {" › "}
          <span>{province.name}</span>
        </nav>

        <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900">
          {state.name} Landlord with {province.name} Rental Property
        </h1>
        <p className="mb-2 text-lg text-gray-600">
          A complete guide to your <strong>IRS obligations</strong> in the US and your{" "}
          <strong>CRA obligations</strong> in Canada as a <strong>{state.name} resident</strong> who
          owns rental property in <strong>{province.name}</strong>.
        </p>

        <Disclaimer />

        {/* Key numbers at a glance */}
        <div className="my-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="CRA Part XIII withholding" value="25%" note="of gross rent to CRA" />
          <StatCard label="Section 216 election" value="Available" note="pay tax on net income" />
          <StatCard label="IRS foreign tax credit" value="Form 1116" note="avoid double taxation" />
          <StatCard label="NR4 slip" value="Issued" note="by your CA property manager" />
        </div>

        {/* Pre-generated MDX content if it exists */}
        {content ? (
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{content.content}</p>
          </div>
        ) : (
          <DynamicContent state={state} province={province} />
        )}

        {/* FAQ Section */}
        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
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
        <div className="mt-12 rounded-xl bg-[hsl(152_60%_96%)] p-6 text-center">
          <h2 className="text-xl font-bold text-[hsl(222_30%_12%)]">
            Automate your cross-border rental accounting
          </h2>
          <p className="mt-2 text-[hsl(152_60%_36%)]">
            RentLedger tracks your {province.name} rental income in CAD, converts to USD at
            official Bank of Canada rates, and generates IRS-ready reports.
          </p>
          <a
            href="https://app.rentledger.ca"
            className="mt-4 inline-block rounded-lg bg-[hsl(218_28%_22%)] px-6 py-3 font-semibold text-white hover:bg-[hsl(218_28%_30%)]"
          >
            Try RentLedger Free →
          </a>
        </div>

        {/* Internal links */}
        <RelatedLinks stateSlug={stateSlug} provinceSlug={provinceSlug} state={state} province={province} />
      </div>
    </>
  );
}

function StatCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
      <div className="text-2xl font-bold text-[hsl(152_60%_36%)]">{value}</div>
      <div className="mt-1 text-xs font-medium text-gray-700">{label}</div>
      <div className="mt-0.5 text-xs text-gray-400">{note}</div>
    </div>
  );
}

function DynamicContent({
  state,
  province,
}: {
  state: NonNullable<ReturnType<typeof getStateBySlug>>;
  province: NonNullable<ReturnType<typeof getProvinceBySlug>>;
}) {
  return (
    <div className="prose prose-gray max-w-none">
      <h2>Overview</h2>
      <p>
        As a <strong>{state.name}</strong> resident owning rental property in{" "}
        <strong>{province.name}</strong>, Canada, you face tax obligations on{" "}
        <em>both sides of the border</em>. The US taxes your worldwide income; Canada taxes
        non-residents on Canadian-source income. The Canada-US Tax Treaty coordinates these two
        systems so you don&apos;t pay full tax twice.
      </p>

      <h2>Step 1: Your CRA (Canadian) Obligations</h2>
      <p>
        Because you are a <em>non-resident of Canada</em>, CRA applies Part XIII withholding tax:
      </p>
      <ul>
        <li>
          <strong>Part XIII Withholding (25%)</strong> — Your Canadian property manager (or agent)
          must withhold 25% of gross rent every month and remit it to CRA using Form NR4. If you
          don&apos;t have an agent, you are technically required to remit this yourself. Failure
          to withhold is a serious compliance issue.
        </li>
        <li>
          <strong>NR6 Election (optional)</strong> — You can file Form NR6 with CRA to have your
          agent withhold based on net rental income (after expenses) instead of gross. This
          reduces your monthly cash outflow significantly.
        </li>
        <li>
          <strong>Section 216 Election (highly recommended)</strong> — You file a special Canadian
          tax return each year. Instead of keeping the 25% withheld on gross rents, CRA taxes you
          on your net rental income at graduated Canadian rates. Most US landlords receive a
          significant refund because their net income is much lower than gross rents.
        </li>
        <li>
          <strong>NR4 Slip</strong> — At year-end, your Canadian agent issues an NR4 slip showing
          gross rents paid and Part XIII tax withheld. This is your receipt for Canadian taxes paid,
          which you&apos;ll use to claim your US foreign tax credit.
        </li>
      </ul>

      <h2>Step 2: Your IRS (US) Obligations</h2>
      <p>
        You must report your {province.name} rental income on your US return, regardless of
        whether you paid Canadian tax on it:
      </p>
      <ul>
        <li>
          <strong>Schedule E (Form 1040)</strong> — Report your Canadian rental income (converted
          to USD at the Bank of Canada annual average rate) and deduct eligible expenses including
          mortgage interest, property taxes, depreciation, management fees, and repairs.
        </li>
        <li>
          <strong>Foreign Tax Credit (Form 1116)</strong> — Claim a credit for the Canadian taxes
          you paid (Part XIII withholding and any Section 216 tax) to offset your US tax on the
          same income. This is the primary mechanism that prevents double taxation.
        </li>
        <li>
          <strong>Currency Conversion</strong> — The IRS requires all foreign income to be
          reported in USD. Use the yearly average CAD/USD exchange rate. The Bank of Canada
          annual average USD/CAD rate can be inverted (1 ÷ USD/CAD = CAD/USD).
        </li>
      </ul>

      <h2>Step 3: {province.name} Provincial Tax</h2>
      <p>
        If you file a Section 216 return, you pay Canadian federal tax on net rental income.
        Provincial tax in {province.name} is also assessed on that same net income. The combined
        federal + provincial rate on modest rental income is typically 20–35%. The total Canadian
        tax paid is creditable on your US return via Form 1116.
      </p>

      <h2>When You Sell the {province.name} Property</h2>
      <p>
        When you sell Canadian real estate as a non-resident, the buyer must withhold 25% of the
        gross sale price under Section 116 of the Canadian Income Tax Act and remit it to CRA.
        You can apply for a clearance certificate before closing to reduce withholding if your
        actual Canadian capital gains tax is less. The sale must also be reported on your US return
        as a capital gain, with a foreign tax credit for Canadian capital gains tax paid.
      </p>

      <h2>Key Deadlines</h2>
      <ul>
        <li>
          <strong>Monthly</strong> — Part XIII withholding must be remitted to CRA by the 15th of
          the following month (or within a certain number of days of payment)
        </li>
        <li>
          <strong>April 15</strong> — US Form 1040 due (with foreign income on Schedule E)
        </li>
        <li>
          <strong>June 15</strong> — Section 216 Canadian return due for the prior tax year
          (if filed voluntarily — 2 years from the end of the tax year if filed late)
        </li>
        <li>
          <strong>April 15</strong> — FBAR (FinCEN 114) due if Canadian bank accounts exceed
          $10,000 at any point during the year
        </li>
      </ul>
    </div>
  );
}

function RelatedLinks({
  stateSlug,
  provinceSlug,
  state,
  province,
}: {
  stateSlug: string;
  provinceSlug: string;
  state: NonNullable<ReturnType<typeof getStateBySlug>>;
  province: NonNullable<ReturnType<typeof getProvinceBySlug>>;
}) {
  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Related Guides &amp; Tools</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <a
          href={`/guides/us/${stateSlug}`}
          className="rounded-lg border p-4 hover:border-[hsl(152_60%_75%)] hover:bg-[hsl(152_60%_96%)]"
        >
          <div className="font-medium text-gray-900">All {state.name} → Canada Guides →</div>
          <div className="mt-1 text-sm text-gray-500">Every Canadian province guide for {state.name} landlords</div>
        </a>
        <a
          href="/topics/part-xiii-withholding-tax-non-resident-canada"
          className="rounded-lg border p-4 hover:border-[hsl(152_60%_75%)] hover:bg-[hsl(152_60%_96%)]"
        >
          <div className="font-medium text-gray-900">Part XIII Withholding Guide →</div>
          <div className="mt-1 text-sm text-gray-500">How 25% withholding works on {province.name} rents</div>
        </a>
        <a
          href="/topics/section-216-election-non-resident-rental-canada"
          className="rounded-lg border p-4 hover:border-[hsl(152_60%_75%)] hover:bg-[hsl(152_60%_96%)]"
        >
          <div className="font-medium text-gray-900">Section 216 Election →</div>
          <div className="mt-1 text-sm text-gray-500">How to get a refund on {province.name} withholding</div>
        </a>
        <a
          href="/tools/exchange-rate"
          className="rounded-lg border p-4 hover:border-[hsl(152_60%_75%)] hover:bg-[hsl(152_60%_96%)]"
        >
          <div className="font-medium text-gray-900">CAD/USD Exchange Rate Tool →</div>
          <div className="mt-1 text-sm text-gray-500">Convert {province.name} rental income to USD for IRS</div>
        </a>
      </div>
    </div>
  );
}
