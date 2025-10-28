// src/screens/home/components/DailyCard.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Workout } from "../../../types";
import { COLORS } from "../../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../../constants/typography";

interface DailyCardProps {
  workout: Workout;
  onPress: () => void; // <-- Sửa cú pháp ở đây
}

const DailyCard: React.FC<DailyCardProps> = ({ workout, onPress }) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>Bài tập hôm nay</Text>
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <ImageBackground
          source={{ uri: workout.thumbnailUrl }}
          style={styles.container}
          imageStyle={{ borderRadius: 20 }}
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.6)"]}
            style={styles.gradient}
          >
            <Text style={styles.title}>{workout.title}</Text>
            <Text style={styles.details}>
              🧘 {workout.type} • {workout.durationMinutes} phút
            </Text>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Bắt đầu →</Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.h2,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.charcoal,
    marginBottom: 12,
  },
  container: {
    height: 200,
    justifyContent: "flex-end",
  },
  gradient: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 16,
    borderRadius: 20,
  },
  title: {
    fontSize: FONT_SIZES.h1,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.creamWhite,
    marginBottom: 4,
  },
  details: {
    fontSize: FONT_SIZES.body,
    color: COLORS.creamWhite,
    marginBottom: 12,
  },
  button: {
    backgroundColor: COLORS.charcoal,
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: COLORS.creamWhite,
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.bold,
  },
});

export default DailyCard;
