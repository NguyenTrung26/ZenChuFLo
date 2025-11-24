// src/screens/progress/ProgressScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { format, subDays } from "date-fns";
import { vi } from "date-fns/locale";

import { useUserStore } from "../../store/userStore";
import { getUserSessionsLast7Days } from "../../services/firebase/firestore";
// Bảng màu mới cho Dark Mode
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";

const screenWidth = Dimensions.get("window").width;

// --- Bảng màu mới cho Dark Mode ---
const DARK_COLORS = {
  background: "#101727", // Xanh đen đậm
  card: "#1C2536", // Nền card
  accent: "#3498db", // Xanh dương làm điểm nhấn
  textPrimary: "#FFFFFF", // Chữ trắng
  textSecondary: "#AAB4C3", // Chữ xám nhạt
  border: "#344054", // Màu viền
};

// -------------------------
// Types (Không thay đổi)
// -------------------------
interface Session {
  id: string;
  workoutId?: string;
  durationMinutes: number;
  completedAt: { toDate?: () => Date } | Date | string | number;
}
interface Stats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak?: number;
}
interface UserProfile {
  uid: string;
  displayName?: string;
  email?: string;
  avatarUrl?: string;
  stats?: Stats;
}
const toDate = (value: Session["completedAt"]): Date => {
  if (!value) return new Date();
  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as any).toDate === "function"
  ) {
    return (value as any).toDate();
  }
  if (value instanceof Date) return value;
  const n = Number(value);
  if (!Number.isNaN(n)) return new Date(n);
  return new Date(String(value));
};

