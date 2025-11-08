// src/screens/profile/FavoritesScreen.tsx
import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text, // Import Text
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

import {
  getFavoriteWorkoutIds,
  getWorkoutsByIds,
} from "../../services/firebase/firestore";
import { auth } from "../../services/firebase/config";
import { Workout } from "../../types";
import EmptyState from "../../components/common/EmptyState";
import WorkoutListItem from "../../components/common/WorkoutListItem";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";

// --- Bảng màu mới cho Dark Mode ---
const DARK_COLORS = {
  background: "#101727",
  card: "#1C2536",
  accent: "#3498db",
  textPrimary: "#FFFFFF",
  textSecondary: "#AAB4C3",
};

const FavoritesScreen = () => {
  const [favoriteWorkouts, setFavoriteWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = auth.currentUser;

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        setIsLoading(false);
        setFavoriteWorkouts([]);
        return;
      }

      const fetchFavorites = async () => {
        setIsLoading(true);
        const favoriteIds = await getFavoriteWorkoutIds(user.uid);

        if (favoriteIds.length > 0) {
          const workouts = await getWorkoutsByIds(favoriteIds);
          setFavoriteWorkouts(workouts);
        } else {
          setFavoriteWorkouts([]);
        }

        setIsLoading(false);
      };

      fetchFavorites();
    }, [user])
  );

  // --- Component Tiêu đề ---
  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>❤️ Bài tập Yêu thích</Text>
    </View>
  );

  // --- Giao diện Loading ---
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={DARK_COLORS.accent} />
      </View>
    );
  }

  // --- Giao diện Rỗng ---
  if (favoriteWorkouts.length === 0) {
    return (
      // Container cho EmptyState cũng cần có màu nền tối
      <View style={styles.center}>
        <EmptyState
          icon="heart-dislike-outline"
          title="Chưa có mục yêu thích"
          message="Nhấn vào biểu tượng trái tim ở một bài tập để lưu nó lại đây."
          // Truyền màu sắc cho component con để phù hợp với theme
          iconColor={DARK_COLORS.accent}
          titleColor={DARK_COLORS.textPrimary}
          messageColor={DARK_COLORS.textSecondary}
        />
      </View>
    );
  }

  // --- Giao diện Danh sách ---
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={favoriteWorkouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          // Giả định WorkoutListItem đã được thiết kế cho dark mode
          <WorkoutListItem workout={item} />
        )}
        ListHeaderComponent={ListHeader} // Thêm tiêu đề vào đầu danh sách
        contentContainerStyle={styles.listContent} // Thêm padding cho nội dung
      />
    </SafeAreaView>
  );
};

// --- STYLESHEET CẢI TIẾN CHO DARK MODE ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: DARK_COLORS.background,
    paddingHorizontal: 20, // Thêm padding cho EmptyState
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: FONT_SIZES.h1,
    fontWeight: FONT_WEIGHTS.bold,
    color: DARK_COLORS.textPrimary,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40, // Khoảng trống ở dưới cùng của danh sách
  },
});

export default FavoritesScreen;
