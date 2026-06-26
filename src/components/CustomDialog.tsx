import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import { ReactNode } from "react";
import type { Breakpoint } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";
import { Divider } from "@mui/material";

interface CustomDialogProps {
  open: boolean;
  handleClose(): void;
  children: ReactNode;
  title?: string;
  fullScreen?: boolean;
  maxWidth?: Breakpoint | false;
  contentSx?: SxProps<Theme>;
}

const CustomDialog = ({
  open,
  handleClose,
  children,
  title,
  fullScreen = false,
  maxWidth = "md",
  contentSx,
}: CustomDialogProps) => {
  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullScreen={fullScreen}
      maxWidth={fullScreen ? false : maxWidth}
      fullWidth={!fullScreen}
      scroll="body"
    >
      <DialogTitle
        sx={{
          m: 0,
          p: fullScreen ? undefined : "12px 16px 12px 20px",
          display: "flex",
          alignItems: "center",
          gap: 1,
          minHeight: 52,
        }}
      >
        <span
          style={{
            flex: 1,
            fontSize: "1.0625rem",
            fontWeight: 600,
            color: "#0F172A",
            letterSpacing: "-0.01em",
            lineHeight: 1.3,
          }}
        >
          {title ?? ""}
        </span>

        <IconButton
          aria-label="close"
          onClick={handleClose}
          size="small"
          sx={{
            flexShrink: 0,
            color: "text.disabled",
            "&:hover": { color: "text.secondary", backgroundColor: "action.hover" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent
        sx={
          fullScreen
            ? undefined
            : { pt: 2.5, px: 2.5, pb: 3, overflowY: "visible", ...contentSx }
        }
      >
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
