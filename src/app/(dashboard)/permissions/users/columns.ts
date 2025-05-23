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
  },
  {
    field: 'email',
    headerName: 'email',
    flex: 0.4,
    minWidth: 200,
    editable: true,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'group',
    headerName: 'Group',
    flex: 0.4,
    minWidth: 200,
    editable: true,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) => {
      return params.row.group ? params.row.group.name : 'No Group';
    }
  },
  {
    field: 'isActive',
    headerName: 'Active',
    type: 'boolean',
    flex: 0.1,
    minWidth: 100,
    editable: true,
    sortable: false,
    disableColumnMenu: true,
  }
];

export default columns;
