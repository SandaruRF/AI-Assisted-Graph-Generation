import React, { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <Tooltip title={copied ? "Copied!" : "Copy"}>
      <IconButton onClick={handleCopy} size="small">
        {copied ? <CheckCircleIcon color="success" /> : <ContentCopyIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default CopyButton;
