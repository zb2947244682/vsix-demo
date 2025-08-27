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
 * 格式化整个JS文件功能
 */
function formatCurrentLine() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage('没有打开的编辑器');
		return;
	}

	const document = editor.document;
	const languageId = document.languageId;

	// 检查是否为JavaScript文件
	if (languageId !== 'javascript' && languageId !== 'typescript') {
		vscode.window.showWarningMessage('此功能仅支持JavaScript和TypeScript文件');
		return;
	}

	// 获取整个文件内容
	const fullText = document.getText();
	if (fullText.trim() === '') {
		vscode.window.showInformationMessage('文件为空，无需格式化');
		return;
	}

	// 显示进度提示
	vscode.window.withProgress({
		location: vscode.ProgressLocation.Notification,
		title: "正在格式化JS文件...",
		cancellable: false
	}, async (progress) => {
		progress.report({ increment: 0 });

		try {
			// 按行分割文件内容
			const lines = fullText.split('\n');
			const formattedLines = [];
			let changeCount = 0;

			progress.report({ increment: 20, message: "分析文件结构..." });

			// 逐行格式化
			for (let i = 0; i < lines.length; i++) {
				const line = lines[i];
				const originalIndent = line.match(/^\s*/)[0];
				const trimmedText = line.trim();

				// 跳过空行和注释行的格式化
				if (trimmedText === '' || trimmedText.startsWith('//') || trimmedText.startsWith('/*') || trimmedText.startsWith('*')) {
					formattedLines.push(line);
					continue;
				}

				// 格式化当前行
				const formattedText = formatByLanguage(trimmedText, languageId);
				const finalLine = originalIndent + formattedText;

				// 检查是否有变化
				if (finalLine !== line) {
					changeCount++;
				}

				formattedLines.push(finalLine);

				// 更新进度
				if (i % Math.max(1, Math.floor(lines.length / 50)) === 0) {
					const progressPercent = Math.floor((i / lines.length) * 60) + 20;
					progress.report({ increment: 0, message: `格式化进度: ${i + 1}/${lines.length}` });
				}
			}

			progress.report({ increment: 80, message: "应用格式化结果..." });

			// 如果有变化，则替换整个文件内容
			if (changeCount > 0) {
				const formattedContent = formattedLines.join('\n');
				const fullRange = new vscode.Range(
					document.positionAt(0),
					document.positionAt(fullText.length)
				);

				await editor.edit(editBuilder => {
					editBuilder.replace(fullRange, formattedContent);
				});

				progress.report({ increment: 100 });
				vscode.window.showInformationMessage(`文件格式化完成！共格式化了 ${changeCount} 行代码`);
			} else {
				progress.report({ increment: 100 });
				vscode.window.showInformationMessage('文件已是最佳格式，无需修改');
			}

		} catch (error) {
			vscode.window.showErrorMessage(`格式化失败: ${error.message}`);
		}
	});
}

/**
 * 根据编程语言进行智能格式化
 * @param {string} text 要格式化的文本
 * @param {string} languageId 编程语言ID
 * @returns {string} 格式化后的文本
 */
function formatByLanguage(text, languageId) {
	// 通用格式化规则
	let formatted = text;

	// 1. 移除多余的空格
	formatted = formatted.replace(/\s+/g, ' ');

	// 2. 操作符周围添加空格
	formatted = formatted.replace(/([^\s=!<>])([=!<>]=?|[+\-*/%&|^])([^\s=!<>])/g, '$1 $2 $3');
	formatted = formatted.replace(/([^\s])([+\-*/%])([^\s=])/g, '$1 $2 $3');

	// 3. 逗号后添加空格
	formatted = formatted.replace(/,([^\s])/g, ', $1');

	// 4. 分号后添加空格（如果不是行尾）
	formatted = formatted.replace(/;([^\s$])/g, '; $1');

	// 5. 括号内侧去除多余空格
	formatted = formatted.replace(/\(\s+/g, '(');
	formatted = formatted.replace(/\s+\)/g, ')');
	formatted = formatted.replace(/\[\s+/g, '[');
	formatted = formatted.replace(/\s+\]/g, ']');
	formatted = formatted.replace(/\{\s+/g, '{ ');
	formatted = formatted.replace(/\s+\}/g, ' }');

	// 根据具体语言进行特殊处理
	switch (languageId) {
		case 'javascript':
		case 'typescript':
			// 箭头函数格式化
			formatted = formatted.replace(/\s*=>\s*/g, ' => ');
			// 对象属性冒号格式化
			formatted = formatted.replace(/:\s*/g, ': ');
			break;

		case 'python':
			// Python 冒号格式化
			formatted = formatted.replace(/:\s*$/g, ':');
			// Python 比较操作符
			formatted = formatted.replace(/\s*(in|not in|is|is not)\s*/g, ' $1 ');
			break;

		case 'java':
		case 'csharp':
			// 泛型括号处理
			formatted = formatted.replace(/<\s+/g, '<');
			formatted = formatted.replace(/\s+>/g, '>');
			break;

		case 'css':
		case 'scss':
		case 'less':
			// CSS 属性冒号格式化
			formatted = formatted.replace(/:\s*/g, ': ');
			// CSS 分号处理
			formatted = formatted.replace(/;\s*$/g, ';');
			break;
	}

	// 6. 清理可能产生的多余空格
	formatted = formatted.replace(/\s+/g, ' ').trim();

	return formatted;
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
