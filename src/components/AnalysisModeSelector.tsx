import {
  useVulnerability,
  analysisModes,
} from "../context/VulnerabilityContext";
import { Shield, Brain, Filter, Sparkles } from "lucide-react";
import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Typography,
  Tooltip,
  keyframes,
} from "@mui/material";

const modeIcons = {
  all: Shield,
  analysis: Filter,
  "ai-analysis": Brain,
};

const modeDescriptions = {
  all: "View all vulnerabilities without filters",
  analysis: "Show only manually marked as invalid/no-risk",
  "ai-analysis": "Show only AI-marked as invalid/no-risk",
};

const sparkleAnimation = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.5) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.2) rotate(180deg);
  }
  100% {
    opacity: 0;
    transform: scale(0.5) rotate(360deg);
  }
`;

function AnalysisModeSelector() {
  const { analysisMode, setAnalysisMode } = useVulnerability();

  const modes = [
    analysisModes.all,
    analysisModes.analysis,
    analysisModes.aiAnalysis,
  ];

  return (
    <Box>
      <ToggleButtonGroup
        value={analysisMode.mode}
        exclusive
        onChange={(_, newMode) => {
          if (newMode !== null) {
            const selectedMode = modes.find((m) => m.mode === newMode);
            if (selectedMode) setAnalysisMode(selectedMode);
          }
        }}
        sx={{
          display: "flex",
          gap: 1,
          "& .MuiToggleButtonGroup-grouped": {
            border: "1px solid",
            borderColor: "#3c4257",
            borderRadius: 2,
            "&:not(:first-of-type)": {
              marginLeft: 0,
            },
          },
        }}
      >
        {modes.map((mode) => {
          const Icon = modeIcons[mode.mode];
          const isActive = analysisMode.mode === mode.mode;
          const isFilterMode = mode.mode !== "all";

          return (
            <Tooltip key={mode.mode} title={modeDescriptions[mode.mode]} arrow>
              <ToggleButton
                value={mode.mode}
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  textTransform: "none",
                  position: "relative",
                  minWidth: 200,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ position: "relative", display: "inline-flex" }}>
                    <Icon size={20} style={{ color: "#e356f3" }} />
                    {isFilterMode && isActive && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: -2,
                          right: -4,
                          animation: `${sparkleAnimation} 2s ease-in-out infinite`,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Sparkles size={14} style={{ color: "#069eb9" }} />
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 0.5,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {mode.label}
                  </Typography>
                  {isActive && isFilterMode && mode.filterToKaiStatus && (
                    <Chip
                      label={`${mode.filterToKaiStatus.length} status filter${mode.filterToKaiStatus.length !== 1 ? "s" : ""}`}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: "0.6875rem",
                        borderColor: "rgba(139, 92, 246, 0.1)",
                        color: "#06b6d4",
                      }}
                    />
                  )}
                </Box>
              </ToggleButton>
            </Tooltip>
          );
        })}
      </ToggleButtonGroup>

      {analysisMode.mode !== "all" && analysisMode.filterToKaiStatus && (
        <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
          {analysisMode.filterToKaiStatus.map((status) => (
            <Chip
              key={status}
              label={
                <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                  <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
                    Showing only:
                  </Typography>
                  <Typography
                    component="code"
                    variant="caption"
                    sx={{
                      fontFamily: "monospace",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {status}
                  </Typography>
                </Box>
              }
              sx={{
                // backgroundColor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                fontSize: "0.75rem",
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default AnalysisModeSelector;
