import type { ConfigFile } from '@rtk-query/codegen-openapi'

const config: ConfigFile = {
  schemaFile: 'http://localhost:4000/api-json',
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
    './src/lib/redux/features/roles.ts': {
      filterEndpoints: [/roles/i],
    },
    './src/lib/redux/features/groups.ts': {
      filterEndpoints: [/groups/i],
    },
    './src/lib/redux/features/modules.ts': {
      filterEndpoints: [/modules/i],
    },
    './src/lib/redux/features/clients.ts': {
      filterEndpoints: [/clients/i],
    },
    './src/lib/redux/features/contacts.ts': {
      filterEndpoints: [/contacts/i],
    },
  },
  hooks: true,
}

export default config
