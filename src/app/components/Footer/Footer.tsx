import { useVersion } from "@/contexts/VersionContext";
import React from "react";
import { SettingsModal } from "@/components/Settings";
import { UserData, UserSettings } from "@/lib/auth/types";

interface FooterProps {
  settings: UserSettings;
  user: UserData | null;
  onSettingsChange: (settings: Partial<UserSettings>) => void;
}

const Footer: React.FC<FooterProps> = ({ settings, user, onSettingsChange }) => {
  const { activeVersion } = useVersion();

  return (
    <footer className="border-t p-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <SettingsModal
          settings={settings}
          user={user}
          onSettingsChange={onSettingsChange}
        />
      </div>
      <span className="text-sm text-muted-foreground">
        {activeVersion.version}
      </span>
    </footer>
  );
};

export default Footer;
