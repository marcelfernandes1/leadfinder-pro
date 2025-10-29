/**
 * Navbar Component
 *
 * Main navigation bar for the application.
 * Features:
 * - Logo/brand name
 * - Navigation links (Dashboard, New Search, Account)
 * - User email and avatar in top right
 * - Logout functionality
 * - Responsive design with mobile menu
 */

'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  X,
  Zap,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const supabase = createClient();

  // Get user email on mount
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };
    getUser();
  }, [supabase]);

  // Handle logout
  const handleLogout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
    router.push('/auth/login');
    router.refresh();
  };

  // Get initials from email for avatar
  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  // Check if link is active
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 group"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              LeadFinder Pro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/dashboard">
              <Button
                variant={isActive('/dashboard') ? 'default' : 'ghost'}
                className={
                  isActive('/dashboard')
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
                    : ''
                }
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/search">
              <Button
                variant={isActive('/search') ? 'default' : 'ghost'}
                className={
                  isActive('/search')
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
                    : ''
                }
              >
                <Search className="w-4 h-4 mr-2" />
                New Search
              </Button>
            </Link>
          </div>

          {/* User Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {userEmail ? getInitials(userEmail) : '?'}
                  </div>
                  <span className="text-sm font-medium text-slate-700 max-w-[150px] truncate">
                    {userEmail || 'User'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">My Account</p>
                    <p className="text-xs leading-none text-slate-500 truncate">
                      {userEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/account"
                    className="cursor-pointer flex items-center"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Account Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600 flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col space-y-2">
              <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant={isActive('/dashboard') ? 'default' : 'ghost'}
                  className={`w-full justify-start ${
                    isActive('/dashboard')
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
                      : ''
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/search" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant={isActive('/search') ? 'default' : 'ghost'}
                  className={`w-full justify-start ${
                    isActive('/search')
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
                      : ''
                  }`}
                >
                  <Search className="w-4 h-4 mr-2" />
                  New Search
                </Button>
              </Link>

              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {userEmail ? getInitials(userEmail) : '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {userEmail || 'User'}
                    </p>
                  </div>
                </div>

                <div className="mt-2 space-y-1">
                  <Link href="/account" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="w-4 h-4 mr-2" />
                      Account Settings
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-600"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
