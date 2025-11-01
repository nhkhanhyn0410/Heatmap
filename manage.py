#!/usr/bin/env python3
"""
Productivity Tracker - Project Management Script
================================================
Manage both frontend and backend services with ease.

Usage:
    python manage.py start [backend|frontend|all]
    python manage.py stop [backend|frontend|all]
    python manage.py restart [backend|frontend|all]
    python manage.py status
    python manage.py install [backend|frontend|all]
    python manage.py logs [backend|frontend]
    python manage.py clean
    python manage.py help
"""

import os
import sys
import subprocess
import signal
import time
import json
from pathlib import Path
from datetime import datetime

# ANSI color codes
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

# Project paths
BASE_DIR = Path(__file__).parent
BACKEND_DIR = BASE_DIR / 'backend'
FRONTEND_DIR = BASE_DIR / 'frontend'
LOGS_DIR = BASE_DIR / 'logs'
PID_FILE = BASE_DIR / '.pids.json'

# Ensure logs directory exists
LOGS_DIR.mkdir(exist_ok=True)

class Logger:
    """Simple logger with colored output and file logging"""

    @staticmethod
    def _log(level, message, color):
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        colored_msg = f"{color}[{level}]{Colors.ENDC} {message}"
        plain_msg = f"[{level}] {message}"

        # Print to console with color
        print(f"{Colors.CYAN}[{timestamp}]{Colors.ENDC} {colored_msg}")

        # Write to log file
        log_file = LOGS_DIR / f"manage_{datetime.now().strftime('%Y%m%d')}.log"
        with open(log_file, 'a', encoding='utf-8') as f:
            f.write(f"[{timestamp}] {plain_msg}\n")

    @staticmethod
    def info(message):
        Logger._log('INFO', message, Colors.BLUE)

    @staticmethod
    def success(message):
        Logger._log('SUCCESS', message, Colors.GREEN)

    @staticmethod
    def warning(message):
        Logger._log('WARNING', message, Colors.YELLOW)

    @staticmethod
    def error(message):
        Logger._log('ERROR', message, Colors.RED)

    @staticmethod
    def header(message):
        print(f"\n{Colors.BOLD}{Colors.HEADER}{'='*60}{Colors.ENDC}")
        print(f"{Colors.BOLD}{Colors.HEADER}{message:^60}{Colors.ENDC}")
        print(f"{Colors.BOLD}{Colors.HEADER}{'='*60}{Colors.ENDC}\n")

class ProcessManager:
    """Manage backend and frontend processes"""

    @staticmethod
    def load_pids():
        """Load PIDs from file"""
        if PID_FILE.exists():
            with open(PID_FILE, 'r') as f:
                return json.load(f)
        return {}

    @staticmethod
    def save_pids(pids):
        """Save PIDs to file"""
        with open(PID_FILE, 'w') as f:
            json.dump(pids, f, indent=2)

    @staticmethod
    def is_process_running(pid):
        """Check if process is running"""
        try:
            os.kill(pid, 0)
            return True
        except (OSError, TypeError):
            return False

    @staticmethod
    def start_backend():
        """Start backend server"""
        Logger.info("Starting backend server...")

        # Check if already running
        pids = ProcessManager.load_pids()
        if 'backend' in pids and ProcessManager.is_process_running(pids['backend']):
            Logger.warning("Backend is already running!")
            return

        # Start backend
        log_file = LOGS_DIR / f"backend_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"

        try:
            process = subprocess.Popen(
                ['npm', 'run', 'dev'],
                cwd=BACKEND_DIR,
                stdout=open(log_file, 'w'),
                stderr=subprocess.STDOUT,
                preexec_fn=os.setsid if sys.platform != 'win32' else None
            )

            # Save PID
            pids['backend'] = process.pid
            ProcessManager.save_pids(pids)

            Logger.success(f"Backend started with PID {process.pid}")
            Logger.info(f"Logs: {log_file}")

        except Exception as e:
            Logger.error(f"Failed to start backend: {str(e)}")

    @staticmethod
    def start_frontend():
        """Start frontend server"""
        Logger.info("Starting frontend server...")

        # Check if already running
        pids = ProcessManager.load_pids()
        if 'frontend' in pids and ProcessManager.is_process_running(pids['frontend']):
            Logger.warning("Frontend is already running!")
            return

        # Start frontend
        log_file = LOGS_DIR / f"frontend_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"

        try:
            process = subprocess.Popen(
                ['npm', 'run', 'dev'],
                cwd=FRONTEND_DIR,
                stdout=open(log_file, 'w'),
                stderr=subprocess.STDOUT,
                preexec_fn=os.setsid if sys.platform != 'win32' else None
            )

            # Save PID
            pids['frontend'] = process.pid
            ProcessManager.save_pids(pids)

            Logger.success(f"Frontend started with PID {process.pid}")
            Logger.info(f"Logs: {log_file}")

        except Exception as e:
            Logger.error(f"Failed to start frontend: {str(e)}")

    @staticmethod
    def stop_process(name):
        """Stop a specific process"""
        pids = ProcessManager.load_pids()

        if name not in pids:
            Logger.warning(f"{name.capitalize()} is not running")
            return

        pid = pids[name]

        if not ProcessManager.is_process_running(pid):
            Logger.warning(f"{name.capitalize()} process (PID {pid}) is not running")
            del pids[name]
            ProcessManager.save_pids(pids)
            return

        try:
            Logger.info(f"Stopping {name}...")

            if sys.platform == 'win32':
                subprocess.run(['taskkill', '/F', '/T', '/PID', str(pid)],
                             capture_output=True)
            else:
                os.killpg(os.getpgid(pid), signal.SIGTERM)

            time.sleep(1)

            # Remove from PIDs
            del pids[name]
            ProcessManager.save_pids(pids)

            Logger.success(f"{name.capitalize()} stopped")

        except Exception as e:
            Logger.error(f"Failed to stop {name}: {str(e)}")

    @staticmethod
    def get_status():
        """Get status of all processes"""
        pids = ProcessManager.load_pids()

        status = {
            'backend': {
                'running': False,
                'pid': None
            },
            'frontend': {
                'running': False,
                'pid': None
            }
        }

        for name, pid in pids.items():
            if ProcessManager.is_process_running(pid):
                status[name]['running'] = True
                status[name]['pid'] = pid

        return status

