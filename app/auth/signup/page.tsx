/**
 * Signup Page
 *
 * Allows new users to create an account with email and password.
 * Sends email verification link and shows success message.
 */

'use client'

// Force dynamic rendering - don't prerender during build
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Check, Target, Mail, Lock, ArrowRight, Sparkles, CheckCircle, Shield } from 'lucide-react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  /**
   * Handle form submission for signup
   * Creates new user account and sends verification email
   */
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validate inputs
      if (!email || !password || !confirmPassword) {
        setError('Please fill in all fields')
        setLoading(false)
        return
      }

      // Validate password length (Supabase minimum is 6 characters)
      if (password.length < 8) {
        setError('Password must be at least 8 characters')
        setLoading(false)
        return
      }

      // Validate password match
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }

      // Attempt to sign up with Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      // Success! Show confirmation message
      setSuccess(true)
      setLoading(false)
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  // Success state - show confirmation message
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <Card className="border-2 border-green-200 shadow-2xl">
            <CardContent className="pt-12 pb-10 px-8">
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', bounce: 0.6 }}
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-xl"
                >
                  <CheckCircle className="h-10 w-10 text-white" />
                </motion.div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-green-900 bg-clip-text text-transparent">
                    Check Your Email!
                  </h3>
                  <p className="text-base text-slate-600 leading-relaxed">
                    We&apos;ve sent a verification link to <br />
                    <strong className="text-indigo-600">{email}</strong>
                  </p>
                  <p className="text-sm text-slate-500 max-w-md mx-auto">
                    Click the link in the email to verify your account and start discovering qualified leads.
                  </p>
                </div>

                {/* What's Next Section */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 text-left space-y-3">
                  <h4 className="font-semibold text-slate-900 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-indigo-600" />
                    What happens next?
                  </h4>
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-start space-x-2">
                      <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">1</span>
                      </div>
                      <span>Check your inbox for the verification email</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">2</span>
                      </div>
                      <span>Click the verification link in the email</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">3</span>
                      </div>
                      <span>Log in and start finding leads immediately!</span>
                    </div>
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg font-semibold shadow-lg"
                >
                  <Link href="/auth/login">
                    Go to Login
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Signup form
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* Left Side - Branding & Benefits */}
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
            <Badge className="bg-white/20 text-white border-white/30 mb-4">
              <Shield className="w-4 h-4 mr-2" />
              14-Day Free Trial • No Credit Card Required
            </Badge>
            <h1 className="text-5xl font-bold text-white mb-4">
              Start Finding Your Perfect Clients Today
            </h1>
            <p className="text-xl text-blue-100">
              Join hundreds of agencies already winning with LeadFinder Pro.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">AI-Powered Lead Scoring</h3>
                <p className="text-blue-100">Instantly identify your hottest prospects with 0-100 probability scores</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">Complete Contact Info</h3>
                <p className="text-blue-100">Emails, phones, social profiles, and more for every lead</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">Automatic CRM Detection</h3>
                <p className="text-blue-100">Know which businesses need your services most</p>
              </div>
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

      {/* Right Side - Signup Form */}
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
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <Badge className="bg-green-100 text-green-700 border-green-200 mb-3">
                  <Shield className="w-3 h-3 mr-1" />
                  14-Day Free Trial
                </Badge>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                  Create Your Account
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Start finding qualified leads in under 60 seconds
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleSignup}>
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
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      disabled={loading}
                      className="pl-10 h-12 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <p className="text-xs text-slate-500">Must be at least 8 characters</p>
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
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
                    'Creating account...'
                  ) : (
                    <>
                      Create Free Account
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-slate-500">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </p>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-slate-500">Already have an account?</span>
                  </div>
                </div>

                {/* Login Link */}
                <div className="text-center">
                  <Link href="/auth/login">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 border-2 border-slate-300 hover:border-indigo-600 hover:text-indigo-600 text-base font-semibold transition-all"
                    >
                      Sign in to existing account
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
