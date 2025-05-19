'use client'

import * as React from 'react'
import {DataGrid, GridColDef} from '@mui/x-data-grid'
import {useMemo} from "react"
import {UseQuery} from '@reduxjs/toolkit/src/query/react/buildHooks'

interface CustomDataGridType {
  query: UseQuery<unknown>,
  columns: GridColDef[],
}

export default function CustomDataGrid({ query, columns }: CustomDataGridType) {
  const { data, error, isLoading } = query({
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
