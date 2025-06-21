import CustomDialog from "@/components/CustomDialog";
import {useEffect, useState} from "react";
import {capitalize} from "@mui/material";
import pluralize from "pluralize";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CustomTableData from "@/components/CustomTableData";

interface DialogDetailsProps {
  entity: string
  open: boolean
  handleClose(): void
  id: number
}

const DialogDetails = ({ entity, open, handleClose, id }: DialogDetailsProps) => {
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
        Create {capitalize(entity)}
      </Typography>

      <Box sx={{ width: '100%', mt: 4 }}>
        {api && <CustomTableData
            entity={entity}
            query={api[key]}
            id={id}
        ></CustomTableData>}
      </Box>
    </CustomDialog>
  )
}

export default DialogDetails
