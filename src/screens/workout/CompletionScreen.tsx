// src/screens/workout/CompletionScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/types";
import { COLORS } from "../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import Button from "../../components/common/Button";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../../services/firebase/config";
import {
  createSession,
  updateUserStats,
} from "../../services/firebase/firestore";

type Props = NativeStackScreenProps<HomeStackParamList, "Completion">;

const CompletionScreen: React.FC<Props> = ({ route, navigation }) => {
  const { workout } = route.params;
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleGoHome = async () => {
    if (isSaving) return;
    setIsSaving(true);

    const user = auth.currentUser;
    if (user) {
      try {
        await Promise.all([
          createSession(user.uid, workout, notes.trim() || null),
          updateUserStats(user.uid, workout.durationMinutes),
        ]);
      } catch (err) {
        console.log("Error saving session:", err);
      }
    }

    setIsSaving(false);
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, width: "100%" }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.icon}>🌸</Text>
          <Text style={styles.title}>Hoàn thành!</Text>
          <Text style={styles.subtitle}>
            Bạn đã hoàn thành bài tập {"\n"}
            <Text style={{ fontWeight: FONT_WEIGHTS.bold }}>
              {workout.title}
            </Text>
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Ionicons
                name="time-outline"
                size={24}
                color={COLORS.deepPurple}
              />
              <Text style={styles.statValue}>
                {workout.durationMinutes} phút
              </Text>
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

          {/* --- Mood --- */}
          <Text style={styles.moodPrompt}>Bạn cảm thấy thế nào?</Text>
          <View style={styles.moodsContainer}>
            {["😃", "🙂", "😐", "😔", "😢"].map((mood, index) => (
              <Text key={index} style={styles.moodIcon}>
                {mood}
              </Text>
            ))}
          </View>

          {/* --- Notes --- */}
          <Text style={styles.journalTitle}>Ghi lại cảm xúc của bạn</Text>
          <TextInput
            style={styles.textInput}
            multiline
            placeholder="Hôm nay tôi cảm thấy..."
            placeholderTextColor={COLORS.lightGray}
            value={notes}
            onChangeText={setNotes}
          />

          <Button
            title={isSaving ? "Đang lưu..." : "Về trang chủ"}
            onPress={handleGoHome}
            style={styles.button}
            gradient
            disabled={isSaving}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.creamWhite,
    alignItems: "center",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  icon: { fontSize: 60, marginBottom: 10 },
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
  statBox: { alignItems: "center" },
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
  moodIcon: { fontSize: 28 },
  journalTitle: {
    fontSize: FONT_SIZES.h2,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.charcoal,
    marginTop: 30,
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: COLORS.white,
    width: "100%",
    height: 120,
    borderRadius: 16,
    padding: 16,
    paddingTop: 16,
    fontSize: FONT_SIZES.body,
    lineHeight: 22,
    textAlignVertical: "top",
    borderColor: COLORS.lightGray,
    borderWidth: 1,
    marginBottom: 24,
  },
  button: { width: "80%", marginTop: 20 },
});

export default CompletionScreen;
