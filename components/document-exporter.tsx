"use client"

import { useState } from "react"
import { FileText, FileDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  model?: string
}

interface DocumentExporterProps {
  messages: Message[]
  title?: string
}

export function DocumentExporter({ messages, title = "Conversation" }: DocumentExporterProps) {
  const [isExporting, setIsExporting] = useState(false)

  const formatDate = () => {
    const now = new Date()
    return now.toISOString().split("T")[0]
  }

  const exportAsPDF = async () => {
    setIsExporting(true)
    try {
      // In a real implementation, you would use a library like jsPDF or a server-side solution
      // This is a simplified example that creates a basic HTML representation and uses browser print

      // Create a new window for printing
      const printWindow = window.open("", "_blank")
      if (!printWindow) {
        alert("Please allow popups for this website")
        setIsExporting(false)
        return
      }

      // Generate HTML content
      let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title} - ${formatDate()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .message { margin-bottom: 20px; padding: 10px; border-radius: 5px; }
            .user { background-color: #f0f0f0; }
            .assistant { background-color: #e6f7ff; }
            .role { font-weight: bold; margin-bottom: 5px; }
            .content { white-space: pre-wrap; }
            .model { font-size: 0.8em; color: #666; font-style: italic; }
            @media print {
              body { margin: 0; }
              .message { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${title}</h1>
            <p>Exported on ${new Date().toLocaleString()}</p>
          </div>
      `

      // Add messages
      messages.forEach((message) => {
        htmlContent += `
          <div class="message ${message.role}">
            <div class="role">${message.role === "user" ? "You" : "Virtue"}</div>
            ${message.model ? `<div class="model">using ${message.model}</div>` : ""}
            <div class="content">${message.content}</div>
          </div>
        `
      })

      htmlContent += `
        </body>
        </html>
      `

      // Write to the new window and print
      printWindow.document.open()
      printWindow.document.write(htmlContent)
      printWindow.document.close()

      // Wait for resources to load then print
      printWindow.onload = () => {
        printWindow.print()
        setIsExporting(false)
      }
    } catch (error) {
      console.error("Error exporting as PDF:", error)
      alert("Failed to export as PDF")
      setIsExporting(false)
    }
  }

  const exportAsDOCX = async () => {
    setIsExporting(true)
    try {
      // In a real implementation, you would use a library like docx or a server-side solution
      // This is a simplified example that creates a text file with basic formatting

      let textContent = `${title}\nExported on ${new Date().toLocaleString()}\n\n`

      // Add messages
      messages.forEach((message) => {
        textContent += `${message.role === "user" ? "You" : "Virtue"}${message.model ? ` (using ${message.model})` : ""}:\n${message.content}\n\n`
      })

      // Create and download the file
      const blob = new Blob([textContent], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${title.replace(/\s+/g, "_")}_${formatDate()}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setIsExporting(false)
    } catch (error) {
      console.error("Error exporting as DOCX:", error)
      alert("Failed to export as DOCX")
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isExporting || messages.length === 0}
          className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 rounded-full"
        >
          {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gray-800 border-gray-700">
        <DropdownMenuItem onClick={exportAsPDF} className="text-white hover:bg-gray-700 cursor-pointer">
          <FileDown className="h-4 w-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsDOCX} className="text-white hover:bg-gray-700 cursor-pointer">
          <FileDown className="h-4 w-4 mr-2" />
          Export as Document
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

