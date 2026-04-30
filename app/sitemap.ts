import type { MetadataRoute } from "next";
import { PROVINCES } from "@/data/provinces";
import { US_STATES } from "@/data/us-states";
import { ALL_FORMS } from "@/data/tax-forms";
import { TOPICS } from "@/data/topics";

const BASE_URL = "https://rentledger.ca";
const MIN_YEAR = 2010;
const MAX_YEAR = new Date().getFullYear();

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [];

  // Static pages
  urls.push(
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/guides`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/forms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/topics`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/tools`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/tools/exchange-rate`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.8 },
  );

  // Province hub pages (13 pages)
  for (const province of PROVINCES) {
    urls.push({
      url: `${BASE_URL}/guides/${province.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // Province × State guide pages (13 × 51 = 663 pages)
  for (const province of PROVINCES) {
    for (const state of US_STATES) {
      urls.push({
        url: `${BASE_URL}/guides/${province.slug}/${state.slug}`,
        lastModified: new Date(),
        changeFrequency: "yearly",
        // Higher priority for popular combinations
        priority: state.canadianLandlordPopularity === "very-high"
          ? 0.8
          : state.canadianLandlordPopularity === "high"
          ? 0.7
          : 0.6,
      });
    }
  }

  // Tax form pages (16 pages)
  for (const form of ALL_FORMS) {
    urls.push({
      url: `${BASE_URL}/forms/${form.slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    });
  }

  // Topic pages (20 pages)
  for (const topic of TOPICS) {
    urls.push({
      url: `${BASE_URL}/topics/${topic.slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: topic.difficulty === "beginner" ? 0.8 : 0.7,
    });
  }

  // Exchange rate year pages (MIN_YEAR to current year)
  for (let year = MAX_YEAR; year >= MIN_YEAR; year--) {
    urls.push({
      url: `${BASE_URL}/tools/exchange-rate/${year}`,
      lastModified: new Date(),
      changeFrequency: year === MAX_YEAR ? "monthly" : "never",
      priority: year >= MAX_YEAR - 3 ? 0.7 : 0.5,
    });
  }

  return urls;
}
