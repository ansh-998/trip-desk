// Thin wrapper around the Gemini REST API.
// This file is server-only — the API key must never reach the browser.

const GEMINI_MODEL = 'gemini-2.0-flash'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

export class GeminiError extends Error {
  constructor(
    message: string,
    public readonly status?: number
  ) {
    super(message)
    this.name = 'GeminiError'
  }
}

export async function generateWithGemini(prompt: string, systemInstruction?: string) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new GeminiError('GEMINI_API_KEY is not configured on the server')
  }

  const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      ...(systemInstruction && {
        systemInstruction: { parts: [{ text: systemInstruction }] },
      }),
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 512,
      },
    }),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new GeminiError(
      `Gemini request failed (${response.status})${detail ? `: ${detail.slice(0, 200)}` : ''}`,
      response.status
    )
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

  if (!text) {
    throw new GeminiError('Gemini returned an empty response')
  }

  return text
}

// Gemini sometimes wraps JSON output in markdown code fences. This strips
// them before parsing so callers don't need to handle that edge case.
export function parseJsonFromModel<T>(raw: string): T {
  const jsonString = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
  return JSON.parse(jsonString) as T
}
