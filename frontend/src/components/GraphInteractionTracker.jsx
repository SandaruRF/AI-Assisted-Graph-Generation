import React, { useEffect, useRef, useState } from "react";


const GraphInteractionTracker = ({
  graphName,
  containerRef,
  externalExportCount = 0,
  externalLikeCount = 0,
  externalDislikeCount = 0,
}) => {
  const [timeSpentSec, setTimeSpentSec] = useState(0);
  const [exportCount, setExportCount] = useState(externalExportCount);
  const [likeCount, setLikeCount] = useState(externalLikeCount);
  const [dislikeCount, setDislikeCount] = useState(externalDislikeCount);
  const [panCount, setPanCount] = useState(0);
  const [isActive, setIsActive] = useState(false);


  const totalTimeRef = useRef(0);
  const lastActiveTimeRef = useRef(null);


  // Sync external counts when they change
  useEffect(() => {
    setExportCount(externalExportCount);
  }, [externalExportCount]);


  useEffect(() => {
    setLikeCount(externalLikeCount);
  }, [externalLikeCount]);


  useEffect(() => {
    setDislikeCount(externalDislikeCount);
  }, [externalDislikeCount]);


  // Track mouse enter/leave to measure active time
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;


const onMouseEnter = () => {
      setIsActive(true);
      lastActiveTimeRef.current = Date.now();
    };
    const onMouseLeave = () => {
      setIsActive(false);
      if (lastActiveTimeRef.current) {
        totalTimeRef.current += Date.now() - lastActiveTimeRef.current;
        lastActiveTimeRef.current = null;
      }
    };


    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mouseleave", onMouseLeave);


    return () => {
      container.removeEventListener("mouseenter", onMouseEnter);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [containerRef]);


  // Update time spent every second while active
  useEffect(() => {
    const interval = setInterval(() => {
      if (isActive && lastActiveTimeRef.current) {
        const elapsed = Date.now() - lastActiveTimeRef.current;
        setTimeSpentSec(Math.floor((totalTimeRef.current + elapsed) / 1000));
      } else {
        setTimeSpentSec(Math.floor(totalTimeRef.current / 1000));
      }
    }, 1000);


    return () => clearInterval(interval);
  }, [isActive]);


// Track pan/zoom interactions
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;


    let isDragging = false;


    const onWheel = () => setPanCount((c) => c + 1);
    const onMouseDown = () => (isDragging = true);
    const onMouseUp = () => {
      if (isDragging) {
        setPanCount((c) => c + 1);
        isDragging = false;
      }
    };


    container.addEventListener("wheel", onWheel);
    container.addEventListener("mousedown", onMouseDown);
    container.addEventListener("mouseup", onMouseUp);


    return () => {
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("mousedown", onMouseDown);
      container.removeEventListener("mouseup", onMouseUp);
    };
  }, [containerRef]);


  // Track clicks on Plotly's default export button (optional)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;


    const onClick = (event) => {
      const target = event.target.closest("a, button");
      if (!target) return;


      const title = target.getAttribute("title");
      if (title && title.toLowerCase().includes("download plot as a png")) {
        setExportCount((c) => c + 1);
      }
    };


    container.addEventListener("click", onClick);


    return () => container.removeEventListener("click", onClick);
  }, [containerRef]);


  // Send interaction data to backend on unload or visibility change
  useEffect(() => {
    const sendData = () => {
      let exactTimeSpentMs = totalTimeRef.current;
      if (isActive && lastActiveTimeRef.current) {
        exactTimeSpentMs += Date.now() - lastActiveTimeRef.current;
      }
      const exactTimeSpentSec = Math.floor(exactTimeSpentMs / 1000);


      fetch("http://localhost:8000/api/interaction", {
        method: "POST",
        headers: { "Content-Type": "application/json",
     "Authorization": `Bearer ${localStorage.getItem("token")}`
 },
        body: JSON.stringify({
          graph_name: graphName,
          time_spent: exactTimeSpentSec,
          export_count: exportCount,
          like_count: likeCount,
          dislike_count: dislikeCount,
          pan_count: panCount,
        }),
        keepalive: true,
      }).catch(() => {});
    };


 const handleBeforeUnload = () => {
      if (isActive && lastActiveTimeRef.current) {
        totalTimeRef.current += Date.now() - lastActiveTimeRef.current;
        lastActiveTimeRef.current = null;
      }
      sendData();
    };


const handleVisibilityChange = () => {
if (document.visibilityState === "hidden") {
        if (isActive && lastActiveTimeRef.current) {
          totalTimeRef.current += Date.now() - lastActiveTimeRef.current;
          lastActiveTimeRef.current = null;
        }
        sendData();
      } else {
        if (isActive) {
          lastActiveTimeRef.current = Date.now();
        }
      }
    };


    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);


    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [
    isActive,
    exportCount,
    likeCount,
    dislikeCount,
    panCount,
    graphName,
  ]);


  // Display interaction stats below graph
  return (
    <div
      style={{
        marginTop: 10,
        padding: 8,
        border: "1px solid #ddd",
        borderRadius: 6,
        fontFamily: "Arial, sans-serif",
        fontSize: 13,
        maxWidth: 320,
        backgroundColor: "#f9f9f9",
        color: "#333",
      }}
      title="Graph interaction summary"
    >
      <div><strong>{graphName}</strong> Interaction Summary</div>
      <div>Time spent interacting: {timeSpentSec} second{timeSpentSec !== 1 ? "s" : ""}</div>
      <div>Exported times: {exportCount}</div>
      <div>Likes: {likeCount}</div>
      <div>Dislikes: {dislikeCount}</div>
      <div>Pan/Zoom actions: {panCount}</div>
    </div>
  );
};


export default GraphInteractionTracker;