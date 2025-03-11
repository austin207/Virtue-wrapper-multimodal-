"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Send, Trash, Search, Lightbulb, BarChart3, Image, Code, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { Logo } from "@/components/logo"
import { ModelSelector } from "@/components/model-selector"
import { CodeSandbox } from "@/components/code-sandbox"
import { DocumentExporter } from "@/components/document-exporter"
import { getCurrentUser, addChatMessage, clearChatHistory } from "@/lib/db"
import { DEFAULT_MODEL } from "@/lib/env"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  model: string
}

export default function ChatPage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL)
  const [showCodeEditor, setShowCodeEditor] = useState(false)
  const [codeContent, setCodeContent] = useState("// Write your code here\nconsole.log('Hello, world!');")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [greeting, setGreeting] = useState("")
  const [subGreeting, setSubGreeting] = useState("")

  // Get current user from our simple DB
  const currentUser = getCurrentUser()

  useEffect(() => {
    const hour = new Date().getHours()
    let greetText = ""

    if (hour < 12) greetText = "Good morning"
    else if (hour < 18) greetText = "Good afternoon"
    else greetText = "Good evening"

    setGreeting(`${greetText}, ${currentUser.name}.`)
    setSubGreeting("How can I assist you today?")
  }, [currentUser.name])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      model: selectedModel,
    }

    // Add to UI state
    setMessages((prev) => [...prev, userMessage])

    // Add to database
    addChatMessage({
      userId: currentUser.id,
      content: input,
      role: "user",
      model: selectedModel,
    })

    setInput("")
    setIsLoading(true)

    try {
      let responseText = ""

      // Use different providers based on the selected model
      if (selectedModel.startsWith("grok-")) {
        // Import dynamically to avoid server-side issues
        const { generateGrokCompletion } = await import("@/lib/grok-api")
        const response = await generateGrokCompletion({
          prompt: input,
          system: `You are Virtue, a highly intelligent AI assistant using the ${selectedModel} model. Maintain a professional tone.`,
        })
        responseText = response.choices[0].text
      } else {
        // Default to OpenAI for other models (in a real app, you'd have more providers)
        const { text } = await generateText({
          model: openai("gpt-4o"),
          prompt: input,
          system: `You are Virtue, a highly intelligent AI assistant using the ${selectedModel} model. Maintain a professional tone.`,
        })
        responseText = text
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseText,
        role: "assistant",
        model: selectedModel,
      }

      // Add to UI state
      setMessages((prev) => [...prev, aiMessage])

      // Add to database
      addChatMessage({
        userId: currentUser.id,
        content: responseText,
        role: "assistant",
        model: selectedModel,
      })
    } catch (error) {
      console.error("Error generating response:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "An error occurred. Please try again.",
        role: "assistant",
        model: selectedModel,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
    clearChatHistory(currentUser.id)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const toggleCodeEditor = () => {
    setShowCodeEditor(!showCodeEditor)
  }

  const tools = [
    { icon: <Search size={18} />, label: "Research" },
    { icon: <Lightbulb size={18} />, label: "How to" },
    { icon: <BarChart3 size={18} />, label: "Analyze" },
    { icon: <Image size={18} />, label: "Create images" },
    {
      icon: <Code size={18} />,
      label: "Code",
      action: toggleCodeEditor,
    },
  ]

  return (
    <main className="flex flex-col items-center min-h-screen bg-[#18191A] text-white">
      {/* Header */}
      <header className="w-full flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Logo size={32} />
          <h1 className="text-xl font-bold text-white">Virtue</h1>
        </div>
        <div className="flex items-center gap-2">
          <DocumentExporter messages={messages} title="Virtue Chat" />

          <Button variant="ghost" size="icon" onClick={clearChat} className="hover:bg-purple-500/20 rounded-full">
            <Trash className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-purple-500/20 rounded-full">
            <Settings className="h-5 w-5" />
          </Button>
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
            {currentUser.name.charAt(0)}
          </div>
        </div>
      </header>

      <div className="w-full max-w-4xl flex flex-col flex-1 px-4 py-8">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="mb-6">
              <Logo size={80} />
            </div>
            <motion.h2
              className="text-4xl font-bold mb-2 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {greeting}
            </motion.h2>
            <motion.p
              className="text-2xl text-gray-400 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {subGreeting}
            </motion.p>

            {/* Model selector */}
            <motion.div
              className="w-full max-w-xs mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />
            </motion.div>

            <motion.div
              className="w-full max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <form onSubmit={handleSubmit} className="relative">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="What do you want to know?"
                  className="min-h-[60px] w-full rounded-full bg-gray-800/50 backdrop-blur-sm border-gray-700 text-white resize-none pr-12 pl-6 py-4"
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !input.trim()}
                    className="rounded-full bg-purple-600 hover:bg-purple-500 transition-all duration-300"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </form>
            </motion.div>

            <motion.div
              className="flex flex-wrap justify-center gap-2 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {tools.map((tool, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 rounded-full"
                        onClick={tool.action}
                      >
                        {tool.icon}
                        <span className="ml-2">{tool.label}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Use {tool.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </motion.div>

            {showCodeEditor && (
              <motion.div
                className="w-full max-w-2xl mt-8"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CodeSandbox initialCode={codeContent} language="javascript" />
              </motion.div>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto mb-4">
            {/* Top controls */}
            <div className="mb-6 flex justify-between items-center">
              <div className="w-64">
                <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />
              </div>
              <DocumentExporter messages={messages} title="Virtue Chat" />
            </div>

            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6"
                >
                  <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] ${message.role === "user" ? "order-2" : "order-1"}`}>
                      <div
                        className={`flex items-center gap-2 mb-1 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {message.role === "assistant" && (
                          <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center">
                            <Logo size={24} />
                          </div>
                        )}
                        <div className="font-medium text-sm text-gray-400">
                          {message.role === "user" ? currentUser.name : "Virtue"}
                          {message.role === "assistant" && (
                            <span className="text-xs ml-1 text-gray-500">using {message.model}</span>
                          )}
                        </div>
                        {message.role === "user" && (
                          <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs">
                            {currentUser.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <Card
                        className={`p-4 ${
                          message.role === "user"
                            ? "bg-purple-900/30 border-purple-700/50 rounded-2xl rounded-tr-sm"
                            : "bg-gray-800/50 border-gray-700/50 rounded-2xl rounded-tl-sm"
                        }`}
                      >
                        <div className="text-gray-200 whitespace-pre-wrap">{message.content}</div>
                      </Card>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <div className="flex justify-start">
                  <div className="max-w-[80%]">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center">
                        <Logo size={24} />
                      </div>
                      <div className="font-medium text-sm text-gray-400">
                        Virtue
                        <span className="text-xs ml-1 text-gray-500">using {selectedModel}</span>
                      </div>
                    </div>
                    <Card className="p-4 bg-gray-800/50 border-gray-700/50 rounded-2xl rounded-tl-sm">
                      <div className="flex gap-2">
                        <motion.div
                          className="h-2 w-2 rounded-full bg-purple-500"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
                        />
                        <motion.div
                          className="h-2 w-2 rounded-full bg-purple-500"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0.2 }}
                        />
                        <motion.div
                          className="h-2 w-2 rounded-full bg-purple-500"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0.4 }}
                        />
                      </div>
                    </Card>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {messages.length > 0 && (
          <div className="sticky bottom-0 bg-[#18191A] pt-4">
            <form onSubmit={handleSubmit} className="relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What do you want to know?"
                className="min-h-[60px] w-full rounded-full bg-gray-800/50 backdrop-blur-sm border-gray-700 text-white resize-none pr-12 pl-6 py-4"
                disabled={isLoading}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !input.trim()}
                  className="rounded-full bg-purple-600 hover:bg-purple-500 transition-all duration-300"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </form>

            <div className="flex flex-wrap justify-center gap-2 mt-4 mb-2">
              {tools.map((tool, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 rounded-full"
                        onClick={tool.action}
                      >
                        {tool.icon}
                        <span className="ml-2 text-xs">{tool.label}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Use {tool.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>

            {showCodeEditor && (
              <motion.div
                className="w-full mt-4 mb-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CodeSandbox initialCode={codeContent} language="javascript" />
              </motion.div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

