'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

/**
 * Navbar Component
 * A responsive header that displays the logo, navigation links,
 * and the user's login/logout status.
 */
export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shadow-sm">
            {/* Logo / Brand Name */}
            <div className="flex items-center space-x-2">
                <Link href="/" className="text-xl font-bold tracking-tight text-blue-600">
                    Quick Synth
                </Link>
            </div>

            {/* Navigation & User Actions */}
            <div className="flex items-center space-x-6">
                <Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                    Home
                </Link>
                
                {user ? (
                    /* If the user is logged in, show their email and a logout button */
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500 hidden sm:inline">
                            {user.email}
                        </span>
                        <button
                            onClick={logout}
                            className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all shadow-sm hover:shadow-md"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    /* If the user is NOT logged in, show a login link */
                    <Link
                        href="/login"
                        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}