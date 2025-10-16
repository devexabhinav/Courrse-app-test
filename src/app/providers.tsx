// "use client";

// import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
// import { ThemeProvider } from "next-themes";

// export function Providers({ children }: { children: React.ReactNode }) {
//   return (
//     <ThemeProvider defaultTheme="light" attribute="class">
//       <SidebarProvider>{children}</SidebarProvider>
//     </ThemeProvider>
//   );
// }
"use client";

import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { ThemeProvider } from "next-themes";
import ReduxProvider from "@/components/ReduxProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ThemeProvider defaultTheme="light" attribute="class">
        <SidebarProvider>{children}</SidebarProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}