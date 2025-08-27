const vscode = require('vscode');
const { exec } = require('child_process');

/**
 * 插件激活函数
 * @param {vscode.ExtensionContext} context 插件上下文
 */
function activate(context) {
    console.log('代码助手演示插件已激活!');

    // 注册右键菜单命令 - 打开 Notepad
    const openNotepadDisposable = vscode.commands.registerCommand('demo.openNotepad', (uri) => {
        const folderPath = uri.fsPath;
        exec('notepad', { cwd: folderPath }, (error, stdout, stderr) => {
            if (error) {
                vscode.window.showErrorMessage(`打开 Notepad 失败: ${error.message}`);
                return;
            }
            vscode.window.showInformationMessage('Notepad 已启动');
        });
    });

    // 注册右键菜单命令 - 打开 Apifox
    const openCursorDisposable = vscode.commands.registerCommand('demo.openCursor', (uri) => {
        const folderPath = uri.fsPath;
        const cursorPath = 'C:\\Users\\Jimmy\\AppData\\Local\\Programs\\cursor\\Cursor.exe';
        exec(`"${cursorPath}"`, { cwd: folderPath }, (error, stdout, stderr) => {
            if (error) {
                vscode.window.showErrorMessage(`打开 Apifox 失败: ${error.message}`);
                return;
            }
            vscode.window.showInformationMessage('Apifox 已启动');
        });
    });

    // 注册命令到右键菜单
    context.subscriptions.push(
        openNotepadDisposable,
        openCursorDisposable,
        vscode.commands.registerCommand('demo.openNotepad', (uri) => {
            if (uri && uri.fsPath) {
                vscode.commands.executeCommand('demo.openNotepad', uri);
            }
        }),
        vscode.commands.registerCommand('demo.openCursor', (uri) => {
            if (uri && uri.fsPath) {
                vscode.commands.executeCommand('demo.openCursor', uri);
            }
        })
    );
}

/**
 * 插件停用时调用的方法
 */
function deactivate() {}

module.exports = {
    activate,
    deactivate
}