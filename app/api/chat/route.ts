import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { type NextRequest, NextResponse } from "next/server"
import { getModelProvider } from "@/lib/env"

export async function POST(req: NextRequest) {
  try {
    const { messages, model } = await req.json()

    // Determine which provider to use based on the model
    const provider = getModelProvider(model)

    if (provider === "xai") {
      // For Grok, we need to use their API directly
      const { generateGrokCompletion } = await import("@/lib/grok-api")

      // Extract the last user message
      const lastUserMessage = messages.filter((m) => m.role === "user").pop()

      if (!lastUserMessage) {
        return NextResponse.json({ error: "No user message found" }, { status: 400 })
      }

      const response = await generateGrokCompletion({
        prompt: lastUserMessage.content,
        system: `You are Virtue, a highly intelligent AI assistant using the ${model} model. Maintain a professional tone.`,
      })

      return NextResponse.json({
        text: response.choices[0].text,
        model: model,
      })
    } else {
      // For other providers, use the AI SDK
      const result = streamText({
        model: openai("gpt-4o"), // Default to OpenAI
        messages,
      })

      return result.toDataStreamResponse()
    }
  } catch (error) {
    console.error("Error in chat API route:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}

