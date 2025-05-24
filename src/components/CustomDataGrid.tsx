'use client'

import * as React from 'react'
import {DataGrid, GridActionsCellItem, GridColDef, GridRowParams, GridSortModel} from '@mui/x-data-grid'
import {useMemo, useState} from "react"
import {Alert} from "@mui/material";
import {UseQuery} from '@reduxjs/toolkit/src/query/react/buildHooks'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import DialogDetails from "@/components/DialogDetails";
import DialogEdit from "@/components/DialogEdit";

interface CustomDataGridType {
  query: UseQuery<unknown>,
  columns: GridColDef[],
  canView: boolean
  canEdit: boolean
  canDelete: boolean
}

const pageSizeOptions = [5, 10, 25, 50, 100]

export default function CustomDataGrid({
    query,
    columns,
    canView = true,
    canEdit = true,
    canDelete = true
  }: CustomDataGridType) {

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [sortModel, setSortModel] = useState<GridSortModel>([])
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false)
  const [editOpen, setEditOpen] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<number|null>(null)

  const handleRowClick = (params: GridRowParams) => {
    if (canView && params.row.id) {
      setSelectedRow(params.row.id)
      setDetailsOpen(true)
    }
  }

  const handleEdit = (params: GridRowParams) => {
    if (canEdit && params.row.id) {
      setSelectedRow(params.row.id)
      setEditOpen(true)
    }
  }

  const handleDelete = (params: GridRowParams) => {
    if (canDelete && params.row.id && confirm('Are you sure you want to delete this item?')) {
      console.log('Delete row:', params.row)
    }
  }

  const _columns = useMemo(() => {
    const _columns = [...columns]

    if (canEdit || canDelete) {
      _columns.push({
        flex: 0.1,
        minWidth: 150,
        sortable: false,
        disableColumnMenu: true,
        field: 'actions',
        headerName: 'Actions',
        type: 'actions',
        getActions: (params: GridRowParams) => {
          const actions = []

          if (canEdit) {
            actions.push(
              <GridActionsCellItem
                key="edit"
                icon={<EditIcon />}
                onClick={() => handleEdit(params)}
                label="Edit"
              />
            )
          }

          if (canDelete) {
            actions.push(
              <GridActionsCellItem
                key="delete"
                icon={<DeleteIcon />}
                onClick={() => handleDelete(params)}
                label="Remove"
              />
            )
          }

          return actions
        }
      })
    }

    return _columns
  }, [columns, canEdit, canDelete])

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
        columns={_columns}
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
        onRowClick={handleRowClick}
        disableRowSelectionOnClick
        loading={isLoading}
        slotProps={{
          loadingOverlay: {
            variant: 'circular-progress',
            noRowsVariant: 'circular-progress',
          },
        }}
        sx={{
          '& .MuiDataGrid-row:hover': {
            cursor: canView ? 'pointer' : ''
          },
        }}
      />
      {selectedRow && <>
        <DialogDetails open={detailsOpen} handleClose={() => setDetailsOpen(false)} rowId={selectedRow}></DialogDetails>
        <DialogEdit open={editOpen} handleClose={() => setEditOpen(false)} rowId={selectedRow}></DialogEdit>
      </>}
    </>
  )
}
