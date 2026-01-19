import type { ProcessedVulnerability, FilterState, Severity } from '../types/vulnerability';

/**
 * Applies all active filters to the vulnerability list
 */
export function applyFilters(
  vulnerabilities: ProcessedVulnerability[],
  filters: FilterState
): ProcessedVulnerability[] {
  return vulnerabilities.filter((vuln) => {
    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchableFields = [
        vuln.cve,
        vuln.packageName,
        vuln.description,
        vuln.severity,
        vuln.packageType,
        vuln.groupName,
        vuln.repoName,
      ].map((field) => field.toLowerCase());

      if (!searchableFields.some((field) => field.includes(query))) {
        return false;
      }
    }

    // Severity filter
    if (filters.severity.length > 0) {
      if (!filters.severity.includes(vuln.severity as Severity)) {
        return false;
      }
    }

    // KaiStatus filter
    if (filters.kaiStatus.length > 0) {
      if (!filters.kaiStatus.includes(vuln.kaiStatus || '')) {
        return false;
      }
    }

    // Package type filter
    if (filters.packageType.length > 0) {
      if (!filters.packageType.includes(vuln.packageType)) {
        return false;
      }
    }

    // Risk factors filter
    if (filters.riskFactors.length > 0) {
      const vulnRiskFactors = Object.keys(vuln.riskFactors || {});
      const hasMatchingRiskFactor = filters.riskFactors.some((factor) =>
        vulnRiskFactors.includes(factor)
      );
      if (!hasMatchingRiskFactor) {
        return false;
      }
    }

    // Status filter
    if (filters.status.length > 0) {
      const vulnStatus = (vuln.status || '').trim().toLowerCase();
      const matchesStatus = filters.status.some((filterStatus) => {
        switch (filterStatus) {
          case 'Fixed':
            return vulnStatus.includes('fixed');
          case 'Affected':
            return vulnStatus === 'affected';
          case 'Open':
            return vulnStatus === 'open';
          case 'Under Investigation':
            return vulnStatus === 'under investigation';
          case 'No Status':
            return vulnStatus === '';
          case 'Will Not Fix':
            return vulnStatus.includes('will not fix') || vulnStatus.includes('wontfix');
          case 'Needed':
            return vulnStatus === 'needed';
          case 'Deferred':
            return vulnStatus === 'deferred';
          default:
            return false;
        }
      });
      if (!matchesStatus) {
        return false;
      }
    }

    // Date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      const publishedDate = new Date(vuln.published);

      if (filters.dateRange.start && publishedDate < new Date(filters.dateRange.start)) {
        return false;
      }

      if (filters.dateRange.end && publishedDate > new Date(filters.dateRange.end)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sorts vulnerabilities by a specific field
 */
export function sortVulnerabilities(
  vulnerabilities: ProcessedVulnerability[],
  sortBy: keyof ProcessedVulnerability,
  sortOrder: 'asc' | 'desc' = 'desc'
): ProcessedVulnerability[] {
  return [...vulnerabilities].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];

    let comparison = 0;

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      comparison = aVal.localeCompare(bVal);
    } else if (typeof aVal === 'number' && typeof bVal === 'number') {
      comparison = aVal - bVal;
    } else {
      comparison = String(aVal).localeCompare(String(bVal));
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });
}

/**
 * Groups vulnerabilities by a specific field
 */
export function groupVulnerabilitiesBy(
  vulnerabilities: ProcessedVulnerability[],
  groupBy: keyof ProcessedVulnerability
): Map<string, ProcessedVulnerability[]> {
  const groups = new Map<string, ProcessedVulnerability[]>();

  vulnerabilities.forEach((vuln) => {
    const key = String(vuln[groupBy]);
    const existing = groups.get(key) || [];
    groups.set(key, [...existing, vuln]);
  });

  return groups;
}

/**
 * Gets severity order for sorting
 */
const severityOrder: Record<string, number> = {
  critical: 5,
  high: 4,
  medium: 3,
  low: 2,
  negligible: 1,
};

export function getSeverityOrder(severity: string): number {
  return severityOrder[severity.toLowerCase()] || 0;
}

/**
 * Advanced search with fuzzy matching
 */
export function fuzzySearch(
  vulnerabilities: ProcessedVulnerability[],
  query: string
): ProcessedVulnerability[] {
  if (!query) return vulnerabilities;

  const lowerQuery = query.toLowerCase();
  const queryWords = lowerQuery.split(/\s+/).filter(Boolean);

  return vulnerabilities
    .map((vuln) => {
      const searchText = [
        vuln.cve,
        vuln.packageName,
        vuln.description,
        vuln.severity,
        vuln.groupName,
        vuln.repoName,
      ]
        .join(' ')
        .toLowerCase();

      // Calculate relevance score
      let score = 0;

      queryWords.forEach((word) => {
        if (searchText.includes(word)) {
          score += 1;
        }
      });

      // Exact match bonus
      if (searchText.includes(lowerQuery)) {
        score += 5;
      }

      // CVE exact match super bonus
      if (vuln.cve.toLowerCase() === lowerQuery) {
        score += 10;
      }

      return { vuln, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ vuln }) => vuln);
}

/**
 * Get trending vulnerabilities (most recent)
 */
export function getTrendingVulnerabilities(
  vulnerabilities: ProcessedVulnerability[],
  limit: number = 10
): ProcessedVulnerability[] {
  return [...vulnerabilities]
    .sort((a, b) => {
      const dateA = new Date(a.published).getTime();
      const dateB = new Date(b.published).getTime();
      return dateB - dateA;
    })
    .slice(0, limit);
}

/**
 * Get most critical vulnerabilities
 */
export function getCriticalVulnerabilities(
  vulnerabilities: ProcessedVulnerability[],
  limit: number = 10
): ProcessedVulnerability[] {
  return [...vulnerabilities]
    .filter((v) => v.severity === 'critical' || v.severity === 'high')
    .sort((a, b) => b.cvss - a.cvss)
    .slice(0, limit);
}
