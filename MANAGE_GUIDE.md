# 🚀 Productivity Tracker - Management Script Guide

## Tổng quan

`manage.py` là công cụ interactive shell đơn giản để quản lý dự án, giúp bạn:
- ✅ Khởi động/dừng backend và frontend cùng lúc
- ✅ Kiểm tra trạng thái services
- ✅ Tự động phát hiện npm scripts từ package.json
- ✅ Cross-platform support (Windows, Mac, Linux)

---

## 📦 Yêu cầu

- **Python 3.6+** (built-in, không cần cài thêm package)
- **Node.js & npm** (để chạy backend/frontend)

---

## 🎯 Quick Start

### Khởi động

```bash
python manage.py
```

Bạn sẽ thấy interactive shell:

```
=======================================================
🧭 PRODUCTIVITY TRACKER - PROJECT MANAGER
=======================================================
📝 Lệnh:
   start   - Khởi động projects
   stop    - Dừng projects
   status  - Xem trạng thái
   exit    - Thoát
=======================================================

➤
```

### Sử dụng

```
➤ start          # Khởi động backend + frontend
➤ status         # Kiểm tra trạng thái
➤ stop           # Dừng tất cả
➤ exit           # Thoát (tự động dừng processes)
```

---

## 📚 Commands Reference

### 1. `start` - Khởi động projects

**Cách dùng:**
```
➤ start
```

**Output:**
```
🚀 Đang khởi động projects...

▶  Backend: npm run dev
▶  Frontend: npm run dev

✅ Projects đang chạy!
   Backend:  http://localhost:5000
   Frontend: http://localhost:5173
```

**Hoạt động:**
- Tự động phát hiện npm script (ưu tiên `dev`, sau đó `start`)
- Khởi động backend trước, frontend sau
- Hiển thị URLs sau khi start thành công

**Lưu ý:**
- Nếu đã chạy rồi, sẽ báo: `⚠️ Projects đang chạy rồi!`
- Cần dừng trước khi start lại

---

### 2. `stop` - Dừng projects

**Cách dùng:**
```
➤ stop
```

**Output:**
```
🛑 Đang dừng...

✔  Backend dừng
✔  Frontend dừng
✅ Đã dừng hết.
```

**Hoạt động:**
- Graceful termination (Windows: CTRL_BREAK_EVENT, Linux/Mac: terminate)
- Timeout 3 giây, sau đó force kill
- Dừng backend trước, frontend sau

**Lưu ý:**
- Nếu chưa chạy, sẽ báo: `ℹ️ Không có process nào đang chạy.`

---

### 3. `status` - Kiểm tra trạng thái

**Cách dùng:**
```
➤ status
```

**Output khi đang chạy:**
```
📊 Trạng thái:
   Backend:  🟢 Running
   Frontend: 🟢 Running
```

**Output khi đã dừng:**
```
📊 Trạng thái:
   Backend:  🔴 Stopped
   Frontend: 🔴 Stopped
```

**Hoạt động:**
- Check process.poll() để xác định status
- Real-time status (không cache)

---

### 4. `exit` / `quit` / `q` - Thoát

**Cách dùng:**
```
➤ exit
```
hoặc
```
➤ quit
```
hoặc
```
➤ q
```

**Output:**
```
🛑 Đang dừng...

✔  Backend dừng
✔  Frontend dừng
✅ Đã dừng hết.

👋 Bye!
```

**Hoạt động:**
- Tự động stop tất cả processes trước khi thoát
- Safe shutdown

**Lưu ý:**
- Có thể dùng Ctrl+C để thoát nhanh

---

## 🔧 Workflows thường dùng

### Development Workflow

**Ngày đầu tiên:**
```bash
# 1. Chạy script
python manage.py

# 2. Khởi động
➤ start

# 3. Làm việc...
# Truy cập: http://localhost:5173

# 4. Dừng khi xong
➤ stop

# 5. Thoát
➤ exit
```

**Mỗi ngày làm việc:**
```bash
python manage.py
➤ start
# ... làm việc ...
➤ exit    # Auto stop
```

### Quick Check

```bash
python manage.py
➤ status    # Kiểm tra xem có gì đang chạy không
➤ exit
```

### Restart

```bash
python manage.py
➤ stop
➤ start
# Hoặc
➤ exit
python manage.py
➤ start
```

---

## 🎨 Features

### Auto-detect npm scripts

Script tự động đọc `package.json` và chọn lệnh phù hợp:

**Priority:**
1. `npm run dev` (nếu có `dev` script)
2. `npm start` (nếu có `start` script)
3. Fallback:
   - Backend: `node server.js`
   - Frontend: `npx vite`

**Example package.json:**
```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  }
}
```
→ Sẽ chạy: `npm run dev`

### Cross-platform Support

**Windows:**
- Sử dụng `CREATE_NEW_PROCESS_GROUP`
- Stop bằng `CTRL_BREAK_EVENT`

**Linux/Mac:**
- Standard subprocess
- Stop bằng `terminate()`

### Process Management

- **Global variables:** `frontend_process`, `backend_process`
- **Poll check:** `process.poll()` để check status
- **Timeout:** 3 giây cho graceful shutdown
- **Force kill:** Nếu timeout

---

## 🐛 Troubleshooting

### Problem: "Projects đang chạy rồi!"

**Nguyên nhân:** Process đã được start trước đó

**Giải pháp:**
```
➤ stop
➤ start
```

### Problem: Process không dừng được

**Nguyên nhân:** Process bị zombie hoặc permission issues

