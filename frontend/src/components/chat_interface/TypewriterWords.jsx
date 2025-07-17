import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";

// A simple CSS-in-JS for the blinking cursor
const cursorStyle = {
  display: "inline-block",
  width: "10px",
  height: "1.2rem", // Match line height
  backgroundColor: "currentColor",
  animation: "blink 1s step-end infinite",
  "@keyframes blink": {
    "from, to": { opacity: 1 },
    "50%": { opacity: 0 },
  },
  verticalAlign: "bottom", // Align with text
};

const TypewriterWords = ({ text, speed = 15 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Use a more robust split to handle newlines and multiple spaces
  const tokens = React.useMemo(() => {
    if (typeof text !== "string") {
      return JSON.stringify(text, null, 2).split(/(\s+)/);
    }
    // This regex splits by spaces and newlines, keeping them in the array
    // which is crucial for preserving Markdown structure.
    return text.split(/(\s+)/);
  }, [text]);

  const isTyping = currentIndex < tokens.length;

  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + tokens[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, tokens, isTyping, speed]);

  return (
    <Typography
      component="div"
      sx={{
        wordBreak: "break-word",
        lineHeight: 1.6,
      }}
    >
      {/* This part remains the same and works correctly */}
      <ReactMarkdown>{displayedText}</ReactMarkdown>

      {/* 
        Render the video directly as a JSX element.
        It's now a sibling to the ReactMarkdown component.
      */}
      {isTyping && (
        <video
          ref={(el) => {
            if (el) el.playbackRate = 2;
          }}
          src="/assets/loading_animation_1.webm"
          autoPlay
          loop
          muted
          playsInline
          style={{ width: "40px", height: "auto", verticalAlign: "middle" }}
        />
      )}
    </Typography>
  );
};

export default TypewriterWords;
