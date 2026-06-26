"use client";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { usePathname } from "next/navigation";
import { isMenuPathActive, MenuItemType } from "@/app/(dashboard)/navMenu";
import type { SxProps, Theme } from "@mui/material/styles";

interface MenuItemProps {
  menuItem: MenuItemType;
  sx?: SxProps<Theme>;
}

export default function NavMenuItemPath({ menuItem, sx }: MenuItemProps) {
  const pathname = usePathname();
  const isActive = menuItem.path
    ? isMenuPathActive(pathname, menuItem.path)
    : false;

  return (
    <ListItemButton href={menuItem.path || "#"} selected={isActive} sx={sx}>
      <ListItemIcon>{menuItem.icon}</ListItemIcon>
      <ListItemText primary={menuItem.name} />
    </ListItemButton>
  );
}
