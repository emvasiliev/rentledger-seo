import type { Metadata } from "next";
import { TOPICS } from "@/data/topics";

export const metadata: Metadata = {
  title: "Cross-Border Landlord Tax Topics — Canadian & US Property",
  description: "Deep-dive guides on every cross-border landlord tax topic — Part XIII withholding, Section 216, FIRPTA, exchange rates, T1135, FBAR and more.",
  alternates: { canonical: "https://rentledger.ca/topics" },
};

const CATEGORY_LABELS: Record<string, string> = {
  "cra": "🇨🇦 CRA (Canadian)",
  "irs": "🇺🇸 IRS (US)",
  "cross-border": "🌎 Cross-Border",
  "treaty": "📄 Tax Treaty",
  "compliance": "✅ Compliance",
  "accounting": "🧾 Accounting",
};

export default function TopicsIndexPage() {
  const grouped = TOPICS.reduce((acc, topic) => {
    if (!acc[topic.category]) acc[topic.category] = [];
    acc[topic.category].push(topic);
    return acc;
  }, {} as Record<string, typeof TOPICS>);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <nav className="mb-6 text-sm text-gray-500">
        <a href="/" className="hover:underline">Home</a> {" › "}
        <span>Topics</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold text-gray-900">Cross-Border Landlord Tax Topics</h1>
      <p className="mb-10 text-lg text-gray-600">
        Deep-dive guides on the forms, rules, and strategies every Canadian landlord with US property needs to understand.
      </p>

      {Object.entries(grouped).map(([category, topics]) => (
        <section key={category} className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            {CATEGORY_LABELS[category] ?? category}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {topics.map((topic) => (
              <a key={topic.slug} href={`/topics/${topic.slug}`}
                className="rounded-xl border p-5 hover:border-[hsl(152_60%_60%)] hover:bg-[hsl(152_60%_96%)] transition">
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 capitalize">
                    {topic.difficulty}
                  </span>
                </div>
                <div className="font-semibold text-gray-900">{topic.title}</div>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{topic.description}</p>
              </a>
            ))}
          </div>
        </section>
      ))}

      <div className="rounded-xl bg-[hsl(152_60%_96%)] p-6 text-center">
        <h2 className="text-xl font-bold text-[hsl(222_30%_12%)]">Handle it all automatically</h2>
        <p className="mt-2 text-[hsl(152_60%_36%)]">RentLedger is built for Canadian landlords with US properties.</p>
        <a href="https://app.rentledger.ca"
          className="mt-4 inline-block rounded-lg bg-[hsl(218_28%_22%)] px-6 py-3 font-semibold text-white hover:bg-[hsl(218_28%_30%)]">
          Try RentLedger Free →
        </a>
      </div>
    </div>
  );
}
