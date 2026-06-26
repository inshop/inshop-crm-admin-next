"use client";

import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
  GridSortModel,
} from "@mui/x-data-grid";
import { Alert, Button, capitalize } from "@mui/material";
import { BooleanChip } from "@/components/BooleanChip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import pluralize from "pluralize";
import DialogDetails from "@/components/DialogDetails";
import DialogEdit from "@/components/DialogEdit";
import DialogCreate from "@/components/DialogCreate";
import TableColumnFilters from "@/components/TableColumnFilters";
import ConfirmDialog from "@/components/ConfirmDialog";
import { FieldConfig } from "@/components/FormField";
import { dataGridSx } from "@/lib/dataGridSx";

interface CustomDataGridType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any;
  entity: string;
  columnsList: GridColDef[];
  columnsDetails: string[];
  formFields: FieldConfig[];
  editFormFields?: FieldConfig[];
  canView?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canCreate?: boolean;
}

const pageSizeOptions = [25, 50, 100];

function useNoopMutation() {
  const trigger = React.useCallback(
    () => ({
      unwrap: () => Promise.resolve(undefined),
    }),
    [],
  );
  return [trigger, { reset: () => {} }] as const;
}

export default function CustomDataGrid({
  query,
  entity,
  columnsList,
  columnsDetails,
  formFields,
  editFormFields,
  canView = true,
  canEdit = true,
  canDelete = true,
  canCreate = true,
}: CustomDataGridType) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [api, setApi] = useState<any>(null);
  const pluralEntity = pluralize(entity);

  useEffect(() => {
    (async () => {
      setApi(await import("@/lib/redux/features/" + pluralEntity));
    })();
  }, [pluralEntity]);

  return api ? (
    <DataGridInner
      query={query}
      entity={entity}
      pluralEntity={pluralEntity}
      api={api}
      columnsList={columnsList}
      columnsDetails={columnsDetails}
      formFields={formFields}
      editFormFields={editFormFields}
      canView={canView}
      canEdit={canEdit}
      canDelete={canDelete}
      canCreate={canCreate}
    />
  ) : null;
}

interface DataGridInnerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any;
  entity: string;
  pluralEntity: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  api: any;
  columnsList: GridColDef[];
  columnsDetails: string[];
  formFields: FieldConfig[];
  editFormFields?: FieldConfig[];
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canCreate: boolean;
}

