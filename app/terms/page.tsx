import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "RentLedger terms of service — record-keeping tool for Canadian landlords with US rental property.",
  robots: { index: true, follow: false },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Terms of Service</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: May 1, 2026</p>

      <Section title="1. Service description">
        RentLedger is a record-keeping tool for landlords to track rent, expenses, and tax
        remittances. <strong>RentLedger is not a tax advisor.</strong> Reports, calculations,
        and remittance suggestions are provided for convenience only. You are responsible for
        verifying all data, calculations, and forms before filing with the CRA, IRS, or any
        other tax authority.
      </Section>

      <Section title="2. Acceptable use">
        You agree to use RentLedger only for lawful property management and tax record-keeping
        purposes. You may not attempt to access other users&apos; data, reverse engineer the
        service, or use it to facilitate illegal activity (including tax evasion).
      </Section>

      <Section title="3. No warranty on tax accuracy">
        RentLedger is provided &quot;as is.&quot; We make no warranty that calculations, FX rates,
        remittance amounts, or generated reports are accurate or complete. You bear sole
        responsibility for the accuracy of your tax filings.
      </Section>

      <Section title="4. Limitation of liability">
        To the maximum extent permitted by applicable law, RentLedger and its operators shall
        not be liable for any indirect, incidental, special, consequential, or punitive damages
        — including lost profits, missed tax deadlines, CRA or IRS penalties, or data loss —
        arising out of or in connection with your use of the service. Our total aggregate
        liability to you for any claim shall not exceed the greater of (a) the fees you paid
        to RentLedger in the twelve months preceding the claim, or (b) CAD $50. Some
        jurisdictions do not allow these limitations; in those cases liability is limited to
        the minimum amount permitted by law.
      </Section>

      <Section title="5. User data ownership">
        You own all property, tenant, payment, and expense data you upload to RentLedger. You
        may export or delete it at any time. We will not sell or rent your data to third
        parties. See the <a href="/privacy" className="underline text-[hsl(152_60%_36%)]">Privacy Policy</a> for
        details on how data is stored and used.
      </Section>

      <Section title="6. Termination">
        You may close your account at any time, which will permanently delete your data within
        30 days. We may suspend or terminate accounts that violate these terms or attempt to
        abuse the service.
      </Section>

      <Section title="7. Changes to these terms">
        We may update these terms from time to time. When we make material changes, we will
        notify you by email at least 14 days before the changes take effect. Continued use of
        RentLedger after the effective date constitutes acceptance of the updated terms.
      </Section>

      <Section title="8. Governing law">
        These terms are governed by the laws of the Province of Ontario, Canada. Any disputes
        will be resolved in the courts of Ontario.
      </Section>

      <Section title="9. Contact">
        Questions? Email{" "}
        <a href="mailto:admin@rentledger.ca" className="underline text-[hsl(152_60%_36%)]">
          admin@rentledger.ca
        </a>
        .
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-sm text-gray-600 leading-relaxed">{children}</p>
    </section>
  );
}
