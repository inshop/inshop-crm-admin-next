'use client'

import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {MenuItemType} from "@/app/(dashboard)/navMenu";

interface MenuItemProps {
  menuItem: MenuItemType;
  sx?: object;
}

export default function NavMenuItemPath({ menuItem, sx }: MenuItemProps) {
  return (
    <ListItemButton href={menuItem.path || '#'} sx={sx}>
      <ListItemIcon>{menuItem.icon}</ListItemIcon>
      <ListItemText primary={menuItem.name} />
    </ListItemButton>
  );
}
