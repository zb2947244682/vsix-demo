@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: 函数启动 Python 构建脚本
:: 描述 此批处理文件用于启动 Python 脚本 build_and_deploy.py
:: 以执行 VSCode 插件的构建和部署流程
:: 注意 请确保已安装 Python，并且 Python 及其脚本路径已添加到系统环境变量

set PYTHONIOENCODING=utf-8
python .\build_and_deploy.py

if errorlevel 1 (
    echo "错误：Python 脚本执行失败。"
    echo "请确保已安装 Python 并且其已添加到 PATH 环境变量。"
    echo.""\npause
    exit /b 1
)

pause