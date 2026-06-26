"use client";

import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
} from "@mui/x-data-grid";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Switch,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DialogCreate from "@/components/DialogCreate";
import ConfirmDialog from "@/components/ConfirmDialog";
import DialogFeatureFlagDetails from "@/app/(dashboard)/feature-flags/DialogFeatureFlagDetails";
import FeatureFlagsFilters from "@/app/(dashboard)/feature-flags/FeatureFlagsFilters";
import { formFields } from "@/app/(dashboard)/feature-flags/columns";
import { dataGridSx } from "@/lib/dataGridSx";
import { useAuth } from "@/providers/AuthProvider";
import { formatDateTimeEu } from "@/lib/format-date";
import {
  FeatureFlag,
  useFeatureFlagsControllerFindAllQuery,
  useFeatureFlagsControllerRemoveMutation,
  useFeatureFlagsControllerUpdateEnvironmentValueMutation,
} from "@/lib/redux/features/featureFlags";
import { useEnvironmentsControllerFindAllQuery } from "@/lib/redux/features/environments";
import {
  EnvironmentRow,
  PendingToggle,
  getEnvEnabled,
  parseEnvironments,
} from "@/app/(dashboard)/feature-flags/featureFlagEnv";

const pageSizeOptions = [25, 50, 100];

