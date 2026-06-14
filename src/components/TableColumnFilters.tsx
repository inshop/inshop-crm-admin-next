"use client";

import { GridColDef } from "@mui/x-data-grid";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

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
    onChange({
      ...filters,
      [field]: value,
    });
  };

  const handleClear = () => {
    onChange({});
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  if (filterableColumns.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "flex-end",
      }}
    >
      {filterableColumns.map((col) => {
        const value = filters[col.field] ?? "";

        if (col.type === "boolean") {
          return (
            <FormControl key={col.field} size="small" sx={{ minWidth: 140 }}>
              <InputLabel>{col.headerName}</InputLabel>
              <Select
                label={col.headerName}
                value={value}
                onChange={(event) =>
                  handleChange(col.field, event.target.value)
                }
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
            label={col.headerName}
            value={value}
            onChange={(event) => handleChange(col.field, event.target.value)}
            sx={{ minWidth: 160 }}
          />
        );
      })}

      {hasActiveFilters && (
        <Button size="small" onClick={handleClear}>
          Clear filters
        </Button>
      )}
    </Box>
  );
}
