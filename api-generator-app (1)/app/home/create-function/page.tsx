"use client"

import type React from "react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { Loader2, AlertCircle, Sparkles } from "lucide-react"

import { apiService } from "@/lib/api-service"
import { ParameterForm } from "@/components/parameter-form"
import { FunctionSuccessPanel } from "@/components/function-success-panel"

interface Parameter {
  id: string
  name: string
  type: string
  required: boolean
}

/**
 * Mapping types Frontend → Backend (Flask / Python)
 */
const mapTypeToBackend = (type: string) => {
  switch (type) {
    case "string":
      return "str"
    case "number":
      return "int"
    case "boolean":
      return "bool"
    case "array":
      return "list"
    case "object":
      return "dict"
    default:
      return "str"
  }
}

export default function CreateFunctionPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [createdFunction, setCreatedFunction] = useState<any>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    returnType: "string",
  })

  const [parameters, setParameters] = useState<Parameter[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // =====================
    // VALIDATION
    // =====================
    if (!formData.name.trim()) {
      setError("Function name is required")
      return
    }

    if (!formData.description.trim()) {
      setError("Function description is required")
      return
    }

    if (parameters.some((p) => !p.name.trim())) {
      setError("All parameters must have a name")
      return
    }

    setIsLoading(true)

    try {
      // =====================
      // TRANSFORM PARAMETERS
      // =====================
      const inputs = parameters.reduce((acc: any, param) => {
        acc[param.name] = mapTypeToBackend(param.type)
        return acc
      }, {})

      // =====================
      // PAYLOAD BACKEND
      // =====================
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        inputs,
        output_type: mapTypeToBackend(formData.returnType),
      }

      console.log("🚀 Payload sent to API:", payload)

      const response: any = await apiService.createFunction(payload)

      setCreatedFunction(response)
    } catch (err: any) {
      setError(err?.message || "Failed to create function. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAnother = () => {
    setCreatedFunction(null)
    setFormData({
      name: "",
      description: "",
      returnType: "string",
    })
    setParameters([])
    setError("")
  }

  // =====================
  // SUCCESS SCREEN
  // =====================
  if (createdFunction) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <FunctionSuccessPanel functionData={createdFunction} />
        <div className="mt-6 text-center">
          <Button variant="ghost" onClick={handleCreateAnother}>
            Create Another Function
          </Button>
        </div>
      </div>
    )
  }

  // =====================
  // FORM
  // =====================
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Function</h1>
        <p className="text-muted-foreground">
          Define your function and let AI generate a REST API endpoint
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Function Configuration
          </CardTitle>
          <CardDescription>
            Provide details about your function and its behavior
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Function Name *</Label>
              <Input
                id="name"
                placeholder="e.g., concat_strings"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Function Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe exactly what the function does..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                disabled={isLoading}
                rows={5}
              />
            </div>

            <ParameterForm
              parameters={parameters}
              onParametersChange={setParameters}
            />

            <div className="space-y-2">
              <Label htmlFor="returnType">Return Type</Label>
              <Select
                value={formData.returnType}
                onValueChange={(value) =>
                  setFormData({ ...formData, returnType: value })
                }
              >
                <SelectTrigger id="returnType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                  <SelectItem value="object">Object</SelectItem>
                  <SelectItem value="array">Array</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Function...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate API Function
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
