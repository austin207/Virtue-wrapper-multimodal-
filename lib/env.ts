export const getEnvVariable = (key: string, defaultValue = ""): string => {
  const value = process.env[key]
  if (!value) {
    // Log warning in development, but use default in production
    if (process.env.NODE_ENV === "development") {
      console.warn(`Environment variable ${key} is not set, using default value`)
    }
    return defaultValue
  }
  return value
}

export const getApiKey = (provider: string): string => {
  const keyMap: Record<string, string> = {
    openai: "OPENAI_API_KEY",
    anthropic: "ANTHROPIC_API_KEY",
    google: "GOOGLE_API_KEY",
    deepseek: "DEEPSEEK_API_KEY",
    qwen: "QWEN_API_KEY",
    kimi: "KIMI_API_KEY",
    meta: "META_API_KEY",
    xai: "GROK_API_KEY",
  }

  const envKey = keyMap[provider.toLowerCase()]
  if (!envKey) {
    throw new Error(`Unknown provider: ${provider}`)
  }

  return getEnvVariable(envKey)
}

export const getModelProvider = (modelId: string): string => {
  // Map model IDs to their providers
  if (modelId.startsWith("gpt-")) return "openai"
  if (modelId.startsWith("claude-")) return "anthropic"
  if (modelId.startsWith("gemini-")) return "google"
  if (modelId.startsWith("deepseek-")) return "deepseek"
  if (modelId.startsWith("qwen-")) return "qwen"
  if (modelId.startsWith("kimi-")) return "kimi"
  if (modelId.startsWith("llama-")) return "meta"
  if (modelId.startsWith("grok-")) return "xai"

  // Default to OpenAI if unknown
  return "openai"
}

// Public environment variables (safe to use on client-side)
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Virtue"
export const DEFAULT_MODEL = process.env.NEXT_PUBLIC_DEFAULT_MODEL || "gpt-4o"

