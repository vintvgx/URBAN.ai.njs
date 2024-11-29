import { Button } from "@/components/ui/button";
import { useVersion } from "@/contexts/VersionContext";
import { Power } from "lucide-react";
import React from "react";

interface FooterProps {
  signOut: () => void;
}

const Footer: React.FC<FooterProps> = ({ signOut }) => {
  const { activeVersion } = useVersion();

  return (
    <footer className="border-t p-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => signOut()}>
          <Power className="h-4 w-4" />
          SIGN OUT
        </Button>
      </div>
      <span className="text-sm text-muted-foreground">
        {activeVersion.version}
      </span>
    </footer>
  );
};

export default Footer;
