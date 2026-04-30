/**
 * Download completed batch results from Claude API and write MDX files.
 *
 * Usage:
 *   npx tsx scripts/download-batch.ts --batch-id=msgbatch_xxx
 *   npx tsx scripts/download-batch.ts  (uses batch ID from .batch-meta.json)
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const CONTENT_DIR = path.join(process.cwd(), "content");
const META_PATH = path.join(process.cwd(), "scripts", ".batch-meta.json");

interface BatchMeta {
  batchId: string;
  submittedAt: string;
  outputMap: Record<string, { path: string; frontmatter: Record<string, unknown> }>;
}

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

async function main() {
  const args = process.argv.slice(2);
  let batchId = args.find((a) => a.startsWith("--batch-id="))?.split("=")[1];

  if (!batchId) {
    if (!fs.existsSync(META_PATH)) {
      console.error("❌ No batch ID provided and no .batch-meta.json found.");
      process.exit(1);
    }
    const meta: BatchMeta = JSON.parse(fs.readFileSync(META_PATH, "utf8"));
    batchId = meta.batchId;
    console.log(`Using batch ID from metadata: ${batchId}`);
  }

  // Load output map
  let outputMap: BatchMeta["outputMap"] = {};
  if (fs.existsSync(META_PATH)) {
    const meta: BatchMeta = JSON.parse(fs.readFileSync(META_PATH, "utf8"));
    if (meta.batchId === batchId) outputMap = meta.outputMap;
  }

  // Check batch status
  const batch = await client.messages.batches.retrieve(batchId);
  console.log(`\nBatch: ${batchId}`);
  console.log(`Status: ${batch.processing_status}`);
  console.log(`Request counts:`, batch.request_counts);

  if (batch.processing_status !== "ended") {
    console.log("\n⏳ Batch not yet complete. Try again in a few minutes.");
    process.exit(0);
  }

  // Stream and process results
  console.log("\n📥 Downloading results...");
  let written = 0;
  let failed = 0;

  for await (const result of await client.messages.batches.results(batchId)) {
    const customId = result.custom_id;
    const outputInfo = outputMap[customId];

    if (!outputInfo) {
      console.warn(`⚠️  No output map entry for ${customId}`);
      continue;
    }

    if (result.result.type === "succeeded") {
      const body = result.result.message.content[0].type === "text"
        ? result.result.message.content[0].text
        : "";

      const frontmatter = buildFrontmatter(outputInfo.frontmatter);
      const fullPath = path.join(CONTENT_DIR, outputInfo.path + ".mdx");
      const dir = path.dirname(fullPath);

      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(fullPath, frontmatter + body, "utf8");
      written++;

      if (written % 50 === 0) console.log(`  ✓ Written ${written} files...`);
    } else {
      console.error(`❌ Failed: ${customId}`, result.result.type === "errored" ? result.result.error : "");
      failed++;
    }
  }

  console.log(`\n✅ Complete!`);
  console.log(`   Written: ${written} MDX files`);
  console.log(`   Failed: ${failed}`);
  console.log(`\nNext step: Review content then run 'npm run build' to generate the site.`);
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
