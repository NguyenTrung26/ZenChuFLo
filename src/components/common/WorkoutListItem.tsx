// src/components/common/WorkoutListItem.tsx
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/types"; // Đảm bảo đường dẫn này đúng
import { Workout } from "../../types";
import { COLORS } from "../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import { Ionicons } from "@expo/vector-icons";

interface WorkoutListItemProps {
  workout: Workout;
  isDark?: boolean; // Thêm prop isDark
}

// Định nghĩa kiểu cho navigation prop
type NavigationProps = NativeStackNavigationProp<HomeStackParamList>;

const WorkoutListItem: React.FC<WorkoutListItemProps> = ({ workout, isDark = false }) => {
  const navigation = useNavigation<NavigationProps>();

  const handlePress = () => {
    // Điều hướng đến màn hình chi tiết khi người dùng nhấn vào
    navigation.navigate("WorkoutDetail", { workout });
  };

  // Màu sắc dựa trên chế độ
  const containerBg = isDark ? "#1C2536" : COLORS.white; // Dark card color or white
  const titleColor = isDark ? "#FFFFFF" : COLORS.charcoal;
  const metaColor = isDark ? "#AAB4C3" : COLORS.warmGray;
  const iconColor = isDark ? "#AAB4C3" : COLORS.warmGray;
  const borderColor = isDark ? "#2D3748" : COLORS.lightGray;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: containerBg, borderBottomColor: borderColor }
      ]}
      onPress={handlePress}
    >
      <Image source={workout.thumbnailUrl} style={styles.thumbnail} />
      <View style={styles.infoContainer}>
        <Text style={[styles.title, { color: titleColor }]}>{workout.title}</Text>
        <Text style={[styles.meta, { color: metaColor }]}>
          {workout.type} • {workout.level}
        </Text>
        <View style={styles.durationContainer}>
          <Ionicons name="time-outline" size={16} color={iconColor} />
          <Text style={[styles.durationText, { color: metaColor }]}>
            {workout.durationMinutes} phút
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color={iconColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    // backgroundColor và borderBottomColor sẽ được override inline
    borderBottomWidth: 1,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    // color sẽ được override inline
    marginBottom: 5,
  },
  meta: {
    fontSize: FONT_SIZES.body,
    // color sẽ được override inline
    marginBottom: 8,
    textTransform: "capitalize",
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationText: {
    marginLeft: 5,
    fontSize: FONT_SIZES.body,
    // color sẽ được override inline
  },
});

export default WorkoutListItem;
