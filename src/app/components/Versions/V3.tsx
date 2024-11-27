"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu } from "lucide-react";

export default function V3() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen  p-8 font-mono relative">
      <div
        className="fixed left-0 top-0 h-full z-10"
        onMouseEnter={() => setIsMenuOpen(true)}
        onMouseLeave={() => setIsMenuOpen(false)}>
        <div
          className={`bg-white h-full shadow-md transition-all duration-100 ease-in-out ${
            isMenuOpen ? "w-64" : "w-16"
          }`}>
          <div className="p-4 h-full relative">
            {!isMenuOpen && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Menu className="w-8 h-8" />
              </div>
            )}
            {isMenuOpen && (
              <nav>
                <ul className="space-y-4 text-sm">
                  <li>
                    <Link
                      href="/history"
                      className="hover:text-neutral-500 transition-colors">
                      00 - HISTORY
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/chat"
                      className="hover:text-neutral-500 transition-colors">
                      01 - CHAT
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="hover:text-neutral-500 transition-colors">
                      02 - ABOUT
                    </Link>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>
      <div
        className={`transition-all duration-300 ease-in-out ${
          isMenuOpen ? "ml-64" : "ml-16"
        }`}>
        <header className="flex items-center justify-between mb-20">
          <h1 className="text-4xl font-bold tracking-tight">URBAN.AI</h1>
          <div className="flex gap-4">
            <Link href="/chat">
              <Button variant="outline" className="font-mono">
                Alt View
              </Button>
            </Link>
            <Button variant="outline" className="font-mono">
              Log in
            </Button>
            <Button className="font-mono bg-black text-white hover:bg-black/90">
              Sign up
            </Button>
          </div>
        </header>
        <main className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="space-y-4 mb-4 h-[400px] overflow-y-auto">
              <div className="flex gap-2">
                <div className="bg-neutral-100 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">Hello! How can I assist you today?</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
              <Button className="font-mono bg-black text-white hover:bg-black/90">
                Send
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
