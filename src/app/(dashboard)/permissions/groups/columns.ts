import {GridColDef} from "@mui/x-data-grid";

export const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID',
    flex: 0.1,
    minWidth: 100,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'name',
    headerName: 'Name',
    flex: 0.4,
    minWidth: 200,
    editable: true,
    sortable: false,
    disableColumnMenu: true,
  }
];

export default columns;
