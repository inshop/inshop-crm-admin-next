import type { SxProps, Theme } from "@mui/material/styles";

export const dataGridSx: SxProps<Theme> = {
  border: "1px solid #E2E8F0",
  borderRadius: "10px",
  backgroundColor: "#fff",
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#F1F5F9",
    borderBottom: "1px solid #E2E8F0",
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: 600,
    fontSize: "0.75rem",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: "#64748B",
  },
  "& .MuiDataGrid-columnHeader": {
    paddingLeft: "20px",
    paddingRight: "20px",
    outline: "none !important",
  },
  "& .MuiDataGrid-columnHeader:focus": {
    outline: "none !important",
  },
  "& .MuiDataGrid-columnHeader:focus-within": {
    outline: "none !important",
  },
  "& .MuiDataGrid-cell": {
    borderColor: "#E2E8F0",
    paddingLeft: "20px",
    paddingRight: "20px",
    outline: "none !important",
  },
  "& .MuiDataGrid-cell:focus": {
    outline: "none !important",
  },
  "& .MuiDataGrid-cell:focus-within": {
    outline: "none !important",
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: "rgba(37,99,235,0.03)",
  },
  "& .MuiDataGrid-footerContainer": {
    borderTop: "1px solid #E2E8F0",
  },
};
