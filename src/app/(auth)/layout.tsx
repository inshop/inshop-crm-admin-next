"use client";

import { styled } from "@mui/material/styles";
import MuiCard from "@mui/material/Card";
import Stack from "@mui/material/Stack";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "420px",
  },
  borderRadius: 10,
  border: "1px solid #E2E8F0",
  boxShadow:
    "0 4px 6px -1px rgba(0,0,0,0.05), 0 20px 60px -12px rgba(37,99,235,0.12), 0 0 0 1px rgba(0,0,0,0.03)",
}));

const AuthContainer = styled(Stack)({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  position: "relative",
  "&::before": {
    content: '""',
    display: "block",
    position: "fixed",
    zIndex: -1,
    inset: 0,
    backgroundImage: [
      "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37,99,235,0.15) 0%, transparent 60%)",
      "radial-gradient(ellipse 40% 40% at 80% 80%, rgba(124,58,237,0.08) 0%, transparent 60%)",
      "linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)",
    ].join(", "),
    backgroundRepeat: "no-repeat",
  },
});

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthContainer
      direction="column"
      sx={{ justifyContent: "center", alignItems: "center", p: { xs: 2, sm: 4 } }}
    >
      <Card variant="outlined">{children}</Card>
    </AuthContainer>
  );
}
