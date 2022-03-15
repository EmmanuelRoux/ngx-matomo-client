import {
  chain,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addImportToModule } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';
import {
  addPackageJsonDependency,
  getPackageJsonDependency,
  NodeDependencyType,
} from '@schematics/angular/utility/dependencies';
import { findModuleFromOptions } from '@schematics/angular/utility/find-module';
import { createDefaultPath } from '@schematics/angular/utility/workspace';
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
      name: '@ngx-matomo/tracker',
      version,
    });

    if (options.router) {
      checkRequiredRouterDependency(host, context);

      addPackageJsonDependency(host, {
        type: NodeDependencyType.Default,
        name: '@ngx-matomo/router',
        version,
      });
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

function addImportsToNgModule(options: Options, context: SchematicContext): Rule {
  return (host: Tree) => {
    const modulePath = options.module;

    if (options.skipImport || !modulePath) {
      return host;
    }

    const source = readIntoSourceFile(host, modulePath);
    const trackerConfig = buildTrackerConfig(options, context, modulePath);
    const trackerDeclaration = `NgxMatomoTrackerModule.forRoot(${trackerConfig})`;
    const routerDeclaration = 'NgxMatomoRouterModule';

    let changes = addImportToModule(source, modulePath, trackerDeclaration, '@ngx-matomo/tracker');

    if (options.router) {
      changes = changes.concat(
        addImportToModule(source, modulePath, routerDeclaration, '@ngx-matomo/router')
      );
    }

    const recorder = host.beginUpdate(modulePath);

    for (const change of changes) {
      if (change instanceof InsertChange) {
        recorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(recorder);

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

    return chain([addPackageJsonDependencies(options), addImportsToNgModule(options, context)]);
  };
}
