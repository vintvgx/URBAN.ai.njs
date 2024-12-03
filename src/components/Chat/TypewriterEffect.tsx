import React, { useState, useEffect } from 'react';
import RichTextRenderer from '@/app/components/RichTextEditor';
import { FormattedContent } from "@/lib/chat/types";

interface TypewriterEffectProps {
  content: string | FormattedContent;
  onComplete?: () => void;
  speed?: number;
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  content,
  onComplete,
  speed = 60
}) => {
  const [displayedContent, setDisplayedContent] = useState<string>('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let currentText = '';
    const fullText = typeof content === 'string' ? content : content.content.raw;
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < fullText.length) {
        currentText += fullText[currentIndex];
        setDisplayedContent(currentText);
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [content, speed, onComplete]);

  if (typeof content === 'object' && isComplete) {
    return <RichTextRenderer content={content} />;
  }

  return <p>{displayedContent}</p>;
};

export default TypewriterEffect; 