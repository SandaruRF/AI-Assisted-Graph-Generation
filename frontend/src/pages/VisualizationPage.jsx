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
import ChartRenderer from "../components/graphs/ChartRenderer"; // Add this import

const InputSection = ({ userPrompt, setUserPrompt, handleSend }) => (
  <Stack spacing={2}>
    {/* Prompt Suggestions */}
    <Stack direction="row" spacing={1} flexWrap="wrap">
      {[
        "Show sales trends for Q1",
        "Find anomalies in customer behavior",
        "Change title to 'Sales Analysis'", // Add customization examples
        "Make it red",
        "Switch to bar chart",
      ].map((prompt, index) => (
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
  const sessionId =
    location.state?.sessionId ||
    `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`; // Add fallback
  const [userPrompt, setUserPrompt] = useState("");
  const [promptHistory, setPromptHistory] = useState([]);
  const [resultHistory, setResultHistory] = useState([]);
  const [tracesHistory, setTracesHistory] = useState({}); // Keep as object
  const [isFirstSend, setIsFirstSend] = useState(true);
  const scrollContainerRef = useRef(null);
  const lastPromptRef = useRef(null);
  const socketRef = useRef(null);
  const latestIndexRef = useRef(0);

  // Replace single graph state with graph history array
  const [graphHistory, setGraphHistory] = useState([]);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8000/ws");

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

    if (isFirstSend) {
      setIsFirstSend(false);
    }

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
