import { useMemo } from "react";
import { useVulnerability } from "../context/VulnerabilityContext";
import { getUniqueFilterValues } from "../utils/dataLoader";
import { getSeverityColor } from "../theme";
import { RotateCcw } from "lucide-react";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { Box, Typography, Button, Paper } from "@mui/material";

function FilterPanel() {
  const { allVulnerabilities, filters, setFilters, resetFilters } =
    useVulnerability();

  const uniqueValues = useMemo(
    () => getUniqueFilterValues(allVulnerabilities),
    [allVulnerabilities],
  );

  const statusOptions = [
    "Fixed",
    "Affected",
    "Open",
    "Under Investigation",
    "No Status",
    "Will Not Fix",
    "Needed",
    "Deferred",
  ];

  const hasActiveFilters =
    filters.severity.length > 0 ||
    filters.packageType.length > 0 ||
    filters.riskFactors.length > 0 ||
    filters.status.length > 0;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        marginBottom: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
          Advanced Filters
        </Typography>
        {hasActiveFilters && (
          <Button
            variant="text"
            size="small"
            startIcon={<RotateCcw size={16} />}
            onClick={resetFilters}
            sx={{
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "rgba(139, 92, 246, 0.08)",
                color: "primary.main",
              },
            }}
          >
            Reset
          </Button>
        )}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2,
        }}
      >
        <MultiSelectDropdown
          label="Severity"
          options={uniqueValues.severities}
          selectedValues={filters.severity}
          onChange={(values) =>
            setFilters({ ...filters, severity: values as any })
          }
          // placeholder="Select severity levels..."
          renderOption={(severity) => (
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                padding: "2px 8px",
                borderRadius: 1,
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.025em",
                backgroundColor: `${getSeverityColor(severity)}15`,
                color: getSeverityColor(severity),
                border: `1px solid ${getSeverityColor(severity)}`,
              }}
            >
              {severity}
            </Box>
          )}
        />

        <MultiSelectDropdown
          label="Package Type"
          options={uniqueValues.packageTypes}
          selectedValues={filters.packageType}
          onChange={(values) => setFilters({ ...filters, packageType: values })}
          placeholder="Select package types..."
        />

        <MultiSelectDropdown
          label="Risk Factors"
          options={uniqueValues.riskFactors}
          selectedValues={filters.riskFactors}
          onChange={(values) => setFilters({ ...filters, riskFactors: values })}
          placeholder="Select risk factors..."
        />

        <MultiSelectDropdown
          label="Status"
          options={statusOptions}
          selectedValues={filters.status}
          onChange={(values) =>
            setFilters({ ...filters, status: values as any })
          }
          placeholder="Select vulnerability status..."
        />
      </Box>
    </Paper>
  );
}

export default FilterPanel;
