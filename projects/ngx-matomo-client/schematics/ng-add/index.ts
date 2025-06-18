import {
  chain,
  noop,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  addDependency,
  addRootImport,
  addRootProvider,
  DependencyType,
  readWorkspace,
  WorkspaceDefinition,
} from '@schematics/angular/utility';
import * as ts from 'typescript';
import { SyntaxKind } from 'typescript';
import {
  applyToUpdateRecorder,
  Change,
  escapeLiteral,
  getPackageJsonDependency,
  readIntoSourceFile,
  removePackageJsonDependency,
  ReplaceChange,
} from '../utils';
import { version } from '../version';
import { Schema as Options } from './schema';

function hasAngularRouterDependency(host: Tree): boolean {
  return getPackageJsonDependency(host, '@angular/router') != null;
}

function checkRequiredRouterDependency(host: Tree) {
  if (!hasAngularRouterDependency(host)) {
    throw new SchematicsException(
      `You chose to automatically track page view, but this requires @angular/router as a dependency.\n` +
        `You can run "ng add @angular/router" to add it to your application.`,
    );
  }
}

function addPackageJsonDependencies(options: Options) {
  return (host: Tree, context: SchematicContext) => {
    addDependency('ngx-matomo-client', version, {
      type: DependencyType.Default,
    });

    if (!options.skipLegacyPackageMigration) {
      removePackageJsonDependency(host, '@ngx-matomo/tracker');
      removePackageJsonDependency(host, '@ngx-matomo/router');
    }

    if (options.router) {
      checkRequiredRouterDependency(host);
    }

    context.addTask(new NodePackageInstallTask());
    return host;
  };
}

function buildTrackerConfig(options: Options, context: SchematicContext): string {
  const trackerUrl = escapeLiteral(options.serverUrl || '');
  const siteId = escapeLiteral(options.siteId || '');
  const scriptUrl = escapeLiteral(options.scriptUrl || '');
  const embeddedMode = !!scriptUrl && !trackerUrl && !siteId;
  let config: string;

  if (embeddedMode) {
    config = `{ scriptUrl: '${scriptUrl}' }`;
  } else {
    if (scriptUrl) {
      config = `{ trackerUrl: '${trackerUrl}', siteId: '${siteId}', scriptUrl: '${scriptUrl}' }`;
    } else {
      config = `{ trackerUrl: '${trackerUrl}', siteId: '${siteId}' }`;
    }

    if (!trackerUrl || !siteId) {
      context.logger.warn(
        'Configuration properties "siteId" and "trackerUrl" are usually required. ' +
          'You will need to manually update your configuration.',
      );
    }
  }

  return config;
}

function getDefaultProjectName(workspace: WorkspaceDefinition) {
  const keys = Array.from(workspace.projects.keys());

  return (
    keys.find(key => workspace.projects.get(key)?.extensions.projectType === 'application') ??
    keys[0]
  );
}

async function getProjectName(options: Options, host: Tree) {
  const workspace = await readWorkspace(host);
  const projectName = options.project || getDefaultProjectName(workspace);
  const project = workspace.projects.get(projectName);

  if (!project) {
    throw new SchematicsException(
      options.project
        ? `No project found with name "${options.project}"`
        : `No project found in the workspace!`,
    );
  }

  return projectName;
}

async function getProjectPath(options: Options, host: Tree) {
  const workspace = await readWorkspace(host);
  const projectName = options.project || Array.from(workspace.projects.keys())[0];
  const project = workspace.projects.get(projectName);

  if (!project) {
    throw new SchematicsException(
      options.project
        ? `No project found with name "${options.project}"`
        : `No project found in the workspace!`,
    );
  }

  return `/${project.root}`;
}

function addProviders(options: Options, context: SchematicContext): Rule {
  return async (host: Tree) => {
    const projectName = await getProjectName(options, host);
    const trackerConfig = buildTrackerConfig(options, context);
    const entryPoints = getImportEntryPoints(host, options);

    return addRootProvider(projectName, ({ code, external }) => {
      if (options.router) {
        return code`${external('provideMatomo', entryPoints.core)}(
  ${trackerConfig},
  ${external('withRouter', entryPoints.router)}()
)`;
      } else {
        return code`${external('provideMatomo', entryPoints.core)}(${trackerConfig})`;
      }
    });
  };
}

function addImports(options: Options, context: SchematicContext): Rule {
  return async (host: Tree) => {
    const projectName = await getProjectName(options, host);
    const trackerConfig = buildTrackerConfig(options, context);
    const entryPoints = getImportEntryPoints(host, options);
    const rules: Rule[] = [
      addRootImport(
        projectName,
        ({ code, external }) =>
          code`${external('MatomoModule', entryPoints.core)}.forRoot(${trackerConfig})`,
      ),
    ];

    if (options.router) {
      rules.push(
        addRootImport(
          projectName,
          ({ code, external }) => code`${external('MatomoRouterModule', entryPoints.router)}`,
        ),
      );
    }

    return chain(rules);
  };
}

function getImportEntryPoints(
  host: Tree,
  options: Options,
): {
  core: string;
  router: string;
} {
  const useSecondaryEntryPoint = !hasAngularRouterDependency(host) && !options.router;
  const core = useSecondaryEntryPoint ? 'ngx-matomo-client/core' : 'ngx-matomo-client';
  const router = useSecondaryEntryPoint ? 'ngx-matomo-client/router' : 'ngx-matomo-client';

  return { core, router };
}

function migrateAllLegacyImports(options: Options, context: SchematicContext): Rule {
  return async (host: Tree) => {
    if (!options.skipLegacyPackageMigration) {
      const projectPath = await getProjectPath(options, host);
      const migrationRoot = host.getDir(projectPath);
      const entryPoints = getImportEntryPoints(host, options);

      context.logger.info(
        `Migrating imports from legacy @ngx-matomo/* packages at ${projectPath}...`,
      );

      migrationRoot.visit(path => {
        if (path.endsWith('.ts') && path.startsWith(projectPath)) {
          const file = readIntoSourceFile(host, path);
          const changes: Change[] = [];

          file.forEachChild(node => {
            if (node.kind === SyntaxKind.ImportDeclaration) {
              const statement = node as ts.ImportDeclaration;
              const moduleSpecifier = statement.moduleSpecifier as ts.StringLiteral;
              const fullText = moduleSpecifier.getFullText();
              const text = moduleSpecifier.text;
              const pos = moduleSpecifier.pos;

              if (text === '@ngx-matomo/tracker') {
                // Be sure to keep any original spacings (contained in getFullText() only)
                const newFullText = fullText.replace(text, entryPoints.core);

                changes.push(new ReplaceChange(path, pos, fullText, newFullText));
              }

              if (text === '@ngx-matomo/router') {
                // Be sure to keep any original spacings (contained in getFullText() only)
                const newFullText = fullText.replace(text, entryPoints.router);

                changes.push(new ReplaceChange(path, pos, fullText, newFullText));
              }
            }
          });

          const recorder = host.beginUpdate(path);

          applyToUpdateRecorder(recorder, changes);

          host.commitUpdate(recorder);
        }
      });
    }

    return host;
  };
}

function getImportRule(options: Options, context: SchematicContext) {
  if (options.skipImport) {
    return noop;
  }

  return options.useModuleImport ? addImports(options, context) : addProviders(options, context);
}

export function ngAdd(options: Options): Rule {
  return async (_host, context) =>
    chain([
      addPackageJsonDependencies(options),
      getImportRule(options, context),
      migrateAllLegacyImports(options, context),
    ]);
}
