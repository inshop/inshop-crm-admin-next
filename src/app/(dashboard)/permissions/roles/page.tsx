import * as React from 'react'
import type {Metadata} from "next";
import {GridColDef} from "@mui/x-data-grid";
import PageList from "@/components/PageList";

const title = 'Roles'
const entity = 'role'

export const metadata: Metadata = {
  title,
  description: title,
}

export default function Page() {
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 0.4,
      minWidth: 200,
      editable: true,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'email',
      headerName: 'email',
      flex: 0.4,
      minWidth: 200,
      editable: true,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'isActive',
      headerName: 'Active',
      type: 'boolean',
      flex: 0.1,
      minWidth: 100,
      editable: true,
      sortable: false,
      disableColumnMenu: true,
    }
  ];

  return (
    <PageList title={title} entity={entity} columns={columns}></PageList>
  )
}
