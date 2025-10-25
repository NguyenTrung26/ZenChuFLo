// src/screens/home/components/WelcomeHeader.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "../../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../../constants/typography";

interface WelcomeHeaderProps {
  name: string | null;
}

const moods = ["😃", "🙂", "😐", "😔", "😢"];

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ name }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Chào buổi sáng, {name || "bạn"} 🌿</Text>
      <Text style={styles.prompt}>Hôm nay bạn cảm thấy thế nào?</Text>
      <View style={styles.moodsContainer}>
        {moods.map((mood, index) => (
          <TouchableOpacity key={index} style={styles.mood}>
            <Text style={styles.moodText}>{mood}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.creamWhite,
  },
  greeting: {
    fontSize: FONT_SIZES.h1, // dùng h1 thay cho large
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.charcoal,
    marginBottom: 8,
  },
  prompt: {
    fontSize: FONT_SIZES.body,
    color: COLORS.lightGray,
    marginBottom: 16,
  },
  moodsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mood: {
    backgroundColor: COLORS.warmGray,
    padding: 12,
    borderRadius: 12,
  },
  moodText: {
    fontSize: FONT_SIZES.h1, // dùng h1 thay cho large
  },
});

export default WelcomeHeader;
