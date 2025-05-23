'use client'

import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {Collapse} from "@mui/material";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {MenuItemType} from "@/app/(dashboard)/menu";
import MenuItemPath from "@/app/(dashboard)/menuItemPath";

interface MenuItemProps {
  menuItem: MenuItemType;
}

export default function MenuItem({ menuItem }: MenuItemProps) {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <List>
      {menuItem.path && <MenuItemPath menuItem={menuItem}></MenuItemPath>}

      {menuItem.children && menuItem.children.length > 0 && <>
        <ListItemButton onClick={handleClick}>
          <ListItemIcon>{menuItem.icon}</ListItemIcon>
          <ListItemText primary={menuItem.name} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {menuItem.children.map((menuItem, index) => (
              <MenuItemPath key={index} menuItem={menuItem}></MenuItemPath>
            ))}
          </List>
        </Collapse>
      </>}
    </List>
  );
}
