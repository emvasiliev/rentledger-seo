import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ALL_FORMS, getFormBySlug } from "@/data/tax-forms";
import Disclaimer from "@/components/Disclaimer";
import JsonLd, { articleSchema, breadcrumbSchema } from "@/components/JsonLd";

interface Props {
  params: Promise<{ form: string }>;
}

export async function generateStaticParams() {
  return ALL_FORMS.map((f) => ({ form: f.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { form: formSlug } = await params;
  const form = getFormBySlug(formSlug);
  if (!form) return {};

  const title = `${form.code} — ${form.name} | Canadian Landlord Guide`;
  const description = `Complete guide to ${form.code} for Canadian landlords. ${form.description.slice(0, 150)}...`;

  return {
    title,
    description,
    keywords: form.tags,
    alternates: { canonical: `https://rentledger.ca/forms/${formSlug}` },
    openGraph: { title, description, siteName: "RentLedger" },
  };
}

export default async function FormPage({ params }: Props) {
  const { form: formSlug } = await params;
  const form = getFormBySlug(formSlug);
  if (!form) notFound();

  const pageUrl = `https://rentledger.ca/forms/${formSlug}`;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://rentledger.ca" },
        { name: "Tax Forms", url: "https://rentledger.ca/forms" },
        { name: form.code, url: pageUrl },
      ])} />
      <JsonLd data={articleSchema({
        title: `${form.code} — ${form.name}`,
        description: form.description,
        url: pageUrl,
        publishedAt: "2025-01-01",
        updatedAt: today,
      })} />

      <div className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-gray-500">
          <a href="/" className="hover:underline">Home</a> {" › "}
          <a href="/forms" className="hover:underline">Tax Forms</a> {" › "}
          <span>{form.code}</span>
        </nav>

        <div className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
          {form.authority}
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">{form.code}</h1>
        <p className="mb-1 text-lg font-medium text-gray-700">{form.name}</p>

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
            <span className="text-xs font-semibold uppercase text-gray-400">Official resource</span>
            <a
              href={form.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 block text-blue-600 hover:underline"
            >
              {form.authority === "CRA" ? "CRA" : form.authority === "IRS" ? "IRS" : "FinCEN"} official page →
            </a>
          </div>
        </div>

        <div className="prose prose-gray max-w-none">
          <h2>What is {form.code}?</h2>
          <p>{form.description}</p>

          <h2>Who Needs to File {form.code}?</h2>
          <p>{form.applicableTo}</p>

          <h2>Filing Deadline</h2>
          <p>{form.filingDeadline}</p>

          {form.relatedForms.length > 0 && (
            <>
              <h2>Related Forms</h2>
              <ul>
                {form.relatedForms.map((relatedId) => {
                  const related = ALL_FORMS.find((f) => f.id === relatedId);
                  if (!related) return null;
                  return (
                    <li key={relatedId}>
                      <a href={`/forms/${related.slug}`} className="text-blue-600 hover:underline">
                        {related.code} — {related.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>

        {/* Tags */}
        <div className="mt-8 flex flex-wrap gap-2">
          {form.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-xl bg-blue-50 p-6 text-center">
          <h2 className="text-xl font-bold text-blue-900">Simplify your cross-border tax prep</h2>
          <p className="mt-2 text-blue-700">
            RentLedger automatically tracks your rental income, converts currencies using CRA-approved
            rates, and exports reports your accountant can use to file {form.code}.
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
