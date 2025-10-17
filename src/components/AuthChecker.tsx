'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Loader from './Loader';
import api from '@/lib/api'; // Adjust the import path as needed

interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  verified: boolean;
  status: 'active' | 'inactive' | 'approved' | 'pending' | 'suspended';
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
}

export default function AuthChecker({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [hydrated, setHydrated] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [sed, setsed] = useState("");
  useEffect(() => {
    setHydrated(true); 
  }, []);
console.log("object", sed)
  const getCurrentUser = async (): Promise<User> => {
    try {
      const response = await api.get('user/me'); // Adjust endpoint to match your backend
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Authentication failed');
      }

      if (!response.data?.user) {
        throw new Error('No user data received');
      }

          const responseData = response.data;
          setsed(responseData)
          

      return response.data;
      
    } catch (error: any) {
      console.error('Auth check failed:', error);
      
      // Clear tokens on auth failure
      Cookies.remove('token');
      Cookies.remove('refreshToken');
      
      throw new Error(error.message || 'Authentication failed');
    }
  };

  const handleAuthRedirect = (user: User) => {
    const currentPath = pathname;

    // User is not verified - redirect to verification page
    if (!user.verified) {
      if (!currentPath.startsWith('/auth/login')) {

        router.replace('/');
      }
      return (<>hello user</>);
    }

    // Admin not approved
    if (user.role === 'admin' && user.status !== 'approved') {
      if (!currentPath.startsWith('/auth/login')) {
        router.replace('/');
      }
      return false;
    }

    // Regular user not active
    if (user.role === 'user' ) {
      if (!currentPath.startsWith('/')) {
        router.replace('/');
      }
      return (<>hello user</>);
    }

    // If user is on auth pages but already authenticated, redirect to appropriate dashboard
    if (currentPath.startsWith('/auth')) {
      if (user.role === 'admin') {
        router.replace('/');
      } else {
        router.replace('/');
      }
      return false;
    }

    // If user is on access pages but already authorized, redirect to appropriate dashboard
    if (currentPath.startsWith('/') || 
        currentPath.startsWith('/') || 
        currentPath.startsWith('/')) {
      if (user.role === 'admin') {
        router.replace('/');
      } else {
        router.replace('/');
      }
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (!hydrated) return;

    const authenticateUser = async () => {
      const isAuthPage = pathname.startsWith('/auth');
      const isAccessPage = pathname.startsWith('/') || 
                          pathname.startsWith('/') || 
                          pathname.startsWith('/');

      // Check if token exists
      const token = Cookies.get('token');
      
      if (!token) {
        if (!isAuthPage && !isAccessPage) {
          router.replace('/auth/login');
        } else {
          setLoading(false);
        }
        return;
      }

      try {
        const userData = await getCurrentUser();
        setUser(userData);
        
        const isAuthorized = handleAuthRedirect(userData);
        
        if (isAuthorized) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        
        // Clear invalid tokens
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        
        if (!isAuthPage && !isAccessPage) {
          router.replace('/auth/login');
        } else {
          setLoading(false);
        }
      }
    };

    authenticateUser();
  }, [hydrated, pathname, router]);

  if (!hydrated || loading) {
    return <Loader />;
  }

  return <>{children}</>;
};