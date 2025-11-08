// src/screens/onboarding/DurationSelectionScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Dimensions,
  ScrollView, // 🟢 thêm
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import { OnboardingStackParamList } from "../../navigation/types";
import { useOnboardingStore } from "../../store/onboardingStore";
import { useUserStore } from "../../store/userStore";
import { COLORS } from "../../constants/colors";
import Button from "../../components/common/Button";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../../services/firebase/config";
import { updateUserOnboarding } from "../../services/firebase/firestore";

type Props = NativeStackScreenProps<OnboardingStackParamList, "Duration">;

const { width } = Dimensions.get("window");

const DurationSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const { goal, level, dailyDuration, setDailyDuration, reset } =
    useOnboardingStore();
  const { fetchProfile } = useUserStore();
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
      await fetchProfile(user.uid);
      reset();
      setLoading(false);
    } else {
      setLoading(false);
      Alert.alert(
        "Lưu thất bại",
        result.error || "Không thể lưu lựa chọn của bạn. Vui lòng thử lại."
      );
    }
  };

  const getDurationAdvice = () => {
    if (dailyDuration <= 10) return "Tuyệt vời cho người mới bắt đầu";
    if (dailyDuration <= 20) return "Lý tưởng để xây dựng thói quen";
    if (dailyDuration <= 30) return "Tốt cho sự tiến bộ ổn định";
    return "Thách thức cho người quyết tâm";
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background */}
      <LinearGradient
        colors={[COLORS.creamWhite, "#F0E6FF", COLORS.creamWhite]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <View style={styles.backButtonInner}>
            <Ionicons
              name="arrow-back-outline"
              size={24}
              color={COLORS.deepPurple}
            />
          </View>
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "100%" }]} />
          </View>
          <Text style={styles.progressText}>Bước 3/3</Text>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={["#9D7BF5", COLORS.deepPurple]}
            style={styles.iconGradient}
          >
            <Ionicons name="timer-outline" size={48} color="#FFFFFF" />
          </LinearGradient>
        </View>

        <Text style={styles.title}>Thời gian tập luyện</Text>
        <Text style={styles.subtitle}>mỗi ngày của bạn</Text>

        {/* Duration Card */}
        <View style={styles.durationCard}>
          <LinearGradient
            colors={["#FFFFFF", "#F8F5FF"]}
            style={styles.cardGradient}
          >
            <View style={styles.durationDisplay}>
              <Text style={styles.durationNumber}>{dailyDuration}</Text>
              <Text style={styles.durationUnit}>phút</Text>
            </View>
            <View style={styles.adviceBadge}>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={COLORS.deepPurple}
              />
              <Text style={styles.adviceText}>{getDurationAdvice()}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Slider */}
        <View style={styles.sliderSection}>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={5}
              maximumValue={60}
              step={5}
              value={dailyDuration}
              onValueChange={setDailyDuration}
              minimumTrackTintColor={COLORS.deepPurple}
              maximumTrackTintColor="#E0D5F5"
              thumbTintColor={COLORS.deepPurple}
            />
          </View>

          <View style={styles.rangeLabels}>
            <View style={styles.rangeLabel}>
              <Text style={styles.rangeLabelNumber}>5</Text>
              <Text style={styles.rangeLabelText}>Ngắn</Text>
            </View>
            <View style={styles.rangeLabel}>
              <Text style={styles.rangeLabelNumber}>60</Text>
              <Text style={styles.rangeLabelText}>Dài</Text>
            </View>
          </View>
        </View>

        {/* Suggestion */}
        <View style={styles.suggestionBox}>
          <Ionicons
            name="bulb-outline"
            size={20}
            color={COLORS.softPurple}
            style={styles.suggestionIcon}
          />
          <Text style={styles.suggestionText}>
            Gợi ý: Bắt đầu với 10-20 phút và tăng dần khi đã quen với thói quen
            tập luyện
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomContainer}>
        <Button
          title="Hoàn tất và bắt đầu"
          onPress={handleComplete}
          loading={loading}
          style={styles.button}
          gradient
          haptic="success"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.creamWhite },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
    alignItems: "center",
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backButton: { width: 44, height: 44, marginBottom: 10 },
  backButtonInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.deepPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressContainer: { alignItems: "center" },
  progressBar: {
    width: width * 0.6,
    height: 6,
    backgroundColor: "#E0D5F5",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.deepPurple,
    borderRadius: 3,
  },
  progressText: {
    fontSize: FONT_SIZES.caption,
    color: COLORS.lightGray,
    marginTop: 6,
    fontWeight: FONT_WEIGHTS.medium,
  },
  iconContainer: { marginBottom: 20 },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.deepPurple,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.charcoal,
    textAlign: "center",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.deepPurple,
    textAlign: "center",
    marginBottom: 30,
  },
  durationCard: {
    width: "100%",
    marginBottom: 30,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: COLORS.deepPurple,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  cardGradient: { padding: 24, alignItems: "center" },
  durationDisplay: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 10,
  },
  durationNumber: {
    fontSize: 60,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.deepPurple,
    lineHeight: 60,
  },
  durationUnit: {
    fontSize: 22,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.softPurple,
    marginLeft: 8,
  },
  adviceBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0E6FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  adviceText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.deepPurple,
    fontWeight: FONT_WEIGHTS.semiBold,
    marginLeft: 6,
  },
  sliderSection: { width: "100%", marginBottom: 20 },
  sliderContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    shadowColor: COLORS.deepPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  slider: { width: "100%", height: 40 },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginTop: 8,
  },
  rangeLabel: { alignItems: "center" },
  rangeLabelNumber: {
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.deepPurple,
  },
  rangeLabelText: {
    fontSize: FONT_SIZES.caption,
    color: COLORS.lightGray,
    marginTop: 2,
  },
  suggestionBox: {
    flexDirection: "row",
    backgroundColor: "#FFF9E6",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#FFE4A3",
    marginTop: 10,
  },
  suggestionIcon: { marginRight: 10, marginTop: 2 },
  suggestionText: {
    flex: 1,
    fontSize: FONT_SIZES.small,
    color: "#8B7355",
    lineHeight: 20,
    fontWeight: FONT_WEIGHTS.medium,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 8,
  },
  button: { width: "100%" },
});

export default DurationSelectionScreen;
