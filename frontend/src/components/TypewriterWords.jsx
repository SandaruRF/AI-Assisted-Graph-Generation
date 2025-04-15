import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";

const TypewriterWords = ({ text, onDone }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const words = text.split(" ");

  useEffect(() => {
    if (currentIndex < words.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + words[currentIndex] + " ");
        setCurrentIndex((prev) => prev + 1);
      }, 60);

      return () => clearTimeout(timer);
    }
    if (currentIndex >= words.length) {
      if (onDone) onDone();
    }
  }, [currentIndex, words, onDone]);

  return (
    <Typography
      sx={{
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        lineHeight: 1.6,
      }}
    >
      {displayedText}
    </Typography>
  );
};

export default TypewriterWords;
