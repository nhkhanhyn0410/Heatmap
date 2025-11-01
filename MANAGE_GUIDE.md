# 🚀 Productivity Tracker - Management Script Guide

## Tổng quan

`manage.py` là công cụ quản lý dự án tích hợp, giúp bạn dễ dàng:
- ✅ Khởi động/dừng backend và frontend
- ✅ Quản lý process với PID tracking
- ✅ Xem logs real-time với màu sắc đẹp mắt
- ✅ Cài đặt dependencies
- ✅ Dọn dẹp build files
- ✅ Kiểm tra trạng thái services

---

## 📦 Yêu cầu

- **Python 3.6+** (built-in, không cần cài thêm package)
- **Node.js & npm** (để chạy backend/frontend)

---

## 🎯 Quick Start

### Cài đặt dependencies
```bash
python manage.py install
```

### Khởi động tất cả
```bash
python manage.py start
```

### Kiểm tra trạng thái
```bash
python manage.py status
```

### Dừng tất cả
```bash
python manage.py stop
```

---

## 📚 Commands Reference

### 1. `start` - Khởi động services

**Syntax:**
```bash
python manage.py start [target]
```

**Targets:**
- `all` (default) - Khởi động cả backend và frontend
- `backend` - Chỉ khởi động backend
- `frontend` - Chỉ khởi động frontend

**Examples:**
```bash
# Khởi động tất cả
python manage.py start
python manage.py start all

# Chỉ khởi động backend
python manage.py start backend

# Chỉ khởi động frontend
python manage.py start frontend
```

**Output:**
```
============================================================
                    Starting Services
============================================================

[INFO] Starting backend server...
[SUCCESS] Backend started with PID 12345
[INFO] Logs: /path/to/logs/backend_20251101_143022.log

[INFO] Starting frontend server...
[SUCCESS] Frontend started with PID 12346
[INFO] Logs: /path/to/logs/frontend_20251101_143024.log

============================================================
                     Service Status
============================================================

[SUCCESS] Backend: Running (PID 12345)
[SUCCESS] Frontend: Running (PID 12346)
[INFO] Backend URL: http://localhost:5000
[INFO] Frontend URL: http://localhost:5173
```

---

### 2. `stop` - Dừng services

**Syntax:**
```bash
python manage.py stop [target]
```

**Targets:**
- `all` (default) - Dừng tất cả
- `backend` - Chỉ dừng backend
- `frontend` - Chỉ dừng frontend

**Examples:**
```bash
# Dừng tất cả
python manage.py stop
python manage.py stop all

# Chỉ dừng backend
python manage.py stop backend

# Chỉ dừng frontend
python manage.py stop frontend
```

**Output:**
```
[INFO] Stopping backend...
[SUCCESS] Backend stopped

[INFO] Stopping frontend...
[SUCCESS] Frontend stopped
```

---

### 3. `restart` - Restart services

**Syntax:**
```bash
python manage.py restart [target]
```

**Targets:** Same as `start` and `stop`

**Examples:**
```bash
# Restart tất cả
python manage.py restart

# Restart chỉ backend
python manage.py restart backend
```

**Hoạt động:**
1. Stop service(s)
2. Wait 1 second
3. Start service(s)

---

### 4. `status` - Kiểm tra trạng thái

**Syntax:**
```bash
python manage.py status
```

**Output khi đang chạy:**
```
============================================================
                     Service Status
============================================================

[SUCCESS] Backend: Running (PID 12345)
[SUCCESS] Frontend: Running (PID 12346)
[INFO] Backend URL: http://localhost:5000
[INFO] Frontend URL: http://localhost:5173
```

**Output khi đã dừng:**
```
============================================================
                     Service Status
============================================================

[ERROR] Backend: Stopped
[ERROR] Frontend: Stopped
```

---

### 5. `install` - Cài đặt dependencies

**Syntax:**
```bash
python manage.py install [target]
```

**Targets:**
- `all` (default) - Cài đặt cho cả hai
- `backend` - Chỉ cài backend dependencies
- `frontend` - Chỉ cài frontend dependencies

**Examples:**
```bash
# Cài đặt tất cả
python manage.py install

# Chỉ cài backend
python manage.py install backend

# Chỉ cài frontend
python manage.py install frontend
```

**Hoạt động:**
- Chạy `npm install` trong thư mục tương ứng
- Hiển thị progress và errors (nếu có)

---

### 6. `logs` - Xem logs

