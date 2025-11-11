// src/screens/profile/ProfileScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useUserStore } from "../../store/userStore";
import { signOut } from "../../services/firebase/auth";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../navigation/types";

// --- Bảng màu mới cho Dark Mode ---
const DARK_COLORS = {
  background: "#101727", // Xanh đen đậm
  card: "#1C2536", // Nền card
  accent: "#3498db", // Xanh dương làm điểm nhấn
  danger: "#e74c3c", // Màu đỏ cho hành động nguy hiểm
  textPrimary: "#FFFFFF", // Chữ trắng
  textSecondary: "#AAB4C3", // Chữ xám nhạt
  border: "#344054", // Màu viền
};

interface ExtendedUserProfile {
  displayName?: string;
  email?: string;
  avatar?: string;
}

// --- MenuItem Component (cập nhật màu sắc) ---
const MenuItem = ({
  icon,
  label,
  onPress,
  isLast = false, // Thêm prop để xác định item cuối cùng
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  isLast?: boolean;
}) => (
  <TouchableOpacity
    style={[styles.menuItem, isLast && styles.lastMenuItem]}
    onPress={onPress}
  >
    <View style={styles.menuLeft}>
      <Ionicons name={icon} size={22} color={DARK_COLORS.accent} />
      <Text style={styles.menuLabel}>{label}</Text>
    </View>
    <Ionicons
      name="chevron-forward-outline"
      size={20}
      color={DARK_COLORS.textSecondary}
    />
  </TouchableOpacity>
);

type Props = NativeStackScreenProps<ProfileStackParamList, "ProfileHome">;

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { profile, clearProfile } = useUserStore();
  const user = profile as ExtendedUserProfile;

  const handleSignOut = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "OK",
        onPress: async () => {
          try {
            await signOut();
            clearProfile();
          } catch (error) {
            Alert.alert("Lỗi", "Không thể đăng xuất. Vui lòng thử lại.");
          }
        },
      },
    ]);
  };

  const menuItems = [
    {
      icon: "person-outline" as const,
      label: "Chỉnh sửa hồ sơ",
      action: () => navigation.navigate("EditProfile"),
    },
    {
      icon: "notifications-outline" as const,
      label: "Nhắc nhở",
      action: () => navigation.navigate("Reminders"),
    },
    {
      icon: "heart-outline" as const,
      label: "Yêu thích",
      action: () => navigation.navigate("Favorites"),
    },
    {
      icon: "book-outline" as const,
      label: "Nhật ký của tôi",
      action: () => navigation.navigate("Journal"),
    },
    {
      icon: "document-text-outline" as const,
      label: "Điều khoản & Chính sách",
      action: () => navigation.navigate("TermsAndPolicy"),
    },
    {
      icon: "help-circle-outline" as const,
      label: "Trợ giúp & Hỗ trợ",
      action: () => navigation.navigate("HelpAndSupport"),
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tài khoản</Text>
        </View>

        {/* User Info Section */}
        <View style={styles.userInfoSection}>
          <Image
            source={
              user?.avatar
                ? { uri: user.avatar }
                : require("../../../assets/images/notification-icon.png") // Nên có ảnh mặc định
            }
            style={styles.avatar}
          />
          <Text style={styles.name}>{user?.displayName || "Người dùng"}</Text>
          <Text style={styles.email}>{user?.email || "Chưa có email"}</Text>
        </View>

        {/* Menu */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <MenuItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              onPress={item.action}
              isLast={index === menuItems.length - 1}
            />
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <Ionicons
            name="log-out-outline"
            size={22}
            color={DARK_COLORS.danger}
          />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

// --- STYLESHEET CẢI TIẾN CHO DARK MODE ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_COLORS.background,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: FONT_WEIGHTS.bold,
    color: DARK_COLORS.textPrimary,
  },
  userInfoSection: {
    alignItems: "center",
    paddingVertical: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: DARK_COLORS.accent,
    marginBottom: 16,
  },
  name: {
    fontSize: FONT_SIZES.h2,
    fontWeight: FONT_WEIGHTS.bold,
    color: DARK_COLORS.textPrimary,
  },
  email: {
    fontSize: FONT_SIZES.body,
    color: DARK_COLORS.textSecondary,
    marginTop: 6,
  },
  menuContainer: {
    backgroundColor: DARK_COLORS.card,
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DARK_COLORS.border,
    marginTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: DARK_COLORS.border,
  },
  lastMenuItem: {
    borderBottomWidth: 0, // Xóa border cho item cuối cùng
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuLabel: {
    marginLeft: 16,
    fontSize: FONT_SIZES.body,
    color: DARK_COLORS.textPrimary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginHorizontal: 20,
    backgroundColor: DARK_COLORS.card,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DARK_COLORS.border,
    marginBottom: 40,
  },
  logoutText: {
    color: DARK_COLORS.danger,
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.bold,
    marginLeft: 10,
  },
});
