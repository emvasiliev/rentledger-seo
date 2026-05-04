import type { Metadata } from "next";
import ScheduleECalculator from "./Calculator";
import Disclaimer from "@/components/Disclaimer";
import JsonLd, { breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Free Schedule E Calculator | Rental Income & Expenses (IRS Part I)",
  description:
    "Calculate your Schedule E rental income and expenses for US tax filing. Supports multiple properties and all IRS deductible expense categories. Free tool.",
  keywords: [
    "Schedule E calculator",
    "Schedule E rental income",
    "IRS Schedule E Part I",
    "rental property tax calculator",
    "rental income loss calculator",
    "form 1040 Schedule E",
    "non-resident rental income US",
  ],
  alternates: { canonical: "https://rentledger.ca/tools/schedule-e-calculator" },
  openGraph: {
    title: "Free Schedule E Calculator",
    description:
      "Calculate your Schedule E rental income and loss — supports multiple properties and all IRS deductible expense categories.",
    siteName: "RentLedger",
  },
};

const PAGE_URL = "https://rentledger.ca/tools/schedule-e-calculator";

export default function ScheduleEPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://rentledger.ca" },
        { name: "Tools", url: "https://rentledger.ca/tools" },
        { name: "Schedule E Calculator", url: PAGE_URL },
      ])} />

      <div className="mx-auto max-w-4xl px-4 py-12">
        <nav className="mb-6 text-sm text-gray-500">
          <a href="/" className="hover:underline">Home</a>{" › "}
          <a href="/tools" className="hover:underline">Tools</a>{" › "}
          <span>Schedule E Calculator</span>
        </nav>

        <h1 className="mb-3 text-3xl font-bold text-gray-900">
          Free Schedule E Calculator
        </h1>

        <p className="mb-2 text-sm font-medium text-[hsl(152_60%_36%)]">
          If you are a Canadian resident with US rental property, you will still use Schedule E as part of your US filing.
        </p>

        <p className="mb-2 text-lg text-gray-600">
          Schedule E (Form 1040) Part I reports rental real estate income and expenses. Enter rents
          received and deductible expenses across your properties to calculate your net income or
          loss.
        </p>

        <Disclaimer />

        {/* Key facts strip */}
        <div className="my-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { value: "15+", label: "Deductible categories",   note: "advertising to depreciation" },
            { value: "Part I", label: "Rental real estate",    note: "up to 3 properties per page" },
            { value: "27.5 yr", label: "Depreciation period",  note: "residential rental property" },
            { value: "$25k", label: "Passive loss allowance",  note: "if actively participating" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
              <div className="text-2xl font-bold text-[hsl(152_60%_36%)]">{s.value}</div>
              <div className="mt-1 text-xs font-medium text-gray-700">{s.label}</div>
              <div className="mt-0.5 text-xs text-gray-400">{s.note}</div>
            </div>
          ))}
        </div>

        {/* Interactive calculator */}
        <ScheduleECalculator />

        {/* How it works */}
        <section className="mt-16 prose prose-gray max-w-none">
          <h2>How Schedule E Part I Works</h2>
          <p>
            Schedule E Part I reports income and expenses from rental real estate. Each property is
            listed separately with its own income and expense totals. The combined net income or
            loss flows to Form 1040 Schedule 1, line 5.
          </p>

          <h3>Passive activity loss rules</h3>
          <p>
            Rental activity is generally classified as passive. Losses can only offset passive income
            unless you actively participate in the rental activity — in which case up to $25,000 of
            loss may be deductible, subject to a phase-out between $100,000–$150,000 of adjusted
            gross income. Real estate professionals who meet the IRS material participation tests
            may deduct losses without limit.
          </p>

          <h3>Depreciation</h3>
          <p>
            Residential rental property is depreciated over 27.5 years under MACRS (Modified
            Accelerated Cost Recovery System). Only the building value is depreciable — not the land.
            Depreciation reduces taxable income annually but is recaptured at sale as unrecaptured
            Section 1250 gain, taxed at a maximum rate of 25%.
          </p>

          <h3>Canadian residents with US rental property</h3>
          <p>
            If you are a Canadian resident earning US rental income, you must file Form 1040-NR
            (non-resident return) and attach Schedule E. You may elect to treat the income as
            effectively connected income, which allows deduction of expenses. Under the
            Canada–US Tax Treaty, Canada generally credits the US tax paid to avoid double taxation.
          </p>

          <h3>Days rented vs. personal use</h3>
          <p>
            If you use the property personally for more than 14 days — or 10% of the days it was
            rented at a fair price, whichever is greater — the IRS treats it as a vacation home.
            Expense deductions are limited to rental income, and losses cannot be carried forward.
          </p>
        </section>

        {/* CTA */}
        <div className="mt-12 rounded-xl bg-[hsl(152_60%_96%)] p-6 text-center">
          <h2 className="text-xl font-bold text-[hsl(222_30%_12%)]">
            Track rental income and expenses automatically
          </h2>
          <p className="mt-2 text-[hsl(152_60%_36%)]">
            RentLedger tracks rent payments, categorizes expenses, and generates tax-ready reports
            — so your accountant has everything they need at year end.
          </p>
          <a
            href="https://app.rentledger.ca"
            className="mt-4 inline-block rounded-lg bg-[hsl(218_28%_22%)] px-6 py-3 font-semibold text-white hover:bg-[hsl(218_28%_30%)]"
          >
            Try RentLedger Free →
          </a>
        </div>

        {/* Related links */}
        <div className="mt-10 border-t pt-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Related guides</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { href: "/tools/cra-remittance-calculator", title: "CRA Remittance Calculator →", desc: "25% Part XIII withholding for Canadian rental property" },
              { href: "/tools/exchange-rate",              title: "CRA Exchange Rate Tool →",   desc: "Official USD/CAD rates accepted by CRA" },
              { href: "/forms/irs",                        title: "IRS Form Guides →",          desc: "Schedule E, 1040-NR, W-7, and more" },
              { href: "/guides",                           title: "Province × State Guides →",  desc: "Your exact cross-border tax guide" },
            ].map((l) => (
              <a key={l.href} href={l.href} className="rounded-lg border p-4 hover:border-[hsl(152_60%_75%)] hover:bg-[hsl(152_60%_96%)]">
                <div className="font-medium text-gray-900">{l.title}</div>
                <div className="mt-1 text-sm text-gray-500">{l.desc}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
