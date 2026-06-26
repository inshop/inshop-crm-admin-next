"use client";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import CustomDataGrid from "@/components/CustomDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { capitalize } from "@mui/material";
import pluralize from "pluralize";
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { FieldConfig } from "@/components/FormField";

interface PageListType {
  title: string;
  entity: string;
  columnsList: GridColDef[];
  columnsDetails: string[];
  formFields: FieldConfig[];
  editFormFields?: FieldConfig[];
  description?: string;
}

export default function PageList({
  title,
  entity,
  columnsList,
  columnsDetails,
  formFields,
  editFormFields,
  description,
}: PageListType) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [api, setApi] = useState<any>(null);
  const key = `use${capitalize(pluralize(entity))}ControllerFindAllQuery`;
  const { canCreate, canUpdate, canDetails, canDelete } = useAuth();

  useEffect(() => {
    (async () => {
      setApi(await import("@/lib/redux/features/" + pluralize(entity)));
    })();
  }, [entity]);

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h2" sx={{ mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description ?? `Manage and configure ${pluralize(title.toLowerCase())}`}
        </Typography>
        <Divider sx={{ mt: 2.5 }} />
      </Box>

      <Box sx={{ width: "100%" }}>
        {api && (
          <CustomDataGrid
            entity={entity}
            query={api[key]}
            columnsList={columnsList}
            columnsDetails={columnsDetails}
            formFields={formFields}
            editFormFields={editFormFields}
            canView={canDetails(entity)}
            canEdit={canUpdate(entity)}
            canDelete={canDelete(entity)}
            canCreate={canCreate(entity)}
          />
        )}
      </Box>
    </>
  );
}
