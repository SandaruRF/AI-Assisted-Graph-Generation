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
  const [result, setResult] = useState(null);
  const bottomRef = useRef(null);

  const handleSend = async () => {
    if (userPrompt.trim() === "") return;

    try {
      const response = await axios.post(
        "http://localhost:8000/send-user-prompt",
        {
          user_prompt: userPrompt,
        }
      );
      console.log("Response from backend:", response.data);
      setResult(response.data.result);
      setPromptHistory((prev) => [...prev, userPrompt]);
      setUserPrompt("");
    } catch (error) {
      console.log("Error sending user prompt:", error);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [promptHistory]);

  return (
    <>
      {promptHistory.length === 0 && (
        <Box sx={{ textAlign: "center", mt: 25 }}>
          <Typography variant="h4" component="h1">
            Hi there! 👋 I'm your Data Assistant.
          </Typography>
        </Box>
      )}

      <Box sx={{ p: 4, maxWidth: 1200, mx: "auto" }}>
        {/* Prompt History */}
        <Stack spacing={2} sx={{ mb: 3, maxHeight: "60vh", overflowY: "auto" }}>
          {promptHistory.map((prompt, index) => (
            <Paper
              key={index}
              sx={{
                p: 2,
                borderRadius: "12px",
                backgroundColor: "#f5f5f5",
                maxWidth: "80%",
                alignSelf: "flex-start",
              }}
            >
              <Typography>{prompt}</Typography>
            </Paper>
          ))}
          <div ref={bottomRef} />
        </Stack>

        {/* Display the results */}
        {result && (
          <Paper
            sx={{
              p: 2,
              borderRadius: "12px",
              backgroundColor: "#e8f4f8",
              maxWidth: "80%",
              marginTop: 2,
            }}
          >
            <Typography variant="h6">Result:</Typography>
            {result.response && <Typography>{result.response}</Typography>}
            {result.intents && result.intents.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Identified Intents:</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  {result.intents.map((intent, index) => (
                    <Chip
                      key={index}
                      label={intent}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Paper>
        )}

        {/* Input section */}
        <Box
          sx={{
            position: promptHistory.length === 0 ? "sticky" : "fixed",
            bottom: promptHistory.length === 0 ? 20 : 0,
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
