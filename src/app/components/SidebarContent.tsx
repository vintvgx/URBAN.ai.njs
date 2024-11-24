import React, { useState } from "react";
import { Sheet, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserSettings } from "@/lib/auth/types";
import { useMutation } from "@tanstack/react-query";
import { ChatSession } from "@/lib/chat/types";
import { formatDate, getFirstMessage } from "@/utils/functions";

interface SidebarContentProps {
  isAuthenticated: boolean;
  chatLoading: boolean;
  chatError: Error | null;
  chatHistory: ChatSession[];
  onChatSelect?: (chat: ChatSession) => void;
}

const SidebarContent = ({
  isAuthenticated,
  chatLoading,
  chatError,
  chatHistory,
  onChatSelect,
}: SidebarContentProps) => {
  // Add initial settings state
  const [settings, setSettings] = useState<UserSettings>({
    showSideBar: true,
    userFont: undefined,
    assistantFont: undefined,
    typewriterEffect: false,
  });

  // Mutation for updating settings
  const updateSettingsMutation = useMutation({
    mutationFn: (newSettings: Partial<UserSettings>) => {
      // TODO: Implement the actual API call to save settings to database
      // For now, just update local state
      setSettings((prev) => ({ ...prev, ...newSettings }));
      return Promise.resolve();
    },
  });

  const fontOptions = [
    "System Default",
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Courier New",
  ];

  /**
   * Render content based on authentication and loading state
   * 1. If chat or auth is loading, render a loading spinner
   * 2. If user is not authenticated, render a message prompting them to sign in
   * 3. If there is an error, render an error message
   * 4. If there is no chat history, render a message indicating so
   * 5. Otherwise, render the chat history
   */
  const renderContent = () => {
    if (chatLoading) {
      return (
        <div className="flex justify-center">
          <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <p className="text-sm text-muted-foreground text-center">
          Please sign in to view chat history
        </p>
      );
    }

    if (chatError) {
      return (
        <p className="text-sm text-red-500 text-center">
          Error loading chat history
        </p>
      );
    }

    if (!chatHistory || chatHistory.length === 0) {
      return (
        <p className="text-sm text-muted-foreground text-center">
          No chat history found
        </p>
      );
    }

    return (
      <div className="space-y-2">
        {chatHistory.map((chat: ChatSession) => {
          const firstMessage = chat.messages[0];
          const { date, time } = formatDate(firstMessage.timestamp);

          return (
            <div
              key={chat.sessionID}
              className="p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
              onClick={() => onChatSelect?.(chat)}>
              <div className="flex flex-col gap-1">
                <p className="text-sm truncate">{getFirstMessage(chat)}</p>
                <p className="text-sm font-medium text-muted-foreground">
                  {date} at {time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <Sheet>
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Recent Chats</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-auto p-4">{renderContent()}</div>
        <div className="p-4 border-t">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sidebar">Show Sidebar</Label>
                  <Switch
                    id="sidebar"
                    checked={settings.showSideBar}
                    onCheckedChange={(checked) =>
                      updateSettingsMutation.mutate({ showSideBar: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="typewriter">Typewriter Effect</Label>
                  <Switch
                    id="typewriter"
                    checked={settings.typewriterEffect}
                    onCheckedChange={(checked) =>
                      updateSettingsMutation.mutate({
                        typewriterEffect: checked,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>User Font</Label>
                  <Select
                    value={settings.userFont}
                    onValueChange={(value) =>
                      updateSettingsMutation.mutate({ userFont: value })
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

                <div className="space-y-2">
                  <Label>Assistant Font</Label>
                  <Select
                    value={settings.assistantFont}
                    onValueChange={(value) =>
                      updateSettingsMutation.mutate({ assistantFont: value })
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
            </PopoverContent>
          </Popover>
        </div>
      </Sheet>
    </div>
  );
};

export default SidebarContent;
