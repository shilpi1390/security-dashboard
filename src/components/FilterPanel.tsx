import { useMemo } from 'react';
import { useVulnerability } from '../context/VulnerabilityContext';
import { getUniqueFilterValues } from '../utils/dataLoader';
import { RotateCcw } from 'lucide-react';
import MultiSelectDropdown from './MultiSelectDropdown';
import './FilterPanel.css';

function FilterPanel() {
  const { allVulnerabilities, filters, setFilters, resetFilters } = useVulnerability();

  const uniqueValues = useMemo(
    () => getUniqueFilterValues(allVulnerabilities),
    [allVulnerabilities]
  );

  const statusOptions = [
    'Fixed',
    'Affected',
    'Open',
    'Under Investigation',
    'No Status',
    'Will Not Fix',
    'Needed',
    'Deferred',
  ];

  const hasActiveFilters =
    filters.severity.length > 0 ||
    filters.packageType.length > 0 ||
    filters.riskFactors.length > 0 ||
    filters.status.length > 0;

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>Advanced Filters</h3>
        {hasActiveFilters && (
          <button className="btn btn-ghost btn-sm" onClick={resetFilters}>
            <RotateCcw size={16} />
            Reset
          </button>
        )}
      </div>

      <div className="filter-sections">
        <MultiSelectDropdown
          label="Severity"
          options={uniqueValues.severities}
          selectedValues={filters.severity}
          onChange={(values) => setFilters({ ...filters, severity: values as any })}
          placeholder="Select severity levels..."
          renderOption={(severity) => (
            <span className={`badge badge-${severity}`}>{severity}</span>
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
          onChange={(values) => setFilters({ ...filters, status: values as any })}
          placeholder="Select vulnerability status..."
        />
      </div>
    </div>
  );
}

export default FilterPanel;
