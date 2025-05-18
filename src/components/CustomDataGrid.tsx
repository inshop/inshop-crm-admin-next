'use client'

import * as React from 'react'
import {useClientsControllerFindAllQuery} from "@/lib/redux/features/clients";
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {useMemo} from "react";

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

type CustomDataGridType = {
  query: string
}

export default function CustomDataGrid({ query }: CustomDataGridType) {
  const { data, error, isLoading } = useClientsControllerFindAllQuery({
    take: 10,
    skip: 0
  })

  const rows = useMemo(() => {
    if (data) {
      return data[0].map((client: any) => ({
        id: client.id,
        name: client.name,
        email: client.email,
        isActive: client.isActive
      }))
    }

    return []
  }, [data])

  // console.log('data', data, error, isLoading)

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 5,
          },
        },
      }}
      pageSizeOptions={[5, 10, 20]}
      // checkboxSelection
      disableRowSelectionOnClick
    />
  )
}
