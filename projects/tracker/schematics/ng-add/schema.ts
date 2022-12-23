export interface Schema {
  skipImport?: boolean;
  skipLegacyPackageMigration?: boolean;
  module?: string;
  path?: string;
  project?: string;
  serverUrl?: string;
  siteId?: string;
  scriptUrl?: string;
  router?: boolean;
}
