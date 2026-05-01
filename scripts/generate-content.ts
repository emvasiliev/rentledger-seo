/**
 * RentLedger Programmatic SEO Content Generator
 *
 * Uses Claude API (Batch mode) to generate high-quality MDX content for:
 *   - Province × State guides (663 pages)
 *   - Topic deep-dives (20 pages)
 *   - Form guides (16 pages)
 *
 * Usage:
 *   npx tsx scripts/generate-content.ts --mode=batch --category=guides --province=ontario
 *   npx tsx scripts/generate-content.ts --mode=batch --category=guides --all
 *   npx tsx scripts/generate-content.ts --mode=single --slug=topics/nr4-slip-guide-non-resident-landlords
 *
 * Set ANTHROPIC_API_KEY in .env.local before running.
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { PROVINCES } from "../data/provinces";
import { US_STATES } from "../data/us-states";
import { TOPICS } from "../data/topics";
import { CRA_FORMS, IRS_FORMS } from "../data/tax-forms";
import { getFallbackRate } from "../lib/bank-of-canada";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const CONTENT_DIR = path.join(process.cwd(), "content");
const TODAY = new Date().toISOString().slice(0, 10);
const CURRENT_TAX_YEAR = new Date().getFullYear() - 1;
const CURRENT_RATE = getFallbackRate(CURRENT_TAX_YEAR);

// ─── Prompt Builders ──────────────────────────────────────────────────────────

function buildProvinceStatePrompt(
  provinceName: string,
  provinceCode: string,
  stateName: string,
  stateCode: string,
  hasStateTax: boolean,
  stateTaxRate: number,
  propertyTaxRate: number,
  specialNotes: string | undefined,
  exchangeRate: number
): string {
  return `You are a Canadian cross-border tax expert writing content for RentLedger.ca, a property management platform for Canadian landlords who own US rental property.

Write a detailed, accurate, and practical guide for a ${provinceName} resident who owns rental property in ${stateName}. The content will be published as MDX.

## Requirements:
- Length: 800–1,200 words
- Tone: Practical, trustworthy, jargon-explained
- Structure: Use ## and ### headings
- Include specific tax rates, form numbers, and deadlines
- Do NOT use vague language — be specific
- Do NOT hallucinate tax rules — only state well-known, established tax facts
- End with a 3-5 item bullet list of "Key Takeaways for ${provinceName} landlords"

## Key Facts to Incorporate:
- Province: ${provinceName} (${provinceCode})
- US State: ${stateName} (${stateCode})
- ${stateName} state income tax: ${hasStateTax ? `${stateTaxRate}% (non-resident must file state return)` : "None — no state income tax"}
- ${stateName} average effective property tax rate: ${propertyTaxRate}%
- ${CURRENT_TAX_YEAR} CRA exchange rate: 1 USD = ${exchangeRate} CAD (Bank of Canada annual average)
- Part XIII withholding: 25% on gross rents if no NR6 filed
- US federal default withholding: 30% on gross rents (use Section 871(d) election instead)
${specialNotes ? `- Important: ${specialNotes}` : ""}

## Required Sections:
1. Overview — why this combination has specific tax implications
2. CRA obligations (T776, T1135, foreign tax credit)
3. IRS obligations (ITIN, Form 1040-NR, Schedule E, Section 871(d) election)
${hasStateTax ? `4. ${stateName} state tax obligations` : "4. State tax advantage (no state income tax)"}
5. Selling the property (FIRPTA basics)
6. Key deadlines table (CRA and IRS)
7. Key Takeaways

Do NOT add a disclaimer — that is handled separately on the page.
Do NOT add a CTA — that is handled separately.
Output ONLY the MDX content body (no frontmatter).`;
}

function buildTopicPrompt(
  title: string,
  description: string,
  keywords: string[],
  relatedFormCodes: string[]
): string {
  return `You are a Canadian cross-border tax expert writing content for RentLedger.ca.

Write a detailed, accurate guide on the following topic for Canadian landlords:

## Topic: ${title}

## Description: ${description}

## Target Keywords: ${keywords.join(", ")}

## Related Tax Forms to Reference: ${relatedFormCodes.join(", ")}

## Requirements:
- Length: 1,000–1,500 words
- Tone: Educational, authoritative, practical
- Structure: Use ## and ### headings
- Include form numbers, CRA publication references where applicable
- Be specific with rates, deadlines, thresholds
- Do NOT hallucinate tax rules
- End with a FAQ section (3–5 questions with concise answers)

Output ONLY the MDX content body (no frontmatter, no disclaimer, no CTA).`;
}

function buildIrsStateFormPrompt(
  formCode: string,
  formName: string,
  formDescription: string,
  filingDeadline: string,
  applicableTo: string,
  tags: string[],
  stateName: string,
  stateCode: string,
  hasStateTax: boolean,
  stateTaxRate: number,
  propertyTaxRate: number,
  specialNotes: string | undefined
): string {
  return `You are a Canadian cross-border tax expert writing content for RentLedger.ca.

Write a detailed, state-specific guide to ${formCode} (${formName}) for a Canadian landlord who owns rental property in ${stateName}.

## Form background: ${formDescription}

## Who files it: ${applicableTo}

## Filing deadline: ${filingDeadline}

## Tags/keywords: ${tags.join(", ")}

## ${stateName}-specific context:
- ${stateName} (${stateCode}) state income tax: ${hasStateTax ? `${stateTaxRate}% on rental income — non-resident state return required` : "None — no state income tax"}
- ${stateName} average effective property tax rate: ${propertyTaxRate}%
${specialNotes ? `- Important ${stateName} note: ${specialNotes}` : ""}

## Requirements:
- Length: 800–1,200 words
- Structure: What is it → How it applies specifically in ${stateName} → Who files → Step-by-step how to complete → ${stateName}-specific considerations → Common mistakes → Key deadlines
- Be specific: use ${stateName}'s actual tax rates, form numbers, deadlines
- Reference the Canada-US Tax Treaty where relevant
- Reference the Canadian T1 return and foreign tax credit
- Do NOT hallucinate tax rules
- End with a 3-item "Key Takeaways for ${stateName} landlords" bullet list

Output ONLY the MDX content body (no frontmatter, no disclaimer, no CTA).`;
}

function buildFormPrompt(
  formCode: string,
  formName: string,
  description: string,
  filingDeadline: string,
  applicableTo: string,
  tags: string[]
): string {
  return `You are a Canadian cross-border tax expert writing content for RentLedger.ca.

Write a detailed guide to ${formCode} (${formName}) for Canadian landlords.

## Background: ${description}

## Who files it: ${applicableTo}

## Filing deadline: ${filingDeadline}

## Tags/keywords: ${tags.join(", ")}

## Requirements:
- Length: 800–1,200 words
- Structure: What is it → Who files → Step-by-step how to complete → Common mistakes → FAQ (3 questions)
- Be specific with line numbers, thresholds, deadlines
- Reference related forms by code
- Do NOT hallucinate

Output ONLY the MDX content body (no frontmatter, no disclaimer, no CTA).`;
}

// ─── Frontmatter Builder ──────────────────────────────────────────────────────

function buildFrontmatter(fields: Record<string, unknown>): string {
  const lines = ["---"];
  for (const [key, value] of Object.entries(fields)) {
    if (Array.isArray(value)) {
      lines.push(`${key}:`);
      for (const item of value) lines.push(`  - "${item}"`);
    } else if (typeof value === "string") {
      lines.push(`${key}: "${value.replace(/"/g, '\\"')}"`);
    } else {
      lines.push(`${key}: ${value}`);
    }
  }
  lines.push("---", "");
  return lines.join("\n");
}

// ─── File Writer ──────────────────────────────────────────────────────────────

function writeContent(relativePath: string, frontmatter: string, body: string) {
  const fullPath = path.join(CONTENT_DIR, relativePath + ".mdx");
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, frontmatter + body, "utf8");
  console.log(`✓ Written: ${relativePath}.mdx`);
}

// ─── Single Page Generator ────────────────────────────────────────────────────

async function generateSinglePage(
  prompt: string,
  frontmatterFields: Record<string, unknown>,
  outputPath: string
) {
  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 2048,
    system: "You are a precise, expert cross-border Canadian/US tax writer. Write accurate, well-structured content. Never fabricate tax rules or rates.",
    messages: [{ role: "user", content: prompt }],
  });

  const body = response.content[0].type === "text" ? response.content[0].text : "";
  const frontmatter = buildFrontmatter(frontmatterFields);
  writeContent(outputPath, frontmatter, body);
}

// ─── Batch Generator ─────────────────────────────────────────────────────────

interface BatchRequest {
  custom_id: string;
  params: {
    model: string;
    max_tokens: number;
    system: string;
    messages: Array<{ role: string; content: string }>;
  };
}

async function generateBatch(
  requests: BatchRequest[],
  outputMap: Record<string, { path: string; frontmatter: Record<string, unknown> }>
) {
  console.log(`\nSubmitting batch of ${requests.length} requests to Claude API...`);

  const batch = await client.messages.batches.create({ requests });
  console.log(`Batch ID: ${batch.id}`);
  console.log(`Status: ${batch.processing_status}`);
  console.log(`\nBatch submitted. Results will be ready in a few minutes.`);
  console.log(`Run this to check status and download results:`);
  console.log(`  npx tsx scripts/download-batch.ts --batch-id=${batch.id}`);

  // Save batch metadata for later retrieval
  const batchMeta = {
    batchId: batch.id,
    submittedAt: new Date().toISOString(),
    outputMap,
  };
  const metaPath = path.join(process.cwd(), "scripts", ".batch-meta.json");
  fs.writeFileSync(metaPath, JSON.stringify(batchMeta, null, 2));
  console.log(`\nBatch metadata saved to scripts/.batch-meta.json`);
}

// ─── Main Functions ───────────────────────────────────────────────────────────

async function generateProvinceStateGuides(
  provinceSlugFilter?: string,
  useBatch = true
) {
  const provinces = provinceSlugFilter
    ? PROVINCES.filter((p) => p.slug === provinceSlugFilter)
    : PROVINCES;

  const exchangeRate = CURRENT_RATE?.usdToCad ?? 1.36;

  if (useBatch) {
    const requests: BatchRequest[] = [];
    const outputMap: Record<string, { path: string; frontmatter: Record<string, unknown> }> = {};

    for (const province of provinces) {
      for (const state of US_STATES) {
        const customId = `guide-${province.slug}-${state.slug}`;
        const prompt = buildProvinceStatePrompt(
          province.name, province.code,
          state.name, state.code,
          state.hasStateTax, state.incomeTaxRate,
          state.propertyTaxAvgRate, state.specialNotes,
          exchangeRate
        );

        requests.push({
          custom_id: customId,
          params: {
            model: "claude-haiku-4-5", // use Haiku for cost efficiency on bulk generation
            max_tokens: 2048,
            system: "You are a precise, expert cross-border Canadian/US tax writer. Write accurate, well-structured MDX content. Never fabricate tax rules.",
            messages: [{ role: "user", content: prompt }],
          },
        });

        outputMap[customId] = {
          path: `guides/${province.slug}/${state.slug}`,
          frontmatter: {
            title: `${province.name} Landlord with ${state.name} Rental Property — Tax Guide`,
            description: `Complete tax guide for ${province.name} residents owning rental property in ${state.name}. CRA and IRS obligations explained.`,
            province: province.name,
            provinceCode: province.code,
            state: state.name,
            stateCode: state.code,
            publishedAt: TODAY,
            updatedAt: TODAY,
            reviewed: false,
            disclaimer: true,
            keywords: [
              `${province.name.toLowerCase()} landlord ${state.name.toLowerCase()} rental`,
              `canadian landlord ${state.name.toLowerCase()} tax`,
            ],
          },
        };
      }
    }

    await generateBatch(requests, outputMap);
  } else {
    // Single-page mode — generate immediately
    for (const province of provinces) {
      for (const state of US_STATES.slice(0, 3)) { // limit for testing
        const prompt = buildProvinceStatePrompt(
          province.name, province.code,
          state.name, state.code,
          state.hasStateTax, state.incomeTaxRate,
          state.propertyTaxAvgRate, state.specialNotes,
          exchangeRate
        );
        await generateSinglePage(prompt, {
          title: `${province.name} Landlord with ${state.name} Rental Property — Tax Guide`,
          description: `Tax guide for ${province.name} residents with ${state.name} rental property.`,
          province: province.name,
          state: state.name,
          publishedAt: TODAY,
          updatedAt: TODAY,
          reviewed: false,
          disclaimer: true,
        }, `guides/${province.slug}/${state.slug}`);
      }
    }
  }
}

async function generateTopicPages() {
  for (const topic of TOPICS) {
    const outputPath = `topics/${topic.slug}`;
    const fullPath = path.join(CONTENT_DIR, outputPath + ".mdx");
    if (fs.existsSync(fullPath)) {
      console.log(`⏭  Skipping (exists): ${outputPath}`);
      continue;
    }

    const relatedFormCodes = topic.relatedForms
      .map((id) => [...CRA_FORMS, ...IRS_FORMS].find((f) => f.id === id)?.code)
      .filter(Boolean) as string[];

    const prompt = buildTopicPrompt(
      topic.title, topic.description, topic.keywords, relatedFormCodes
    );

    await generateSinglePage(prompt, {
      title: topic.title,
      description: topic.description,
      publishedAt: TODAY,
      updatedAt: TODAY,
      reviewed: false,
      disclaimer: true,
      keywords: topic.keywords,
      schema: "faq",
    }, outputPath);

    // Rate limit: 1 request per second for single mode
    await new Promise((r) => setTimeout(r, 1000));
  }
}

async function generateFormPages() {
  for (const form of [...CRA_FORMS, ...IRS_FORMS]) {
    const outputPath = `forms/${form.slug}`;
    const fullPath = path.join(CONTENT_DIR, outputPath + ".mdx");
    if (fs.existsSync(fullPath)) {
      console.log(`⏭  Skipping (exists): ${outputPath}`);
      continue;
    }

    const prompt = buildFormPrompt(
      form.code, form.name, form.description,
      form.filingDeadline, form.applicableTo, form.tags
    );

    await generateSinglePage(prompt, {
      title: `${form.code} — ${form.name} | Complete Guide`,
      description: form.description.slice(0, 160),
      form: form.code,
      publishedAt: TODAY,
      updatedAt: TODAY,
      reviewed: false,
      disclaimer: true,
      keywords: form.tags,
      schema: "article",
    }, outputPath);

    await new Promise((r) => setTimeout(r, 1000));
  }
}

async function generateIrsStateFormGuides(useBatch = true) {
  const irsOnlyForms = IRS_FORMS;

  if (useBatch) {
    const requests: BatchRequest[] = [];
    const outputMap: Record<string, { path: string; frontmatter: Record<string, unknown> }> = {};

    for (const state of US_STATES) {
      for (const form of irsOnlyForms) {
        const outputPath = `forms/irs/${state.slug}/${form.slug}`;
        const fullPath = path.join(CONTENT_DIR, outputPath + ".mdx");
        if (fs.existsSync(fullPath)) continue; // skip already-generated

        const customId = `irs-state-${state.slug}-${form.slug}`;
        const prompt = buildIrsStateFormPrompt(
          form.code, form.name, form.description,
          form.filingDeadline, form.applicableTo, form.tags,
          state.name, state.code,
          state.hasStateTax, state.incomeTaxRate,
          state.propertyTaxAvgRate, state.specialNotes
        );

        requests.push({
          custom_id: customId,
          params: {
            model: "claude-haiku-4-5",
            max_tokens: 2048,
            system: "You are a precise, expert cross-border Canadian/US tax writer. Write accurate, well-structured MDX content. Never fabricate tax rules.",
            messages: [{ role: "user", content: prompt }],
          },
        });

        outputMap[customId] = {
          path: outputPath,
          frontmatter: {
            title: `${form.code} for Canadian Landlords in ${state.name} — Complete Guide`,
            description: `How to use ${form.code} as a Canadian landlord with rental property in ${state.name}. ${state.hasStateTax ? `Includes ${state.name}'s ${state.incomeTaxRate}% state tax obligations.` : `${state.name} has no state income tax.`}`,
            form: form.code,
            state: state.name,
            stateCode: state.code,
            publishedAt: TODAY,
            updatedAt: TODAY,
            reviewed: false,
            disclaimer: true,
            keywords: [
              `${form.code.toLowerCase()} ${state.name.toLowerCase()} canadian landlord`,
              `${state.name.toLowerCase()} rental property non-resident ${form.tags[0] ?? ""}`,
            ],
            schema: "article",
          },
        };
      }
    }

    if (requests.length === 0) {
      console.log("⏭  All IRS state form pages already exist — nothing to generate.");
      return;
    }

    await generateBatch(requests, outputMap);
  } else {
    for (const state of US_STATES) {
      for (const form of irsOnlyForms) {
        const outputPath = `forms/irs/${state.slug}/${form.slug}`;
        const fullPath = path.join(CONTENT_DIR, outputPath + ".mdx");
        if (fs.existsSync(fullPath)) {
          console.log(`⏭  Skipping (exists): ${outputPath}`);
          continue;
        }

        const prompt = buildIrsStateFormPrompt(
          form.code, form.name, form.description,
          form.filingDeadline, form.applicableTo, form.tags,
          state.name, state.code,
          state.hasStateTax, state.incomeTaxRate,
          state.propertyTaxAvgRate, state.specialNotes
        );

        await generateSinglePage(prompt, {
          title: `${form.code} for Canadian Landlords in ${state.name}`,
          description: `Guide to ${form.code} for Canadian landlords with ${state.name} rental property.`,
          form: form.code,
          state: state.name,
          publishedAt: TODAY,
          updatedAt: TODAY,
          reviewed: false,
          disclaimer: true,
          schema: "article",
        }, outputPath);

        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }
}

// ─── CLI Entry Point ──────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const mode = args.find((a) => a.startsWith("--mode="))?.split("=")[1] ?? "batch";
  const category = args.find((a) => a.startsWith("--category="))?.split("=")[1];
  const provinceFilter = args.find((a) => a.startsWith("--province="))?.split("=")[1];
  const all = args.includes("--all");

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("❌ ANTHROPIC_API_KEY not set. Add it to .env.local");
    process.exit(1);
  }

  console.log(`\n🚀 RentLedger Content Generator`);
  console.log(`   Mode: ${mode}`);
  console.log(`   Category: ${category ?? "all"}`);
  console.log(`   Tax year: ${CURRENT_TAX_YEAR}`);
  console.log(`   Exchange rate: 1 USD = ${CURRENT_RATE?.usdToCad ?? "N/A"} CAD\n`);

  if (!category || category === "guides" || all) {
    await generateProvinceStateGuides(provinceFilter, mode === "batch");
  }
  if (category === "topics" || all) {
    await generateTopicPages();
  }
  if (category === "forms" || all) {
    await generateFormPages();
  }
  if (category === "irs-state-forms" || all) {
    await generateIrsStateFormGuides(mode === "batch");
  }

  console.log("\n✅ Done!");
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
