// src/constants/colors.ts

export const COLORS = {
  // Primary Colors
  lavenderMist: "#E6E6FA",
  sageGreen: "#C8E6C9",
  peachCream: "#FFDAB9",
  skyBlue: "#E0F7FA",

  // Neutral Colors
  creamWhite: "#FFF9F0",
  warmGray: "#F5F5F5",
  charcoal: "#4A4A4A",
  lightGray: "#BDBDBD",

  // Accent Colors
  sunsetOrange: "#FFB74D",
  deepPurple: "#9575CD",
  forestGreen: "#66BB6A",
  softPurple: "#B39DDB",

  // System Colors
  white: "#FFFFFF",
  black: "#000000",
  red: "#FF4D4D",

  // Gradients
  primaryGradient: ["#E6E6FA", "#C8E6C9"],
  sunsetGradient: ["#FFDAB9", "#FFB74D"],
  oceanGradient: ["#E0F7FA", "#9575CD"],
  background: "#F9FAFB",
  textPrimary: "#333333",
};

const lightColors = {
  background: "#FFF9F0", // creamWhite
  card: "#FFFFFF",
  text: "#4A4A4A", // charcoal
  textSecondary: "#BDBDBD", // lightGray
  primary: "#9575CD", // deepPurple
  accent: "#FFB74D", // sunsetOrange
  // ... thêm các màu khác
};

const darkColors = {
  background: "#121212", // Màu nền tối tiêu chuẩn
  card: "#1E1E1E", // Màu thẻ tối
  text: "#E0E0E0", // Màu text sáng
  textSecondary: "#757575", // Màu text phụ tối
  primary: "#BB86FC", // Màu tím sáng hơn cho dark mode
  accent: "#FFB74D", // Giữ nguyên màu cam
  // ...
};
export const LIGHT_THEME = lightColors;
export const DARK_THEME = darkColors;
