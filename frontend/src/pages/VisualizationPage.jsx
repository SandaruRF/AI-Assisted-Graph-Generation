import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  TextField,
  Chip,
  Stack,
  Button,
  Typography,
} from "@mui/material";

const InputSection = ({ userPrompt, setUserPrompt, handleSend }) => (
  <Stack spacing={2}>
    {/* Prompt Suggestions */}
    <Stack direction="row" spacing={1} flexWrap="wrap">
      {["Show sales trends for Q1", "Find anomalies in customer behavior"].map(
        (prompt, index) => (
          <Chip
            key={index}
            label={prompt}
            onClick={() => setUserPrompt(prompt)}
            sx={{ borderRadius: "8px", mb: 1 }}
          />
        )
      )}
    </Stack>

    {/* Input & Send */}
    <Paper
      sx={{
        p: 2,
        borderRadius: "16px",
        boxShadow: 3,
      }}
    >
      <TextField
        fullWidth
        placeholder="What would you like to explore today?"
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && userPrompt.trim() !== "") {
            handleSend();
          }
        }}
        variant="outlined"
        InputProps={{
          sx: {
            borderRadius: "8px",
            "& fieldset": { borderColor: "divider" },
          },
        }}
      />

      {/* Send Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          onClick={handleSend}
          variant="contained"
          disabled={userPrompt.trim() === ""}
          sx={{
            mt: 2,
            borderRadius: "8px",
            textTransform: "none",
            transition: "all 0.3s ease-in-out",
            opacity: userPrompt.trim() === "" ? 0.7 : 1,
            transform: userPrompt.trim() === "" ? "scale(0.98)" : "scale(1)",
          }}
        >
          Send
        </Button>
      </Box>
    </Paper>
  </Stack>
);

const VisualizationPage = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const [promptHistory, setPromptHistory] = useState([]);
  const [resultHistory, setResultHistory] = useState([]);
  const [isFirstSend, setIsFirstSend] = useState(true);
  const bottomRef = useRef(null);

  const handleSend = async () => {
    if (userPrompt.trim() === "") return;

    if (isFirstSend) {
      setIsFirstSend(false);
    }

    setPromptHistory((prev) => [...prev, userPrompt]);
    setUserPrompt("");

    try {
      const response = await axios.post(
        "http://localhost:8000/send-user-prompt",
        {
          user_prompt: userPrompt,
        }
      );
      const newResult = response.data.result;
      console.log("Response from backend:", newResult);
      setResultHistory((prev) => [...prev, newResult]);
    } catch (error) {
      console.log("Error sending user prompt:", error);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [promptHistory, resultHistory]);

  return (
    <>
      {isFirstSend && (
        <Box sx={{ textAlign: "center", mt: 25 }}>
          <Typography variant="h4" component="h1">
            Hi there! 👋 I'm your Data Assistant.
          </Typography>
        </Box>
      )}

      {/* History */}
      <Box
        sx={{
          overflowY: "auto",
          maxHeight: "77vh",
          width: "100%",
          marginTop: 2,
        }}
      >
        <Stack
          spacing={2}
          sx={{
            mb: 3,
            px: 2,
            maxWidth: 800,
            mx: "auto",
          }}
        >
          {promptHistory.map((prompt, index) => (
            <React.Fragment key={index}>
              {/* Prompt */}
              <Paper
                key={index}
                sx={{
                  p: 2,
                  borderRadius: "12px",
                  backgroundColor: "#f5f5f5",
                  maxWidth: "100%",
                  alignSelf: "flex-start",
                }}
              >
                <Typography>{prompt}</Typography>
              </Paper>

              {/* Response */}
              {resultHistory[index] && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      backgroundColor: "#e8f4f8",
                      maxWidth: "100%",
                      marginBottom: 3,
                    }}
                  >
                    <Typography>{resultHistory[index].response}</Typography>
                  </Paper>
                </Box>
              )}
            </React.Fragment>
          ))}
          <div ref={bottomRef} />
        </Stack>

        {/* Input section */}
        <Box
          sx={{
            position: isFirstSend ? "sticky" : "fixed",
            bottom: isFirstSend === 0 ? 20 : 0,
            zIndex: 1,
            left: 0,
            right: 0,
            backgroundColor: "background.paper",
            pb: 2,
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Box sx={{ width: "100%", maxWidth: "700px" }}>
            <InputSection
              userPrompt={userPrompt}
              setUserPrompt={setUserPrompt}
              handleSend={handleSend}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default VisualizationPage;
