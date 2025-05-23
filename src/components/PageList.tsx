'use client'

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CustomDataGrid from "@/components/CustomDataGrid";
import {GridColDef} from "@mui/x-data-grid";
import {capitalize} from "@mui/material";
import pluralize from "pluralize";
import {useEffect, useState} from "react";

interface PageListType {
  title: string,
  entity: string,
  columns: GridColDef[],
}

export default function PageList({ title, entity, columns }: PageListType) {
  const [api, setApi] = useState(null)
  const key = `use${capitalize(pluralize(entity))}ControllerFindAllQuery`;

  useEffect(() => {
    (async () => {
      setApi(await import('@/lib/redux/features/' + pluralize(entity)))
    })()
  }, [entity])

  return (
    <>
      <Typography variant="h2">{title}</Typography>

      <Box sx={{ width: '100%', mt: 4 }}>
        {api && <CustomDataGrid query={api[key]} columns={columns}></CustomDataGrid>}
      </Box>
    </>
  )
}
