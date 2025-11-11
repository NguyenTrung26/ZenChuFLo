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
}

// Định nghĩa kiểu cho navigation prop
type NavigationProps = NativeStackNavigationProp<HomeStackParamList>;

const WorkoutListItem: React.FC<WorkoutListItemProps> = ({ workout }) => {
  const navigation = useNavigation<NavigationProps>();

  const handlePress = () => {
    // Điều hướng đến màn hình chi tiết khi người dùng nhấn vào
    navigation.navigate("WorkoutDetail", { workout });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image source={workout.thumbnailUrl} style={styles.thumbnail} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{workout.title}</Text>
        <Text style={styles.meta}>
          {workout.type} • {workout.level}
        </Text>
        <View style={styles.durationContainer}>
          <Ionicons name="time-outline" size={16} color={COLORS.warmGray} />
          <Text style={styles.durationText}>
            {workout.durationMinutes} phút
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color={COLORS.warmGray} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
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
    fontSize: FONT_SIZES.lg, // Đã sửa từ h3 thành lg
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.charcoal,
    marginBottom: 5,
  },
  meta: {
    fontSize: FONT_SIZES.body,
    color: COLORS.warmGray, // Đã sửa từ gray thành warmGray
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
    color: COLORS.warmGray, // Đã sửa từ gray thành warmGray
  },
});

export default WorkoutListItem;
