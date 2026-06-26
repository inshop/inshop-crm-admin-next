"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { capitalize } from "@mui/material";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import RoleCheckboxesField from "@/components/RoleCheckboxesField";
import { extractItems } from "@/lib/extract-items";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

export interface FieldConfig {
  name: string;
  type?:
    | "text"
    | "password"
    | "textarea"
    | "boolean"
    | "select"
    | "multiselect"
    | "role-checkboxes"
    | "date";
  label?: string;
  options?: { id: number; label: string }[];
  optionsUrl?: string;
  /** Path format: "items.roles" to extract nested arrays, or "flat" (default) for top-level array */
  optionsPath?: string;
  optionLabelKey?: string;
  autoComplete?: string;
  getDefaultValue?: () => unknown;
  required?: boolean;
}

interface FormFieldProps {
  config: FieldConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (field: string, value: any) => void;
  /** When false, option loading is deferred (e.g. dialog closed). */
  enabled?: boolean;
  error?: boolean;
}

export default function FormField({
  config,
  value,
  onChange,
  enabled = true,
  error = false,
}: FormFieldProps) {
  const label = config.label || capitalize(config.name.replace(/_/g, " "));
  const type = config.type || inferType(config.name);

  const shouldFetchOptions =
    (type === "select" || type === "multiselect") && !!config.optionsUrl;

  const [options, setOptions] = useState<{ id: number; label: string }[]>(
    config.options || [],
  );
  const [loadingOptions, setLoadingOptions] = useState(false);

  useEffect(() => {
    if (!shouldFetchOptions || !enabled) return;

    let cancelled = false;
    setLoadingOptions(true);

    fetch(config.optionsUrl!, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (cancelled) return;

        const labelKey = config.optionLabelKey || "name";
        const items = extractItems(data, config.optionsPath);
        setOptions(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          items.map((item: any) => ({
            id: item.id,
            label: item[labelKey] || String(item.id),
          })),
        );
      })
      .catch(() => {
        if (!cancelled) setOptions([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingOptions(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    shouldFetchOptions,
    enabled,
    config.optionsUrl,
    config.optionsPath,
    config.optionLabelKey,
  ]);

  switch (type) {
    case "boolean":
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={value === true || value === "true"}
              onChange={(e) => onChange(config.name, e.target.checked)}
            />
          }
          label={label}
          sx={{ mb: 2, display: "block" }}
        />
      );

    case "textarea":
      return (
        <TextField
          fullWidth
          multiline
          rows={4}
          label={label}
          value={value || ""}
          onChange={(e) => onChange(config.name, e.target.value)}
          sx={{ mb: 2 }}
        />
      );

    case "password":
      return (
        <TextField
          fullWidth
          label={label}
          value={value || ""}
          onChange={(e) => onChange(config.name, e.target.value)}
          type="password"
          autoComplete={config.autoComplete ?? "new-password"}
          sx={{ mb: 2 }}
        />
      );

    case "select":
      return (
        <Autocomplete
          options={options}
          loading={loadingOptions}
          getOptionLabel={(opt) => opt.label}
          isOptionEqualToValue={(opt, val) => opt.id === val.id}
          value={options.find((o) => o.id === value?.id || o.id === value) || null}
          onChange={(_, newVal) => onChange(config.name, newVal ? newVal.id : null)}
          renderInput={(params) => (
            <TextField
              label={label}
              error={error}
              id={params.id}
              disabled={params.disabled}
              fullWidth={params.fullWidth}
              size={params.size}
              slotProps={{
                inputLabel: {
                  ...params.slotProps.inputLabel,
                  required: config.required,
                },
                htmlInput: params.slotProps.htmlInput,
                input: {
                  ...params.slotProps.input,
                  endAdornment: (
                    <>
                      {loadingOptions && <CircularProgress size={20} />}
                      {params.slotProps.input.endAdornment}
                    </>
                  ),
                },
              }}
              sx={{ mb: 2 }}
            />
          )}
          sx={{ mb: 2 }}
        />
      );

    case "multiselect":
      return (
        <Autocomplete
          multiple
          options={options}
          loading={loadingOptions}
          getOptionLabel={(opt) => opt.label}
          isOptionEqualToValue={(opt, val) => opt.id === val.id}
          value={options.filter((o) =>
            Array.isArray(value)
              ? value.some((v: { id: number } | number) =>
                  typeof v === "object" ? v.id === o.id : v === o.id,
                )
              : false,
          )}
          onChange={(_, newVal) => onChange(config.name, newVal.map((v) => v.id))}
          renderInput={(params) => (
            <TextField
              label={label}
              error={error}
              id={params.id}
              disabled={params.disabled}
              fullWidth={params.fullWidth}
              size={params.size}
              slotProps={{
                inputLabel: {
                  ...params.slotProps.inputLabel,
                  required: config.required,
                },
                htmlInput: params.slotProps.htmlInput,
                input: {
                  ...params.slotProps.input,
                  endAdornment: (
                    <>
                      {loadingOptions && <CircularProgress size={20} />}
                      {params.slotProps.input.endAdornment}
                    </>
                  ),
                },
              }}
              sx={{ mb: 2 }}
            />
          )}
          sx={{ mb: 2 }}
        />
      );

    case "date":
      return (
        <DatePicker
          label={label}
          value={
            value
              ? dayjs(String(value).slice(0, 10))
              : null
          }
          onChange={(newValue: Dayjs | null) =>
            onChange(
              config.name,
              newValue?.isValid() ? newValue.format("YYYY-MM-DD") : null,
            )
          }
          slotProps={{
            field: { clearable: !config.required },
            textField: {
              fullWidth: true,
              error,
              sx: { mb: 2 },
              slotProps: {
                inputLabel: { required: config.required },
              },
            },
          }}
        />
      );

    case "role-checkboxes":
      return (
        <RoleCheckboxesField
          label={label}
          modulesUrl={config.optionsUrl || "/api/admin/modules?take=100&skip=0"}
          value={value}
          onChange={(newVal) => onChange(config.name, newVal)}
          enabled={enabled}
        />
      );

    default:
      return (
        <TextField
          fullWidth
          label={label}
          value={value || ""}
          onChange={(e) => onChange(config.name, e.target.value)}
          autoComplete={config.autoComplete}
          required={config.required}
          error={error}
          sx={{ mb: 2 }}
        />
      );
  }
}

function inferType(name: string): FieldConfig["type"] {
  if (name === "password") return "password";
  if (name.startsWith("is") || name.startsWith("has")) return "boolean";
  if (name === "description" || name === "content" || name === "notes") return "textarea";
  if (name === "expiresAt" || name.endsWith("At")) return "date";
  return "text";
}

export function validateFormFields(
  fields: FieldConfig[],
  data: Record<string, unknown>,
): string | null {
  for (const field of fields) {
    if (!field.required) continue;

    const label = field.label || field.name.replace(/_/g, " ");
    const value = data[field.name];

    if (field.type === "multiselect") {
      if (!Array.isArray(value) || value.length === 0) {
        return `${label} is required`;
      }
      continue;
    }

    if (value === null || value === undefined || value === "") {
      return `${label} is required`;
    }
  }

  return null;
}
