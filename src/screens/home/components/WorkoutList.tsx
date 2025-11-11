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
import { LinearGradient } from "expo-linear-gradient";
import { Workout, Category } from "../../../types";
import { COLORS } from "../../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../../constants/typography";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7;
const CARD_HEIGHT = 200;
const SCREEN_PADDING = 20;

interface WorkoutListProps {
  title: string;
  workouts: Workout[];
  onPressWorkout?: (workout: Workout) => void;
  onPressSeeAll?: () => void;
}

const WorkoutCard = ({
  item,
  onPressWorkout,
}: {
  item: Workout;
  onPressWorkout?: (workout: Workout) => void;
}) => {
  // Lấy màu theo level
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

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.cardContainer}
      onPress={() => onPressWorkout?.(item)}
    >
      <View style={styles.cardWrapper}>
        <ImageBackground
          source={item.thumbnailUrl}
          style={styles.cardImage}
          imageStyle={styles.imageStyle}
        >
          {/* Gradient overlay cho text dễ đọc */}
          <LinearGradient
            colors={
              ["rgba(0,0,0,0)", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)"] as const
            }
            locations={[0, 0.5, 1]}
            style={styles.overlay}
          />

          {/* Level Badge */}
          <View style={styles.badgeContainer}>
            <LinearGradient
              colors={
                [getLevelColor(item.level), getLevelColor(item.level)] as const
              }
              style={styles.levelBadge}
            >
              <Text style={styles.levelText}>{item.level}</Text>
            </LinearGradient>
          </View>

          {/* Content */}
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.metaContainer}>
              <View style={styles.durationContainer}>
                <Text style={styles.durationIcon}>⏱️</Text>
                <Text style={styles.cardMeta}>{item.durationMinutes} phút</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};

const WorkoutList: React.FC<WorkoutListProps> = ({
  title,
  workouts,
  onPressWorkout,
  onPressSeeAll,
}) => {
  if (!workouts || workouts.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Header với title và see all button */}
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <View style={styles.titleAccent} />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {onPressSeeAll && (
          <TouchableOpacity
            onPress={onPressSeeAll}
            style={styles.seeAllButton}
            activeOpacity={0.7}
          >
            <Text style={styles.seeAllText}>Xem tất cả</Text>
            <Text style={styles.seeAllIcon}>→</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Workout list */}
      <FlatList
        data={workouts}
        renderItem={({ item }) => (
          <WorkoutCard item={item} onPressWorkout={onPressWorkout} />
        )}
        keyExtractor={(item) => item.id ?? item.title}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContentContainer}
        snapToInterval={CARD_WIDTH + 16}
        decelerationRate="fast"
        snapToAlignment="start"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SCREEN_PADDING,
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleAccent: {
    width: 4,
    height: 24,
    backgroundColor: COLORS.deepPurple,
    borderRadius: 2,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.h2,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.charcoal,
    letterSpacing: 0.3,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#E8E8E8",
    shadowColor: "#9575CD",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  seeAllText: {
    fontSize: FONT_SIZES.small,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.deepPurple,
    marginRight: 4,
  },
  seeAllIcon: {
    fontSize: FONT_SIZES.body,
    color: COLORS.deepPurple,
    fontWeight: FONT_WEIGHTS.bold,
  },
  listContentContainer: {
    paddingLeft: SCREEN_PADDING,
    paddingRight: SCREEN_PADDING,
    paddingBottom: 8,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: 16,
  },
  cardWrapper: {
    flex: 1,
    borderRadius: 24,
    shadowColor: "#9575CD",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    backgroundColor: COLORS.white,
  },
  cardImage: {
    flex: 1,
    justifyContent: "flex-end",
  },
  imageStyle: {
    borderRadius: 24,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
  },
  badgeContainer: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  levelBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  levelText: {
    fontSize: FONT_SIZES.caption,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  cardContent: {
    padding: 20,
    zIndex: 1,
  },
  cardTitle: {
    fontSize: FONT_SIZES.h3,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
    marginBottom: 12,
    lineHeight: 24,
    letterSpacing: 0.3,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  durationIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  cardMeta: {
    fontSize: FONT_SIZES.small,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.white,
    letterSpacing: 0.2,
  },
});

export default WorkoutList;
