"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { capitalize } from "@mui/material";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import RoleCheckboxesField from "@/components/RoleCheckboxesField";

export interface FieldConfig {
  name: string;
  type?:
    | "text"
    | "password"
    | "textarea"
    | "boolean"
    | "select"
    | "multiselect"
    | "role-checkboxes";
  label?: string;
  options?: { id: number; label: string }[];
  optionsUrl?: string;
  /** Path format: "items.roles" to extract nested arrays, or "flat" (default) for top-level array */
  optionsPath?: string;
  optionLabelKey?: string;
  autoComplete?: string;
}

interface FormFieldProps {
  config: FieldConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (field: string, value: any) => void;
  /** When false, option loading is deferred (e.g. dialog closed). */
  enabled?: boolean;
}

export default function FormField({
  config,
  value,
  onChange,
  enabled = true,
}: FormFieldProps) {
  const label = config.label || capitalize(config.name.replace(/_/g, " "));
  const type = config.type || inferType(config.name);

  const shouldFetchOptions =
    (type === "select" || type === "multiselect") && !!config.optionsUrl;

  const [options, setOptions] = useState<{ id: number; label: string }[]>(
    config.options || [],
  );
  const [loadingOptions, setLoadingOptions] = useState(false);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!shouldFetchOptions || !enabled || hasFetchedRef.current) {
      return;
    }

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
        hasFetchedRef.current = true;
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
              {...params}
              label={label}
              slotProps={{
                input: {
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingOptions && <CircularProgress size={20} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                },
              }}
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
              {...params}
              label={label}
              slotProps={{
                input: {
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingOptions && <CircularProgress size={20} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                },
              }}
            />
          )}
          sx={{ mb: 2 }}
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
          sx={{ mb: 2 }}
        />
      );
  }
}

function inferType(name: string): FieldConfig["type"] {
  if (name === "password") return "password";
  if (name.startsWith("is") || name.startsWith("has")) return "boolean";
  if (name === "description" || name === "content" || name === "notes") return "textarea";
  return "text";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractItems(data: any, path?: string): any[] {
  if (!path || path === "flat") {
    return Array.isArray(data) ? (Array.isArray(data[0]) ? data[0] : data) : [];
  }

  const parts = path.split(".");
  let items = Array.isArray(data) ? (Array.isArray(data[0]) ? data[0] : data) : [];

  for (const part of parts) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nested: any[] = [];
    for (const item of items) {
      if (Array.isArray(item[part])) {
        nested.push(...item[part]);
      }
    }
    items = nested;
  }

  return items;
}
