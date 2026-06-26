"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Suspense } from "react";
import Loading from "@/app/(dashboard)/loading";
import NavMenu from "./navMenu";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Divider, useMediaQuery, useTheme, alpha } from "@mui/material";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useAuth } from "@/providers/AuthProvider";
import ChangePasswordDialog from "@/components/ChangePasswordDialog";
import { api } from "@/lib/redux/api";
import type { AppDispatch } from "@/lib/redux/store";
import FlagIcon from "@mui/icons-material/Flag";

const drawerWidth = 256;

function TopBarBrand() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: "8px",
          background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 4px 12px rgba(37,99,235,0.4)",
        }}
      >
        <FlagIcon sx={{ fontSize: 16, color: "#fff" }} />
      </Box>
      <Box>
        <Typography
          sx={{
            fontSize: "0.9375rem",
            fontWeight: 700,
            color: "#F8FAFC",
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
          }}
        >
          Feature Flags
        </Typography>
        <Typography
          sx={{
            fontSize: "0.6rem",
            color: "#475569",
            lineHeight: 1,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Admin Console
        </Typography>
      </Box>
    </Box>
  );
}

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"), { noSsr: true });
  const [drawerOpen, setDrawerOpen] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [changePasswordOpen, setChangePasswordOpen] = React.useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, logout } = useAuth();

  React.useEffect(() => {
    if (isMobile) setDrawerOpen(false);
  }, [isMobile]);

  const showDrawer = !isMobile && drawerOpen;

  const handleDrawerToggle = () => setDrawerOpen((open) => !open);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSignOut = async () => {
    handleClose();
    try {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      // Ignore errors, proceed with redirect
    }
    logout();
    dispatch(api.util.resetApiState());
    router.replace("/");
  };

  const drawerContent = (
    <Box sx={{ overflow: "auto", py: 1 }}>
      <NavMenu />
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="toggle sidebar"
            onClick={handleDrawerToggle}
            sx={{
              mr: 1,
              color: "#94A3B8",
              "&:hover": { backgroundColor: alpha("#94A3B8", 0.1), color: "#F8FAFC" },
            }}
          >
            <MenuIcon />
          </IconButton>

          <TopBarBrand />

          <Box sx={{ flexGrow: 1 }} />

          {user && (
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                gap: 1,
                mr: 0.5,
              }}
            >
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "#F1F5F9", lineHeight: 1.2 }}
                >
                  {user.name}
                </Typography>
                <Typography sx={{ fontSize: "0.6875rem", color: "#64748B", lineHeight: 1 }}>
                  {user.email}
                </Typography>
              </Box>
            </Box>
          )}

          <IconButton
            aria-label="account menu"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            sx={{
              color: "#94A3B8",
              "&:hover": { backgroundColor: alpha("#94A3B8", 0.1), color: "#F8FAFC" },
            }}
          >
            <AccountCircleIcon />
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() => {
                handleClose();
                setChangePasswordOpen(true);
              }}
            >
              Change password
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={handleSignOut} sx={{ color: "error.main" }}>
              Sign out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {isMobile ? (
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
          }}
        >
          <Toolbar />
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="persistent"
          open={drawerOpen}
          sx={{
            flexShrink: 0,
            width: drawerOpen ? drawerWidth : 0,
            overflow: "hidden",
            transition: "width 0.2s ease",
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              transition: "transform 0.2s ease",
            },
          }}
        >
          <Toolbar />
          {drawerContent}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          backgroundColor: "background.default",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </Box>
      </Box>

      <ChangePasswordDialog
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
    </Box>
  );
}
