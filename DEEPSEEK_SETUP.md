# 🤖 Hướng dẫn tích hợp DeepSeek AI Chatbot

## Tổng quan

Productivity Tracker đã được tích hợp sẵn DeepSeek AI để cung cấp chatbot thông minh hỗ trợ năng suất. Chatbot có khả năng:

- ✅ Phân tích dữ liệu năng suất 7 ngày gần nhất tự động
- ✅ Đưa ra lời khuyên cá nhân hóa dựa trên dữ liệu thực
- ✅ Trả lời các câu hỏi về quản lý thời gian
- ✅ Gợi ý cải thiện hiệu suất làm việc
- ✅ Giao tiếp bằng tiếng Việt tự nhiên

## 📝 Bước 1: Đăng ký DeepSeek API

### 1.1. Tạo tài khoản

Truy cập: **https://platform.deepseek.com/**

1. Click **Sign Up** (hoặc **Register**)
2. Đăng ký bằng email hoặc GitHub
3. Xác nhận email

### 1.2. Tạo API Key

1. Đăng nhập vào Dashboard: https://platform.deepseek.com/
2. Vào mục **API Keys** (hoặc **Settings > API Keys**)
3. Click **Create API Key**
4. Đặt tên cho key (ví dụ: "Productivity Tracker")
5. Copy API key ngay (key chỉ hiển thị 1 lần!)

**Ví dụ API key:**
```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **Lưu ý:** Giữ API key bí mật, không commit lên Git!

## 🔧 Bước 2: Cấu hình Backend

### 2.1. Cập nhật file .env

Mở file `/backend/.env` và thêm/cập nhật:

```env
# DeepSeek AI API
DEEPSEEK_API_URL=https://api.deepseek.com/v1
DEEPSEEK_API_KEY=sk-your-actual-api-key-here
DEEPSEEK_MODEL=deepseek-chat
```

**Thay `sk-your-actual-api-key-here` bằng API key thực của bạn!**

### 2.2. Kiểm tra cấu hình

File `.env` đầy đủ sẽ như sau:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/productivity-tracker

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Session Secret
SESSION_SECRET=your-session-secret-key-change-this

# Frontend URL
FRONTEND_URL=http://localhost:5173

# DeepSeek AI API
DEEPSEEK_API_URL=https://api.deepseek.com/v1
DEEPSEEK_API_KEY=sk-your-actual-api-key-here
DEEPSEEK_MODEL=deepseek-chat
```

## 🚀 Bước 3: Khởi động lại Server

Sau khi cập nhật `.env`, restart backend server:

```bash
# Stop server (Ctrl+C)
# Then restart
cd backend
npm run dev
```

## ✅ Bước 4: Test Chatbot

1. Mở ứng dụng: http://localhost:5173
2. Đăng nhập vào tài khoản
3. Ở Dashboard, chatbot sẽ hiển thị bên phải
4. Gửi tin nhắn test: "Xin chào!" hoặc "Phân tích năng suất của tôi"

### Ví dụ câu hỏi:

- "Phân tích hiệu suất làm việc 7 ngày của tôi"
- "Làm sao để cải thiện năng suất?"
- "Tôi nên ưu tiên công việc nào hôm nay?"
- "Mẹo quản lý thời gian hiệu quả?"
- "Tại sao năng suất của tôi giảm?"

## 🔍 Cách hoạt động

### Context tự động

Khi bạn gửi tin nhắn, chatbot tự động nhận được:

```javascript
Dữ liệu năng suất 7 ngày gần đây:
- Tổng công việc hoàn thành: 15
- Tổng giờ làm việc: 42.5h
- Điểm năng suất trung bình: 78%

Chi tiết từng ngày:
- 2025-10-25: 3 công việc, 6.5h, điểm 85%
- 2025-10-26: 2 công việc, 5.0h, điểm 72%
...
```

### System Prompt

Chatbot được cấu hình với system prompt:

