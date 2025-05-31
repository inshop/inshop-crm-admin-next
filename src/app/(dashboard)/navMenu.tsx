'use client'

import * as React from 'react';
import List from '@mui/material/List';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import GroupsIcon from '@mui/icons-material/Groups';
import FaceIcon from '@mui/icons-material/Face';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import NavMenuItem from "@/app/(dashboard)/navMenuItem";

export interface MenuItemType {
  name: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItemType[];
}

const menuItems: MenuItemType[] = [{
  name: 'Clients',
  path: '/clients',
  icon: <PeopleIcon />,
}, {
  name: 'Permissions',
  icon: <SecurityIcon />,
  children: [{
    name: 'Users',
    path: '/permissions/users',
    icon: <FaceIcon />,
  }, {
    name: 'Groups',
    path: '/permissions/groups',
    icon: <GroupsIcon />,
  }, {
    name: 'Modules',
    path: '/permissions/modules',
    icon: <ViewModuleIcon />,
  }]
}]

export default function NavMenu() {
  return (
    <List>
      {menuItems.map((menuItem, index) => (
        <NavMenuItem key={index} menuItem={menuItem}></NavMenuItem>
      ))}
    </List>
  );
}
