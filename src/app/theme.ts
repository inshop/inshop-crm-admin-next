"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-roboto)",
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        input: ({ theme }) => {
          const bg = (theme.vars ?? theme).palette.background.paper;
          const color = (theme.vars ?? theme).palette.text.primary;
          const autofillStyles = {
            WebkitBoxShadow: `0 0 0 100px ${bg} inset`,
            WebkitTextFillColor: color,
            caretColor: color,
            transition: "background-color 5000s ease-in-out 0s",
          };

          return {
            "&:-webkit-autofill": autofillStyles,
            "&:-webkit-autofill:hover": autofillStyles,
            "&:-webkit-autofill:focus": autofillStyles,
            "&:-webkit-autofill:active": autofillStyles,
          };
        },
      },
    },
  },
});

export default theme;
