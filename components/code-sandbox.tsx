"use client"

import { useState, useRef } from "react"
import { Play, Copy, Download, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"

interface CodeSandboxProps {
  initialCode?: string
  language?: string
  readOnly?: boolean
}

export function CodeSandbox({ initialCode = "", language = "javascript", readOnly = false }: CodeSandboxProps) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [activeTab, setActiveTab] = useState("editor")
  const [copied, setCopied] = useState(false)
  const editorRef = useRef<HTMLTextAreaElement>(null)

  const runCode = async () => {
    setIsRunning(true)
    setOutput("")
    setActiveTab("output")

    try {
      // This is a simplified execution environment
      // In a real app, you would use a secure sandbox or server-side execution
      const originalConsoleLog = console.log
      const logs: string[] = []

      // Override console.log to capture output
      console.log = (...args) => {
        logs.push(args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg))).join(" "))
      }

      try {
        // Execute the code in a try-catch block
        // eslint-disable-next-line no-new-func
        const result = new Function(code)()
        if (result !== undefined) {
          logs.push(`Return value: ${result}`)
        }
      } catch (error) {
        if (error instanceof Error) {
          logs.push(`Error: ${error.message}`)
        } else {
          logs.push(`Error: ${String(error)}`)
        }
      }

      // Restore original console.log
      console.log = originalConsoleLog

      setOutput(logs.join("\n"))
    } catch (error) {
      setOutput(`Failed to execute: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsRunning(false)
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadCode = () => {
    const extension = language === "javascript" ? "js" : language === "python" ? "py" : "txt"
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `code.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="border border-gray-700 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between bg-gray-800 p-2 border-b border-gray-700">
        <div className="text-sm font-medium text-gray-300">
          {language.charAt(0).toUpperCase() + language.slice(1)} Sandbox
        </div>
        <div className="flex items-center gap-2">
          {!readOnly && (
            <Button
              variant="ghost"
              size="sm"
              onClick={runCode}
              disabled={isRunning}
              className="h-8 px-2 text-green-400 hover:text-green-300 hover:bg-green-900/20"
            >
              <Play className="h-4 w-4 mr-1" />
              Run
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={copyCode}
            className="h-8 px-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
          >
            {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadCode}
            className="h-8 px-2 text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 bg-gray-800 rounded-none border-b border-gray-700">
          <TabsTrigger value="editor" className="data-[state=active]:bg-gray-700">
            Editor
          </TabsTrigger>
          <TabsTrigger value="output" className="data-[state=active]:bg-gray-700">
            Output
          </TabsTrigger>
        </TabsList>
        <TabsContent value="editor" className="m-0">
          <div className="relative">
            <textarea
              ref={editorRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-64 p-4 bg-gray-900 text-gray-100 font-mono text-sm resize-none focus:outline-none"
              placeholder="Write your code here..."
              readOnly={readOnly}
              spellCheck={false}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">{language}</div>
          </div>
        </TabsContent>
        <TabsContent value="output" className="m-0">
          <div className="w-full h-64 p-4 bg-black text-gray-100 font-mono text-sm overflow-auto whitespace-pre-wrap">
            {isRunning ? "Running..." : output || "Output will appear here after running the code."}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

