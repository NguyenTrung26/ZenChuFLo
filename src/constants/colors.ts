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
};

export const DARK_COLORS = {
  background: "#0A0E27",
  surface: "#151932",
  surfaceLight: "#1E2440",
  card: "#1C2536",
  border: "#2A3150",
  text: "#E8E9F3",
  textSecondary: "#9BA1C4",
  accent: "#6C5CE7",
  accentLight: "#A29BFE",
};

const darkColors = {
  background: DARK_COLORS.background,
  card: DARK_COLORS.surface,
  text: DARK_COLORS.text,
  textSecondary: DARK_COLORS.textSecondary,
  primary: DARK_COLORS.accent,
  accent: COLORS.sunsetOrange,
};

export const LIGHT_THEME = lightColors;
export const DARK_THEME = darkColors;