function DataGridInner({
  query,
  entity,
  pluralEntity,
  api,
  columnsList,
  columnsDetails,
  formFields,
  editFormFields,
  canView,
  canEdit,
  canDelete,
  canCreate,
}: DataGridInnerProps) {
  const removeKey = `use${capitalize(pluralEntity)}ControllerRemoveMutation`;
  const useRemoveMutation = api[removeKey] ?? useNoopMutation;
  const [triggerDelete] = useRemoveMutation();

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [queryFilters, setQueryFilters] = useState<Record<string, string>>({});
  const queryFiltersKeyRef = useRef("{}");
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const showSuccess = (action: "created" | "updated" | "deleted") => {
    setDeleteError(null);
    setSuccessMessage(`${capitalize(entity)} ${action} successfully`);
  };

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 5000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const next = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== ""),
      );
      const nextKey = JSON.stringify(next);
      if (queryFiltersKeyRef.current === nextKey) return;
      queryFiltersKeyRef.current = nextKey;
      setQueryFilters(next);
      setPaginationModel((current) =>
        current.page === 0 ? current : { ...current, page: 0 },
      );
    }, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleRowClick = (params: GridRowParams) => {
    if (canView && params.row.id) {
      setSelectedRow(params.row.id);
      setDetailsOpen(true);
    }
  };

  const handleEdit = (params: GridRowParams) => {
    if (canEdit && params.row.id) {
      setSelectedRow(params.row.id);
      setEditOpen(true);
    }
  };

  const handleDeleteRequest = (params: GridRowParams) => {
    if (!canDelete || !params.row.id) return;
    setPendingDeleteId(params.row.id);
  };

  const handleDeleteConfirm = async () => {
    if (!pendingDeleteId) return;
    setDeleteError(null);
    try {
      await triggerDelete({ id: pendingDeleteId }).unwrap();
      setPendingDeleteId(null);
      showSuccess("deleted");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "data" in err
          ? (err as { data: { message?: string } }).data?.message
          : "Failed to delete";
      setPendingDeleteId(null);
      setDeleteError(message || "Failed to delete");
    }
  };

  const _columns = useMemo((): GridColDef[] => {
    const cols: GridColDef[] = columnsList.map((col) =>
      col.type === "boolean"
        ? ({
            ...col,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams) => (
              <BooleanChip value={!!params.value} />
            ),
          } as GridColDef)
        : col,
    );

    if (canEdit || canDelete) {
      cols.push({
        flex: 0.1,
        minWidth: 120,
        sortable: false,
        disableColumnMenu: true,
        field: "actions",
        headerName: "Actions",
        type: "actions",
        getActions: (params: GridRowParams) => {
          const actions = [];

          if (canEdit) {
            actions.push(
              <GridActionsCellItem
                key="edit"
                icon={<EditIcon fontSize="small" />}
                onClick={() => handleEdit(params)}
                label="Edit"
              />,
            );
          }

          if (canDelete) {
            actions.push(
              <GridActionsCellItem
                key="delete"
                icon={<DeleteIcon fontSize="small" color="error" />}
                onClick={() => handleDeleteRequest(params)}
                label="Delete"
              />,
            );
          }

          return actions;
        },
      });
    }

    return cols;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnsList, canEdit, canDelete]);

  const { data, error, isLoading } = query({
    take: paginationModel.pageSize,
    skip: paginationModel.page * paginationModel.pageSize,
    filter:
      Object.keys(queryFilters).length > 0
        ? JSON.stringify(queryFilters)
        : undefined,
  });

  const rows = useMemo(() => (data && data[0]) || [], [data]);
  const rowCount = useMemo(() => (data && data[1]) || 0, [data]);

  return (
    <>
      {successMessage && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setSuccessMessage(null)}
        >
          {successMessage}
        </Alert>
      )}

      {(error || deleteError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {deleteError || "Failed to load data"}
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
        <TableColumnFilters
          columns={columnsList}
          filters={filters}
          onChange={setFilters}
        />

        {canCreate && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
            sx={{ flexShrink: 0 }}
          >
            Create {capitalize(entity)}
          </Button>
        )}
      </Paper>

      <DataGrid
        rows={rows}
        rowCount={rowCount}
        columns={_columns}
        density="comfortable"
        autoHeight
        initialState={{
          pagination: {
            paginationModel: { pageSize: 25 },
          },
        }}
        pageSizeOptions={pageSizeOptions}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        sortModel={sortModel}
        sortingMode="server"
        onSortModelChange={setSortModel}
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
          "& .MuiDataGrid-row:hover": { cursor: canView ? "pointer" : "default", backgroundColor: "rgba(37,99,235,0.03)" },
        }}
      />

      {selectedRow && (
        <>
          <DialogDetails
            id={selectedRow}
            entity={entity}
            columns={columnsDetails}
            formFields={formFields}
            open={detailsOpen}
            handleClose={() => setDetailsOpen(false)}
          />
          <DialogEdit
            id={selectedRow}
            entity={entity}
            fields={editFormFields ?? formFields}
            open={editOpen}
            handleClose={() => setEditOpen(false)}
            onSuccess={() => showSuccess("updated")}
          />
        </>
      )}

      <DialogCreate
        entity={entity}
        fields={formFields}
        open={createOpen}
        handleClose={() => setCreateOpen(false)}
        onSuccess={() => showSuccess("created")}
      />

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title={`Delete ${capitalize(entity)}`}
        message={`Are you sure you want to delete this ${entity.toLowerCase()}? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPendingDeleteId(null)}
      />
    </>
  );
}
