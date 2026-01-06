"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, Play, ArrowLeft, CheckCircle2 } from "lucide-react"
import { apiService } from "@/lib/api-service"
import { DynamicTestForm } from "@/components/dynamic-test-form"
import { JsonViewer } from "@/components/json-viewer"

interface FunctionData {
  id: string
  name: string
  description: string
  parameters: Array<{ name: string; type: string; required?: boolean }>
  returnType: string
  api_key?: string
}

export default function TestApiPage() {
  const params = useParams()
  const router = useRouter()
  const functionId = params.id as string

  const [functionData, setFunctionData] = useState<FunctionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isTesting, setIsTesting] = useState(false)
  const [error, setError] = useState("")

  const [parameterValues, setParameterValues] = useState<Record<string, any>>({})
  const [testResult, setTestResult] = useState<{
    request: any
    response: any
    error?: string
  } | null>(null)

  useEffect(() => {
    loadFunction()
  }, [functionId])

  const loadFunction = async () => {
    try {
      setIsLoading(true)
      setError("")
      const data: any = await apiService.getFunction(functionId)
      const functionDetails = data.function || data
      setFunctionData(functionDetails)

      // Initialize parameter values
      const initialValues: Record<string, any> = {}
      if (functionDetails.parameters && functionDetails.parameters.length > 0) {
        functionDetails.parameters.forEach((param: any) => {
          if (param.type === "bool" || param.type === "boolean") {
            initialValues[param.name] = false
          } else if (param.type === "int" || param.type === "number") {
            initialValues[param.name] = 0
          } else {
            initialValues[param.name] = ""
          }
        })
      }
      setParameterValues(initialValues)
    } catch (err: any) {
      console.error("Load function error:", err)
      setError(err.message || "Failed to load function")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTest = async () => {
    if (!functionData) return

    setTestResult(null)
    setIsTesting(true)

    // Validate required parameters
    const missingRequired = functionData.parameters
      .filter((p) => p.required && (parameterValues[p.name] === "" || parameterValues[p.name] === undefined))
      .map((p) => p.name)
    if (missingRequired.length > 0) {
      setTestResult({
        request: parameterValues,
        response: null,
        error: `Missing required parameters: ${missingRequired.join(", ")}`,
      })
      setIsTesting(false)
      return
    }

    try {
      const response = await apiService.testFunction(
        functionId,
        parameterValues,
        functionData.api_key || ""
      )
      setTestResult({
        request: parameterValues,
        response,
      })
    } catch (err: any) {
      setTestResult({
        request: parameterValues,
        response: null,
        error: err.message || "API request failed",
      })
    } finally {
      setIsTesting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !functionData) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Function not found"}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.push("/home/my-apis")} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My APIs
        </Button>
      </div>
    )
  }

  const hasParameters = functionData.parameters && functionData.parameters.length > 0

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Button variant="ghost" onClick={() => router.push("/home/my-apis")} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to My APIs
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{functionData.name}</h1>
        <p className="text-muted-foreground">{functionData.description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Parameters</CardTitle>
              <CardDescription>
                {hasParameters
                  ? "Enter values for the function parameters"
                  : "This function has no input parameters"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasParameters ? (
                <DynamicTestForm
                  parameters={functionData.parameters.map(p => ({
                    ...p,
                    required: p.required ?? true
                  }))}
                  values={parameterValues}
                  onValuesChange={setParameterValues}
                />
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <p className="text-sm">No parameters required for this function</p>
                </div>
              )}

              <Button onClick={handleTest} disabled={isTesting} className="w-full mt-6" size="lg">
                {isTesting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Execute API
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {testResult && (
            <>
              {hasParameters && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Request Payload</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <JsonViewer data={testResult.request} title="JSON Sent" />
                  </CardContent>
                </Card>
              )}

              {testResult.error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{testResult.error}</AlertDescription>
                </Alert>
              ) : (
                <Card className="border-primary/50">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      Response
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <JsonViewer data={testResult.response} title="API Response" />
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {!testResult && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Play className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground text-center">
                  Execute the API to see the {hasParameters ? "request and " : ""}response
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
