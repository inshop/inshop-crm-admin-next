"use client";

import * as React from "react";
import List from "@mui/material/List";
import PeopleIcon from "@mui/icons-material/People";
import SecurityIcon from "@mui/icons-material/Security";
import GroupsIcon from "@mui/icons-material/Groups";
import FaceIcon from "@mui/icons-material/Face";
import HistoryIcon from "@mui/icons-material/History";
import NavMenuItem from "@/app/(dashboard)/navMenuItem";
import { useAuth } from "@/providers/AuthProvider";

export interface MenuItemType {
  name: string;
  icon: React.ReactNode;
  path?: string;
  entity?: string;
  children?: MenuItemType[];
}

export function isMenuPathActive(pathname: string, menuPath: string): boolean {
  return pathname === menuPath || pathname.startsWith(`${menuPath}/`);
}

export function hasActiveMenuChild(
  pathname: string,
  children?: MenuItemType[],
): boolean {
  return (
    children?.some(
      (child) => child.path && isMenuPathActive(pathname, child.path),
    ) ?? false
  );
}

export function filterMenuItemsByPermission(
  items: MenuItemType[],
  canList: (entity: string) => boolean,
): MenuItemType[] {
  return items.flatMap((item) => {
    if (item.children) {
      const children = filterMenuItemsByPermission(item.children, canList);
      if (children.length === 0) return [];
      return [{ ...item, children }];
    }
    if (item.entity && !canList(item.entity)) return [];
    return [item];
  });
}

const menuItems: MenuItemType[] = [
  {
    name: "Clients",
    path: "/clients",
    entity: "client",
    icon: <PeopleIcon />,
  },
  {
    name: "Permissions",
    icon: <SecurityIcon />,
    children: [
      {
        name: "Users",
        path: "/permissions/users",
        entity: "user",
        icon: <FaceIcon />,
      },
      {
        name: "Groups",
        path: "/permissions/groups",
        entity: "group",
        icon: <GroupsIcon />,
      },
      {
        name: "Audit Log",
        path: "/permissions/audit",
        entity: "audit",
        icon: <HistoryIcon />,
      },
    ],
  },
];

export default function NavMenu() {
  const { canList } = useAuth();
  const visibleItems = filterMenuItemsByPermission(menuItems, canList);

  return (
    <List>
      {visibleItems.map((menuItem) => (
        <NavMenuItem
          key={menuItem.path ?? menuItem.name}
          menuItem={menuItem}
        />
      ))}
    </List>
  );
}
