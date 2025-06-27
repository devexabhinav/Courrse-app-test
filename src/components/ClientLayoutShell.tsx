'use client';

import { usePathname } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';

import { Sidebar } from '@/components/Layouts/sidebar';
import { Header } from '@/components/Layouts/header';
import ToastProvider from '@/components/core/ToasterProvider'; // ✅ Import the ToastProvider

import type { PropsWithChildren } from 'react';

export default function ClientLayoutShell({ children }: PropsWithChildren) {
  const pathname   = usePathname();
  const isAuthPage = pathname.startsWith('/auth');

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

      <ToastProvider /> {/* ✅ This renders ToastContainer only on the client */}
    </>
  );
}
