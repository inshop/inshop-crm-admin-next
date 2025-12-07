"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useAuthControllerLoginMutation } from "@/lib/redux/features/auth";

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
  const [login] = useAuthControllerLoginMutation();

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
      setPasswordErrorMessage("Password can not be empty.");

      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (!validateInputs()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await login({ loginAuthDto: { email, password } }).unwrap();
      router.replace("/clients");
    } catch(e) {
      setSubmitError(e.data.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        Sign in
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: 2,
        }}
      >
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            error={emailError}
            helperText={emailErrorMessage}
            id="email"
            type="email"
            name="email"
            placeholder="Your email"
            autoComplete="email"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={emailError ? "error" : "primary"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <TextField
            error={passwordError}
            helperText={passwordErrorMessage}
            name="password"
            placeholder="Your password"
            type="password"
            id="password"
            autoComplete="current-password"
            required
            fullWidth
            variant="outlined"
            color={passwordError ? "error" : "primary"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        {submitError && (
          <Typography color="error" variant="body2">
            {submitError}
          </Typography>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
        <Link
          href="/reset-password"
          component={NextLink}
          type="button"
          variant="body2"
          sx={{ alignSelf: "center" }}
        >
          Forgot your password?
        </Link>
      </Box>
    </>
  );
}
