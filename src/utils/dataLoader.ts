import type {
  VulnerabilityData,
  ProcessedVulnerability,
  DashboardStats,
  KaiStatus,
} from '../types/vulnerability';

/**
 * Processes raw vulnerability data into a flat, searchable structure
 * This creates a denormalized view optimized for filtering and searching
 */
export function processVulnerabilityData(
  data: VulnerabilityData
): ProcessedVulnerability[] {
  const processed: ProcessedVulnerability[] = [];
  let idCounter = 0;

  Object.entries(data.groups).forEach(([groupName, group]) => {
    Object.entries(group.repos).forEach(([repoName, repo]) => {
      Object.entries(repo.images).forEach(([version, image]) => {
        image.vulnerabilities.forEach((vuln) => {
          processed.push({
            ...vuln,
            id: `${groupName}-${repoName}-${version}-${vuln.cve}-${idCounter++}`,
            groupName,
            repoName,
            imageName: image.name,
            imageVersion: version,
          });
        });
      });
    });
  });

  return processed;
}

/**
 * Loads the JSON file with progress tracking
 * For large files, this uses fetch with streaming
 */
export async function loadVulnerabilityData(
  filePath: string,
  onProgress?: (progress: number) => void
): Promise<VulnerabilityData> {
  try {
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let receivedLength = 0;

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      chunks.push(value);
      receivedLength += value.length;

      if (onProgress && total > 0) {
        onProgress((receivedLength / total) * 100);
      }
    }

    // Combine chunks and decode
    const chunksAll = new Uint8Array(receivedLength);
    let position = 0;
    for (const chunk of chunks) {
      chunksAll.set(chunk, position);
      position += chunk.length;
    }

    const text = new TextDecoder('utf-8').decode(chunksAll);
    const data = JSON.parse(text) as VulnerabilityData;

    if (onProgress) {
      onProgress(100);
    }

    return data;
  } catch (error) {
    console.error('Error loading vulnerability data:', error);
    throw error;
  }
}

/**
 * Calculates dashboard statistics from processed vulnerabilities
 */
export function calculateStats(
  vulnerabilities: ProcessedVulnerability[]
): DashboardStats {
  const stats: DashboardStats = {
    totalVulnerabilities: vulnerabilities.length,
    criticalCount: 0,
    highCount: 0,
    mediumCount: 0,
    lowCount: 0,
    negligibleCount: 0,
    withFix: 0,
    withoutFix: 0,
    aiInvalidNorisk: 0,
    invalidNorisk: 0,
    uniquePackages: 0,
    uniqueCVEs: 0,
    statusFixed: 0,
    statusAffected: 0,
    statusOpen: 0,
    statusUnderInvestigation: 0,
    statusNoStatus: 0,
    statusWillNotFix: 0,
    statusNeeded: 0,
    statusDeferred: 0,
  };

  const uniquePackages = new Set<string>();
  const uniqueCVEs = new Set<string>();

  vulnerabilities.forEach((vuln) => {
    // Count by severity
    switch (vuln.severity.toLowerCase()) {
      case 'critical':
        stats.criticalCount++;
        break;
      case 'high':
        stats.highCount++;
        break;
      case 'medium':
        stats.mediumCount++;
        break;
      case 'low':
        stats.lowCount++;
        break;
      case 'negligible':
        stats.negligibleCount++;
        break;
    }

    // Count fixes
    if (vuln.status && vuln.status.toLowerCase().includes('fixed')) {
      stats.withFix++;
    } else {
      stats.withoutFix++;
    }

    // Count by detailed status
    const status = (vuln.status || '').trim().toLowerCase();
    if (!status) {
      stats.statusNoStatus++;
    } else if (status === 'deferred') {
      stats.statusDeferred++;
    } else if (status === 'affected') {
      stats.statusAffected++;
    } else if (status === 'needed') {
      stats.statusNeeded++;
    } else if (status === 'open') {
      stats.statusOpen++;
    } else if (status === 'under investigation') {
      stats.statusUnderInvestigation++;
    } else if (status.includes('will not fix') || status.includes('wontfix')) {
      stats.statusWillNotFix++;
    } else if (status.includes('fixed')) {
      stats.statusFixed++;
    } else {
      // Default to no status for unknown values
      stats.statusNoStatus++;
    }

    // Count kai status
    if (vuln.kaiStatus === 'ai-invalid-norisk') {
      stats.aiInvalidNorisk++;
    } else if (vuln.kaiStatus === 'invalid - norisk') {
      stats.invalidNorisk++;
    }

    // Collect unique values
    uniquePackages.add(`${vuln.packageName}@${vuln.packageVersion}`);
    uniqueCVEs.add(vuln.cve);
  });

  stats.uniquePackages = uniquePackages.size;
  stats.uniqueCVEs = uniqueCVEs.size;

  return stats;
}

