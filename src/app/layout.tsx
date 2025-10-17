import "../css/style.css";

// import "flatpickr/dist/themes/material_blue.css";
import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import { Providers } from "./providers";
import ClientLayoutShell from "../components/ClientLayoutShell";
import AuthChecker from "../components/AuthChecker";

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
        <Providers>
          <AuthChecker>
            <ClientLayoutShell>{children}</ClientLayoutShell>
          </AuthChecker>
        </Providers>
      </body>
    </html>
  );
}
