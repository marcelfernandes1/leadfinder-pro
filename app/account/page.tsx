/**
 * Account Settings Page
 *
 * Allows users to manage their account settings, subscription, and profile.
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Settings,
  LogOut,
  User,
  ChevronDown,
  Target,
  Mail,
  Shield,
  CreditCard,
  Bell,
  Lock,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { createClient } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

/**
 * Toast Notification Component
 * Beautiful animated notification that auto-dismisses
 */
function Toast({ message, type, onDismiss }: { message: string; type: 'success' | 'error'; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const bgColor = type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  const textColor = type === 'success' ? 'text-green-700' : 'text-red-700';
  const IconComponent = type === 'success' ? CheckCircle : AlertCircle;
  const iconColor = type === 'success' ? 'text-green-600' : 'text-red-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`fixed top-6 right-6 ${bgColor} border rounded-lg p-4 shadow-lg z-50 max-w-sm flex items-start gap-3`}
    >
      <IconComponent className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        <p className={`text-sm font-medium ${textColor}`}>{message}</p>
      </div>
      <button
        onClick={onDismiss}
        className={`${textColor} hover:opacity-70 transition-opacity flex-shrink-0`}
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

/**
 * Navbar Component
 */
function Navbar() {
  const router = useRouter();

  return (
    <nav className="border-b border-slate-200/50 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              LeadFinder Pro
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard')}
              className="font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => router.push('/api/auth/signout')}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [billingLoading, setBillingLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
        setNewEmail(data.user.email || '');
      } else {
        router.push('/auth/login');
      }
      setLoading(false);
    };

    getUser();
  }, [router, supabase]);

  /**
   * Handle email update
   */
  const handleEmailUpdate = async () => {
    if (!newEmail || newEmail === user?.email) {
      setEmailMessage('Please enter a different email address');
      return;
    }

    setEmailLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) {
        setEmailMessage(`Error: ${error.message}`);
      } else {
        setEmailMessage('Check your email to confirm the change');
      }
    } catch (err) {
      setEmailMessage('An error occurred updating your email');
    } finally {
      setEmailLoading(false);
    }
  };

  /**
   * Handle password reset
   */
  const handlePasswordReset = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user?.email);
      if (error) {
        setNotification({ message: `Error: ${error.message}`, type: 'error' });
      } else {
        setNotification({ message: 'Password reset email sent! Check your inbox.', type: 'success' });
      }
    } catch (err) {
      setNotification({ message: 'An error occurred sending reset email', type: 'error' });
    }
  };

  /**
   * Handle billing management
   * Opens Stripe billing portal or checkout
   */
  const handleManageBilling = async () => {
    setBillingLoading(true);
    try {
      const response = await fetch('/api/stripe/billing-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to create billing portal session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      setNotification({
        message: 'Failed to open billing portal',
        type: 'error',
      });
    } finally {
      setBillingLoading(false);
    }
  };

  /**
   * Handle account deletion
   */
  const handleDeleteAccount = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    setDeletingAccount(true);
    try {
      // Call API to delete account
      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        // Sign out and redirect
        setNotification({ message: 'Account deleted successfully. Redirecting...', type: 'success' });
        await supabase.auth.signOut();
        setTimeout(() => router.push('/'), 1500);
      } else {
        setNotification({ message: 'Error deleting account', type: 'error' });
      }
    } catch (err) {
      setNotification({ message: 'An error occurred deleting your account', type: 'error' });
    } finally {
      setDeletingAccount(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading settings...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {notification && (
        <Toast
          message={notification.message}
          type={notification.type}
          onDismiss={() => setNotification(null)}
        />
      )}
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent mb-2">
              Account Settings
            </h1>
            <p className="text-slate-600">Manage your account and preferences</p>
          </motion.div>

          {/* Settings Sections */}
          <div className="space-y-6 mt-8">
            {/* Profile Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle>Profile</CardTitle>
                      <CardDescription>Manage your account information</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Email Address</label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => {
                          setNewEmail(e.target.value);
                          setEmailMessage('');
                        }}
                        className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="your@email.com"
                      />
                      <Button
                        onClick={handleEmailUpdate}
                        disabled={emailLoading}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600"
                      >
                        {emailLoading ? 'Saving...' : 'Update'}
                      </Button>
                    </div>
                    {emailMessage && (
                      <p className={`text-xs mt-2 ${emailMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                        {emailMessage}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Account Created</label>
                    <input
                      type="text"
                      value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : ''}
                      disabled
                      className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 cursor-not-allowed"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Security Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Lock className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <CardTitle>Security</CardTitle>
                      <CardDescription>Password and security settings</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600 mb-4">
                    Send a password reset email to your inbox.
                  </p>
                  <Button variant="outline" className="w-full" onClick={handlePasswordReset}>
                    Send Reset Email
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Subscription Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle>Subscription</CardTitle>
                      <CardDescription>Manage your plan and billing</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                    <p className="text-sm text-slate-600 mb-2">Current Plan</p>
                    <p className="text-2xl font-bold text-slate-900 mb-4">Pro</p>
                    <Button
                      onClick={handleManageBilling}
                      disabled={billingLoading}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600"
                    >
                      {billingLoading ? 'Loading...' : 'Manage Billing'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Notifications Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Bell className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <CardTitle>Notifications</CardTitle>
                      <CardDescription>Email notification preferences</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-3 text-sm text-slate-700 group-hover:text-slate-900">
                        Email me when searches complete
                      </span>
                    </label>
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-3 text-sm text-slate-700 group-hover:text-slate-900">
                        Send weekly activity summary
                      </span>
                    </label>
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-3 text-sm text-slate-700 group-hover:text-slate-900">
                        Notify me about new features
                      </span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Danger Zone */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="bg-white/80 backdrop-blur-sm border-red-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <CardTitle className="text-red-600">Danger Zone</CardTitle>
                      <CardDescription>Irreversible actions</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleDeleteAccount}
                    disabled={deletingAccount}
                  >
                    {deleteConfirm
                      ? deletingAccount
                        ? 'Deleting Account...'
                        : 'Click Again to Confirm'
                      : 'Delete Account'}
                  </Button>
                  <p className="text-xs text-slate-500">
                    This action cannot be undone. All your data will be permanently deleted.
                  </p>
                  {deleteConfirm && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-xs text-red-700 font-semibold">⚠️ Are you absolutely sure? Click the button again to confirm.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
