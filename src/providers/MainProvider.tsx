'use client'

import {AppRouterCacheProvider} from "@mui/material-nextjs/v15-appRouter";
import {ThemeProvider} from "@mui/material/styles";
import theme from "@/app/theme";
import StoreProvider from "@/providers/StoreProvider";

export default function MainProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <StoreProvider>{children}</StoreProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}
