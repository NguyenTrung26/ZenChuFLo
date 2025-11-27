import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { DARK_COLORS, COLORS } from "../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import Button from "../../components/common/Button";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<HomeStackParamList, "MoodJournal">;

const MOODS = [
  { value: "awesome", label: "Tuyệt vời", emoji: "🤩", color: "#FFD93D" },
  { value: "good", label: "Tốt", emoji: "😊", color: "#6BCB77" },
  { value: "neutral", label: "Bình thường", emoji: "😐", color: "#4D96FF" },
  { value: "bad", label: "Tệ", emoji: "😔", color: "#FF6B6B" },
  { value: "terrible", label: "Rất tệ", emoji: "😫", color: "#2C3E50" },
];

const screenWidth = Dimensions.get("window").width;
// Calculate mood button size based on screen width
const getMoodButtonSize = () => {
  const padding = 40; // Total horizontal padding
  const gap = 16; // Gap between buttons
  const buttonsPerRow = screenWidth < 360 ? 2 : 3; // 2 buttons on very small screens, 3 otherwise
  const totalGaps = (buttonsPerRow - 1) * gap;
  const availableWidth = screenWidth - padding - totalGaps;
  const buttonSize = Math.floor(availableWidth / buttonsPerRow);
  return Math.min(buttonSize, 110); // Max size of 110
};

const MoodJournalScreen: React.FC<Props> = ({ navigation, route }) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(
    route.params?.mood || null
  );
  const [note, setNote] = useState("");

  const handleSave = () => {
    // TODO: Save to Firestore
    console.log("Saved mood:", { mood: selectedMood, note });
    navigation.goBack();
  };

  const moodButtonSize = getMoodButtonSize();

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Hôm nay bạn cảm thấy thế nào?</Text>
            <Text style={styles.subtitle}>
              Hãy dành một chút thời gian để lắng nghe bản thân.
            </Text>
          </View>

          <View style={styles.moodContainer}>
            {MOODS.map((mood, index) => {
              const isSelected = selectedMood === mood.value;
              return (
                <MotiView
                  key={mood.value}
                  from={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: isSelected ? 1.1 : 1 }}
                  transition={{ delay: index * 100 }}
                >
                  <TouchableOpacity
                    style={[
                      styles.moodButton,
                      { width: moodButtonSize, height: moodButtonSize },
                      isSelected && {
                        backgroundColor: mood.color,
                        borderColor: mood.color,
                      },
                    ]}
                    onPress={() => setSelectedMood(mood.value)}
                  >
                    <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                    <Text
                      style={[
                        styles.moodLabel,
                        isSelected && { color: COLORS.white },
                      ]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {mood.label}
                    </Text>
                  </TouchableOpacity>
                </MotiView>
              );
            })}
          </View>

          <View style={styles.noteContainer}>
            <Text style={styles.label}>Ghi chú (tùy chọn)</Text>
            <TextInput
              style={styles.input}
              placeholder="Bạn đang nghĩ gì?..."
              placeholderTextColor={DARK_COLORS.textSecondary}
              multiline
              value={note}
              onChangeText={setNote}
              maxLength={200}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Lưu nhật ký"
            onPress={handleSave}
            disabled={!selectedMood}
            gradient
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DARK_COLORS.background },
  scrollContent: { padding: 20 },
  header: { marginBottom: 30, alignItems: "center" },
  title: {
    fontSize: FONT_SIZES.h2,
    fontWeight: FONT_WEIGHTS.bold,
    color: DARK_COLORS.text,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FONT_SIZES.body,
    color: DARK_COLORS.textSecondary,
    textAlign: "center",
  },
  moodContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
    marginBottom: 30,
  },
  moodButton: {
    borderRadius: 20,
    backgroundColor: DARK_COLORS.surface,
    borderWidth: 2,
    borderColor: DARK_COLORS.border,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  moodEmoji: { fontSize: 32, marginBottom: 8 },
  moodLabel: {
    fontSize: 12,
    fontWeight: FONT_WEIGHTS.bold,
    color: DARK_COLORS.textSecondary,
    textAlign: "center",
  },
  noteContainer: { marginBottom: 20 },
  label: {
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.bold,
    color: DARK_COLORS.text,
    marginBottom: 10,
  },
  input: {
    backgroundColor: DARK_COLORS.surface,
    borderRadius: 16,
    padding: 16,
    color: DARK_COLORS.text,
    fontSize: FONT_SIZES.body,
    height: 120,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: DARK_COLORS.border,
  },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: DARK_COLORS.border },
});

export default MoodJournalScreen;
