"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { capitalize } from "@mui/material";
import pluralize from "pluralize";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import CustomDialog from "@/components/CustomDialog";
import FormField, { FieldConfig } from "@/components/FormField";

interface DialogCreateProps {
  entity: string;
  fields: FieldConfig[];
  open: boolean;
  handleClose(): void;
}

export default function DialogCreate({
  entity,
  fields,
  open,
  handleClose,
}: DialogCreateProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [api, setApi] = useState<any>(null);
  const pluralEntity = pluralize(entity);

  useEffect(() => {
    (async () => {
      setApi(await import("@/lib/redux/features/" + pluralEntity));
    })();
  }, [pluralEntity]);

  return (
    <CustomDialog open={open} handleClose={handleClose}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Create {capitalize(entity)}
      </Typography>

      {api && (
        <CreateForm
          api={api}
          entity={entity}
          fields={fields}
          open={open}
          handleClose={handleClose}
        />
      )}
    </CustomDialog>
  );
}

interface CreateFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  api: any;
  entity: string;
  fields: FieldConfig[];
  open: boolean;
  handleClose(): void;
}

function CreateForm({ api, entity, fields, open, handleClose }: CreateFormProps) {
  const pluralEntity = pluralize(entity);
  const mutationKey = `use${capitalize(pluralEntity)}ControllerCreateMutation`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);

  const [trigger, { isLoading }] = api[mutationKey]();

  useEffect(() => {
    if (open) {
      setFormData({});
      setError(null);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const dtoKey = `create${capitalize(entity)}Dto`;
      await trigger({ [dtoKey]: formData }).unwrap();
      handleClose();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "data" in err
          ? (err as { data: { message?: string } }).data?.message
          : "Failed to create";
      setError(message || "Failed to create");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
          />
        ))}

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading}
          sx={{ mt: 2 }}
        >
          {isLoading ? <CircularProgress size={24} /> : "Create"}
        </Button>
      </Box>
    </>
  );
}
