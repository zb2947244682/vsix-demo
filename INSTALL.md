# 插件安装和使用说明

## 安装方法

### 方法一：通过VSCode安装
1. 打开VSCode
2. 按 `Ctrl+Shift+P` 打开命令面板
3. 输入 `Extensions: Install from VSIX...`
4. 选择生成的 `code-helper-demo-0.0.1.vsix` 文件
5. 重启VSCode

### 方法二：通过命令行安装
```bash
code --install-extension code-helper-demo-0.0.1.vsix
```

## 功能演示

### 1. Hello World
- 按 `Ctrl+Shift+P` 打开命令面板
- 输入 "Hello World" 并执行
- 会显示欢迎消息

### 2. 添加函数注释
- 打开 `test-demo.js` 文件
- 将光标放在函数定义行（如 `function calculateSum(a, b) {`）
- 右键选择 "添加函数注释" 或通过命令面板执行
- 会在函数上方自动添加JSDoc格式的注释模板

### 3. 格式化当前行
- 将光标放在格式不规范的代码行
- 右键选择 "格式化当前行" 或通过命令面板执行
- 当前行会被格式化

### 4. 显示文件统计信息
- 在任意文件中执行 "显示文件统计信息" 命令
- 会显示当前文件的行数、字符数、单词数等信息

## 测试文件

项目中包含了 `test-demo.js` 文件，可以用来测试各种功能：
- 包含未注释的函数，用于测试添加注释功能
- 包含格式不规范的代码行，用于测试格式化功能
- 可以用来测试文件统计功能

## 开发说明

如果需要修改插件功能：
1. 编辑 `extension.js` 文件
2. 修改 `package.json` 中的命令配置
3. 重新打包：`vsce package --allow-missing-repository`
4. 重新安装新的vsix文件