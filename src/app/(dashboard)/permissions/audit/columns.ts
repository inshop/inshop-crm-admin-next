import { GridColDef } from "@mui/x-data-grid";
import { FieldConfig } from "@/components/FormField";
import { formatDateTimeEu } from "@/lib/format-date";

const readOnlyCol = (def: GridColDef): GridColDef => ({
  sortable: false,
  disableColumnMenu: true,
  ...def,
});

export const columnsList: GridColDef[] = [
  readOnlyCol({
    field: "id",
    headerName: "ID",
    flex: 0.1,
    minWidth: 80,
  }),
  readOnlyCol({
    field: "createdAt",
    headerName: "When",
    flex: 0.25,
    minWidth: 180,
    filterable: false,
    renderCell: (params) => formatDateTimeEu(params.value as string),
  }),
  readOnlyCol({
    field: "action",
    headerName: "Action",
    flex: 0.15,
    minWidth: 100,
  }),
  readOnlyCol({
    field: "entityType",
    headerName: "Entity",
    flex: 0.15,
    minWidth: 100,
  }),
  readOnlyCol({
    field: "entityId",
    headerName: "Entity ID",
    flex: 0.1,
    minWidth: 90,
  }),
  readOnlyCol({
    field: "user",
    headerName: "User",
    flex: 0.25,
    minWidth: 150,
    renderCell: (params) =>
      params.row.user ? params.row.user.name : "-",
  }),
];

export const columnsDetails = [
  "id",
  "createdAt",
  "action",
  "entityType",
  "entityId",
  "user",
  "changes",
  "metadata",
];

export const formFields: FieldConfig[] = [];
