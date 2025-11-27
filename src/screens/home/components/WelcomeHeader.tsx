// src/screens/home/components/WelcomeHeader.tsx

import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../../navigation/types";
import { MoodValue } from "../../../types";
import * as Haptics from "expo-haptics";
import { DARK_COLORS } from "../../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../../constants/typography";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { TouchableOpacity } from "react-native-gesture-handler";

interface WelcomeHeaderProps {
  name: string | null;
}

// Định nghĩa kiểu cho navigation hook
type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

// Mảng mood
const moods: { emoji: string; value: MoodValue }[] = [
  { emoji: "😃", value: "awesome" },
  { emoji: "🙂", value: "good" },
  { emoji: "😐", value: "neutral" },
  { emoji: "😔", value: "bad" },
  { emoji: "😢", value: "terrible" },
];

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const MoodButton = ({
  emoji,
  value,
  isSelected,
  onSelect,
}: {
  emoji: string;
  value: MoodValue;
  isSelected: boolean;
  onSelect: (mood: MoodValue) => void;
}) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    scale.value = withSpring(isSelected ? 1.2 : 1);
    return { transform: [{ scale: scale.value }] };
  });

  return (
    <AnimatedTouchableOpacity
      style={[styles.mood, isSelected && styles.selectedMood, animatedStyle]}
      onPress={() => onSelect(value)}
    >
      <Text style={styles.moodText}>{emoji}</Text>
    </AnimatedTouchableOpacity>
  );
};

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ name }) => {
  const [selectedMood, setSelectedMood] = useState<MoodValue | null>(null);
  const navigation = useNavigation<NavigationProp>();

  const handleMoodSelect = (mood: MoodValue) => {
    if (selectedMood === mood) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedMood(mood);

    // Điều hướng sang màn hình MoodJournal để nhập notes
    navigation.navigate("MoodJournal", { mood });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Chào buổi sáng, {name || "bạn"} 🌿</Text>
      <Text style={styles.prompt}>Hôm nay bạn cảm thấy thế nào?</Text>

      <View style={styles.moodsContainer}>
        {moods.map(({ emoji, value }) => (
          <MoodButton
            key={value}
            emoji={emoji}
            value={value}
            isSelected={selectedMood === value}
            onSelect={handleMoodSelect}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingTop: 20, marginBottom: 20 },
  greeting: {
    fontSize: FONT_SIZES.h1,
    fontWeight: FONT_WEIGHTS.bold,
    color: DARK_COLORS.text,
  },
  prompt: {
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.regular,
    color: DARK_COLORS.textSecondary,
    marginTop: 4,
  },
  moodsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 24,
  },
  mood: {
    padding: 10,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: DARK_COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: DARK_COLORS.border,
  },
  selectedMood: {
    backgroundColor: DARK_COLORS.accent,
    borderColor: DARK_COLORS.accent,
  },
  moodText: { fontSize: 28 },
});

export default WelcomeHeader;
