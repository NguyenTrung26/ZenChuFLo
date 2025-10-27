import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

// ✅ Cấu hình hành vi thông báo
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // shouldShowAlert: true, // Xóa hoặc bình luận dòng này
    shouldPlaySound: true,
    shouldSetBadge: false,
    // --- THÊM CÁC THUỘC TÍNH MỚI ---
    // (Bạn có thể thêm cả hai để đảm bảo hoạt động trên cả iOS và Android)
    // iOS: Hiển thị banner ở đầu màn hình
    shouldShowBanner: true,
    // Android: Hiển thị thông báo trong danh sách
    shouldShowList: true,
  }),
});

// ✅ Biến cache để tránh đăng ký lại nhiều lần
let cachedToken: string | null = null;
let isRegistering = false;

// ✅ Đăng ký nhận thông báo đẩy (với cache)
export async function registerForPushNotificationsAsync() {
  // Trả về token đã cache nếu có
  if (cachedToken) {
    return cachedToken;
  }

  // Tránh đăng ký song song
  if (isRegistering) {
    return null;
  }

  if (!Device.isDevice) {
    console.warn("⚠️ Thông báo đẩy chỉ hoạt động trên thiết bị thật.");
    return null;
  }

  try {
    isRegistering = true;

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return null;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    cachedToken = token;
    return token;
  } catch (error) {
    console.error("Error registering for push notifications:", error);
    return null;
  } finally {
    isRegistering = false;
  }
}

// ✅ Kiểm tra quyền thông báo (nhanh, không đăng ký)
export async function checkNotificationPermission(): Promise<boolean> {
  if (!Device.isDevice) {
    return false;
  }

  const { status } = await Notifications.getPermissionsAsync();
  return status === "granted";
}

// ✅ Gửi thông báo cục bộ hàng ngày
export async function scheduleDailyNotification(hour: number, minute: number) {
  const identifier = "daily-reminder";

  // Schedule trực tiếp - identifier giống nhau sẽ tự động ghi đè
  await Notifications.scheduleNotificationAsync({
    identifier,
    content: {
      title: "🧘 Thời gian thiền định",
      body: "Hãy dành ít phút thư giãn và hít thở sâu 🌿",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      repeats: true,
    } as Notifications.DailyTriggerInput,
  });

  console.log(`Đã đặt lịch nhắc nhở '${identifier}' vào lúc ${hour}:${minute}`);
}

// ✅ Hủy tất cả thông báo
export async function cancelAllNotifications() {
  console.log("🚫 cancelAllNotifications được gọi từ:");
  console.trace(); // In ra stack trace để biết ai gọi hàm này
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log("Đã hủy tất cả thông báo");
}
