/**
 * Login Page
 *
 * Allows existing users to log in with email and password.
 * Redirects to dashboard after successful authentication.
 */

'use client'

// Force dynamic rendering - don't prerender during build
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Target, Mail, Lock, ArrowRight, Sparkles, TrendingUp, Users } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  /**
   * Handle form submission for login
   * Authenticates user with Supabase and redirects to dashboard on success
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validate inputs
      if (!email || !password) {
        setError('Please enter both email and password')
        setLoading(false)
        return
      }

      // Attempt to sign in with Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        setLoading(false)
        return
      }

      // Success! Redirect to dashboard
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* Left Side - Branding & Social Proof */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-600 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <Target className="w-7 h-7 text-indigo-600" />
            </div>
            <span className="text-3xl font-bold text-white">LeadFinder Pro</span>
          </Link>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10 space-y-8"
        >
          <div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Welcome Back to Your Lead Generation Hub
            </h1>
            <p className="text-xl text-blue-100">
              Continue discovering qualified leads and growing your pipeline.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-2">
                <Users className="w-6 h-6 text-white" />
                <div className="text-3xl font-bold text-white">500+</div>
              </div>
              <div className="text-blue-100 text-sm">Active Users</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-2">
                <TrendingUp className="w-6 h-6 text-white" />
                <div className="text-3xl font-bold text-white">100K+</div>
              </div>
              <div className="text-blue-100 text-sm">Leads Found</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-2">
                <Sparkles className="w-6 h-6 text-white" />
                <div className="text-3xl font-bold text-white">4.9</div>
              </div>
              <div className="text-blue-100 text-sm">User Rating</div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative z-10 text-blue-100 text-sm"
        >
          © 2024 LeadFinder Pro. All rights reserved.
        </motion.div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                LeadFinder Pro
              </span>
            </Link>
          </div>

          <Card className="border-2 border-slate-200 shadow-2xl">
            <CardHeader className="space-y-4 text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Sign in to access your lead dashboard
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleLogin}>
                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      disabled={loading}
                      className="pl-10 h-12 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={loading}
                      className="pl-10 h-12 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                >
                  {loading ? (
                    'Signing in...'
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>

                {/* Dev Test Account Shortcut */}
                {process.env.NODE_ENV === 'development' && (
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('test@leadfinder.com');
                      setPassword('TestPassword123');
                    }}
                    className="w-full text-xs text-slate-500 hover:text-slate-700 p-2 rounded transition-colors"
                  >
                    💡 Fill test credentials (dev only)
                  </button>
                )}

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-slate-500">New to LeadFinder Pro?</span>
                  </div>
                </div>

                {/* Sign Up Link */}
                <div className="text-center">
                  <Link href="/auth/signup">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 border-2 border-slate-300 hover:border-indigo-600 hover:text-indigo-600 text-base font-semibold transition-all"
                    >
                      Create a free account
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Additional Links */}
          <div className="mt-6 text-center space-x-6 text-sm">
            <Link href="/" className="text-slate-600 hover:text-indigo-600 transition-colors">
              Back to Home
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/pricing" className="text-slate-600 hover:text-indigo-600 transition-colors">
              View Pricing
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
