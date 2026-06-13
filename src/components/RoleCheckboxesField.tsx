"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";

interface ModuleWithRoles {
  id: number;
  name: string;
  roles: { id: number; name: string }[];
}

interface RoleCheckboxesFieldProps {
  label: string;
  modulesUrl: string;
  value: { id: number }[] | undefined;
  onChange: (value: { id: number }[]) => void;
  enabled?: boolean;
}

export default function RoleCheckboxesField({
  label,
  modulesUrl,
  value,
  onChange,
  enabled = true,
}: RoleCheckboxesFieldProps) {
  const [modules, setModules] = useState<ModuleWithRoles[]>([]);
  const [loading, setLoading] = useState(false);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!enabled || hasFetchedRef.current) {
      return;
    }

    let cancelled = false;
    setLoading(true);

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
          hasFetchedRef.current = true;
        }
      })
      .catch(() => {
        if (!cancelled) setModules([]);
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
    const nextIds = checked
      ? [...selectedIds, roleId]
      : selectedIds.filter((id) => id !== roleId);
    onChange(nextIds.map((id) => ({ id })));
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {label}
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <Box
          sx={{
            maxHeight: 360,
            overflowY: "auto",
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            p: 1.5,
          }}
        >
          {modules.map((mod) => (
            <Box key={mod.id} sx={{ mb: 2, "&:last-child": { mb: 0 } }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 0.5, textTransform: "capitalize" }}
              >
                {mod.name}
              </Typography>

              {mod.roles.length === 0 ? (
                <Typography variant="body2" color="text.disabled" sx={{ pl: 1 }}>
                  No roles
                </Typography>
              ) : (
                mod.roles.map((role) => (
                  <FormControlLabel
                    key={role.id}
                    sx={{ display: "flex", ml: 0 }}
                    control={
                      <Checkbox
                        size="small"
                        checked={selectedIds.includes(role.id)}
                        onChange={(e) => handleToggle(role.id, e.target.checked)}
                      />
                    }
                    label={formatRoleLabel(role.name)}
                  />
                ))
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

function getSelectedIds(value: { id: number }[] | undefined): number[] {
  return value?.map((item) => item.id) ?? [];
}

function extractItems(data: unknown): { id: number; name: string }[] {
  if (!data || !Array.isArray(data)) return [];
  return Array.isArray(data[0]) ? data[0] : data;
}

function formatRoleLabel(name: string): string {
  return name
    .replace(/^ROLE_/, "")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
