"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

interface JsonViewerProps {
  data: any
  title: string
}

export function JsonViewer({ data, title }: JsonViewerProps) {
  const [copied, setCopied] = useState(false)

  const jsonString = JSON.stringify(data, null, 2)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-auto py-1">
          {copied ? (
            <>
              <Check className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-xs">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 mr-1" />
              <span className="text-xs">Copy</span>
            </>
          )}
        </Button>
      </div>
      <pre className="p-4 rounded-lg bg-muted text-sm font-mono overflow-x-auto max-h-96">{jsonString}</pre>
    </div>
  )
}
