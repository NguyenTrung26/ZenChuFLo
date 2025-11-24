import React, { useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { MotiView } from "moti";
import { DARK_COLORS } from "../../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../../constants/typography";
import type { Workout } from "../../../types";

const { width } = Dimensions.get("window");
const HORIZONTAL_PADDING = 20;
const CARD_GAP = 16;
// CARD_WIDTH calculation might need to be passed in or handled by parent layout if grid changes
// For now we keep it consistent with HomeScreen
// const CARD_WIDTH = (width - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

interface WorkoutCardProps {
    item: Workout;
    index: number;
    onPress: (workout: Workout) => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ item, index, onPress }) => {
    const levelGradient = useMemo(() => {
        switch (item.level) {
            case "Beginner":
                return ["#56AB91", "#A8E6CF"] as const;
            case "Intermediate":
                return ["#FFB86C", "#FF8C42"] as const;
            case "Advanced":
                return ["#FF6B9D", "#C73E6E"] as const;
            default:
                return ["#6C5CE7", "#A29BFE"] as const;
        }
    }, [item.level]);

    return (
        <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "timing", duration: 400, delay: index * 80 }}
            style={styles.cardWrapper}
        >
            <TouchableOpacity
                style={styles.workoutCard}
                activeOpacity={0.85}
                onPress={() => onPress(item)}
            >
                <View style={styles.cardImageContainer}>
                    <Image source={item.thumbnailUrl} style={styles.workoutImage} />
                    <LinearGradient
                        colors={["transparent", "rgba(10,14,39,0.95)"]}
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
};

const styles = StyleSheet.create({
    cardWrapper: { flex: 1, marginBottom: 16 },
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
});

export default WorkoutCard;
