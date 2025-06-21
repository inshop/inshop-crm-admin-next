'use client'

import CustomDialog from "@/components/CustomDialog";
import {useEffect, useState} from "react";
import {capitalize} from "@mui/material";
import pluralize from "pluralize";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CustomTableData from "@/components/CustomTableData";

interface DialogDetailsProps {
  entity: string
  columns: string[]
  open: boolean
  handleClose(): void
  id: number
}

const DialogDetails = ({ entity, open, handleClose, id, columns }: DialogDetailsProps) => {
  const [api, setApi] = useState(null)
  const key = `use${capitalize(pluralize(entity))}ControllerFindOneQuery`

  useEffect(() => {
    (async () => {
      setApi(await import('@/lib/redux/features/' + pluralize(entity)))
    })()
  }, [entity])

  return (
    <CustomDialog open={open} handleClose={handleClose}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Edit {capitalize(entity)}
      </Typography>

      <Box sx={{ width: '100%', mt: 4 }}>
        {api && <CustomTableData
          columns={columns}
          query={api[key]}
          id={id}
        ></CustomTableData>}
      </Box>
    </CustomDialog>
  )
}

export default DialogDetails
