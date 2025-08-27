@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo "========================================"
echo "   VSCode 插件自动化构建部署脚本"
echo "========================================"
echo.
echo "请选择要更新的版本类型："
echo "1. 补丁版本 (patch) - 修复bug，向后兼容"
echo "2. 次版本 (minor) - 新增功能，向后兼容"  
echo "3. 主版本 (major) - 重大更改，可能不向后兼容"
echo.
set /p choice="请输入选择 (1/2/3): "

if "%choice%"=="1" (
    set version_type=patch
    echo "选择：补丁版本更新"
) else if "%choice%"=="2" (
    set version_type=minor
    echo "选择：次版本更新"
) else if "%choice%"=="3" (
    set version_type=major
    echo "选择：主版本更新"
) else (
    echo "无效选择，退出脚本"
    pause
    exit /b 1
)

echo.
echo "========================================"
echo "开始执行构建部署流程..."
echo "========================================"

echo.
echo "[1/5] 检查工作目录状态..."
git status --porcelain > temp_status.txt
set /p git_status=<temp_status.txt
del temp_status.txt
if not "!git_status!"=="" (
    echo "发现未提交的更改，正在提交..."
    git add .
    if errorlevel 1 (
        echo "错误：添加文件到暂存区失败！"
        pause
        exit /b 1
    )
    
    set /p commit_msg="请输入提交信息（或按回车使用默认信息）: "
    if "!commit_msg!"=="" (
        set commit_msg=feat: update before version bump
    )
    
    git commit -m "!commit_msg!"
    if errorlevel 1 (
        echo "错误：提交代码失败！"
        pause
        exit /b 1
    )
    echo "✓ 代码提交完成"
) else (
    echo "✓ 工作目录干净，无需提交"
)

echo.
echo "[2/5] 正在更新版本号..."
npm version %version_type%
if errorlevel 1 (
    echo "错误：版本更新失败！"
    pause
    exit /b 1
)
echo "✓ 版本号更新完成（npm version 已自动创建提交）"

echo.
echo "[3/5] 获取当前版本号..."
for /f "tokens=2 delims=:" %%i in ('npm pkg get version') do (
    set current_version=%%i
)
set current_version=!current_version:"=!
set current_version=!current_version: =!
echo "✓ 当前版本: !current_version!"

echo.
echo "[4/5] 正在打包插件..."
vsce package
if errorlevel 1 (
    echo "错误：插件打包失败！"
    pause
    exit /b 1
)
echo "✓ 插件打包完成"

echo.
echo "[5/5] 正在推送到远程仓库..."
git push origin main
if errorlevel 1 (
    echo "尝试推送到 master 分支..."
    git push origin master
    if errorlevel 1 (
        echo "错误：推送到远程仓库失败！"
        echo "请检查网络连接和仓库权限"
        pause
        exit /b 1
    )
    echo "✓ 推送到 master 分支完成"
) else (
    echo "✓ 推送到 main 分支完成"
)

echo.
echo "========================================"
echo "🎉 构建部署流程全部完成！"
echo "========================================"
echo.
echo "执行的操作："
echo "- ✓ 检查并提交未保存的更改"
echo "- ✓ 版本号更新到 !current_version! (%version_type%)"
echo "- ✓ 自动创建版本提交（由 npm version）"
echo "- ✓ 插件打包"
echo "- ✓ 推送到远程仓库"
echo.
echo "生成的文件："
for %%f in (*.vsix) do (
    echo "- %%f"
)
echo.
echo "您可以在 VS Code 中安装新打包的 .vsix 文件进行测试"
echo "或者使用命令: code --install-extension [文件名].vsix"
echo.
pause