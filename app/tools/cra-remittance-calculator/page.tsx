import type { Metadata } from "next";
import Calculator from "./Calculator";
import Disclaimer from "@/components/Disclaimer";
import JsonLd, { breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Free CRA Part XIII Remittance Calculator | Non-Resident Landlord",
  description:
    "Calculate your monthly CRA Part XIII withholding tax as a non-resident landlord. Handles multiple properties, last-month deposits (cash-basis), and NR6 net-rent elections. Free tool.",
  keywords: [
    "CRA Part XIII calculator",
    "non-resident landlord withholding tax",
    "Part XIII remittance calculator",
    "NR4 withholding calculator",
    "canadian non-resident rental tax",
    "25% withholding tax canada rental",
    "NR6 net rent calculator",
  ],
  alternates: { canonical: "https://rentledger.ca/tools/cra-remittance-calculator" },
  openGraph: {
    title: "Free CRA Part XIII Remittance Calculator",
    description:
      "How much do you owe CRA each month as a non-resident landlord? Calculate instantly — supports multiple properties and last-month deposits.",
    siteName: "RentLedger",
  },
};

const PAGE_URL = "https://rentledger.ca/tools/cra-remittance-calculator";

export default function CraRemittanceCalculatorPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://rentledger.ca" },
        { name: "Tools", url: "https://rentledger.ca/tools" },
        { name: "CRA Remittance Calculator", url: PAGE_URL },
      ])} />

      <div className="mx-auto max-w-4xl px-4 py-12">
        <nav className="mb-6 text-sm text-gray-500">
          <a href="/" className="hover:underline">Home</a>{" › "}
          <a href="/tools" className="hover:underline">Tools</a>{" › "}
          <span>CRA Remittance Calculator</span>
        </nav>

        <h1 className="mb-3 text-3xl font-bold text-gray-900">
          Free CRA Part XIII Remittance Calculator
        </h1>
        <p className="mb-2 text-sm font-medium text-[hsl(152_60%_36%)]">
          This calculator is for non-resident landlords (e.g., US residents) earning rental income from Canadian property.
        </p>
        <p className="mb-2 text-lg text-gray-600">
          As a non-resident landlord with Canadian rental property, you must remit{" "}
          <strong>25% of gross rent</strong> to CRA by the 15th of the following month. Calculate
          your monthly obligations across all properties — including last-month deposits.
        </p>

        <Disclaimer />

        {/* Key facts strip */}
        <div className="my-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { value: "25%", label: "Default withholding rate", note: "of gross rent collected" },
            { value: "15th", label: "Monthly due date", note: "of the following month" },
            { value: "NR6", label: "Reduce to net rent", note: "file before Jan 1 each year" },
            { value: "Section 216", label: "Annual return", note: "claim a refund if over-withheld" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
              <div className="text-2xl font-bold text-[hsl(152_60%_36%)]">{s.value}</div>
              <div className="mt-1 text-xs font-medium text-gray-700">{s.label}</div>
              <div className="mt-0.5 text-xs text-gray-400">{s.note}</div>
            </div>
          ))}
        </div>

        {/* Interactive calculator */}
        <Calculator />

        {/* How it works */}
        <section className="mt-16 prose prose-gray max-w-none">
          <h2>How Part XIII Withholding Works</h2>
          <p>
            Under Part XIII of the <em>Income Tax Act</em>, any person who pays rent to a
            non-resident of Canada must withhold 25% of the gross rent and remit it to CRA by the
            15th day of the month following the payment. This applies to both tenant-paid and
            property-manager-collected rents.
          </p>

          <h3>Cash-basis rule for deposits</h3>
          <p>
            A last-month deposit is taxable in the month it was <strong>received</strong>, not the
            month it is credited to the tenant. If a tenant pays a last-month deposit on lease
            signing in January, that amount must be included in January&apos;s remittance — even
            though it will not be applied until the final month of tenancy two years later. This
            is the cash-basis rule used by CRA.
          </p>

          <h3>Multiple properties — one remittance</h3>
          <p>
            If you own more than one Canadian rental property, all Part XIII withholding is
            combined into a single monthly remittance under your NR account number. You do not
            need to file separate remittances per property.
          </p>

          <h3>NR6 election — withhold on net rent</h3>
          <p>
            Filing Form NR6 with CRA before January 1 of the tax year allows you to reduce monthly
            withholding from 25% of gross rent to 25% of net rent (rent minus eligible expenses).
            This significantly improves cash flow. You must then file a Section 216 income tax
            return by June 30 of the following year.
          </p>

          <h3>Section 216 return — recover the rest</h3>
          <p>
            Even without an NR6, you can file a Section 216 return to claim deductions
            (mortgage interest, property tax, management fees, depreciation) and receive a refund
            of over-withheld Part XIII tax. The deadline is 2 years from the end of the tax year.
          </p>
        </section>

        {/* CTA */}
        <div className="mt-12 rounded-xl bg-[hsl(152_60%_96%)] p-6 text-center">
          <h2 className="text-xl font-bold text-[hsl(222_30%_12%)]">
            Track remittances automatically with RentLedger
          </h2>
          <p className="mt-2 text-[hsl(152_60%_36%)]">
            RentLedger calculates your monthly Part XIII owing in real time, handles deposit
            cash-basis timing automatically, and lets you upload NR receipts directly — so your
            accountant has everything they need for your Section 216 return.
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
              { href: "/forms/nr4", title: "NR4 Slip Guide →", desc: "What it is and when it's issued" },
              { href: "/forms/nr6", title: "Form NR6 Guide →", desc: "How to reduce monthly withholding" },
              { href: "/forms/section-216", title: "Section 216 Election →", desc: "Recover over-withheld Part XIII tax" },
              { href: "/forms/part-xiii-withholding", title: "Part XIII Overview →", desc: "Full guide to the withholding rules" },
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
