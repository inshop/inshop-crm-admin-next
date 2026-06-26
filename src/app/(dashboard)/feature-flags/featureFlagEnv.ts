import { FeatureFlag } from "@/lib/redux/features/featureFlags";

export interface EnvironmentRow {
  id: number;
  name: string;
  code: string;
  isActive?: boolean;
}

export interface PendingToggle {
  flagId: number;
  flagName: string;
  environmentId: number;
  environmentName: string;
  enabled: boolean;
}

export function getEnvEnabled(flag: FeatureFlag, environmentId: number): boolean {
  return (
    flag.environmentValues?.find((v) => v.environment.id === environmentId)
      ?.enabled ?? false
  );
}

export function parseEnvironments(
  envData: [EnvironmentRow[], number] | undefined,
): EnvironmentRow[] {
  return envData?.[0] ?? [];
}
