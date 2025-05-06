import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";

const TypewriterWords = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [flag, setFlag] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Convert anything passed into a readable string
  const safeText = React.useMemo(() => {
    try {
      if (typeof text === "string") return text;
      return JSON.stringify(text, null, 2); // pretty print JSON
    } catch {
      return String(text);
    }
  });
  const words = safeText.split(" ");

  useEffect(() => {
    let timer;

    if (currentIndex < words.length) {
      timer = setTimeout(() => {
        setDisplayedText((prev) => prev + words[currentIndex] + " ");
        setCurrentIndex((prev) => prev + 1);
      }, 20);
    } else {
      setFlag(true);
    }

    return () => clearTimeout(timer);
  }, [currentIndex, words]);

  return (
    <Typography
      sx={{
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        lineHeight: 1.6,
      }}
    >
      {displayedText}
      {"\n"}
      {!flag && (
        <video
          ref={(el) => {
            if (el) el.playbackRate = 2;
          }}
          src="/assets/loading_animation_1.webm"
          autoPlay
          loop
          muted
          playsInline
          style={{ width: "40px", height: "auto" }}
        />
      )}
    </Typography>
  );
};

export default TypewriterWords;