**Giải pháp:**
```bash
# Thoát script
➤ exit

# Manually kill processes
# Linux/Mac:
ps aux | grep node
kill -9 <PID>

# Windows:
tasklist | findstr "node"
taskkill /F /PID <PID>

# Start lại
python manage.py
➤ start
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

### Problem: "Không tìm thấy backend/frontend"

**Nguyên nhân:** Chạy script ở sai directory

**Giải pháp:**
```bash
# Phải chạy ở root directory của project
cd /path/to/Heatmap
python manage.py
```

### Problem: Ctrl+C không hoạt động

**Nguyên nhân:** Processes đang block

**Giải pháp:**
- Ctrl+C nhiều lần
- Hoặc force close terminal và manually kill processes

---

## 💡 Tips & Tricks

### Tip 1: Keep Shell Open

Giữ terminal window với manage.py mở để dễ dàng stop/restart:
```
➤ start
# ... làm việc ở terminal khác ...
➤ stop
➤ start
```

### Tip 2: Quick Status Check

```bash
# Terminal riêng cho quick check
python manage.py
➤ status
➤ exit
```

### Tip 3: Alias (Optional)

**Linux/Mac (`~/.bashrc` or `~/.zshrc`):**
```bash
alias pm='python manage.py'
```

**Sử dụng:**
```bash
pm    # Instead of python manage.py
```

### Tip 4: Background Running

Script chạy foreground, giữ terminal window mở để:
- Dễ stop khi cần
- Monitor status
- Quick restart

### Tip 5: Error Checking

Nếu start failed, check:
```
➤ status    # Xem service nào failed
```

Xem logs trong terminal của backend/frontend để debug

---

## 📊 Architecture

```
manage.py (Interactive Shell)
│
├── start_projects()
│   ├── get_npm_script(backend)
│   ├── Popen backend process
│   ├── get_npm_script(frontend)
│   └── Popen frontend process
│
├── stop_projects()
│   ├── Terminate backend
│   └── Terminate frontend
│
├── check_process_status()
│   ├── Poll backend
│   └── Poll frontend
│
└── main()
    ├── Display menu
    ├── Input loop
    ├── Command routing
    └── Cleanup on exit
```

---

## 🎯 Best Practices

### 1. Always check status before start
```
➤ status
➤ start
```

### 2. Stop cleanly before exit
```
➤ stop    # Explicit stop
➤ exit    # Or just exit (auto-stop)
```

### 3. Keep one manage.py window open
Dễ control hơn việc mở nhiều terminal

### 4. Use status command regularly
Để biết service nào đang chạy

### 5. Manual kill if needed
Nếu script không stop được, manually kill processes

---

## 🆚 Comparison

### ❌ Before (Manual)

**Start:**
```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

**Stop:**
- Ctrl+C ở cả 2 terminals
- Dễ quên terminal nào

**Status:**
- Phải nhớ terminal nào là gì
- Không có visual status

### ✅ After (With manage.py)

**Start:**
```bash
python manage.py
➤ start
```

**Stop:**
```
➤ stop
```

**Status:**
```
➤ status
📊 Trạng thái:
   Backend:  🟢 Running
   Frontend: 🟢 Running
```

**Benefits:**
- ✅ Single terminal
- ✅ Clear status indicators
- ✅ Easy start/stop/restart
- ✅ Auto-detect npm scripts
- ✅ Safe shutdown on exit

---

## 📞 Support

### Lỗi thường gặp:

1. **Port in use:** Kill process trên port 5000 và 5173
2. **Process không stop:** Manual kill với PID
3. **Script không tìm thấy folder:** Chạy ở root directory

### Debug:

1. Check status: `➤ status`
2. Stop và start lại: `➤ stop` → `➤ start`
3. Xem logs trong terminal của processes
4. Manual kill nếu cần

---

## ⌨️ Keyboard Shortcuts

- **Ctrl+C**: Interrupt & exit (auto stop processes)
- **Enter** (empty): Skip command
- **Up/Down arrows**: Command history (if terminal supports)

---

## 🎊 Example Session

```bash
$ python manage.py

=======================================================
🧭 PRODUCTIVITY TRACKER - PROJECT MANAGER
=======================================================
📝 Lệnh:
   start   - Khởi động projects
   stop    - Dừng projects
   status  - Xem trạng thái
   exit    - Thoát
=======================================================

➤ status

📊 Trạng thái:
   Backend:  🔴 Stopped
   Frontend: 🔴 Stopped

➤ start

🚀 Đang khởi động projects...

▶  Backend: npm run dev
▶  Frontend: npm run dev

✅ Projects đang chạy!
   Backend:  http://localhost:5000
   Frontend: http://localhost:5173

➤ status

📊 Trạng thái:
   Backend:  🟢 Running
   Frontend: 🟢 Running

➤ stop

🛑 Đang dừng...

✔  Backend dừng
✔  Frontend dừng
✅ Đã dừng hết.

➤ exit
👋 Bye!
```

---

## 🎁 Bonus: Code Explanation

### Why Interactive Shell?

**Advantages:**
- ✅ Đơn giản hơn CLI arguments
- ✅ Giữ state (processes) trong session
- ✅ Dễ dùng cho người mới
- ✅ Clear visual feedback
- ✅ Ít code hơn

**vs CLI Arguments:**
```bash
# CLI way (complex)
python manage.py start backend
python manage.py stop all

# Interactive way (simple)
python manage.py
➤ start
➤ stop
```

### Global Variables

```python
frontend_process = None
backend_process = None
running = True
```

**Why global?**
- Shared state giữa các functions
- Persist qua commands trong session
- Cleanup on exit

---

**Happy coding! 🚀**

Script này giúp bạn quản lý dự án đơn giản và hiệu quả hơn nhiều!
