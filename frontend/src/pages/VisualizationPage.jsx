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

const VisualizationPage = () => {
  const location = useLocation();
  const sessionId =
    location.state?.sessionId ||
    `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`; // Add fallback
  const [userPrompt, setUserPrompt] = useState("");
  const [promptHistory, setPromptHistory] = useState([]);
  const [hoveredPromptIndex, setHoveredPromptIndex] = useState(null);
  const [resultHistory, setResultHistory] = useState([]);
  const [tracesHistory, setTracesHistory] = useState({}); // Keep as object
  const [isFirstSend, setIsFirstSend] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const scrollContainerRef = useRef(null);
  const lastPromptRef = useRef(null);
  const socketRef = useRef(null);
  const latestIndexRef = useRef(0);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [pausedIndex, setPausedIndex] = useState(null);

  // Replace single graph state with graph history array
  const [graphHistory, setGraphHistory] = useState([]);

  useEffect(() => {
    socketRef.current = new WebSocket("http://localhost:8000/ws");

    socketRef.current.onopen = () => {
      console.log("WebSocket connected successfully");
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "update") {
          const currentIndex = latestIndexRef.current;
          setTracesHistory((prev) => ({
            ...prev,
            [currentIndex]: [...(prev[currentIndex] || []), data.message],
          }));
        } else if (data.type === "final") {
          setIsLoading(false);
          const result = data.result;
          console.log("Received final result:", result); // Debug log

          // Check if this is a customization response
          if (result.is_customization) {
            console.log("Processing customization response:", result); // Debug log
            // Add the customized graph state to history
            setGraphHistory((prev) => {
              const newHistory = [...prev];
              // Ensure we have enough space in the array
              while (newHistory.length <= result.prompt_index) {
                newHistory.push(null);
              }
              newHistory[result.prompt_index] = result.graph_state;
              console.log("Updated graph history:", newHistory); // Debug log
              return newHistory;
            });
          } else {
            // Regular graph generation - create new graph state
            if (result.rearranged_data) {
              const newGraphState = {
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
                prompt_index: result.prompt_index, // Use prompt_index from backend
                is_customization: false,
              };

              // Add the new graph state to history
              setGraphHistory((prev) => {
                const newHistory = [...prev];
                // Ensure we have enough space in the array
                while (newHistory.length <= result.prompt_index) {
                  newHistory.push(null);
                }
                newHistory[result.prompt_index] = newGraphState;
                return newHistory;
              });
            }
          }

          setResultHistory((prev) => [...prev, result]);
        } else if (data.type === "error") {
          setIsLoading(false);
          console.error("Error from server:", data.message);
          const currentIndex = latestIndexRef.current;
          setTracesHistory((prev) => ({
            ...prev,
            [currentIndex]: [
              ...(prev[currentIndex] || []),
              `Error: ${data.message}`,
            ],
          }));
        } else {
          // Handle legacy format
          if (data.result) {
            setResultHistory((prev) => [...prev, data.result]);
          }
          if (data.message) {
            const currentIndex = latestIndexRef.current;
            setTracesHistory((prev) => ({
              ...prev,
              [currentIndex]: [...(prev[currentIndex] || []), data.message],
            }));
          }
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Error parsing WebSocket message:", error);
        const currentIndex = latestIndexRef.current;
        setTracesHistory((prev) => ({
          ...prev,
          [currentIndex]: [
            ...(prev[currentIndex] || []),
            `Error: ${error.message}`,
          ],
        }));
      }
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      socketRef.current?.close();
    };
  }, []); // Remove resultHistory.length dependency to prevent WebSocket recreation

  const handleSend = async () => {
    if (userPrompt.trim() === "") return;

    if (isLoading) return;

    if (isFirstSend) {
      setIsFirstSend(false);
    }

    setIsLoading(true);

    const messageObject = {
      user_prompt: userPrompt,
      session_id: sessionId,
    };

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(messageObject));

      setPromptHistory((prev) => {
        const newLength = prev.length;
        latestIndexRef.current = newLength;
        return [...prev, userPrompt];
      });
      setUserPrompt("");
    } else {
      console.error("WebSocket is not open.");
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
  }, [promptHistory]);

  // Helper function to get graph state for a specific index
  const getGraphStateForIndex = (index) => {
    console.log(`getGraphStateForIndex called with index: ${index}`);
    console.log(`graphHistory length: ${graphHistory.length}`);
    console.log(`graphHistory:`, graphHistory);
    return graphHistory[index] || null;
  };

  // Helper function to get graph state by prompt index
  const getGraphStateByPromptIndex = (promptIndex) => {
    console.log(
      `getGraphStateByPromptIndex called with promptIndex: ${promptIndex}`
    );
    console.log(`graphHistory length: ${graphHistory.length}`);
    console.log(`graphHistory:`, graphHistory);
    return graphHistory[promptIndex] || null;
  };

  // Debug logging for result history (from dev branch)
  useEffect(() => {
    console.log("📊 Result History Updated:", resultHistory);
  }, [resultHistory]);

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
                    index === promptHistory.length - 1 ? lastPromptRef : null
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
                  <Typography>{prompt}</Typography>
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
                      onClick={() => handleEditPrompt(index, prompt)}
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
                      onClick={() => handleCopyPrompt(prompt)}
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

                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mt: 1, alignItems: "center" }}
                  >
                    <CopyButton text={resultHistory[index].response} />

                    {/* Speaker Button */}
                    <IconButton
                      onClick={() =>
                        speakText(
                          resultHistory[index].response,
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

                  {/* Get the graph state for this specific index */}
                  {(() => {
                    const result = resultHistory[index];

                    // Use prompt_index from result if available, otherwise fall back to array index
                    const graphStateIndex =
                      result.prompt_index !== undefined
                        ? result.prompt_index
                        : index;
                    const graphState =
                      getGraphStateByPromptIndex(graphStateIndex);

                    console.log(`Rendering for index ${index}:`, {
                      result,
                      graphStateIndex,
                      graphState,
                      isCustomization: result.is_customization,
                    });

                    if (result.is_customization) {
                      // Customization response - show updated chart using ChartRenderer
                      console.log("Showing ChartRenderer for customization");
                      return graphState && graphState.data ? (
                        <Box sx={{ width: "100%", mt: 2 }}>
                          <ChartRenderer
                            data={graphState.data}
                            state={graphState}
                          />
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            width: "100%",
                            mt: 2,
                            p: 2,
                            backgroundColor: "#f0f0f0",
                          }}
                        >
                          <Typography>
                            Graph state not available for customization
                          </Typography>
                          <Typography variant="body2">
                            Graph state index: {graphStateIndex}
                          </Typography>
                          <Typography variant="body2">
                            Graph state: {JSON.stringify(graphState)}
                          </Typography>
                        </Box>
                      );
                    } else {
                      // Regular graph generation - show original Graph component
                      console.log(
                        "Showing Graph component for regular generation"
                      );
                      return (
                        <Graph
                          num_numeric={result.num_numeric}
                          num_cat={result.num_cat}
                          num_temporal={result.num_temporal}
                          types={result.ranked_graphs}
                          data={result.rearranged_data}
                        />
                      );
                    }
                  })()}
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
