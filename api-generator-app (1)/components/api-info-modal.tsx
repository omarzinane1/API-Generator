"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check, Code } from "lucide-react"

interface ApiInfoModalProps {
  isOpen: boolean
  onClose: () => void
  functionData: {
    id: string
    name: string
    description?: string
    endpoint?: string
    parameters?: Array<{ name: string; type: string; required?: boolean }>
    returnType?: string
    api_key?: string
    created_at?: string
  }
}

export function ApiInfoModal({ isOpen, onClose, functionData }: ApiInfoModalProps) {
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [copiedToken, setCopiedToken] = useState(false)
  const [copiedExample, setCopiedExample] = useState(false)

  //  api_key du backend au lieu du token JWT
  const apiToken = functionData.api_key || "No API key available"
  
  // Construire l'URL de l'API
  const apiUrl = functionData.endpoint || 
    `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"}/functions/${apiToken}`

  // Créer un exemple de payload basé sur les paramètres
  const examplePayload = JSON.stringify(
    functionData.parameters && functionData.parameters.length > 0
      ? functionData.parameters.reduce(
          (acc, param) => {
            // Valeurs d'exemple selon le type
            if (param.type === "str" || param.type === "string") {
              acc[param.name] = "example_value"
            } else if (param.type === "int" || param.type === "number") {
              acc[param.name] = 42
            } else if (param.type === "bool" || param.type === "boolean") {
              acc[param.name] = true
            } else if (param.type === "float") {
              acc[param.name] = 3.14
            } else {
              acc[param.name] = "example"
            }
            return acc
          },
          {} as Record<string, any>,
        )
      : { message: "No parameters required" },
    null,
    2,
  )

  const copyToClipboard = (text: string, type: "url" | "token" | "example") => {
    navigator.clipboard.writeText(text)

    if (type === "url") {
      setCopiedUrl(true)
      setTimeout(() => setCopiedUrl(false), 2000)
    } else if (type === "token") {
      setCopiedToken(true)
      setTimeout(() => setCopiedToken(false), 2000)
    } else {
      setCopiedExample(true)
      setTimeout(() => setCopiedExample(false), 2000)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{functionData.name}</DialogTitle>
          <DialogDescription>
            {functionData.description || "Use this API in Postman or any external application"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* API Endpoint */}
          <div className="space-y-2">
            <Label>API Endpoint</Label>
            <div className="flex gap-2">
              <Input value={apiUrl} readOnly className="font-mono text-sm" />
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(apiUrl, "url")} className="shrink-0">
                {copiedUrl ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* HTTP Method */}
          <div className="space-y-2">
            <Label>HTTP Method</Label>
            <div className="px-3 py-2 rounded-md bg-muted text-sm font-mono">POST</div>
          </div>

          {/* API Key */}
          <div className="space-y-2">
            <Label>API Key (X-API-Key Header)</Label>
            <div className="flex gap-2">
              <Input value={apiToken} readOnly className="font-mono text-sm" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(apiToken, "token")}
                className="shrink-0"
              >
                {copiedToken ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Include this API key in the <code className="bg-muted px-1 py-0.5 rounded">X-API-Key</code> header
            </p>
          </div>

          {/* Parameters Info */}
          {functionData.parameters && functionData.parameters.length > 0 && (
            <div className="space-y-2">
              <Label>Parameters</Label>
              <div className="border border-border rounded-lg p-3 space-y-2">
                {functionData.parameters.map((param) => (
                  <div key={param.name} className="flex items-center justify-between text-sm">
                    <span className="font-mono">
                      {param.name}
                      {param.required && <span className="text-destructive ml-1">*</span>}
                    </span>
                    <span className="text-muted-foreground text-xs">{param.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Return Type */}
          {functionData.returnType && (
            <div className="space-y-2">
              <Label>Return Type</Label>
              <div className="px-3 py-2 rounded-md bg-muted text-sm font-mono">{functionData.returnType}</div>
            </div>
          )}

          {/* Example Request Body */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Example Request Body</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(examplePayload, "example")}
                className="h-auto py-1"
              >
                {copiedExample ? (
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
            <pre className="p-4 rounded-lg bg-muted text-sm font-mono overflow-x-auto">{examplePayload}</pre>
          </div>

          {/* cURL Example */}
          <div className="space-y-2 p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Code className="h-4 w-4 text-primary" />
              <span>cURL Example</span>
            </div>
            <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all">
              {`curl -X POST ${apiUrl} \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${apiToken}" \\
  -d '${examplePayload.replace(/\n/g, "").replace(/\s+/g, " ")}'`}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}