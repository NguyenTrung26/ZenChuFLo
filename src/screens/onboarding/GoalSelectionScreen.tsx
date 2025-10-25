// src/screens/onboarding/GoalSelectionScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useOnboardingStore, Goal } from "../../store/onboardingStore";
import { COLORS } from "../../constants/colors";
import Button from "../../components/common/Button";

// Tạo type nếu chưa có trong navigation/types.ts
export type OnboardingStackParamList = {
  Goal: undefined;
  Level: undefined;
  // Thêm các màn hình onboarding khác nếu cần
};

type Props = NativeStackScreenProps<OnboardingStackParamList, "Goal">;

const goals: { key: Goal; title: string; icon: string }[] = [
  { key: "stress", title: "Giảm Stress", icon: "😌" },
  { key: "health", title: "Tăng sức khỏe", icon: "💪" },
  { key: "sleep", title: "Ngủ ngon", icon: "😴" },
  { key: "flexibility", title: "Linh hoạt", icon: "🧘" },
];

const GoalSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const { goal: selectedGoal, setGoal } = useOnboardingStore();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Mục tiêu của bạn là gì? 🎯</Text>
      <Text style={styles.progress}>Bước 1/3</Text>

      <View style={styles.optionsContainer}>
        {goals.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.optionCard,
              selectedGoal === item.key && styles.selectedCard,
            ]}
            onPress={() => setGoal(item.key)}
          >
            <Text style={styles.optionIcon}>{item.icon}</Text>
            <Text style={styles.optionText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        title="Tiếp tục"
        onPress={() => navigation.navigate("Level")}
        disabled={!selectedGoal}
        style={styles.button}
        gradient
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.creamWhite,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.charcoal,
    textAlign: "center",
    marginBottom: 8,
  },
  progress: {
    fontSize: 14,
    color: COLORS.lightGray,
    textAlign: "center",
    marginBottom: 24,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  optionCard: {
    width: "48%",
    backgroundColor: COLORS.warmGray,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: COLORS.deepPurple,
  },
  optionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.charcoal,
    textAlign: "center",
  },
  button: {
    marginTop: 16,
  },
});

export default GoalSelectionScreen;