**Syntax:**
```bash
python manage.py logs [target]
```

**Targets:**
- `backend` (default) - Xem logs backend
- `frontend` - Xem logs frontend

**Examples:**
```bash
# Xem backend logs
python manage.py logs
python manage.py logs backend

# Xem frontend logs
python manage.py logs frontend
```

**Output:**
```
============================================================
                      Backend Logs
============================================================

[INFO] Reading: /path/to/logs/backend_20251101_143022.log

============================================================

> backend@1.0.0 dev
> nodemon server.js

[nodemon] 3.0.2
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node server.js`
🚀 Server running on port 5000
...
```

---

### 7. `clean` - Dọn dẹp build files

**Syntax:**
```bash
python manage.py clean
```

**Hoạt động:**
1. Dừng tất cả services
2. Xóa `node_modules/` và `dist/` trong backend
3. Xóa `node_modules/`, `dist/`, `build/` trong frontend
4. Xóa logs cũ hơn 3 ngày
5. Xóa file `.pids.json`

**Examples:**
```bash
python manage.py clean
```

**Output:**
```
============================================================
                   Cleaning Build Files
============================================================

[INFO] Stopping backend...
[SUCCESS] Backend stopped
[INFO] Stopping frontend...
[SUCCESS] Frontend stopped

[INFO] Cleaning backend...
[INFO] Removing /path/to/backend/node_modules
[INFO] Removing /path/to/backend/dist

[INFO] Cleaning frontend...
[INFO] Removing /path/to/frontend/node_modules
[INFO] Removing /path/to/frontend/dist

[INFO] Cleaning old logs...
[INFO] Removed manage_20251028.log

[SUCCESS] Cleanup completed
```

**⚠️ Warning:** Bạn sẽ cần chạy `python manage.py install` lại sau khi clean!

---

### 8. `help` - Hiển thị hướng dẫn

**Syntax:**
```bash
python manage.py help
```

Hiển thị quick reference của tất cả commands.

---

## 🎨 Log System

### Log Files

Tất cả logs được lưu trong thư mục `logs/`:

```
logs/
├── backend_20251101_143022.log
├── frontend_20251101_143024.log
└── manage_20251101.log
```

**Naming convention:**
- Backend/Frontend logs: `{service}_{timestamp}.log`
- Manage script logs: `manage_{date}.log`

### Log Format

**Console output (với màu sắc):**
```
[2025-11-01 14:30:22] [INFO] Starting backend server...
[2025-11-01 14:30:24] [SUCCESS] Backend started with PID 12345
[2025-11-01 14:30:25] [WARNING] Backend is already running!
[2025-11-01 14:30:26] [ERROR] Failed to start backend: ...
```

**File logs (plain text):**
```
[2025-11-01 14:30:22] [INFO] Starting backend server...
[2025-11-01 14:30:24] [SUCCESS] Backend started with PID 12345
```

### Log Retention

- Logs cũ hơn **3 ngày** sẽ tự động xóa khi chạy `python manage.py clean`
- Mỗi lần start service tạo file log mới với timestamp

---

## ⚙️ Process Management

### PID Tracking

Script lưu Process IDs trong file `.pids.json`:

```json
{
  "backend": 12345,
  "frontend": 12346
}
```

**Vị trí:** `/path/to/Heatmap/.pids.json`

**Mục đích:**
- Track processes đang chạy
- Stop processes đúng cách
- Check service status

### Process Lifecycle

1. **Start:**
   - Kiểm tra process đã chạy chưa (qua PID)
   - Nếu chưa chạy, start process mới
   - Lưu PID vào `.pids.json`
   - Redirect output vào log file

2. **Stop:**
   - Đọc PID từ `.pids.json`
   - Kill process (graceful termination)
   - Xóa PID khỏi file

3. **Status:**
   - Đọc PIDs
   - Kiểm tra xem processes còn chạy không
   - Hiển thị status

---

## 🔧 Workflows thường dùng

### Development Workflow

**Ngày đầu tiên:**
```bash
# 1. Cài dependencies
python manage.py install

# 2. Khởi động services
python manage.py start

# 3. Kiểm tra status
python manage.py status
```

**Mỗi ngày làm việc:**
```bash
# Start
python manage.py start

# ... làm việc ...

# Stop khi xong
python manage.py stop
```

### Debugging Workflow

**Khi gặp lỗi:**
```bash
# 1. Xem logs
python manage.py logs backend
python manage.py logs frontend

