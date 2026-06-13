import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import { ReactNode } from "react";

interface DialogDetailsProps {
  open: boolean;
  handleClose(): void;
  children: ReactNode;
  fullScreen?: boolean;
}

const CustomDialog = ({
  open,
  handleClose,
  children,
  fullScreen = false,
}: DialogDetailsProps) => {
  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullScreen={fullScreen}
      maxWidth={fullScreen ? false : "md"}
      fullWidth={!fullScreen}
    >
      <DialogTitle sx={{ m: 0, p: fullScreen ? undefined : 1 }}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ top: 8, right: 10, position: "absolute", color: "grey.500" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={fullScreen ? undefined : { pt: 1 }}>
        {fullScreen ? (
          <Grid container spacing={6}>
            <Grid>{children}</Grid>
          </Grid>
        ) : (
          children
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
