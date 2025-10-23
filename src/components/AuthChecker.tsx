"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Loader from "./Loader";

export default function AuthChecker({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");
    const isAuthPage = pathname.startsWith("/auth");
    const isNoAccessPage = pathname.startsWith("/user-access");

    if (isAuthPage || isNoAccessPage) {
      setLoading(false);
      return;
    }

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    // if (role !== 'admin') {
    //   router.replace('/user-access');
    //   return;
    // }

    setLoading(false);
  }, [pathname, router]);

  if (loading) {
    return <Loader />;
  }

  return <>{children}</>;
}
