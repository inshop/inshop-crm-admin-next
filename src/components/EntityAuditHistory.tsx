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

export default function EntityAuditHistory({
  entityType,
  entityId,
}: EntityAuditHistoryProps) {
  const [page, setPage] = useState(0);
  const filter = JSON.stringify({
    entityType,
    entityId: String(entityId),
  });

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
        <CircularProgress />
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
      <Typography color="text.secondary" sx={{ py: 2 }}>
        No history records
      </Typography>
    );
  }

  return (
    <Box>
      {rows.map((entry) => (
        <Accordion key={entry.id} disableGutters sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography variant="body2" sx={{ minWidth: 160 }}>
                {formatDateTimeEu(entry.createdAt)}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                {capitalize(entry.action)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {entry.user?.name ?? "-"}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            {entry.changes && Object.keys(entry.changes).length > 0 && (
              <Box sx={{ mb: entry.metadata ? 2 : 0 }}>
                <AuditChangesView
                  changes={entry.changes}
                  action={entry.action}
                />
              </Box>
            )}
            {entry.metadata && Object.keys(entry.metadata).length > 0 && (
              <AuditMetadataView metadata={entry.metadata} />
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
        />
      )}
    </Box>
  );
}
