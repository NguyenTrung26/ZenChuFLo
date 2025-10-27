// src/screens/progress/ProgressScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { format, subDays } from "date-fns";
import { vi } from "date-fns/locale";

import { useUserStore } from "../../store/userStore";
import { getUserSessionsLast7Days } from "../../services/firebase/firestore";
import { COLORS } from "../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";

const screenWidth = Dimensions.get("window").width;

// -------------------------
// Types
// -------------------------
interface Session {
  id: string;
  workoutId?: string;
  durationMinutes: number;
  // Firestore Timestamp or JS Date — we'll accept either and normalize
  completedAt: { toDate?: () => Date } | Date | string | number;
  // other fields as needed...
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
  // other profile fields...
}

// -------------------------
// Small helper: normalize completedAt -> Date
// -------------------------
const toDate = (value: Session["completedAt"]): Date => {
  if (!value) return new Date();
  // If Firestore Timestamp-like object
  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as any).toDate === "function"
  ) {
    return (value as any).toDate();
  }
  // If it's a Date already
  if (value instanceof Date) return value;
  // If it's a number (ms) or numeric string
  const n = Number(value);
  if (!Number.isNaN(n)) return new Date(n);
  // Last fallback: parse string
  return new Date(String(value));
};

// -------------------------
// StatCard component
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
      <Ionicons name={icon} size={22} color={COLORS.deepPurple} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// -------------------------
// ProgressScreen
// -------------------------
const ProgressScreen: React.FC = () => {
  // profile typed as UserProfile | null for safety
  const { profile } = useUserStore() as { profile: UserProfile | null };

  const [chartData, setChartData] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const processChartData = async () => {
      if (!profile) {
        // no user, clear
        if (mounted) {
          setChartData(Array(7).fill(0));
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        // getUserSessionsLast7Days should return Session[]
        const sessions = (await getUserSessionsLast7Days(
          profile.uid
        )) as Session[];

        // Initialize 7 days array: index 0 = oldest (6 days ago), index 6 = today
        const dailyMinutes = Array(7).fill(0);
        const today = new Date();

        sessions.forEach((session) => {
          const sessionDate = toDate(session.completedAt);
          // Calculate difference in days (0 = today)
          const diffDays = Math.floor(
            (today.setHours(0, 0, 0, 0) -
              new Date(sessionDate).setHours(0, 0, 0, 0)) /
              (1000 * 3600 * 24)
          );
          // if diffDays in [0,6], map to index 6 - diffDays (so array order oldest->newest)
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

  // Labels: produce 7 short day names (MON, TUE, ... in Vietnamese)
  const chartLabels = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    // 'EEE' -> abbreviated weekday, toUpperCase for consistent tight labels
    return format(date, "EEE").toUpperCase();
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
            color={COLORS.deepPurple}
            style={{ marginTop: 24 }}
          />
        ) : (
          <View style={styles.chartWrapper}>
            <BarChart
              data={{
                labels: chartLabels,
                datasets: [{ data: chartData ?? Array(7).fill(0) }],
              }}
              width={Math.min(screenWidth - 40, 720)}
              height={240}
              fromZero
              showValuesOnTopOfBars={false}
              yAxisLabel=""
              yAxisSuffix="p"
              chartConfig={{
                backgroundColor: COLORS.creamWhite,
                backgroundGradientFrom: COLORS.creamWhite,
                backgroundGradientTo: COLORS.creamWhite,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(149, 117, 205, ${opacity})`, // deepPurple-ish
                labelColor: (opacity = 1) => `rgba(70, 70, 70, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForBackgroundLines: {
                  strokeWidth: "0.6",
                  stroke: "#ece7f6",
                },
              }}
              style={styles.chart}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProgressScreen;

// -------------------------
// Styles
// -------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.creamWhite,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
  },
  title: {
    fontSize: FONT_SIZES.h1,
    fontWeight: FONT_WEIGHTS.bold ?? "700",
    color: COLORS.deepPurple,
    textAlign: "center",
    marginVertical: 18,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  statCard: {
    width: "47%",
    backgroundColor: COLORS.lavenderMist,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  iconWrapper: {
    backgroundColor: COLORS.peachCream,
    padding: 8,
    borderRadius: 999,
    marginBottom: 8,
  },
  statValue: {
    fontSize: FONT_SIZES.h2,
    fontWeight: FONT_WEIGHTS.semiBold ?? "600",
    color: COLORS.charcoal,
  },
  statLabel: {
    fontSize: FONT_SIZES.body,
    color: COLORS.warmGray,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.h2,
    fontWeight: FONT_WEIGHTS.semiBold ?? "600",
    color: COLORS.charcoal,
    marginVertical: 12,
    textAlign: "center",
  },
  chartWrapper: {
    alignItems: "center",
    marginTop: 8,
  },
  chart: {
    borderRadius: 16,
  },
});
