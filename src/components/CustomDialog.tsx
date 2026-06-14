import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import { ReactNode } from "react";
import type { Breakpoint } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";

interface DialogDetailsProps {
  open: boolean;
  handleClose(): void;
  children: ReactNode;
  fullScreen?: boolean;
  maxWidth?: Breakpoint | false;
  contentSx?: SxProps<Theme>;
}

const CustomDialog = ({
  open,
  handleClose,
  children,
  fullScreen = false,
  maxWidth = "md",
  contentSx,
}: DialogDetailsProps) => {
  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullScreen={fullScreen}
      maxWidth={fullScreen ? false : maxWidth}
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
      <DialogContent sx={fullScreen ? undefined : { pt: 1, ...contentSx }}>
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
