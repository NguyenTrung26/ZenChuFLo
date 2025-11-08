import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons"; // Import icon
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { ProfileStackParamList } from "../../navigation/types";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import Button from "../../components/common/Button";
import {
  registerForPushNotificationsAsync,
  checkNotificationPermission,
  scheduleDailyNotification,
  cancelAllNotifications,
} from "../../services/notifications";

const REMINDER_KEY = "@YogaApp:reminders";

// --- Bảng màu mới cho Dark Mode ---
const DARK_COLORS = {
  background: "#101727",
  card: "#1C2536",
  accent: "#3498db",
  textPrimary: "#FFFFFF",
  textSecondary: "#AAB4C3",
  border: "#344054",
};

type Props = NativeStackScreenProps<ProfileStackParamList, "Reminders">;

const RemindersScreen: React.FC<Props> = ({ navigation }) => {
  const [isReminderEnabled, setIsReminderEnabled] = useState(false);
  const [time, setTime] = useState(new Date(new Date().setHours(7, 0, 0)));
  const [showPicker, setShowPicker] = useState(Platform.OS === "ios");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem(REMINDER_KEY);
        if (savedSettings) {
          const { enabled, hour, minute } = JSON.parse(savedSettings);
          setIsReminderEnabled(enabled);
          setTime(new Date(new Date().setHours(hour, minute, 0)));
        }
      } catch (err) {
        console.error("Error loading reminder settings:", err);
      }
    };
    loadSettings();
    registerForPushNotificationsAsync();
  }, []);

  const onChangeTime = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowPicker(false);
    if (event.type === "set" && selectedDate) setTime(selectedDate);
  };

  const handleToggleSwitch = async (value: boolean) => {
    if (value) {
      const hasPermission = await checkNotificationPermission();
      if (!hasPermission) {
        Alert.alert(
          "Thiếu quyền",
          "Bạn cần cấp quyền thông báo trong Cài đặt của điện thoại để sử dụng tính năng này."
        );
        return;
      }
    }
    setIsReminderEnabled(value);
    Haptics.selectionAsync();
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleSaveChanges = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const hour = time.getHours();
    const minute = time.getMinutes();

    if (isReminderEnabled) {
      Alert.alert(
        "✅ Đã lưu",
        `Nhắc nhở hàng ngày của bạn đã được đặt vào lúc ${formatTime(time)}.`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
      (async () => {
        await AsyncStorage.setItem(
          REMINDER_KEY,
          JSON.stringify({ enabled: true, hour, minute })
        );
        await scheduleDailyNotification(hour, minute);
      })();
    } else {
      Alert.alert("🔕 Đã tắt", "Tất cả nhắc nhở đã được hủy.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
      (async () => {
        await AsyncStorage.removeItem(REMINDER_KEY);
        await cancelAllNotifications();
      })();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>⏰ Nhắc nhở tập luyện</Text>
        <Text style={styles.subtitle}>
          Thiết lập một thói quen lành mạnh và không bao giờ bỏ lỡ buổi tập.
        </Text>
      </View>

      <View style={styles.settingsCard}>
        {/* -- Bật/Tắt nhắc nhở -- */}
        <View style={styles.row}>
          <Text style={styles.label}>Bật nhắc nhở hàng ngày</Text>
          <Switch
            trackColor={{ false: DARK_COLORS.border, true: DARK_COLORS.accent }}
            thumbColor={isReminderEnabled ? DARK_COLORS.textPrimary : "#f4f3f4"}
            onValueChange={handleToggleSwitch}
            value={isReminderEnabled}
          />
        </View>

        <View style={styles.divider} />

        {/* -- Chọn thời gian -- */}
        <View
          style={[styles.timePickerRow, !isReminderEnabled && styles.disabled]}
        >
          <Text style={styles.label}>Thời gian</Text>
          {Platform.OS === "android" && (
            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              style={styles.timeDisplay}
              disabled={!isReminderEnabled}
            >
              <Ionicons
                name="time-outline"
                size={22}
                color={DARK_COLORS.accent}
              />
              <Text style={styles.timeText}>{formatTime(time)}</Text>
            </TouchableOpacity>
          )}

          {(showPicker || Platform.OS === "ios") && (
            <DateTimePicker
              value={time}
              mode="time"
              is24Hour={true}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChangeTime}
              disabled={!isReminderEnabled}
              // Style cho iOS dark mode
              textColor={DARK_COLORS.textPrimary}
            />
          )}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Lưu cài đặt"
          onPress={handleSaveChanges}
          style={{ backgroundColor: DARK_COLORS.accent }}
          textStyle={{ color: DARK_COLORS.textPrimary }}
          haptic="success"
        />
      </View>
    </SafeAreaView>
  );
};

export default RemindersScreen;

// --- STYLESHEET CẢI TIẾN CHO DARK MODE ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_COLORS.background,
    padding: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  header: {
    fontSize: FONT_SIZES.h1,
    fontWeight: FONT_WEIGHTS.bold,
    color: DARK_COLORS.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FONT_SIZES.body,
    color: DARK_COLORS.textSecondary,
    textAlign: "center",
    maxWidth: "90%",
  },
  settingsCard: {
    backgroundColor: DARK_COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DARK_COLORS.border,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  label: {
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.medium,
    color: DARK_COLORS.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: DARK_COLORS.border,
    marginHorizontal: 20,
  },
  timePickerRow: {
    padding: 20,
    ...(Platform.OS === "android" && {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    }),
  },
  disabled: {
    opacity: 0.5, // Làm mờ khi bị vô hiệu hóa
  },
  timeDisplay: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: DARK_COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: DARK_COLORS.border,
  },
  timeText: {
    fontSize: FONT_SIZES.h3,
    color: DARK_COLORS.accent,
    fontWeight: FONT_WEIGHTS.bold,
    marginLeft: 10,
  },
  buttonContainer: {
    marginTop: "auto",
    paddingBottom: 20,
  },
});
