import subprocess
import json
import os
import sys

def run_command(command, cwd=None, check_error=True, error_message="命令执行失败"):
    """
    函数：执行命令行命令
    描述：执行给定的命令行命令，并检查其执行结果。
    参数：
        command (list): 要执行的命令及其参数列表。
        cwd (str, optional): 命令执行的工作目录。默认为 None。
        check_error (bool, optional): 是否检查命令执行的错误。默认为 True。
        error_message (str, optional): 命令执行失败时的错误信息。默认为 "命令执行失败"。
    返回：
        subprocess.CompletedProcess: 命令执行结果对象。
    """
    try:
        result = subprocess.run(command, cwd=cwd, check=check_error, shell=True, capture_output=True, text=True, encoding='utf-8')
        print(result.stdout)
        if result.stderr:
            print(result.stderr)
        return result
    except subprocess.CalledProcessError as e:
        print(f"错误：{error_message}\n{e.stderr}")
        sys.exit(1)
    except FileNotFoundError:
        print(f"错误：找不到命令 '{command[0]}'，请确保已安装并配置好环境变量。")
        sys.exit(1)

def get_version_type():
    """
    函数：获取版本类型
    描述：提示用户选择版本类型（patch, minor, major）。
    返回：
        str: 用户选择的版本类型。
    """
    print("========================================")
    print("   VSCode 插件一键构建脚本")
    print("========================================")
    print("\n请选择版本类型")
    print("1. patch - 修复版本")
    print("2. minor - 功能版本")
    print("3. major - 主要版本")

    while True:
        choice = input("\n请输入选择 (1/2/3): ")
        if choice == '1':
            return 'patch'
        elif choice == '2':
            return 'minor'
        elif choice == '3':
            return 'major'
        else:
            print("无效选择，请重新输入。")

def get_install_choice():
    """
    函数：获取是否安装扩展的选择
    描述：询问用户是否要安装构建完成的扩展。
    返回：
        bool: 用户是否选择安装扩展。
    """
    print("\n是否要安装构建完成的扩展？")
    print("1. 是 - 自动安装扩展")
    print("2. 否 - 仅构建，不安装")
    
    while True:
        choice = input("\n请输入选择 (1/2): ")
        if choice == '1':
            return True
        elif choice == '2':
            return False
        else:
            print("无效选择，请重新输入。")

def commit_changes():
    """
    函数：提交所有更改
    描述：使用 Git 提交当前工作目录的所有更改。
    """
    print("\n[1/6] 提交所有更改...")
    result = run_command(["git", "add", "."], check_error=False)
    if result.returncode != 0 and "nothing to commit" in result.stderr.lower():
        print("注意：可能没有新的更改需要提交")
    else:
        run_command(["git", "commit", "-m", "feat: update for version bump"], error_message="Git 提交失败")
    print("✓ 工作目录已提交")

def update_version(version_type):
    """
    函数：更新版本号
    描述：使用 npm version 命令更新 package.json 中的版本号。
    参数：
        version_type (str): 版本类型（patch, minor, major）。
    返回：
        str: 更新后的版本号。
    """
    print("\n[2/6] 更新版本号...")
    run_command(["npm", "version", version_type], error_message="版本更新失败")
    print("✓ 版本号更新完成")

    print("\n[3/6] 获取新版本号...")
    result = run_command(["npm", "pkg", "get", "version"])
    new_version = result.stdout.strip().strip('"')
    print(f"✓ 新版本：{new_version}")
    return new_version

def clean_vsix_files():
    """
    函数：清理旧的 .vsix 文件
    描述：删除当前目录下所有旧的 .vsix 文件。
    """
    print("\n[4/6] 清理旧的 .vsix 文件...")
    # 在 Windows 上，del 命令不支持直接删除通配符，需要通过 shell=True
    # 并且为了避免乱码，直接使用 Python 的 os 模块来处理文件删除
    deleted_count = 0
    for f in os.listdir('.'):
        if f.endswith('.vsix'):
            try:
                os.remove(f)
                deleted_count += 1
            except OSError as e:
                print(f"警告：无法删除文件 {f}: {e}")
    
    if deleted_count > 0:
        print(f"✓ 已清理 {deleted_count} 个旧的 .vsix 文件。")
    else:
        print("✓ 未发现旧的 .vsix 文件，无需清理。")

def package_extension():
    """
    函数：打包插件
    描述：使用 vsce 工具将插件打包成 .vsix 文件。
    """
    print("\n[5/6] 打包插件...")
    run_command(["vsce", "package"], error_message="打包失败\n请确保已安装：npm install -g @vscode/vsce")
    print("✓ 插件打包完成")

def install_extension():
    """
    函数：安装扩展
    描述：查找当前目录下的 .vsix 文件并使用 VSCode 安装它们。
    """
    print("\n[6/6] 安装扩展...")
    
    # 查找当前目录下的 .vsix 文件
    vsix_files = [f for f in os.listdir('.') if f.endswith('.vsix')]
    
    if not vsix_files:
        print("错误：当前目录下没有找到 VSIX 文件！")
        return
    
    print(f"找到以下 VSIX 文件：")
    for file in vsix_files:
        print(f"  - {file}")
    
    print("\n开始安装扩展...")
    
    success_count = 0
    for vsix_file in vsix_files:
        print(f"\n正在安装: {vsix_file}")
        try:
            result = run_command(["code", "--install-extension", vsix_file, "--force"], 
                                check_error=False, 
                                error_message=f"安装 {vsix_file} 失败")
            if result.returncode == 0:
                print(f"✓ 成功安装: {vsix_file}")
                success_count += 1
            else:
                print(f"✗ 安装 {vsix_file} 失败！")
        except Exception as e:
            print(f"✗ 安装 {vsix_file} 时发生错误: {e}")
    
    if success_count == len(vsix_files):
        print(f"\n✓ 所有扩展安装完成！共安装 {success_count} 个扩展。")
    else:
        print(f"\n⚠ 扩展安装完成，成功安装 {success_count}/{len(vsix_files)} 个扩展。")

def main():
    """
    函数：主函数
    描述：协调整个构建和部署流程。
    """
    version_type = get_version_type()
    install_choice = get_install_choice()
    
    print(f"\n选择：{version_type} 版本更新")
    print(f"安装扩展：{'是' if install_choice else '否'}")
    print("========================================")

    commit_changes()
    new_version = update_version(version_type)
    clean_vsix_files()
    package_extension()
    
    if install_choice:
        install_extension()

    print("\n========================================")
    print("🎉 构建完成！")
    if install_choice:
        print("📦 扩展已安装到 VSCode")
    print("========================================")

if __name__ == "__main__":
    main()