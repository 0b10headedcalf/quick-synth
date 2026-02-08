'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/AuthForm';

/**
 * LoginPage Component
 * Handles both Login and Registration by toggling a state.
 * It uses the AuthForm component to keep the UI clean.
 */
export default function LoginPage() {
    // Methods from our custom useAuth hook
    const { login, register, loading } = useAuth();
    
    // State to toggle between Login and Register modes
    const [isSignUp, setIsSignUp] = useState(false);

    /**
     * handleAuth
     * A unified handler for the form submission.
     */
    const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            if (isSignUp) {
                await register(email, password);
            } else {
                await login(email, password);
            }
        } catch (err) {
            // Errors are handled inside the useAuth hook (alerts), 
            // but we catch here to prevent the form from resetting if it fails.
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        {isSignUp ? 'Create your account' : 'Welcome back'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {isSignUp 
                            ? 'Join Quick Synth to start making music with friends' 
                            : 'Log in to access your music rooms'}
                    </p>
                </div>

                {/* The Form Component */}
                <AuthForm
                    handleSubmit={handleAuth}
                    submitType={isSignUp ? 'Register' : 'Login'}
                    loading={loading}
                />

                {/* Toggle Button */}
                <div className="text-center mt-4">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                    >
                        {isSignUp
                            ? 'Already have an account? Log in'
                            : "Don't have an account? Sign up"
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}