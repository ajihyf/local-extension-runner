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
