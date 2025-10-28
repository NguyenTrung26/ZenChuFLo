import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from "react-native";
// MỚI: Thêm LinearGradient
import { LinearGradient } from "expo-linear-gradient";
import { Workout, Category } from "../../../types";
import { COLORS } from "../../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../../constants/typography";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.65;
const CARD_HEIGHT = 180;
const SCREEN_PADDING = 20; // MỚI: Định nghĩa padding màn hình chung

interface WorkoutListProps {
  title: string;
  workouts: Workout[];
  onPressWorkout?: (workout: Workout) => void;
  onPressSeeAll?: () => void; // MỚI: Thêm prop cho nút "Xem tất cả"
}

const WorkoutCard = ({
  item,
  onPressWorkout,
}: {
  item: Workout;
  onPressWorkout?: (workout: Workout) => void;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.cardContainer}
      onPress={() => onPressWorkout?.(item)}
    >
      <ImageBackground
        source={{ uri: item.thumbnailUrl }}
        style={styles.cardImage}
        imageStyle={{ borderRadius: 20 }}
      >
        {/* CẬP NHẬT: Thay View overlay bằng LinearGradient */}
        <LinearGradient
          colors={["rgba(0,0,0,0.0)", "rgba(0,0,0,0.6)"]} // Chuyển từ trong suốt sang đen
          style={styles.overlay}
        />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.cardMeta}>
            {item.durationMinutes} phút • {item.level}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const WorkoutList: React.FC<WorkoutListProps> = ({
  title,
  workouts,
  onPressWorkout,
  onPressSeeAll, // MỚI: Lấy prop
}) => {
  if (!workouts || workouts.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* MỚI: Thêm header container cho Title và "Xem tất cả" */}
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {onPressSeeAll && ( // Chỉ hiển thị nếu có truyền prop
          <TouchableOpacity onPress={onPressSeeAll}>
            <Text style={styles.seeAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={workouts}
        renderItem={({ item }) => (
          <WorkoutCard item={item} onPressWorkout={onPressWorkout} />
        )}
        keyExtractor={(item) => item.id ?? item.title}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  // MỚI: Style cho header
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SCREEN_PADDING, // Căn lề trái phải
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.h1,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.deepPurple,
    // CẬP NHẬT: Xóa marginBottom, đã chuyển lên headerContainer
  },
  // MỚI: Style cho nút "Xem tất cả"
  seeAllText: {
    fontSize: FONT_SIZES.caption,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.deepPurple, // Bạn có thể đổi thành màu primary nếu có
    opacity: 0.8,
  },
  listContentContainer: {
    // CẬP NHẬT: Thêm paddingLeft để thẻ đầu tiên căn lề
    paddingLeft: SCREEN_PADDING,
    paddingRight: SCREEN_PADDING,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: 16,
    borderRadius: 20,
    // CẬP NHẬT: Làm shadow mềm mại hơn
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, // Giảm opacity
    shadowRadius: 6, // Tăng radius (độ mờ)
    elevation: 4, // Giảm elevation
    // CẬP NHẬT: Xóa overflow: "hidden" để không cắt shadow
  },
  cardImage: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    // CẬP NHẬT: Thêm borderRadius để khớp với ImageBackground
    // Xóa backgroundColor vì đã dùng gradient
    borderRadius: 20,
  },
  cardContent: {
    // CẬP NHẬT: Tăng padding
    padding: 16,
    // Thêm zIndex để chắc chắn nội dung nổi lên trên gradient
    zIndex: 1,
  },
  cardTitle: {
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
    marginBottom: 4,
  },
  cardMeta: {
    fontSize: FONT_SIZES.caption,
    color: COLORS.lightGray,
  },
});

export default WorkoutList;
