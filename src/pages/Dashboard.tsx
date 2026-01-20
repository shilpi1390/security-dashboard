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
import { Box, Card, CardContent, Typography, Chip } from "@mui/material";
import AnalysisModeSelector from "../components/AnalysisModeSelector";
import LoadingSpinner from "../components/LoadingSpinner";
import { getCriticalVulnerabilities } from "../utils/filterUtils";
import { getSeverityColor } from "../theme";

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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: 3,
          color: "text.secondary",
        }}
      >
        <AlertCircle size={48} />
        <Typography variant="h4" color="text.primary">
          Error Loading Data
        </Typography>
        <Typography>{error}</Typography>
      </Box>
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
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 4,
          gap: 3,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box>
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, mb: 1, fontSize: "2rem" }}
          >
            Security Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive vulnerability analysis and insights
          </Typography>
        </Box>
        <AnalysisModeSelector />
      </Box>

      {analysisMode.mode !== "all" && (
        <Box
          sx={{
            background:
              "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1))",
            border: "1px solid",
            borderColor: "primary.main",
            borderRadius: 2,
            p: 3,
            mb: 4,
            animation: "fadeIn 0.3s ease-out",
            "@keyframes fadeIn": {
              from: { opacity: 0 },
              to: { opacity: 1 },
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Filter style={{ color: "#8b5cf6", flexShrink: 0 }} />
            <Typography
              sx={{
                color: "text.primary",
                fontSize: "0.9375rem",
                lineHeight: 1.6,
              }}
            >
              <strong>{analysisMode.label}</strong> active - Showing{" "}
              <strong>{stats.totalVulnerabilities.toLocaleString()}</strong> of{" "}
              <strong>{filterImpact.total.toLocaleString()}</strong>{" "}
              vulnerabilities{" "}
              <Box
                component="span"
                sx={{ color: "secondary.main", fontWeight: 600 }}
              >
                ({filterImpact.percentage}%)
              </Box>
            </Typography>
          </Box>
        </Box>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(auto-fit, minmax(250px, 1fr))",
          },
          gap: 3,
          mb: 4,
        }}
      >
        <Card
          sx={{
            transition: "all 0.2s",
            "&:hover": {
              borderColor: "primary.main",
              transform: "translateY(-2px)",
              boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
            },
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Shield style={{ color: "#8b5cf6" }} />
              <Typography
                variant="overline"
                sx={{
                  color: "text.secondary",
                  fontWeight: 500,
                  letterSpacing: "0.025em",
                }}
              >
                Total Vulnerabilities
              </Typography>
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 1,
                fontSize: "2.5rem",
                fontFeatureSettings: "'tnum'",
              }}
            >
              {stats.totalVulnerabilities.toLocaleString()}
            </Typography>
            <Box sx={{ pt: 1, borderTop: "1px solid", borderColor: "divider" }}>
              <Typography variant="body2" color="text.secondary">
                {stats.uniqueCVEs.toLocaleString()} unique CVEs
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={{
            borderColor: "#dc2626",
            transition: "all 0.2s",
            "&:hover": {
              borderColor: "#dc2626",
              transform: "translateY(-2px)",
              boxShadow: "0 10px 15px -3px rgba(220, 38, 38, 0.2)",
            },
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <AlertTriangle style={{ color: "#dc2626" }} />
              <Typography
                variant="overline"
                sx={{
                  color: "text.secondary",
                  fontWeight: 500,
                  letterSpacing: "0.025em",
                }}
              >
                Critical & High
              </Typography>
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 1,
                fontSize: "2.5rem",
                fontFeatureSettings: "'tnum'",
              }}
            >
              {(stats.criticalCount + stats.highCount).toLocaleString()}
            </Typography>
            <Box sx={{ pt: 1, borderTop: "1px solid", borderColor: "divider" }}>
              <Typography variant="body2" color="text.secondary">
                {stats.criticalCount.toLocaleString()} critical
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={{
            transition: "all 0.2s",
            "&:hover": {
              borderColor: "primary.main",
              transform: "translateY(-2px)",
              boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
            },
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Package style={{ color: "#8b5cf6" }} />
              <Typography
                variant="overline"
                sx={{
                  color: "text.secondary",
                  fontWeight: 500,
                  letterSpacing: "0.025em",
                }}
              >
                Affected Packages
              </Typography>
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 1,
                fontSize: "2.5rem",
                fontFeatureSettings: "'tnum'",
              }}
            >
              {stats.uniquePackages.toLocaleString()}
            </Typography>
            <Box sx={{ pt: 1, borderTop: "1px solid", borderColor: "divider" }}>
              <Typography variant="body2" color="text.secondary">
                Across all repositories
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={{
            transition: "all 0.2s",
            "&:hover": {
              borderColor: "primary.main",
              transform: "translateY(-2px)",
              boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
            },
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <TrendingUp style={{ color: "#8b5cf6" }} />
              <Typography
                variant="overline"
                sx={{
                  color: "text.secondary",
                  fontWeight: 500,
                  letterSpacing: "0.025em",
                }}
              >
                Fix Availability
              </Typography>
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 1,
                fontSize: "2.5rem",
                fontFeatureSettings: "'tnum'",
              }}
            >
              {((stats.withFix / stats.totalVulnerabilities) * 100).toFixed(1)}%
            </Typography>
            <Box sx={{ pt: 1, borderTop: "1px solid", borderColor: "divider" }}>
              <Typography variant="body2" color="text.secondary">
                {stats.withFix.toLocaleString()} have fixes
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "repeat(auto-fit, minmax(400px, 1fr))",
          },
          gap: 3,
          mb: 4,
        }}
      >
        <Card
          sx={{
            transition: "transform 0.2s ease-out",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
            },
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Severity Distribution
            </Typography>
            <Typography
              sx={{
                fontSize: "0.75rem",
                color: "#9aa0a6",
                mb: 2,
                mt: -0.5,
                fontStyle: "italic",
              }}
            >
              Click on a segment to filter vulnerabilities
            </Typography>
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
          </CardContent>
        </Card>

        <Card
          sx={{
            transition: "transform 0.2s ease-out",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
            },
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Fix Status
            </Typography>
            <Typography
              sx={{
                fontSize: "0.75rem",
                color: "#9aa0a6",
                mb: 2,
                mt: -0.5,
                fontStyle: "italic",
              }}
            >
              Click on a bar to filter vulnerabilities (Log scale for better
              visibility)
            </Typography>
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
                    return [
                      props.payload.displayValue.toLocaleString(),
                      "Count",
                    ];
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
          </CardContent>
        </Card>

        <Card
          sx={{
            transition: "transform 0.2s ease-out",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
            },
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Analysis Status
            </Typography>
            <Typography
              sx={{
                fontSize: "0.75rem",
                color: "#9aa0a6",
                mb: 2,
                mt: -0.5,
                fontStyle: "italic",
              }}
            >
              Click on a bar to filter vulnerabilities
            </Typography>
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
          </CardContent>
        </Card>

        <Card
          sx={{
            transition: "transform 0.2s ease-out",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
            },
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Vulnerability Trend (Last 12 Months)
            </Typography>
            <Typography
              sx={{
                fontSize: "0.75rem",
                color: "#9aa0a6",
                mb: 2,
                mt: -0.5,
                fontStyle: "italic",
              }}
            >
              Click on a point to filter vulnerabilities by month
            </Typography>
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
          </CardContent>
        </Card>
      </Box>

      <Card sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Top Critical Vulnerabilities
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {criticalVulnerabilities.map((vuln) => (
            <Box
              key={vuln.id}
              onClick={() => navigate(`/vulnerabilities/${vuln.id}`)}
              sx={{
                bgcolor: "#252b3b",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1.5,
                p: 3,
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: "primary.main",
                  transform: "translateX(4px)",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 1,
                  flexWrap: "wrap",
                }}
              >
                <Chip
                  label={vuln.severity}
                  size="small"
                  sx={{
                    bgcolor: getSeverityColor(vuln.severity),
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.025em",
                  }}
                />
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    fontSize: "0.9375rem",
                  }}
                >
                  {vuln.cve}
                </Typography>
                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.875rem",
                    ml: "auto",
                  }}
                >
                  CVSS: {vuln.cvss}
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: "secondary.main",
                  fontSize: "0.875rem",
                  fontFamily: "'Monaco', 'Courier New', monospace",
                  mb: 1,
                }}
              >
                {vuln.packageName}@{vuln.packageVersion}
              </Typography>
              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: "0.875rem",
                  lineHeight: 1.5,
                }}
              >
                {vuln.description.slice(0, 150)}...
              </Typography>
            </Box>
          ))}
        </Box>
      </Card>
    </Box>
  );
}

export default Dashboard;
