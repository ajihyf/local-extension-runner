// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

interface ExtensionModule<T> {
  activate?(context: vscode.ExtensionContext): Thenable<T>;
  deactivate?(): Thenable<void>;
}

interface LocalExtension<T> {
  readonly requireId: string;
  readonly uri: vscode.Uri;
  readonly module: ExtensionModule<T>;
  readonly exports?: T;
  readonly activated: boolean;
}

let localExtensions: LocalExtension<unknown>[] = [];
let localExtensionDisposables: vscode.Disposable[] = [];

async function fileExists(uri: vscode.Uri): Promise<boolean> {
  try {
    await vscode.workspace.fs.stat(uri);
    return true;
  } catch {
    return false;
  }
}

async function activateLocalExtensions(context: vscode.ExtensionContext) {
  if (vscode.workspace.workspaceFolders) {
    console.log('Start activating local extensions');

    await Promise.allSettled(
      vscode.workspace.workspaceFolders.map(async (folder) => {
        let requireId: string | null = null;
        let module: ExtensionModule<unknown> | null = null;
        let subscriptions: vscode.Disposable[] = [];
        let exports: unknown = null;
        let activated = false;
        const localExtensionUri = vscode.Uri.joinPath(
          folder.uri,
          '.vscode',
          'local-extension',
          'extension.js'
        );
        try {
          if (!(await fileExists(localExtensionUri))) {
            return;
          }
          requireId = require.resolve(localExtensionUri.fsPath);
          module = require(requireId) as ExtensionModule<unknown>;
          exports = await module.activate?.(
            Object.freeze({
              ...context,
              subscriptions,
            })
          );
          activated = true;
          console.log(`Loaded local extension in ${folder.uri}`);
        } catch (err) {
          console.error(`Failed to load local extension ${folder.uri}`, err);
          vscode.window.showErrorMessage(
            `Failed to load local extension ${folder.uri}`
          );
        } finally {
          if (requireId && module) {
            localExtensions.push({
              requireId,
              uri: localExtensionUri,
              module,
              exports,
              activated,
            });
          }
        }
      })
    );

    console.log('End activating local extensions');
  }
}

async function deactivateLocalExtensions() {
  console.log('Start deactivating local extensions');
  try {
    await Promise.allSettled(
      localExtensions.map(async (extension) => {
        try {
          if (extension.activated) {
            await extension.module.deactivate?.();
          }
        } catch (err) {
          console.error(`Failed to deactivate extension ${extension.uri}`, err);
        }
      })
    );
  } finally {
    localExtensions.forEach((extension) => {
      delete require.cache[extension.requireId];
    });
    localExtensions = [];
  }

  disposeAllLocalExtensions();

  console.log('End deactivating local extensions');
}

function disposeAllLocalExtensions() {
  try {
    localExtensionDisposables.forEach((disposable) => {
      try {
        disposable.dispose();
      } catch (err) {
        console.error(`Failed to dispose extension ${disposable}`, err);
      }
    });
  } finally {
    localExtensionDisposables = [];
  }
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'local-extension-runner.reload',
      async () => {
        await deactivateLocalExtensions();
        await activateLocalExtensions(context);
      }
    )
  );

  context.subscriptions.push(
    new vscode.Disposable(() => {
      disposeAllLocalExtensions();
    })
  );

  await activateLocalExtensions(context);

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "local-extension-runner" is now active!'
  );
}

// This method is called when your extension is deactivated
export function deactivate() {
  return deactivateLocalExtensions();
}
