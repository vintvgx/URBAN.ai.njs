import { Button } from "@/components/ui/button";
import { Power } from "lucide-react";
import Link from "next/link";
import React from "react";

interface FooterProps {
  signOut: () => void;
}

const Footer: React.FC<FooterProps> = ({ signOut }) => {
  return (
    <footer className="border-t p-4 flex items-center justify-center gap-8">
      <Link href="/">
        <Button variant="outline" className="font-mono">
          Alt View
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        onClick={() => signOut()}>
        <Power className="h-4 w-4" />
        SIGN OUT
      </Button>
      {/* <Link href="/">
        <Button variant="ghost" size="sm" className="gap-2">
          <Info className="h-4 w-4" />
          ALT VIEW
        </Button>
      </Link> */}
    </footer>
  );
};

export default Footer;
