'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

export default function AuthChecker({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = Cookies.get('token')
    const isAuthPage = pathname.startsWith('/auth');

    // If no token and not on auth page, redirect to login
    if (!token && !isAuthPage) {
      router.push('/auth/login');
    }

    // If token exists but on auth page, redirect to dashboard
    if (token && isAuthPage) {
      router.push('/');
    }
  }, [pathname, router]);

  return <>{children}</>;
}