import React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";

interface LoadingIndicatorProps {
  isLoading: boolean;
  type?: "linear" | "circular";
  message?: string;
  position?: "above" | "below" | "none";
  color?: "primary" | "secondary" | "inherit";
  thickness?: number;
  style?: React.CSSProperties;
  messageStyle?: React.CSSProperties;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  isLoading,
  type = "linear",
  message = "",
  position = "below",
  color = "primary",
  thickness = 4,
  style = {},
  messageStyle = {},
}) => {
  if (!isLoading) return null;

  return (
    <div style={{ textAlign: "center", marginBottom: "5px", ...style }}>
      {position === "above" && message && <p style={messageStyle}>{message}</p>}

      {type === "linear" ? (
        <LinearProgress aria-label="Loading indicator" color={color} />
      ) : (
        <CircularProgress color={color} thickness={thickness} />
      )}

      {position === "below" && message && <p style={messageStyle}>{message}</p>}
    </div>
  );
};

export default LoadingIndicator;
