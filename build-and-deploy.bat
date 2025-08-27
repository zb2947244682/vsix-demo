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
echo "[1/4] 正在更新版本号..."
npm version %version_type%
if errorlevel 1 (
    echo "错误：版本更新失败！"
    pause
    exit /b 1
)
echo "✓ 版本号更新完成"

echo.
echo "[2/4] 正在打包插件..."
vsce package
if errorlevel 1 (
    echo "错误：插件打包失败！"
    pause
    exit /b 1
)
echo "✓ 插件打包完成"

echo.
echo "[3/4] 正在提交代码到本地仓库..."
git add .
git commit -m "chore: bump version to %version_type%"
if errorlevel 1 (
    echo "警告：代码提交可能失败（可能没有变更）"
) else (
    echo "✓ 代码提交完成"
)

echo.
echo "[4/4] 正在推送到远程仓库..."
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
)
echo "✓ 推送到远程仓库完成"

echo.
echo "========================================"
echo "🎉 构建部署流程全部完成！"
echo "========================================"
echo.
echo "执行的操作："
echo "- ✓ 插件打包"
echo "- ✓ 版本号更新 (%version_type%)"
echo "- ✓ 代码提交"
echo "- ✓ 推送到远程仓库"
echo.
echo "您可以在 VS Code 中安装新打包的 .vsix 文件进行测试"
echo.
pause