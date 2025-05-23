import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Chip,
  Stack,
  Button,
  Typography,
} from "@mui/material";
import TypewriterWords from "../components/chat_interface/TypewriterWords";
import TraceTimeline from "../components/chat_interface/TraceTimeline";
import Graph from "../components/chat_interface/Graph";

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
  const location = useLocation();
  const sessionId = location.state?.sessionId;
  const [userPrompt, setUserPrompt] = useState("");
  const [promptHistory, setPromptHistory] = useState([]);
  const [resultHistory, setResultHistory] = useState([]);
  const [tracesHistory, setTracesHistory] = useState({});
  const [isFirstSend, setIsFirstSend] = useState(true);
  const scrollContainerRef = useRef(null);
  const lastPromptRef = useRef(null);
  const socketRef = useRef(null);
  const latestIndexRef = useRef(0);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8000/ws");

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // console.log("Received message:", data); // For debugging

        if (data.type === "update") {
          const currentIndex = latestIndexRef.current;
          // console.log("Current latest index:", currentIndex);
          setTracesHistory((prev) => ({
            ...prev,
            [currentIndex]: [...(prev[currentIndex] || []), data.message],
          }));
        } else if (data.type === "final") {
          // console.log("Final result received:", data.result);
          setResultHistory((prev) => [...prev, data.result]);
        } else if (data.type === "error") {
          console.error("Error from server:", data.message);
          setTracesHistory((prev) => [...prev, `Error: ${data.message}`]);
        } else {
          // Handle legacy format (your original format)
          if (data.result) {
            setResultHistory((prev) => [...prev, data.result]);
          }
          if (data.message) {
            setTracesHistory((prev) => [...prev, data.message]);
          }
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

  const handleSend = async () => {
    if (userPrompt.trim() === "") return;

    if (isFirstSend) {
      setIsFirstSend(false);
    }

    // Create the message object similar to what you were sending with Axios
    const messageObject = {
      user_prompt: userPrompt,
      session_id: sessionId,
    };

    // Convert the object to a JSON string for WebSocket transmission
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(messageObject));

      // Add the user prompt to history
      setPromptHistory((prev) => {
        const newLength = prev.length;
        // Update both the state and the ref
        latestIndexRef.current = newLength;
        return [...prev, userPrompt];
      });
      setUserPrompt("");
    } else {
      console.error("WebSocket is not open.");
    }
  };

  useEffect(() => {
    if (lastPromptRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const lastPrompt = lastPromptRef.current;

      const containerTop = container.getBoundingClientRect().top;
      const promptTop = lastPrompt.getBoundingClientRect().top;
      const scrollOffset = promptTop - containerTop - 0;

      container.scrollBy({
        top: scrollOffset,
        behavior: "smooth",
      });
    }
  }, [promptHistory]);

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
        ref={scrollContainerRef}
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
                ref={index === promptHistory.length - 1 ? lastPromptRef : null}
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

              {/* Traces */}
              <TraceTimeline messages={tracesHistory[index] || []} />

              {/* Response */}
              {promptHistory[index] && !resultHistory[index] && (
                <Box sx={{ pl: 1 }}>
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
                </Box>
              )}
              {resultHistory[index] && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    width: "100%",
                    p: 1,
                    pb: 4,
                  }}
                >
                  <TypewriterWords text={resultHistory[index].response} />
                  <Graph
                    num_numeric={resultHistory[index].num_numeric}
                    num_cat={resultHistory[index].num_cat}
                    num_temporal={resultHistory[index].num_temporal}
                    types={resultHistory[index].ranked_graphs}
                    data={resultHistory[index].rearranged_data}
                  />
                </Box>
              )}
            </React.Fragment>
          ))}
          {/* Spacer */}
          <Box sx={{ height: isFirstSend ? 0 : "63vh" }} />
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