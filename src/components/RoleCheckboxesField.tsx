"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import { BooleanChip } from "@/components/BooleanChip";
import { extractItems } from "@/lib/extract-items";

interface ModuleWithRoles {
  id: number;
  name: string;
  roles: { id: number; name: string }[];
}

interface RoleCheckboxesFieldProps {
  label: string;
  modulesUrl: string;
  value: { id: number }[] | undefined;
  onChange?: (value: { id: number }[]) => void;
  enabled?: boolean;
  readOnly?: boolean;
}

export default function RoleCheckboxesField({
  label,
  modulesUrl,
  value,
  onChange,
  enabled = true,
  readOnly = false,
}: RoleCheckboxesFieldProps) {
  const [modules, setModules] = useState<ModuleWithRoles[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(modulesUrl, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then(async (data) => {
        if (cancelled) return;

        const moduleItems = extractItems(data);
        const withRoles = await Promise.all(
          moduleItems.map(async (mod: { id: number; name: string }) => {
            const rolesRes = await fetch(`/api/admin/modules/${mod.id}/roles`, {
              credentials: "include",
            });
            const roles = rolesRes.ok ? await rolesRes.json() : [];

            return {
              id: mod.id,
              name: mod.name,
              roles: Array.isArray(roles) ? roles : [],
            };
          }),
        );

        if (!cancelled) {
          setModules(withRoles);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setModules([]);
          setError("Failed to load roles");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, modulesUrl]);

  const selectedIds = getSelectedIds(value);

  const handleToggle = (roleId: number, checked: boolean) => {
    if (readOnly || !onChange) return;

    const nextIds = checked
      ? [...selectedIds, roleId]
      : selectedIds.filter((id) => id !== roleId);
    onChange(nextIds.map((id) => ({ id })));
  };

  const handleModuleToggle = (roleIds: number[], checked: boolean) => {
    if (readOnly || !onChange) return;

    const nextIds = checked
      ? [...new Set([...selectedIds, ...roleIds])]
      : selectedIds.filter((id) => !roleIds.includes(id));
    onChange(nextIds.map((id) => ({ id })));
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {label}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <Box
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            p: 1.5,
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 1.5,
            }}
          >
            {modules.map((mod) => {
              const moduleRoleIds = mod.roles.map((role) => role.id);
              const selectedCount = moduleRoleIds.filter((id) =>
                selectedIds.includes(id),
              ).length;
              const allSelected =
                moduleRoleIds.length > 0 &&
                selectedCount === moduleRoleIds.length;
              const someSelected = selectedCount > 0 && !allSelected;

              return (
                <Box
                  key={mod.id}
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    p: 1.25,
                    bgcolor: "background.default",
                  }}
                >
                  <ModuleHeader
                    name={mod.name}
                    readOnly={readOnly}
                    allSelected={allSelected}
                    someSelected={someSelected}
                    disabled={mod.roles.length === 0}
                    onToggle={(checked) =>
                      handleModuleToggle(moduleRoleIds, checked)
                    }
                  />

                  {mod.roles.length === 0 ? (
                    <Typography variant="body2" color="text.disabled">
                      No roles
                    </Typography>
                  ) : (
                    mod.roles.map((role) => (
                      <RoleRow
                        key={role.id}
                        name={role.name}
                        checked={selectedIds.includes(role.id)}
                        readOnly={readOnly}
                        onToggle={(checked) => handleToggle(role.id, checked)}
                      />
                    ))
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
}

function ModuleHeader({
  name,
  readOnly,
  allSelected,
  someSelected,
  disabled,
  onToggle,
}: {
  name: string;
  readOnly: boolean;
  allSelected: boolean;
  someSelected: boolean;
  disabled: boolean;
  onToggle: (checked: boolean) => void;
}) {
  const displayName = formatModuleName(name);

  if (readOnly) {
    return (
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: "block",
          fontWeight: 600,
          textTransform: "capitalize",
          mb: 0.75,
        }}
      >
        {displayName}
      </Typography>
    );
  }

  return (
    <FormControlLabel
      sx={{ display: "flex", ml: 0, mr: 0, mb: 0.75 }}
      control={
        <Checkbox
          size="small"
          checked={allSelected}
          indeterminate={someSelected}
          disabled={disabled}
          onChange={(e) => onToggle(e.target.checked)}
        />
      }
      label={
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontWeight: 600, textTransform: "capitalize" }}
        >
          {displayName}
        </Typography>
      }
    />
  );
}

function RoleRow({
  name,
  checked,
  readOnly,
  onToggle,
}: {
  name: string;
  checked: boolean;
  readOnly: boolean;
  onToggle: (checked: boolean) => void;
}) {
  const displayName = formatRoleLabel(name);

  if (readOnly) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          py: 0.25,
        }}
      >
        <Typography variant="body2" noWrap>
          {displayName}
        </Typography>
        <BooleanChip value={checked} />
      </Box>
    );
  }

  return (
    <FormControlLabel
      sx={{ display: "flex", ml: 0, mr: 0 }}
      control={
        <Checkbox
          size="small"
          checked={checked}
          onChange={(e) => onToggle(e.target.checked)}
        />
      }
      label={
        <Typography variant="body2" noWrap>
          {displayName}
        </Typography>
      }
    />
  );
}

function getSelectedIds(value: { id: number }[] | undefined): number[] {
  return value?.map((item) => item.id) ?? [];
}

function formatModuleName(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatRoleLabel(name: string): string {
  return name
    .replace(/^ROLE_/, "")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
