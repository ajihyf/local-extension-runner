# local-extension-runner

## Inspiration

Our team is looking to develop a dedicated VSCode extension for our project, but we do not wish to publish it to the VSCode Marketplace every time.
Therefore, we are hoping to have a local plugin runner that can execute the extension locally.

## How to Use

Simply place your developed `extension.js` into the `.vscode/local-extension` directory.
The Local Extension Runner will automatically detect and execute your extension upon starting VSCode.

## Known Issues

Presently, the runner is only able to execute the JavaScript files of local extensions.
As a result, any features that rely on `contributions` within the `package.json` will not be operable.

## Release Notes

### 0.1.0

Initial release.
