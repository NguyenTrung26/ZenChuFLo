// src/screens/home/MoodJournalScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/types";
import { auth } from "../../services/firebase/config";
import { createUserMood } from "../../services/firebase/firestore";
import Button from "../../components/common/Button";
import { COLORS } from "../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import { MoodValue } from "../../types"; // đảm bảo import MoodValue

type Props = NativeStackScreenProps<HomeStackParamList, "MoodJournal">;

const MoodJournalScreen: React.FC<Props> = ({ route, navigation }) => {
  const { mood } = route.params; // Nhận mood đã chọn từ màn hình Home
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Ánh xạ giá trị mood sang emoji và text, dùng Record<MoodValue, ...> để TypeScript hiểu chắc chắn
  const moodDetails: Record<MoodValue, { emoji: string; text: string }> = {
    awesome: { emoji: "😃", text: "Tuyệt vời" },
    good: { emoji: "🙂", text: "Tốt" },
    neutral: { emoji: "😐", text: "Bình thường" },
    bad: { emoji: "😔", text: "Không ổn" },
    terrible: { emoji: "😢", text: "Tệ" },
  };

  // Kiểm tra mood hợp lệ, fallback nếu không hợp lệ
  const selectedMoodDetail = moodDetails[mood] ?? {
    emoji: "❓",
    text: "Không xác định",
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setIsSaving(true);

    const result = await createUserMood(user.uid, mood, notes.trim() || null);
    setIsSaving(false);

    if (result.success) {
      Alert.alert("Đã lưu", "Cảm xúc của bạn đã được ghi lại.");
      navigation.goBack(); // Đóng modal sau khi lưu
    } else {
      Alert.alert("Lỗi", "Không thể lưu tâm trạng của bạn. Vui lòng thử lại.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Text style={styles.moodEmoji}>{selectedMoodDetail.emoji}</Text>
          <Text style={styles.moodText}>
            Bạn đang cảm thấy: {selectedMoodDetail.text}
          </Text>

          <Text style={styles.journalTitle}>Ghi chú thêm (tùy chọn)</Text>
          <TextInput
            style={styles.textInput}
            multiline
            placeholder="Chuyện gì đang xảy ra..."
            placeholderTextColor={COLORS.lightGray}
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={isSaving ? "Đang lưu..." : "Lưu lại"}
            onPress={handleSave}
            loading={isSaving}
            disabled={isSaving}
            gradient
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.creamWhite,
  },
  keyboardView: {
    flex: 1,
    flexDirection: "column",
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  moodEmoji: {
    fontSize: 64,
    marginTop: 20,
  },
  moodText: {
    fontSize: FONT_SIZES.h1,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.charcoal,
    marginTop: 12,
  },
  journalTitle: {
    fontSize: FONT_SIZES.body,
    color: COLORS.lightGray,
    marginTop: 40,
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: COLORS.white,
    width: "100%",
    flex: 1,
    borderRadius: 16,
    padding: 16,
    paddingTop: 16,
    fontSize: FONT_SIZES.body,
    lineHeight: 22,
    textAlignVertical: "top",
    borderColor: COLORS.lightGray,
    borderWidth: 1,
  },
  buttonContainer: {
    padding: 20,
  },
});

export default MoodJournalScreen;
