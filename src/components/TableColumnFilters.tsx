"use client";

import { GridColDef } from "@mui/x-data-grid";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";

interface TableColumnFiltersProps {
  columns: GridColDef[];
  filters: Record<string, string>;
  onChange: (filters: Record<string, string>) => void;
}

export default function TableColumnFilters({
  columns,
  filters,
  onChange,
}: TableColumnFiltersProps) {
  const filterableColumns = columns.filter((col) => col.filterable !== false);

  const handleChange = (field: string, value: string) => {
    onChange({ ...filters, [field]: value });
  };

  const handleClear = () => onChange({});

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  if (filterableColumns.length === 0) return null;

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "flex-end" }}>
      {filterableColumns.map((col) => {
        const value = filters[col.field] ?? "";

        if (col.type === "boolean") {
          return (
            <FormControl key={col.field} size="small" sx={{ minWidth: 130 }}>
              <Select
                value={value}
                displayEmpty
                onChange={(event) => handleChange(col.field, event.target.value)}
                renderValue={(v) => v === "" ? col.headerName : v === "true" ? "Yes" : "No"}
                sx={{ color: value === "" ? "text.disabled" : "text.primary" }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>
          );
        }

        return (
          <TextField
            key={col.field}
            size="small"
            placeholder={col.headerName}
            value={value}
            onChange={(event) => handleChange(col.field, event.target.value)}
            sx={{ minWidth: 160 }}
          />
        );
      })}

      {hasActiveFilters && (
        <Button
          size="small"
          onClick={handleClear}
          startIcon={<FilterListOffIcon fontSize="small" />}
          sx={{ color: "text.secondary", fontWeight: 500 }}
        >
          Clear
        </Button>
      )}
    </Box>
  );
}
