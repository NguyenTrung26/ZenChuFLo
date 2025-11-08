// src/screens/onboarding/GoalSelectionScreen.tsx
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
import { useOnboardingStore, Goal } from "../../store/onboardingStore";
import { COLORS } from "../../constants/colors";
import Button from "../../components/common/Button";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import { Ionicons } from "@expo/vector-icons";

export type OnboardingStackParamList = {
  Goal: undefined;
  Level: undefined;
  Duration: undefined;
};

type Props = NativeStackScreenProps<OnboardingStackParamList, "Goal">;

const { width } = Dimensions.get("window");

const goals: {
  key: Goal;
  title: string;
  icon: string;
  gradient: readonly [string, string];
  description: string;
}[] = [
  {
    key: "stress",
    title: "Giảm Stress",
    icon: "😌",
    gradient: ["#A78BFA", "#8B5CF6"] as const,
    description: "Thư giãn & bình yên",
  },
  {
    key: "health",
    title: "Tăng sức khỏe",
    icon: "💪",
    gradient: ["#F472B6", "#EC4899"] as const,
    description: "Khỏe mạnh hơn mỗi ngày",
  },
  {
    key: "sleep",
    title: "Ngủ ngon",
    icon: "😴",
    gradient: ["#60A5FA", "#3B82F6"] as const,
    description: "Giấc ngủ sâu & chất lượng",
  },
  {
    key: "flexibility",
    title: "Linh hoạt",
    icon: "🧘",
    gradient: ["#34D399", "#10B981"] as const,
    description: "Dẻo dai & linh hoạt",
  },
];

const GoalSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const { goal: selectedGoal, setGoal } = useOnboardingStore();

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[COLORS.creamWhite, "#F0E6FF", COLORS.creamWhite]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "33%" }]} />
          </View>
          <Text style={styles.progressText}>Bước 1/3</Text>
        </View>
      </View>

      {/* Main Content - scrollable */}
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
            <Text style={styles.mainIcon}>🎯</Text>
          </LinearGradient>
        </View>

        <Text style={styles.title}>Mục tiêu</Text>
        <Text style={styles.subtitle}>của bạn là gì?</Text>
        <Text style={styles.description}>
          Chọn mục tiêu chính để chúng tôi tùy chỉnh trải nghiệm phù hợp nhất
        </Text>

        {/* Goals Grid */}
        <View style={styles.optionsContainer}>
          {goals.map((item) => {
            const isSelected = selectedGoal === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.optionCard, isSelected && styles.selectedCard]}
                onPress={() => setGoal(item.key)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={isSelected ? item.gradient : ["#FFFFFF", "#FFFFFF"]}
                  style={styles.cardGradient}
                >
                  <View style={styles.cardContent}>
                    <View
                      style={[
                        styles.iconCircle,
                        isSelected && styles.selectedIconCircle,
                      ]}
                    >
                      <Text style={styles.optionIcon}>{item.icon}</Text>
                    </View>
                    <Text
                      style={[
                        styles.optionTitle,
                        isSelected && styles.selectedText,
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={[
                        styles.optionDescription,
                        isSelected && styles.selectedDescription,
                      ]}
                    >
                      {item.description}
                    </Text>
                  </View>

                  {isSelected && (
                    <View style={styles.checkmarkContainer}>
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="#FFFFFF"
                      />
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <Button
          title="Tiếp tục"
          onPress={() => navigation.navigate("Level")}
          disabled={!selectedGoal}
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
  mainIcon: { fontSize: 44 },
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
  optionsContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  optionCard: {
    width: "48%",
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: COLORS.deepPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  selectedCard: {
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    transform: [{ scale: 1.02 }],
  },
  cardGradient: { padding: 16, minHeight: 150 },
  cardContent: { alignItems: "center" },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F8F5FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  selectedIconCircle: { backgroundColor: "rgba(255,255,255,0.3)" },
  optionIcon: { fontSize: 34 },
  optionTitle: {
    fontSize: FONT_SIZES.h2,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.charcoal,
    textAlign: "center",
    marginBottom: 4,
  },
  selectedText: { color: "#FFFFFF" },
  optionDescription: {
    fontSize: FONT_SIZES.caption,
    color: COLORS.lightGray,
    textAlign: "center",
    lineHeight: 18,
  },
  selectedDescription: { color: "rgba(255,255,255,0.9)" },
  checkmarkContainer: { position: "absolute", top: 12, right: 12 },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 8,
  },
  button: { width: "100%" },
});

export default GoalSelectionScreen;
