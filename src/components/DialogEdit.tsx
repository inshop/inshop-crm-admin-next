import CustomDialog from "@/components/CustomDialog";

interface DialogDetailsProps {
  entity: string
  open: boolean
  handleClose(): void
  id: number
}

const DialogDetails = ({ entity, open, handleClose, id }: DialogDetailsProps) => {
  return (
    <CustomDialog open={open} handleClose={handleClose}>
      Edit form for row ID: {id}
    </CustomDialog>
  )
}

export default DialogDetails
