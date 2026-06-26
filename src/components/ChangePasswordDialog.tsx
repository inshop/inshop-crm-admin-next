"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import CustomDialog from "@/components/CustomDialog";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ChangePasswordDialog({ open, onClose }: Props) {
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const close = () => {
    setPassword("");
    setConfirm("");
    setError(null);
    setIsSubmitting(false);
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "Failed to change password");
      }

      close();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to change password");
      setIsSubmitting(false);
    }
  };

  return (
    <CustomDialog open={open} handleClose={close} maxWidth="xs" title="Change password">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <FormControl>
          <FormLabel htmlFor="password">New password</FormLabel>
          <TextField
            id="password"
            type="password"
            autoComplete="new-password"
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="confirm">Confirm password</FormLabel>
          <TextField
            id="confirm"
            type="password"
            autoComplete="new-password"
            required
            fullWidth
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </FormControl>
        {error && (
          <Alert severity="error" sx={{ py: 0.5 }}>
            {error}
          </Alert>
        )}
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save"}
        </Button>
      </Box>
    </CustomDialog>
  );
}
