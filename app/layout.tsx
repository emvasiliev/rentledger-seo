import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className={`${geist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-gray-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <a href="/" className="flex items-center gap-2 font-bold text-blue-700 text-lg">
          <span className="text-2xl">🏠</span> RentLedger
        </a>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-gray-600">
          <a href="/guides" className="hover:text-blue-700">Guides</a>
          <a href="/forms" className="hover:text-blue-700">Forms</a>
          <a href="/topics" className="hover:text-blue-700">Topics</a>
          <a href="/tools/exchange-rate" className="hover:text-blue-700">Exchange Rate</a>
          <a
            href="https://app.rentledger.ca"
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          >
            App →
          </a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-10 mt-16">
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <div className="font-semibold text-gray-800 mb-3">Guides</div>
            <div className="space-y-2 text-sm text-gray-500">
              <a href="/guides/ontario" className="block hover:text-blue-600">Ontario</a>
              <a href="/guides/british-columbia" className="block hover:text-blue-600">British Columbia</a>
              <a href="/guides/alberta" className="block hover:text-blue-600">Alberta</a>
              <a href="/guides/quebec" className="block hover:text-blue-600">Quebec</a>
              <a href="/guides" className="block text-blue-600 hover:underline">All provinces →</a>
            </div>
          </div>
          <div>
            <div className="font-semibold text-gray-800 mb-3">Popular States</div>
            <div className="space-y-2 text-sm text-gray-500">
              <a href="/guides/ontario/florida" className="block hover:text-blue-600">Florida</a>
              <a href="/guides/british-columbia/arizona" className="block hover:text-blue-600">Arizona</a>
              <a href="/guides/ontario/texas" className="block hover:text-blue-600">Texas</a>
              <a href="/guides/british-columbia/washington" className="block hover:text-blue-600">Washington</a>
            </div>
          </div>
          <div>
            <div className="font-semibold text-gray-800 mb-3">Tax Forms</div>
            <div className="space-y-2 text-sm text-gray-500">
              <a href="/forms/nr4" className="block hover:text-blue-600">NR4</a>
              <a href="/forms/t776" className="block hover:text-blue-600">T776</a>
              <a href="/forms/section-216" className="block hover:text-blue-600">Section 216</a>
              <a href="/forms/schedule-e" className="block hover:text-blue-600">Schedule E</a>
              <a href="/forms" className="block text-blue-600 hover:underline">All forms →</a>
            </div>
          </div>
          <div>
            <div className="font-semibold text-gray-800 mb-3">Tools</div>
            <div className="space-y-2 text-sm text-gray-500">
              <a href="/tools/exchange-rate/2024" className="block hover:text-blue-600">2024 Exchange Rate</a>
              <a href="/tools/exchange-rate/2023" className="block hover:text-blue-600">2023 Exchange Rate</a>
              <a href="/tools/exchange-rate/2022" className="block hover:text-blue-600">2022 Exchange Rate</a>
              <a href="/tools/exchange-rate" className="block text-blue-600 hover:underline">All years →</a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} RentLedger. All content is for informational purposes only and does not constitute tax or legal advice.</p>
          <p className="mt-1">Always consult a qualified cross-border tax professional for advice specific to your situation.</p>
        </div>
      </div>
    </footer>
  );
}
