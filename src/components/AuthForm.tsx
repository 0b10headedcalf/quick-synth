'use client';

/**
 * AuthForm Component
 * A reusable form for both Login and Registration.
 * It uses standard Tailwind classes for a clean, modern look.
 */
interface AuthFormProps {
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
    submitType: 'Login' | 'Register';
    loading?: boolean;
}

export default function AuthForm({ handleSubmit, submitType, loading }: AuthFormProps) {
    return (
        <form
            className="w-full max-w-md space-y-6"
            onSubmit={handleSubmit}
        >
            <div className="space-y-4">
                {/* Email Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        name="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        placeholder="you@example.com"
                        required
                        disabled={loading}
                    />
                </div>

                {/* Password Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        placeholder="••••••••"
                        required
                        disabled={loading}
                        minLength={8}
                    />
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Processing...' : submitType}
            </button>
        </form>
    );
}