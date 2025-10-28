// src/screens/home/HomeScreen.tsx

import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
import WorkoutList from "./components/WorkoutList";

type Props = NativeStackScreenProps<HomeStackParamList, "HomeList">;

// Định nghĩa các tab
const TABS = [
  { id: "popular", label: "Phổ biến" },
  { id: "latest", label: "Mới nhất" },
  { id: "beginner", label: "Người mới" },
  { id: "meditation", label: "Thiền" },
];

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const user = auth.currentUser;
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("popular");
  const scrollX = new Animated.Value(0);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await getYogaWorkoutsFromApi();
        setWorkouts(data.length ? data : mockWorkouts);
      } catch (error) {
        console.error("Failed to fetch workouts, using mock data:", error);
        setWorkouts(mockWorkouts);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkouts();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.deepPurple} />
      </View>
    );
  }

  // Tách bài tập nổi bật
  const featuredWorkout = workouts[0] ?? null;

  // Lọc workouts theo tab (giả lập - bạn có thể thêm logic thực tế)
  const getWorkoutsByTab = (tabId: string): Workout[] => {
    const remainingWorkouts = workouts.slice(1);
    switch (tabId) {
      case "popular":
        return remainingWorkouts.slice(0, 5);
      case "latest":
        return remainingWorkouts.slice(2, 7);
      case "beginner":
        // Lọc các bài tập không phải Advanced
        return remainingWorkouts.filter(
          (w) => w.level !== "Advanced" && w.level !== "Intermediate"
        );
      case "meditation":
        return remainingWorkouts.filter(
          (w) =>
            w.title.toLowerCase().includes("thiền") ||
            w.title.toLowerCase().includes("meditation") ||
            w.title.toLowerCase().includes("relaxation")
        );
      default:
        return remainingWorkouts;
    }
  };

  const currentWorkouts = getWorkoutsByTab(activeTab);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <WelcomeHeader name={user?.displayName ?? null} />

        {featuredWorkout && (
          <DailyCard
            workout={featuredWorkout}
            onPress={() =>
              navigation.navigate("WorkoutDetail", { workout: featuredWorkout })
            }
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
              {TABS.map((tab, index) => {
                const isActive = activeTab === tab.id;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    style={[
                      styles.tabButton,
                      isActive && styles.tabButtonActive,
                    ]}
                    onPress={() => setActiveTab(tab.id)}
                  >
                    <Text
                      style={[
                        styles.tabButtonText,
                        isActive && styles.tabButtonTextActive,
                      ]}
                    >
                      {tab.label}
                    </Text>
                    {isActive && <View style={styles.tabIndicator} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {currentWorkouts.length > 0 ? (
              <View style={styles.workoutGrid}>
                {currentWorkouts.map((workout) => (
                  <TouchableOpacity
                    key={workout.id ?? workout.title}
                    style={styles.workoutCard}
                    activeOpacity={0.8}
                    onPress={() =>
                      navigation.navigate("WorkoutDetail", { workout })
                    }
                  >
                    <View style={styles.workoutImageContainer}>
                      <View style={styles.workoutImagePlaceholder}>
                        <Text style={styles.workoutImageText}>🧘</Text>
                      </View>
                    </View>
                    <View style={styles.workoutInfo}>
                      <Text style={styles.workoutTitle} numberOfLines={2}>
                        {workout.title}
                      </Text>
                      <Text style={styles.workoutMeta}>
                        {workout.durationMinutes} phút • {workout.level}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  Chưa có bài tập nào trong mục này
                </Text>
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
    backgroundColor: COLORS.creamWhite,
    paddingHorizontal: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabSection: {
    marginTop: 30,
  },
  tabHeader: {
    marginBottom: 20,
  },
  tabScrollContent: {
    paddingHorizontal: 0,
  },
  tabButton: {
    marginRight: 24,
    paddingBottom: 12,
    position: "relative",
  },
  tabButtonActive: {
    // Active state được xử lý bởi indicator
  },
  tabButtonText: {
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.deepPurple,
    opacity: 0.5,
  },
  tabButtonTextActive: {
    fontWeight: FONT_WEIGHTS.bold,
    opacity: 1,
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: COLORS.deepPurple,
    borderRadius: 2,
  },
  tabContent: {
    minHeight: 200,
  },
  workoutGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
  },
  workoutCard: {
    width: "48%",
    marginHorizontal: "1%",
    marginBottom: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  workoutImageContainer: {
    width: "100%",
    aspectRatio: 1.2,
    backgroundColor: "#F5F1FF",
  },
  workoutImagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8DFFF",
  },
  workoutImageText: {
    fontSize: 48,
  },
  workoutInfo: {
    padding: 12,
  },
  workoutTitle: {
    fontSize: FONT_SIZES.small,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.deepPurple,
    marginBottom: 4,
    lineHeight: 18,
  },
  workoutMeta: {
    fontSize: FONT_SIZES.caption,
    color: COLORS.deepPurple,
    opacity: 0.6,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: FONT_SIZES.body,
    color: COLORS.deepPurple,
    opacity: 0.5,
  },
});

export default HomeScreen;
