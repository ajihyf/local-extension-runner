/**
 * @param {import('vscode').ExtensionContext} ctx
 * @param {import('vscode')} vscode
 */
function createStatusBarItem(ctx, vscode) {
  const item = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    0
  );
  item.name = 'local-extension';
  item.command = 'local-extension.pickAndEcho';
  item.text = 'Pick And Echo';
  item.show();
  ctx.subscriptions.push(item);
}

/**
 * @param {import('vscode').ExtensionContext} ctx
 * @param {import('vscode')} vscode
 */
async function activate(ctx, vscode) {
  ctx.subscriptions.push(
    vscode.commands.registerCommand('local-extension.pickAndEcho', async () => {
      const selection = await vscode.window.showQuickPick(['1', '2', '3']);
      if (!selection) {
        throw new Error('selection is empty');
      }
      vscode.window.showInformationMessage(
        `Hello World from local-extension, you picked ${selection}`
      );
      return selection;
    })
  );

  createStatusBarItem(ctx, vscode);
}

module.exports = {
  activate,
};
