import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TOPICS, getTopicBySlug } from "@/data/topics";
import { ALL_FORMS } from "@/data/tax-forms";
import Disclaimer from "@/components/Disclaimer";
import JsonLd, { articleSchema, breadcrumbSchema } from "@/components/JsonLd";
import { getContentByPath } from "@/lib/content";

interface Props {
  params: Promise<{ topic: string }>;
}

export async function generateStaticParams() {
  return TOPICS.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic: topicSlug } = await params;
  const topic = getTopicBySlug(topicSlug);
  if (!topic) return {};

  return {
    title: `${topic.title} | RentLedger`,
    description: topic.description,
    keywords: topic.keywords,
    alternates: { canonical: `https://rentledger.ca/topics/${topicSlug}` },
    openGraph: { title: topic.title, description: topic.description, siteName: "RentLedger" },
  };
}

export default async function TopicPage({ params }: Props) {
  const { topic: topicSlug } = await params;
  const topic = getTopicBySlug(topicSlug);
  if (!topic) notFound();

  const content = getContentByPath("topics", topicSlug);
  const pageUrl = `https://rentledger.ca/topics/${topicSlug}`;
  const today = new Date().toISOString().slice(0, 10);

  const relatedForms = topic.relatedForms
    .map((id) => ALL_FORMS.find((f) => f.id === id))
    .filter(Boolean);

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://rentledger.ca" },
        { name: "Topics", url: "https://rentledger.ca/topics" },
        { name: topic.title, url: pageUrl },
      ])} />
      <JsonLd data={articleSchema({
        title: topic.title,
        description: topic.description,
        url: pageUrl,
        publishedAt: content?.frontmatter.publishedAt ?? "2025-01-01",
        updatedAt: content?.frontmatter.updatedAt ?? today,
      })} />

      <div className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-gray-500">
          <a href="/" className="hover:underline">Home</a> {" › "}
          <a href="/topics" className="hover:underline">Topics</a> {" › "}
          <span>{topic.title}</span>
        </nav>

        <div className="mb-2 flex gap-2">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 capitalize">
            {topic.category.replace("-", " ")}
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 capitalize">
            {topic.difficulty}
          </span>
        </div>

        <h1 className="mb-3 text-3xl font-bold text-gray-900">{topic.title}</h1>
        <p className="mb-6 text-lg text-gray-600">{topic.description}</p>

        <Disclaimer />

        {content ? (
          <div className="prose prose-gray max-w-none mt-8">
            <p className="whitespace-pre-wrap text-gray-700">{content.content}</p>
          </div>
        ) : (
          <div className="prose prose-gray max-w-none mt-8">
            <p className="text-gray-600 italic">
              Detailed content for this topic is being prepared. Check back soon, or{" "}
              <a href="https://app.rentledger.ca" className="text-blue-600 hover:underline">
                try RentLedger
              </a>{" "}
              to manage your cross-border rental accounting directly.
            </p>
          </div>
        )}

        {/* Related forms */}
        {relatedForms.length > 0 && (
          <section className="mt-10 border-t pt-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Related Tax Forms</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {relatedForms.map((form) => form && (
                <a
                  key={form.id}
                  href={`/forms/${form.slug}`}
                  className="rounded-lg border p-4 hover:border-blue-300 hover:bg-blue-50"
                >
                  <div className="font-semibold text-gray-900">{form.code}</div>
                  <div className="mt-1 text-sm text-gray-500 line-clamp-2">{form.name}</div>
                </a>
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 rounded-xl bg-blue-50 p-6 text-center">
          <h2 className="text-xl font-bold text-blue-900">Handle this automatically</h2>
          <p className="mt-2 text-blue-700">
            RentLedger is built specifically for Canadian landlords with US properties — handling
            currency conversion, expense tracking, and CRA-ready reports.
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
