'use client'

import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {MenuItemType} from "@/app/(dashboard)/menu";

interface MenuItemProps {
  menuItem: MenuItemType;
}

export default function MenuItemPath({ menuItem }: MenuItemProps) {
  return (
    <ListItemButton href={menuItem.path || '#'}>
      <ListItemIcon>{menuItem.icon}</ListItemIcon>
      <ListItemText primary={menuItem.name} />
    </ListItemButton>
  );
}
