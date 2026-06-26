"use client";

import CustomDialog from "@/components/CustomDialog";
import { useEffect, useState } from "react";
import { capitalize, Tab, Tabs } from "@mui/material";
import pluralize from "pluralize";
import Box from "@mui/material/Box";
import CustomTableData from "@/components/CustomTableData";
import EntityAuditHistory from "@/components/EntityAuditHistory";
import ApiTokenDetailsCurlSamples from "@/components/ApiTokenDetailsCurlSamples";
import { FieldConfig } from "@/components/FormField";
import { useAuth } from "@/providers/AuthProvider";

const entitiesWithHistory = new Set([
  "user",
  "group",
  "project",
  "environment",
  "featureFlag",
  "apiToken",
]);

function auditEntityType(entity: string): string {
  if (entity === "featureFlag") return "feature_flag";
  if (entity === "apiToken") return "api_token";
  return entity;
}

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
  const [activeTab, setActiveTab] = useState(0);
  const { canList } = useAuth();
  const key = `use${capitalize(pluralize(entity))}ControllerFindOneQuery`;

  const showHistoryTab =
    entitiesWithHistory.has(entity) && canList("audit");

  useEffect(() => {
    (async () => {
      setApi(await import("@/lib/redux/features/" + pluralize(entity)));
    })();
  }, [entity]);

  useEffect(() => {
    if (open) setActiveTab(0);
  }, [open, id]);

  const wideDetailEntities = new Set(["group", "audit"]);
  const dialogMaxWidth =
    wideDetailEntities.has(entity) || showHistoryTab ? "lg" : undefined;
  const detailFields = formFields.filter(
    (field) => field.type === "role-checkboxes",
  );

  return (
    <CustomDialog
      open={open}
      handleClose={handleClose}
      maxWidth={dialogMaxWidth}
      contentSx={{ minHeight: 400 }}
      title={`${entity === "apiToken" ? "API Token" : capitalize(entity)} Details`}
    >
      {showHistoryTab && (
        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Details" />
          <Tab label="History" />
        </Tabs>
      )}

      <Box sx={{ width: "100%", mt: showHistoryTab ? 0 : 2 }}>
        {activeTab === 0 && api && (
          <>
            <CustomTableData
              columns={columns}
              query={api[key]}
              id={id}
              detailFields={detailFields}
            />
            {entity === "apiToken" && (
              <Box sx={{ mt: 3 }}>
                <ApiTokenDetailsCurlSamples tokenId={id} />
              </Box>
            )}
          </>
        )}
        {activeTab === 1 && showHistoryTab && (
          <EntityAuditHistory
            entityType={auditEntityType(entity)}
            entityId={id}
          />
        )}
      </Box>
    </CustomDialog>
  );
};

export default DialogDetails;
