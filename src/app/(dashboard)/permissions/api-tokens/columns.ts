import { GridColDef } from "@mui/x-data-grid";
import { FieldConfig } from "@/components/FormField";
import { formatDateTimeEu } from "@/lib/format-date";

export const columnsList: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.1,
    minWidth: 80,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "name",
    headerName: "Name",
    flex: 0.3,
    minWidth: 160,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "project",
    headerName: "Project",
    flex: 0.2,
    minWidth: 140,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) => params.row.project?.name ?? "-",
  },
  {
    field: "environment",
    headerName: "Environment",
    flex: 0.2,
    minWidth: 140,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) => params.row.environment?.name ?? "-",
  },
  {
    field: "isActive",
    headerName: "Active",
    type: "boolean",
    flex: 0.1,
    minWidth: 90,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "createdAt",
    headerName: "Created",
    flex: 0.2,
    minWidth: 160,
    sortable: false,
    disableColumnMenu: true,
    filterable: false,
    renderCell: (params) =>
      params.value ? formatDateTimeEu(String(params.value)) : "-",
  },
];

export const columnsDetails = [
  "id",
  "name",
  "project",
  "environment",
  "isActive",
  "createdAt",
  "createdBy",
];

export const formFields: FieldConfig[] = [
  { name: "name", required: true },
  {
    name: "projectId",
    type: "select",
    label: "Project",
    required: true,
    optionsUrl: "/api/admin/projects?take=100&skip=0",
  },
  {
    name: "environmentId",
    type: "select",
    label: "Environment",
    required: true,
    optionsUrl: "/api/admin/environments?take=100&skip=0",
  },
  {
    name: "isActive",
    type: "boolean",
    getDefaultValue: () => true,
  },
];
