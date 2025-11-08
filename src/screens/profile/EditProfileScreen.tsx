import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Import icon

import { useUserStore } from "../../store/userStore";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { uploadImageAndGetURL } from "../../services/firebase/storage";
import { updateUserProfile } from "../../services/firebase/firestore";
import { auth } from "../../services/firebase/config";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../navigation/types";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";

// --- Bảng màu mới cho Dark Mode ---
const DARK_COLORS = {
  background: "#101727", // Xanh đen đậm
  card: "#1C2536", // Nền card
  accent: "#3498db", // Xanh dương làm điểm nhấn
  textPrimary: "#FFFFFF", // Chữ trắng
  textSecondary: "#AAB4C3", // Chữ xám nhạt
  border: "#344054", // Màu viền
};

type Props = NativeStackScreenProps<ProfileStackParamList, "EditProfile">;

interface ExtendedUserProfile {
  displayName?: string;
  email?: string;
  avatar?: string;
}

const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { profile, fetchProfile } = useUserStore();
  const user = profile as ExtendedUserProfile;

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [imageUri, setImageUri] = useState<string | null>(user?.avatar || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSelectImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Cần cấp quyền",
        "Bạn cần cấp quyền truy cập thư viện ảnh để thay đổi ảnh đại diện."
      );
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (pickerResult.canceled) return;
    setImageUri(pickerResult.assets[0].uri);
  };

  const handleSaveChanges = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    setIsSaving(true);
    let newAvatar = user?.avatar;
    let newDisplayName = user?.displayName;
    if (imageUri && imageUri !== user?.avatar) {
      setIsUploading(true);
      const path = `avatars/${currentUser.uid}/${Date.now()}.jpg`;
      const uploadedUrl = await uploadImageAndGetURL(imageUri, path);
      if (uploadedUrl) newAvatar = uploadedUrl;
      setIsUploading(false);
    }
    if (displayName.trim() && displayName.trim() !== user?.displayName) {
      newDisplayName = displayName.trim();
    }
    const dataToUpdate = {
      displayName: newDisplayName || "",
      avatar: newAvatar || "",
    };
    const result = await updateUserProfile(currentUser.uid, dataToUpdate);
    if (result.success) {
      await fetchProfile(currentUser.uid);
      Alert.alert("✅ Thành công", "Hồ sơ của bạn đã được cập nhật.");
      navigation.goBack();
    } else {
      Alert.alert("❌ Lỗi", "Không thể cập nhật hồ sơ. Vui lòng thử lại.");
    }
    setIsSaving(false);
  };

  const isLoading = isUploading || isSaving;

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
          </View>

          <View style={styles.avatarSection}>
            <TouchableOpacity
              onPress={handleSelectImage}
              style={styles.avatarContainer}
            >
              <Image
                source={
                  imageUri
                    ? { uri: imageUri }
                    : require("../../../assets/images/notification-icon.png") // Nên có ảnh mặc định
                }
                style={styles.avatar}
              />
              <View style={styles.editIconContainer}>
                <MaterialCommunityIcons
                  name="camera-outline"
                  size={22}
                  color={DARK_COLORS.textPrimary}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.formSection}>
            <Input
              label="Tên hiển thị"
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Tên của bạn"
              // Các props style này có thể cần được thêm vào component Input của bạn
              labelStyle={{ color: DARK_COLORS.textSecondary }}
              inputStyle={{ color: DARK_COLORS.textPrimary }}
              containerStyle={{ backgroundColor: DARK_COLORS.card }}
            />
            <Input
              label="Email"
              value={user?.email || ""}
              editable={false}
              labelStyle={{ color: DARK_COLORS.textSecondary }}
              inputStyle={{ color: DARK_COLORS.textSecondary }} // Email không thể sửa
              containerStyle={{ backgroundColor: DARK_COLORS.card }}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title={
                isUploading
                  ? "Đang tải ảnh..."
                  : isSaving
                  ? "Đang lưu..."
                  : "Lưu thay đổi"
              }
              onPress={handleSaveChanges}
              loading={isLoading}
              disabled={isLoading}
              // Giả sử Button của bạn có thể nhận style hoặc colors
              // Nếu không, bạn có thể cần tùy chỉnh component Button
              style={{ backgroundColor: DARK_COLORS.accent }}
              textStyle={{ color: DARK_COLORS.textPrimary }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;

// --- STYLESHEET CẢI TIẾN CHO DARK MODE ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    paddingVertical: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: FONT_WEIGHTS.bold,
    color: DARK_COLORS.textPrimary,
  },
  avatarSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: DARK_COLORS.accent, // Viền màu nhấn
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: DARK_COLORS.accent,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: DARK_COLORS.background,
  },
  formSection: {
    backgroundColor: DARK_COLORS.card,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: DARK_COLORS.border,
    gap: 16, // Khoảng cách giữa các input
  },
  buttonContainer: {
    marginTop: 40,
  },
});
