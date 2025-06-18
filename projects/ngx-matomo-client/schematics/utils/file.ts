import { Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';

export function readIntoSourceFile(host: Tree, modulePath: string): ts.SourceFile {
  const sourceText = host.readText(modulePath);

  return ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
}

export function escapeLiteral(str: string): string {
  return str.replace(new RegExp('\\\\', 'g'), '\\\\').replace(new RegExp(`'`, 'g'), "\\'");
}
