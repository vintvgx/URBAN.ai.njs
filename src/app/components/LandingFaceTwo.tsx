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
import { Menu, Power } from "lucide-react";
import AuthModal from "./AuthModal";
import { Toaster } from "react-hot-toast";
import { useAuth } from "@/lib/auth/hooks";
import { getUserInitials } from "@/utils/functions";

export default function Component() {
  // Global User Auth State
  const { user, isAuthenticated } = useAuth();

  // State of sidebar and input
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isInputFocused, setIsInputFocused] = React.useState(false);

  // Refs for input and container
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Click outside handler for input
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // If the click is outside the input and container, set the input to not be focused
      if (
        inputRef.current &&
        containerRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !containerRef.current.contains(event.target as Node)
      ) {
        // Set the input to not be focused
        setIsInputFocused(false);
      }
    }

    // Add event listener for mousedown
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col ">
      <div>
        <Toaster />
      </div>
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
          {user && isAuthenticated ? (
            <div className="user-avatar">
              <span className={`text-base font-extralight tracking-wide`}>
                {/*TODO Add theme::: {theme} === 'dark' ? 'text-white' : 'text-gray-800` */}
                {/* @ts-expect-error error for display name */}
                {getUserInitials(user?.displayName)}
              </span>
            </div>
          ) : (
            <>
              <AuthModal
                defaultView="login"
                trigger={
                  <Button variant="ghost" size="sm" className="gap-2">
                    LOG IN
                  </Button>
                }
              />
              <AuthModal
                defaultView="signup"
                trigger={
                  <Button variant="ghost" size="sm" className="gap-2">
                    SIGN UP
                  </Button>
                }
              />
            </>
          )}
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
          <div
            className={cn(
              "flex-1 p-6 flex flex-col items-center transition-all duration-300",
              isInputFocused ? "justify-end" : "justify-center",
              "max-w-2xl mx-auto w-full"
            )}>
            <div
              className={cn(
                "transition-all duration-300",
                isInputFocused ? "opacity-0" : "opacity-100"
              )}>
              <p className="text-xl text-center mb-8 text-muted-foreground">
                Urban AI reference phrase to get user to understand ai purpose
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 rounded-lg border bg-muted/40" />
                ))}
              </div>
            </div>
            <div
              ref={containerRef}
              className={cn(
                "w-full space-y-4 transition-all duration-300",
                isInputFocused ? "pb-4" : ""
              )}>
              <Input
                ref={inputRef}
                className="w-full"
                placeholder="Type your message here..."
                onFocus={() => setIsInputFocused(true)}
                onClick={() => setIsInputFocused(true)}
              />
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t p-4 flex items-center justify-center gap-8">
            <Button variant="ghost" size="sm" className="gap-2">
              <Power className="h-4 w-4" />
              ABOUT
            </Button>
            {/* <Button variant="ghost" size="sm" className="gap-2">
              <Info className="h-4 w-4" />
              Information
            </Button> */}
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
