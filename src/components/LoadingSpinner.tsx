import { useVulnerability } from "../context/VulnerabilityContext";
import { Box, LinearProgress, Typography } from "@mui/material";
import { Loader2 } from "lucide-react";

function LoadingSpinner() {
  const { loadingProgress } = useVulnerability();

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          width: "100%",
          maxWidth: 400,
          padding: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 3,
            animation: "spin 1s linear infinite",
            "@keyframes spin": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(360deg)" },
            },
          }}
        >
          <Loader2 size={64} color="#8b5cf6" />
        </Box>
        <Typography variant="h5" component="h2" sx={{ mb: 1, fontWeight: 600 }}>
          Loading Vulnerability Data
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Processing large dataset...
        </Typography>
        {loadingProgress > 0 && (
          <Box sx={{ width: "100%" }}>
            <LinearProgress
              variant="determinate"
              value={loadingProgress}
              sx={{
                height: 8,
                borderRadius: 1,
                backgroundColor: "rgba(139, 92, 246, 0.1)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "primary.main",
                  borderRadius: 1,
                },
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default LoadingSpinner;
