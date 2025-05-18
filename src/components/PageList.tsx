'use client'

import * as React from 'react'
import {useClientsControllerFindAllQuery} from "@/lib/redux/features/clients";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CustomDataGrid from "@/components/CustomDataGrid";

export default function PageList() {
  return (
    <>
      <Typography variant="h2">Clients</Typography>

      <Box sx={{ width: '100%', mt: 4 }}>
        <CustomDataGrid query={useClientsControllerFindAllQuery}></CustomDataGrid>
      </Box>
    </>
  )
}
