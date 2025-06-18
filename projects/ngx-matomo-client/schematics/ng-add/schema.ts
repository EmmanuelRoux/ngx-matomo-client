export interface Schema {
  skipImport?: boolean;
  skipLegacyPackageMigration?: boolean;
  useModuleImport?: boolean;
  project?: string;
  serverUrl?: string;
  siteId?: string;
  scriptUrl?: string;
  router?: boolean;
}
