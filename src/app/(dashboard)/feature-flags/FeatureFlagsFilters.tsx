"use client";

import { useCallback } from "react";
import { Box, Button, TextField } from "@mui/material";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import FilterAutocomplete from "@/components/FilterAutocomplete";
import EnvironmentFilterToggles from "@/app/(dashboard)/feature-flags/EnvironmentFilterToggles";
import { EnvironmentRow } from "@/app/(dashboard)/feature-flags/featureFlagEnv";

interface FeatureFlagsFiltersProps {
  filters: Record<string, string>;
  onChange: (filters: Record<string, string>) => void;
  environments: EnvironmentRow[];
}

export default function FeatureFlagsFilters({
  filters,
  onChange,
  environments,
}: FeatureFlagsFiltersProps) {
  const handleChange = useCallback(
    (field: string, value: string) => {
      onChange({ ...filters, [field]: value });
    },
    [filters, onChange],
  );

  const handleClear = useCallback(() => onChange({}), [onChange]);

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "flex-end",
        }}
      >
        <TextField
          size="small"
          placeholder="Name"
          value={filters.name ?? ""}
          onChange={(e) => handleChange("name", e.target.value)}
          sx={{ minWidth: 160 }}
        />

        <TextField
          size="small"
          placeholder="Code"
          value={filters.code ?? ""}
          onChange={(e) => handleChange("code", e.target.value)}
          sx={{ width: 110 }}
        />

        <DatePicker
          label="Expires"
          value={filters.expiresAt ? dayjs(filters.expiresAt.slice(0, 10)) : null}
          onChange={(newValue: Dayjs | null) =>
            handleChange(
              "expiresAt",
              newValue?.isValid() ? newValue.format("YYYY-MM-DD") : "",
            )
          }
          slotProps={{
            field: { clearable: true },
            textField: { size: "small", sx: { width: 192 } },
          }}
        />

        <FilterAutocomplete
          label="Created by"
          placeholder="Created by"
          value={filters.createdBy ?? ""}
          onChange={(value) => handleChange("createdBy", value)}
          optionsUrl="/api/admin/users?take=100&skip=0"
        />

        <FilterAutocomplete
          label="Projects"
          placeholder="Projects"
          value={filters.projectId ?? ""}
          onChange={(value) => handleChange("projectId", value)}
          optionsUrl="/api/admin/projects?take=100&skip=0"
        />
      </Box>

      <EnvironmentFilterToggles
        environments={environments}
        values={filters}
        onChange={handleChange}
      />

      {hasActiveFilters && (
        <Button
          size="small"
          onClick={handleClear}
          startIcon={<FilterListOffIcon fontSize="small" />}
          sx={{ alignSelf: "flex-start", color: "text.secondary", fontWeight: 500 }}
        >
          Clear
        </Button>
      )}
    </Box>
  );
}
