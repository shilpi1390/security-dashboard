import { Outlet, Link, useLocation } from "react-router-dom";
import { Shield, BarChart3, List } from "lucide-react";
import "./Layout.css";

function Layout() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <Shield size={32} className="logo-icon" />
          <h1 className="logo-text">SecureViz</h1>
        </div>

        <div className="nav-links">
          <Link
            to="/dashboard"
            className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
          >
            <BarChart3 size={20} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/vulnerabilities"
            className={`nav-link ${isActive("/vulnerabilities") ? "active" : ""}`}
          >
            <List size={20} />
            <span>Vulnerabilities</span>
          </Link>
        </div>

        <div className="sidebar-footer">
          <div className="version">v1.0.0</div>
          <div className="credits">Security Dashboard</div>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
