'use client'

import * as React from 'react'
import {useClientsControllerFindAllQuery} from "@/lib/redux/features/clients";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {useMemo} from "react";

// export const metadata: Metadata = {
//   title: "Clients",
//   description: "Clients",
// }

const columns: GridColDef<(typeof rows)[number]>[] = [
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

export default function SignIn() {
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
    <>
      <Typography variant="h2">Clients</Typography>

      <Box sx={{ width: '100%', mt: 4 }}>
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
      </Box>
    </>
  )
}
