import { getApiKey } from "./env"

const GROK_API_BASE_URL = "https://api.grok.ai/v1"

export interface GrokCompletionParams {
  prompt: string
  system?: string
  max_tokens?: number
  temperature?: number
  stream?: boolean
}

export interface GrokCompletionResponse {
  id: string
  choices: {
    text: string
    finish_reason: string
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export async function generateGrokCompletion(params: GrokCompletionParams): Promise<GrokCompletionResponse> {
  const apiKey = getApiKey("xai")

  if (!apiKey) {
    throw new Error("Grok API key is not set. Please add GROK_API_KEY to your environment variables.")
  }

  try {
    const response = await fetch(`${GROK_API_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-1",
        messages: [
          ...(params.system ? [{ role: "system", content: params.system }] : []),
          { role: "user", content: params.prompt },
        ],
        max_tokens: params.max_tokens || 1024,
        temperature: params.temperature || 0.7,
        stream: params.stream || false,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Grok API error: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()

    // Transform the response to match our expected format
    return {
      id: data.id,
      choices: [
        {
          text: data.choices[0].message.content,
          finish_reason: data.choices[0].finish_reason,
        },
      ],
      usage: data.usage,
    }
  } catch (error) {
    console.error("Error calling Grok API:", error)
    throw error
  }
}

// For streaming responses
export async function* streamGrokCompletion(params: GrokCompletionParams): AsyncGenerator<string> {
  const apiKey = getApiKey("xai")

  if (!apiKey) {
    throw new Error("Grok API key is not set. Please add GROK_API_KEY to your environment variables.")
  }

  try {
    const response = await fetch(`${GROK_API_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-1",
        messages: [
          ...(params.system ? [{ role: "system", content: params.system }] : []),
          { role: "user", content: params.prompt },
        ],
        max_tokens: params.max_tokens || 1024,
        temperature: params.temperature || 0.7,
        stream: true,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Grok API error: ${errorData.error?.message || response.statusText}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error("Failed to get response reader")
    }

    const decoder = new TextDecoder()
    let buffer = ""

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      // Process the buffer to extract complete SSE messages
      const lines = buffer.split("\n")
      buffer = lines.pop() || ""

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6)
          if (data === "[DONE]") break

          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices[0]?.delta?.content || ""
            if (content) {
              yield content
            }
          } catch (e) {
            console.error("Error parsing SSE message:", e)
          }
        }
      }
    }
  } catch (error) {
    console.error("Error streaming from Grok API:", error)
    throw error
  }
}

