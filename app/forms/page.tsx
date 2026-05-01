import type { Metadata } from "next";
import { CRA_FORMS, IRS_FORMS } from "@/data/tax-forms";

export const metadata: Metadata = {
  title: "Canadian Landlord Tax Forms — CRA & IRS Guide",
  description: "Complete guides to every tax form Canadian landlords with US property need — NR4, T776, Section 216, Schedule E, FIRPTA, FBAR and more.",
  alternates: { canonical: "https://rentledger.ca/forms" },
};

export default function FormsIndexPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <nav className="mb-6 text-sm text-gray-500">
        <a href="/" className="hover:underline">Home</a> {" › "}
        <span>Tax Forms</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold text-gray-900">Tax Forms for Canadian Landlords</h1>
      <p className="mb-10 text-lg text-gray-600">
        Every CRA and IRS form a Canadian landlord with US rental property needs to know — explained in plain language.
      </p>

      <section className="mb-12">
        <h2 className="mb-5 text-xl font-bold text-gray-900">🇨🇦 CRA Forms</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CRA_FORMS.map((form) => (
            <a key={form.slug} href={`/forms/${form.slug}`}
              className="rounded-xl border p-5 hover:border-blue-400 hover:bg-blue-50 transition">
              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">{form.code}</span>
              </div>
              <div className="mt-2 font-semibold text-gray-900">{form.name}</div>
              <div className="mt-1 text-sm text-gray-500 line-clamp-2">{form.description.slice(0, 100)}...</div>
              <div className="mt-2 text-xs text-gray-400">Due: {form.filingDeadline.split(".")[0]}</div>
            </a>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-5 text-xl font-bold text-gray-900">🇺🇸 IRS Forms</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {IRS_FORMS.map((form) => (
            <a key={form.slug} href={`/forms/${form.slug}`}
              className="rounded-xl border p-5 hover:border-blue-400 hover:bg-blue-50 transition">
              <div className="flex items-center gap-2">
                <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-bold text-red-800">{form.code}</span>
              </div>
              <div className="mt-2 font-semibold text-gray-900">{form.name}</div>
              <div className="mt-1 text-sm text-gray-500 line-clamp-2">{form.description.slice(0, 100)}...</div>
              <div className="mt-2 text-xs text-gray-400">Due: {form.filingDeadline.split(".")[0]}</div>
            </a>
          ))}
        </div>
      </section>

      <div className="rounded-xl bg-blue-50 p-6 text-center">
        <h2 className="text-xl font-bold text-blue-900">Let RentLedger handle the paperwork prep</h2>
        <p className="mt-2 text-blue-700">Track income, convert currencies, and export CRA-ready reports automatically.</p>
        <a href="https://app.rentledger.ca"
          className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
          Try RentLedger Free →
        </a>
      </div>
    </div>
  );
}
