"use client";
import * as React from "react";

type Version = {
  name: string;
  //   logo: React.ElementType;
  version: string;
};

type VersionContextType = {
  activeVersion: Version;
  setActiveVersion: (version: Version) => void;
};

export const VersionContext = React.createContext<
  VersionContextType | undefined
>(undefined);

export function VersionProvider({
  children,
  initialVersion,
}: {
  children: React.ReactNode;
  initialVersion: Version;
}) {
  const [activeVersion, setActiveVersion] = React.useState(initialVersion);

  return (
    <VersionContext.Provider value={{ activeVersion, setActiveVersion }}>
      {children}
    </VersionContext.Provider>
  );
}

export function useVersion() {
  const context = React.useContext(VersionContext);
  if (context === undefined) {
    throw new Error("useVersion must be used within a VersionProvider");
  }
  return context;
}
