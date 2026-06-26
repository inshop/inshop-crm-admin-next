"use client";

import * as React from "react";
import { useState } from "react";
import {
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import LayersIcon from "@mui/icons-material/Layers";
import ConfirmDialog from "@/components/ConfirmDialog";
import {
  FeatureFlag,
  useFeatureFlagsControllerUpdateEnvironmentValueMutation,
} from "@/lib/redux/features/featureFlags";
import {
  EnvironmentRow,
  PendingToggle,
  getEnvEnabled,
} from "@/app/(dashboard)/feature-flags/featureFlagEnv";

interface FeatureFlagEnvControlsProps {
  flag: FeatureFlag;
  environments: EnvironmentRow[];
  canUpdate: boolean;
  onUpdated?: () => void;
  onError?: (message: string) => void;
}

export default function FeatureFlagEnvControls({
  flag,
  environments,
  canUpdate,
  onUpdated,
  onError,
}: FeatureFlagEnvControlsProps) {
  const [pendingToggle, setPendingToggle] = useState<PendingToggle | null>(
    null,
  );

  const [updateEnvValue, { isLoading: isToggling }] =
    useFeatureFlagsControllerUpdateEnvironmentValueMutation();

  const requestToggle = (
    environmentId: number,
    environmentName: string,
    enabled: boolean,
  ) => {
    setPendingToggle({
      flagId: flag.id,
      flagName: flag.name,
      environmentId,
      environmentName,
      enabled,
    });
  };

  const handleConfirm = async () => {
    if (!pendingToggle) return;

    try {
      await updateEnvValue({
        id: pendingToggle.flagId,
        environmentId: pendingToggle.environmentId,
        updateFeatureFlagEnvironmentValueDto: {
          enabled: pendingToggle.enabled,
        },
      }).unwrap();
      setPendingToggle(null);
      onUpdated?.();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "data" in err
          ? (err as { data: { message?: string } }).data?.message
          : "Failed to update environment value";
      onError?.(message || "Failed to update environment value");
      setPendingToggle(null);
    }
  };

  if (environments.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: "10px" }}>
        <Typography color="text.secondary" variant="body2">
          No environments configured.
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
            bgcolor: "action.hover",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <LayersIcon fontSize="small" color="action" />
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Environment values
          </Typography>
        </Box>

        <Stack divider={<Divider flexItem />} spacing={0}>
          {environments.map((env) => {
            const enabled = getEnvEnabled(flag, env.id);

            return (
              <Box
                key={env.id}
                sx={{
                  px: 2,
                  py: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  flexWrap: "wrap",
                  transition: "background-color 0.15s ease",
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {env.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontFamily: "monospace" }}
                  >
                    {env.code}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    flexShrink: 0,
                  }}
                >
                  <Chip
                    label={enabled ? "Enabled" : "Disabled"}
                    size="small"
                    color={enabled ? "success" : "default"}
                    variant={enabled ? "filled" : "outlined"}
                    sx={{ minWidth: 84 }}
                  />
                  <Switch
                    checked={enabled}
                    disabled={!canUpdate}
                    onChange={(e) =>
                      requestToggle(env.id, env.name, e.target.checked)
                    }
                    slotProps={{
                      input: {
                        "aria-label": `${enabled ? "Disable" : "Enable"} ${env.name}`,
                      },
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Paper>

      <ConfirmDialog
        open={!!pendingToggle}
        title="Change environment value"
        message={
          pendingToggle
            ? `${pendingToggle.enabled ? "Enable" : "Disable"} "${pendingToggle.flagName}" in "${pendingToggle.environmentName}"?`
            : ""
        }
        confirmLabel={pendingToggle?.enabled ? "Enable" : "Disable"}
        loading={isToggling}
        onConfirm={handleConfirm}
        onCancel={() => setPendingToggle(null)}
      />
    </>
  );
}