/**
 * Filters vulnerabilities based on kaiStatus (inclusive)
 * If includeStatuses is null, returns all vulnerabilities
 * If includeStatuses is an array, returns only vulnerabilities with those statuses
 */
export function filterByKaiStatus(
  vulnerabilities: ProcessedVulnerability[],
  includeStatuses: KaiStatus[] | null
): ProcessedVulnerability[] {
  // null means show all vulnerabilities
  if (includeStatuses === null) {
    return vulnerabilities;
  }

  // Empty array means show all (no filter applied)
  if (includeStatuses.length === 0) {
    return vulnerabilities;
  }

  // Filter to show ONLY vulnerabilities with the specified kaiStatus values
  return vulnerabilities.filter(
    (vuln) => includeStatuses.includes(vuln.kaiStatus || '')
  );
}

/**
 * Gets unique values for filter options
 */
export function getUniqueFilterValues(vulnerabilities: ProcessedVulnerability[]) {
  const packageTypes = new Set<string>();
  const riskFactors = new Set<string>();
  const severities = new Set<string>();

  vulnerabilities.forEach((vuln) => {
    if (vuln.packageType) {
      packageTypes.add(vuln.packageType);
    }
    if (vuln.severity) {
      severities.add(vuln.severity);
    }
    Object.keys(vuln.riskFactors || {}).forEach((factor) => {
      riskFactors.add(factor);
    });
  });

  return {
    packageTypes: Array.from(packageTypes).sort(),
    riskFactors: Array.from(riskFactors).sort(),
    severities: Array.from(severities).sort(),
  };
}

/**
 * Exports filtered data to JSON
 */
export function exportToJSON(
  vulnerabilities: ProcessedVulnerability[],
  filename: string = 'vulnerabilities-export.json'
): void {
  const dataStr = JSON.stringify(vulnerabilities, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

/**
 * Exports filtered data to CSV
 */
export function exportToCSV(
  vulnerabilities: ProcessedVulnerability[],
  filename: string = 'vulnerabilities-export.csv'
): void {
  if (vulnerabilities.length === 0) {
    return;
  }

  // Define CSV headers
  const headers = [
    'CVE',
    'Severity',
    'CVSS',
    'Status',
    'KaiStatus',
    'Package Name',
    'Package Version',
    'Package Type',
    'Group',
    'Repository',
    'Image Version',
    'Published',
    'Fix Date',
    'Description',
  ];

  // Create CSV rows
  const rows = vulnerabilities.map((vuln) => [
    vuln.cve,
    vuln.severity,
    vuln.cvss,
    vuln.status,
    vuln.kaiStatus || '',
    vuln.packageName,
    vuln.packageVersion,
    vuln.packageType,
    vuln.groupName,
    vuln.repoName,
    vuln.imageVersion,
    vuln.published,
    vuln.fixDate,
    `"${vuln.description.replace(/"/g, '""')}"`, // Escape quotes
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}
