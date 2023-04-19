import {
  chain,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  addSymbolToNgModuleMetadata,
  findNodes,
  getDecoratorMetadata,
  getMetadataField,
  insertImport,
} from '@schematics/angular/utility/ast-utils';
import { applyToUpdateRecorder, Change, ReplaceChange } from '@schematics/angular/utility/change';
import {
  addPackageJsonDependency,
  getPackageJsonDependency,
  NodeDependencyType,
} from '@schematics/angular/utility/dependencies';
import { findModuleFromOptions } from '@schematics/angular/utility/find-module';
import { createDefaultPath } from '@schematics/angular/utility/workspace';
import * as ts from 'typescript';
import { SyntaxKind } from 'typescript';
import { escapeLiteral, readIntoSourceFile } from '../schematics-utils';
import { version } from '../version';
import { Schema as Options } from './schema';

/***********************************************************************************/
/* Important note: this schematic depends on non-public API of @schematics/angular */

/***********************************************************************************/

function checkRequiredRouterDependency(host: Tree, context: SchematicContext) {
  const ngRouter = getPackageJsonDependency(host, '@angular/router');

  if (!ngRouter) {
    throw new SchematicsException(
      `You chose to automatically track page view, but this requires @angular/router as a dependency.\n` +
        `You can run "ng add @angular/router" to add it to your application.`
    );
  }

  if (ngRouter.type !== NodeDependencyType.Default) {
    context.logger.warn(
      `You chose to automatically track page view, but @angular/router is listed as "${ngRouter.type}" dependency.`
    );
  }
}

function addPackageJsonDependencies(options: Options) {
  return (host: Tree, context: SchematicContext) => {
    addPackageJsonDependency(host, {
      type: NodeDependencyType.Default,
      name: 'ngx-matomo-client',
      version,
    });

    if (options.router) {
      checkRequiredRouterDependency(host, context);
    }

    context.addTask(new NodePackageInstallTask());
    return host;
  };
}

function buildTrackerConfig(
  options: Options,
  context: SchematicContext,
  modulePath: string
): string {
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
          'You will need to manually update your configuration in "' +
          modulePath +
          "'. "
      );
    }
  }

  return config;
}

function applyChanges(host: Tree, modulePath: string, changes: Change[]): void {
  const recorder = host.beginUpdate(modulePath);

  applyToUpdateRecorder(recorder, changes);

  host.commitUpdate(recorder);
}

function isLegacyImportPath(importPath: string): boolean {
  return importPath.startsWith('@ngx-matomo/');
}

function isRelevantImportPath(importPath: string): boolean {
  return importPath === 'ngx-matomo-client' || isLegacyImportPath(importPath);
}

function findRelevantImports(
  source: ts.SourceFile,
  predicate: (importPath: string) => boolean
): ts.ImportDeclaration[] {
  const allImports = findNodes(source, ts.SyntaxKind.ImportDeclaration) as ts.ImportDeclaration[];

  return allImports.filter(
    node => ts.isStringLiteral(node.moduleSpecifier) && predicate(node.moduleSpecifier.text)
  );
}

function hasLegacyModuleDeclaration(source: ts.SourceFile): boolean {
  const result = getDecoratorMetadata(source, 'NgModule', '@angular/core');
  const node = result[0];
  if (!node || !ts.isObjectLiteralExpression(node)) {
    return false;
  }

  const matchingProperties = getMetadataField(node, 'imports');
  if (!matchingProperties) {
    return false;
  }

  const assignment = matchingProperties[0] as ts.PropertyAssignment;

  if (assignment.initializer.kind !== ts.SyntaxKind.ArrayLiteralExpression) {
    return false;
  }

  const arrLiteral = assignment.initializer as ts.ArrayLiteralExpression;

  return arrLiteral.elements
    .filter(el => el.kind === ts.SyntaxKind.CallExpression)
    .some(el => (el as ts.Identifier).getText().startsWith('NgxMatomo'));
}

