# Hướng Dẫn Cấu Hình Gemini API Key

## Bước 1: Lấy API Key từ Google AI Studio

1. Truy cập: https://makersuite.google.com/app/apikey
2. Đăng nhập bằng tài khoản Google
3. Click **"Create API Key"**
4. Chọn project hoặc tạo project mới
5. Copy API key (dạng: `AIzaSy...`)

## Bước 2: Thêm API Key vào file .env

1. Mở file `.env` trong thư mục gốc của project
2. Thêm dòng sau (thay `YOUR_API_KEY` bằng key vừa copy):

```env
EXPO_PUBLIC_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

3. Lưu file

## Bước 3: Restart Development Server

```bash
# Dừng server hiện tại (Ctrl+C)
# Sau đó chạy lại:
npm start
```

## Kiểm tra hoạt động

1. Mở app trên điện thoại/emulator
2. Vào **Profile** → **Hồ sơ sức khỏe**
3. Nhập đầy đủ thông tin và lưu
4. Bấm **"Tạo kế hoạch cá nhân hóa"**
5. Bạn sẽ thấy:
   - Loading screen: "Đang tạo lộ trình cá nhân hóa..."
   - Sau 5-10 giây: Lộ trình 7 ngày được AI tạo ra

## Lưu ý

- **Miễn phí**: Gemini API có free tier với 60 requests/phút
- **Fallback**: Nếu API fail, app sẽ tự động dùng rule-based (không cần AI)
- **Bảo mật**: File `.env` đã được thêm vào `.gitignore`, không lo bị commit lên Git

## Troubleshooting

### Lỗi: "API key not valid"
- Kiểm tra lại API key có đúng không
- Đảm bảo không có khoảng trắng thừa
- Thử tạo API key mới

### Lỗi: "Quota exceeded"
- Bạn đã vượt quá giới hạn free tier
- Đợi 1 phút rồi thử lại
- Hoặc app sẽ tự động fallback về rule-based

### App vẫn dùng rule-based
- Kiểm tra file `.env` đã lưu chưa
- Restart lại development server
- Xóa cache: `npx expo start -c`

## Tắt AI (dùng rule-based)

Nếu muốn tắt AI và chỉ dùng rule-based:

1. Mở `src/screens/home/PersonalizedPlanScreen.tsx`
2. Tìm dòng:
```typescript
const rec = await generateRecommendations(profile.healthProfile, true);
```
3. Đổi `true` thành `false`:
```typescript
const rec = await generateRecommendations(profile.healthProfile, false);
```

---

**Chúc bạn sử dụng app thành công!** 🎉
