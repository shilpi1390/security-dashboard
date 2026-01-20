import { Outlet, Link, useLocation } from "react-router-dom";
import { Shield, BarChart3, List } from "lucide-react";
import {
  Box,
  Drawer,
  List as MuiList,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

const DRAWER_WIDTH = 260;

function Layout() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            backgroundColor: "background.paper",
            borderRight: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        {/* Sidebar Header */}
        <Box
          sx={{
            padding: 3,
            background: "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Shield size={32} color="white" />
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "white",
              letterSpacing: "-0.02em",
            }}
          >
            KaiSecurity
          </Typography>
        </Box>

        {/* Navigation Links */}
        <MuiList sx={{ px: 2, py: 3, flexGrow: 1 }}>
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={Link}
              to="/dashboard"
              selected={isActive("/dashboard")}
              sx={{
                borderRadius: 1,
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                  "& .MuiListItemIcon-root": {
                    color: "white",
                  },
                },
                "&:hover": {
                  backgroundColor: "rgba(139, 92, 246, 0.08)",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                <BarChart3 size={20} />
              </ListItemIcon>
              <ListItemText
                primary="Dashboard"
                slotProps={{ primary: { fontWeight: 500 } }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/vulnerabilities"
              selected={isActive("/vulnerabilities")}
              sx={{
                borderRadius: 1,
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                  "& .MuiListItemIcon-root": {
                    color: "white",
                  },
                },
                "&:hover": {
                  backgroundColor: "rgba(139, 92, 246, 0.08)",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                <List size={20} />
              </ListItemIcon>
              <ListItemText
                primary="Vulnerabilities"
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        </MuiList>

        {/* Sidebar Footer */}
        <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
          <Typography variant="caption" display="block" color="text.secondary">
            v1.0.0
          </Typography>
          <Typography variant="caption" display="block" color="text.disabled">
            Security Dashboard
          </Typography>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "background.default",
          minHeight: "100vh",
          overflow: "auto",
          padding: "32px",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;
