"use client";

import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Collapse, alpha } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { usePathname } from "next/navigation";
import { hasActiveMenuChild, MenuItemType } from "@/app/(dashboard)/navMenu";
import NavMenuItemPath from "@/app/(dashboard)/navMenuItemPath";

interface MenuItemProps {
  menuItem: MenuItemType;
}

export default function NavMenuItem({ menuItem }: MenuItemProps) {
  const pathname = usePathname();
  const childActive = hasActiveMenuChild(pathname, menuItem.children);
  const [open, setOpen] = React.useState(childActive);

  React.useEffect(() => {
    setOpen(childActive);
  }, [childActive]);

  if (menuItem.path) {
    return <NavMenuItemPath menuItem={menuItem} />;
  }

  if (!menuItem.children || menuItem.children.length === 0) return null;

  return (
    <List disablePadding>
      <Box
        sx={{
          px: 2,
          pt: 2,
          pb: 0.5,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box
          sx={{
            color: "#475569",
            display: "flex",
            "& svg": { fontSize: 14 },
          }}
        >
          {menuItem.icon}
        </Box>
        <Typography
          sx={{
            fontSize: "0.6875rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#475569",
          }}
        >
          {menuItem.name}
        </Typography>
      </Box>

      <List component="div" disablePadding>
        {menuItem.children.map((child, index) => (
          <NavMenuItemPath
            key={index}
            menuItem={child}
            sx={{ pl: 2 }}
          />
        ))}
      </List>
    </List>
  );
}
