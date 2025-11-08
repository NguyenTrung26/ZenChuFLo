import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";

// Bảng màu Dark Mode để đồng bộ
const DARK_COLORS = {
  background: "#101727",
  textPrimary: "#FFFFFF",
  textSecondary: "#AAB4C3",
  accent: "#3498db",
  warning: "#f39c12", // Màu cho InfoBox
  border: "#344054",
};

// --- Components Con ---

export const Title = ({ children }: { children: React.ReactNode }) => (
  <Text style={styles.title}>{children}</Text>
);

export const SubTitle = ({ children }: { children: React.ReactNode }) => (
  <Text style={styles.subTitle}>{children}</Text>
);

export const Paragraph = ({ children }: { children: React.ReactNode }) => (
  <Text style={styles.paragraph}>{children}</Text>
);

export const Highlight = ({ children }: { children: React.ReactNode }) => (
  <Text style={styles.highlight}>{children}</Text>
);

// ListItem giờ đây có thể nhận icon
export const ListItem = ({
  icon,
  children,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
}) => (
  <View style={styles.listItemContainer}>
    <Ionicons
      name={icon}
      size={20}
      color={DARK_COLORS.accent}
      style={styles.listItemIcon}
    />
    <Text style={styles.listItemText}>{children}</Text>
  </View>
);

// Component mới cho các thông báo quan trọng
export const InfoBox = ({
  icon,
  children,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
}) => (
  <View style={styles.infoBoxContainer}>
    <Ionicons
      name={icon}
      size={24}
      color={DARK_COLORS.warning}
      style={styles.infoBoxIcon}
    />
    <Text style={styles.infoBoxText}>{children}</Text>
  </View>
);

// --- Component Chính ---

const StaticScreen = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DARK_COLORS.background },
  scrollContent: { paddingHorizontal: 24, paddingVertical: 20 },
  title: {
    fontSize: FONT_SIZES.h1,
    fontWeight: FONT_WEIGHTS.bold,
    color: DARK_COLORS.textPrimary,
    marginBottom: 8,
  },
  subTitle: {
    fontSize: FONT_SIZES.h2,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: DARK_COLORS.textPrimary,
    marginTop: 24,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: DARK_COLORS.border,
    paddingBottom: 8,
  },
  paragraph: {
    fontSize: FONT_SIZES.body,
    color: DARK_COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: 16,
  },
  highlight: {
    color: DARK_COLORS.accent,
    fontWeight: FONT_WEIGHTS.semiBold,
  },
  listItemContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  listItemIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  listItemText: {
    flex: 1,
    fontSize: FONT_SIZES.body,
    color: DARK_COLORS.textSecondary,
    lineHeight: 22,
  },
  infoBoxContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(243, 156, 18, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: DARK_COLORS.warning,
  },
  infoBoxIcon: {
    marginRight: 12,
  },
  infoBoxText: {
    flex: 1,
    color: DARK_COLORS.textSecondary,
    fontSize: FONT_SIZES.caption,
    lineHeight: 20,
  },
});

export default StaticScreen;
