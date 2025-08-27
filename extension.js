const vscode = require('vscode');
const { exec } = require('child_process');

/**
 * 插件激活函数
 * @param {vscode.ExtensionContext} context 插件上下文
 */
function activate(context) {
    console.log('代码助手演示插件已激活!');

    // 注册右键菜单命令
    const openNotepadDisposable = vscode.commands.registerCommand('demo.openNotepad', (uri) => {
        // 获取点击的文件夹路径
        const folderPath = uri.fsPath;
        
        // 在 Windows 上启动 notepad.exe
        exec('notepad', { cwd: folderPath }, (error, stdout, stderr) => {
            if (error) {
                vscode.window.showErrorMessage(`打开 Notepad 失败: ${error.message}`);
                return;
            }
            vscode.window.showInformationMessage('Notepad 已启动');
        });
    });

    // 注册右键菜单
    context.subscriptions.push(
        vscode.commands.registerCommand('demo.openNotepad', openNotepadDisposable),
        vscode.window.createTreeView('explorer', {
            showCollapseAll: true
        })
    );

    // 注册命令到右键菜单
    context.subscriptions.push(
        vscode.commands.registerCommand('demo.openNotepad', (uri) => {
            vscode.commands.executeCommand('demo.openNotepad', uri);
        })
    );

    // 添加右键菜单项
    context.subscriptions.push(
        vscode.commands.registerCommand('demo.openNotepad', (uri) => {
            if (uri && uri.fsPath) {
                vscode.commands.executeCommand('demo.openNotepad', uri);
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