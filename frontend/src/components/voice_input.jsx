import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import SendIcon from "@mui/icons-material/Send";

const VoiceSection = ({ userPrompt, setUserPrompt, handleSend }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const sendButtonRef = useRef(null); // <-- Ref for Send Button

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

      // Wait a moment to ensure state updates, then click the button
      setTimeout(() => {
        if (sendButtonRef.current) {
          sendButtonRef.current.click();
        }
      }, 200); // Slight delay ensures input value is updated
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <TextField
        fullWidth
        placeholder="Type or speak your message..."
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
        onKeyPress={handleKeyPress}
      />

      {/* Mic Button */}
      <IconButton
        onClick={toggleListening}
        color={isListening ? "error" : "primary"}
        aria-label="Toggle Voice Input"
      >
        {isListening ? <StopIcon /> : <MicIcon />}
      </IconButton>

      {/* Send Button */}
      <Button
        ref={sendButtonRef} // <-- Attach ref
        variant="contained"
        color="primary"
        endIcon={<SendIcon />}
        onClick={handleSend}
      >
        Send
      </Button>
    </Stack>
  );
};

export default VoiceSection;
