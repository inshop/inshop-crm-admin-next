"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Tab,
  Tabs,
} from "@mui/material";
import CustomDialog from "@/components/CustomDialog";
import EntityAuditHistory from "@/components/EntityAuditHistory";
import FeatureFlagEnvControls from "@/app/(dashboard)/feature-flags/FeatureFlagEnvControls";
import {
  EnvironmentRow,
  parseEnvironments,
} from "@/app/(dashboard)/feature-flags/featureFlagEnv";
import { formatDateTimeEu } from "@/lib/format-date";
import {
  FeatureFlag,
  useFeatureFlagsControllerFindOneQuery,
} from "@/lib/redux/features/featureFlags";
import { useEnvironmentsControllerFindAllQuery } from "@/lib/redux/features/environments";
import { useAuth } from "@/providers/AuthProvider";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

interface DialogFeatureFlagDetailsProps {
  id: number;
  open: boolean;
  handleClose: () => void;
  onUpdated?: () => void;
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <TableRow>
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
        {label}
      </TableCell>
      <TableCell sx={{ py: 2 }}>{children}</TableCell>
    </TableRow>
  );
}

export default function DialogFeatureFlagDetails({
  id,
  open,
  handleClose,
  onUpdated,
}: DialogFeatureFlagDetailsProps) {
  const { canUpdate, canList } = useAuth();
  const entity = "featureFlag";
  const [activeTab, setActiveTab] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showHistoryTab = canList("audit");

  const {
    data: flag,
    error,
    isLoading,
    refetch,
  } = useFeatureFlagsControllerFindOneQuery({ id }, { skip: !open });

  const { data: envData } = useEnvironmentsControllerFindAllQuery(
    { take: 100, skip: 0 },
    { skip: !open },
  );

  const environments: EnvironmentRow[] = parseEnvironments(
    envData as [EnvironmentRow[], number] | undefined,
  );

  useEffect(() => {
    if (open) {
      setActiveTab(0);
      setErrorMessage(null);
    }
  }, [open, id]);

  const handleEnvUpdated = () => {
    refetch();
    onUpdated?.();
  };

  return (
    <CustomDialog
      open={open}
      handleClose={handleClose}
      maxWidth="lg"
      contentSx={{ minHeight: 400 }}
      title="Feature Flag Details"
    >

      {showHistoryTab && (
        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Details" />
          <Tab label="History" />
        </Tabs>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {activeTab === 0 && (
        <Box sx={{ width: "100%", mt: showHistoryTab ? 0 : 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to load data
            </Alert>
          )}

          {isLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {flag && (
            <>
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: "10px", overflow: "hidden" }}>
                <Table sx={{ width: "100%", tableLayout: "fixed" }}>
                  <TableBody>
                    <DetailRow label="Id">{flag.id}</DetailRow>
                    <DetailRow label="Name">{flag.name}</DetailRow>
                    <DetailRow label="Code">{flag.code}</DetailRow>
                    <DetailRow label="Expires">
                      {flag.expiresAt
                        ? formatDateTimeEu(flag.expiresAt)
                        : "—"}
                    </DetailRow>
                    <DetailRow label="Created by">
                      {flag.createdBy?.name ?? "—"}
                    </DetailRow>
                    <DetailRow label="Projects">
                      {(flag.projects ?? []).length > 0 ? (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          {flag.projects.map((project) => (
                            <Chip
                              key={project.id}
                              label={project.name}
                              size="small"
                            />
                          ))}
                        </Box>
                      ) : (
                        "—"
                      )}
                    </DetailRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 3 }}>
                <FeatureFlagEnvControls
                  flag={flag as FeatureFlag}
                  environments={environments}
                  canUpdate={canUpdate(entity)}
                  onUpdated={handleEnvUpdated}
                  onError={setErrorMessage}
                />
              </Box>
            </>
          )}
        </Box>
      )}

      {activeTab === 1 && showHistoryTab && (
        <EntityAuditHistory entityType="feature_flag" entityId={id} />
      )}
    </CustomDialog>
  );
}
