import React from "react";
import { Box, Paper, TextField, Chip, Stack, Button } from "@mui/material";

const InputSection = ({
  userPrompt,
  setUserPrompt,
  handleSend,
  handleStop,
  isLoading = false,
}) => {
  const promptSuggestions = [
    "Show sales trends for Q1",
    "Find anomalies in customer behavior",
    "Change title to 'Sales Analysis'",
    "Make it red",
    "Switch to bar chart",
  ];

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && userPrompt.trim() !== "") {
      handleSend();
    }
  };

  return (
    <Stack spacing={2}>
      {/* Prompt Suggestions */}
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {promptSuggestions.map((prompt, index) => (
          <Chip
            key={index}
            label={prompt}
            onClick={() => setUserPrompt(prompt)}
            sx={{ borderRadius: "8px", mb: 1 }}
          />
        ))}
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
          onKeyDown={handleKeyDown}
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
            onClick={isLoading ? handleStop : handleSend}
            variant="contained"
            disabled={!isLoading && userPrompt.trim() === ""}
            sx={{
              mt: 2,
              borderRadius: "8px",
              textTransform: "none",
              transition: "all 0.3s ease-in-out",
              opacity: userPrompt.trim() === "" ? 0.7 : 1,
              transform: userPrompt.trim() === "" ? "scale(0.98)" : "scale(1)",
              minWidth: "auto", // Prevent button from being too wide
              px: 2, // Add some padding
              // backgroundColor: "#e9f0ffff", // Custom background color
              // "&:hover": {
              //   backgroundColor: "#e9f0ffff", // Darker on hover
              // },
              backgroundColor: isLoading ? "#ffe9e9ff" : "#e9f0ffff",
            }}
          >
            <img
              src={
                isLoading ? "/assets/stop-icon.png" : "/assets/paper-plane.png"
              }
              alt={isLoading ? "Stop" : "Send"}
              style={{
                width: 18,
                height: 18,
                filter:
                  !isLoading && userPrompt.trim() === ""
                    ? "grayscale(100%)"
                    : "none", // Grey out when disabled
              }}
            />
          </Button>
        </Box>
      </Paper>
    </Stack>
  );
};

export default InputSection;
