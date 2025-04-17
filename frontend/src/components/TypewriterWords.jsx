import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";

const TypewriterWords = ({ text, onDone }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [flag, setFlag] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const words = text.split(" ");

  useEffect(() => {
    let timer;

    if (currentIndex < words.length) {
      timer = setTimeout(() => {
        setDisplayedText((prev) => prev + words[currentIndex] + " ");
        setCurrentIndex((prev) => prev + 1);
      }, 40);
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
