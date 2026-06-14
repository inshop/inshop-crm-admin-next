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
    "old" in value &&
    "new" in value
  );
}

function formatScalar(value: unknown): string {
  if (value === null || value === undefined) return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") {
    if ("name" in value && typeof value.name === "string") return value.name;
    if ("id" in value) return String(value.id);
  }
  return String(value);
}

function formatListItem(item: string): string {
  return item.replace(/^ROLE_/, "").replace(/_/g, " ");
}

function resolveCells(value: unknown, action?: string) {
  if (isFieldDiff(value)) {
    return { before: value.old, after: value.new };
  }
  if (action === "delete") {
    return { before: value, after: undefined };
  }
  return { before: undefined, after: value };
}

function EmptyDash() {
  return (
    <Typography variant="body2" color="text.secondary">
      -
    </Typography>
  );
}

const diffColors = {
  removedBg: "#ffebe9",
  addedBg: "#dafbe1",
  removedItemBg: "#ffcecb",
  addedItemBg: "#aceebb",
};

const headerCellSx = {
  fontWeight: "bold",
  backgroundColor: "rgba(0, 0, 0, 0.04)",
};

const beforeCellSx = {
  verticalAlign: "top",
  backgroundColor: diffColors.removedBg,
};

const afterCellSx = {
  verticalAlign: "top",
  backgroundColor: diffColors.addedBg,
};

const fieldCellSx = {
  fontWeight: "bold",
  width: "140px",
  backgroundColor: "rgba(0, 0, 0, 0.02)",
  verticalAlign: "top",
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

    const otherSet = new Set(
      Array.isArray(compareWith) ? compareWith.map(String) : [],
    );

    return (
      <Box component="ul" sx={{ m: 0, pl: 0, listStyle: "none" }}>
        {value.map(String).map((item) => {
          const isRemoved = side === "before" && !otherSet.has(item);
          const isAdded = side === "after" && !otherSet.has(item);

          return (
            <Box
              component="li"
              key={item}
              sx={{
                typography: "body2",
                px: 1,
                py: 0.25,
                borderRadius: 0.5,
                backgroundColor: isRemoved
                  ? diffColors.removedItemBg
                  : isAdded
                    ? diffColors.addedItemBg
                    : "transparent",
              }}
            >
              {formatListItem(item)}
            </Box>
          );
        })}
      </Box>
    );
  }

  return <Typography variant="body2">{formatScalar(value)}</Typography>;
}

function AuditTable({
  headers,
  children,
}: {
  headers?: string[];
  children: React.ReactNode;
}) {
  return (
    <TableContainer component={Paper} variant="outlined">
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
                  <CellValue
                    value={before}
                    compareWith={after}
                    side="before"
                  />
                ) : (
                  <EmptyDash />
                )}
              </TableCell>
              <TableCell sx={afterCellSx}>
                {after !== undefined ? (
                  <CellValue
                    value={after}
                    compareWith={before}
                    side="after"
                  />
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
    ip: "IP",
    userAgent: "User agent",
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
            <TableCell>
              <Typography variant="body2">{formatScalar(value)}</Typography>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </AuditTable>
  );
}
