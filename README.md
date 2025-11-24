# Yoga Meditation App

Một ứng dụng Yoga và Thiền định được xây dựng bằng React Native và Expo.

## Yêu cầu

- Node.js (phiên bản LTS được khuyến nghị)
- npm hoặc yarn
- Thiết bị di động (có cài ứng dụng Expo Go) hoặc Máy ảo (Android Studio / Xcode)

## Cài đặt

1.  Cài đặt các gói phụ thuộc:

    ```bash
    npm install
    ```

## Chạy ứng dụng

Để khởi động máy chủ phát triển:

```bash
npm start
```

Sau đó, bạn có thể:

-   **Quét mã QR** bằng ứng dụng Expo Go trên điện thoại (Android/iOS).
-   Nhấn `a` để chạy trên máy ảo Android.
-   Nhấn `i` để chạy trên máy ảo iOS (chỉ trên macOS).
-   Nhấn `w` để chạy trên trình duyệt web.

## Cấu trúc dự án

-   `src/screens`: Các màn hình chính của ứng dụng.
-   `src/components`: Các thành phần giao diện tái sử dụng.
-   `src/navigation`: Cấu hình điều hướng.
-   `src/services`: Các dịch vụ như Firebase.
-   `src/store`: Quản lý trạng thái (Zustand).
-   `src/constants`: Màu sắc, phông chữ, và các hằng số khác.

## Các tính năng chính

-   **Home Screen**: Danh sách bài tập, trích dẫn hàng ngày, và các danh mục.
-   **Workout Detail**: Chi tiết bài tập, thêm vào yêu thích.
-   **Profile**: Quản lý thông tin người dùng, cài đặt Dark Mode.
-   **Authentication**: Đăng nhập/Đăng ký qua Firebase.
