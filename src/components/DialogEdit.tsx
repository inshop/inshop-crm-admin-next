import CustomDialog from "@/components/CustomDialog";

interface DialogDetailsProps {
  open: boolean
  handleClose(): void
  rowId: number
}

const DialogDetails = ({ open, handleClose, rowId }: DialogDetailsProps) => {
  return (
    <CustomDialog open={open} handleClose={handleClose}>
      Edit form for row ID: {rowId}
    </CustomDialog>
  )
}

export default DialogDetails
