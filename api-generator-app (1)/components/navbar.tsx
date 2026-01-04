"use client"

import { useRouter } from "next/navigation" // Added usePathMapper to check if we're on public page
import { authService } from "@/lib/auth-service"
import { Button } from "@/components/ui/button"
import { Code2, LogOut, Home, Plus, List, LogIn } from "lucide-react" // Added LogIn icon
import Link from "next/link"
import { useEffect, useState } from "react" // Added state for auth check

export function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null) // Move user to state to avoid SSR issues

  useEffect(() => {
    setUser(authService.getUser())
  }, [])

  const handleLogout = () => {
    authService.logout()
    setUser(null)
    router.push("/login")
  }

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href={user ? "/home" : "/"} className="flex items-center gap-2">
              <Code2 className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-foreground">API Generator</span>
            </Link>

            {user && (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/home">
                    <Home className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/home/create-function">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Function
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/home/my-apis">
                    <List className="h-4 w-4 mr-2" />
                    My APIs
                  </Link>
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden sm:block text-sm text-muted-foreground">{user?.email}</div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">
                    Get Started
                    <LogIn className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