export default function FeatureFlagsGrid() {
  const router = useRouter();
  const { canCreate, canUpdate, canDelete, canDetails } = useAuth();
  const entity = "featureFlag";

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [queryFilters, setQueryFilters] = useState<Record<string, string>>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingToggle, setPendingToggle] = useState<PendingToggle | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const { data: envData } = useEnvironmentsControllerFindAllQuery({
    take: 100,
    skip: 0,
  });

  const environments = useMemo(
    (): EnvironmentRow[] =>
      parseEnvironments(envData as [EnvironmentRow[], number] | undefined),
    [envData],
  );

  const prevQueryFiltersRef = useRef<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      const next = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== ""),
      );
      const serialized = JSON.stringify(next);

      if (serialized === prevQueryFiltersRef.current) return;
      prevQueryFiltersRef.current = serialized;

      setQueryFilters(next);
      setPaginationModel((current) =>
        current.page === 0 ? current : { ...current, page: 0 },
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  const { data, error, isLoading, refetch } =
    useFeatureFlagsControllerFindAllQuery({
      take: paginationModel.pageSize,
      skip: paginationModel.page * paginationModel.pageSize,
      filter:
        Object.keys(queryFilters).length > 0
          ? JSON.stringify(queryFilters)
          : undefined,
    });

  const [updateEnvValue, { isLoading: isToggling }] =
    useFeatureFlagsControllerUpdateEnvironmentValueMutation();
  const [removeFlag, { isLoading: isDeleting }] =
    useFeatureFlagsControllerRemoveMutation();

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 5000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const rows = useMemo(() => data?.[0] ?? [], [data]);
  const rowCount = data?.[1] ?? 0;

  const handleToggleRequest = (
    flag: FeatureFlag,
    environmentId: number,
    environmentName: string,
    enabled: boolean,
  ) => {
    setErrorMessage(null);
    setPendingToggle({
      flagId: flag.id,
      flagName: flag.name,
      environmentId,
      environmentName,
      enabled,
    });
  };

  const handleToggleConfirm = async () => {
    if (!pendingToggle) return;

    try {
      await updateEnvValue({
        id: pendingToggle.flagId,
        environmentId: pendingToggle.environmentId,
        updateFeatureFlagEnvironmentValueDto: {
          enabled: pendingToggle.enabled,
        },
      }).unwrap();
      setPendingToggle(null);
      setSuccessMessage("Environment value updated");
      refetch();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "data" in err
          ? (err as { data: { message?: string } }).data?.message
          : "Failed to update environment value";
      setErrorMessage(message || "Failed to update environment value");
      setPendingToggle(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (pendingDeleteId === null) return;

    try {
      await removeFlag({ id: pendingDeleteId }).unwrap();
      setPendingDeleteId(null);
      setSuccessMessage("Feature flag deleted");
      refetch();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "data" in err
          ? (err as { data: { message?: string } }).data?.message
          : "Failed to delete";
      setErrorMessage(message || "Failed to delete");
      setPendingDeleteId(null);
    }
  };

  const handleRowClick = (params: GridRowParams<FeatureFlag>) => {
    if (canDetails(entity) && params.row.id) {
      setSelectedRow(params.row.id);
      setDetailsOpen(true);
    }
  };

  const columns = useMemo((): GridColDef[] => {
    const leadingColumns: GridColDef[] = [
      {
        field: "name",
        headerName: "Name",
        flex: 0.3,
        minWidth: 160,
        sortable: false,
        disableColumnMenu: true,
      },
    ];

    const trailingColumns: GridColDef[] = [
      {
        field: "projects",
        headerName: "Projects",
        flex: 0.25,
        minWidth: 160,
        sortable: false,
        disableColumnMenu: true,
        renderCell: (params: GridRenderCellParams<FeatureFlag>) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, py: 0.5 }}>
            {(params.row.projects ?? []).map((project) => (
              <Chip key={project.id} label={project.name} size="small" />
            ))}
          </Box>
        ),
      },
      {
        field: "expiresAt",
        headerName: "Expires",
        flex: 0.15,
        minWidth: 130,
        sortable: false,
        disableColumnMenu: true,
        renderCell: (params: GridRenderCellParams) =>
          params.value ? formatDateTimeEu(params.value as string) : "—",
      },
      {
        field: "createdBy",
        headerName: "Created by",
        flex: 0.15,
        minWidth: 130,
        sortable: false,
        disableColumnMenu: true,
        valueGetter: (_value, row: FeatureFlag) => row.createdBy?.name ?? "—",
      },
    ];

    const envColumns: GridColDef[] = environments.map((env) => ({
      field: `env_${env.id}`,
      headerName: env.name,
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams<FeatureFlag>) => {
        const enabled = getEnvEnabled(params.row, env.id);
        return (
          <Switch
            checked={enabled}
            disabled={!canUpdate(entity)}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation();
              handleToggleRequest(
                params.row,
                env.id,
                env.name,
                e.target.checked,
              );
            }}
            size="small"
          />
        );
      },
    }));

    const actionColumn: GridColDef = {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      flex: 0.1,
      minWidth: 120,
      sortable: false,
      disableColumnMenu: true,
      getActions: (params: GridRowParams<FeatureFlag>) => {
        const actions = [];

        if (canUpdate(entity)) {
          actions.push(
            <GridActionsCellItem
              key="edit"
              icon={<EditIcon />}
              label="Edit"
              onClick={() =>
                router.push(`/feature-flags/${params.row.id}/edit`)
              }
            />,
          );
        }

        if (canDelete(entity)) {
          actions.push(
            <GridActionsCellItem
              key="delete"
              icon={<DeleteIcon fontSize="small" color="error" />}
              label="Delete"
              onClick={() => setPendingDeleteId(params.row.id)}
            />,
          );
        }

        return actions;
      },
    };

    return [...leadingColumns, ...envColumns, ...trailingColumns, actionColumn];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [environments, canUpdate, canDelete, router]);

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h2" sx={{ mb: 0.5 }}>Feature Flags</Typography>
        <Typography variant="body2" color="text.secondary">
          Manage and configure feature flags per environment
        </Typography>
        <Divider sx={{ mt: 2.5 }} />
      </Box>

      <Box sx={{ width: "100%" }}>
        {successMessage && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            onClose={() => setSuccessMessage(null)}
          >
            {successMessage}
          </Alert>
        )}

        {(error || errorMessage) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage || "Failed to load data"}
          </Alert>
        )}

        <Paper
          elevation={0}
          sx={{
            px: 0,
            py: 1.5,
            mb: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
            flexWrap: "wrap",
            backgroundColor: "transparent",
            border: "none",
          }}
        >
          <FeatureFlagsFilters
            filters={filters}
            onChange={setFilters}
            environments={environments}
          />

          {canCreate(entity) && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateOpen(true)}
              sx={{ flexShrink: 0 }}
            >
              Create Feature Flag
            </Button>
          )}
        </Paper>


        <DataGrid
          rows={rows}
          rowCount={rowCount}
          columns={columns}
          density="comfortable"
          autoHeight
          getRowHeight={() => "auto"}
          pageSizeOptions={pageSizeOptions}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
          onRowClick={handleRowClick}
          disableRowSelectionOnClick
          loading={isLoading}
          slotProps={{
            loadingOverlay: {
              variant: "circular-progress",
              noRowsVariant: "circular-progress",
            },
          }}
          sx={{
            ...dataGridSx,
            "& .MuiDataGrid-cell": { paddingLeft: "20px", paddingRight: "20px", py: 1.5, borderColor: "#E2E8F0" },
            "& .MuiDataGrid-row:hover": { cursor: canDetails(entity) ? "pointer" : "default", backgroundColor: "rgba(37,99,235,0.03)" },
          }}
        />
      </Box>

      <DialogCreate
        entity={entity}
        fields={formFields}
        open={createOpen}
        handleClose={() => setCreateOpen(false)}
        onSuccess={() => {
          setSuccessMessage("Feature flag created");
          refetch();
        }}
      />

      {selectedRow && (
        <DialogFeatureFlagDetails
          id={selectedRow}
          open={detailsOpen}
          handleClose={() => setDetailsOpen(false)}
          onUpdated={refetch}
        />
      )}

      <ConfirmDialog
        open={!!pendingToggle}
        title="Change environment value"
        message={
          pendingToggle
            ? `${pendingToggle.enabled ? "Enable" : "Disable"} "${pendingToggle.flagName}" in "${pendingToggle.environmentName}"?`
            : ""
        }
        confirmLabel={pendingToggle?.enabled ? "Enable" : "Disable"}
        loading={isToggling}
        onConfirm={handleToggleConfirm}
        onCancel={() => setPendingToggle(null)}
      />

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Delete feature flag"
        message="Are you sure you want to delete this feature flag? This action cannot be undone."
        confirmLabel="Delete"
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPendingDeleteId(null)}
      />
    </>
  );
}
