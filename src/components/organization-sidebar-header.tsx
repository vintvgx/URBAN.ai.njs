"use client";

import * as React from "react";
import { ChevronsUpDown, GalleryVerticalEnd } from "lucide-react";
import { useVersion } from "@/contexts/VersionContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { useTheme } from "next-themes";

export function SideBarUrbanAIHeader({
  versions,
}: {
  versions: {
    name: string;
    version: string;
  }[];
}) {
  const { isMobile, state } = useSidebar();
  const { activeVersion, setActiveVersion } = useVersion();
  const { theme } = useTheme();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary-foreground text-sidebar-primary-foreground">
                <Image
                  src={`/LOGO${theme === "light" ? "B" : "B"}.png`}
                  alt="Urban AI Logo"
                  className="size-5"
                  width={16}
                  height={16}
                />
              </div>
              {state !== "collapsed" && (
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Urban AI</span>
                  <span className="truncate text-xs">
                    {activeVersion.version}
                  </span>
                </div>
              )}
              {state !== "collapsed" && <ChevronsUpDown className="ml-auto" />}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Select Version
            </DropdownMenuLabel>
            {versions.map((ver) => (
              <DropdownMenuItem
                key={ver.version}
                onClick={() => setActiveVersion(ver)}
                className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <GalleryVerticalEnd className="size-4 shrink-0" />
                </div>
                {ver.version}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
