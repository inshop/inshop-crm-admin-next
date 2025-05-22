'use client'

import * as React from 'react'
import {DataGrid, GridColDef, GridSortModel} from '@mui/x-data-grid'
import {useMemo, useState} from "react"
import {Alert} from "@mui/material";
import {UseQuery} from '@reduxjs/toolkit/src/query/react/buildHooks'

interface CustomDataGridType {
  query: UseQuery<unknown>,
  columns: GridColDef[],
}

const pageSizeOptions = [5, 10, 25, 50, 100]

export default function CustomDataGrid({ query, columns }: CustomDataGridType) {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [sortModel, setSortModel] = useState<GridSortModel>([])

  const { data, error, isLoading } = query({
    take: paginationModel.pageSize,
    skip: paginationModel.page * paginationModel.pageSize,
  })

  const rows = useMemo(() => data && data[0] || [], [data])
  const rowCount = useMemo(() => data && data[1] || 0, [data])

  return (
    <>
      {error && <Alert severity="error" sx={{mb: 2}}>{error.error || error.data.message}</Alert>}
      <DataGrid
        rows={rows}
        rowCount={rowCount}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={pageSizeOptions}
        paginationModel={paginationModel}
        paginationMode='server'
        onPaginationModelChange={setPaginationModel}
        sortModel={sortModel}
        sortingMode='server'
        onSortModelChange={setSortModel}
        // checkboxSelection
        disableRowSelectionOnClick
        loading={isLoading}
        slotProps={{
          loadingOverlay: {
            variant: 'circular-progress',
            noRowsVariant: 'circular-progress',
          },
        }}
      />
    </>
  )
}
