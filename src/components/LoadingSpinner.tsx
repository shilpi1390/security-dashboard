import { useVulnerability } from "../context/VulnerabilityContext";
import { Loader2 } from "lucide-react";
import "./LoadingSpinner.css";

function LoadingSpinner() {
  const { loadingProgress } = useVulnerability();

  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-icon-wrapper">
          <Loader2 className="spinner-icon" size={64} />
        </div>
        <h2>Loading Vulnerability Data</h2>
        <p>Processing large dataset...</p>
        {loadingProgress > 0 && (
          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoadingSpinner;
