import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { VulnerabilityProvider } from './context/VulnerabilityContext';
import { theme } from './theme';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

// Lazy load pages for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const VulnerabilityList = lazy(() => import('./pages/VulnerabilityList'));
const VulnerabilityDetail = lazy(() => import('./pages/VulnerabilityDetail'));
const Comparison = lazy(() => import('./pages/Comparison'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <VulnerabilityProvider>
          <Router>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="vulnerabilities" element={<VulnerabilityList />} />
                  <Route path="vulnerabilities/:id" element={<VulnerabilityDetail />} />
                  <Route path="comparison" element={<Comparison />} />
                </Route>
              </Routes>
            </Suspense>
          </Router>
        </VulnerabilityProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