function addImportsToNgModule(options: Options, context: SchematicContext): Rule {
  return (host: Tree) => {
    const modulePath = options.module;

    if (options.skipImport || !modulePath) {
      return host;
    }

    const changes: Change[] = [];
    const source = readIntoSourceFile(host, modulePath);
    const trackerConfig = buildTrackerConfig(options, context, modulePath);

    // If some Matomo imports are already present, use the legacy setup using
    // NgModule.
    //
    // If no import is present, use the new providers-style setup.
    //
    // Maybe in the future a schematics can be provided to migrate old NgModule
    // setup to new providers-style setup.

    const imports = findRelevantImports(source, isRelevantImportPath);
    let mainModuleIdentifier = 'NgxMatomoModule';
    let routerModuleIdentifier = 'NgxMatomoRouterModule';
    let asteriskAlias: string | undefined;
    let mainModuleImported = false;
    let routerModuleImported = false;

    // Loop in reverse order and migrate if needed
    for (let i = imports.length - 1; i >= 0; i--) {
      const statement = imports[i];

      if (!statement.importClause?.namedBindings) {
        // Such statement should not exist because this lib has no side effect
        return;
      }

      const bindings = statement.importClause.namedBindings;

      if (ts.isNamespaceImport(bindings)) {
        asteriskAlias = bindings.name.text;

        if (!mainModuleImported) {
          mainModuleIdentifier = `${asteriskAlias}.NgxMatomoModule`;
        }

        if (!routerModuleImported) {
          routerModuleIdentifier = `${asteriskAlias}.NgxMatomoRouterModule`;
        }

        mainModuleImported = true;
        routerModuleImported = true;
      } else {
        for (const specifier of bindings.elements) {
          switch (specifier.name.text) {
            case 'NgxMatomoModule':
            case 'NgxMatomoTrackerModule':
              mainModuleImported = true;
              mainModuleIdentifier = specifier.name.text;
              break;
            case 'NgxMatomoRouterModule':
              routerModuleImported = true;
              routerModuleIdentifier = specifier.name.text;
              break;
          }
        }
      }
    }

    if (hasLegacyModuleDeclaration(source)) {
      context.logger.warn(
        'Your configuration is using legacy configuration with NgModule imports. ' +
          'While this is still supported, it is recommended to migrate your code to use the new provideMatomo() setup (see README > Installation)'
      );

      if (!mainModuleImported) {
        changes.push(insertImport(source, modulePath, mainModuleIdentifier, 'ngx-matomo-client'));
      }

      changes.push(
        ...addSymbolToNgModuleMetadata(
          source,
          modulePath,
          'imports',
          `${mainModuleIdentifier}.forRoot(${trackerConfig})`
        )
      );

      if (options.router) {
        if (!routerModuleImported) {
          changes.push(
            insertImport(source, modulePath, routerModuleIdentifier, 'ngx-matomo-client')
          );
        }

        changes.push(
          ...addSymbolToNgModuleMetadata(source, modulePath, 'imports', routerModuleIdentifier)
        );
      }
    } else {
      const provideMatomoArgs = [trackerConfig];

      changes.push(insertImport(source, modulePath, 'provideMatomo', 'ngx-matomo-client'));

      if (options.router) {
        changes.push(insertImport(source, modulePath, 'withRouter', 'ngx-matomo-client'));

        provideMatomoArgs.push(`withRouter()`);
      }

      changes.push(
        ...addSymbolToNgModuleMetadata(
          source,
          modulePath,
          'providers',
          `provideMatomo(${provideMatomoArgs.join(', ')})`
        )
      );
    }

    applyChanges(host, modulePath, changes);

    return host;
  };
}

function migrateAllLegacyImports(options: Options, context: SchematicContext): Rule {
  return (host: Tree) => {
    if (!options.skipLegacyPackageMigration) {
      context.logger.info('Migrating imports from old @ngx-matomo/* packages...');

      host.visit(path => {
        // if (options.module && path.endsWith(options.module) && !options.skipImport) {
        //   context.logger.info('Skip migration of "' + path + '"');
        //   // If this is the main module path, handle migration directly in
        //   // `addImportsToNgModule`
        //   return;
        // }

        if (!options.path || path.startsWith(options.path)) {
          const file = readIntoSourceFile(host, path);
          const changes: Change[] = [];

          file.forEachChild(node => {
            if (node.kind === SyntaxKind.ImportDeclaration) {
              const statement = node as ts.ImportDeclaration;
              const moduleSpecifier = statement.moduleSpecifier as ts.StringLiteral;
              const fullText = moduleSpecifier.getFullText();
              const text = moduleSpecifier.text;
              const pos = moduleSpecifier.pos;

              if (text?.startsWith('@ngx-matomo/')) {
                // Be sure to keep any original spacings (contained in getFullText() only)
                const newFullText = fullText.replace(text, 'ngx-matomo-client');

                changes.push(new ReplaceChange(path, pos, fullText, newFullText));
              }
            }
          });

          applyChanges(host, path, changes);
        }
      });
    }

    return host;
  };
}

export function ngAdd(options: Options): Rule {
  return async (host, context) => {
    if (options.path === undefined) {
      options.path = await createDefaultPath(host, options.project!);
    }

    options.module = findModuleFromOptions(host, {
      skipImport: options.skipImport,
      path: options.path,
      module: options.module,
      name: '',
    });

    return chain([
      addPackageJsonDependencies(options),
      addImportsToNgModule(options, context),
      migrateAllLegacyImports(options, context),
    ]);
  };
}
