// src/screens/home/HomeScreen.tsx
import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { MotiView } from "moti";
import { auth } from "../../services/firebase/config";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/types";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import { getAllWorkouts } from "../../services/WorkoutService";
import type { Workout } from "../../types";

import WelcomeHeader from "./components/WelcomeHeader";
import DailyCard from "./components/DailyCard";
import CategorySection from "./components/CategorySection";

type Props = NativeStackScreenProps<HomeStackParamList, "HomeList">;
type TabId = "popular" | "latest" | "beginner" | "meditation";

interface Tab {
  id: TabId;
  label: string;
  emoji: string;
  gradient: readonly [string, string];
}

const { width } = Dimensions.get("window");
const HORIZONTAL_PADDING = 20;
const CARD_GAP = 16;
const CARD_WIDTH = (width - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

// Dark theme colors
const DARK_COLORS = {
  background: "#0A0E27",
  surface: "#151932",
  surfaceLight: "#1E2440",
  border: "#2A3150",
  text: "#E8E9F3",
  textSecondary: "#9BA1C4",
  accent: "#6C5CE7",
  accentLight: "#A29BFE",
};

const TABS: Tab[] = [
  {
    id: "popular",
    label: "Phổ biến",
    emoji: "🔥",
    gradient: ["#FF6B6B", "#EE5A6F"] as const,
  },
  {
    id: "latest",
    label: "Mới nhất",
    emoji: "✨",
    gradient: ["#4ECDC4", "#44A08D"] as const,
  },
  {
    id: "beginner",
    label: "Người mới",
    emoji: "🌱",
    gradient: ["#A8E6CF", "#56AB91"] as const,
  },
  {
    id: "meditation",
    label: "Thiền",
    emoji: "🧘",
    gradient: ["#B197FC", "#8C7CFF"] as const,
  },
];

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const user = auth.currentUser;
  const allWorkouts = useMemo(() => getAllWorkouts(), []);
  const [activeTab, setActiveTab] = useState<TabId>("popular");

  const featuredWorkout = useMemo(() => allWorkouts[0] ?? null, [allWorkouts]);

  const getWorkoutsByTab = useCallback(
    (tabId: TabId): Workout[] => {
      const remaining = allWorkouts.slice(1);
      switch (tabId) {
        case "popular":
          return remaining.slice(0, 6);
        case "latest":
          return remaining.slice(2, 8);
        case "beginner":
          return remaining.filter((w) => w.level === "Beginner").slice(0, 6);
        case "meditation":
          return remaining
            .filter((w) => {
              const title = w.title.toLowerCase();
              return (
                title.includes("thiền") ||
                title.includes("meditation") ||
                title.includes("relaxation")
              );
            })
            .slice(0, 6);
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

  const getLevelColor = (level: string): [string, string] => {
    switch (level) {
      case "Beginner":
        return ["#56AB91", "#A8E6CF"];
      case "Intermediate":
        return ["#FFB86C", "#FF8C42"];
      case "Advanced":
        return ["#FF6B9D", "#C73E6E"];
      default:
        return ["#6C5CE7", "#A29BFE"];
    }
  };

  const renderWorkoutCard = useCallback(
    ({ item, index }: { item: Workout; index: number }) => {
      const levelGradient = getLevelColor(item.level);

      return (
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "timing", duration: 400, delay: index * 80 }}
          style={styles.cardWrapper} // ✅ cardWrapper đã thêm
        >
          <TouchableOpacity
            style={styles.workoutCard}
            activeOpacity={0.85}
            onPress={() => navigateToWorkout(item)}
          >
            <View style={styles.cardImageContainer}>
              <Image source={item.thumbnailUrl} style={styles.workoutImage} />
              <LinearGradient
                colors={
                  ["transparent", "rgba(10,14,39,0.95)"] as [string, string]
                }
                style={styles.workoutImageOverlay}
              />

              {/* Level Badge */}
              <LinearGradient
                colors={levelGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.levelBadge}
              >
                <Text style={styles.levelText}>{item.level}</Text>
              </LinearGradient>

              {/* Duration Badge */}
              <BlurView intensity={20} tint="dark" style={styles.durationBadge}>
                <Text style={styles.durationIcon}>⏱</Text>
                <Text style={styles.durationText}>{item.durationMinutes}m</Text>
              </BlurView>
            </View>

            <View style={styles.workoutInfo}>
              <Text style={styles.workoutTitle} numberOfLines={2}>
                {item.title}
              </Text>
            </View>
          </TouchableOpacity>
        </MotiView>
      );
    },
    [navigateToWorkout]
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          ListHeaderComponent={
            <>
              <WelcomeHeader name={user?.displayName ?? null} />
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

  // Card wrapper
  cardWrapper: { flex: 1, marginBottom: 16 },

  // Workout Cards
  workoutGrid: {
    paddingHorizontal: 20,
    justifyContent: "space-between",
    marginBottom: 16,
  },
  workoutCard: {
    borderRadius: 20,
    backgroundColor: DARK_COLORS.surface,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  cardImageContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 0.85,
  },
  workoutImage: { width: "100%", height: "100%", resizeMode: "cover" },
  workoutImageOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "70%",
  },
  levelBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  levelText: {
    fontSize: 11,
    fontWeight: FONT_WEIGHTS.bold,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  durationBadge: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  durationIcon: { fontSize: 12, marginRight: 4 },
  durationText: {
    fontSize: 12,
    fontWeight: FONT_WEIGHTS.bold,
    color: "#FFFFFF",
  },
  workoutInfo: { padding: 12, backgroundColor: DARK_COLORS.surface },
  workoutTitle: {
    fontSize: 14,
    fontWeight: FONT_WEIGHTS.bold,
    color: DARK_COLORS.text,
    lineHeight: 20,
  },

  // Empty State
  emptyState: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  emptyStateContainer: {
    paddingVertical: 48,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: DARK_COLORS.border,
  },
  emptyStateEmoji: { fontSize: 64, marginBottom: 16 },
  emptyStateText: {
    fontSize: FONT_SIZES.h3,
    fontWeight: FONT_WEIGHTS.bold,
    color: DARK_COLORS.text,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: FONT_SIZES.body,
    color: DARK_COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default HomeScreen;
