export const aiPluginJson = {
  schema_version: 'v1',
  name_for_human: 'TODO List (No Auth)',
  name_for_model: 'todo',
  description_for_human: 'Manage your TODO list. You can add, remove and view your TODOs.',
  description_for_model:
    'Plugin for managing a TODO list, you can add, remove and view your TODOs.',
  auth: {
    type: 'none',
  },
  api: {
    type: 'openapi',
    url: 'http://localhost:8787/openapi.json',
  },
  logo_url:
    'https://ss.yusukebe.com/a4ebf3360db8e05185b83866352539ff4a587f2df97273258551dbb34c88b792_800x744.png',
  contact_email: 'support@example.com',
  legal_info_url: 'https://example.com/legal',
}
