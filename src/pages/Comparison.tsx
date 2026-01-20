import { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVulnerability } from '../context/VulnerabilityContext';
import { ArrowLeft, X, ExternalLink, AlertTriangle } from 'lucide-react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Card,
} from '@mui/material';
import { getSeverityColor } from '../theme';

function Comparison() {
  const navigate = useNavigate();
  const { allVulnerabilities, selectedForComparison, toggleComparison, clearComparison } =
    useVulnerability();

  const selectedVulnerabilities = useMemo(
    () =>
      allVulnerabilities.filter((v) => selectedForComparison.has(v.id)),
    [allVulnerabilities, selectedForComparison]
  );

  // Redirect to vulnerabilities page when all items are removed
  useEffect(() => {
    if (selectedForComparison.size === 0) {
      navigate('/vulnerabilities');
    }
  }, [selectedForComparison.size, navigate]);

  if (selectedVulnerabilities.length === 0) {
    return (
      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            minHeight: '60vh',
            color: 'text.secondary',
          }}
        >
          <AlertTriangle size={48} />
          <Typography variant="h4" sx={{ color: 'text.primary' }}>
            No Vulnerabilities Selected
          </Typography>
          <Typography>Select vulnerabilities from the list to compare them here.</Typography>
          <Button variant="contained" onClick={() => navigate('/vulnerabilities')}>
            Go to Vulnerabilities
          </Button>
        </Box>
      </Box>
    );
  }

  const comparisonFields = [
    { key: 'cve', label: 'CVE ID' },
    { key: 'severity', label: 'Severity' },
    { key: 'cvss', label: 'CVSS Score' },
    { key: 'packageName', label: 'Package' },
    { key: 'packageVersion', label: 'Version' },
    { key: 'packageType', label: 'Type' },
    { key: 'status', label: 'Fix Status' },
    { key: 'kaiStatus', label: 'Analysis Status' },
    { key: 'published', label: 'Published' },
    { key: 'fixDate', label: 'Fix Date' },
    { key: 'groupName', label: 'Group' },
    { key: 'repoName', label: 'Repository' },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 4,
          gap: 3,
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Button
          variant="text"
          startIcon={<ArrowLeft size={18} />}
          onClick={() => navigate(-1)}
          sx={{ color: 'text.secondary' }}
        >
          Back
        </Button>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Vulnerability Comparison
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Comparing {selectedVulnerabilities.length} vulnerabilit
            {selectedVulnerabilities.length === 1 ? 'y' : 'ies'}
          </Typography>
        </Box>

        <Button variant="outlined" onClick={clearComparison}>
          Clear All
        </Button>
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 4 }}>
        {/* Comparison Table */}
        <Paper
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      width: 200,
                      fontWeight: 600,
                      position: 'sticky',
                      left: 0,
                      bgcolor: 'background.paper',
                      zIndex: 2,
                    }}
                  >
                    Field
                  </TableCell>
                  {selectedVulnerabilities.map((vuln) => (
                    <TableCell
                      key={vuln.id}
                      sx={{
                        minWidth: 250,
                        maxWidth: 300,
                        fontWeight: 600,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => toggleComparison(vuln.id)}
                          title="Remove from comparison"
                          sx={{
                            border: 1,
                            borderColor: 'divider',
                            '&:hover': {
                              bgcolor: 'error.main',
                              borderColor: 'error.main',
                              color: 'white',
                            },
                          }}
                        >
                          <X size={16} />
                        </IconButton>
                        <Typography
                          sx={{
                            flex: 1,
                            fontFamily: 'Monaco, "Courier New", monospace',
                            fontSize: '0.875rem',
                          }}
                        >
                          {vuln.cve}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/vulnerabilities/${vuln.id}`)}
                          title="View details"
                          sx={{
                            border: 1,
                            borderColor: 'divider',
                            '&:hover': {
                              bgcolor: 'primary.main',
                              borderColor: 'primary.main',
                              color: 'white',
                            },
                          }}
                        >
                          <ExternalLink size={16} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {comparisonFields.map((field) => (
                  <TableRow
                    key={field.key}
                    sx={{
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: 'text.secondary',
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                        letterSpacing: '0.05em',
                        position: 'sticky',
                        left: 0,
                        bgcolor: 'background.paper',
                        zIndex: 1,
                      }}
                    >
                      {field.label}
                    </TableCell>
                    {selectedVulnerabilities.map((vuln) => {
                      const value = vuln[field.key as keyof typeof vuln];

                      if (field.key === 'severity') {
                        return (
                          <TableCell key={vuln.id}>
                            <Chip
                              label={String(value)}
                              size="small"
                              sx={{
                                bgcolor: getSeverityColor(String(value)),
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                              }}
                            />
                          </TableCell>
                        );
                      }

                      if (field.key === 'cvss') {
                        return (
                          <TableCell key={vuln.id}>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: '1.125rem',
                                color: 'primary.main',
                                fontVariantNumeric: 'tabular-nums',
                              }}
                            >
                              {typeof value === 'number' ? value : '-'}
                            </Typography>
                          </TableCell>
                        );
                      }

                      if (field.key === 'kaiStatus') {
                        return (
                          <TableCell key={vuln.id}>
                            {value ? (
                              <Box
                                component="code"
                                sx={{
                                  px: 1,
                                  py: 0.5,
                                  bgcolor: 'rgba(6, 182, 212, 0.1)',
                                  border: 1,
                                  borderColor: 'secondary.main',
                                  borderRadius: 1,
                                  fontFamily: 'Monaco, "Courier New", monospace',
                                  fontSize: '0.75rem',
                                  color: 'secondary.main',
                                }}
                              >
                                {String(value)}
                              </Box>
                            ) : (
                              <Typography sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                                -
                              </Typography>
                            )}
                          </TableCell>
                        );
                      }

                      if (field.key === 'published' || field.key === 'fixDate') {
                        const dateValue = value ? new Date(String(value)).toLocaleDateString() : '-';
                        return <TableCell key={vuln.id}>{dateValue}</TableCell>;
                      }

                      return (
                        <TableCell key={vuln.id}>
                          {value && typeof value !== 'object' ? (
                            String(value)
                          ) : (
                            <Typography sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                              -
                            </Typography>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>

        {/* Insights Section */}
        <Paper
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            p: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            Insights
          </Typography>

          {/* Insights Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(auto-fit, minmax(150px, 1fr))' },
              gap: 2,
              mb: 4,
            }}
          >
            <Card
              sx={{
                p: 2,
                textAlign: 'center',
                bgcolor: 'action.hover',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  mb: 1,
                  display: 'block',
                }}
              >
                Highest CVSS
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {Math.max(...selectedVulnerabilities.map((v) => v.cvss))}
              </Typography>
            </Card>

            <Card
              sx={{
                p: 2,
                textAlign: 'center',
                bgcolor: 'action.hover',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  mb: 1,
                  display: 'block',
                }}
              >
                Lowest CVSS
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {Math.min(...selectedVulnerabilities.map((v) => v.cvss))}
              </Typography>
            </Card>

            <Card
              sx={{
                p: 2,
                textAlign: 'center',
                bgcolor: 'action.hover',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  mb: 1,
                  display: 'block',
                }}
              >
                With Fix
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {selectedVulnerabilities.filter((v) => v.status.toLowerCase().includes('fixed')).length}
              </Typography>
            </Card>

            <Card
              sx={{
                p: 2,
                textAlign: 'center',
                bgcolor: 'action.hover',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  mb: 1,
                  display: 'block',
                }}
              >
                Unique Packages
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {new Set(selectedVulnerabilities.map((v) => v.packageName)).size}
              </Typography>
            </Card>
          </Box>

          {/* Risk Factors */}
          <Box sx={{ pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Common Risk Factors
            </Typography>
            {(() => {
              const allRiskFactors = selectedVulnerabilities
                .flatMap((v) => Object.keys(v.riskFactors || {}));
              const riskFactorCounts = allRiskFactors.reduce((acc, factor) => {
                acc[factor] = (acc[factor] || 0) + 1;
                return acc;
              }, {} as Record<string, number>);

              const commonFactors = Object.entries(riskFactorCounts)
                .filter(([, count]) => count > 1)
                .sort(([, a], [, b]) => b - a);

              if (commonFactors.length === 0) {
                return (
                  <Typography
                    sx={{
                      color: 'text.disabled',
                      fontStyle: 'italic',
                      textAlign: 'center',
                      py: 2,
                    }}
                  >
                    No common risk factors found
                  </Typography>
                );
              }

              return (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {commonFactors.map(([factor, count]) => (
                    <Box
                      key={factor}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1.5,
                        bgcolor: 'action.hover',
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1.5,
                      }}
                    >
                      <Typography sx={{ fontSize: '0.875rem' }}>{factor}</Typography>
                      <Typography
                        sx={{
                          color: 'secondary.main',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                        }}
                      >
                        {count}/{selectedVulnerabilities.length}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              );
            })()}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default Comparison;
