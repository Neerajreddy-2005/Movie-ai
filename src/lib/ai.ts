import type { NormalizedMovie } from "./imdb";
import type { Review } from "./reviews";

export type SentimentClassification = "positive" | "mixed" | "negative";

/**
 * Compact representation of the AI output that the UI consumes.
 */
export interface SentimentResult {
  summary: string;
  classification: SentimentClassification;
}

interface ChatCompletionResponse {
  choices: {
    message?: {
      content?: string | null;
    };
  }[];
}

function buildPrompt(movie: NormalizedMovie, reviews: Review[]): string {
  const header = `You are an expert movie analyst. Below are audience-related reviews for the movie "${movie.title}" (${movie.year}).`;
  const instructions =
    [
      "Write a short summary of what these audience responses say about the movie — overall sentiment and what audiences highlight (e.g., acting, story, visuals).",
      "Respond in strict JSON only, with exactly two keys: summary and classification.",
      'classification MUST be exactly one of: "positive", "mixed", or "negative".',
      "summary MUST be 2-3 sentences in plain English. Return ONLY valid minified JSON. No markdown, no code fences, no extra text."
    ].join(" ");

  const sample = reviews
    .slice(0, 15)
    .map((r, idx) => `Review ${idx + 1} (${r.author || "anonymous"}): ${r.content}`)
    .join("\n\n");

  return `${header}\n\n${instructions}\n\nAudience reviews:\n${sample}`;
}

/**
 * Calls the OpenRouter Chat Completions API to summarize and classify audience sentiment.
 * Returns `null` if there are no reviews or the OpenRouter key is not configured.
 */
export async function analyzeSentimentAndSummarize(
  movie: NormalizedMovie,
  reviews: Review[]
): Promise<SentimentResult | null> {
  if (!reviews.length) {
    return null;
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini";

  if (!apiKey) {
    return null;
  }

  const prompt = buildPrompt(movie, reviews);

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You analyze audience responses for movies and respond only with valid JSON. Use keys 'summary' (string) and 'classification' (one of: positive, mixed, negative). No other text or formatting."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2
    })
  });

  if (!res.ok) {
    throw new Error(`OpenRouter API error: ${res.status}`);
  }

  const data = (await res.json()) as ChatCompletionResponse;
  const content = data.choices[0]?.message?.content ?? "";

  try {
    const parsed = JSON.parse(content) as {
      summary?: string;
      classification?: SentimentClassification;
    };
    if (!parsed.summary || !parsed.classification) {
      throw new Error("Missing fields in AI response");
    }
    return {
      summary: parsed.summary,
      classification: parsed.classification
    };
  } catch {
    // If parsing fails, fall back to a generic summary
    return {
      summary: "Unable to parse detailed AI sentiment, but audience reviews were analyzed.",
      classification: "mixed"
    };
  }
}

