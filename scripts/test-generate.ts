/**
 * Quick single-page test — generates ONE guide and prints it to the console.
 * No files written. No API key file needed if you pass it inline.
 *
 * Usage:
 *   $env:ANTHROPIC_API_KEY="sk-ant-..."
 *   npx tsx scripts/test-generate.ts
 *
 * Or inline:
 *   npx tsx scripts/test-generate.ts (with ANTHROPIC_API_KEY already in env)
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PROMPT = `You are a Canadian cross-border tax expert writing content for RentLedger.ca, a property management platform for Canadian landlords who own US rental property.

Write a detailed, accurate, and practical guide for an Ontario resident who owns rental property in Florida. The content will be published as MDX.

## Requirements:
- Length: 800–1,200 words
- Tone: Practical, trustworthy, jargon-explained
- Structure: Use ## and ### headings
- Include specific tax rates, form numbers, and deadlines
- Do NOT use vague language — be specific
- Do NOT hallucinate tax rules — only state well-known, established tax facts
- End with a 3-5 item bullet list of "Key Takeaways for Ontario landlords"

## Key Facts to Incorporate:
- Province: Ontario (ON)
- US State: Florida (FL)
- Florida state income tax: None — no state income tax
- Florida average effective property tax rate: 0.89%
- 2024 CRA exchange rate: 1 USD = 1.3606 CAD (Bank of Canada annual average)
- Part XIII withholding: 25% on gross rents if no NR6 filed
- US federal default withholding: 30% on gross rents (use Section 871(d) election instead)
- Important: No state income tax. Most popular US state for Canadian landlords, especially Ontario and Quebec.

## Required Sections:
1. Overview — why this combination has specific tax implications
2. CRA obligations (T776, T1135, foreign tax credit)
3. IRS obligations (ITIN, Form 1040-NR, Schedule E, Section 871(d) election)
4. State tax advantage (no state income tax)
5. Selling the property (FIRPTA basics)
6. Key deadlines table (CRA and IRS)
7. Key Takeaways

Do NOT add a disclaimer — that is handled separately on the page.
Do NOT add a CTA — that is handled separately.
Output ONLY the MDX content body (no frontmatter).`;

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("❌ ANTHROPIC_API_KEY not set.");
    console.error("   Run: $env:ANTHROPIC_API_KEY=\"sk-ant-...\"");
    process.exit(1);
  }

  console.log("🚀 Generating test page: Ontario landlord with Florida rental property...\n");
  console.log("─".repeat(60));

  const stream = await client.messages.stream({
    model: "claude-opus-4-5",
    max_tokens: 2048,
    system: "You are a precise, expert cross-border Canadian/US tax writer. Write accurate, well-structured MDX content. Never fabricate tax rules or rates.",
    messages: [{ role: "user", content: PROMPT }],
  });

  // Stream output to console in real time
  for await (const chunk of stream) {
    if (
      chunk.type === "content_block_delta" &&
      chunk.delta.type === "text_delta"
    ) {
      process.stdout.write(chunk.delta.text);
    }
  }

  const finalMessage = await stream.finalMessage();
  console.log("\n" + "─".repeat(60));
  console.log(`\n✅ Done!`);
  console.log(`   Model: ${finalMessage.model}`);
  console.log(`   Input tokens:  ${finalMessage.usage.input_tokens}`);
  console.log(`   Output tokens: ${finalMessage.usage.output_tokens}`);
  console.log(`   Estimated cost: ~$${((finalMessage.usage.input_tokens * 0.000015) + (finalMessage.usage.output_tokens * 0.000075)).toFixed(4)}`);
  console.log(`\n👉 To generate all 663 guides via batch (cheapest), run:`);
  console.log(`   npm run generate:guides`);
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
