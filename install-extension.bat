@echo off
chcp 65001 >nul
echo "正在查找当前目录下的VSIX文件..."

REM 检查当前目录是否有vsix文件
dir /b *.vsix >nul 2>&1
if errorlevel 1 (
    echo "当前目录下没有找到VSIX文件！"
    pause
    exit /b 1
)

echo "找到以下VSIX文件："
dir /b *.vsix
echo.
echo "开始安装扩展..."

REM 遍历所有vsix文件并安装
for %%f in (*.vsix) do (
    echo "正在安装: %%f"
    code --install-extension "%%f" --force
    if errorlevel 1 (
        echo "安装 %%f 失败！"
    ) else (
        echo "成功安装: %%f"
    )
    echo.
)

echo "所有扩展安装完成！"
pause