```
Bạn là một trợ lý AI chuyên về năng suất và quản lý thời gian.
Bạn giúp người dùng phân tích hiệu suất làm việc, đưa ra lời khuyên về quản lý thời gian,
và cung cấp các gợi ý để cải thiện năng suất. Hãy trả lời bằng tiếng Việt một cách thân thiện và hữu ích.
```

## 💰 Chi phí

DeepSeek API rất rẻ:

- **Input:** ~$0.14 / 1M tokens
- **Output:** ~$0.28 / 1M tokens

**Ước tính:**
- 1000 tin nhắn chat ~ $0.50 - $2.00
- Free tier có thể đủ cho testing

## 🐛 Troubleshooting

### Lỗi: "API key is invalid"

**Nguyên nhân:**
- API key sai hoặc đã hết hạn
- Chưa cập nhật vào file .env
- Server chưa restart sau khi update .env

**Giải pháp:**
1. Kiểm tra API key trong .env
2. Tạo API key mới nếu cần
3. Restart backend server

### Lỗi: "Error communicating with chatbot service"

**Nguyên nhân:**
- Không có internet
- DeepSeek API endpoint sai
- API key chưa được set

**Giải pháp:**
1. Kiểm tra kết nối internet
2. Verify DEEPSEEK_API_URL đúng
3. Check backend logs: `npm run dev`

### Chatbot trả lời: "Xin lỗi, tôi đang gặp sự cố..."

**Nguyên nhân:**
- API key chưa được cấu hình
- Hết quota (free tier)
- Network issue

**Giải pháp:**
1. Check file `.env` có DEEPSEEK_API_KEY
2. Kiểm tra quota tại https://platform.deepseek.com/
3. Check backend console logs

### Backend logs

Xem logs để debug:

```bash
cd backend
npm run dev

# Logs sẽ hiển thị:
# ✅ Thành công: "Response from DeepSeek"
# ❌ Lỗi: "DeepSeek API error: ..."
```

## 🔒 Bảo mật

### ✅ Làm đúng:

```bash
# .env file (local only)
DEEPSEEK_API_KEY=sk-your-key

# .gitignore
.env
```

### ❌ KHÔNG BAO GIỜ:

```javascript
// Hardcode API key trong code
const apiKey = "sk-xxx"; // ❌ KHÔNG LÀM NHƯ VẦY!

// Commit .env vào git
git add .env // ❌ NGUY HIỂM!
```

## 🎯 Tùy chỉnh nâng cao

### Thay đổi Model

Trong file `.env`:

```env
# Sử dụng model khác (nếu có)
DEEPSEEK_MODEL=deepseek-chat
# hoặc
DEEPSEEK_MODEL=deepseek-coder  # For coding tasks
```

### Điều chỉnh Temperature

File: `/backend/src/controllers/chatbot.controller.js`

```javascript
{
  model: process.env.DEEPSEEK_MODEL,
  messages: [...],
  temperature: 0.7,  // Giảm = conservative, Tăng = creative (0.0-2.0)
  max_tokens: 1000   // Giới hạn độ dài response
}
```

### Custom System Prompt

File: `/backend/src/controllers/chatbot.controller.js`

```javascript
let systemMessage = `
Bạn là chuyên gia năng suất với 10 năm kinh nghiệm.
Phong cách: Thân thiện, ngắn gọn, actionable advice.
Format: Bullet points, dễ đọc.
`;
```

## 📚 API Documentation

Chi tiết về DeepSeek API:
- Docs: https://platform.deepseek.com/api-docs
- Examples: https://platform.deepseek.com/examples
- Pricing: https://platform.deepseek.com/pricing

## 🎉 Hoàn thành!

Bây giờ bạn đã có chatbot AI thông minh tích hợp hoàn toàn vào Productivity Tracker!

**Các bước đã làm:**
- ✅ Đăng ký DeepSeek API
- ✅ Tạo API key
- ✅ Cấu hình backend
- ✅ Test chatbot

**Tận hưởng trợ lý AI của bạn!** 🚀
