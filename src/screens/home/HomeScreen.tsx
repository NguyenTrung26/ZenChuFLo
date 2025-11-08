// src/screens/home/HomeScreen.tsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { auth } from "../../services/firebase/config";
import { workouts as mockWorkouts, categories } from "../../data/mockData";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/types";
import { COLORS } from "../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";

import { getYogaWorkoutsFromApi } from "../../services/api/yogaApi";
import type { Workout } from "../../types";

import WelcomeHeader from "./components/WelcomeHeader";
import DailyCard from "./components/DailyCard";
import CategorySection from "./components/CategorySection";
import HomeScreenLoader from "./components/HomeScreenLoader";

type Props = NativeStackScreenProps<HomeStackParamList, "HomeList">;

type TabId = "popular" | "latest" | "beginner" | "meditation";

interface Tab {
  id: TabId;
  label: string;
  emoji: string;
  gradient: readonly [string, string];
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 56) / 2; // 20px padding + 16px gap

// Định nghĩa các tab với màu sắc
const TABS: Tab[] = [
  {
    id: "popular",
    label: "Phổ biến",
    emoji: "🔥",
    gradient: ["#FFB74D", "#FF8A65"] as const,
  },
  {
    id: "latest",
    label: "Mới nhất",
    emoji: "✨",
    gradient: ["#81C784", "#66BB6A"] as const,
  },
  {
    id: "beginner",
    label: "Người mới",
    emoji: "🌱",
    gradient: ["#64B5F6", "#42A5F5"] as const,
  },
  {
    id: "meditation",
    label: "Thiền",
    emoji: "🧘",
    gradient: ["#BA68C8", "#9575CD"] as const,
  },
];

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const user = auth.currentUser;
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("popular");
  const [error, setError] = useState<string | null>(null);

  // Fetch workouts function
  const fetchWorkouts = useCallback(async () => {
    try {
      setError(null);
      const data = await getYogaWorkoutsFromApi();
      setWorkouts(data.length ? data : mockWorkouts);
    } catch (error) {
      console.error("Failed to fetch workouts:", error);
      setError("Không thể tải dữ liệu");
      setWorkouts(mockWorkouts);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchWorkouts();
  }, [fetchWorkouts]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  // Tách bài tập nổi bật - memoized
  const featuredWorkout = useMemo(() => workouts[0] ?? null, [workouts]);

  // Lọc workouts theo tab - memoized
  const getWorkoutsByTab = useCallback(
    (tabId: TabId): Workout[] => {
      const remainingWorkouts = workouts.slice(1);

      switch (tabId) {
        case "popular":
          return remainingWorkouts.slice(0, 5);

        case "latest":
          return remainingWorkouts.slice(2, 7);

        case "beginner":
          return remainingWorkouts.filter(
            (w) => w.level !== "Advanced" && w.level !== "Intermediate"
          );

        case "meditation":
          return remainingWorkouts.filter((w) => {
            const title = w.title.toLowerCase();
            return (
              title.includes("thiền") ||
              title.includes("meditation") ||
              title.includes("relaxation")
            );
          });

        default:
          return remainingWorkouts;
      }
    },
    [workouts]
  );

  const currentWorkouts = useMemo(
    () => getWorkoutsByTab(activeTab),
    [activeTab, getWorkoutsByTab]
  );

  // Navigate to workout detail
  const navigateToWorkout = useCallback(
    (workout: Workout) => {
      navigation.navigate("WorkoutDetail", { workout });
    },
    [navigation]
  );

  // Get level color
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "#66BB6A";
      case "Intermediate":
        return "#FFB74D";
      case "Advanced":
        return "#EF5350";
      default:
        return COLORS.deepPurple;
    }
  };

  // Render workout card
  const renderWorkoutCard = useCallback(
    (workout: Workout) => {
      const levelColor = getLevelColor(workout.level);
      return (
        <TouchableOpacity
          key={workout.id ?? workout.title}
          style={styles.workoutCard}
          activeOpacity={0.85}
          onPress={() => navigateToWorkout(workout)}
        >
          <LinearGradient
            colors={["#F8F5FF", "#FFFFFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.workoutGradient}
          >
            <View style={styles.workoutImageContainer}>
              <View style={styles.workoutImagePlaceholder}>
                <Text style={styles.workoutImageText}>🧘</Text>
              </View>
              <View
                style={[styles.levelBadge, { backgroundColor: levelColor }]}
              >
                <Text style={styles.levelText}>{workout.level}</Text>
              </View>
            </View>
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutTitle} numberOfLines={2}>
                {workout.title}
              </Text>
              <View style={styles.workoutMetaContainer}>
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>
                    ⏱️ {workout.durationMinutes} phút
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      );
    },
    [navigateToWorkout]
  );

  // Loading state
  if (isLoading) {
    return <HomeScreenLoader />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.deepPurple}
            colors={[COLORS.deepPurple]}
          />
        }
      >
        <WelcomeHeader name={user?.displayName ?? null} />

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {featuredWorkout && (
          <DailyCard
            workout={featuredWorkout}
            onPress={() => navigateToWorkout(featuredWorkout)}
          />
        )}

        <CategorySection categories={categories} />

        {/* Tab Section */}
        <View style={styles.tabSection}>
          {/* Tab Header */}
          <View style={styles.tabHeader}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabScrollContent}
            >
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    style={[styles.tabButton]}
                    onPress={() => setActiveTab(tab.id)}
                    activeOpacity={0.7}
                  >
                    {isActive ? (
                      <LinearGradient
                        colors={tab.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.tabButtonGradient}
                      >
                        <Text style={styles.tabEmoji}>{tab.emoji}</Text>
                        <Text style={styles.tabButtonTextActive}>
                          {tab.label}
                        </Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.tabButtonInactive}>
                        <Text style={styles.tabEmojiInactive}>{tab.emoji}</Text>
                        <Text style={styles.tabButtonText}>{tab.label}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {currentWorkouts.length > 0 ? (
              <View style={styles.workoutGrid}>
                {currentWorkouts.map(renderWorkoutCard)}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <LinearGradient
                  colors={["#F8F5FF", "#FFF9F0"]}
                  style={styles.emptyStateGradient}
                >
                  <Text style={styles.emptyStateEmoji}>🧘‍♀️</Text>
                  <Text style={styles.emptyStateText}>
                    Chưa có bài tập nào trong mục này
                  </Text>
                  <Text style={styles.emptyStateSubtext}>
                    Hãy quay lại sau để khám phá thêm nhé!
                  </Text>
                </LinearGradient>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: FONT_SIZES.body,
    color: COLORS.deepPurple,
    fontWeight: FONT_WEIGHTS.medium,
  },
  errorBanner: {
    backgroundColor: "#FFF3E0",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#FF8A65",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  errorIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  errorText: {
    flex: 1,
    color: "#E65100",
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.medium,
  },
  tabSection: {
    marginTop: 32,
    marginBottom: 24,
  },
  tabHeader: {
    marginBottom: 24,
  },
  tabScrollContent: {
    paddingHorizontal: 0,
    gap: 12,
  },
  tabButton: {
    marginRight: 8,
  },
  tabButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  tabButtonInactive: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
  },
  tabEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  tabEmojiInactive: {
    fontSize: 18,
    marginRight: 8,
    opacity: 0.6,
  },
  tabButtonText: {
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.charcoal,
    opacity: 0.7,
  },
  tabButtonTextActive: {
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
  },
  tabContent: {
    minHeight: 200,
  },
  workoutGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  workoutCard: {
    width: CARD_WIDTH,
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#9575CD",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  workoutGradient: {
    flex: 1,
  },
  workoutImageContainer: {
    width: "100%",
    aspectRatio: 1.1,
    position: "relative",
  },
  workoutImagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3E5F5",
  },
  workoutImageText: {
    fontSize: 56,
  },
  levelBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  levelText: {
    fontSize: FONT_SIZES.caption,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
  },
  workoutInfo: {
    padding: 16,
  },
  workoutTitle: {
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.charcoal,
    marginBottom: 10,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  workoutMetaContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  durationBadge: {
    backgroundColor: "#F3E5F5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  durationText: {
    fontSize: FONT_SIZES.caption,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.deepPurple,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateGradient: {
    paddingVertical: 48,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignItems: "center",
    width: "100%",
    shadowColor: "#9575CD",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: FONT_SIZES.h3,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.charcoal,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: FONT_SIZES.body,
    color: COLORS.charcoal,
    opacity: 0.6,
    textAlign: "center",
  },
});

export default HomeScreen;
