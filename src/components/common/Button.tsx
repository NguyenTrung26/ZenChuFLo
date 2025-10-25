// src/components/common/Button.tsx

import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  disabled?: boolean;
  gradient?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  gradient = false,
  style,
  textStyle,
}) => {
  const isPrimary = variant === "primary";

  // đảm bảo không undefined
  const buttonStyles: ViewStyle[] = [
    styles.base,
    styles[size],
    styles[variant],
    style || {},
  ];
  const textStyles: TextStyle[] = [
    styles.textBase,
    styles[`text_${variant}`],
    textStyle || {},
  ];

  if (disabled || loading) {
    buttonStyles.push(styles.disabled);
  }

  const content = loading ? (
    <ActivityIndicator color={isPrimary ? COLORS.white : COLORS.charcoal} />
  ) : (
    <Text style={textStyles}>{title}</Text>
  );

  // LinearGradient chỉ áp dụng cho primary và không disabled
  if (gradient && isPrimary && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={COLORS.sunsetGradient as [string, string, ...string[]]} // ép kiểu tuple
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.base, styles[size], style || {}]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={buttonStyles}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  disabled: {
    opacity: 0.6,
  },
  // Sizes
  small: { height: 40 },
  medium: { height: 50 },
  large: { height: 60 },
  // Variants
  primary: {
    backgroundColor: COLORS.sunsetOrange,
  },
  secondary: {
    backgroundColor: COLORS.warmGray,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  // Text styles
  textBase: {
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.semiBold,
  },
  text_primary: {
    color: COLORS.white,
  },
  text_secondary: {
    color: COLORS.charcoal,
  },
  text_outline: {
    color: COLORS.charcoal,
  },
});

export default Button;
