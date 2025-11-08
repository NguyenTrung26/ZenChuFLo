// src/components/common/EmptyState.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap; // Tên icon từ Ionicons
  title: string;
  message: string;
  iconColor?: string;
  titleColor?: string;
  messageColor?: string;
}
const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  message,
  iconColor,
  titleColor,
  messageColor,
}) => {
  return (
    <View style={styles.container}>
      <Ionicons
        name={icon}
        size={80}
        color={iconColor || COLORS.warmGray} // dùng iconColor nếu có
        style={styles.icon}
      />
      <Text style={[styles.title, { color: titleColor || COLORS.charcoal }]}>
        {title}
      </Text>
      <Text
        style={[styles.message, { color: messageColor || COLORS.warmGray }]}
      >
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: COLORS.creamWhite,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: FONT_SIZES.h2,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.charcoal,
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: FONT_SIZES.body,
    color: COLORS.warmGray, // Đã sửa từ gray thành warmGray
    textAlign: "center",
    lineHeight: 22,
  },
});

export default EmptyState;
