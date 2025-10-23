import "@/css/satoshi.css";
import "@/css/style.css";
import "flatpickr/dist/themes/material_blue.css";
import "jsvectormap/dist/jsvectormap.css";
import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import ClientRoot from "./client-root";

export const metadata: Metadata = {
  title: {
    template: "%s | Admin Dashboard",
    default: "Admin Dashboard | Course App",
  },
  description:
    "Next.js admin dashboard toolkit with 200+ templates, UI components, and integrations for fast dashboard development.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  );
}
