import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  TextField,
  Chip,
  Stack,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import SendIcon from "@mui/icons-material/Send";
import { motion } from "framer-motion";

const InputSection = ({
  userPrompt,
  setUserPrompt,
  handleSend,
  handleStop,
  isLoading = false,
}) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const sendButtonRef = useRef(null);

  const promptSuggestions = [
    "Show sales trends for Q1",
    "Find anomalies in customer behavior",
    "Change title to 'Sales Analysis'",
    "Make it red",
    "Switch to bar chart",
  ];

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserPrompt(transcript);
      setIsListening(false);

      setTimeout(() => {
        if (sendButtonRef.current) {
          sendButtonRef.current.click();
        }
      }, 200);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [setUserPrompt]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && userPrompt.trim() !== "") {
      handleSend();
    }
  };

  return (
    <Stack spacing={2}>
      {/* Suggestions */}
      <Box>
        <Typography variant="subtitle2" gutterBottom color="text.secondary">
          Try one of these:
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {promptSuggestions.map((prompt, idx) => (
            <Chip
              key={idx}
              label={prompt}
              onClick={() => setUserPrompt(prompt)}
              sx={{
                borderRadius: "8px",
                backgroundColor: "#f5f5f5",
                cursor: "pointer",
                ":hover": { backgroundColor: "#e0e0e0" },
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* Input Section */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          borderRadius: "16px",
          backgroundColor: "#ffffff",
        }}
      >
        <Stack spacing={2}>
          <TextField
            fullWidth
            placeholder="What would you like to explore today?"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            variant="outlined"
            InputProps={{
              sx: {
                borderRadius: "8px",
                "& fieldset": { borderColor: "divider" },
              },
            }}
          />

          {/* Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box />

            <Box sx={{ display: "flex", gap: 1 }}>
              {/* Mic Button */}
              <IconButton
                onClick={toggleListening}
                color={isListening ? "error" : "primary"}
                disabled={isLoading}
                aria-label="Toggle voice input"
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "50%",
                  backgroundColor: isListening ? "#ffebee" : "#e3f2fd",
                  ":hover": {
                    backgroundColor: isListening ? "#ffcdd2" : "#bbdefb",
                  },
                  position: "relative",
                  overflow: "visible",
                }}
              >
                {isListening ? (
                  <StopIcon />
                ) : (
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.6, 1],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MicIcon />
                  </motion.div>
                )}
              </IconButton>

              {/* Send Button */}
              <Button
                ref={sendButtonRef}
                onClick={isLoading ? handleStop : handleSend}
                variant="contained"
                disabled={!isLoading && userPrompt.trim() === ""}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  px: 2,
                  minWidth: "40px",
                  backgroundColor: isLoading ? "#ffcdd2" : "#e3f2fd",
                  "&:hover": {
                    backgroundColor: isLoading ? "#ef9a9a" : "#90caf9",
                  },
                }}
              >
                {isLoading ? (
                  <StopIcon sx={{ fontSize: 20 }} />
                ) : (
                  <SendIcon
                    sx={{
                      fontSize: 20,
                      filter:
                        userPrompt.trim() === "" ? "grayscale(100%)" : "none",
                    }}
                  />
                )}
              </Button>
            </Box>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default InputSection;
