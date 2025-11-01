#!/usr/bin/env python3
"""
Productivity Tracker - Simple Project Manager
==============================================
Interactive shell để quản lý frontend và backend
"""

import subprocess
import os
import signal
import json
import sys

frontend_process = None
backend_process = None
running = True


def get_npm_script(path):
    """Đọc package.json và tìm script phù hợp"""
    package_path = os.path.join(path, "package.json")
    if not os.path.exists(package_path):
        return None
    try:
        with open(package_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            scripts = data.get("scripts", {})
            if "dev" in scripts:
                return "npm run dev"
            elif "start" in scripts:
                return "npm start"
    except Exception as e:
        print(f"⚠️  Lỗi đọc package.json: {e}")
    return None


def start_projects():
    """Khởi động cả frontend và backend"""
    global frontend_process, backend_process

    if frontend_process or backend_process:
        print("⚠️  Projects đang chạy rồi!\n")
        return

    print("\n🚀 Đang khởi động projects...\n")

    # Backend
    backend_path = "backend"
    if not os.path.exists(backend_path):
        print(f"❌ Không tìm thấy: {backend_path}\n")
        return

    backend_cmd = get_npm_script(backend_path) or "node server.js"
    print(f"▶  Backend: {backend_cmd}")

    try:
        backend_process = subprocess.Popen(
            backend_cmd,
            cwd=backend_path,
            shell=True,
            creationflags=subprocess.CREATE_NEW_PROCESS_GROUP if os.name == 'nt' else 0
        )
    except Exception as e:
        print(f"❌ Lỗi backend: {e}\n")
        return

    # Frontend
    frontend_path = "frontend"
    if not os.path.exists(frontend_path):
        print(f"❌ Không tìm thấy: {frontend_path}")
        stop_projects()
        return

    frontend_cmd = get_npm_script(frontend_path) or "npx vite"
    print(f"▶  Frontend: {frontend_cmd}")

    try:
        frontend_process = subprocess.Popen(
            frontend_cmd,
            cwd=frontend_path,
            shell=True,
            creationflags=subprocess.CREATE_NEW_PROCESS_GROUP if os.name == 'nt' else 0
        )
    except Exception as e:
        print(f"❌ Lỗi frontend: {e}")
        stop_projects()
        return

    print("\n✅ Projects đang chạy!")
    print("   Backend:  http://localhost:5000")
    print("   Frontend: http://localhost:5173\n")


def stop_projects():
    """Dừng tất cả processes"""
    global frontend_process, backend_process

    if not frontend_process and not backend_process:
        print("ℹ️  Không có process nào đang chạy.\n")
        return

    print("\n🛑 Đang dừng...\n")

    if backend_process:
        try:
            if os.name == 'nt':
                os.kill(backend_process.pid, signal.CTRL_BREAK_EVENT)
            else:
                backend_process.terminate()
            backend_process.wait(timeout=3)
        except:
            backend_process.kill()
        backend_process = None
        print("✔  Backend dừng")

    if frontend_process:
        try:
            if os.name == 'nt':
                os.kill(frontend_process.pid, signal.CTRL_BREAK_EVENT)
            else:
                frontend_process.terminate()
            frontend_process.wait(timeout=3)
        except:
            frontend_process.kill()
        frontend_process = None
        print("✔  Frontend dừng")

    print("✅ Đã dừng hết.\n")


def check_process_status():
    """Kiểm tra trạng thái processes"""
    global frontend_process, backend_process

    be_status = "🟢 Running" if backend_process and backend_process.poll() is None else "🔴 Stopped"
    fe_status = "🟢 Running" if frontend_process and frontend_process.poll() is None else "🔴 Stopped"

    print(f"\n📊 Trạng thái:")
    print(f"   Backend:  {be_status}")
    print(f"   Frontend: {fe_status}\n")


def main():
    global running

    print("=" * 55)
    print("🧭 PRODUCTIVITY TRACKER - PROJECT MANAGER")
    print("=" * 55)
    print("📝 Lệnh:")
    print("   start   - Khởi động projects")
    print("   stop    - Dừng projects")
    print("   status  - Xem trạng thái")
    print("   exit    - Thoát")
    print("=" * 55 + "\n")

    try:
        while running:
            try:
                cmd = input("➤ ").strip().lower()

                if cmd == "start":
                    start_projects()
                elif cmd == "stop":
                    stop_projects()
                elif cmd == "status":
                    check_process_status()
                elif cmd in ["exit", "quit", "q"]:
                    stop_projects()
                    print("👋 Bye!\n")
                    running = False
                    break
                elif cmd == "":
                    continue
                else:
                    print("⚠️  Lệnh không hợp lệ!\n")

            except EOFError:
                break

    except KeyboardInterrupt:
        print("\n\n⚠️  Ctrl+C detected!")
        stop_projects()
    finally:
        running = False
        sys.exit(0)


if __name__ == "__main__":
    main()
