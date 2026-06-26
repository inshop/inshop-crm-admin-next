"use client";

import * as React from "react";
import { capitalize, CircularProgress, Alert } from "@mui/material";
import { BooleanChip } from "@/components/BooleanChip";
import RoleCheckboxesField from "@/components/RoleCheckboxesField";
import { FieldConfig } from "@/components/FormField";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Box from "@mui/material/Box";
import { formatDateTimeEu, isDateColumn } from "@/lib/format-date";
import { AuditChangesView, AuditMetadataView } from "@/components/AuditChangesView";

interface CustomTableDataType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any;
  columns: string[];
  id: number;
  detailFields?: FieldConfig[];
  canView?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}

export default function CustomTableData({
  query,
  columns,
  id,
  detailFields = [],
}: CustomTableDataType) {
  const { data, error, isLoading } = query({ id });

  const renderValue = (
    column: string,
    value: unknown,
    row?: Record<string, unknown>,
  ): React.ReactNode => {
    if (value === null || value === undefined) return "-";
    if (isDateColumn(column)) {
      return formatDateTimeEu(value as string | Date);
    }
    if (column === "changes" && typeof value === "object") {
      return (
        <AuditChangesView
          changes={value as Record<string, unknown>}
          action={row?.action as string | undefined}
        />
      );
    }
    if (column === "metadata" && typeof value === "object") {
      return <AuditMetadataView metadata={value as Record<string, unknown>} />;
    }
    if (typeof value === "boolean") return <BooleanChip value={value} />;
    if (typeof value === "object") {
      if ("name" in value && typeof value.name === "string") {
        return value.name;
      }
      return JSON.stringify(value);
    }
    return String(value);
  };

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error?.error || error?.data?.message || "Failed to load data"}
        </Alert>
      )}
      {isLoading && (
        <Box
          sx={{
            width: "100px",
            display: "flex",
            margin: "100px auto",
          }}
        >
          <CircularProgress />
        </Box>
      )}

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: "10px", overflow: "hidden" }}>
        <Table sx={{ width: "100%", tableLayout: "fixed" }}>
          <TableBody>
            {data &&
              columns.map((column) => (
                <TableRow key={column}>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.8125rem",
                      color: "text.secondary",
                      width: "200px",
                      backgroundColor: "#F8FAFC",
                      py: 2,
                    }}
                  >
                    {capitalize(column.replace(/_/g, " "))}
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>{renderValue(column, data[column], data)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {data &&
        detailFields.map((field) => {
          if (field.type !== "role-checkboxes") return null;

          return (
            <Box key={field.name} sx={{ mt: 2 }}>
              <RoleCheckboxesField
                label={field.label || capitalize(field.name.replace(/_/g, " "))}
                modulesUrl={
                  field.optionsUrl || "/api/admin/modules?take=100&skip=0"
                }
                value={data[field.name]}
                readOnly
              />
            </Box>
          );
        })}
    </>
  );
}
