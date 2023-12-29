# local-extension-runner

## Inspiration

Our team is looking to develop a dedicated VSCode extension for our project, but we do not wish to publish it to the VSCode Marketplace every time.
Therefore, we are hoping to have a local plugin runner that can execute the extension locally.

## How to Use

1. Develop your own extension which exports a function named `activate` that
   takes in a `vscode.ExtensionContext` and a `vscode` object and an optional `deactivate` function.
   See [VSCode Extension Docs](https://code.visualstudio.com/api) for details.
   The extension script must use CommonJS module and do not `require('vscode')` directly.

```js
/**
 * @param {import('vscode').ExtensionContext} ctx
 * @param {import('vscode')} vscode
 */
async function activate(ctx, vscode) {
  ctx.subscriptions.push(
    vscode.commands.registerCommand('local-extension.pickAndEcho', async () => {
      const selection = await vscode.window.showQuickPick(['1', '2', '3']);
      vscode.window.showInformationMessage(
        `Hello World from local-extension, you picked ${selection}`
      );
    })
  );
}

module.exports = {
  activate,
};
```

2. Simply place your developed `index.js` into the `.vscode/local-extension` directory.
   The Local Extension Runner will automatically detect and execute your extension upon starting VSCode.

## Known Issues

Presently, the runner is only able to execute the JavaScript files of local extensions.
As a result, any features that rely on `contributions` within the `package.json` will not be operable.

## Release Notes

### 0.0.1

Initial release.

### 0.0.2

Pass `vscode` to `activate` function.

### 0.0.3

Fix Disposable leakage, add error details when activating extension error happens.

### 0.0.4

Optimize local extension `ExtensionContext` creation.

### 0.0.4

Support local extensions to store their settings in "local-extension-runner.extensions.settings".
