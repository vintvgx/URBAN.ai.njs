"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu, Power, Info } from "lucide-react";

export default function LandingFace() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Urban AI</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">LOG IN</div>
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <div className="text-sm text-muted-foreground">SIGN UP</div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            "w-64 border-r hidden md:block transition-all duration-300",
            !isSidebarOpen && "w-0 opacity-0"
          )}>
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          <div className="flex-1 p-6 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
            <p className="text-xl text-center mb-8 text-muted-foreground">
              Urban AI reference phrase to get user to understand ai purpose
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 rounded-lg border bg-muted/40" />
              ))}
            </div>
            <div className="w-full space-y-4">
              <Input
                className="w-full"
                placeholder="Type your message here..."
              />
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t p-4 flex items-center justify-center gap-8">
            <Button variant="ghost" size="sm" className="gap-2">
              <Power className="h-4 w-4" />
              Power
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Info className="h-4 w-4" />
              Information
            </Button>
          </footer>
        </main>
      </div>
    </div>
  );
}

function SidebarContent() {
  return (
    <div className="h-full flex flex-col">
      <Sheet>
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Recent</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-auto p-4">
          {/* Add recent items here */}
        </div>
      </Sheet>
    </div>
  );
}
