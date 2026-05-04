import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "RentLedger — Cross-Border Landlord Tax Guides",
    template: "%s | RentLedger",
  },
  description:
    "Tax guides for Canadian landlords with US rental property. CRA T776, T1135, IRS Schedule E, 1040-NR, exchange rates, FIRPTA — everything explained.",
  metadataBase: new URL("https://rentledger.ca"),
  alternates: { canonical: "https://rentledger.ca" },
  openGraph: {
    siteName: "RentLedger",
    type: "website",
    locale: "en_CA",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    google: "RHxI-kJsRNkWzQzk08HiBpDcywXWKkznbeVZDYpStE0",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="border-b border-[hsl(215_20%_88%)] bg-card">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div
            className="h-8 w-8 rounded-[0.625rem] flex items-center justify-center"
            style={{ backgroundColor: "hsl(218 28% 22%)" }}
          >
            {/* Receipt icon (lucide) — inlined SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
              <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
              <path d="M12 17.5v-11" />
            </svg>
          </div>
          <span
            className="font-semibold text-[hsl(222_30%_12%)]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            RentLedger
          </span>
        </a>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-6 text-sm text-[hsl(215_16%_40%)]">
          <a href="/tools/cra-remittance-calculator" className="font-medium text-[hsl(152_60%_36%)] hover:text-[hsl(152_60%_28%)] transition-colors">CRA Calculator</a>
          <a href="/tools/schedule-e-calculator" className="font-medium text-[hsl(152_60%_36%)] hover:text-[hsl(152_60%_28%)] transition-colors">Schedule E Calculator</a>
          <a href="/guides" className="hover:text-[hsl(152_60%_36%)] transition-colors">CA Guides</a>
          <a href="/guides/us" className="hover:text-[hsl(152_60%_36%)] transition-colors">US Guides</a>
          <a href="/forms" className="hover:text-[hsl(152_60%_36%)] transition-colors">Forms</a>
          <a href="/topics" className="hover:text-[hsl(152_60%_36%)] transition-colors">Topics</a>
          <a href="/tools/exchange-rate" className="hover:text-[hsl(152_60%_36%)] transition-colors">Exchange Rate</a>
          <a
            href="https://app.rentledger.ca"
            className="rounded-[0.625rem] px-4 py-2 font-semibold text-[hsl(210_40%_98%)] bg-[hsl(218_28%_22%)] hover:bg-[hsl(218_28%_30%)] transition-colors"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Open App →
          </a>
        </nav>

        {/* Mobile nav */}
        <a
          href="https://app.rentledger.ca"
          className="sm:hidden rounded-[0.625rem] px-3 py-1.5 text-sm font-semibold text-[hsl(210_40%_98%)]"
          style={{ backgroundColor: "hsl(218 28% 22%)" }}
        >
          App →
        </a>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer
      className="border-t mt-16 py-10"
      style={{ borderColor: "hsl(215 20% 88%)", backgroundColor: "hsl(0 0% 100%)" }}
    >
      <div className="mx-auto max-w-5xl px-4">
        {/* Logo row */}
        <div className="flex items-center gap-2 mb-8">
          <div
            className="h-7 w-7 rounded-[0.5rem] flex items-center justify-center"
            style={{ backgroundColor: "hsl(218 28% 22%)" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
              <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
              <path d="M12 17.5v-11" />
            </svg>
          </div>
          <span
            className="font-semibold text-[hsl(222_30%_12%)]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            RentLedger
          </span>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-5">
          <div>
            <div
              className="text-sm font-semibold mb-3 text-[hsl(222_30%_12%)]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Guides
            </div>
            <div className="space-y-2 text-sm text-[hsl(215_16%_40%)]">
              <a href="/guides/ontario" className="block hover:text-[hsl(152_60%_36%)] transition-colors">Ontario</a>
              <a href="/guides/british-columbia" className="block hover:text-[hsl(152_60%_36%)] transition-colors">British Columbia</a>
              <a href="/guides/alberta" className="block hover:text-[hsl(152_60%_36%)] transition-colors">Alberta</a>
              <a href="/guides/quebec" className="block hover:text-[hsl(152_60%_36%)] transition-colors">Quebec</a>
              <a href="/guides" className="block font-medium text-[hsl(152_60%_36%)] hover:underline">All provinces →</a>
            </div>
          </div>
          <div>
            <div
              className="text-sm font-semibold mb-3 text-[hsl(222_30%_12%)]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Popular States
            </div>
            <div className="space-y-2 text-sm text-[hsl(215_16%_40%)]">
              <a href="/guides/ontario/florida" className="block hover:text-[hsl(152_60%_36%)] transition-colors">Florida</a>
              <a href="/guides/british-columbia/arizona" className="block hover:text-[hsl(152_60%_36%)] transition-colors">Arizona</a>
              <a href="/guides/ontario/texas" className="block hover:text-[hsl(152_60%_36%)] transition-colors">Texas</a>
              <a href="/guides/british-columbia/washington" className="block hover:text-[hsl(152_60%_36%)] transition-colors">Washington</a>
            </div>
          </div>
          <div>
            <div
              className="text-sm font-semibold mb-3 text-[hsl(222_30%_12%)]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              US Landlords
            </div>
            <div className="space-y-2 text-sm text-[hsl(215_16%_40%)]">
              <a href="/guides/us" className="block hover:text-[hsl(152_60%_36%)] transition-colors">US → Canada Guides</a>
              <a href="/guides/us/texas/ontario" className="block hover:text-[hsl(152_60%_36%)] transition-colors">Texas → Ontario</a>
              <a href="/guides/us/california/british-columbia" className="block hover:text-[hsl(152_60%_36%)] transition-colors">California → BC</a>
              <a href="/guides/us/florida/ontario" className="block hover:text-[hsl(152_60%_36%)] transition-colors">Florida → Ontario</a>
              <a href="/topics/section-216-election-non-resident-rental-canada" className="block hover:text-[hsl(152_60%_36%)] transition-colors">Section 216 Election</a>
            </div>
          </div>
          <div>
            <div
              className="text-sm font-semibold mb-3 text-[hsl(222_30%_12%)]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Tax Forms
            </div>
            <div className="space-y-2 text-sm text-[hsl(215_16%_40%)]">
              <a href="/forms/nr4" className="block hover:text-[hsl(152_60%_36%)] transition-colors">NR4</a>
              <a href="/forms/t776" className="block hover:text-[hsl(152_60%_36%)] transition-colors">T776</a>
              <a href="/forms/section-216" className="block hover:text-[hsl(152_60%_36%)] transition-colors">Section 216</a>
              <a href="/forms/schedule-e" className="block hover:text-[hsl(152_60%_36%)] transition-colors">Schedule E</a>
              <a href="/forms" className="block font-medium text-[hsl(152_60%_36%)] hover:underline">All forms →</a>
            </div>
          </div>
          <div>
            <div
              className="text-sm font-semibold mb-3 text-[hsl(222_30%_12%)]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Tools
            </div>
            <div className="space-y-2 text-sm text-[hsl(215_16%_40%)]">
              <a href="/tools/cra-remittance-calculator" className="block hover:text-[hsl(152_60%_36%)] transition-colors">CRA Remittance Calc</a>
              <a href="/tools/exchange-rate/2024" className="block hover:text-[hsl(152_60%_36%)] transition-colors">2024 Exchange Rate</a>
              <a href="/tools/exchange-rate/2023" className="block hover:text-[hsl(152_60%_36%)] transition-colors">2023 Exchange Rate</a>
              <a href="/tools/exchange-rate" className="block font-medium text-[hsl(152_60%_36%)] hover:underline">All years →</a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-xs text-[hsl(215_16%_40%)]" style={{ borderColor: "hsl(215 20% 88%)" }}>
          <p>© {new Date().getFullYear()} RentLedger. All content is for informational purposes only and does not constitute tax or legal advice.</p>
          <p className="mt-1">Always consult a qualified cross-border tax professional for advice specific to your situation.</p>
          <div className="mt-3 flex gap-4">
            <a href="/terms" className="hover:text-[hsl(152_60%_36%)] transition-colors">Terms of Service</a>
            <a href="/privacy" className="hover:text-[hsl(152_60%_36%)] transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
