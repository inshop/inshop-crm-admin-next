"use client";

import * as React from "react";
import { capitalize, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

type FieldDiff = { old: unknown; new: unknown };

function isFieldDiff(value: unknown): value is FieldDiff {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    ("old" in value || "new" in value)
  );
}

function environmentLabel(environment: unknown): string {
  if (typeof environment !== "object" || environment === null) {
    return String(environment ?? "?");
  }
  if ("name" in environment && typeof environment.name === "string") {
    return environment.name;
  }
  if ("code" in environment && typeof environment.code === "string") {
    return environment.code;
  }
  if ("id" in environment) return String(environment.id);
  return "?";
}

function formatEnvironmentValue(item: unknown): string {
  if (typeof item !== "object" || item === null) return String(item ?? "?");
  if ("enabled" in item) {
    const enabled = (item as { enabled: boolean }).enabled;
    const environment =
      "environment" in item
        ? (item as { environment: unknown }).environment
        : undefined;
    return `${environmentLabel(environment)}: ${enabled ? "enabled" : "disabled"}`;
  }
  return formatScalar(item);
}

function formatScalar(value: unknown): string {
  if (value === null || value === undefined) return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") {
    if ("enabled" in value && "environment" in value) {
      return formatEnvironmentValue(value);
    }
    if ("name" in value && typeof value.name === "string") return value.name;
    if ("id" in value) return String(value.id);
  }
  return String(value);
}

function formatListItem(item: unknown): string {
  if (typeof item === "string") {
    return item.replace(/^ROLE_/, "").replace(/_/g, " ");
  }
  return formatEnvironmentValue(item);
}

function resolveCells(value: unknown, action?: string) {
  if (isFieldDiff(value)) {
    return {
      before: "old" in value ? value.old : undefined,
      after: "new" in value ? value.new : undefined,
    };
  }
  if (action === "delete") return { before: value, after: undefined };
  return { before: undefined, after: value };
}

function EmptyDash() {
  return (
    <Typography variant="body2" color="text.disabled" sx={{ fontStyle: "italic" }}>
      —
    </Typography>
  );
}

const diffColors = {
  removedBg: "#FEF2F2",
  addedBg: "#F0FDF4",
  removedItemBg: "#FECACA",
  addedItemBg: "#BBF7D0",
  removedText: "#991B1B",
  addedText: "#166534",
};

const headerCellSx = {
  fontWeight: 600,
  fontSize: "0.6875rem",
  letterSpacing: "0.06em",
  textTransform: "uppercase" as const,
  color: "#64748B",
  backgroundColor: "#F8FAFC",
  py: 1.5,
};

const beforeCellSx = {
  verticalAlign: "top",
  backgroundColor: diffColors.removedBg,
  borderLeft: `2px solid #FECACA`,
  py: 2,
};

const afterCellSx = {
  verticalAlign: "top",
  backgroundColor: diffColors.addedBg,
  borderLeft: `2px solid #BBF7D0`,
  py: 2,
};

const fieldCellSx = {
  fontWeight: 500,
  fontSize: "0.8125rem",
  width: "140px",
  backgroundColor: "#F8FAFC",
  verticalAlign: "top",
  color: "#475569",
  py: 2,
};

function CellValue({
  value,
  compareWith,
  side,
}: {
  value: unknown;
  compareWith?: unknown;
  side?: "before" | "after";
}) {
  if (Array.isArray(value)) {
    if (value.length === 0) return <EmptyDash />;

    return (
      <Box component="ul" sx={{ m: 0, pl: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 0.5 }}>
        {value.map((item, index) => {
          const label = formatListItem(item);
          const isRemoved =
            side === "before" &&
            Array.isArray(compareWith) &&
            !compareWith.some((other) => formatListItem(other) === label);
          const isAdded =
            side === "after" &&
            Array.isArray(compareWith) &&
            !compareWith.some((other) => formatListItem(other) === label);

          return (
            <Box
              component="li"
              key={`${label}-${index}`}
              sx={{
                typography: "body2",
                px: 1,
                py: 0.25,
                borderRadius: "6px",
                fontSize: "0.8125rem",
                fontWeight: isRemoved || isAdded ? 500 : 400,
                backgroundColor: isRemoved
                  ? diffColors.removedItemBg
                  : isAdded
                    ? diffColors.addedItemBg
                    : "transparent",
                color: isRemoved
                  ? diffColors.removedText
                  : isAdded
                    ? diffColors.addedText
                    : "inherit",
              }}
            >
              {label}
            </Box>
          );
        })}
      </Box>
    );
  }

  return (
    <Typography variant="body2" sx={{ fontSize: "0.8125rem" }}>
      {formatScalar(value)}
    </Typography>
  );
}

function AuditTable({
  headers,
  children,
}: {
  headers?: string[];
  children: React.ReactNode;
}) {
  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{ borderRadius: "10px", overflow: "hidden" }}
    >
      <Table size="small" sx={{ tableLayout: "fixed" }}>
        {headers && (
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell
                  key={header}
                  sx={
                    header === "Field"
                      ? { ...headerCellSx, width: "140px" }
                      : headerCellSx
                  }
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        )}
        {children}
      </Table>
    </TableContainer>
  );
}

export function AuditChangesView({
  changes,
  action,
}: {
  changes: Record<string, unknown>;
  action?: string;
}) {
  const entries = Object.entries(changes);
  if (entries.length === 0) return <EmptyDash />;

  return (
    <AuditTable headers={["Field", "Before", "After"]}>
      <TableBody>
        {entries.map(([field, value]) => {
          const { before, after } = resolveCells(value, action);

          return (
            <TableRow key={field}>
              <TableCell sx={fieldCellSx}>
                {capitalize(field.replace(/_/g, " "))}
              </TableCell>
              <TableCell sx={beforeCellSx}>
                {before !== undefined ? (
                  <CellValue value={before} compareWith={after} side="before" />
                ) : (
                  <EmptyDash />
                )}
              </TableCell>
              <TableCell sx={afterCellSx}>
                {after !== undefined ? (
                  <CellValue value={after} compareWith={before} side="after" />
                ) : (
                  <EmptyDash />
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </AuditTable>
  );
}

export function AuditMetadataView({
  metadata,
}: {
  metadata: Record<string, unknown>;
}) {
  const labels: Record<string, string> = {
    ip: "IP Address",
    userAgent: "User Agent",
  };

  const entries = Object.entries(metadata);
  if (entries.length === 0) return <EmptyDash />;

  return (
    <AuditTable>
      <TableBody>
        {entries.map(([key, value]) => (
          <TableRow key={key}>
            <TableCell sx={fieldCellSx}>
              {labels[key] ?? capitalize(key.replace(/_/g, " "))}
            </TableCell>
            <TableCell sx={{ py: 2 }}>
              <Typography variant="body2" sx={{ fontSize: "0.8125rem", color: "text.secondary" }}>
                {formatScalar(value)}
              </Typography>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </AuditTable>
  );
}
