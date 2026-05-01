# RentLedger SEO Project Summary

## What Was Built
A programmatic SEO content site for RentLedger.ca targeting cross-border Canadian/US landlord tax keywords.

## Live URLs
- **SEO Content Site:** https://www.rentledger.ca
- **Lovable App:** https://app.rentledger.ca
- **GitHub Repo:** https://github.com/emvasiliev/rentledger-seo
- **Vercel Project:** rentledger-seo

## Project Location
`C:\Users\emvas\OneDrive\Desktop\rentledger-seo`

## What's Live (735 pages)
- 663 Province × US State tax guides (e.g. /guides/ontario/florida)
- 13 Province hub pages (e.g. /guides/ontario)
- 20 Topic deep-dive pages (e.g. /topics/nr4-slip-guide-non-resident-landlords)
- 16 Tax form guides (e.g. /forms/nr4, /forms/t776, /forms/schedule-e)
- 17 Exchange rate year pages (e.g. /tools/exchange-rate/2024)
- Index pages: /guides, /forms, /topics, /tools, /tools/exchange-rate

## SEO Setup
- Sitemap submitted to Google Search Console (735 pages discovered)
- robots.txt pointing to sitemap
- JSON-LD schema on every page (Article, FAQ, Breadcrumb)
- Google Search Console verified for www.rentledger.ca

## Tech Stack
- Next.js 16 (App Router, TypeScript, Tailwind CSS)
- Deployed on Vercel (auto-deploys on git push to main)
- Content stored as MDX files in /content/
- Bank of Canada API for live exchange rates

## Key Files
- `data/provinces.ts` — all 13 Canadian provinces
- `data/us-states.ts` — all 51 US states with tax info
- `data/tax-forms.ts` — CRA and IRS forms
- `data/topics.ts` — topic page definitions
- `lib/bank-of-canada.ts` — exchange rate API
- `app/guides/[province]/[state]/page.tsx` — main guide template
- `app/sitemap.ts` — auto-generated sitemap
- `scripts/generate-content.ts` — Claude API content generator
- `scripts/download-batch.ts` — batch result downloader

## How to Add More Content / Regenerate
```powershell
cd "C:\Users\emvas\OneDrive\Desktop\rentledger-seo"

# Generate all guides via Claude Batch API (~$2-4)
npm run generate:guides

# Wait 10 minutes then download:
npm run batch:download

# Generate topic and form pages:
npm run generate:topics
npm run generate:forms

# Push to deploy:
git add .
git commit -m "Refresh content"
git push
```

## How to Deploy Changes
Any `git push` to main auto-deploys to Vercel.
```powershell
git add .
git commit -m "Your message"
git push
```

## DNS Setup (Namecheap)
- `@` A record → 216.198.79.1 (Vercel)
- `www` CNAME → 6eaf13235fa5f934.vercel-dns-017.com (Vercel)
- `app` CNAME → Lovable (app.rentledger.ca)

## Environment Variables
- `ANTHROPIC_API_KEY` — in .env.local (not committed to git)
- Rotate the API key at console.anthropic.com (old one was exposed in chat)

## TODO / Next Steps
1. Rotate the Anthropic API key (old one was shared in chat)
2. Submit sitemap to Bing Webmaster Tools
3. Check Google Search Console in 7 days for indexed pages
4. Regenerate content yearly when tax rules change
5. Add more topic pages as needed
6. Consider adding a blog for fresh content signals
