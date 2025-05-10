import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";

const TraceTimeline = ({ messages = [] }) => {
  // Track which messages have been seen already
  const [animatedMessages, setAnimatedMessages] = useState([]);

  useEffect(() => {
    // Only animate new messages that haven't been seen before
    if (messages.length > animatedMessages.length) {
      const newMessages = messages.slice(animatedMessages.length);

      // Add new messages one by one with a delay
      let timeoutIds = [];
      newMessages.forEach((msg, idx) => {
        const timeoutId = setTimeout(() => {
          setAnimatedMessages((prev) => [
            ...prev,
            {
              content: msg,
              isNew: true, // Mark as new for animation
            },
          ]);

          // After animation completes, remove the "new" flag
          const removeNewFlag = setTimeout(() => {
            setAnimatedMessages((prev) =>
              prev.map((item, i) =>
                i === animatedMessages.length + idx
                  ? { ...item, isNew: false }
                  : item
              )
            );
          }, 500); // Match animation duration

          timeoutIds.push(removeNewFlag);
        }, idx * 150);

        timeoutIds.push(timeoutId);
      });

      return () => {
        timeoutIds.forEach(clearTimeout);
      };
    }
  }, [messages, animatedMessages.length]);

  if (!messages || messages.length === 0) return null;

  return (
    <Box>
      <Timeline
        position="right"
        sx={{
          "& .MuiTimelineItem-missingOppositeContent:before": {
            flex: 0,
            padding: 0,
          },
          m: 0,
          p: 1,
          "& .MuiTimelineItem-root": {
            minHeight: "auto",
            mb: 0,
          },
          backgroundColor: "#edf1f2",
        }}
      >
        {animatedMessages.map((item, idx) => (
          <TimelineItem key={idx}>
            <TimelineSeparator
              sx={{
                alignItems: "flex-start",
                mt: "0px",
              }}
            >
              <TimelineDot
                sx={{
                  m: 0,
                  p: 0,
                  width: "6px",
                  height: "6px",
                  boxShadow: "none",
                  borderWidth: 0,
                  backgroundColor: "#00ccff",
                  transform: "translateY(0px)",
                  alignSelf: "center",
                  ...(item.isNew && {
                    animation: "fadeIn 0.5s ease",
                  }),
                }}
              />
              {idx < animatedMessages.length - 1 && (
                <TimelineConnector
                  sx={{
                    minHeight: "22px",
                    backgroundColor: "#00ccff",
                    width: "2px",
                    transform: "translateY(0px)",
                    flexGrow: 1,
                    ml: "2px",
                    ...(item.isNew && {
                      animation: "growIn 0.5s ease",
                    }),
                  }}
                />
              )}
            </TimelineSeparator>
            <TimelineContent
              sx={{
                color: "#00ccff",
                p: 0.75,
                ml: 0.5,
                fontSize: "0.875rem",
                py: 0.5,
                display: "flex",
                alignItems: "flex-start",
                mt: "-10px",
                mb: "8px",
                ...(item.isNew && {
                  animation: "fadeIn 0.5s ease",
                }),
              }}
            >
              {item.content}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>

      {/* Add keyframes for animations */}
      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes growIn {
          from { height: 0; opacity: 0; }
          to { height: 22px; opacity: 1; }
        }
        `}
      </style>
    </Box>
  );
};

export default TraceTimeline;

// import React from "react";
// import { Box } from "@mui/material";
// import {
//   Timeline,
//   TimelineItem,
//   TimelineSeparator,
//   TimelineConnector,
//   TimelineContent,
//   TimelineDot,
// } from "@mui/lab";

// const TraceTimeline = ({ messages = [] }) => {
//   if (!messages || messages.length === 0) return null;

//   return (
//     <Box>
//       <Timeline
//         position="right"
//         sx={{
//           // remove the phantom spacer on the left
//           "& .MuiTimelineItem-missingOppositeContent:before": {
//             flex: 0,
//             padding: 0,
//           },
//           // Make the timeline more compact
//           m: 0,
//           p: 1,
//           "& .MuiTimelineItem-root": {
//             minHeight: "auto",
//             mb: 0, // Reduced margin between items
//           },
//           backgroundColor: "#edf1f2",
//         }}
//       >
//         {messages.map((msg, idx) => (
//           <TimelineItem key={idx}>
//             <TimelineSeparator
//               sx={{
//                 alignItems: "flex-start",
//                 mt: "0px",
//               }}
//             >
//               <TimelineDot
//                 sx={{
//                   m: 0, // No margin
//                   p: 0, // No padding
//                   width: "6px",
//                   height: "6px",
//                   boxShadow: "none", // Remove shadow
//                   borderWidth: 0, // Remove border
//                   backgroundColor: "#00ccff", // Match color with content
//                   transform: "translateY(0px)", // Shift to align with connector
//                   // Position at bottom of content
//                   alignSelf: "center",
//                 }}
//               />
//               {idx < messages.length - 1 && (
//                 <TimelineConnector
//                   sx={{
//                     minHeight: "22px",
//                     backgroundColor: "#00ccff", // Match color with dot
//                     width: "2px", // Width of the line
//                     transform: "translateY(0px)", // Shift to align with connector
//                     // Grow from bottom
//                     flexGrow: 1,
//                     ml: "2px",
//                   }}
//                 />
//               )}
//             </TimelineSeparator>
//             <TimelineContent
//               sx={{
//                 color: "#00ccff",
//                 p: 0.75,
//                 ml: 0.5,
//                 fontSize: "0.875rem",
//                 py: 0.5,
//                 // Ensure content has proper alignment
//                 display: "flex",
//                 alignItems: "flex-start",
//                 mt: "-10px",
//                 mb: "8px",
//               }}
//             >
//               {msg}
//             </TimelineContent>
//           </TimelineItem>
//         ))}
//       </Timeline>
//     </Box>
//   );
// };

// export default TraceTimeline;
