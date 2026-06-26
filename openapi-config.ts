import type { ConfigFile } from '@rtk-query/codegen-openapi'

const config: ConfigFile = {
  schemaFile: './openapi.json',
  apiFile: './src/lib/redux/api.ts',
  apiImport: 'api',
  exportName: 'api',
  outputFiles: {
    './src/lib/redux/features/auth.ts': {
      filterEndpoints: [/auth/i],
    },
    './src/lib/redux/features/users.ts': {
      filterEndpoints: [/users/i],
    },
    './src/lib/redux/features/groups.ts': {
      filterEndpoints: [/groups/i],
    },
    './src/lib/redux/features/projects.ts': {
      filterEndpoints: [/projects/i],
    },
    './src/lib/redux/features/environments.ts': {
      filterEndpoints: [/environments/i],
    },
    './src/lib/redux/features/featureFlags.ts': {
      filterEndpoints: [/featureFlags/i],
    },
    './src/lib/redux/features/audits.ts': {
      filterEndpoints: [/audits/i],
    },
    './src/lib/redux/features/apiTokens.ts': {
      filterEndpoints: [/apiTokens/i],
    },
  },
  hooks: true,
}

export default config
