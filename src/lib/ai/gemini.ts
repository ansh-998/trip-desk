// Thin wrapper around the Gemini REST API.
// This file is server-only — the API key must never reach the browser.

export class GeminiError extends Error {
  constructor(
    message: string,
    public readonly status?: number
  ) {
    super(message)
    this.name = 'GeminiError'
  }
}

async function callGeminiApi(model: string, apiKey: string, prompt: string, systemInstruction?: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
  const response = await fetch(url, {
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
      `Gemini request failed for ${model} (${response.status})${detail ? `: ${detail.slice(0, 200)}` : ''}`,
      response.status
    )
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

  if (!text) {
    throw new GeminiError(`Gemini model ${model} returned an empty response`)
  }

  return text
}

export async function generateWithGemini(prompt: string, systemInstruction?: string) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new GeminiError('GEMINI_API_KEY is not configured on the server')
  }

  try {
    // Try primary model: gemini-2.5-flash
    return await callGeminiApi('gemini-2.5-flash', apiKey, prompt, systemInstruction)
  } catch (error) {
    console.warn('Primary model gemini-2.5-flash failed, falling back to gemini-2.5-flash-lite:', error)
    
    // Attempt fallback with gemini-2.5-flash-lite
    try {
      return await callGeminiApi('gemini-2.5-flash-lite', apiKey, prompt, systemInstruction)
    } catch (fallbackError) {
      console.error('Fallback model gemini-2.5-flash-lite also failed:', fallbackError)
      if (fallbackError instanceof GeminiError) {
        throw fallbackError
      }
      throw new GeminiError(
        `Gemini request failed: ${error instanceof Error ? error.message : String(error)} (Fallback also failed: ${fallbackError instanceof Error ? fallbackError.message : String(fallbackError)})`
      )
    }
  }
}

// Gemini sometimes wraps JSON output in markdown code fences. This strips
// them before parsing so callers don't need to handle that edge case.
export function parseJsonFromModel<T>(raw: string): T {
  const jsonString = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
  return JSON.parse(jsonString) as T
}
