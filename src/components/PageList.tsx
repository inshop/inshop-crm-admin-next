'use client'

import * as React from 'react'
import {useClientsControllerFindAllQuery} from "@/lib/redux/features/clients";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CustomDataGrid from "@/components/CustomDataGrid";
import {GridColDef} from "@mui/x-data-grid";

interface PageListType {
  title: string,
  entity: string,
  columns: GridColDef[],
}

export default function PageList({ title, entity, columns }: PageListType) {
  return (
    <>
      <Typography variant="h2">{title}</Typography>

      <Box sx={{ width: '100%', mt: 4 }}>
        <CustomDataGrid query={useClientsControllerFindAllQuery} columns={columns}></CustomDataGrid>
      </Box>
    </>
  )
}
