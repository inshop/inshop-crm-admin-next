"use client";

import { memo } from "react";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { EnvironmentRow } from "@/app/(dashboard)/feature-flags/featureFlagEnv";

type EnvFilterValue = "true" | "false";

interface EnvironmentFilterTogglesProps {
  environments: EnvironmentRow[];
  values: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

const TOGGLE_ENABLED_SX = {
  "&.Mui-selected": { color: "success.main", bgcolor: "success.50" },
} as const;

const TOGGLE_DISABLED_SX = {
  "&.Mui-selected": { color: "error.main", bgcolor: "error.50" },
} as const;

export default memo(function EnvironmentFilterToggles({
  environments,
  values,
  onChange,
}: EnvironmentFilterTogglesProps) {
  if (environments.length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", gap: 2, overflowX: "auto", my: 1 }}>
      {environments.map((env) => {
        const field = `env_${env.id}`;
        const current = values[field] as EnvFilterValue | undefined;

        return (
          <Box
            key={env.id}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.5,
              flexShrink: 0,
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 500 }}>
              {env.name}
            </Typography>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={current ?? ""}
              onChange={(_, next: EnvFilterValue | null) => {
                onChange(field, next ?? "");
              }}
              aria-label={`Filter ${env.name}`}
            >
              <ToggleButton
                value="true"
                aria-label={`${env.name} enabled`}
                sx={TOGGLE_ENABLED_SX}
              >
                <CheckCircleOutlineOutlinedIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton
                value="false"
                aria-label={`${env.name} disabled`}
                sx={TOGGLE_DISABLED_SX}
              >
                <HighlightOffIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        );
      })}
    </Box>
  );
});
