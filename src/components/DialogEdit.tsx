"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { capitalize } from "@mui/material";
import pluralize from "pluralize";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import CustomDialog from "@/components/CustomDialog";
import FormField, { FieldConfig } from "@/components/FormField";

function getEditFieldInitialValue(
  data: Record<string, unknown>,
  field: FieldConfig,
): unknown {
  const direct = data[field.name];
  if (direct !== undefined && direct !== null && direct !== "") {
    return field.type === "boolean" ? !!direct : direct;
  }

  if (field.name.endsWith("Id")) {
    const relationKey = field.name.slice(0, -2);
    const relation = data[relationKey];
    if (relation && typeof relation === "object" && "id" in relation) {
      return (relation as { id: number }).id;
    }
  }

  if (field.type === "boolean") {
    return false;
  }

  return "";
}

function getEntityLabel(entity: string): string {
  if (entity === "featureFlag") return "Feature Flag";
  if (entity === "apiToken") return "API Token";
  return capitalize(entity);
}

interface DialogEditProps {
  entity: string;
  fields: FieldConfig[];
  open: boolean;
  handleClose(): void;
  onSuccess?(): void;
  id: number;
}

export default function DialogEdit({
  entity,
  fields,
  open,
  handleClose,
  onSuccess,
  id,
}: DialogEditProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [api, setApi] = useState<any>(null);
  const pluralEntity = pluralize(entity);

  useEffect(() => {
    (async () => {
      setApi(await import("@/lib/redux/features/" + pluralEntity));
    })();
  }, [pluralEntity]);

  const dialogMaxWidth = entity === "group" ? "lg" : undefined;

  return (
    <CustomDialog
      open={open}
      handleClose={handleClose}
      maxWidth={dialogMaxWidth}
      title={`Edit ${getEntityLabel(entity)}`}
    >

      {api && (
        <EditForm
          api={api}
          entity={entity}
          fields={fields}
          id={id}
          open={open}
          handleClose={handleClose}
          onSuccess={onSuccess}
        />
      )}
    </CustomDialog>
  );
}

interface EditFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  api: any;
  entity: string;
  fields: FieldConfig[];
  id: number;
  open: boolean;
  handleClose(): void;
  onSuccess?(): void;
}

function EditForm({
  api,
  entity,
  fields,
  id,
  open,
  handleClose,
  onSuccess,
}: EditFormProps) {
  const pluralEntity = pluralize(entity);
  const findOneKey = `use${capitalize(pluralEntity)}ControllerFindOneQuery`;
  const updateKey = `use${capitalize(pluralEntity)}ControllerUpdateMutation`;

  const { data, isLoading: queryLoading } = api[findOneKey]({ id });
  const [trigger, { isLoading: saving }] = api[updateKey]();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (open) {
      setError(null);
      setInitialized(false);
    }
  }, [open, id]);

  useEffect(() => {
    if (data && !initialized) {
      const initial: Record<string, unknown> = {};
      for (const field of fields) {
        initial[field.name] = getEditFieldInitialValue(
          data as Record<string, unknown>,
          field,
        );
      }
      setFormData(initial);
      setInitialized(true);
    }
  }, [data, initialized, fields]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const dtoKey = `update${capitalize(entity)}Dto`;
      await trigger({ id, [dtoKey]: formData }).unwrap();
      onSuccess?.();
      handleClose();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "data" in err
          ? (err as { data: { message?: string } }).data?.message
          : "Failed to update";
      setError(message || "Failed to update");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (queryLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ width: "100%", mt: 2 }}
      >
        {fields.map((field) => (
          <FormField
            key={field.name}
            config={field}
            value={formData[field.name]}
            onChange={handleChange}
            enabled={open}
          />
        ))}

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={saving}
          sx={{ mt: 2 }}
        >
          {saving ? <CircularProgress size={24} /> : "Save"}
        </Button>
      </Box>
    </>
  );
}
