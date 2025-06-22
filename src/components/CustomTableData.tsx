'use client'

import * as React from 'react'
import {Alert, capitalize, CircularProgress} from '@mui/material';
import {UseQuery} from '@reduxjs/toolkit/src/query/react/buildHooks'
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';

interface CustomTableDataType {
  query: UseQuery<unknown>,
  columns: string[],
  id: number,
  canView?: boolean
  canEdit?: boolean
  canDelete?: boolean
}

export default function CustomTableData({
    query,
    columns,
    id,
  }: CustomTableDataType) {

  const { data, error, isLoading } = query({ id })

  const renderValue = (value: unknown): string => {
    if (value === null || value === undefined) return '-'
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
  }

  return (
    <>
      {error && <Alert severity="error" sx={{mb: 2}}>{error.error || error.data.message}</Alert>}
      {isLoading && <Box sx={{
        width: '100px',
        display: 'flex',
        margin: '100px auto'
      }}>
          <CircularProgress />
      </Box>}

      <TableContainer component={Paper}>
        <Table sx={{ width: '100%', tableLayout: 'fixed' }}>
          <TableBody>
            {data && columns.map((column) => (
              <TableRow key={column}>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    fontWeight: 'bold',
                    width: '200px',
                    backgroundColor: 'rgba(0, 0, 0, 0.02)'
                  }}
                >
                  {capitalize(column.replace(/_/g, ' '))}
                </TableCell>
                <TableCell>{renderValue(data[column])}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
