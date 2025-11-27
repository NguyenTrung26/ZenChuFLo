import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { DARK_COLORS, COLORS } from "../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { WorkoutPlanStackParamList } from "../../navigation/types";
import { auth } from "../../services/firebase/config";
import {
    addWorkoutIfNotExists,
    addFavorite,
    removeFavorite,
    getFavoriteWorkouts
} from "../../services/firebase/firestore";
import { Workout } from "../../types";

type Props = NativeStackScreenProps<WorkoutPlanStackParamList, "DayDetail">;

const DayDetailScreen: React.FC<Props> = ({ navigation, route }) => {
    const { day, exercises, focus, details } = route.params;
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        if (auth.currentUser) {
            const workouts = await getFavoriteWorkouts(auth.currentUser.uid);
            setFavoriteIds(new Set(workouts.map(w => w.id)));
        }
    };

    const handleToggleFavorite = async (exercise: any) => {
        if (!auth.currentUser) return;

        const exerciseId = `ai_${exercise.type}_${exercise.name.replace(/\s+/g, '_').toLowerCase()}`;
        const isFavorited = favoriteIds.has(exerciseId);
        const newFavorites = new Set(favoriteIds);

        try {
            if (isFavorited) {
                await removeFavorite(auth.currentUser.uid, exerciseId);
                newFavorites.delete(exerciseId);
            } else {
                const workoutData: Workout = {
                    id: exerciseId,
                    title: exercise.name,
                    description: exercise.instructions ? exercise.instructions.join('\n') : exercise.benefits || '',
                    type: exercise.type === 'yoga' ? 'Yoga' : exercise.type === 'meditation' ? 'Thiền' : 'Hít thở',
                    durationMinutes: parseInt(exercise.duration) || 15,
                    level: 'Beginner',
                    thumbnailUrl: { uri: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=2070&auto=format&fit=crop' },
                    rating: 5,
                    reviewCount: 0
                };

                await addFavorite(auth.currentUser.uid, workoutData);
                newFavorites.add(exerciseId);
            }
            setFavoriteIds(newFavorites);
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color={DARK_COLORS.text} />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <View style={styles.dayBadge}>
                        <Text style={styles.dayNumber}>Ngày {day}</Text>
                    </View>
                    <Text style={styles.headerTitle}>{focus}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {details && (
                    <View style={styles.detailsCard}>
                        <Text style={styles.detailsText}>{details}</Text>
                    </View>
                )}

                <Text style={styles.sectionTitle}>Bài tập chi tiết</Text>

                {exercises && exercises.length > 0 ? (
                    exercises.map((exercise: any, index: number) => {
                        const exerciseId = `ai_${exercise.type}_${exercise.name.replace(/\s+/g, '_').toLowerCase()}`;
                        const isFavorited = favoriteIds.has(exerciseId);

                        return (
                            <View key={index} style={styles.exerciseCard}>
                                <View style={styles.exerciseHeader}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 8 }}>
                                        <Ionicons
                                            name={
                                                exercise.type === "yoga" ? "body-outline" :
                                                    exercise.type === "meditation" ? "flower-outline" :
                                                        "leaf-outline"
                                            }
                                            size={20}
                                            color={COLORS.sageGreen}
                                        />
                                        <Text style={styles.exerciseName}>{exercise.name}</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => handleToggleFavorite(exercise)}
                                        style={{ padding: 4 }}
                                    >
                                        <Ionicons
                                            name={isFavorited ? "heart" : "heart-outline"}
                                            size={22}
                                            color={isFavorited ? COLORS.sunsetOrange : DARK_COLORS.textSecondary}
                                        />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.exerciseMeta}>
                                    <View style={styles.metaItem}>
                                        <Ionicons name="time" size={14} color={DARK_COLORS.textSecondary} />
                                        <Text style={styles.metaText}>{exercise.duration}</Text>
                                    </View>
                                    {exercise.calories && (
                                        <View style={styles.metaItem}>
                                            <Ionicons name="flame" size={14} color={COLORS.sunsetOrange} />
                                            <Text style={styles.metaText}>{exercise.calories}</Text>
                                        </View>
                                    )}
                                </View>

                                {exercise.benefits && (
                                    <Text style={styles.exerciseBenefits}>
                                        <Text style={{ fontWeight: 'bold' }}>Lợi ích: </Text>
                                        {exercise.benefits}
                                    </Text>
                                )}

                                {exercise.instructions && exercise.instructions.length > 0 && (
                                    <View style={styles.instructionsContainer}>
                                        <Text style={styles.instructionsTitle}>Hướng dẫn:</Text>
                                        {exercise.instructions.map((step: string, stepIndex: number) => (
                                            <View key={stepIndex} style={styles.instructionStep}>
                                                <Text style={styles.stepNumber}>{stepIndex + 1}.</Text>
                                                <Text style={styles.stepText}>{step}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                        );
                    })
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="fitness-outline" size={48} color={DARK_COLORS.textSecondary} />
                        <Text style={styles.emptyText}>Chưa có bài tập cho ngày này</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: DARK_COLORS.background },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        gap: 12,
    },
    backButton: { padding: 8 },
    headerContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    dayBadge: {
        backgroundColor: DARK_COLORS.accent,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    dayNumber: {
        fontSize: FONT_SIZES.small,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.white,
    },
    headerTitle: {
        fontSize: FONT_SIZES.h3,
        fontWeight: FONT_WEIGHTS.bold,
        color: DARK_COLORS.text,
        flex: 1,
    },
    content: { padding: 20, paddingTop: 0 },
    detailsCard: {
        backgroundColor: DARK_COLORS.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: DARK_COLORS.border,
    },
    detailsText: {
        fontSize: FONT_SIZES.body,
        color: DARK_COLORS.text,
        lineHeight: 22,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.h3,
        fontWeight: FONT_WEIGHTS.bold,
        color: DARK_COLORS.text,
        marginBottom: 16,
    },
    exerciseCard: {
        backgroundColor: DARK_COLORS.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: DARK_COLORS.border,
    },
    exerciseHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
    },
    exerciseName: {
        fontSize: FONT_SIZES.body,
        fontWeight: FONT_WEIGHTS.semiBold,
        color: DARK_COLORS.text,
        flex: 1,
    },
    exerciseMeta: {
        flexDirection: "row",
        gap: 16,
        marginBottom: 12,
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    metaText: {
        fontSize: FONT_SIZES.small,
        color: DARK_COLORS.textSecondary,
    },
    exerciseBenefits: {
        fontSize: FONT_SIZES.small,
        color: COLORS.sageGreen,
        marginBottom: 12,
        fontStyle: 'italic',
    },
    instructionsContainer: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 12,
        borderRadius: 8,
    },
    instructionsTitle: {
        fontSize: FONT_SIZES.small,
        fontWeight: FONT_WEIGHTS.bold,
        color: DARK_COLORS.text,
        marginBottom: 8,
    },
    instructionStep: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    stepNumber: {
        fontSize: FONT_SIZES.small,
        fontWeight: FONT_WEIGHTS.bold,
        color: DARK_COLORS.accent,
        width: 20,
    },
    stepText: {
        flex: 1,
        fontSize: FONT_SIZES.small,
        color: DARK_COLORS.textSecondary,
        lineHeight: 20,
    },
    emptyState: {
        alignItems: "center",
        padding: 40,
    },
    emptyText: {
        fontSize: FONT_SIZES.body,
        color: DARK_COLORS.textSecondary,
        marginTop: 16,
    },
});

export default DayDetailScreen;