class Commands:
    """Command handlers"""

    @staticmethod
    def start(target='all'):
        """Start services"""
        Logger.header("Starting Services")

        if target in ['backend', 'all']:
            ProcessManager.start_backend()
            time.sleep(2)  # Wait for backend to start

        if target in ['frontend', 'all']:
            ProcessManager.start_frontend()
            time.sleep(2)  # Wait for frontend to start

        Commands.status()

    @staticmethod
    def stop(target='all'):
        """Stop services"""
        Logger.header("Stopping Services")

        if target in ['backend', 'all']:
            ProcessManager.stop_process('backend')

        if target in ['frontend', 'all']:
            ProcessManager.stop_process('frontend')

        Commands.status()

    @staticmethod
    def restart(target='all'):
        """Restart services"""
        Logger.header("Restarting Services")
        Commands.stop(target)
        time.sleep(1)
        Commands.start(target)

    @staticmethod
    def status():
        """Show status of services"""
        Logger.header("Service Status")

        status = ProcessManager.get_status()

        # Backend status
        backend = status['backend']
        if backend['running']:
            Logger.success(f"Backend: Running (PID {backend['pid']})")
        else:
            Logger.error("Backend: Stopped")

        # Frontend status
        frontend = status['frontend']
        if frontend['running']:
            Logger.success(f"Frontend: Running (PID {frontend['pid']})")
        else:
            Logger.error("Frontend: Stopped")

        # Show URLs
        if backend['running']:
            Logger.info("Backend URL: http://localhost:5000")
        if frontend['running']:
            Logger.info("Frontend URL: http://localhost:5173")

    @staticmethod
    def install(target='all'):
        """Install dependencies"""
        Logger.header("Installing Dependencies")

        if target in ['backend', 'all']:
            Logger.info("Installing backend dependencies...")
            try:
                subprocess.run(['npm', 'install'], cwd=BACKEND_DIR, check=True)
                Logger.success("Backend dependencies installed")
            except subprocess.CalledProcessError as e:
                Logger.error(f"Failed to install backend dependencies: {str(e)}")

        if target in ['frontend', 'all']:
            Logger.info("Installing frontend dependencies...")
            try:
                subprocess.run(['npm', 'install'], cwd=FRONTEND_DIR, check=True)
                Logger.success("Frontend dependencies installed")
            except subprocess.CalledProcessError as e:
                Logger.error(f"Failed to install frontend dependencies: {str(e)}")

    @staticmethod
    def logs(target='backend'):
        """Show logs"""
        Logger.header(f"{target.capitalize()} Logs")

        # Find latest log file
        log_files = list(LOGS_DIR.glob(f"{target}_*.log"))

        if not log_files:
            Logger.warning(f"No logs found for {target}")
            return

        latest_log = max(log_files, key=lambda p: p.stat().st_mtime)

        Logger.info(f"Reading: {latest_log}")
        print("\n" + "="*60 + "\n")

        try:
            with open(latest_log, 'r', encoding='utf-8') as f:
                print(f.read())
        except Exception as e:
            Logger.error(f"Failed to read log: {str(e)}")

    @staticmethod
    def clean():
        """Clean build files and logs"""
        Logger.header("Cleaning Build Files")

        # Stop all services first
        Commands.stop('all')

        # Clean backend
        Logger.info("Cleaning backend...")
        backend_dirs = [BACKEND_DIR / 'node_modules', BACKEND_DIR / 'dist']
        for dir_path in backend_dirs:
            if dir_path.exists():
                Logger.info(f"Removing {dir_path}")
                import shutil
                shutil.rmtree(dir_path, ignore_errors=True)

        # Clean frontend
        Logger.info("Cleaning frontend...")
        frontend_dirs = [FRONTEND_DIR / 'node_modules', FRONTEND_DIR / 'dist', FRONTEND_DIR / 'build']
        for dir_path in frontend_dirs:
            if dir_path.exists():
                Logger.info(f"Removing {dir_path}")
                import shutil
                shutil.rmtree(dir_path, ignore_errors=True)

        # Clean logs (keep last 3 days)
        Logger.info("Cleaning old logs...")
        current_time = time.time()
        for log_file in LOGS_DIR.glob("*.log"):
            if current_time - log_file.stat().st_mtime > 3 * 86400:  # 3 days
                log_file.unlink()
                Logger.info(f"Removed {log_file.name}")

        # Remove PID file
        if PID_FILE.exists():
            PID_FILE.unlink()

        Logger.success("Cleanup completed")

    @staticmethod
    def help():
        """Show help message"""
        help_text = f"""
{Colors.BOLD}{Colors.HEADER}Productivity Tracker - Management Script{Colors.ENDC}

{Colors.BOLD}USAGE:{Colors.ENDC}
    python manage.py <command> [target]

{Colors.BOLD}COMMANDS:{Colors.ENDC}
    {Colors.GREEN}start{Colors.ENDC} [backend|frontend|all]    Start services (default: all)
    {Colors.RED}stop{Colors.ENDC}  [backend|frontend|all]    Stop services (default: all)
    {Colors.YELLOW}restart{Colors.ENDC} [backend|frontend|all] Restart services (default: all)
    {Colors.BLUE}status{Colors.ENDC}                         Show service status
    {Colors.CYAN}install{Colors.ENDC} [backend|frontend|all]  Install dependencies (default: all)
    {Colors.BLUE}logs{Colors.ENDC} [backend|frontend]         Show logs (default: backend)
    {Colors.RED}clean{Colors.ENDC}                           Clean build files and old logs
    {Colors.YELLOW}help{Colors.ENDC}                           Show this help message

{Colors.BOLD}EXAMPLES:{Colors.ENDC}
    python manage.py start                # Start both backend and frontend
    python manage.py start backend        # Start only backend
    python manage.py stop all             # Stop all services
    python manage.py restart frontend     # Restart frontend only
    python manage.py status               # Check service status
    python manage.py install              # Install all dependencies
    python manage.py logs backend         # View backend logs
    python manage.py clean                # Clean all build files

{Colors.BOLD}LOGS:{Colors.ENDC}
    Logs are stored in: {LOGS_DIR}

{Colors.BOLD}URLS:{Colors.ENDC}
    Backend:  http://localhost:5000
    Frontend: http://localhost:5173
"""
        print(help_text)

def main():
    """Main entry point"""

    # Show header
    print(f"\n{Colors.BOLD}{Colors.CYAN}{'='*60}{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.CYAN}{'Productivity Tracker - Management Tool':^60}{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.CYAN}{'='*60}{Colors.ENDC}\n")

    # Parse arguments
    if len(sys.argv) < 2:
        Commands.help()
        return

    command = sys.argv[1].lower()
    target = sys.argv[2] if len(sys.argv) > 2 else 'all'

    # Execute command
    try:
        if command == 'start':
            Commands.start(target)
        elif command == 'stop':
            Commands.stop(target)
        elif command == 'restart':
            Commands.restart(target)
        elif command == 'status':
            Commands.status()
        elif command == 'install':
            Commands.install(target)
        elif command == 'logs':
            Commands.logs(target)
        elif command == 'clean':
            Commands.clean()
        elif command == 'help':
            Commands.help()
        else:
            Logger.error(f"Unknown command: {command}")
            Commands.help()

    except KeyboardInterrupt:
        print(f"\n\n{Colors.YELLOW}Interrupted by user{Colors.ENDC}")
        sys.exit(0)
    except Exception as e:
        Logger.error(f"Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()
