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
];

export const columnsDetails = ["id", "name"];

export const formFields: FieldConfig[] = [
  { name: "name" },
  {
    name: "roles",
    type: "multiselect",
    label: "Roles",
    optionsUrl: "/api/admin/modules?take=100&skip=0",
    optionsPath: "roles",
  },
];
