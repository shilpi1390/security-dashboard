import { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVulnerability } from '../context/VulnerabilityContext';
import { ArrowLeft, X, ExternalLink, AlertTriangle } from 'lucide-react';
import './Comparison.css';

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
      <div className="comparison-page">
        <div className="empty-state">
          <AlertTriangle size={48} />
          <h2>No Vulnerabilities Selected</h2>
          <p>Select vulnerabilities from the list to compare them here.</p>
          <button className="btn btn-primary" onClick={() => navigate('/vulnerabilities')}>
            Go to Vulnerabilities
          </button>
        </div>
      </div>
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
    <div className="comparison-page">
      <div className="comparison-header">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="header-info">
          <h1>Vulnerability Comparison</h1>
          <p className="subtitle">
            Comparing {selectedVulnerabilities.length} vulnerabilit
            {selectedVulnerabilities.length === 1 ? 'y' : 'ies'}
          </p>
        </div>

        <button className="btn btn-secondary" onClick={clearComparison}>
          Clear All
        </button>
      </div>

      <div className="comparison-container">
        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="field-column">Field</th>
                {selectedVulnerabilities.map((vuln) => (
                  <th key={vuln.id} className="vuln-column">
                    <div className="column-header">
                      <button
                        className="remove-btn"
                        onClick={() => toggleComparison(vuln.id)}
                        title="Remove from comparison"
                      >
                        <X size={16} />
                      </button>
                      <span className="cve-title">{vuln.cve}</span>
                      <button
                        className="view-btn"
                        onClick={() => navigate(`/vulnerabilities/${vuln.id}`)}
                        title="View details"
                      >
                        <ExternalLink size={16} />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonFields.map((field) => (
                <tr key={field.key}>
                  <td className="field-label">{field.label}</td>
                  {selectedVulnerabilities.map((vuln) => {
                    const value = vuln[field.key as keyof typeof vuln];

                    if (field.key === 'severity') {
                      return (
                        <td key={vuln.id}>
                          <span className={`badge badge-${value}`}>
                            {String(value)}
                          </span>
                        </td>
                      );
                    }

                    if (field.key === 'cvss') {
                      return (
                        <td key={vuln.id}>
                          <span className="cvss-value">{typeof value === 'number' ? value : '-'}</span>
                        </td>
                      );
                    }

                    if (field.key === 'kaiStatus') {
                      return (
                        <td key={vuln.id}>
                          {value ? (
                            <code className="kai-status-code">{String(value)}</code>
                          ) : (
                            <span className="empty-value">-</span>
                          )}
                        </td>
                      );
                    }

                    if (field.key === 'published' || field.key === 'fixDate') {
                      const dateValue = value ? new Date(String(value)).toLocaleDateString() : '-';
                      return <td key={vuln.id}>{dateValue}</td>;
                    }

                    return (
                      <td key={vuln.id}>
                        {value && typeof value !== 'object' ? String(value) : <span className="empty-value">-</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="comparison-insights">
          <h2>Insights</h2>
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-label">Highest CVSS</div>
              <div className="insight-value">
                {Math.max(...selectedVulnerabilities.map((v) => v.cvss))}
              </div>
            </div>
            <div className="insight-card">
              <div className="insight-label">Lowest CVSS</div>
              <div className="insight-value">
                {Math.min(...selectedVulnerabilities.map((v) => v.cvss))}
              </div>
            </div>
            <div className="insight-card">
              <div className="insight-label">With Fix</div>
              <div className="insight-value">
                {selectedVulnerabilities.filter((v) => v.status.toLowerCase().includes('fixed')).length}
              </div>
            </div>
            <div className="insight-card">
              <div className="insight-label">Unique Packages</div>
              <div className="insight-value">
                {new Set(selectedVulnerabilities.map((v) => v.packageName)).size}
              </div>
            </div>
          </div>

          <div className="risk-factors-comparison">
            <h3>Common Risk Factors</h3>
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
                return <p className="empty-message">No common risk factors found</p>;
              }

              return (
                <div className="risk-factors-list">
                  {commonFactors.map(([factor, count]) => (
                    <div key={factor} className="risk-factor-item">
                      <span className="risk-factor-name">{factor}</span>
                      <span className="risk-factor-count">
                        {count}/{selectedVulnerabilities.length}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comparison;
