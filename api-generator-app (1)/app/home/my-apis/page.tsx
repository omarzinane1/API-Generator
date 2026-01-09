"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, Play, Info, Loader2, Code2, AlertCircle } from "lucide-react"
import { apiService } from "@/lib/api-service"
import { ApiInfoModal } from "@/components/api-info-modal"

interface ApiFunction {
  id: string
  name: string
  description: string
  endpoint?: string
  parameters?: Array<{ name: string; type: string; required: boolean }>
  returnType?: string
  created_at: string
}

export default function MyApisPage() {
  const router = useRouter()
  const [functions, setFunctions] = useState<ApiFunction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedFunction, setSelectedFunction] = useState<ApiFunction | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    loadFunctions()
  }, [])

  const loadFunctions = async () => {
    try {
      setIsLoading(true)
      setError("")
      const data: any = await apiService.getFunctions()
      // Ici on prend directement le tableau renvoyé par le backend
      setFunctions(data || [])
    } catch (err: any) {
      setError(err.message || "Failed to load functions")
    } finally {
      setIsLoading(false)
    }
  }
  const handleDelete = async (id: string) => {
    setDeleteId(id)
    try {
      await apiService.deleteFunction(id)
      setFunctions(functions.filter((f) => f.id !== id))
    } catch (err: any) {
      setError(err.message || "Failed to delete function")
    } finally {
      setDeleteId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My APIs</h1>
          <p className="text-muted-foreground">Manage and test your generated API endpoints</p>
        </div>
        <Button onClick={() => router.push("/home/create-function")}>Create New Function</Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {functions.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Code2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No APIs yet</h3>
            <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
              Create your first function and transform it into a REST API endpoint
            </p>
            <Button onClick={() => router.push("/home/create-function")}>Create Your First Function</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {functions.map((func) => (
            <Card key={func.id} className="hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{func.name}</CardTitle>
                    <CardDescription className="mb-3">{func.description}</CardDescription>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Created {formatDate(func.created_at)}</span>
                      <span>•</span>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {func.parameters?.length || 0} {func.parameters?.length === 1 ? "parameter" : "parameters"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Button variant="default" size="sm" onClick={() => router.push(`/home/test-api/${func.id}`)}>
                    <Play className="h-4 w-4 mr-2" />
                    Test API
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSelectedFunction(func)}>
                    <Info className="h-4 w-4 mr-2" />
                    API Info
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(func.id)}
                    disabled={deleteId === func.id}
                    className="ml-auto text-destructive hover:text-destructive"
                  >
                    {deleteId === func.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedFunction && (
        <ApiInfoModal
          isOpen={!!selectedFunction}
          onClose={() => setSelectedFunction(null)}
          functionData={selectedFunction}
        />
      )}
    </div>
  )
}
