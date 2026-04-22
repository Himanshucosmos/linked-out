# LinkedOut — They thought LinkedIn was Tinder. Let's fix that.

> An AI-powered tool that helps people expose and roast LinkedIn harassers with a single, devastatingly well-written post.

---

## What is this?

LinkedIn has a harassment problem. Professionals — especially women — regularly receive unsolicited, creepy, or outright inappropriate DMs from people hiding behind their "Thought Leader" persona.

**LinkedOut** gives you your power back.

Paste the harasser's LinkedIn URL, drop in the DM they sent, and let AI generate a savage, witty, and empowering callout post — ready to copy and publish directly on LinkedIn.

---

## Features

- 🔗 **LinkedIn Profile Scraper** — Automatically attempts to extract their name, headline, job title, and company from their public profile
- 📋 **Profile Details Input** — Paste their bio/headline manually for a more personalized roast (LinkedIn blocks scrapers aggressively)
- 💬 **DM Input** — Paste the exact message they sent
- 📸 **Screenshot Upload** — Drag & drop evidence screenshots
- 🎯 **Inside Jokes / Extra Context** — Add anything extra to make the roast more specific
- ⚡ **AI-Generated Unified Post** — One cohesive post: roast + professional LinkedIn callout, same voice, same tone
- 📋 **One-Click Copy** — Copy the full post and paste it directly on LinkedIn
- 🌑 **Editorial Dark UI** — Clean, purposeful design that takes the cause seriously

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Vanilla CSS Modules |
| AI | Groq API (llama-3.3-70b-versatile) |
| Scraping | Cheerio |
| Icons | Lucide React |
| Fonts | Playfair Display + Inter (Google Fonts) |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Himanshucosmos/linked-out.git
cd linked-out
```

### 2. Install dependencies

```bash
npm install
```

### 3. Get a free Groq API key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up (free, no credit card needed)
3. Create an API key

### 4. Set up your environment

Create a `.env.local` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key_here
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you're live.

---

## How to Use

1. **Paste the harasser's LinkedIn URL** — e.g. `https://linkedin.com/in/their-username`
2. **Paste their profile details** — Copy their headline, job title, and bio from LinkedIn (this makes the roast way more specific)
3. **Paste the creepy DM** — The exact message they sent
4. **Upload a screenshot** *(optional)* — Drag & drop the DM screenshot
5. **Add extra context** *(optional)* — Anything else worth mentioning
6. **Hit "Roast & Expose 🔥"** — The AI generates a unified, formatted, copy-ready LinkedIn post
7. **Click "Copy & Post on LinkedIn"** — Paste it directly into LinkedIn

---

## Why Groq?

This app uses [Groq](https://groq.com) as the AI backend — it's completely free at reasonable usage, no credit card required, extremely fast, and offers the powerful `llama-3.3-70b-versatile` model which generates high-quality, contextual responses.

---

## A Note on LinkedIn Scraping

LinkedIn aggressively blocks automated scrapers. The app will attempt to fetch public profile metadata (OG tags, headings, meta descriptions) — but this may only work the first time before LinkedIn blocks the server IP.

**For best results**: Copy and paste the person's headline, bio, and job title directly into the "Profile Details" field. The roast will be 10× more specific and personal.

---

## Disclaimer

This tool is built for social awareness and to help people stand up against harassment. All generated content is meant to be:
- Witty and empowering, not hateful
- Platform-safe for LinkedIn
- A tool for accountability, not targeted harassment

Use it responsibly. Call out bad behavior, not people's identities.

---

## Contributing

PRs are welcome! If you have ideas to improve the scraping, prompt quality, or UI — open an issue or submit a pull request.

---

Built with 🔥 by [Himanshu](https://himanshucosmos.vercel.app)
