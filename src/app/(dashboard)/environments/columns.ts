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
    field: "code",
    headerName: "Code",
    flex: 0.4,
    minWidth: 200,
    sortable: false,
    disableColumnMenu: true,
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

export const columnsDetails = ["id", "name", "code", "isActive"];

export const formFields: FieldConfig[] = [
  { name: "name" },
  { name: "code" },
  { name: "isActive", type: "boolean" },
];
