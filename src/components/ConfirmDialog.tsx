"use client";

import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import CustomDialog from "@/components/CustomDialog";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title = "Confirm",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <CustomDialog
      open={open}
      handleClose={loading ? () => {} : onCancel}
      maxWidth="xs"
      title={title}
    >
      <DialogContent sx={{ px: 0, pt: 0, pb: 1 }}>
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
          <WarningAmberIcon sx={{ color: "warning.main", mt: 0.25, flexShrink: 0 }} />
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {message}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 0, pb: 0, gap: 1 }}>
        <Button onClick={onCancel} disabled={loading} variant="outlined" size="small">
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          size="small"
          disabled={loading}
          color="error"
          autoFocus
        >
          {loading ? <CircularProgress size={16} color="inherit" /> : confirmLabel}
        </Button>
      </DialogActions>
    </CustomDialog>
  );
}
