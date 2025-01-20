import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./providers";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { VersionProvider } from "@/contexts/VersionContext";
import { sidebarData } from "@/utils/sidebarData";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Urban AI",
  description:
    "Welcome to Urban.ai, an innovative chatbot designed to respond to chatbot queries by incorporating urban phrases and slang to keep the conversation hip & contemporary.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange>
          <VersionProvider initialVersion={sidebarData.versions[0]}>
            <Providers>{children}</Providers>
          </VersionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