// -------------------------
// StatCard component (Đã cập nhật styles)
// -------------------------
const StatCard = ({
  icon,
  value,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string | number;
  label: string;
}) => (
  <View style={styles.statCard}>
    <View style={styles.iconWrapper}>
      {/* Màu icon đã thay đổi thành màu nhấn */}
      <Ionicons name={icon} size={24} color={DARK_COLORS.accent} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// -------------------------
// ProgressScreen (Đã cập nhật)
// -------------------------
const ProgressScreen: React.FC = () => {
  const { profile } = useUserStore() as { profile: UserProfile | null };
  const [chartData, setChartData] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const processChartData = async () => {
      if (!profile) {
        if (mounted) {
          setChartData(Array(7).fill(0));
          setLoading(false);
        }
        return;
      }
      try {
        setLoading(true);
        const sessions = (await getUserSessionsLast7Days(
          profile.uid
        )) as Session[];
        const dailyMinutes = Array(7).fill(0);
        const today = new Date();
        sessions.forEach((session) => {
          const sessionDate = toDate(session.completedAt);
          const diffDays = Math.floor(
            (today.setHours(0, 0, 0, 0) -
              new Date(sessionDate).setHours(0, 0, 0, 0)) /
            (1000 * 3600 * 24)
          );
          if (diffDays >= 0 && diffDays < 7) {
            const index = 6 - diffDays;
            dailyMinutes[index] += session.durationMinutes || 0;
          }
        });
        if (mounted) {
          setChartData(dailyMinutes);
          setLoading(false);
        }
      } catch (err) {
        console.warn("ProgressScreen: error fetching sessions", err);
        if (mounted) {
          setChartData(Array(7).fill(0));
          setLoading(false);
        }
      }
    };
    processChartData();
    return () => {
      mounted = false;
    };
  }, [profile]);

  const chartLabels = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    return date.toLocaleDateString("vi-VN", { weekday: "short" }).toUpperCase();
  });

  const stats: Stats = {
    totalSessions: profile?.stats?.totalSessions ?? 0,
    totalMinutes: profile?.stats?.totalMinutes ?? 0,
    currentStreak: profile?.stats?.currentStreak ?? 0,
    longestStreak: profile?.stats?.longestStreak ?? 0,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Tiến trình của bạn 📈</Text>

        <View style={styles.statsGrid}>
          <StatCard
            icon="flame-outline"
            value={stats.currentStreak}
            label="Chuỗi ngày"
          />
          <StatCard
            icon="time-outline"
            value={stats.totalMinutes}
            label="Tổng phút"
          />
          <StatCard
            icon="barbell-outline"
            value={stats.totalSessions}
            label="Buổi tập"
          />
          <StatCard icon="trophy-outline" value={0} label="Huy chương" />
        </View>

        <Text style={styles.sectionTitle}>Hoạt động 7 ngày qua</Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={DARK_COLORS.accent} // Cập nhật màu loading
            style={{ marginTop: 40 }}
          />
        ) : (
          <View style={styles.chartWrapper}>
            <BarChart
              data={{
                labels: chartLabels,
                datasets: [{ data: chartData ?? Array(7).fill(0) }],
              }}
              width={screenWidth - 40}
              height={250}
              fromZero
              showValuesOnTopOfBars={true} // Hiển thị giá trị trên cột
              yAxisLabel=""
              yAxisSuffix="p"
              // --- Cấu hình chart cho Dark Mode ---
              chartConfig={{
                backgroundColor: DARK_COLORS.card,
                backgroundGradientFrom: DARK_COLORS.card,
                backgroundGradientTo: DARK_COLORS.card,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`, // Sửa ở đây
                labelColor: (opacity = 1) => `rgba(170, 180, 195, ${opacity})`, // Sửa ở đây
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: DARK_COLORS.accent,
                },
                propsForBackgroundLines: {
                  stroke: DARK_COLORS.border, // Màu đường lưới
                  strokeDasharray: "", // Nét liền
                },
              }}
              style={styles.chart}
            />
          </View>
        )}

        <Text style={styles.sectionTitle}>Lịch sử cảm xúc</Text>
        <View style={styles.moodHistoryContainer}>
          <Text style={styles.emptyMoodText}>Chưa có dữ liệu cảm xúc tuần này.</Text>
          <TouchableOpacity style={styles.logMoodButton}>
            <Text style={styles.logMoodButtonText}>Ghi lại ngay</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProgressScreen;

// -------------------------
// Styles (Đã thiết kế lại hoàn toàn)
// -------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
  },
  title: {
    fontSize: FONT_SIZES.h1,
    fontWeight: FONT_WEIGHTS.bold,
    color: DARK_COLORS.textPrimary,
    textAlign: "center",
    marginVertical: 20,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    width: "48%",
    backgroundColor: DARK_COLORS.card,
    borderRadius: 20, // Bo tròn nhiều hơn
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    // Sử dụng border thay cho shadow trong dark mode
    borderWidth: 1,
    borderColor: DARK_COLORS.border,
  },
  iconWrapper: {
    backgroundColor: "rgba(52, 152, 219, 0.1)", // Nền mờ cho icon
    padding: 12,
    borderRadius: 999, // Hình tròn
    marginBottom: 12,
  },
  statValue: {
    fontSize: FONT_SIZES.h1, // Tăng kích thước số liệu
    fontWeight: FONT_WEIGHTS.bold,
    color: DARK_COLORS.textPrimary,
  },
  statLabel: {
    fontSize: FONT_SIZES.caption,
    fontWeight: FONT_WEIGHTS.medium,
    color: DARK_COLORS.textSecondary,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.h2,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: DARK_COLORS.textPrimary,
    marginVertical: 16,
    textAlign: "center",
  },
  chartWrapper: {
    alignItems: "center",
    marginTop: 16,
  },
  chart: {
    borderRadius: 16,
  },
  moodHistoryContainer: {
    backgroundColor: DARK_COLORS.card,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: DARK_COLORS.border,
    marginBottom: 20,
  },
  emptyMoodText: {
    fontSize: FONT_SIZES.body,
    color: DARK_COLORS.textSecondary,
    marginBottom: 16,
    textAlign: "center",
  },
  logMoodButton: {
    backgroundColor: DARK_COLORS.card,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DARK_COLORS.accent,
  },
  logMoodButtonText: {
    color: DARK_COLORS.accent,
    fontWeight: FONT_WEIGHTS.bold,
  },
});
