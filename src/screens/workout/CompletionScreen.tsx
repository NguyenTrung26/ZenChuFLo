// src/screens/workout/CompletionScreen.tsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/types";
import { COLORS } from "../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import Button from "../../components/common/Button";
import { Ionicons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<HomeStackParamList, "Completion">;

const CompletionScreen: React.FC<Props> = ({ route, navigation }) => {
  const { workout } = route.params;

  const handleGoHome = () => {
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.icon}>🌸</Text>
      <Text style={styles.title}>Hoàn thành!</Text>
      <Text style={styles.subtitle}>
        Bạn đã hoàn thành bài tập {"\n"}
        <Text style={{ fontWeight: FONT_WEIGHTS.bold }}>{workout.title}</Text>
      </Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Ionicons name="time-outline" size={24} color={COLORS.deepPurple} />
          <Text style={styles.statValue}>{workout.durationMinutes} phút</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons
            name="flame-outline"
            size={24}
            color={COLORS.sunsetOrange}
          />
          <Text style={styles.statValue}>12 calories*</Text>
        </View>
      </View>

      <Text style={styles.moodPrompt}>Bạn cảm thấy thế nào?</Text>
      <View style={styles.moodsContainer}>
        {["😃", "🙂", "😐", "😔", "😢"].map((mood, index) => (
          <Text key={index} style={styles.moodIcon}>
            {mood}
          </Text>
        ))}
      </View>

      <Button
        title="Về trang chủ"
        onPress={handleGoHome}
        style={styles.button}
        gradient
      />
    </SafeAreaView>
  );
};

export default CompletionScreen;

// =====================
// 🎨 STYLES
// =====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.creamWhite,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  icon: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: FONT_SIZES.h1,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.deepPurple,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FONT_SIZES.body,
    color: COLORS.warmGray,
    textAlign: "center",
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 24,
  },
  statBox: {
    alignItems: "center",
  },
  statValue: {
    fontSize: FONT_SIZES.body,
    color: COLORS.charcoal,
    marginTop: 6,
  },
  moodPrompt: {
    fontSize: FONT_SIZES.body,
    color: COLORS.warmGray,
    marginBottom: 8,
  },
  moodsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginBottom: 30,
  },
  moodIcon: {
    fontSize: 28,
  },
  button: {
    width: "80%",
  },
});
