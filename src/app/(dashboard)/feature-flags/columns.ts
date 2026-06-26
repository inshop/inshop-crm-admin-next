import { FieldConfig } from "@/components/FormField";
import { defaultExpiresAt } from "@/lib/default-expires-at";

export const formFields: FieldConfig[] = [
  { name: "name", required: true },
  { name: "code", required: true },
  {
    name: "expiresAt",
    type: "date",
    label: "Expires at",
    required: true,
    getDefaultValue: defaultExpiresAt,
  },
  {
    name: "projectIds",
    type: "multiselect",
    label: "Projects",
    required: true,
    optionsUrl: "/api/admin/projects?take=100&skip=0",
  },
];
