"use client";

import { BadgeCheck, Bell, LogOut, Sparkles, User } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { CaretSortIcon, ComponentPlaceholderIcon } from "@radix-ui/react-icons";
import { UserData } from "@/lib/auth/types";
import { getUserInitials } from "@/utils/functions";
import AuthModal from "@/app/components/Auth/AuthModal";
import { useLogout } from "@/lib/auth/hooks";

export function NavUser({
  user,
  authLoading,
  isAuthenticated,
}: {
  user: UserData | null;
  authLoading: boolean;
  isAuthenticated: boolean;
}) {
  const { isMobile } = useSidebar();
  const { state } = useSidebar();
  const { mutate: signOut } = useLogout();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              {authLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
              ) : user && isAuthenticated ? (
                <>
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">
                      {getUserInitials(user?.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.displayName}
                    </span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                  <CaretSortIcon className="ml-auto size-4" />
                </>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <User className="size-5" />
                    {state === "expanded" && (
                      <span className="hidden sm:block text-base font-extralight tracking-wide">
                        Sign In
                      </span>
                    )}
                  </div>
                  {state === "expanded" && <CaretSortIcon className="size-4" />}
                </div>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}>
            {user ? (
              <>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg">
                        {getUserInitials(user?.displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.displayName}
                      </span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles />
                    Upgrade to Pro
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheck />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ComponentPlaceholderIcon />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuGroup>
                <AuthModal
                  defaultView="login"
                  trigger={
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <LogOut className="rotate-180" />
                      Sign In
                    </DropdownMenuItem>
                  }
                />
                <AuthModal
                  defaultView="signup"
                  trigger={
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <BadgeCheck />
                      Create Account
                    </DropdownMenuItem>
                  }
                />
              </DropdownMenuGroup>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
