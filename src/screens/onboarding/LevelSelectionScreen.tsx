// src/screens/onboarding/LevelSelectionScreen.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { OnboardingStackParamList } from "../../navigation/types";
import { useOnboardingStore, Level } from "../../store/onboardingStore";
import { COLORS } from "../../constants/colors";
import Button from "../../components/common/Button";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import { Ionicons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<OnboardingStackParamList, "Level">;

const levels: { key: Level; title: string; subtitle: string; icon: string }[] =
  [
    {
      key: "beginner",
      title: "Người mới",
      subtitle: "Tôi mới bắt đầu",
      icon: "🌱",
    },
    {
      key: "intermediate",
      title: "Trung bình",
      subtitle: "Tôi đã có kinh nghiệm",
      icon: "🌿",
    },
    {
      key: "advanced",
      title: "Nâng cao",
      subtitle: "Tôi là một chuyên gia",
      icon: "🌳",
    },
  ];

const LevelSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const { level: selectedLevel, setLevel } = useOnboardingStore();

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back-outline" size={28} color={COLORS.charcoal} />
      </TouchableOpacity>

      <Text style={styles.title}>Trình độ của bạn? 🏋️‍♀️</Text>
      <Text style={styles.progress}>Bước 2/3</Text>

      <View style={styles.optionsContainer}>
        {levels.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.optionCard,
              selectedLevel === item.key && styles.selectedCard,
            ]}
            onPress={() => setLevel(item.key)}
          >
            <Text style={styles.optionIcon}>{item.icon}</Text>
            <View>
              <Text style={styles.optionText}>{item.title}</Text>
              <Text style={styles.optionSubtitle}>{item.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        title="Tiếp tục"
        onPress={() => navigation.navigate("Duration")}
        disabled={!selectedLevel}
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
  optionsContainer: {
    width: "100%",
    flex: 1,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedCard: {
    borderColor: COLORS.deepPurple,
    backgroundColor: "#F3E5F5", // a lighter purple
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  optionText: {
    fontSize: FONT_SIZES.h2,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.charcoal,
  },
  optionSubtitle: {
    fontSize: FONT_SIZES.caption,
    color: COLORS.lightGray,
  },
  button: {
    width: "100%",
    marginTop: 20,
  },
});

export default LevelSelectionScreen;
