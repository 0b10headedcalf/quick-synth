import { useState, useEffect } from 'react';
import { account, ID } from '@/lib/appwrite';
import { Models } from 'appwrite';
import { useRouter } from 'next/navigation';

/**
 * useAuth Hook
 * Manages user authentication state and provides methods for sign-up, login, and logout.
 */
export function useAuth() {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkUser();
    }, []);

    /**
     * checkUser
     * Checks if there's an existing session on the Appwrite server.
     */
    async function checkUser() {
        try {
            const session = await account.get();
            setUser(session);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    /**
     * login
     * Creates an email session in Appwrite.
     */
    async function login(email: string, password: string) {
        setLoading(true);
        try {
            await account.createEmailPasswordSession(email, password);
            const userAccount = await account.get();
            setUser(userAccount);
            router.push('/'); // Redirect to home after login
        } catch (error: any) {
            alert(error.message || 'Login failed');
            throw error;
        } finally {
            setLoading(false);
        }
    }

    /**
     * register
     * Creates a new user account and then logs them in.
     */
    async function register(email: string, password: string) {
        setLoading(true);
        try {
            // ID.unique() generates a random unique ID for the new user
            await account.create(ID.unique(), email, password);
            // Automatically log in after registration
            await login(email, password);
        } catch (error: any) {
            alert(error.message || 'Registration failed');
            throw error;
        } finally {
            setLoading(false);
        }
    }

    /**
     * logout
     * Ends the current session.
     */
    async function logout() {
        try {
            await account.deleteSession('current');
            setUser(null);
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    return { 
        user, 
        loading, 
        checkUser, 
        login, 
        register, 
        logout 
    };
}
