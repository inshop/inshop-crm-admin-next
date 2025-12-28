"use client";

import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Collapse } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { MenuItemType } from "@/app/(dashboard)/navMenu";
import NavMenuItemPath from "@/app/(dashboard)/navMenuItemPath";

interface MenuItemProps {
  menuItem: MenuItemType;
}

export default function NavMenuItem({ menuItem }: MenuItemProps) {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <List disablePadding>
      {menuItem.path && <NavMenuItemPath menuItem={menuItem}></NavMenuItemPath>}

      {menuItem.children && menuItem.children.length > 0 && (
        <>
          <ListItemButton onClick={handleClick}>
            <ListItemIcon>{menuItem.icon}</ListItemIcon>
            <ListItemText primary={menuItem.name} />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {menuItem.children.map((menuItem, index) => (
                <NavMenuItemPath
                  key={index}
                  menuItem={menuItem}
                  sx={{ pl: 4 }}
                ></NavMenuItemPath>
              ))}
            </List>
          </Collapse>
        </>
      )}
    </List>
  );
}
