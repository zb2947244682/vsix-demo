@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo    VSCode 插件一键构建脚本
echo ========================================
echo.
echo 请选择版本类型：
echo 1. patch - 修复版本
echo 2. minor - 功能版本  
echo 3. major - 主要版本
echo.
set /p choice=请输入选择 (1/2/3): 

if "%choice%"=="1" set version_type=patch
if "%choice%"=="2" set version_type=minor
if "%choice%"=="3" set version_type=major

if not defined version_type (
    echo 无效选择，退出
    pause
    exit /b 1
)

echo.
echo 选择：%version_type% 版本更新
echo ========================================

echo.
echo [1/4] 提交所有更改...
git add .
git commit -m "feat: update for version bump"
if errorlevel 1 (
    echo 注意：可能没有新的更改需要提交
)
echo ✓ 工作目录已提交

echo.
echo [2/4] 更新版本号...
call npm version %version_type%
if errorlevel 1 (
    echo 错误：版本更新失败
    pause
    exit /b 1
)
echo ✓ 版本号更新完成

echo.
echo [3/4] 获取新版本号...
call npm pkg get version > version.tmp
set /p new_version=<version.tmp
set new_version=%new_version:"=%
del version.tmp
echo ✓ 新版本：%new_version%

echo.
echo [4/4] 打包插件...
call vsce package
if errorlevel 1 (
    echo 错误：打包失败
    echo 请确保已安装：npm install -g @vscode/vsce
    pause
    exit /b 1
)
echo ✓ 插件打包完成

echo.
echo ========================================
echo 🎉 构建完成！
echo ========================================
echo.
echo 执行结果：
echo - 版本号：%new_version%
echo - 类型：%version_type%
echo - 生成文件：
for %%f in (*.vsix) do echo   %%f
echo.
echo 安装命令：code --install-extension [文件名].vsix
echo.
pause