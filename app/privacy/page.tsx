import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "RentLedger privacy policy — how we collect, store, and protect your data.",
  robots: { index: true, follow: false },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: May 1, 2026</p>

      <Section title="What data we collect">
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Account data:</strong> email address, display name, password (hashed).
          </li>
          <li>
            <strong>Property and tenant data:</strong> addresses, lease terms, rent amounts,
            tenant names and contact info that you enter.
          </li>
          <li>
            <strong>Payment and expense data:</strong> rent received, expenses, FX rates, CRA
            remittance records.
          </li>
          <li>
            <strong>Gmail payment data:</strong> only with your explicit OAuth consent.
            RentLedger reads only emails labeled with the <code>RentLedger</code> Gmail label
            (which we create on your behalf during setup) to detect rent payment confirmations.
            We never read your full inbox.
          </li>
        </ul>
      </Section>

      <Section title="How we use it">
        We use your data exclusively to provide RentLedger&apos;s record-keeping and tax-reporting
        features. Specifically: tracking rent received, calculating CRA remittances and
        Schedule E figures, generating reports, and surfacing late-payment alerts. We do not
        use your data for advertising or analytics profiling. We do not use tracking cookies
        or third-party analytics.
      </Section>

      <Section title="Gmail data handling">
        <ul className="list-disc pl-5 space-y-1">
          <li>Accessed only after you grant explicit OAuth consent.</li>
          <li>Used solely to detect rent payment notifications (e-transfers, Interac auto-deposits).</li>
          <li>
            Parsed payment data is stored in your account; the original email content is not
            retained beyond what is needed to deduplicate imports.
          </li>
          <li>Never sold, rented, or shared with third parties.</li>
          <li>
            You can revoke Gmail access at any time in your{" "}
            <a
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noreferrer"
              className="underline text-[hsl(152_60%_36%)]"
            >
              Google Account permissions
            </a>
            . Revoking access does not delete data already imported.
          </li>
        </ul>
      </Section>

      <Section title="Data storage and retention">
        <ul className="list-disc pl-5 space-y-1">
          <li>
            All data is hosted in Canada on Supabase&apos;s <code>ca-central-1</code> region
            (Montréal). Data in transit is encrypted with TLS; data at rest is encrypted
            with AES-256.
          </li>
          <li>
            Account data is retained for as long as your account is active. Upon account
            closure, all personal data is permanently deleted within 30 days.
          </li>
        </ul>
      </Section>

      <Section title="Third-party services">
        RentLedger uses the following third-party services that may process your data:
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>
            <strong>Supabase</strong> — database and authentication hosting (Canada,
            ca-central-1). See{" "}
            <a
              href="https://supabase.com/privacy"
              target="_blank"
              rel="noreferrer"
              className="underline text-[hsl(152_60%_36%)]"
            >
              Supabase Privacy Policy
            </a>
            .
          </li>
          <li>
            <strong>Google OAuth</strong> — used to authenticate your Google account and,
            with your consent, read Gmail labels for rent payment detection.
          </li>
        </ul>
        No other third-party services have access to your personal or financial data.
      </Section>

      <Section title="Your rights">
        You have the right to:
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Access all data we hold about you</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your account and all associated data</li>
          <li>Export your data in CSV format</li>
        </ul>
        To exercise these rights, email{" "}
        <a href="mailto:admin@rentledger.ca" className="underline text-[hsl(152_60%_36%)]">admin@rentledger.ca</a>.
      </Section>

      <Section title="PIPEDA compliance">
        RentLedger complies with Canada&apos;s Personal Information Protection and Electronic
        Documents Act (PIPEDA). We collect only the personal information needed to provide
        the service, obtain meaningful consent, and protect data with appropriate safeguards.
      </Section>

      <Section title="Contact">
        For privacy questions or to file a complaint, email{" "}
        <a href="mailto:admin@rentledger.ca" className="underline text-[hsl(152_60%_36%)]">admin@rentledger.ca</a>.
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
      <div className="text-sm text-gray-600 leading-relaxed">{children}</div>
    </section>
  );
}
