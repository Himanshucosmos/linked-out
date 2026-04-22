import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import * as cheerio from 'cheerio';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Scrape publicly available LinkedIn profile metadata
async function scrapeLinkedInProfile(url: string): Promise<string> {
  try {
    // Try multiple user agents — LinkedIn blocks most but sometimes lets Google bots through
    const headers = {
      'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'Cache-Control': 'no-cache',
    };

    const res = await fetch(url, { headers, next: { revalidate: 0 } });

    if (!res.ok) {
      return `[Profile could not be scraped — LinkedIn returned ${res.status}. Using URL only.]`;
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Extract all available meta tags LinkedIn exposes
    const title = $('title').text().trim();
    const ogTitle = $('meta[property="og:title"]').attr('content') ?? '';
    const ogDescription = $('meta[property="og:description"]').attr('content') ?? '';
    const description = $('meta[name="description"]').attr('content') ?? '';
    const twitterTitle = $('meta[name="twitter:title"]').attr('content') ?? '';
    const twitterDesc = $('meta[name="twitter:description"]').attr('content') ?? '';

    // Also try to grab any visible text from the page body (for cases where we get partial access)
    const h1Text = $('h1').first().text().trim();
    const h2Text = $('h2').first().text().trim();

    const profileInfo = [
      title && `Page Title: ${title}`,
      ogTitle && `Name/Headline (OG): ${ogTitle}`,
      ogDescription && `Profile Summary (OG): ${ogDescription}`,
      description && `Meta Description: ${description}`,
      twitterTitle && `Twitter Title: ${twitterTitle}`,
      twitterDesc && `Twitter Description: ${twitterDesc}`,
      h1Text && `Page H1: ${h1Text}`,
      h2Text && `Page H2: ${h2Text}`,
    ]
      .filter(Boolean)
      .join('\n');

    return profileInfo || '[No public profile data extracted. LinkedIn may have blocked this request.]';
  } catch (err: any) {
    return `[Profile scraping failed: ${err?.message}]`;
  }
}

// Extract username from LinkedIn URL for fallback persona building
function extractUsername(url: string): string {
  const match = url.match(/linkedin\.com\/in\/([^/?#]+)/i);
  return match ? match[1].replace(/-/g, ' ') : '';
}

export async function POST(request: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'No GROQ_API_KEY found in .env.local' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { linkedinUrl, profileDetails, dmText, context, imageBase64 } = body;

    // Try to scrape LinkedIn as bonus data (may fail — that's OK)
    let scrapedData = '';
    if (linkedinUrl && !profileDetails) {
      scrapedData = await scrapeLinkedInProfile(linkedinUrl);
    }

    const username = linkedinUrl ? extractUsername(linkedinUrl) : '';

    // Build the full context prompt
    let userMessage = `Here is everything we know about the LinkedIn harasser:\n\n`;

    if (linkedinUrl) userMessage += `LinkedIn Profile URL: ${linkedinUrl}\n`;
    if (username) userMessage += `Username: ${username}\n`;

    // User-pasted profile details take top priority (most reliable source)
    if (profileDetails) {
      userMessage += `\n--- PROFILE DETAILS (pasted by user, highly accurate) ---\n${profileDetails}\n--- END PROFILE DETAILS ---\n`;
    } else if (scrapedData) {
      userMessage += `\n--- SCRAPED PROFILE DATA ---\n${scrapedData}\n--- END SCRAPED DATA ---\n`;
    }

    if (dmText) userMessage += `\nThe creepy DM they sent:\n"${dmText}"\n`;
    if (context) userMessage += `\nExtra context / inside jokes:\n"${context}"\n`;
    if (imageBase64) userMessage += `\n(A screenshot of the DM was also provided as evidence.)\n`;

    userMessage += `\nNow generate the personalized roast and callout post. Use ALL available real data — their actual headline, job title, company, and bio. Make it devastatingly specific. Return ONLY valid JSON.`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are 'LinkedOut' — an AI that helps people expose toxic, creepy, and unprofessional behavior on LinkedIn with wit, boldness, and purpose.

You will receive details about a LinkedIn harasser: their profile info (name, headline, company, bio), the creepy DM they sent, and optional extra context.

Your job is to write ONE single, unified post that works as a complete piece — starting with a sharp, funny roast and flowing seamlessly into a professional public callout. It should read as one voice, one story, one post. Not two sections stitched together.

Structure it like this:
- Open with a witty, savage roast of their LinkedIn persona (2-3 punchy sentences). Reference their actual job title, company, headline, buzzwords. Mock the gap between their "professional" persona and the creepy DM they sent. Be specific and funny.
- Transition naturally (no heading, no separator) into the callout: name the behavior clearly, describe what happened, make it empowering for women on LinkedIn.
- Close with a strong, memorable line that lands the message.
- End with 3–4 relevant hashtags on a new line.

Rules:
- Format like a real viral LinkedIn post — short punchy lines, NOT one big paragraph
- Use blank lines between sections to create breathing room
- Use emojis sparingly as visual anchors (not decoration spam)
- One voice throughout — witty but purposeful, sharp but not hateful
- Use their real name, headline, company if available
- Platform-safe: no slurs, no excessive profanity
- Maximum impact per sentence — no filler words
- The whole thing should feel like something worth sharing on LinkedIn

FORMATTING EXAMPLE (follow this structure):
"[Witty roast opener — 1-2 lines max]

[Second roast line that lands the punchline]

[Natural transition into the callout story — what happened, what they said]

[The empowering closer — what this means for women on LinkedIn]

[Strong final line — memorable, shareable]

#Hashtag1 #Hashtag2 #Hashtag3"

Return ONLY a valid JSON object:
{ "post": "the complete unified post here, with actual newlines \\n\\n between paragraphs" }`,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      temperature: 1.0,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    });

    const rawText = completion.choices[0]?.message?.content ?? '{}';
    const parsed = JSON.parse(rawText);

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('LinkedOut Groq Error:', error?.message ?? error);
    return NextResponse.json(
      { error: error?.message ?? 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
