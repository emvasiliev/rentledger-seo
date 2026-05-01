import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { US_STATES, getStateBySlug } from "@/data/us-states";
import { IRS_FORMS, getFormBySlug } from "@/data/tax-forms";
import { getContentByPath } from "@/lib/content";
import Disclaimer from "@/components/Disclaimer";
import JsonLd, { articleSchema, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

interface Props {
  params: Promise<{ state: string; form: string }>;
}

export async function generateStaticParams() {
  const params: { state: string; form: string }[] = [];
  for (const state of US_STATES) {
    for (const form of IRS_FORMS) {
      params.push({ state: state.slug, form: form.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug, form: formSlug } = await params;
  const state = getStateBySlug(stateSlug);
  const form = getFormBySlug(formSlug);
  if (!state || !form) return {};

  const title = `${form.code} for Canadian Landlords in ${state.name} — Complete Guide`;
  const description = `How to use ${form.code} (${form.name}) as a Canadian landlord with rental property in ${state.name}. ${state.hasStateTax ? `Includes ${state.name}'s ${state.incomeTaxRate}% state tax obligations.` : `${state.name} has no state income tax.`}`;

  return {
    title,
    description,
    keywords: [
      `${form.code.toLowerCase()} ${state.name.toLowerCase()} canadian landlord`,
      `${form.code.toLowerCase()} non-resident ${state.name.toLowerCase()} rental`,
      `canadian landlord ${state.name.toLowerCase()} ${form.tags[0]?.toLowerCase() ?? "irs form"}`,
    ],
    alternates: { canonical: `https://rentledger.ca/forms/irs/${stateSlug}/${formSlug}` },
    openGraph: {
      title,
      description,
      url: `https://rentledger.ca/forms/irs/${stateSlug}/${formSlug}`,
      siteName: "RentLedger",
      type: "article",
    },
  };
}

export default async function IrsStateFormPage({ params }: Props) {
  const { state: stateSlug, form: formSlug } = await params;
  const state = getStateBySlug(stateSlug);
  const form = getFormBySlug(formSlug);
  if (!state || !form) notFound();

  const content = getContentByPath("forms", "irs", stateSlug, formSlug);
  const pageUrl = `https://rentledger.ca/forms/irs/${stateSlug}/${formSlug}`;
  const today = new Date().toISOString().slice(0, 10);

  const faqs = [
    {
      question: `Do I need to file ${form.code} as a Canadian landlord in ${state.name}?`,
      answer: `${form.applicableTo} If you own rental property in ${state.name}, ${form.code} is ${form.authority === "IRS" ? "an IRS requirement" : "required by FinCEN"} — review the eligibility criteria above for your specific situation.`,
    },
    {
      question: `What is the deadline to file ${form.code} for ${state.name} rental income?`,
      answer: `${form.filingDeadline}${state.hasStateTax ? ` You must also file a ${state.name} non-resident state income tax return by the state deadline.` : ""}`,
    },
    {
      question: `Does ${state.name} have its own version of ${form.code}?`,
      answer: `${form.code} is a federal ${form.authority} form and applies the same way in every US state. ${state.hasStateTax ? `However, ${state.name} also requires a separate non-resident state tax return to report your rental income at ${state.name}'s ${state.incomeTaxRate}% income tax rate.` : `${state.name} has no state income tax, so you only need to worry about your federal ${form.authority} obligations and your CRA obligations in Canada.`}`,
    },
    {
      question: `Can I deduct ${state.name} expenses on ${form.code}?`,
      answer: `Deductible expenses depend on the form. For Schedule E and Form 1040-NR, you can typically deduct mortgage interest, property management fees, repairs, property taxes, and depreciation on your ${state.name} rental property. Consult a cross-border tax accountant for your specific situation.`,
    },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://rentledger.ca" },
        { name: "Tax Forms", url: "https://rentledger.ca/forms" },
        { name: "IRS by State", url: "https://rentledger.ca/forms/irs" },
        { name: state.name, url: `https://rentledger.ca/forms/irs/${stateSlug}` },
        { name: form.code, url: pageUrl },
      ])} />
      <JsonLd data={articleSchema({
        title: `${form.code} for Canadian Landlords in ${state.name}`,
        description: `How to use ${form.code} as a Canadian landlord with rental property in ${state.name}.`,
        url: pageUrl,
        publishedAt: content?.frontmatter.publishedAt ?? "2025-01-01",
        updatedAt: content?.frontmatter.updatedAt ?? today,
      })} />
      <JsonLd data={faqSchema(faqs)} />

      <div className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-gray-500">
          <a href="/" className="hover:underline">Home</a>{" › "}
          <a href="/forms" className="hover:underline">Tax Forms</a>{" › "}
          <a href="/forms/irs" className="hover:underline">IRS by State</a>{" › "}
          <a href={`/forms/irs/${stateSlug}`} className="hover:underline">{state.name}</a>{" › "}
          <span>{form.code}</span>
        </nav>

        <div className="mb-2 flex items-center gap-2">
          <span className="inline-block rounded-full bg-[hsl(152_60%_90%)] px-3 py-1 text-xs font-semibold text-[hsl(222_30%_12%)]">
            {form.authority}
          </span>
          <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
            {state.name}
          </span>
        </div>

        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          {form.code} for Canadian Landlords in {state.name}
        </h1>
        <p className="mb-4 text-lg text-gray-600">
          How to use <strong>{form.code}</strong> ({form.name}) when you own rental property in{" "}
          <strong>{state.name}</strong> as a Canadian non-resident.
        </p>

        <Disclaimer />

        <div className="my-6 rounded-lg border border-gray-200 bg-gray-50 p-5 space-y-3">
          <div>
            <span className="text-xs font-semibold uppercase text-gray-400">Filing deadline</span>
            <p className="mt-0.5 text-gray-800">{form.filingDeadline}</p>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase text-gray-400">Who must file</span>
            <p className="mt-0.5 text-gray-800">{form.applicableTo}</p>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase text-gray-400">{state.name} state tax</span>
            <p className="mt-0.5 text-gray-800">
              {state.hasStateTax
                ? `${state.incomeTaxRate}% state income tax — non-resident return required`
                : "No state income tax"}
            </p>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase text-gray-400">Official resource</span>
            <a
              href={form.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 block text-[hsl(152_60%_36%)] hover:underline"
            >
              {form.authority} official page →
            </a>
          </div>
        </div>

        {content ? (
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{content.content}</p>
          </div>
        ) : (
          <DynamicContent form={form} state={state} />
        )}

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

        <div className="mt-12 rounded-xl bg-[hsl(152_60%_96%)] p-6 text-center">
          <h2 className="text-xl font-bold text-[hsl(222_30%_12%)]">
            Simplify your {state.name} rental tax prep
          </h2>
          <p className="mt-2 text-[hsl(152_60%_36%)]">
            RentLedger tracks your {state.name} rental income in USD, converts to CAD at CRA-approved
            rates, and generates reports your accountant needs to file {form.code} and your Canadian
            T1 return.
          </p>
          <a
            href="https://app.rentledger.ca"
            className="mt-4 inline-block rounded-lg bg-[hsl(218_28%_22%)] px-6 py-3 font-semibold text-white hover:bg-[hsl(218_28%_30%)]"
          >
            Try RentLedger Free →
          </a>
        </div>

        <div className="mt-12 border-t pt-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Related guides</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <a
              href={`/forms/irs/${stateSlug}`}
              className="rounded-lg border p-4 hover:border-[hsl(152_60%_75%)] hover:bg-[hsl(152_60%_96%)]"
            >
              <div className="font-medium text-gray-900">All IRS forms for {state.name} →</div>
              <div className="mt-1 text-sm text-gray-500">Every IRS guide for {state.name} landlords</div>
            </a>
            <a
              href={`/forms/${form.slug}`}
              className="rounded-lg border p-4 hover:border-[hsl(152_60%_75%)] hover:bg-[hsl(152_60%_96%)]"
            >
              <div className="font-medium text-gray-900">{form.code} — General Guide →</div>
              <div className="mt-1 text-sm text-gray-500">Overview of {form.code} for all Canadian landlords</div>
            </a>
            <a
              href="/forms/irs"
              className="rounded-lg border p-4 hover:border-[hsl(152_60%_75%)] hover:bg-[hsl(152_60%_96%)]"
            >
              <div className="font-medium text-gray-900">IRS guides by state →</div>
              <div className="mt-1 text-sm text-gray-500">Browse all US states</div>
            </a>
            <a
              href={`/tools/exchange-rate/${new Date().getFullYear() - 1}`}
              className="rounded-lg border p-4 hover:border-[hsl(152_60%_75%)] hover:bg-[hsl(152_60%_96%)]"
            >
              <div className="font-medium text-gray-900">CRA Exchange Rate Tool →</div>
              <div className="mt-1 text-sm text-gray-500">Convert {state.name} rental income to CAD</div>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

function DynamicContent({
  form,
  state,
}: {
  form: NonNullable<ReturnType<typeof getFormBySlug>>;
  state: NonNullable<ReturnType<typeof getStateBySlug>>;
}) {
  return (
    <div className="prose prose-gray max-w-none">
      <h2>What is {form.code}?</h2>
      <p>{form.description}</p>

      <h2>How {form.code} Applies to {state.name} Rental Property</h2>
      <p>
        As a Canadian non-resident landlord with property in <strong>{state.name}</strong>, you must
        comply with both CRA (Canadian) and IRS (US federal) tax obligations.{" "}
        {form.code} is part of your US federal filing requirements.
      </p>
      {state.hasStateTax ? (
        <p>
          <strong>{state.name} also imposes a state income tax</strong> of up to{" "}
          {state.incomeTaxRate}% on rental income. You must file a {state.name} non-resident state
          income tax return in addition to your federal Form 1040-NR.
        </p>
      ) : (
        <p>
          <strong>Good news:</strong> {state.name} has no state income tax, so you only need to
          worry about your federal IRS obligations and your CRA obligations in Canada.
        </p>
      )}

      <h2>Who Must File {form.code}?</h2>
      <p>{form.applicableTo}</p>

      <h2>Filing Deadline</h2>
      <p>{form.filingDeadline}</p>

      <h2>Key Steps for {state.name} Landlords</h2>
      <ol>
        <li>
          <strong>Confirm you need to file</strong> — Review the eligibility criteria above. Not
          every Canadian landlord with {state.name} property will need every IRS form.
        </li>
        <li>
          <strong>Obtain an ITIN if needed</strong> — If you don&apos;t have a US Social Security
          Number, apply for an Individual Taxpayer Identification Number via Form W-7 before filing.
        </li>
        <li>
          <strong>Gather your {state.name} records</strong> — Collect rent received, expenses paid
          (mortgage interest, property management, repairs, insurance), and property tax bills.
        </li>
        <li>
          <strong>Complete {form.code}</strong> — Follow the IRS instructions for this form,
          incorporating your {state.name}-specific figures.
        </li>
        <li>
          <strong>File by the deadline</strong> — {form.filingDeadline}
        </li>
        <li>
          <strong>Report on your Canadian return</strong> — You must also report this income to CRA
          on your T1 return and claim a foreign tax credit for any US tax paid.
        </li>
      </ol>

      {state.specialNotes && (
        <>
          <h2>{state.name}-Specific Notes</h2>
          <p>{state.specialNotes}</p>
        </>
      )}

      <h2>Related IRS Forms</h2>
      <p>
        {form.code} is typically filed alongside other IRS forms. Review the related forms listed
        in the info box above, and consult a cross-border tax accountant to ensure you&apos;re
        filing everything required for your {state.name} rental property.
      </p>
    </div>
  );
}
