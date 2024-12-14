export const getFontFamily = (font: string): string => {
    const fontMap: Record<string, string> = {
      'Arial': 'Arial, Helvetica, sans-serif',
      'Arial Black': '"Arial Black", Gadget, sans-serif',
      'Mono': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      'System Default': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    };
    
    return fontMap[font] || fontMap['System Default'];
  };