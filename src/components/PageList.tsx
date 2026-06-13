"use client";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
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
}

export default function PageList({
  title,
  entity,
  columnsList,
  columnsDetails,
  formFields,
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
      <Typography variant="h2">{title}</Typography>

      <Box sx={{ width: "100%", mt: 4 }}>
        {api && (
          <CustomDataGrid
            entity={entity}
            query={api[key]}
            columnsList={columnsList}
            columnsDetails={columnsDetails}
            formFields={formFields}
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
