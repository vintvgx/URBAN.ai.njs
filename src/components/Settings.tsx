import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";
import { UserSettings } from "@/lib/auth/types";

interface SettingsModalProps {
  settings: UserSettings;
  onSettingsChange: (settings: Partial<UserSettings>) => void;
}

const fontOptions = ["Arial", "Arial Black", "Mono", "System Default"];

export function SettingsModal({
  settings,
  onSettingsChange,
}: SettingsModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="sidebar">Show Sidebar</Label>
            <Switch
              id="sidebar"
              checked={settings.showSideBar}
              onCheckedChange={(checked) =>
                onSettingsChange({ showSideBar: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="typewriter">Typewriter Effect</Label>
            <Switch
              id="typewriter"
              checked={settings.typewriterEffect}
              onCheckedChange={(checked) =>
                onSettingsChange({ typewriterEffect: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="darkMode">Dark Mode</Label>
            <Switch
              id="darkMode"
              checked={settings.darkMode}
              onCheckedChange={(checked) =>
                onSettingsChange({ darkMode: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="compactView">Compact View</Label>
            <Switch
              id="compactView"
              checked={settings.compactView}
              onCheckedChange={(checked) =>
                onSettingsChange({ compactView: checked })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>User Font</Label>
            <Select
              value={settings.userFont}
              onValueChange={(value) => onSettingsChange({ userFont: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem key={font} value={font}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Assistant Font</Label>
            <Select
              value={settings.assistantFont}
              onValueChange={(value) =>
                onSettingsChange({ assistantFont: value })
              }>
              <SelectTrigger>
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem key={font} value={font}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
