import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useUserStore } from "../../store/userStore";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { COLORS } from "../../constants/colors";
import { uploadImageAndGetURL } from "../../services/firebase/storage";
import { updateUserProfile } from "../../services/firebase/firestore";
import { auth } from "../../services/firebase/config";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../navigation/types";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";

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

    // 1️⃣ Upload ảnh nếu có thay đổi
    if (imageUri && imageUri !== user?.avatar) {
      setIsUploading(true);
      const path = `avatars/${currentUser.uid}/${Date.now()}.jpg`;
      const uploadedUrl = await uploadImageAndGetURL(imageUri, path);
      if (uploadedUrl) newAvatar = uploadedUrl;
      setIsUploading(false);
    }

    // 2️⃣ Cập nhật tên nếu có thay đổi
    if (displayName.trim() && displayName.trim() !== user?.displayName) {
      newDisplayName = displayName.trim();
    }

    // 3️⃣ Gửi dữ liệu lên Firestore
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
    <SafeAreaView style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={
            imageUri
              ? { uri: imageUri }
              : require("../../../assets/images/notification-icon.png")
          }
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.editButton} onPress={handleSelectImage}>
          <Text style={styles.editButtonText}>Thay đổi ảnh</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <Input
          label="Tên hiển thị"
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Tên của bạn"
        />
        <Input
          label="Email"
          value={user?.email || ""}
          onChangeText={() => {}}
          editable={false}
        />
      </View>

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
        gradient
      />
    </SafeAreaView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.creamWhite,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLORS.deepPurple,
  },
  editButton: {
    marginTop: 12,
    backgroundColor: COLORS.deepPurple,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: "#fff",
    fontSize: FONT_SIZES.caption,
    fontWeight: FONT_WEIGHTS.semiBold,
  },
  formContainer: {
    marginTop: 40,
    gap: 16,
  },
});
