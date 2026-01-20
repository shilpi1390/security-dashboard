# KaiSecurity - Security Vulnerability Dashboard

A modern, high-performance React-based dashboard for visualizing and analyzing security vulnerabilities in software ecosystems. Built to handle large datasets (300MB+) efficiently with advanced filtering, analysis modes, and interactive visualizations powered by Material-UI.

![Dashboard Preview](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue) ![Vite](https://img.shields.io/badge/Vite-7-purple) ![Material--UI](https://img.shields.io/badge/Material--UI-7-blue)

## Features

### Data Management

- **Efficient Large File Handling**: Streams and processes 300MB+ JSON files with progress tracking
- **IndexedDB Caching**: Automatic 24-hour cache for instant subsequent loads (supports 50MB+ datasets)
- **Smart Data Processing**: Denormalizes nested data structures for optimal query performance
- **Virtualized Lists**: Uses `@tanstack/react-virtual` to render thousands of vulnerabilities smoothly at 60fps
- **In-Memory Filtering**: Lightning-fast client-side filtering and search (<100ms response time)

### Analysis Modes

- **All Vulnerabilities**: View complete unfiltered dataset (Shield icon)
- **Analysis Mode**: Shows ONLY CVEs marked as "invalid - norisk" (Filter icon with animated sparkle)
- **AI Analysis Mode**: Shows ONLY CVEs marked as "ai-invalid-norisk" (Brain icon with animated sparkle)
- **Animated Mode Selector**:
  - Toggle button group with Material-UI styling
  - Sparkle animation overlays on active filter modes
  - Pop and fade animation with rotation (2-second loop)
  - Filter count badge showing number of statuses filtered
  - Tooltips with mode descriptions
  - Visual feedback showing current mode and percentage of data visible

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
- **Material-UI Multi-Select Dropdowns**:
  - Conditional border notching (complete border when unfocused, notched when active)
  - Floating labels with smooth transitions
  - Severity levels with color-coded badges
  - Package types with checkboxes
  - Risk factors with multi-select
  - Status filtering with comprehensive options
  - Selected values displayed as removable chips
  - Individual X buttons to remove selections
  - Clean, modern Material Design styling
- **Active Filters Banner**: Visual display of applied filters with individual clear buttons
- **Additional Filters**:
  - Date ranges for trend filtering
  - KaiStatus values for analysis modes
- **Filter Combinations**: Apply multiple filters simultaneously (AND logic)
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

- **Code Splitting**: Lazy-loaded route components reduce initial bundle size by ~40%
- **Manual Chunk Splitting**:
  - React vendor bundle (react, react-dom, react-router-dom)
  - Charts bundle (recharts)
  - Query bundle (@tanstack libraries)
  - Better long-term caching and faster updates
- **Memoization**: Extensive use of `useMemo` and `useCallback` for expensive calculations
- **Virtualization**: Only renders visible items (10-15 rows) in lists of thousands
- **IndexedDB Caching**: 24-hour cache reduces server load and enables offline access
- **Optimized Dependencies**: Pre-bundled dependencies for faster development startup

## Tech Stack

### Core Framework

- **React 19.2.0** - Modern functional components with hooks and concurrent features
- **TypeScript 5.9** - Type-safe development with strict mode
- **Vite 7.2.4** - Fast build tool with HMR and optimizations

### UI & Styling

- **Material-UI (@mui/material) 7.3.7** - Comprehensive component library with Material Design
- **Lucide React 0.562.0** - Modern, beautiful icon library
- **Custom Theme** - Dark mode optimized with custom color palette

### State Management & Data

- **React Context API** - Global state management for vulnerabilities and filters
- **@tanstack/react-query 5.90.19** - Server state management with caching strategies
- **@tanstack/react-virtual 3.13.18** - Virtual scrolling for performant large lists
- **IndexedDB** - Client-side caching for large datasets

### Routing & Navigation

- **React Router DOM 7.12.0** - Client-side routing with lazy-loaded pages

### Data Visualization

- **Recharts 3.6.0** - Composable charting library for interactive visualizations

### Utilities

- **date-fns 4.1.0** - Modern date manipulation and formatting

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
│   └── ui_demo.json                    # (Optional) Local vulnerability dataset
├── src/
│   ├── components/                     # Reusable UI components
│   │   ├── AnalysisModeSelector.tsx   # Toggle for analysis modes with sparkle animation
│   │   ├── FilterPanel.tsx            # Advanced multi-select filter controls
│   │   ├── Layout.tsx                 # Main layout with Material-UI sidebar
│   │   ├── LoadingSpinner.tsx         # Loading overlay with progress bar
│   │   └── MultiSelectDropdown.tsx    # Reusable Material-UI dropdown with chips
│   ├── context/                        # React Context for state management
│   │   └── VulnerabilityContext.tsx   # Global vulnerability state and actions
│   ├── pages/                          # Route page components (lazy-loaded)
│   │   ├── Dashboard.tsx              # Main dashboard with charts and metrics
│   │   ├── VulnerabilityList.tsx      # Virtualized table of vulnerabilities
│   │   ├── VulnerabilityDetail.tsx    # Individual vulnerability details
│   │   └── Comparison.tsx             # Side-by-side comparison view
│   ├── types/                          # TypeScript type definitions
│   │   └── vulnerability.ts           # Comprehensive vulnerability interfaces
│   ├── utils/                          # Utility functions
│   │   ├── dataLoader.ts              # Data loading, processing, statistics, export
│   │   ├── filterUtils.ts             # Filtering, sorting, and search logic
│   │   └── cacheManager.ts            # IndexedDB caching operations
│   ├── App.tsx                         # Main app component with routing
│   ├── App.css                         # Global styles
│   ├── theme.ts                        # Material-UI theme customization (dark mode)
│   ├── config.ts                       # Configuration (data source URL)
│   ├── main.tsx                        # React application entry point
│   └── index.css                       # Base CSS variables and resets
├── package.json
├── tsconfig.json / tsconfig.app.json
├── vite.config.ts                      # Vite build configuration with chunk optimization
├── vercel.json                         # Deployment configuration
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

- **Initial load**: ~10-15 seconds (370MB file from GitHub LFS) or ~2-3 seconds (local file)
- **Cached load**: <2 second (IndexedDB cache hit)
- **Filtering**: <100ms for most operations
- **Virtual list rendering**: Consistent 60fps scrolling with thousands of items
- **Build size**: ~630KB (gzipped total)
  - React vendor: ~150KB
  - Charts: ~350KB
  - Query libraries: ~50KB
  - App code: ~80KB

## UI/UX Features

### Material Design Components

- **Theme System**: Custom dark mode theme with professional color palette
- **Responsive Layout**: Permanent sidebar navigation (260px) with main content area
- **Interactive Elements**: Hover effects, transitions, and click feedback
- **Accessibility**: Keyboard navigation, ARIA labels, screen reader support
- **Typography**: Consistent Material-UI typography scale
- **Color Coding**: Severity-based colors (Critical=Red, High=Orange, Medium=Yellow, Low=Blue)

### Animations & Transitions

- **Sparkle Animation**: Pop, fade, and rotate effect on analysis mode icons
- **Smooth Transitions**: 200ms ease-in-out for state changes
- **Loading States**: Progress bar with percentage tracking
- **Hover Effects**: Interactive feedback on charts and buttons

### User Experience

- **Click-to-Filter Charts**: Navigate from dashboard visualizations to filtered lists
- **Active Filter Display**: Visual chips showing all applied filters with individual clear buttons
- **Filter Impact Banner**: Shows percentage of data visible when filters are active
- **Comparison Tool**: Select up to 5 vulnerabilities for side-by-side analysis
- **Export Options**: Download filtered data as JSON or CSV with timestamps
- **Error Handling**: Graceful error messages with retry options

## Implementation Documentation

For comprehensive technical documentation, architecture details, and implementation patterns:

- **[IMPLEMENTATION.md](IMPLEMENTATION.md)** - Complete technical implementation guide

## Deployment

The application is optimized for static hosting and can be deployed to:

- **Vercel** (recommended) - Zero-config deployment
- **Netlify** - Static site hosting
- **GitHub Pages** - Free static hosting
- **AWS S3 + CloudFront** - Scalable CDN deployment
- **Azure Static Web Apps** - Enterprise hosting

Build command: `npm run build`
Output directory: `dist/`

## License

This project is licensed under the MIT License.
