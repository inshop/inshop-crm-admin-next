"use client";

import { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { extractItems } from "@/lib/extract-items";

interface FilterOption {
  id: number;
  label: string;
}

interface FilterAutocompleteProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  optionsUrl: string;
  optionLabelKey?: string;
  optionsPath?: string;
  minWidth?: number;
}

export default function FilterAutocomplete({
  label,
  placeholder,
  value,
  onChange,
  optionsUrl,
  optionLabelKey = "name",
  optionsPath,
  minWidth = 180,
}: FilterAutocompleteProps) {
  const [options, setOptions] = useState<FilterOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(optionsUrl, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (cancelled) return;

        const items = extractItems(data, optionsPath);
        setOptions(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          items.map((item: any) => ({
            id: item.id,
            label: item[optionLabelKey] || String(item.id),
          })),
        );
      })
      .catch(() => {
        if (!cancelled) setOptions([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [optionsUrl, optionLabelKey, optionsPath]);

  const selected =
    options.find((option) => String(option.id) === value) ?? null;

  return (
    <Autocomplete
      options={options}
      loading={loading}
      getOptionLabel={(opt) => opt.label}
      isOptionEqualToValue={(opt, val) => opt.id === val.id}
      value={selected}
      onChange={(_, newVal) => onChange(newVal ? String(newVal.id) : "")}
      sx={{ minWidth }}
      size="small"
      renderInput={(params) => (
        <TextField
          {...params}
          label={placeholder ? undefined : label}
          placeholder={placeholder ?? undefined}
          slotProps={{
            ...params.slotProps,
            input: {
              ...params.slotProps?.input,
              endAdornment: (
                <>
                  {loading && <CircularProgress size={20} />}
                  {params.slotProps?.input?.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
}
