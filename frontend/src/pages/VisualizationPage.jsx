import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Chip,
  TextField,
  Button,
} from "@mui/material";
import { FiEdit, FiCopy } from "react-icons/fi";
import TypewriterWords from "../components/chat_interface/TypewriterWords";
import TraceTimeline from "../components/chat_interface/TraceTimeline";
import Graph from "../components/chat_interface/Graph";
import ChartRenderer from "../components/graphs/ChartRenderer";
import InputSection from "../components/chat_interface/InputSection";

import IconButton from "@mui/material/IconButton";
import { speakText } from "../components/TextSpeaker";
import { motion } from "framer-motion";

import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import CopyButton from "../components/CopyClipboard";
import { conversationApi } from "../services/api";

const VisualizationPage = () => {
  const location = useLocation();
  const sessionId =
    location.state?.sessionId ||
    `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`; // Add fallback
  const [userPrompt, setUserPrompt] = useState("");
  // const [promptHistory, setPromptHistory] = useState([]);
  const [hoveredPromptIndex, setHoveredPromptIndex] = useState(null);
  // const [resultHistory, setResultHistory] = useState([]);
  // const [tracesHistory, setTracesHistory] = useState({}); // Keep as object
  const [isFirstSend, setIsFirstSend] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const scrollContainerRef = useRef(null);
  const lastPromptRef = useRef(null);
  const socketRef = useRef(null);
  const latestIndexRef = useRef(0);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [pausedIndex, setPausedIndex] = useState(null);

  useEffect(() => {
    const loadConversationHistory = async () => {
      try {
        setLoadingHistory(true);
        const history = await conversationApi.getConversationHistory(sessionId);
        setConversationHistory(history);

        if (history.length > 0) {
          setIsFirstSend(false);
          latestIndexRef.current = history.length;
        }
      } catch (error) {
        console.error("Failed to load conversation history:", error);
      } finally {
        setLoadingHistory(false);
      }
    };

    loadConversationHistory();
  }, [sessionId]);

  useEffect(() => {
    socketRef.current = new WebSocket("http://localhost:8000/ws");

    socketRef.current.onopen = () => {
      console.log("WebSocket connected successfully");
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socketRef.current.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "update") {
          const currentIndex = latestIndexRef.current;

          // Update traces in database
          const currentEntry = conversationHistory.find(
            (entry) => entry.prompt_index === currentIndex
          );

          if (currentEntry) {
            const updatedTraces = [
              ...(currentEntry.traces || []),
              data.message,
            ];
            await conversationApi.updateTraces(
              sessionId,
              currentIndex,
              updatedTraces
            );

            // Update local state
            setConversationHistory((prev) =>
              prev.map((entry) =>
                entry.prompt_index === currentIndex
                  ? { ...entry, traces: updatedTraces }
                  : entry
              )
            );
          }
        } else if (data.type === "final") {
          setIsLoading(false);
          const result = data.result;

          // Create graph state if needed
          let graphState = null;
          if (result.is_customization) {
            graphState = result.graph_state;
          } else if (result.rearranged_data) {
            graphState = {
              graph_type: result.ranked_graphs[0] || "line",
              x_label: "X Axis",
              y_label: "Y Axis",
              legend_label: "Legend",
              title: "Generated Graph",
              color: "#3366cc",
              data: result.rearranged_data,
              num_numeric: result.num_numeric,
              num_cat: result.num_cat,
              num_temporal: result.num_temporal,
              ranked_graphs: result.ranked_graphs,
              prompt_index: result.prompt_index,
              is_customization: false,
            };
          }

          // Update result in database
          await conversationApi.updateResult(
            sessionId,
            latestIndexRef.current,
            result,
            graphState
          );

          // Update local state
          setConversationHistory((prev) =>
            prev.map((entry) =>
              entry.prompt_index === latestIndexRef.current
                ? { ...entry, result, graph_state: graphState }
                : entry
            )
          );
        } else if (data.type === "error") {
          setIsLoading(false);
          console.error("Error from server:", data.message);

          // Add error to traces
          const currentIndex = latestIndexRef.current;
          const currentEntry = conversationHistory.find(
            (entry) => entry.prompt_index === currentIndex
          );

          if (currentEntry) {
            const updatedTraces = [
              ...(currentEntry.traces || []),
              `Error: ${data.message}`,
            ];
            await conversationApi.updateTraces(
              sessionId,
              currentIndex,
              updatedTraces
            );

            setConversationHistory((prev) =>
              prev.map((entry) =>
                entry.prompt_index === currentIndex
                  ? { ...entry, traces: updatedTraces }
                  : entry
              )
            );
          }
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      socketRef.current?.close();
    };
  }, [sessionId, conversationHistory]);

  const handleSend = async () => {
    if (userPrompt.trim() === "" || isLoading) return;

    if (isFirstSend) {
      setIsFirstSend(false);
    }

    setIsLoading(true);
    const currentIndex = conversationHistory.length;
    latestIndexRef.current = currentIndex;

    try {
      // Save prompt to database first
      await conversationApi.savePrompt(sessionId, currentIndex, userPrompt);

      // Add to local state immediately for UI responsiveness
      const newEntry = {
        id: `temp_${currentIndex}`,
        session_id: sessionId,
        prompt_index: currentIndex,
        user_prompt: userPrompt,
        result: null,
        traces: [],
        graph_state: null,
        created_at: new Date().toISOString(),
      };

      setConversationHistory((prev) => [...prev, newEntry]);

      // Send WebSocket message
      const messageObject = {
        user_prompt: userPrompt,
        session_id: sessionId,
      };

      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.send(JSON.stringify(messageObject));
        setUserPrompt("");
      } else {
        console.error("WebSocket is not open.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Failed to save prompt:", error);
      setIsLoading(false);
    }
  };

  const handleStop = () => {
    console.log("Stopping current request...");

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.close();
    }

    setIsLoading(false);

    // Reconnect WebSocket
    setTimeout(() => {
      socketRef.current = new WebSocket("ws://localhost:8000/ws");
      // Re-initialize WebSocket handlers here (copy the useEffect WebSocket setup)
    }, 1000);
  };

  // Add these handler functions in your VisualizationPage component
  const handleEditPrompt = (index, prompt) => {
    console.log(`Edit prompt at index ${index}:`, prompt);
    // Set the prompt in the input field for editing
    setUserPrompt(prompt);
    // Optional: Scroll to input section
    const inputSection = document.querySelector("[data-input-section]");
    if (inputSection) {
      inputSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleCopyPrompt = async (prompt) => {
    try {
      await navigator.clipboard.writeText(prompt);
      console.log("Prompt copied to clipboard:", prompt);

      // Optional: Show success feedback
      // You can add a snackbar or tooltip here
    } catch (error) {
      console.error("Failed to copy prompt:", error);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = prompt;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
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
  }, [conversationHistory]);

  // Debug logging for result history (from dev branch)
  useEffect(() => {
    console.log("📊 Conversation History Updated:", conversationHistory);
  }, [conversationHistory]);

  // Show loading while fetching history
  if (loadingHistory) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography>Loading conversation history...</Typography>
      </Box>
    );
  }

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
          {conversationHistory.map((entry, index) => (
            <React.Fragment key={entry.id || index}>
              {/* Prompt */}
              <Box
                onMouseEnter={() => setHoveredPromptIndex(index)}
                onMouseLeave={() => setHoveredPromptIndex(null)}
                sx={{
                  position: "relative",
                  width: "fit-content",
                  maxWidth: "66%",
                  // Invisible padding extends hover area
                  p: 4, // Adjust this value to control hover area size
                  m: -2, // Negative margin prevents layout shift
                  borderRadius: "16px", // Slightly larger than Paper's borderRadius
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    "& > .paper-component": {
                      backgroundColor: "#eeeeee",
                      transform: "translateY(-1px)",
                      boxShadow: 1,
                    },
                  },
                }}
              >
                <Paper
                  ref={
                    index === conversationHistory.length - 1
                      ? lastPromptRef
                      : null
                  }
                  className="paper-component" // Add class for targeting
                  sx={{
                    p: 2,
                    borderRadius: "12px",
                    ml: -4,
                    backgroundColor: "#f5f5f5",
                    maxWidth: "100%",
                    alignSelf: "flex-start",
                    transition: "all 0.2s ease-in-out",
                    // Remove hover styles from Paper - now handled by wrapper
                  }}
                >
                  <Typography>{entry.user_prompt}</Typography>
                </Paper>

                {/* Hover Icons */}
                {hoveredPromptIndex === index && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "100%",
                      left: 16,
                      display: "flex",
                      gap: 0.5,
                      mt: -3.5,
                      ml: -2,
                      animation: "fadeIn 0.2s ease-in-out",
                      "@keyframes fadeIn": {
                        from: { opacity: 0, transform: "translateY(-4px)" },
                        to: { opacity: 1, transform: "translateY(0)" },
                      },
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleEditPrompt(index, entry.user_prompt)}
                      sx={{
                        color: "grey.600",
                        backgroundColor: "transparent",
                        borderRadius: "4px",
                        boxShadow: "none",
                        "&:hover": {
                          backgroundColor: "primary.50",
                        },
                        width: 28,
                        height: 28,
                        mr: -0.5,
                      }}
                    >
                      <FiEdit size={14} /> {/* Clean, no built-in styling */}
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={() => handleCopyPrompt(entry.user_prompt)}
                      sx={{
                        color: "grey.600",
                        backgroundColor: "transparent",
                        borderRadius: "4px",
                        boxShadow: "none",
                        "&:hover": {
                          backgroundColor: "success.50",
                        },
                        width: 28,
                        height: 28,
                      }}
                    >
                      <FiCopy size={14} /> {/* Clean, no built-in styling */}
                    </IconButton>
                  </Box>
                )}
              </Box>

              {/* Traces */}
              <TraceTimeline messages={entry.traces || []} />

              {/* Response */}
              {entry.user_prompt && !entry.result && (
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
              {entry.result && (
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
                  <TypewriterWords text={entry.result.response} />

                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mt: 1, alignItems: "center" }}
                  >
                    <CopyButton text={entry.result.response} />

                    {/* Speaker Button */}
                    <IconButton
                      onClick={() =>
                        speakText(
                          entry.result.response,
                          () => {
                            setSpeakingIndex(index);
                            setPausedIndex(null);
                          },
                          () => {
                            setSpeakingIndex(null);
                            setPausedIndex(null);
                          },
                          () => {
                            setPausedIndex(index);
                          },
                          () => {
                            setPausedIndex(null);
                          }
                        )
                      }
                      sx={{ ml: 1, mt: 1 }}
                      size="small"
                      aria-label="Read aloud"
                    >
                      {speakingIndex === index && pausedIndex !== index ? (
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <GraphicEqIcon fontSize="small" />
                        </motion.div>
                      ) : pausedIndex === index ? (
                        <VolumeOffIcon fontSize="small" />
                      ) : (
                        <VolumeUpIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Stack>

                  {/* Graph rendering */}
                  {entry.result.is_customization && entry.graph_state ? (
                    <Box sx={{ width: "100%", mt: 2 }}>
                      <ChartRenderer
                        data={entry.graph_state.data}
                        state={entry.graph_state}
                      />
                    </Box>
                  ) : entry.result.rearranged_data ? (
                    <Graph
                      num_numeric={entry.result.num_numeric}
                      num_cat={entry.result.num_cat}
                      num_temporal={entry.result.num_temporal}
                      types={entry.result.ranked_graphs}
                      data={entry.result.rearranged_data}
                    />
                  ) : null}
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
            {/* <VoiceSection
              userPrompt={userPrompt}
              setUserPrompt={setUserPrompt}
              handleSend={handleSend}
              handleStop={handleStop}
              isLoading={isLoading}
            /> */}
            <InputSection
              userPrompt={userPrompt}
              setUserPrompt={setUserPrompt}
              handleSend={handleSend}
              handleStop={handleStop}
              isLoading={isLoading}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default VisualizationPage;
