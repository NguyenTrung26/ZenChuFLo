// src/screens/home/HomeScreen.tsx
import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { auth } from "../../services/firebase/config";
import {
  addFavorite,
  removeFavorite,
  getFavoriteWorkouts,
} from "../../services/firebase/firestore";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/types";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import { getAllWorkouts } from "../../services/WorkoutService";
import type { Workout } from "../../types";
import { useUserStore } from "../../store/userStore";

import WelcomeHeader from "./components/WelcomeHeader";
import DailyCard from "./components/DailyCard";
import CategorySection from "./components/CategorySection";
import DailyQuote from "./components/DailyQuote";
import WorkoutCard from "./components/WorkoutCard";
import { DARK_COLORS, COLORS } from "../../constants/colors";

type Props = NativeStackScreenProps<HomeStackParamList, "HomeList">;
type TabId = "all" | "strength" | "flexibility" | "balance" | "relaxation";

interface Tab {
  id: TabId;
  label: string;
  emoji: string;
  gradient: readonly [string, string];
}

const { width } = Dimensions.get("window");

const TABS: Tab[] = [
  {
    id: "all",
    label: "Tất cả",
    emoji: "🧘",
    gradient: ["#667eea", "#764ba2"] as const,
  },
  {
    id: "strength",
    label: "Sức mạnh",
    emoji: "💪",
    gradient: ["#FF6B6B", "#EE5A6F"] as const,
  },
  {
    id: "flexibility",
    label: "Dẻo dai",
    emoji: "🤸",
    gradient: ["#4ECDC4", "#44A08D"] as const,
  },
  {
    id: "balance",
    label: "Thăng bằng",
    emoji: "⚖️",
    gradient: ["#A8E6CF", "#56AB91"] as const,
  },
  {
    id: "relaxation",
    label: "Thư giãn",
    emoji: "🌙",
    gradient: ["#B197FC", "#8C7CFF"] as const,
  },
];

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const user = auth.currentUser;
  const { profile } = useUserStore();
  const allWorkouts = useMemo(() => getAllWorkouts(), []);
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // Load favorites
  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        if (auth.currentUser) {
          const workouts = await getFavoriteWorkouts(auth.currentUser.uid);
          setFavoriteIds(new Set(workouts.map((w) => w.id)));
        }
      };
      loadFavorites();
    }, [])
  );

  const handleToggleFavorite = async (workout: Workout) => {
    if (!auth.currentUser) return;

    const isFavorited = favoriteIds.has(workout.id);
    const newFavorites = new Set(favoriteIds);

    try {
      if (isFavorited) {
        await removeFavorite(auth.currentUser.uid, workout.id);
        newFavorites.delete(workout.id);
      } else {
        await addFavorite(auth.currentUser.uid, workout);
        newFavorites.add(workout.id);
      }
      setFavoriteIds(newFavorites);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const featuredWorkout = useMemo(() => allWorkouts[0] ?? null, [allWorkouts]);

  const getWorkoutsByTab = useCallback(
    (tabId: TabId): Workout[] => {
      const remaining = allWorkouts.slice(1);

      switch (tabId) {
        case "all":
          // Hiển thị tất cả poses
          return allWorkouts;

        case "strength":
          // Poses tăng sức mạnh: Plank, Warrior, Chair, Boat, Crow, etc.
          return remaining.filter((w) => {
            const title = w.title.toLowerCase();
            const desc = w.description?.toLowerCase() || "";
            return (
              title.includes("warrior") ||
              title.includes("plank") ||
              title.includes("chair") ||
              title.includes("boat") ||
              title.includes("crow") ||
              title.includes("eagle") ||
              title.includes("handstand") ||
              title.includes("forearm stand") ||
              desc.includes("strengthen")
            );
          });

        case "flexibility":
          // Poses tăng độ dẻo: Forward Bend, Splits, Bow, Camel, etc.
          return remaining.filter((w) => {
            const title = w.title.toLowerCase();
            const desc = w.description?.toLowerCase() || "";
            return (
              title.includes("forward") ||
              title.includes("split") ||
              title.includes("bow") ||
              title.includes("camel") ||
              title.includes("pigeon") ||
              title.includes("butterfly") ||
              title.includes("triangle") ||
              title.includes("pyramid") ||
              desc.includes("stretch")
            );
          });

        case "balance":
          // Poses cân bằng: Tree, Half-Moon, Eagle, Warrior III, etc.
          return remaining.filter((w) => {
            const title = w.title.toLowerCase();
            const desc = w.description?.toLowerCase() || "";
            return (
              title.includes("tree") ||
              title.includes("half-moon") ||
              title.includes("half moon") ||
              title.includes("eagle") ||
              title.includes("warrior three") ||
              title.includes("warrior iii") ||
              title.includes("extended hand") ||
              title.includes("side plank") ||
              desc.includes("balance")
            );
          });

        case "relaxation":
          // Poses thư giãn: Child's Pose, Corpse, Sphinx, Seated Forward Bend, etc.
          return remaining.filter((w) => {
            const title = w.title.toLowerCase();
            const desc = w.description?.toLowerCase() || "";
            return (
              title.includes("child") ||
              title.includes("corpse") ||
              title.includes("sphinx") ||
              title.includes("seated forward") ||
              title.includes("plow") ||
              title.includes("shoulder stand") ||
              title.includes("lotus") ||
              desc.includes("calm") ||
              desc.includes("relax") ||
              desc.includes("relieve stress")
            );
          });

        default:
          return remaining;
      }
    },
    [allWorkouts]
  );

  const currentWorkouts = useMemo(
    () => getWorkoutsByTab(activeTab),
    [activeTab, getWorkoutsByTab]
  );

  const navigateToWorkout = useCallback(
    (workout: Workout) => navigation.navigate("WorkoutDetail", { workout }),
    [navigation]
  );

  const renderWorkoutCard = useCallback(
    ({ item, index }: { item: Workout; index: number }) => {
      return (
        <WorkoutCard
          item={item}
          index={index}
          onPress={navigateToWorkout}
          isFavorited={favoriteIds.has(item.id)}
          onToggleFavorite={() => handleToggleFavorite(item)}
        />
      );
    },
    [navigateToWorkout, favoriteIds]
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          ListHeaderComponent={
            <>
              <WelcomeHeader name={user?.displayName ?? null} />
              <View style={styles.quickActionsContainer}>
                <TouchableOpacity
                  style={styles.quickActionButton}
                  onPress={() => navigation.navigate("MoodJournal")}
                >
                  <Text style={styles.quickActionEmoji}>✨</Text>
                  <Text style={styles.quickActionText}>Cảm xúc</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickActionButton}
                  onPress={() => navigation.navigate("Breathing")}
                >
                  <Text style={styles.quickActionEmoji}>🌬️</Text>
                  <Text style={styles.quickActionText}>Hít thở</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickActionButton}
                  onPress={() => navigation.navigate("MeditationTimer")}
                >
                  <Text style={styles.quickActionEmoji}>🧘</Text>
                  <Text style={styles.quickActionText}>Thiền</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickActionButton}
                  onPress={() => navigation.navigate("Soundscapes")}
                >
                  <Text style={styles.quickActionEmoji}>🎵</Text>
                  <Text style={styles.quickActionText}>Âm thanh</Text>
                </TouchableOpacity>
              </View>

              {/* Personalized Plan Banner */}
              {profile?.healthProfile && (
                <TouchableOpacity
                  style={styles.personalizedBanner}
                  onPress={() => navigation.navigate("PersonalizedPlan")}
                >
                  <View style={styles.bannerContent}>
                    <Ionicons name="sparkles" size={24} color={COLORS.sunsetOrange} />
                    <View style={styles.bannerText}>
                      <Text style={styles.bannerTitle}>Lộ trình cho bạn</Text>
                      <Text style={styles.bannerSubtitle}>Xem kế hoạch tập luyện cá nhân</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={DARK_COLORS.textSecondary} />
                </TouchableOpacity>
              )}

              <DailyQuote />
              {featuredWorkout && (
                <View style={styles.featuredSection}>
                  <DailyCard
                    workout={featuredWorkout}
                    onPress={() => navigateToWorkout(featuredWorkout)}
                  />
                </View>
              )}
              <CategorySection categories={[]} />
              {/* Tabs */}
              <View style={styles.tabSection}>
                <Text style={styles.sectionTitle}>Khám phá</Text>
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
                        onPress={() => setActiveTab(tab.id)}
                        activeOpacity={0.7}
                        style={{ marginRight: 12 }}
                      >
                        {isActive ? (
                          <LinearGradient
                            colors={tab.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.tabButtonActive}
                          >
                            <Text style={styles.tabEmoji}>{tab.emoji}</Text>
                            <Text style={styles.tabTextActive}>
                              {tab.label}
                            </Text>
                          </LinearGradient>
                        ) : (
                          <View style={styles.tabButtonInactive}>
                            <Text style={styles.tabEmojiInactive}>
                              {tab.emoji}
                            </Text>
                            <Text style={styles.tabTextInactive}>
                              {tab.label}
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </>
          }
          data={currentWorkouts}
          renderItem={renderWorkoutCard}
          keyExtractor={(item) => item.id ?? item.title}
          numColumns={2}
          columnWrapperStyle={styles.workoutGrid}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <LinearGradient
                colors={
                  [DARK_COLORS.surface, DARK_COLORS.surfaceLight] as [
                    string,
                    string
                  ]
                }
                style={styles.emptyStateContainer}
              >
                <Text style={styles.emptyStateEmoji}>🧘‍♀️</Text>
                <Text style={styles.emptyStateText}>Chưa có bài tập</Text>
                <Text style={styles.emptyStateSubtext}>
                  Hãy quay lại sau để khám phá thêm
                </Text>
              </LinearGradient>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DARK_COLORS.background },
  safeArea: { flex: 1 },
  listContent: { paddingBottom: 24 },
  featuredSection: { marginBottom: 8 },

  // Tabs
  tabSection: { marginTop: 24, marginBottom: 16, paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: FONT_SIZES.h3,
    fontWeight: FONT_WEIGHTS.bold,
    color: DARK_COLORS.text,
    marginBottom: 12,
    letterSpacing: 0.3,
  },

  quickActionsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DARK_COLORS.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DARK_COLORS.border,
    gap: 8,
  },
  quickActionEmoji: {
    fontSize: 20,
  },
  quickActionText: {
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: DARK_COLORS.text,
  },

  personalizedBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: DARK_COLORS.surface,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.sunsetOrange,
  },
  bannerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.bold,
    color: DARK_COLORS.text,
  },
  bannerSubtitle: {
    fontSize: FONT_SIZES.small,
    color: DARK_COLORS.textSecondary,
    marginTop: 2,
  },

  tabScrollContent: { paddingRight: 20 },
  tabButtonActive: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  tabButtonInactive: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: DARK_COLORS.surface,
    borderWidth: 1,
    borderColor: DARK_COLORS.border,
    opacity: 0.7,
  },
  tabEmoji: { fontSize: 14, marginRight: 5 },
  tabEmojiInactive: { fontSize: 14, marginRight: 5, opacity: 0.6 },
  tabTextActive: {
    fontSize: 13,
    fontWeight: FONT_WEIGHTS.bold,
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  tabTextInactive: {
    fontSize: 13,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: DARK_COLORS.textSecondary,
  },

  workoutGrid: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 16,
  },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateContainer: {
    padding: 32,
    borderRadius: 24,
    alignItems: "center",
    width: "100%",
  },
  emptyStateEmoji: { fontSize: 48, marginBottom: 12 },
  emptyStateText: {
    fontSize: FONT_SIZES.h3,
    fontWeight: FONT_WEIGHTS.bold,
    color: DARK_COLORS.text,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: FONT_SIZES.body,
    color: DARK_COLORS.textSecondary,
    textAlign: "center",
  },
});

export default HomeScreen;
