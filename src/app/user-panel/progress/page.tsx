"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Page() {
  const router = useRouter();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const redirectUser = () => {
      try {
        const userId = Cookies.get('userId');
        
        if (userId) {
          router.push(`/user-panel/${userId}`);
        } else {
          setStatus('no-user');
          setTimeout(() => router.push('/login'), 2000);
        }
      } catch (error) {
        console.error('Error reading cookies:', error);
        setStatus('error');
      }
    };

    redirectUser();
  }, [router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'no-user') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-4">
            <p>User not found. Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
            <p>An error occurred. Please try again.</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return null;
}