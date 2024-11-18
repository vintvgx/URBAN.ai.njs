import React from "react";

export default function AuthLoadingAnimation() {
  return (
    <div className="text-2xl mb-8 text-muted-foreground flex items-center gap-2">
      <div className="flex space-x-1">
        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></span>
      </div>
    </div>
  );
}
