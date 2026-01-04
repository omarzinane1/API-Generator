import { Code2, Zap, Shield, Rocket, ArrowRight, CheckCircle2, ChevronRight, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,var(--primary)_0%,transparent_50%)] opacity-20" />
          <div className="container mx-auto px-4 relative">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <Zap className="h-4 w-4" />
                <span>AI-Powered API Creation is here</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 text-balance leading-[1.1]">
                Generate Production-Ready <span className="text-primary">REST APIs</span> in Seconds
              </h1>
              <p className="text-xl text-muted-foreground mb-10 text-pretty max-w-2xl mx-auto leading-relaxed">
                Transform your logic into secure, scalable, and documented API endpoints with AI assistance. No
                boilerplate, just building.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="h-12 px-8 text-base group">
                  <Link href="/register">
                    Start Building Free
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base bg-transparent">
                  <Link href="#features">Explore Features</Link>
                </Button>
              </div>
              <div className="mt-16 w-full max-w-5xl rounded-xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in duration-700 delay-300">
                <div className="bg-muted/50 border-b border-border p-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive/30" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
                    <div className="w-3 h-3 rounded-full bg-green-500/30" />
                  </div>
                  <div className="flex-1 text-center text-xs text-muted-foreground font-mono">
                    api-generator-preview.vercel.app
                  </div>
                </div>
                <div className="p-6 md:p-10 bg-black/5 flex flex-col md:flex-row gap-8 items-center justify-between">
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <div className="h-2 w-32 bg-primary/20 rounded-full" />
                      <div className="h-4 w-full bg-foreground/10 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-24 bg-accent/20 rounded-full" />
                      <div className="h-4 w-5/6 bg-foreground/10 rounded-lg" />
                    </div>
                    <div className="pt-4 flex gap-2">
                      <div className="h-8 w-24 bg-primary/20 rounded-md" />
                      <div className="h-8 w-24 bg-accent/20 rounded-md" />
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 rounded-lg border border-border bg-background p-4 font-mono text-sm overflow-hidden">
                    <div className="flex items-center justify-between mb-4 border-b border-border pb-2 text-muted-foreground">
                      <span>POST /api/v1/process-data</span>
                      <span className="text-green-500 uppercase text-xs">Active</span>
                    </div>
                    <div className="space-y-1 text-primary">
                      <p>{"{"}</p>
                      <p className="pl-4">{'"success": true,'}</p>
                      <p className="pl-4">{'"data": ['}</p>
                      <p className="pl-8">{'{ "id": 1, "status": "processed" }'}</p>
                      <p className="pl-4">{"]"}</p>
                      <p>{"}"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Everything you need to ship APIs</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Stop spending hours on boilerplate. We handle the infrastructure, documentation, and security.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Code2 className="h-8 w-8 text-primary" />,
                  title: "AI Generation",
                  description:
                    "Describe your function in plain English and let AI generate the optimal code and parameter structure.",
                },
                {
                  icon: <Shield className="h-8 w-8 text-accent" />,
                  title: "Instant Security",
                  description:
                    "Every API is automatically protected with bearer tokens and rate limiting out of the box.",
                },
                {
                  icon: <Rocket className="h-8 w-8 text-primary" />,
                  title: "Zero Config Deploy",
                  description:
                    "No servers to manage. Your APIs are instantly live on a global edge network with 99.9% uptime.",
                },
                {
                  icon: <CheckCircle2 className="h-8 w-8 text-accent" />,
                  title: "Interactive Testing",
                  description: "Built-in playground to test your endpoints with different payloads before integration.",
                },
                {
                  icon: <Github className="h-8 w-8 text-primary" />,
                  title: "Easy Integration",
                  description:
                    "One-click copy for cURL, JavaScript, and Python examples to get you started in minutes.",
                },
                {
                  icon: <ChevronRight className="h-8 w-8 text-accent" />,
                  title: "Detailed Docs",
                  description: "Automatically generated documentation for every parameter and response type.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="p-8 rounded-2xl bg-background border border-border hover:border-primary/50 transition-all group"
                >
                  <div className="mb-6 p-3 rounded-xl bg-muted w-fit group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="max-w-3xl mx-auto bg-primary/10 border border-primary/20 rounded-3xl p-12 md:p-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to accelerate your workflow?</h2>
              <p className="text-xl text-muted-foreground mb-10">
                Join thousands of developers building APIs faster than ever before.
              </p>
              <Button size="lg" asChild className="h-14 px-10 text-lg">
                <Link href="/register">Create Your First API Now</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-12 bg-card">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">API Generator</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Documentation
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Terms
            </Link>
          </div>
          <div className="text-sm text-muted-foreground">© 2025 API Generator. Built with v0.</div>
        </div>
      </footer>
    </div>
  )
}
