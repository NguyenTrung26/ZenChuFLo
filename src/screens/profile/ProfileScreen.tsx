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
import { COLORS } from "../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../navigation/types";

interface ExtendedUserProfile {
  displayName?: string;
  email?: string;
  avatar?: string;
}

const MenuItem = ({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuLeft}>
      <Ionicons name={icon} size={22} color={COLORS.deepPurple} />
      <Text style={styles.menuLabel}>{label}</Text>
    </View>
    <Ionicons
      name="chevron-forward-outline"
      size={18}
      color={COLORS.warmGray}
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={
              user?.avatar
                ? { uri: user.avatar }
                : require("../../../assets/images/notification-icon.png")
            }
            style={styles.avatar}
          />
          <Text style={styles.name}>{user?.displayName || "Người dùng"}</Text>
          <Text style={styles.email}>{user?.email || "Chưa có email"}</Text>
        </View>

        {/* Menu */}
        <View style={styles.menuContainer}>
          <MenuItem
            icon="person-outline"
            label="Chỉnh sửa hồ sơ"
            onPress={() => navigation.navigate("EditProfile")}
          />
          <MenuItem
            icon="notifications-outline"
            label="Nhắc nhở"
            onPress={() => navigation.navigate("Reminders")}
          />
          <MenuItem icon="heart-outline" label="Yêu thích" onPress={() => {}} />
          <MenuItem
            icon="document-text-outline"
            label="Điều khoản & Chính sách"
            onPress={() => {}}
          />
          <MenuItem
            icon="help-circle-outline"
            label="Trợ giúp & Hỗ trợ"
            onPress={() => {}}
          />
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <Ionicons
            name="log-out-outline"
            size={20}
            color={COLORS.sunsetOrange}
          />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.creamWhite,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: COLORS.deepPurple,
    marginBottom: 10,
  },
  name: {
    fontSize: FONT_SIZES.h2,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.deepPurple,
  },
  email: {
    fontSize: FONT_SIZES.caption,
    color: COLORS.warmGray,
    marginTop: 4,
  },
  menuContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuLabel: {
    marginLeft: 12,
    fontSize: FONT_SIZES.body,
    color: COLORS.charcoal,
    fontWeight: FONT_WEIGHTS.semiBold,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    backgroundColor: "#fff",
    paddingVertical: 12,
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  logoutText: {
    color: COLORS.sunsetOrange,
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.semiBold,
    marginLeft: 8,
  },
});
