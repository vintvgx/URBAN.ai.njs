import { useVersion } from "@/contexts/VersionContext";
import React from "react";
import { SettingsModal } from "@/components/Settings";
import { UserSettings } from "@/lib/auth/types";

interface FooterProps {
  settings: UserSettings;
  onSettingsChange: (settings: Partial<UserSettings>) => void;
}

const Footer: React.FC<FooterProps> = ({ settings, onSettingsChange }) => {
  const { activeVersion } = useVersion();

  return (
    <footer className="border-t p-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <SettingsModal
          settings={settings}
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
