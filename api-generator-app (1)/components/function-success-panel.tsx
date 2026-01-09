"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check, ExternalLink, ArrowRight } from "lucide-react"
import { authService } from "@/lib/auth-service"
import Link from "next/link"

interface Parameter {
  name: string
  type: string
  required?: boolean
}

interface FunctionSuccessPanelProps {
  functionData: {
    api_key: string
    id: string
    name: string
    endpoint?: string
    parameters?: Parameter[]
  }
}

export function FunctionSuccessPanel({ functionData }: FunctionSuccessPanelProps) {
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [copiedToken, setCopiedToken] = useState(false)

  const token = authService.getToken()
  //  api_key du backend au lieu du token JWT
  const apiToken = functionData.api_key || "No API key available"
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"
    }/functions/${apiToken}`

  //  SAFE DEFAULT
  const parameters: Parameter[] = functionData.parameters ?? []

  const exampleRequest = JSON.stringify(
    {
      parameters: parameters.reduce<Record<string, any>>((acc, param) => {
        acc[param.name] =
          param.type === "string"
            ? "example_value"
            : param.type === "number"
              ? 42
              : param.type === "boolean"
                ? true
                : null
        return acc
      }, {}),
    },
    null,
    2,
  )

  const copyToClipboard = (text: string, type: "url" | "token") => {
    navigator.clipboard.writeText(text)

    if (type === "url") {
      setCopiedUrl(true)
      setTimeout(() => setCopiedUrl(false), 2000)
    } else {
      setCopiedToken(true)
      setTimeout(() => setCopiedToken(false), 2000)
    }
  }

  return (
    <Card className="border-primary/50 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">
          Function Created Successfully!
        </CardTitle>
        <CardDescription>
          Your API is ready to use. Copy the details below to integrate with your application.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* API URL */}
        <div className="space-y-2">
          <Label>API Endpoint URL</Label>
          <div className="flex gap-2">
            <Input value={apiUrl} readOnly className="font-mono text-sm" />
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(apiUrl, "url")}
            >
              {copiedUrl ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* METHOD */}
        <div className="space-y-2">
          <Label>HTTP Method</Label>
          <div className="px-3 py-2 rounded-md bg-muted text-sm font-semibold">
            POST
          </div>
        </div>

        {/* TOKEN */}
        <div className="space-y-2">
          <Label>API Token (Authorization)</Label>
          <div className="flex gap-2">
            <Input value={token || ""} readOnly type="password" className="font-mono text-sm" />
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(token || "", "token")}
            >
              {copiedToken ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* EXAMPLE BODY */}
        <div className="space-y-2">
          <Label>Example Request Body (JSON)</Label>
          <pre className="p-4 rounded-lg bg-muted text-sm font-mono overflow-x-auto">
            {exampleRequest}
          </pre>
        </div>

        {/* INFO */}
        <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
          <p className="text-sm font-medium flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Ready for external usage
          </p>
          <p className="text-sm text-muted-foreground">
            Use this API in Postman, cURL, or any HTTP client.
            Authorization: Bearer TOKEN
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 pt-4">
          <Button asChild className="flex-1">
            <Link href={`/home/test-api/${functionData.id}`}>
              <ArrowRight className="h-4 w-4 mr-2" />
              Test This API
            </Link>
          </Button>

          <Button asChild variant="outline" className="flex-1">
            <Link href="/home/my-apis">View All APIs</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
