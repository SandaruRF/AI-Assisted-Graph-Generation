// AI-Assisted-Graph-Generation/frontend/src/components/GraphCustomizer.jsx

import React, { useState } from "react";
import { customizeGraph } from "../services/api";

export default function GraphCustomizer({ onUpdate }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCustomize = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newState = await customizeGraph(prompt);
    setLoading(false);
    setPrompt("");
    onUpdate(newState);
  };

  return (
    <form onSubmit={handleCustomize} style={{ marginBottom: 20 }}>
      <input
        type="text"
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        placeholder="Describe your customization (e.g., Change x label to 'Date', color to red)"
        style={{ width: "70%", marginRight: 10 }}
      />
      <button type="submit" disabled={loading || !prompt}>
        {loading ? "Applying..." : "Customize Graph"}
      </button>
    </form>
  );
}