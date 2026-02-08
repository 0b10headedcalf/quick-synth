import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Google Font for a modern look
import './globals.css'; // Global CSS including Tailwind directives
import Navbar from '@/components/Navbar'; // Navigation component

// Initialize the Inter font
const inter = Inter({ subsets: ['latin'] });

/**
 * Metadata for the application.
 * This is used by Next.js to populate the <head> of your HTML documents.
 * Good for SEO and browser tab titles.
 */
export const metadata: Metadata = {
    title: 'Quick Synth | Collaborative Music Maker',
    description: 'Work together with friends to create chiptune music and synthesizers in your browser.',
};

/**
 * RootLayout is the top-level wrapper for your entire application.
 * Everything you put here (like the Navbar) will be visible on every page.
 */
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
                {/* The Navbar will appear at the top of every page */}
                <Navbar />
                
                {/* {children} is where the content of individual pages (like page.tsx) is injected */}
                {children}
            </body>
        </html>
    );
}