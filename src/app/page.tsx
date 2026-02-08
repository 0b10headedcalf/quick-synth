'use client';

import { useEffect, useState } from 'react';
import { account } from '@/lib/appwrite';
import { useAuth } from '@/hooks/useAuth';
import SynthCanvas from '@/components/canvas/SynthCanvas';

/**
 * The Home page component.
 */
export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    account.get()
      .then(() => setStatus('connected'))
      .catch((err: any) => {
        if (err.code === 401) {
          setStatus('connected');
        } else {
          setStatus('error');
          setError(err.message);
        }
      });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <div className="max-w-6xl w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 mt-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              Quick <span className="text-blue-600">Synth</span>
            </h1>
            <p className="text-gray-500 mt-2 italic">Prototype v0.1 - Node Audio & Realtime Test</p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-4 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${status === 'connected' ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Backend</span>
            </div>
            <div className="h-4 w-[1px] bg-gray-200"></div>
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${user ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                {user ? 'Authenticated' : 'Guest Mode'}
              </span>
            </div>
          </div>
        </div>

        {/* The Synth Canvas - Testing Ground */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Collaborative Workspace</h2>
            <div className="text-sm text-gray-400">Drag to move • Slider to change pitch</div>
          </div>
          <SynthCanvas />
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">
            <strong>Appwrite Error:</strong> {error}. Please ensure your Appwrite instance is running and the Project ID is correct.
          </div>
        )}
      </div>
    </main>
  );
}
