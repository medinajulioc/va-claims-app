import React from "react";
import { cookies } from "next/headers";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import GoogleAnalyticsInit from "@/lib/ga";
import { fontVariables } from "@/lib/fonts";
import NextTopLoader from "nextjs-toploader";

import "./globals.css";

import { Toaster } from "@/components/ui/toaster";
import { ActiveThemeProvider } from "@/components/active-theme";
import { DEFAULT_THEME } from "@/lib/themes";

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const themeSettings = {
    preset: (cookieStore.get("theme_preset")?.value ?? DEFAULT_THEME.font) as any,
    chartPreset: (cookieStore.get("theme_chart_preset")?.value ?? DEFAULT_THEME.font) as any,
    scale: (cookieStore.get("theme_scale")?.value ?? DEFAULT_THEME.font) as any,
    radius: (cookieStore.get("theme_radius")?.value ?? DEFAULT_THEME.font) as any,
    font: (cookieStore.get("theme_font")?.value ?? DEFAULT_THEME.font) as any,
    contentLayout: (cookieStore.get("theme_content_layout")?.value ?? DEFAULT_THEME.font) as any
  };

  const bodyAttributes = Object.fromEntries(
    Object.entries(themeSettings)
      .filter(([_, value]) => value)
      .map(([key, value]) => [`data-theme-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`, value])
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn("bg-background group/layout font-sans", fontVariables)}
        {...bodyAttributes}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange>
          <ActiveThemeProvider initialTheme={themeSettings}>
            {children}
            <Toaster />
            <NextTopLoader color="var(--primary)" showSpinner={false} height={2} shadow-sm="none" />
            {process.env.NODE_ENV === "production" ? <GoogleAnalyticsInit /> : null}
          </ActiveThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
