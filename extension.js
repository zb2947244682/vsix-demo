// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * 插件激活函数
 * @param {vscode.ExtensionContext} context 插件上下文
 */
function activate(context) {

	// 输出诊断信息
	console.log('代码助手演示插件已激活!');

	// 注册Hello World命令
	const helloWorldDisposable = vscode.commands.registerCommand('demo.helloWorld', function () {
		vscode.window.showInformationMessage('Hello World from 代码助手演示!');
	});

	// 注册添加函数注释命令
	const addCommentDisposable = vscode.commands.registerCommand('demo.addComment', function () {
		addFunctionComment();
	});

	// 注册格式化代码命令
	const formatCodeDisposable = vscode.commands.registerCommand('demo.formatCode', function () {
		formatCurrentLine();
	});

	// 注册显示文件统计信息命令
	const showStatsDisposable = vscode.commands.registerCommand('demo.showStats', function () {
		showFileStats();
	});

	// 将所有命令添加到订阅列表
	context.subscriptions.push(
		helloWorldDisposable,
		addCommentDisposable,
		formatCodeDisposable,
		showStatsDisposable
	);
}

/**
 * 添加函数注释功能
 */
function addFunctionComment() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage('没有打开的编辑器');
		return;
	}

	const selection = editor.selection;
	const currentLine = editor.document.lineAt(selection.active.line);
	const lineText = currentLine.text.trim();

	// 检查是否是函数定义
	if (lineText.includes('function') || lineText.includes('=>') || lineText.includes('def ')) {
		const comment = `/**\n * 函数功能描述\n * @param {type} param 参数描述\n * @returns {type} 返回值描述\n */\n`;
		editor.edit(editBuilder => {
			const position = new vscode.Position(currentLine.lineNumber, 0);
			editBuilder.insert(position, comment);
		});
		vscode.window.showInformationMessage('已添加函数注释模板');
	} else {
		vscode.window.showWarningMessage('当前行不是函数定义');
	}
}

/**
 * 格式化当前行功能
 */
function formatCurrentLine() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage('没有打开的编辑器');
		return;
	}

	const selection = editor.selection;
	const currentLine = editor.document.lineAt(selection.active.line);
	const lineText = currentLine.text;

	// 简单的格式化：移除多余空格，添加适当缩进
	const trimmedText = lineText.trim();
	const indentLevel = lineText.length - lineText.trimStart().length;
	const formattedText = ' '.repeat(indentLevel) + trimmedText;

	editor.edit(editBuilder => {
		const range = new vscode.Range(
			currentLine.range.start,
			currentLine.range.end
		);
		editBuilder.replace(range, formattedText);
	});

	vscode.window.showInformationMessage('当前行已格式化');
}

/**
 * 显示文件统计信息功能
 */
function showFileStats() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage('没有打开的编辑器');
		return;
	}

	const document = editor.document;
	const text = document.getText();
	const lineCount = document.lineCount;
	const charCount = text.length;
	const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
	const fileName = document.fileName.split('\\').pop() || document.fileName.split('/').pop();

	const stats = `文件统计信息:\n` +
				 `文件名: ${fileName}\n` +
				 `行数: ${lineCount}\n` +
				 `字符数: ${charCount}\n` +
				 `单词数: ${wordCount}`;

	vscode.window.showInformationMessage(stats, { modal: true });
}

/**
 * 插件停用时调用的方法
 */
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
