'use client';

import { usePathname } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
import Cookies from "js-cookie";

import { Sidebar } from '@/components/Layouts/sidebar';
import { Header } from '@/components/Layouts/header';
import ToastProvider from '@/components/core/ToasterProvider';

import type { PropsWithChildren } from 'react';

export default function ClientLayoutShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const token = Cookies.get('token');
  const isAuthPage = pathname.startsWith('/auth');

  // If no token and not on auth page, don't render anything (AuthChecker will handle redirect)
  if (!token && !isAuthPage) {
    return null;
  }

  return (
    <>
      {!isAuthPage && <NextTopLoader color="#5750F1" showSpinner={false} />}

      <div className="flex min-h-screen">
        {!isAuthPage && <Sidebar />}

        <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
          {!isAuthPage && <Header />}

          <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
            {children}
          </main>
        </div>
      </div>

      <ToastProvider />
    </>
  );
}