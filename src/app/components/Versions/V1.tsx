import { VersionProps } from "@/lib/chat/types";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import RichTextRenderer from "../RichTextEditor";

const V1: React.FC<VersionProps> = ({
  chatMessages,
  containerRef,
  inputRef,
  inputValue,
  setInputValue,
  handleMessageSubmission,
  isProcessing,
}) => {
  const [showEnterToSubmit, setShowEnterToSubmit] = useState(false);
  const [inputAreaBottom, setInputAreaBottom] = useState(500);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleMessageSubmission();
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [chatMessages, isProcessing]);

  useEffect(() => {
    if (containerRef.current) {
      const chatContainerHeight = containerRef.current.offsetHeight;
      const screenHeight = window.innerHeight;

      // calculate the new bottom value
      let newBottomValue = screenHeight - chatContainerHeight - 250;
      if (newBottomValue > 500) newBottomValue = 500;
      if (newBottomValue < screenHeight * 0.02)
        newBottomValue = screenHeight * 0.02;

      setInputAreaBottom(newBottomValue);
    }
  }, [chatMessages, isProcessing]);

  useEffect(() => {
    if (!chatMessages && inputValue.length > 2) {
      setShowEnterToSubmit(true);
    } else {
      setShowEnterToSubmit(false);
    }
  }, [inputValue, chatMessages]);

  return (
    <div className="flex-1">
      <div className="chat-wrapper">
        <div className="chat-container" ref={containerRef}>
          {chatMessages?.map((message, index) => (
            <div
              key={index}
              className={cn(
                "message-wrapper",
                message.role === "user"
                  ? "user-message-wrapper user-message-entering"
                  : "bot-message-wrapper bot-message-entering"
              )}>
              <div
                className={cn(
                  message.role === "user" ? "user-message" : "bot-message",
                  "max-w-[80%] p-3 text-lg",
                  message.role === "user"
                    ? "text-muted-foreground italic text-left"
                    : "text-foreground text-left whitespace-pre-wrap"
                )}>
                {typeof message.content === "string"
                  ? message.content
                  : JSON.stringify(message.content)}
                {/* {message.role === "assistant" &&
                typeof message.content === "object" ? (
                  <RichTextRenderer content={message.content} />
                ) : (
                  <p>{message.content.toString()}</p>
                )} */}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="message-wrapper bot-message-wrapper">
              <div className="bot-message">
                <div className="loading-dots">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div
          className="input-area"
          style={{
            position: "absolute",
            bottom: `${inputAreaBottom}px`,
          }}>
          <div className="input-container">
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              autoFocus
              rows={1}
              value={inputValue}
              onKeyDown={handleKeyDown}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="chat-input w-full rounded-xl p-4 outline-none resize-none text-muted-foreground text-lg bg-secondary"
            />
            {showEnterToSubmit && (
              <div
                className={cn(
                  "enter-to-submit",
                  showEnterToSubmit ? "show" : "",
                  "text-muted-foreground"
                )}>
                Press Enter to Submit
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .chat-wrapper {
          max-width: 1200px;
          margin: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          height: 85vh;
          position: relative;
          align-items: center;
        }

        .chat-container {
          flex-direction: column;
          max-height: 70vh;
          overflow-y: auto;
          gap: 15px;
          scrollbar-width: none;
          -ms-overflow-style: none;
          width: 100%;
        }

        .chat-container::-webkit-scrollbar {
          display: none;
        }

        .input-area {
          width: 100%;
          height: auto;
          padding: 10px 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .input-container {
          width: 80%;
          max-width: 800px;
          margin: 0 auto;
          position: relative;
        }

        .message-wrapper {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          flex: 1;
        }

        .user-message-wrapper {
          justify-content: flex-start;
        }

        .bot-message-wrapper {
          justify-content: flex-end;
        }

        .loading-dots span {
          animation: dots 1s infinite;
        }

        .loading-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .loading-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes dots {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        .enter-to-submit {
          opacity: 0;
          position: absolute;
          margin-top: 10px;
          left: 50%;
          transform: translateX(-50%);
          padding: 10px 20px;
          font-size: 14px;
          transition: opacity 0.3s;
        }

        .enter-to-submit.show {
          opacity: 1;
        }

        @keyframes slideFade {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .bot-message-entering {
          animation: slideFade 1.3s forwards;
        }

        @keyframes slideLeftFade {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .user-message-entering {
          animation: slideLeftFade 0.7s forwards;
        }

        @media only screen and (max-width: 600px) {
          .chat-wrapper {
            padding: 10px;
            height: 100vh;
          }

          .chat-input {
            font-size: 18px;
          }

          .input-container {
            width: 95%;
          }
        }

        @media only screen and (min-width: 601px) and (max-width: 1024px) {
          .chat-wrapper {
            padding: 15px;
          }

          .chat-input {
            font-size: 19px;
          }

          .input-container {
            width: 90%;
          }
        }
      `}</style>
    </div>
  );
};

export default V1;
