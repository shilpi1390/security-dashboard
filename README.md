# KaiSecurity - Security Vulnerability Dashboard

A modern, high-performance React-based dashboard for visualizing and analyzing security vulnerabilities in software ecosystems. Built to handle large datasets (300MB+) efficiently with advanced filtering, analysis modes, and interactive visualizations.

![Dashboard Preview](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Vite](https://img.shields.io/badge/Vite-6-purple)

## Features

### Data Management

- **Efficient Large File Handling**: Streams and processes 300MB+ JSON files with progress tracking
- **Smart Data Processing**: Denormalizes nested data structures for optimal query performance
- **Virtualized Lists**: Uses `@tanstack/react-virtual` to render thousands of vulnerabilities smoothly
- **In-Memory Filtering**: Lightning-fast client-side filtering and search

### Analysis Modes

- **All Vulnerabilities**: View complete unfiltered dataset
- **Analysis Mode**: Filters out CVEs marked as "invalid - norisk"
- **AI Analysis Mode**: Filters out CVEs marked as "ai-invalid-norisk"
- **Creative UI**: Animated mode selector with visual feedback and filter impact display

### Dashboard & Visualizations

- **Key Metrics Cards**: Total vulnerabilities, critical/high counts, affected packages, fix availability
- **Interactive Charts** (click to filter vulnerabilities):
  - **Severity Distribution**: Pie chart - click segments to filter by severity
  - **Fix Status Chart**: Bar chart - click to filter by fix availability
  - **Analysis Status**: Bar chart - click to filter by analysis status
  - **Trend Analysis**: Line chart - click data points to filter by month
  - All charts feature hover effects, smart tooltips, and zero-value filtering
- **Top Critical List**: Clickable list of most severe vulnerabilities

### Advanced Search & Filtering

- **Real-time Search**: Search across CVE IDs, package names, descriptions, and more
- **Modern Multiselect Dropdowns**:
  - Severity levels with color-coded badges
  - Package types (searchable dropdown)
  - Risk factors (searchable dropdown)
  - Tag-based selection with individual remove buttons
  - Select All / Clear All quick actions
- **Active Filters Banner**: Visual display of applied filters with individual clear buttons
- **Additional Filters**:
  - Date ranges for trend filtering
  - KaiStatus values for analysis modes
- **Filter Combinations**: Apply multiple filters simultaneously
- **Smart Reset**: Clear all filters with one click

### Vulnerability Management

- **Detailed View**: Complete vulnerability information including:
  - CVE details and CVSS scores
  - Package information and versions
  - Risk factors and timeline
  - Fix status and applicable rules
  - Context (group, repository, image)
- **Comparison Tool**:
  - Compare up to 5 vulnerabilities side-by-side
  - Insights on common risk factors
  - Statistical analysis of selected items
- **Export Functionality**: Export filtered data as JSON or CSV

### Performance Optimizations

- **Code Splitting**: Lazy-loaded route components reduce initial bundle size
- **Memoization**: React hooks optimize re-renders
- **Virtualization**: Only renders visible items in large lists
- **Chunk Optimization**: Vendor code separated for better caching

## Tech Stack

- **React 18** - Modern functional components with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **@tanstack/react-query** - Server state management
- **@tanstack/react-virtual** - Virtual scrolling for lists
- **Recharts** - Data visualization library
- **Lucide React** - Beautiful icon set
- **date-fns** - Date manipulation utilities

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Navigate to the project directory

```bash
cd security-dashboard
```

2. Install dependencies

```bash
npm install
```

3. Configure the data source:

**Option A: Use GitHub URL (Default)**
The app is pre-configured to load data from GitHub LFS:

```
https://media.githubusercontent.com/media/chanduusc/Ui-Demo-Data/main/ui_demo.json
```

No additional setup needed!

**Note:** The file uses Git LFS (Large File Storage), so we use the `media.githubusercontent.com` URL instead of the regular raw URL.

**Option B: Use Local File**

- Place your `ui_demo.json` file in the `public/` directory
- Update `src/config.ts` to use local path:

```typescript
export const DATA_SOURCE_URL = "/ui_demo.json";
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

Build the optimized production bundle:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
security-dashboard/
├── public/
│   └── ui_demo.json           # Large vulnerability dataset
├── src/
│   ├── components/            # Reusable components
│   │   ├── AnalysisModeSelector.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── Layout.tsx
│   │   └── LoadingSpinner.tsx
│   ├── context/               # React Context providers
│   │   └── VulnerabilityContext.tsx
│   ├── pages/                 # Route pages
│   │   ├── Dashboard.tsx
│   │   ├── VulnerabilityList.tsx
│   │   ├── VulnerabilityDetail.tsx
│   │   └── Comparison.tsx
│   ├── types/                 # TypeScript definitions
│   │   └── vulnerability.ts
│   ├── utils/                 # Utility functions
│   │   ├── dataLoader.ts      # Data loading & processing
│   │   └── filterUtils.ts     # Filtering & sorting logic
│   ├── App.tsx                # Main app component
│   ├── App.css                # Global styles
│   └── main.tsx               # Entry point
├── package.json
├── tsconfig.json
├── vite.config.ts             # Vite configuration
└── README.md
```

## Data Model

The application expects a JSON file with the following structure:

```typescript
{
  "name": "default",
  "groups": {
    "group-name": {
      "name": "group-name",
      "repos": {
        "repo-name": {
          "name": "repo-name",
          "images": {
            "version": {
              "name": "image-name",
              "version": "1.0.0",
              "vulnerabilities": [
                {
                  "cve": "CVE-2024-12345",
                  "severity": "high",
                  "cvss": 8.1,
                  "status": "fixed in 2.0.0",
                  "kaiStatus": "ai-invalid-norisk",
                  "description": "...",
                  "packageName": "package-name",
                  "packageVersion": "1.0.0",
                  "packageType": "jar",
                  "published": "2024-01-01",
                  "riskFactors": {
                    "Attack vector: network": {},
                    "High severity": {}
                  }
                  // ... additional fields
                }
              ]
            }
          }
        }
      }
    }
  }
}
```

## Key Features Implementation

### Analysis Mode Filtering

The application implements two special filtering modes:

1. **Analysis Mode**: Shows ONLY vulnerabilities with `kaiStatus: "invalid - norisk"` (manually marked as invalid/no-risk)
2. **AI Analysis Mode**: Shows ONLY vulnerabilities with `kaiStatus: "ai-invalid-norisk"` (AI-marked as invalid/no-risk)

These modes use inclusive filtering to help security teams focus on specific vulnerability classifications for review and validation.

### Performance Considerations

- **Streaming Data Load**: Large JSON files are loaded with fetch API streaming
- **Progress Tracking**: Visual progress bar during data loading
- **Efficient Data Structure**: Nested data is flattened into a searchable array
- **Memoized Calculations**: Statistics and filtered results are cached
- **Virtual Scrolling**: Only renders visible rows in large tables

### Filter Impact Visualization

When analysis modes are active, a prominent banner shows:

- Current mode name
- Number of vulnerabilities visible vs total
- Percentage of dataset shown
- Visual indicators with animations

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)

## Performance Metrics

- Initial load: ~10-15 seconds (370MB file from GitHub LFS) or ~2-3 seconds (local file)
- Filtering: <100ms for most operations
- Virtual list rendering: 60fps scrolling
- Build size: ~500KB (gzipped)

## Implementation Documentation

- **[IMPLEMENTATION.md](IMPLEMENTATION.md)** - Detailed technical implementation docs

## License

This project is licensed under the MIT License.
