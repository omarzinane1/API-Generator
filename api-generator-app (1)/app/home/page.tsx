import { Plus, List, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Welcome to API Generator</h1>
        <p className="text-lg text-muted-foreground text-pretty">
          Transform your functions into production-ready REST APIs with AI assistance
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-12">
        <Card className="border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Create Function</CardTitle>
            </div>
            <CardDescription>Define your function logic and let AI generate a secure REST API</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/home/create-function">Get Started</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-accent/20 hover:border-accent/40 transition-colors">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <List className="h-5 w-5 text-accent" />
              </div>
              <CardTitle>My APIs</CardTitle>
            </div>
            <CardDescription>View, test, and manage all your generated API endpoints</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/home/my-apis">View APIs</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-muted">
                <Zap className="h-5 w-5 text-foreground" />
              </div>
              <CardTitle>Quick Test</CardTitle>
            </div>
            <CardDescription>Test your APIs directly from the browser or with external tools</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/home/my-apis">Test APIs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>Create production-ready APIs in three simple steps</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          <div className="flex flex-col items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
              1
            </div>
            <h3 className="font-semibold text-foreground">Define Your Function</h3>
            <p className="text-sm text-muted-foreground">
              Describe your function logic, input parameters, and expected output
            </p>
          </div>
          <div className="flex flex-col items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold">
              2
            </div>
            <h3 className="font-semibold text-foreground">Generate API</h3>
            <p className="text-sm text-muted-foreground">
              AI processes your requirements and creates a secure REST API endpoint
            </p>
          </div>
          <div className="flex flex-col items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-chart-4 text-primary-foreground font-semibold">
              3
            </div>
            <h3 className="font-semibold text-foreground">Test & Deploy</h3>
            <p className="text-sm text-muted-foreground">
              Get your API URL and token, then integrate with any application
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
