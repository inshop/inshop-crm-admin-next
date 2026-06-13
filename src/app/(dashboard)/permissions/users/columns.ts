import { GridColDef } from "@mui/x-data-grid";
import { FieldConfig } from "@/components/FormField";

export const columnsList: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.1,
    minWidth: 100,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "name",
    headerName: "Name",
    flex: 0.4,
    minWidth: 200,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "email",
    headerName: "email",
    flex: 0.4,
    minWidth: 200,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "group",
    headerName: "Group",
    flex: 0.4,
    minWidth: 200,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) => {
      return params.row.group ? params.row.group.name : "No Group";
    },
  },
  {
    field: "isActive",
    headerName: "Active",
    type: "boolean",
    flex: 0.1,
    minWidth: 100,
    sortable: false,
    disableColumnMenu: true,
  },
];

export const columnsDetails = ["id", "name", "email", "isActive"];

export const formFields: FieldConfig[] = [
  { name: "name" },
  { name: "email" },
  { name: "password", type: "password" },
  {
    name: "group",
    type: "select",
    label: "Group",
    optionsUrl: "/api/admin/groups?take=100&skip=0",
  },
  { name: "isActive", type: "boolean" },
];
