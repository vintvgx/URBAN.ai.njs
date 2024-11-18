import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./providers";

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
  description: "Welcome to Urban.ai, an innovative chatbot designed to respond to chatbot queries by incorporating urban phrases and slang to keep the conversation hip & contemporary.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {/* <AuthProvider> */}
          {children}
          {/* </AuthProvider> */}
        </Providers>
      </body>
    </html>
  );
}
