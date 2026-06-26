"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import FlagIcon from "@mui/icons-material/Flag";
import { useRouter } from "next/navigation";
import { useAuthControllerLoginMutation } from "@/lib/redux/features/auth";
import { useAuth } from "@/providers/AuthProvider";

export default function Form() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const router = useRouter();
  const [loginMutation] = useAuthControllerLoginMutation();
  const { login: authLogin } = useAuth();

  const validateInputs = () => {
    setEmailError(false);
    setEmailErrorMessage("");
    setPasswordError(false);
    setPasswordErrorMessage("");

    if (!email) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      return false;
    }

    if (!password) {
      setPasswordError(true);
      setPasswordErrorMessage("Password cannot be empty.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (!validateInputs()) return;

    try {
      setIsSubmitting(true);
      const result = (await loginMutation({
        loginAuthDto: { email, password },
      }).unwrap()) as {
        user?: { id: number; name: string; email: string; roles: string[] };
      };
      if (result?.user) {
        authLogin(result.user);
      }
      router.replace("/feature-flags");
    } catch (e: unknown) {
      setSubmitError(
        (e as { data: { message: string } }).data.message || "Login failed",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "10px",
            background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
            boxShadow: "0 8px 24px rgba(37,99,235,0.35)",
          }}
        >
          <FlagIcon sx={{ fontSize: 22, color: "#fff" }} />
        </Box>

        <Typography
          component="h1"
          sx={{
            fontSize: "1.375rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#0F172A",
            lineHeight: 1.2,
          }}
        >
          Welcome back
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Sign in to Feature Flags Admin
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}
      >
        <FormControl>
          <FormLabel
            htmlFor="email"
            sx={{ fontSize: "0.8125rem", fontWeight: 500, mb: 0.5 }}
          >
            Email address
          </FormLabel>
          <TextField
            error={emailError}
            helperText={emailErrorMessage}
            id="email"
            type="email"
            name="email"
            placeholder="you@company.com"
            autoComplete="email"
            autoFocus
            required
            fullWidth
            variant="outlined"
            size="medium"
            color={emailError ? "error" : "primary"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon sx={{ fontSize: 18, color: "text.disabled" }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </FormControl>

        <FormControl>
          <FormLabel
            htmlFor="password"
            sx={{ fontSize: "0.8125rem", fontWeight: 500, mb: 0.5 }}
          >
            Password
          </FormLabel>
          <TextField
            error={passwordError}
            helperText={passwordErrorMessage}
            name="password"
            placeholder="••••••••"
            type="password"
            id="password"
            autoComplete="current-password"
            required
            fullWidth
            variant="outlined"
            size="medium"
            color={passwordError ? "error" : "primary"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ fontSize: 18, color: "text.disabled" }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </FormControl>

        {submitError && (
          <Alert severity="error" sx={{ py: 0.5 }}>
            {submitError}
          </Alert>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isSubmitting}
          size="large"
          sx={{ mt: 0.5, py: 1.25 }}
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </Box>
    </>
  );
}
