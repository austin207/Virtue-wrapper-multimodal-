"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export interface Model {
  id: string
  name: string
  provider: string
  description: string
}

const models: Model[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    description: "Most capable model for a wide range of tasks",
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    description: "Most powerful model for complex tasks",
  },
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    provider: "Anthropic",
    description: "Balanced performance and efficiency",
  },
  {
    id: "deepseek-coder",
    name: "DeepSeek Coder",
    provider: "DeepSeek",
    description: "Specialized for coding tasks",
  },
  {
    id: "qwen-72b",
    name: "Qwen 72B",
    provider: "Alibaba",
    description: "Large multilingual model",
  },
  {
    id: "kimi-v1",
    name: "Kimi",
    provider: "Kimi AI",
    description: "General purpose assistant",
  },
  {
    id: "llama-3-70b",
    name: "Llama 3 70B",
    provider: "Meta",
    description: "Open model with strong capabilities",
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    provider: "Google",
    description: "Google's multimodal model",
  },
  {
    id: "grok-1",
    name: "Grok-1",
    provider: "xAI",
    description: "Grok's conversational AI model",
  },
]

interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (modelId: string) => void
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const [open, setOpen] = React.useState(false)

  const selectedModelData = models.find((model) => model.id === selectedModel) || models[0]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 text-sm"
        >
          {selectedModelData.name}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0 bg-gray-800 border-gray-700">
        <Command className="bg-transparent">
          <CommandInput placeholder="Search model..." className="text-white" />
          <CommandList>
            <CommandEmpty>No model found.</CommandEmpty>
            <CommandGroup>
              {models.map((model) => (
                <CommandItem
                  key={model.id}
                  value={model.id}
                  onSelect={() => {
                    onModelChange(model.id)
                    setOpen(false)
                  }}
                  className={cn("text-white hover:bg-gray-700", selectedModel === model.id && "bg-gray-700")}
                >
                  <Check className={cn("mr-2 h-4 w-4", selectedModel === model.id ? "opacity-100" : "opacity-0")} />
                  <div className="flex flex-col">
                    <span>{model.name}</span>
                    <span className="text-xs text-gray-400">{model.provider}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

