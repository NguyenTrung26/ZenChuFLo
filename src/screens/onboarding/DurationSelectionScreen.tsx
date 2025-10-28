// src/screens/onboarding/DurationSelectionScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Slider from "@react-native-community/slider";
import { OnboardingStackParamList } from "../../navigation/types";
import { useOnboardingStore } from "../../store/onboardingStore";
import { useUserStore } from "../../store/userStore"; // <-- tích hợp store
import { COLORS } from "../../constants/colors";
import Button from "../../components/common/Button";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../../services/firebase/config";
import { updateUserOnboarding } from "../../services/firebase/firestore";

type Props = NativeStackScreenProps<OnboardingStackParamList, "Duration">;

const DurationSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const { goal, level, dailyDuration, setDailyDuration, reset } =
    useOnboardingStore();
  const { fetchProfile } = useUserStore(); // <-- lấy action fetchProfile từ store
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    const user = auth.currentUser;
    if (!user || !goal || !level) {
      Alert.alert("Lỗi", "Đã xảy ra lỗi. Vui lòng thử lại từ đầu.");
      return;
    }

    setLoading(true);
    const result = await updateUserOnboarding(user.uid, {
      goal,
      level,
      dailyDuration,
    });

    if (result.success) {
      // --- QUAN TRỌNG ---
      // Fetch lại profile từ store sau khi DB cập nhật thành công
      await fetchProfile(user.uid);

      // Reset dữ liệu onboarding local
      reset();
      setLoading(false);

      // AppRouter sẽ tự động nhận profile mới và chuyển sang MainNavigator
    } else {
      setLoading(false);
      Alert.alert(
        "Lưu thất bại",
        result.error || "Không thể lưu lựa chọn của bạn. Vui lòng thử lại."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back-outline" size={28} color={COLORS.charcoal} />
      </TouchableOpacity>

      <Text style={styles.title}>Bạn muốn tập bao lâu mỗi ngày? ⏱️</Text>
      <Text style={styles.progress}>Bước 3/3</Text>

      <View style={styles.sliderContainer}>
        <Text style={styles.durationText}>{dailyDuration} phút</Text>
        <Text style={styles.suggestionText}>
          Gợi ý: 10-20 phút mỗi ngày là lý tưởng cho người mới.
        </Text>

        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={5}
          maximumValue={60}
          step={5}
          value={dailyDuration}
          onValueChange={setDailyDuration}
          minimumTrackTintColor={COLORS.deepPurple}
          maximumTrackTintColor={COLORS.lightGray}
          thumbTintColor={COLORS.deepPurple}
        />
      </View>

      <Button
        title="Hoàn tất"
        onPress={handleComplete}
        loading={loading}
        style={styles.button}
        gradient
        haptic="success"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.creamWhite,
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: FONT_SIZES.display,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.charcoal,
    textAlign: "center",
    marginTop: 80,
  },
  progress: {
    fontSize: FONT_SIZES.body,
    color: COLORS.lightGray,
    marginBottom: 40,
  },
  sliderContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  durationText: {
    fontSize: 48,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.deepPurple,
  },
  suggestionText: {
    fontSize: FONT_SIZES.caption,
    color: COLORS.lightGray,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 40,
  },
  button: {
    width: "100%",
    marginTop: 20,
  },
});

export default DurationSelectionScreen;
