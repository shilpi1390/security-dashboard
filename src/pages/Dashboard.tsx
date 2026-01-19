import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useVulnerability,
  analysisModes,
} from "../context/VulnerabilityContext";
import {
  AlertTriangle,
  Shield,
  Package,
  TrendingUp,
  Filter,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import AnalysisModeSelector from "../components/AnalysisModeSelector";
import LoadingSpinner from "../components/LoadingSpinner";
import { getCriticalVulnerabilities } from "../utils/filterUtils";
import "./Dashboard.css";

const SEVERITY_COLORS = {
  critical: "#dc2626",
  high: "#f97316",
  medium: "#eab308",
  low: "#3b82f6",
  negligible: "#6b7280",
};

function Dashboard() {
  const navigate = useNavigate();
  const {
    stats,
    isLoading,
    error,
    allVulnerabilities,
    filteredVulnerabilities,
    analysisMode,
    setAnalysisMode,
    filters,
    setFilters,
  } = useVulnerability();

  const severityData = useMemo(
    () =>
      [
        {
          name: "Critical",
          value: stats.criticalCount,
          color: SEVERITY_COLORS.critical,
        },
        { name: "High", value: stats.highCount, color: SEVERITY_COLORS.high },
        {
          name: "Medium",
          value: stats.mediumCount,
          color: SEVERITY_COLORS.medium,
        },
        { name: "Low", value: stats.lowCount, color: SEVERITY_COLORS.low },
        {
          name: "Negligible",
          value: stats.negligibleCount,
          color: SEVERITY_COLORS.negligible,
        },
      ].filter((item) => item.value > 0), // Only show severities with values greater than 0
    [stats],
  );

  const fixStatusData = useMemo(() => {
    const data = [
      {
        name: "Fixed",
        value: stats.statusFixed,
        color: "#10b981",
        displayValue: stats.statusFixed,
      },
      {
        name: "Affected",
        value: stats.statusAffected,
        color: "#ef4444",
        displayValue: stats.statusAffected,
      },
      {
        name: "Open",
        value: stats.statusOpen,
        color: "#f59e0b",
        displayValue: stats.statusOpen,
      },
      {
        name: "Under Investigation",
        value: stats.statusUnderInvestigation,
        color: "#3b82f6",
        displayValue: stats.statusUnderInvestigation,
      },
      {
        name: "No Status",
        value: stats.statusNoStatus,
        color: "#6b7280",
        displayValue: stats.statusNoStatus,
      },
      {
        name: "Will Not Fix",
        value: stats.statusWillNotFix,
        color: "#ec4899",
        displayValue: stats.statusWillNotFix,
      },
      {
        name: "Needed",
        value: stats.statusNeeded,
        color: "#8b5cf6",
        displayValue: stats.statusNeeded,
      },
      {
        name: "Deferred",
        value: stats.statusDeferred,
        color: "#06b6d4",
        displayValue: stats.statusDeferred,
      },
    ];

    // Use logarithmic scale for visualization while keeping actual values
    // This makes small values visible on the chart
    return data.map((item) => ({
      ...item,
      // Use log scale for display, but add minimum height for visibility
      visualValue:
        item.value > 0 ? Math.max(Math.log10(item.value + 1) * 1000, 50) : 0,
    }));
  }, [stats]);

  const kaiAnalysisData = useMemo(
    () => [
      { name: "Invalid", value: stats.invalidNorisk },
      { name: "AI Invalid", value: stats.aiInvalidNorisk },
      {
        name: "Valid/Unreviewed",
        value:
          stats.totalVulnerabilities -
          stats.invalidNorisk -
          stats.aiInvalidNorisk,
      },
    ],
    [stats],
  );

  const criticalVulnerabilities = useMemo(
    () => getCriticalVulnerabilities(allVulnerabilities, 5),
    [allVulnerabilities],
  );

  const monthlyTrend = useMemo(() => {
    const monthCounts = new Map<string, number>();

    filteredVulnerabilities.forEach((vuln) => {
      const date = new Date(vuln.published);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthCounts.set(monthKey, (monthCounts.get(monthKey) || 0) + 1);
    });

    return Array.from(monthCounts.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([month, count]) => ({ month, count }));
  }, [filteredVulnerabilities]);

  // Click handlers for interactive charts
  const handleSeverityClick = (data: any) => {
    if (data && data.name) {
      const severity = data.name.toLowerCase();
      setFilters({
        ...filters,
        severity: [severity],
      });
      navigate("/vulnerabilities");
    }
  };

  const handleFixStatusClick = (data: any) => {
    if (data && data.name) {
      // Use status filter
      setFilters({
        ...filters,
        status: [data.name],
      });
      navigate("/vulnerabilities");
    }
  };

  const handleAnalysisStatusClick = (data: any) => {
    if (data && data.name) {
      // Map bar names to analysis modes
      if (data.name === "Invalid") {
        setAnalysisMode(analysisModes.analysis);
      } else if (data.name === "AI Invalid") {
        setAnalysisMode(analysisModes.aiAnalysis);
      } else {
        // Valid/Unreviewed - show all
        setAnalysisMode(analysisModes.all);
      }
      navigate("/vulnerabilities");
    }
  };

  const handleTrendClick = (data: any) => {
    if (data && data.month) {
      const [year, month] = data.month.split("-");
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0);

      setFilters({
        ...filters,
        dateRange: {
          start: startDate.toISOString().split("T")[0],
          end: endDate.toISOString().split("T")[0],
        },
      });
      navigate("/vulnerabilities");
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="error-container">
        <AlertCircle size={48} />
        <h2>Error Loading Data</h2>
        <p>{error}</p>
      </div>
    );
  }

  const filterImpact = {
    total: allVulnerabilities.length,
    filtered: stats.totalVulnerabilities,
    percentage: (
      (stats.totalVulnerabilities / allVulnerabilities.length) *
      100
    ).toFixed(1),
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Security Dashboard</h1>
          <p className="subtitle">
            Comprehensive vulnerability analysis and insights
          </p>
        </div>
        <AnalysisModeSelector />
      </div>

      {analysisMode.mode !== "all" && (
        <div className="filter-impact-banner">
          <div className="impact-content">
            <Filter className="impact-icon" />
            <div className="impact-text">
              <strong>{analysisMode.label}</strong> active - Showing{" "}
              <strong>{stats.totalVulnerabilities.toLocaleString()}</strong> of{" "}
              <strong>{filterImpact.total.toLocaleString()}</strong>{" "}
              vulnerabilities{" "}
              <span className="impact-percentage">
                ({filterImpact.percentage}%)
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <Shield className="stat-icon" />
            <span className="stat-label">Total Vulnerabilities</span>
          </div>
          <div className="stat-value">
            {stats.totalVulnerabilities.toLocaleString()}
          </div>
          <div className="stat-footer">
            <span className="stat-detail">
              {stats.uniqueCVEs.toLocaleString()} unique CVEs
            </span>
          </div>
        </div>

        <div className="stat-card critical-card">
          <div className="stat-header">
            <AlertTriangle className="stat-icon" />
            <span className="stat-label">Critical & High</span>
          </div>
          <div className="stat-value">
            {(stats.criticalCount + stats.highCount).toLocaleString()}
          </div>
          <div className="stat-footer">
            <span className="stat-detail">
              {stats.criticalCount.toLocaleString()} critical
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <Package className="stat-icon" />
            <span className="stat-label">Affected Packages</span>
          </div>
          <div className="stat-value">
            {stats.uniquePackages.toLocaleString()}
          </div>
          <div className="stat-footer">
            <span className="stat-detail">Across all repositories</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <TrendingUp className="stat-icon" />
            <span className="stat-label">Fix Availability</span>
          </div>
          <div className="stat-value">
            {((stats.withFix / stats.totalVulnerabilities) * 100).toFixed(1)}%
          </div>
          <div className="stat-footer">
            <span className="stat-detail">
              {stats.withFix.toLocaleString()} have fixes
            </span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card interactive-chart">
          <h3>Severity Distribution</h3>
          <p className="chart-hint">
            Click on a segment to filter vulnerabilities
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${((percent || 0) * 100).toFixed(0)}%`
                }
                outerRadius={100}
                dataKey="value"
                onClick={handleSeverityClick}
                cursor="pointer"
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card interactive-chart">
          <h3>Fix Status</h3>
          <p className="chart-hint">
            Click on a bar to filter vulnerabilities (Log scale for better
            visibility)
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fixStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3c4257" />
              <XAxis
                dataKey="name"
                stroke="#9aa0a6"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={11}
              />
              <YAxis stroke="#9aa0a6" hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1f2e",
                  border: "1px solid #3c4257",
                  borderRadius: "8px",
                  color: "#e5e7eb",
                }}
                cursor={{ fill: "rgba(139, 92, 246, 0.1)" }}
                formatter={(
                  _value: any,
                  _name: string | undefined,
                  props: any,
                ) => {
                  // Show actual value in tooltip, not the logarithmic value
                  return [props.payload.displayValue.toLocaleString(), "Count"];
                }}
              />
              <Bar
                dataKey="visualValue"
                fill="#8b5cf6"
                radius={[8, 8, 0, 0]}
                onClick={handleFixStatusClick}
                style={{ cursor: "pointer" }}
                label={(props: any) => {
                  const { x, y, width, value, index } = props;
                  const dataItem = fixStatusData[index];
                  if (!dataItem || value === 0) return null;
                  return (
                    <text
                      x={x + width / 2}
                      y={y - 5}
                      fill="#e5e7eb"
                      textAnchor="middle"
                      fontSize={10}
                    >
                      {dataItem.displayValue.toLocaleString()}
                    </text>
                  );
                }}
              >
                {fixStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    style={{ cursor: "pointer" }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card interactive-chart">
          <h3>Analysis Status</h3>
          <p className="chart-hint">Click on a bar to filter vulnerabilities</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={kaiAnalysisData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3c4257" />
              <XAxis dataKey="name" stroke="#9aa0a6" />
              <YAxis stroke="#9aa0a6" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1f2e",
                  border: "1px solid #3c4257",
                  borderRadius: "8px",
                  color: "#e5e7eb",
                }}
                cursor={{ fill: "rgba(6, 182, 212, 0.1)" }}
              />
              <Bar
                dataKey="value"
                fill="#06b6d4"
                radius={[8, 8, 0, 0]}
                onClick={handleAnalysisStatusClick}
                style={{ cursor: "pointer" }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card interactive-chart">
          <h3>Vulnerability Trend (Last 12 Months)</h3>
          <p className="chart-hint">
            Click on a point to filter vulnerabilities by month
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend} onClick={handleTrendClick}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3c4257" />
              <XAxis dataKey="month" stroke="#9aa0a6" />
              <YAxis stroke="#9aa0a6" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1f2e",
                  border: "1px solid #3c4257",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: "#8b5cf6", r: 4, cursor: "pointer" }}
                activeDot={{ r: 6, cursor: "pointer" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="critical-section">
        <h2>Top Critical Vulnerabilities</h2>
        <div className="critical-list">
          {criticalVulnerabilities.map((vuln) => (
            <div
              key={vuln.id}
              className="critical-item"
              onClick={() => navigate(`/vulnerabilities/${vuln.id}`)}
            >
              <div className="critical-header">
                <span className={`badge badge-${vuln.severity}`}>
                  {vuln.severity}
                </span>
                <span className="critical-cve">{vuln.cve}</span>
                <span className="critical-cvss">CVSS: {vuln.cvss}</span>
              </div>
              <div className="critical-package">
                {vuln.packageName}@{vuln.packageVersion}
              </div>
              <div className="critical-description">
                {vuln.description.slice(0, 150)}...
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
