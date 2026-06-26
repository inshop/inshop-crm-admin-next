"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FormField, { FieldConfig, validateFormFields } from "@/components/FormField";
import {
  FeatureFlagEnvironmentValueDto,
  useFeatureFlagsControllerFindOneQuery,
  useFeatureFlagsControllerUpdateMutation,
} from "@/lib/redux/features/featureFlags";
import { useEnvironmentsControllerFindAllQuery } from "@/lib/redux/features/environments";

interface EnvironmentRow {
  id: number;
  name: string;
  code: string;
  isActive?: boolean;
}

const metadataFields: FieldConfig[] = [
  { name: "name", required: true },
  { name: "code", required: true },
  { name: "expiresAt", type: "date", label: "Expires at", required: true },
  {
    name: "projectIds",
    type: "multiselect",
    label: "Projects",
    required: true,
    optionsUrl: "/api/admin/projects?take=100&skip=0",
  },
];

export default function FeatureFlagEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: flag, error, isLoading } = useFeatureFlagsControllerFindOneQuery(
    { id },
    { skip: Number.isNaN(id) },
  );

  const { data: envData } = useEnvironmentsControllerFindAllQuery({
    take: 100,
    skip: 0,
  });

  const environments = useMemo((): EnvironmentRow[] => {
    const rows = (envData as [EnvironmentRow[], number] | undefined)?.[0];
    return rows ?? [];
  }, [envData]);

  const [updateFlag, { isLoading: saving }] =
    useFeatureFlagsControllerUpdateMutation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [envValues, setEnvValues] = useState<Record<number, boolean>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!flag || initialized) return;

    setFormData({
      name: flag.name,
      code: flag.code,
      expiresAt: flag.expiresAt ? String(flag.expiresAt).slice(0, 10) : "",
      projectIds: (flag.projects ?? []).map((p) => p.id),
    });

    const values: Record<number, boolean> = {};
    for (const env of environments) {
      values[env.id] =
        flag.environmentValues?.find((v) => v.environment.id === env.id)
          ?.enabled ?? false;
    }
    setEnvValues(values);
    setInitialized(true);
  }, [flag, environments, initialized]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEnvToggle = (environmentId: number, enabled: boolean) => {
    setEnvValues((prev) => ({ ...prev, [environmentId]: enabled }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);

    const environmentValues: FeatureFlagEnvironmentValueDto[] = Object.entries(
      envValues,
    ).map(([environmentId, enabled]) => ({
      environmentId: Number(environmentId),
      enabled,
    }));

    const payload = {
      name: formData.name,
      code: formData.code,
      expiresAt: formData.expiresAt || null,
      projectIds: formData.projectIds ?? [],
      environmentValues,
    };

    const validationError = validateFormFields(metadataFields, payload);
    if (validationError) {
      setSaveError(validationError);
      return;
    }

    try {
      await updateFlag({
        id,
        updateFeatureFlagDto: payload,
      }).unwrap();
      router.push("/feature-flags");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "data" in err
          ? (err as { data: { message?: string } }).data?.message
          : "Failed to update";
      setSaveError(message || "Failed to update");
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !flag) {
    return (
      <Alert severity="error">Failed to load feature flag</Alert>
    );
  }

  return (
    <>
      <Button
        component={Link}
        href="/feature-flags"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        Back to list
      </Button>

      <Typography variant="h2">Edit Feature Flag</Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        ID: {flag.id} · Created by: {flag.createdBy?.name ?? "—"}
      </Typography>

      {saveError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {saveError}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ mt: 4, maxWidth: 720 }}
      >
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Details
            </Typography>
            {metadataFields.map((field) => (
              <FormField
                key={field.name}
                config={field}
                value={formData[field.name]}
                onChange={handleChange}
              />
            ))}
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Environment values
            </Typography>
            {environments.map((env) => (
              <FormControlLabel
                key={env.id}
                control={
                  <Switch
                    checked={envValues[env.id] ?? false}
                    onChange={(e) => handleEnvToggle(env.id, e.target.checked)}
                  />
                }
                label={env.name}
                sx={{ display: "block", mb: 1 }}
              />
            ))}
            {environments.length === 0 && (
              <Typography color="text.secondary">
                No active environments found.
              </Typography>
            )}
          </CardContent>
        </Card>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={saving}
        >
          {saving ? <CircularProgress size={24} /> : "Save changes"}
        </Button>
      </Box>
    </>
  );
}
