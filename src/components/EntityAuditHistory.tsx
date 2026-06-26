"use client";

import * as React from "react";
import { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  capitalize,
  Chip,
  CircularProgress,
  TablePagination,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAuditsControllerFindAllQuery } from "@/lib/redux/features/audits";
import { formatDateTimeEu } from "@/lib/format-date";
import { AuditChangesView, AuditMetadataView } from "@/components/AuditChangesView";

interface AuditEntry {
  id: number;
  createdAt: string;
  action: string;
  changes?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  user?: { name?: string };
}

interface EntityAuditHistoryProps {
  entityType: string;
  entityId: number;
}

const pageSize = 25;

const actionChipProps: Record<string, { color: string; bg: string; border: string }> = {
  create: { color: "#166534", bg: "#F0FDF4", border: "#BBF7D0" },
  update: { color: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE" },
  delete: { color: "#991B1B", bg: "#FEF2F2", border: "#FECACA" },
};

function ActionBadge({ action }: { action: string }) {
  const normalized = action.toLowerCase();
  const style = actionChipProps[normalized] ?? {
    color: "#475569",
    bg: "#F8FAFC",
    border: "#E2E8F0",
  };

  return (
    <Chip
      label={capitalize(action)}
      size="small"
      sx={{
        fontSize: "0.6875rem",
        fontWeight: 600,
        height: 20,
        borderRadius: "4px",
        color: style.color,
        backgroundColor: style.bg,
        border: `1px solid ${style.border}`,
        "& .MuiChip-label": { px: 1 },
      }}
    />
  );
}

export default function EntityAuditHistory({
  entityType,
  entityId,
}: EntityAuditHistoryProps) {
  const [page, setPage] = useState(0);
  const filter = JSON.stringify({ entityType, entityId: String(entityId) });

  const { data, error, isLoading } = useAuditsControllerFindAllQuery({
    take: pageSize,
    skip: page * pageSize,
    filter,
  });

  const [rows, total] =
    (data as [AuditEntry[], number] | undefined) ?? [[], 0];

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {(error as { data?: { message?: string } })?.data?.message ||
          "Failed to load history"}
      </Alert>
    );
  }

  if (rows.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
        No history records found
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {rows.map((entry) => (
        <Accordion key={entry.id} disableGutters>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "text.secondary", fontSize: 18 }} />}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                alignItems: "center",
                width: "100%",
                pr: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{ minWidth: 140, color: "text.secondary", fontFamily: "monospace" }}
              >
                {formatDateTimeEu(entry.createdAt)}
              </Typography>

              <ActionBadge action={entry.action} />

              {entry.user?.name && (
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", fontSize: "0.8125rem" }}
                >
                  by{" "}
                  <Box component="span" sx={{ fontWeight: 500, color: "text.primary" }}>
                    {entry.user.name}
                  </Box>
                </Typography>
              )}
            </Box>
          </AccordionSummary>

          <AccordionDetails sx={{ pt: 1.5, pb: 2, px: 2 }}>
            {entry.changes && Object.keys(entry.changes).length > 0 && (
              <Box sx={{ mb: entry.metadata ? 2 : 0 }}>
                <Typography
                  variant="caption"
                  sx={{ display: "block", mb: 1, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "text.secondary" }}
                >
                  Changes
                </Typography>
                <AuditChangesView changes={entry.changes} action={entry.action} />
              </Box>
            )}
            {entry.metadata && Object.keys(entry.metadata).length > 0 && (
              <Box>
                <Typography
                  variant="caption"
                  sx={{ display: "block", mb: 1, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "text.secondary" }}
                >
                  Metadata
                </Typography>
                <AuditMetadataView metadata={entry.metadata} />
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      ))}

      {total > pageSize && (
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={pageSize}
          rowsPerPageOptions={[pageSize]}
          sx={{ borderTop: "1px solid", borderColor: "divider", mt: 1 }}
        />
      )}
    </Box>
  );
}
