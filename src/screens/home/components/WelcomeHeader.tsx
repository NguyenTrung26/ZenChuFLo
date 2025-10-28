// src/screens/home/components/WelcomeHeader.tsx

import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { auth } from "../../../services/firebase/config";
// --- THAY ĐỔI 1: Chỉ import hàm, không import type ---
import { createUserMood } from "../../../services/firebase/firestore";
// --- THAY ĐỔI 2: Import type từ nguồn tập trung ---
import { MoodValue } from "../../../types";
import * as Haptics from "expo-haptics";
import { COLORS } from "../../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../../constants/typography";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

interface WelcomeHeaderProps {
  name: string | null;
}

// Sử dụng MoodValue type ở đây
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
    // Áp dụng hiệu ứng Spring khi isSelected thay đổi
    scale.value = withSpring(isSelected ? 1.2 : 1);
    return {
      transform: [{ scale: scale.value }],
    };
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
  // Sử dụng MoodValue type ở đây
  const [selectedMood, setSelectedMood] = useState<MoodValue | null>(null);

  // Sử dụng MoodValue type ở đây
  const handleMoodSelect = async (mood: MoodValue) => {
    // Nếu người dùng nhấn lại vào mood đã chọn, không làm gì cả
    if (selectedMood === mood) return;

    const user = auth.currentUser;
    if (!user) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedMood(mood);

    const result = await createUserMood(user.uid, mood);
    if (!result.success) {
      Alert.alert("Lỗi", "Không thể lưu tâm trạng của bạn. Vui lòng thử lại.");
      setSelectedMood(null);
    }
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
  container: {
    paddingTop: 20, // Thêm padding để không dính sát viền trên
    marginBottom: 20, // Thêm khoảng cách với phần tử bên dưới
  },
  greeting: {
    fontSize: FONT_SIZES.h1, // Tăng kích thước cho nổi bật
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.charcoal,
  },
  prompt: {
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.lightGray, // Dùng màu phụ cho ít quan trọng hơn
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
    borderRadius: 28, // Bo tròn hoàn hảo
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    // Thêm shadow tinh tế hơn
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  selectedMood: {
    backgroundColor: COLORS.sageGreen,
    // Bỏ transform ở đây vì Reanimated sẽ xử lý
  },
  moodText: {
    fontSize: 28,
  },
});

export default WelcomeHeader;
