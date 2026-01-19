import {
  useVulnerability,
  analysisModes,
} from "../context/VulnerabilityContext";
import { Shield, Brain, Filter, Sparkles } from "lucide-react";
import "./AnalysisModeSelector.css";

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

function AnalysisModeSelector() {
  const { analysisMode, setAnalysisMode } = useVulnerability();

  const modes = [
    analysisModes.all,
    analysisModes.analysis,
    analysisModes.aiAnalysis,
  ];

  return (
    <div className="analysis-mode-selector">
      <div className="mode-buttons">
        {modes.map((mode) => {
          const Icon = modeIcons[mode.mode];
          const isActive = analysisMode.mode === mode.mode;
          const isFilterMode = mode.mode !== "all";

          return (
            <button
              key={mode.mode}
              className={`mode-button ${isActive ? "active" : ""} ${
                isFilterMode ? "filter-mode" : ""
              }`}
              onClick={() => setAnalysisMode(mode)}
              title={modeDescriptions[mode.mode]}
            >
              <div className="mode-icon-wrapper">
                <Icon className="mode-icon" />
                {isFilterMode && isActive && (
                  <Sparkles className="sparkle-icon" size={14} />
                )}
              </div>
              <div className="mode-content">
                <span className="mode-label">{mode.label}</span>
                {isActive && isFilterMode && mode.filterToKaiStatus && (
                  <span className="mode-badge">
                    {mode.filterToKaiStatus.length} status filter
                    {mode.filterToKaiStatus.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              {isActive && <div className="active-indicator" />}
            </button>
          );
        })}
      </div>

      {analysisMode.mode !== "all" && analysisMode.filterToKaiStatus && (
        <div className="filter-summary">
          <div className="filter-chips">
            {analysisMode.filterToKaiStatus.map((status) => (
              <div key={status} className="filter-chip">
                <span className="filter-chip-label">Showing only:</span>
                <code className="filter-chip-value">{status}</code>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalysisModeSelector;
