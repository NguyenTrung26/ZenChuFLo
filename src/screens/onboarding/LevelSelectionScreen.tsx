// src/screens/onboarding/LevelSelectionScreen.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ScrollView, // 🟢 thêm ScrollView
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { OnboardingStackParamList } from "../../navigation/types";
import { useOnboardingStore, Level } from "../../store/onboardingStore";
import { COLORS } from "../../constants/colors";
import Button from "../../components/common/Button";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import { Ionicons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<OnboardingStackParamList, "Level">;

const { width } = Dimensions.get("window");

const levels: {
  key: Level;
  title: string;
  subtitle: string;
  icon: string;
  gradient: readonly [string, string];
  benefits: string[];
}[] = [
  {
    key: "beginner",
    title: "Người mới",
    subtitle: "Tôi mới bắt đầu",
    icon: "🌱",
    gradient: ["#A7F3D0", "#6EE7B7"] as const,
    benefits: ["Bài tập cơ bản", "Hướng dẫn chi tiết"],
  },
  {
    key: "intermediate",
    title: "Trung bình",
    subtitle: "Tôi đã có kinh nghiệm",
    icon: "🌿",
    gradient: ["#93C5FD", "#60A5FA"] as const,
    benefits: ["Bài tập đa dạng", "Tăng độ khó vừa phải"],
  },
  {
    key: "advanced",
    title: "Nâng cao",
    subtitle: "Tôi là một chuyên gia",
    icon: "🌳",
    gradient: ["#C084FC", "#A855F7"] as const,
    benefits: ["Thử thách cao", "Động tác phức tạp"],
  },
];

const LevelSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const { level: selectedLevel, setLevel } = useOnboardingStore();

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Gradient */}
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
            <View style={[styles.progressFill, { width: "66%" }]} />
          </View>
          <Text style={styles.progressText}>Bước 2/3</Text>
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
            <Ionicons name="bar-chart-outline" size={48} color="#FFFFFF" />
          </LinearGradient>
        </View>

        <Text style={styles.title}>Trình độ</Text>
        <Text style={styles.subtitle}>của bạn?</Text>
        <Text style={styles.description}>
          Chọn trình độ phù hợp để có trải nghiệm tốt nhất
        </Text>

        {/* Levels List */}
        <View style={styles.optionsContainer}>
          {levels.map((item) => {
            const isSelected = selectedLevel === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.optionCard, isSelected && styles.selectedCard]}
                onPress={() => setLevel(item.key)}
                activeOpacity={0.7}
              >
                <View style={styles.cardWrapper}>
                  <View style={styles.leftSection}>
                    <LinearGradient
                      colors={
                        isSelected ? item.gradient : ["#FFFFFF", "#F8F5FF"]
                      }
                      style={styles.iconCircle}
                    >
                      <Text style={styles.optionIcon}>{item.icon}</Text>
                    </LinearGradient>
                  </View>

                  <View style={styles.middleSection}>
                    <Text style={styles.optionTitle}>{item.title}</Text>
                    <Text style={styles.optionSubtitle}>{item.subtitle}</Text>

                    <View style={styles.benefitsContainer}>
                      {item.benefits.map((benefit, idx) => (
                        <View
                          key={idx}
                          style={[
                            styles.benefitTag,
                            isSelected && styles.selectedBenefitTag,
                          ]}
                        >
                          <Text
                            style={[
                              styles.benefitText,
                              isSelected && styles.selectedBenefitText,
                            ]}
                          >
                            {benefit}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={styles.rightSection}>
                    {isSelected ? (
                      <View style={styles.selectedIndicator}>
                        <LinearGradient
                          colors={item.gradient}
                          style={styles.checkmarkGradient}
                        >
                          <Ionicons
                            name="checkmark"
                            size={20}
                            color="#FFFFFF"
                          />
                        </LinearGradient>
                      </View>
                    ) : (
                      <View style={styles.unselectedIndicator} />
                    )}
                  </View>
                </View>

                {/* Gradient Border */}
                {isSelected && (
                  <LinearGradient
                    colors={
                      [...item.gradient, item.gradient[0]] as [
                        string,
                        string,
                        string
                      ]
                    }
                    style={styles.selectedBorder}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={COLORS.deepPurple}
            style={styles.infoIcon}
          />
          <Text style={styles.infoText}>
            Đừng lo! Bạn có thể thay đổi trình độ bất cứ lúc nào trong cài đặt
          </Text>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomContainer}>
        <Button
          title="Tiếp tục"
          onPress={() => navigation.navigate("Duration")}
          disabled={!selectedLevel}
          style={styles.button}
          gradient
          haptic="light"
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
    paddingBottom: 40,
    alignItems: "center",
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backButton: { width: 44, height: 44, marginBottom: 20 },
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
  iconContainer: { marginBottom: 24 },
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
    marginBottom: 10,
  },
  description: {
    fontSize: FONT_SIZES.body,
    color: COLORS.lightGray,
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 22,
  },
  optionsContainer: { width: "100%", marginBottom: 24 },
  optionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: COLORS.deepPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  selectedCard: {
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    transform: [{ scale: 1.01 }],
  },
  cardWrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  leftSection: { marginRight: 16 },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  optionIcon: { fontSize: 32 },
  middleSection: { flex: 1 },
  optionTitle: {
    fontSize: FONT_SIZES.h2,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.charcoal,
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: FONT_SIZES.body,
    color: COLORS.lightGray,
    marginBottom: 8,
  },
  benefitsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  benefitTag: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedBenefitTag: { backgroundColor: "#E9D5FF" },
  benefitText: {
    fontSize: FONT_SIZES.caption,
    color: COLORS.lightGray,
    fontWeight: FONT_WEIGHTS.medium,
  },
  selectedBenefitText: { color: COLORS.deepPurple },
  rightSection: { marginLeft: 12 },
  selectedIndicator: { width: 32, height: 32 },
  checkmarkGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  unselectedIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  selectedBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    padding: 2,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#EEF2FF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#C7D2FE",
    width: "100%",
  },
  infoIcon: { marginRight: 12, marginTop: 2 },
  infoText: {
    flex: 1,
    fontSize: FONT_SIZES.small,
    color: "#4C1D95",
    lineHeight: 20,
    fontWeight: FONT_WEIGHTS.medium,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 8,
    backgroundColor: COLORS.creamWhite,
  },
  button: { width: "100%" },
});

export default LevelSelectionScreen;