# 2. Restart service
python manage.py restart backend

# 3. Kiểm tra status
python manage.py status
```

### Update Dependencies

```bash
# 1. Stop services
python manage.py stop

# 2. Update package.json (manually)

# 3. Reinstall
python manage.py install

# 4. Start lại
python manage.py start
```

### Clean Install

```bash
# 1. Clean everything
python manage.py clean

# 2. Reinstall
python manage.py install

# 3. Start fresh
python manage.py start
```

---

## 🐛 Troubleshooting

### Problem: "Backend is already running!"

**Nguyên nhân:** Process đã được start trước đó

**Giải pháp:**
```bash
# Option 1: Stop và start lại
python manage.py stop backend
python manage.py start backend

# Option 2: Restart
python manage.py restart backend
```

### Problem: Process không stop được

**Nguyên nhân:** PID file bị stale hoặc permission issues

**Giải pháp:**
```bash
# 1. Xóa PID file
rm .pids.json

# 2. Manually kill processes
# Linux/Mac:
ps aux | grep "node"
kill -9 <PID>

# Windows:
tasklist | findstr "node"
taskkill /F /PID <PID>

# 3. Start lại
python manage.py start
```

### Problem: Không thấy logs

**Nguyên nhân:** Logs chưa được tạo hoặc đã bị xóa

**Giải pháp:**
```bash
# Kiểm tra thư mục logs
ls -la logs/

# Nếu không có, start lại service
python manage.py restart
```

### Problem: Port already in use

**Nguyên nhân:** Backend (5000) hoặc Frontend (5173) port đã bị chiếm

**Giải pháp:**
```bash
# Linux/Mac - Kill process trên port
lsof -ti:5000 | xargs kill -9
lsof -ti:5173 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /F /PID <PID>
```

### Problem: Command not found

**Nguyên nhân:** Python hoặc npm chưa được cài

**Giải pháp:**
```bash
# Check Python
python3 --version

# Check npm
npm --version

# Nếu chưa có, cài đặt:
# https://www.python.org/downloads/
# https://nodejs.org/
```

---

## 💡 Tips & Tricks

### Shortcut với alias

**Linux/Mac (`~/.bashrc` hoặc `~/.zshrc`):**
```bash
alias pm='python manage.py'
alias pmstart='python manage.py start'
alias pmstop='python manage.py stop'
alias pmstatus='python manage.py status'
```

**Sử dụng:**
```bash
pm start        # Instead of python manage.py start
pmstatus        # Instead of python manage.py status
```

### Chạy background

**Linux/Mac:**
```bash
# Start và chạy background
python manage.py start &

# Hoặc sử dụng nohup
nohup python manage.py start > /dev/null 2>&1 &
```

### Xem logs real-time

```bash
# Tail backend logs
tail -f logs/backend_*.log | grep -E "INFO|ERROR"

# Tail frontend logs
tail -f logs/frontend_*.log
```

### Auto-restart on file change

Script đã sử dụng `nodemon` cho backend, tự động restart khi code thay đổi.

---

## 📊 Architecture

```
manage.py
├── ProcessManager
│   ├── start_backend()
│   ├── start_frontend()
│   ├── stop_process()
│   ├── is_process_running()
│   ├── load_pids()
│   └── save_pids()
├── Logger
│   ├── info()
│   ├── success()
│   ├── warning()
│   └── error()
└── Commands
    ├── start()
    ├── stop()
    ├── restart()
    ├── status()
    ├── install()
    ├── logs()
    ├── clean()
    └── help()
```

---

## 🎯 Best Practices

1. **Luôn check status trước khi start:**
   ```bash
   python manage.py status
   python manage.py start
   ```

2. **Stop services khi không dùng:**
   ```bash
   python manage.py stop
   ```

3. **Xem logs khi debug:**
   ```bash
   python manage.py logs backend
   python manage.py logs frontend
   ```

4. **Clean định kỳ (1 tuần/lần):**
   ```bash
   python manage.py clean
   python manage.py install
   ```

5. **Backup .env trước khi clean:**
   ```bash
   cp backend/.env backend/.env.backup
   python manage.py clean
   ```

---

## 📞 Support

Nếu gặp vấn đề:

1. Check logs: `python manage.py logs backend`
2. Check status: `python manage.py status`
3. Restart: `python manage.py restart`
4. Clean install: `python manage.py clean && python manage.py install`

---

**Happy coding! 🚀**
