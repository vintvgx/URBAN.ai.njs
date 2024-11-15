import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function COMMUNITE_MainContent() {
  return (
    <div className="min-h-screen bg-[#f5f1f0] p-8 font-mono">
      <header className="flex items-center justify-between mb-20">
        <h1 className="text-4xl font-bold tracking-tight">URBAN.AI</h1>
        <div className="flex gap-4">
          <Button variant="outline" className="font-mono">
            Log in
          </Button>
          <Button className="font-mono bg-black text-white hover:bg-black/90">
            Sign up
          </Button>
        </div>
      </header>
      <nav className="mb-12">
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
  );
}
