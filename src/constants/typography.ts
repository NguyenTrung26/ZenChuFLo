// src/constants/typography.ts

// Lưu ý: Để sử dụng custom font như 'Inter' hoặc 'Playfair Display',
// bạn cần phải tải chúng vào dự án Expo.
// Xem hướng dẫn tại: https://docs.expo.dev/develop/using-custom-fonts/
// Hiện tại, chúng ta sẽ tạm thời dùng font hệ thống.

export const FONTS = {
  // primary: 'Inter',
  // secondary: 'Playfair Display',
};

export const FONT_SIZES = {
  display: 32,
  h1: 24,
  h2: 20,
  body: 16,
  caption: 14,
  small: 12,
  xl: 22,
  lg: 18,
  md: 16,
};

export const FONT_WEIGHTS = {
  regular: "400" as const,
  semiBold: "600" as const,
  bold: "700" as const,
};
