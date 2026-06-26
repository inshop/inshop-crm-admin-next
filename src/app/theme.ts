"use client";

import { createTheme, alpha } from "@mui/material/styles";

const palette = {
  primary: "#2563EB",
  primaryLight: "#3B82F6",
  primaryDark: "#1D4ED8",
  secondary: "#7C3AED",
  bgDefault: "#F1F5F9",
  bgPaper: "#FFFFFF",
  sidebarBg: "#0F172A",
  sidebarBorder: "#1E293B",
  sidebarText: "#94A3B8",
  sidebarTextActive: "#F8FAFC",
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  border: "#E2E8F0",
  success: "#16A34A",
  error: "#DC2626",
  warning: "#D97706",
};

const radius = {
  sm: 6,   // chips, tooltips, menu items, list items in diffs
  md: 8,   // buttons, inputs, icon buttons
  lg: 10,  // cards, papers, dialogs, accordions, alerts, menus — the global base
};

const autofillStyles = (bg: string, color: string) => ({
  WebkitBoxShadow: `0 0 0 100px ${bg} inset`,
  WebkitTextFillColor: color,
  caretColor: color,
  transition: "background-color 5000s ease-in-out 0s",
});

const theme = createTheme({
  palette: {
    primary: {
      main: palette.primary,
      light: palette.primaryLight,
      dark: palette.primaryDark,
    },
    secondary: { main: palette.secondary },
    background: { default: palette.bgDefault, paper: palette.bgPaper },
    text: { primary: palette.textPrimary, secondary: palette.textSecondary },
    divider: palette.border,
    success: { main: palette.success },
    error: { main: palette.error },
    warning: { main: palette.warning },
  },

  shape: { borderRadius: radius.lg },

  typography: {
    fontFamily: "var(--font-roboto)",
    h2: {
      fontSize: "1.5rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
      color: palette.textPrimary,
    },
    h6: { fontSize: "1rem", fontWeight: 600, letterSpacing: "-0.01em" },
    body2: { fontSize: "0.8125rem", lineHeight: 1.5 },
    button: { textTransform: "none", fontWeight: 600 },
    caption: { fontSize: "0.75rem", color: palette.textSecondary },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: palette.bgDefault },
      },
    },

    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: palette.sidebarBg,
          borderBottom: `1px solid ${palette.sidebarBorder}`,
          color: "#F8FAFC",
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: palette.sidebarBg,
          borderRight: "none",
          color: palette.sidebarText,
        },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: radius.md,
          paddingInline: "16px",
          paddingBlock: "8px",
          fontSize: "0.875rem",
        },
        contained: {
          background: `linear-gradient(135deg, ${palette.primaryLight} 0%, ${palette.primaryDark} 100%)`,
          "&:hover": {
            background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.primaryDark} 100%)`,
          },
        },
        outlined: {
          borderColor: palette.border,
          color: palette.textPrimary,
          "&:hover": {
            backgroundColor: palette.bgDefault,
            borderColor: palette.primary,
          },
        },
      },
    },

    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: `1px solid ${palette.border}`,
          borderRadius: radius.lg,
        },
      },
    },

    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        outlined: {
          borderColor: palette.border,
          borderRadius: radius.lg,
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: radius.sm,
          fontWeight: 500,
          fontSize: "0.75rem",
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          fontSize: "0.75rem",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: palette.textSecondary,
          backgroundColor: palette.bgDefault,
        },
        root: {
          borderColor: palette.border,
          fontSize: "0.8125rem",
          padding: "16px 20px",
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:last-child td": { borderBottom: 0 },
          "&:hover": { backgroundColor: alpha(palette.primary, 0.03) },
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: radius.lg,
          boxShadow:
            "0 20px 60px -12px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.05)",
          border: "none",
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: "1.0625rem",
          fontWeight: 600,
          color: palette.textPrimary,
          paddingBottom: 0,
        },
      },
    },

    MuiAccordion: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: `1px solid ${palette.border}`,
          borderRadius: `${radius.lg}px !important`,
          "&:before": { display: "none" },
          "&.Mui-expanded": {
            boxShadow: `0 4px 12px ${alpha(palette.primary, 0.08)}`,
          },
        },
      },
    },

    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          borderRadius: radius.lg,
          minHeight: 52,
          "&.Mui-expanded": {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            borderBottom: `1px solid ${palette.border}`,
          },
        },
      },
    },

    MuiTextField: {
      defaultProps: { variant: "outlined", size: "small" },
    },

    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: `${radius.md}px !important`,
        },
        input: ({ theme }) => {
          const bg = (theme.vars ?? theme).palette.background.paper;
          const color = (theme.vars ?? theme).palette.text.primary;
          const styles = autofillStyles(bg, color);
          return {
            "&:-webkit-autofill": styles,
            "&:-webkit-autofill:hover": styles,
            "&:-webkit-autofill:focus": styles,
            "&:-webkit-autofill:active": styles,
          };
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: palette.border,
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: radius.md,
          marginInline: 8,
          marginBlock: 2,
          paddingBlock: 9,
          color: palette.sidebarText,
          transition: "background-color 0.15s, color 0.15s",
          "& .MuiListItemIcon-root": {
            color: palette.sidebarText,
            minWidth: 36,
            transition: "color 0.15s",
          },
          "& .MuiListItemText-primary": {
            fontSize: "0.875rem",
            fontWeight: 500,
          },
          "&:hover": {
            backgroundColor: alpha("#94A3B8", 0.12),
            color: "#E2E8F0",
            "& .MuiListItemIcon-root": { color: "#E2E8F0" },
          },
          "&.Mui-selected": {
            backgroundColor: alpha(palette.primary, 0.18),
            color: "#93C5FD",
            "& .MuiListItemIcon-root": { color: "#93C5FD" },
            "& .MuiListItemText-primary": { fontWeight: 600 },
            "&:hover": {
              backgroundColor: alpha(palette.primary, 0.25),
            },
          },
        },
      },
    },

    MuiAlert: {
      defaultProps: { variant: "outlined" },
      styleOverrides: {
        root: {
          borderRadius: radius.lg,
          fontSize: "0.875rem",
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: { borderColor: palette.border },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: radius.lg,
          border: `1px solid ${palette.border}`,
          boxShadow:
            "0 8px 24px -4px rgba(0,0,0,0.12), 0 2px 8px -2px rgba(0,0,0,0.08)",
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          borderRadius: radius.sm,
          marginInline: 4,
          "&:hover": { backgroundColor: alpha(palette.primary, 0.06) },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: radius.md,
          transition: "background-color 0.15s",
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: radius.sm,
          fontSize: "0.75rem",
          backgroundColor: palette.sidebarBg,
        },
      },
    },

    MuiCircularProgress: {
      styleOverrides: {
        root: { color: palette.primary },
      },
    },
  },
});

export default theme;
