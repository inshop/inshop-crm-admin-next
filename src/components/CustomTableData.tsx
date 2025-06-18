'use client'

import * as React from 'react'
import {Alert, capitalize} from "@mui/material";
import {UseQuery} from '@reduxjs/toolkit/src/query/react/buildHooks'
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

interface CustomTableDataType {
  query: UseQuery<unknown>,
  entity: string,
  id: number,
  canView?: boolean
  canEdit?: boolean
  canDelete?: boolean
}

export default function CustomTableData({
    query,
    entity,
    id,
    canView = true,
    canEdit = true,
    canDelete = true
  }: CustomTableDataType) {

  const { data, error, isLoading } = query({ id })

  const renderValue = (value: any): string => {
    if (value === null || value === undefined) return '-'
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
  }

  return (
    <>
      {error && <Alert severity="error" sx={{mb: 2}}>{error.error || error.data.message}</Alert>}

      <TableContainer component={Paper}>
        <Table sx={{ width: '100%', tableLayout: 'fixed' }}>
          <TableBody>
            {data && Object.entries(data).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    fontWeight: 'bold',
                    width: '200px',
                    backgroundColor: 'rgba(0, 0, 0, 0.02)'
                  }}
                >
                  {capitalize(key.replace(/_/g, ' '))}
                </TableCell>
                <TableCell>{renderValue(value)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
