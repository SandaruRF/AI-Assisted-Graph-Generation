import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const TypewriterWords = ({ text, speed = 10 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Better token splitting that preserves table structure
  const tokens = React.useMemo(() => {
    if (typeof text !== "string") {
      return JSON.stringify(text, null, 2).split(/(\s+)/);
    }

    // Split by lines first to preserve table structure
    const lines = text.split("\n");
    const result = [];

    lines.forEach((line, index) => {
      if (line.includes("|")) {
        // Add entire table row at once
        result.push(line);
        if (index < lines.length - 1) result.push("\n");
      } else {
        // Split non-table lines normally
        const lineTokens = line.split(/(\s+)/);
        result.push(...lineTokens);
        if (index < lines.length - 1) result.push("\n");
      }
    });

    return result;
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
        "& table": {
          borderCollapse: "collapse",
          width: "100%",
          margin: "20px 0",
        },
        "& th, & td": {
          border: "1px solid #ddd",
          padding: "12px",
          textAlign: "left",
        },
        "& th": {
          backgroundColor: "#f2f2f2",
          fontWeight: "bold",
        },
        "& tr:nth-of-type(even)": {
          backgroundColor: "#f9f9f9",
        },
        "& td:last-child": {
          textAlign: "right",
        },
      }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayedText}</ReactMarkdown>

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
