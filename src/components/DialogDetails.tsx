"use client";

import CustomDialog from "@/components/CustomDialog";
import { useEffect, useState } from "react";
import { capitalize } from "@mui/material";
import pluralize from "pluralize";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CustomTableData from "@/components/CustomTableData";
import { FieldConfig } from "@/components/FormField";

interface DialogDetailsProps {
  entity: string;
  columns: string[];
  formFields?: FieldConfig[];
  open: boolean;
  handleClose(): void;
  id: number;
}

const DialogDetails = ({
  entity,
  open,
  handleClose,
  id,
  columns,
  formFields = [],
}: DialogDetailsProps) => {
  const [api, setApi] = useState(null);
  const key = `use${capitalize(pluralize(entity))}ControllerFindOneQuery`;

  useEffect(() => {
    (async () => {
      setApi(await import("@/lib/redux/features/" + pluralize(entity)));
    })();
  }, [entity]);

  const dialogMaxWidth = entity === "group" ? "lg" : undefined;
  const detailFields = formFields.filter(
    (field) => field.type === "role-checkboxes",
  );

  return (
    <CustomDialog
      open={open}
      handleClose={handleClose}
      maxWidth={dialogMaxWidth}
    >
      <Typography variant="h6" sx={{ mb: 2, pr: 4 }}>
        {capitalize(entity)} Details
      </Typography>

      <Box sx={{ width: "100%", mt: 2 }}>
        {api && (
          <CustomTableData
            columns={columns}
            query={api[key]}
            id={id}
            detailFields={detailFields}
          ></CustomTableData>
        )}
      </Box>
    </CustomDialog>
  );
};

export default DialogDetails;
