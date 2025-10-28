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
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../navigation/types";
import { COLORS } from "../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import Button from "../../components/common/Button";
import {
  registerForPushNotificationsAsync,
  checkNotificationPermission,
  scheduleDailyNotification,
  cancelAllNotifications,
} from "../../services/notifications";

const REMINDER_KEY = "@YogaApp:reminders";

type Props = NativeStackScreenProps<ProfileStackParamList, "Reminders">;

const RemindersScreen: React.FC<Props> = ({ navigation }) => {
  const [isReminderEnabled, setIsReminderEnabled] = useState(false);
  const [time, setTime] = useState(new Date(new Date().setHours(7, 0, 0)));
  const [showPicker, setShowPicker] = useState(Platform.OS === "ios");

  // Load cài đặt đã lưu khi mở màn hình
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

    // Đăng ký push notification token ngay khi mở màn hình (background)
    registerForPushNotificationsAsync();
  }, []);

  // Xử lý khi người dùng thay đổi giờ
  const onChangeTime = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (event.type === "set" && selectedDate) {
      setTime(selectedDate);
    }
  };

  // Xử lý khi bật/tắt công tắc nhắc nhở
  const handleToggleSwitch = async (value: boolean) => {
    if (value) {
      // Kiểm tra quyền nhanh (không đăng ký lại)
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

  // Format thời gian hiển thị (ví dụ: 07:05)
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Xử lý khi nhấn nút Lưu Cài đặt - TỐI ƯU TỐC ĐỘ
  const handleSaveChanges = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const hour = time.getHours();
    const minute = time.getMinutes();

    if (isReminderEnabled) {
      console.log(`🔔 Đang lưu nhắc nhở: ${formatTime(time)}`);

      // Hiển thị thông báo thành công NGAY LẬP TỨC
      Alert.alert(
        "✅ Đã lưu",
        `Nhắc nhở hàng ngày của bạn đã được đặt vào lúc ${formatTime(time)}.`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );

      // Xử lý lưu và schedule trong background (không chờ)
      (async () => {
        try {
          console.log("📝 Bắt đầu lưu vào AsyncStorage...");
          await AsyncStorage.setItem(
            REMINDER_KEY,
            JSON.stringify({ enabled: true, hour, minute })
          );
          console.log("✅ Đã lưu vào AsyncStorage");

          console.log("⏰ Bắt đầu schedule notification...");
          await scheduleDailyNotification(hour, minute);
          console.log("✅ Đã schedule notification thành công");
        } catch (error) {
          console.error("❌ Lỗi khi lưu trong background:", error);
        }
      })();
    } else {
      console.log("🔕 Đang tắt nhắc nhở...");

      // Hiển thị thông báo NGAY LẬP TỨC
      Alert.alert("🔕 Đã tắt", "Tất cả nhắc nhở đã được hủy.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);

      // Xử lý hủy trong background (không chờ)
      (async () => {
        try {
          console.log("🗑️ Đang xóa khỏi AsyncStorage...");
          await AsyncStorage.removeItem(REMINDER_KEY);
          console.log("✅ Đã xóa khỏi AsyncStorage");

          console.log("🚫 Đang hủy tất cả notifications...");
          await cancelAllNotifications();
          console.log("✅ Đã hủy tất cả notifications");
        } catch (error) {
          console.error("❌ Lỗi khi hủy trong background:", error);
        }
      })();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>⏰ Nhắc nhở tập luyện</Text>
      <Text style={styles.subtitle}>Đặt lịch để không bỏ lỡ buổi tập nào.</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Bật nhắc nhở hàng ngày</Text>
        <Switch
          trackColor={{ false: "#ccc", true: COLORS.sageGreen }}
          thumbColor={isReminderEnabled ? COLORS.deepPurple : "#f4f3f4"}
          onValueChange={handleToggleSwitch}
          value={isReminderEnabled}
        />
      </View>

      {isReminderEnabled && (
        <View style={styles.timePickerContainer}>
          <Text style={styles.label}>Chọn thời gian</Text>

          {Platform.OS === "android" && (
            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              style={styles.timeDisplay}
            >
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
            />
          )}
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="Lưu cài đặt"
          onPress={handleSaveChanges}
          gradient
          haptic="success"
        />
      </View>
    </SafeAreaView>
  );
};

export default RemindersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.creamWhite,
    padding: 20,
  },
  header: {
    fontSize: FONT_SIZES.h1,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.charcoal,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: FONT_SIZES.body,
    color: COLORS.lightGray,
    textAlign: "center",
    marginBottom: 40,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  label: {
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.charcoal,
  },
  timePickerContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
  },
  timeDisplay: {
    marginTop: 15,
    paddingVertical: 12,
    backgroundColor: COLORS.warmGray,
    borderRadius: 10,
    alignItems: "center",
  },
  timeText: {
    fontSize: FONT_SIZES.h2,
    color: COLORS.deepPurple,
    fontWeight: FONT_WEIGHTS.bold,
  },
  buttonContainer: {
    marginTop: "auto",
    paddingBottom: 20,
  },
});
