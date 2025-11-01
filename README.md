# 📊 Productivity Tracker

Productivity Tracker là một ứng dụng quản lý thời gian và công việc toàn diện, giúp người dùng theo dõi hiệu suất cá nhân thông qua bản đồ nhiệt (heatmap), danh sách công việc, bảng phân tích năng suất, và chatbot hỗ trợ thông minh.

## ✨ Tính năng chính

### 🗓️ Bản đồ nhiệt hoạt động hàng tháng (Monthly Activity Heatmap)
- Hiển thị toàn bộ các ngày trong tháng dưới dạng lưới trực quan
- Màu sắc thể hiện cường độ hoạt động (6 mức độ từ 0-5)
- Hover để xem chi tiết: giờ làm việc, công việc hoàn thành, điểm năng suất
- Click vào ngày để xem chi tiết công việc

### ✅ Danh sách công việc và hoàn thành
- Quản lý công việc theo mức độ ưu tiên (Thấp, Trung bình, Cao)
- Phân loại: Công việc, Cá nhân, Sức khỏe, Học tập
- Đánh dấu hoàn thành tự động cập nhật heatmap
- Hiển thị thời lượng và thời gian làm việc

### 📊 Bảng phân tích năng suất
- Hiệu suất trung bình 7 ngày
- Tổng số công việc và giờ làm việc
- Biểu đồ xu hướng năng suất
- Weekly Insights: Ngày hiệu quả nhất, giờ làm việc cao nhất, chuỗi ngày duy trì

### ➕ Thêm công việc mới
- Form đầy đủ: tiêu đề, mô tả, thời gian, phân loại
- Đánh giá độ khó và mức độ tập trung (1-5)
- Có thể đánh dấu hoàn thành ngay khi tạo

### 🤖 Chatbot hỗ trợ thông minh (DeepSeek AI)
- Tích hợp DeepSeek AI để tư vấn năng suất
- Phân tích dữ liệu cá nhân tự động (7 ngày gần nhất)
- Gợi ý cải thiện hiệu suất làm việc dựa trên dữ liệu thực
- Trả lời câu hỏi về quản lý thời gian bằng tiếng Việt
- Luôn hiển thị cố định bên phải màn hình

### 🔐 Hệ thống đăng nhập người dùng
- Đăng ký/đăng nhập bằng email + password
- OAuth: Google, Microsoft (đã cấu hình)
- JWT authentication
- Quản lý hồ sơ và tùy chọn cá nhân

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18** - UI Framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **date-fns** - Date manipulation
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB + Mongoose** - Database
- **JWT** - Authentication
- **Passport** - OAuth (Google, Microsoft)
- **Bcrypt** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security
- **Morgan** - Logging
- **CORS** - Cross-origin requests

## 📦 Cài đặt

### Yêu cầu
- Node.js >= 16.x
- MongoDB >= 5.x
- npm hoặc yarn

### Clone repository
```bash
git clone <repository-url>
cd Heatmap
```

### Backend Setup
```bash
cd backend
npm install

# Tạo file .env từ .env.example
cp .env.example .env

# Cấu hình MongoDB URI và các biến môi trường khác trong .env
# Khởi động server
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install

# Tạo file .env từ .env.example
cp .env.example .env

# Khởi động development server
npm run dev
```

## 🔧 Cấu hình

### Backend Environment Variables (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/productivity-tracker
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173

# OAuth (tùy chọn)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret

# DeepSeek AI API (BẮT BUỘC cho Chatbot)
DEEPSEEK_API_URL=https://api.deepseek.com/v1
DEEPSEEK_API_KEY=your-deepseek-api-key
DEEPSEEK_MODEL=deepseek-chat
```

**Lưu ý quan trọng về DeepSeek API:**
1. Đăng ký tài khoản tại: https://platform.deepseek.com/
2. Tạo API key trong Dashboard
3. Copy API key vào file `.env`
4. DeepSeek API có giá rất rẻ (~$0.14/1M tokens) và chất lượng tốt

### Frontend Environment Variables (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Sử dụng

1. Khởi động MongoDB:
```bash
mongod
```

2. Khởi động Backend (Terminal 1):
```bash
cd backend
npm run dev
```

3. Khởi động Frontend (Terminal 2):
```bash
cd frontend
npm run dev
```

4. Truy cập ứng dụng: `http://localhost:5173`

## 📁 Cấu trúc dự án

```
Heatmap/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, Passport config
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   └── utils/           # Helper functions
│   ├── server.js            # Entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # Context providers
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user
- `GET /api/auth/google` - OAuth Google
- `GET /api/auth/microsoft` - OAuth Microsoft

### Tasks
- `GET /api/tasks` - Lấy danh sách tasks
- `POST /api/tasks` - Tạo task mới
- `GET /api/tasks/:id` - Lấy chi tiết task
- `PUT /api/tasks/:id` - Cập nhật task
- `DELETE /api/tasks/:id` - Xóa task
- `GET /api/tasks/date/:date` - Lấy tasks theo ngày

### Activities
- `GET /api/activities` - Lấy danh sách activities
- `GET /api/activities/:date` - Lấy activity theo ngày
- `GET /api/activities/heatmap/:year/:month` - Lấy dữ liệu heatmap

### Analytics
- `GET /api/analytics/weekly` - Phân tích tuần
- `GET /api/analytics/monthly/:year/:month` - Phân tích tháng
- `GET /api/analytics/trends` - Xu hướng năng suất

### Chatbot
- `POST /api/chatbot/message` - Gửi tin nhắn
- `GET /api/chatbot/suggestions` - Lấy gợi ý

## 🎨 Screenshots

_(Thêm screenshots của ứng dụng ở đây)_

## 🗺️ Lộ trình phát triển

- [x] Hệ thống đăng nhập người dùng
- [x] Bản đồ nhiệt hoạt động
- [x] Quản lý công việc
- [x] Phân tích năng suất
- [x] Chatbot cơ bản
- [ ] Tích hợp AI Agent nâng cao cho Chatbot
- [ ] Biểu đồ cột chi tiết theo priority/category
- [ ] Mở rộng màu sắc heatmap (nhiều level hơn)
- [ ] Xác thực hai lớp (2FA)
- [ ] Đồng bộ đa thiết bị
- [ ] Export báo cáo PDF/Excel
- [ ] Dark mode
- [ ] Notifications/Reminders
- [ ] Mobile app (React Native)

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng tạo issue hoặc pull request.

## 📄 License

MIT License

## 👥 Tác giả

Phát triển bởi nhkhanhyn0410

## 📧 Liên hệ

Nếu có câu hỏi hoặc góp ý, vui lòng tạo issue trên GitHub.

---

**Productivity Tracker** - Quản lý thời gian hiệu quả, nâng cao năng suất mỗi ngày! 🚀
