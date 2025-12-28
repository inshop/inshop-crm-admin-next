import { GridColDef } from "@mui/x-data-grid";

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
    editable: true,
    sortable: false,
    disableColumnMenu: true,
  },
];

export const columnsDetails = ["id", "name"];

export const columnsEdit = ["id", "name"];
