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
import { UserData, UserSettings } from "@/lib/auth/types";

interface SettingsModalProps {
  settings: UserSettings;
  user: UserData | null;
  onSettingsChange: (settings: Partial<UserSettings>) => void;
}

const fontOptions = ["Arial", "Arial Black", "Mono", "System Default"];

export function SettingsModal({
  settings,
  user,
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

          {user && <div className="flex items-center justify-between">
            <Label htmlFor="uploadToDatabase">Upload to Database</Label>
            <Switch
              id="uploadToDatabase"
              checked={settings.uploadToDatabase}
              onCheckedChange={(checked) =>
                onSettingsChange({ uploadToDatabase: checked })
              }
            />
          </div>}

          <div className="space-y-2">
            <Label>Font</Label>
            <Select
              value={settings.font}
              onValueChange={(value) => onSettingsChange({ font: value })}>
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

          {/* <div className="space-y-2">
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
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
