import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { DARK_COLORS, COLORS } from "../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import { generateRecommendations } from "../../services/ai/recommendationEngine";
import { useUserStore } from "../../store/userStore";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/types";

import { auth } from "../../services/firebase/config";
import {
    addWorkoutIfNotExists,
    addFavorite,
    removeFavorite,
    isWorkoutFavorited,
    getFavoriteWorkoutIds,
    getFavoriteWorkouts,
    saveWorkoutPlan,
    getWorkoutPlan,
    deleteWorkoutPlan
} from "../../services/firebase/firestore";
import { Workout } from "../../types";

type Props = NativeStackScreenProps<HomeStackParamList, "PersonalizedPlan">;

const PersonalizedPlanScreen: React.FC<Props> = ({ navigation }) => {
    const { profile } = useUserStore();
    const [recommendation, setRecommendation] = useState<any>(null);
    const [expandedDay, setExpandedDay] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
    const [hasSavedPlan, setHasSavedPlan] = useState(false);

    // Load favorites on mount
    // Load favorites on mount
    useEffect(() => {
        const loadFavorites = async () => {
            if (auth.currentUser) {
                const workouts = await getFavoriteWorkouts(auth.currentUser.uid);
                setFavoriteIds(new Set(workouts.map(w => w.id)));
            }
        };
        loadFavorites();
    }, []);

    const handleToggleFavorite = async (exercise: any, dayIndex: number, exIndex: number) => {
        if (!auth.currentUser) return;

        // Generate a consistent ID for this AI exercise
        const exerciseId = `ai_${exercise.type}_${exercise.name.replace(/\s+/g, '_').toLowerCase()}`;

        const isFavorited = favoriteIds.has(exerciseId);
        const newFavorites = new Set(favoriteIds);

        try {
            if (isFavorited) {
                await removeFavorite(auth.currentUser.uid, exerciseId);
                newFavorites.delete(exerciseId);
            } else {
                // Convert AI exercise to Workout format
                const workoutData: Workout = {
                    id: exerciseId,
                    title: exercise.name,
                    description: exercise.instructions ? exercise.instructions.join('\n') : exercise.benefits || '',
                    type: exercise.type === 'yoga' ? 'Yoga' : exercise.type === 'meditation' ? 'Thiền' : 'Hít thở',
                    durationMinutes: parseInt(exercise.duration) || 15,
                    level: recommendation?.recommendedLevel || 'Beginner',
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

    useEffect(() => {
        const loadRecommendations = async () => {
            if (!auth.currentUser) {
                setLoading(false);
                return;
            }

            if (profile?.healthProfile) {
                try {
                    setLoading(true);
                    setError(null);

                    // Try to load saved plan first
                    const savedPlan = await getWorkoutPlan(auth.currentUser.uid);
                    if (savedPlan && savedPlan.recommendation) {
                        setRecommendation(savedPlan.recommendation);
                        setHasSavedPlan(true);
                        setLoading(false);
                        return;
                    }

                    // Generate new plan if no saved plan
                    const rec = await generateRecommendations(profile.healthProfile, true);
                    setRecommendation(rec);

                    // Save the generated plan
                    await saveWorkoutPlan(auth.currentUser.uid, {
                        recommendation: rec,
                        healthProfile: profile.healthProfile
                    });
                    setHasSavedPlan(true);
                } catch (err) {
                    console.error('Error generating recommendations:', err);
                    setError('Không thể tạo lộ trình. Vui lòng thử lại sau.');
                    // Try fallback without AI
                    try {
                        const rec = await generateRecommendations(profile.healthProfile, false);
                        setRecommendation(rec);

                        // Save fallback plan
                        if (auth.currentUser) {
                            await saveWorkoutPlan(auth.currentUser.uid, {
                                recommendation: rec,
                                healthProfile: profile.healthProfile
                            });
                            setHasSavedPlan(true);
                        }
                        setError(null);
                    } catch (fallbackErr) {
                        console.error('Fallback also failed:', fallbackErr);
                    }
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        loadRecommendations();
    }, [profile]);

    const toggleDay = (day: number) => {
        setExpandedDay(expandedDay === day ? null : day);
    };

    const handleDeletePlan = () => {
        Alert.alert(
            "Xóa lộ trình",
            "Bạn có chắc muốn xóa lộ trình hiện tại? Lộ trình mới sẽ được tạo lại.",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: async () => {
                        if (!auth.currentUser) return;

                        try {
                            setLoading(true);
                            await deleteWorkoutPlan(auth.currentUser.uid);
                            setHasSavedPlan(false);
                            setRecommendation(null);

                            // Regenerate plan
                            if (profile?.healthProfile) {
                                const rec = await generateRecommendations(profile.healthProfile, true);
                                setRecommendation(rec);
                                await saveWorkoutPlan(auth.currentUser.uid, {
                                    recommendation: rec,
                                    healthProfile: profile.healthProfile
                                });
                                setHasSavedPlan(true);
                            }
                        } catch (err) {
                            console.error('Error deleting plan:', err);
                            Alert.alert("Lỗi", "Không thể xóa lộ trình. Vui lòng thử lại.");
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const getDailyTip = (day: number): string => {
        const tips = [
            "Bắt đầu ngày mới với năng lượng tích cực!",
            "Hít thở sâu giúp giảm căng thẳng hiệu quả.",
            "Kiên trì là chìa khóa để đạt được mục tiêu!",
            "Hãy lắng nghe cơ thể và nghỉ ngơi khi cần.",
            "Sự linh hoạt đến từ việc luyện tập đều đặn.",
            "Cân bằng giữa tập luyện và nghỉ ngơi rất quan trọng.",
            "Kết thúc tuần với sự thư giãn và phục hồi.",
        ];
        return tips[day - 1] || tips[0];
    };

    // Loading state
    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={24} color={DARK_COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Lộ trình cho bạn</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <MotiView
                        from={{ rotate: '0deg' }}
                        animate={{ rotate: '360deg' }}
                        transition={{ type: 'timing', duration: 1000, loop: true }}
                    >
                        <Ionicons name="sync" size={48} color={DARK_COLORS.accent} />
                    </MotiView>
                    <Text style={styles.loadingText}>Đang tạo lộ trình cá nhân hóa...</Text>
                    <Text style={styles.loadingSubtext}>AI đang phân tích thông tin của bạn</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Error state
    if (error && !recommendation) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={24} color={DARK_COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Lộ trình cho bạn</Text>
                </View>
                <View style={styles.emptyState}>
                    <Ionicons name="alert-circle-outline" size={64} color={DARK_COLORS.textSecondary} />
                    <Text style={styles.emptyText}>{error}</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.buttonText}>Quay lại</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // Empty state (no health profile)
    if (!recommendation) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.emptyState}>
                    <Ionicons name="fitness-outline" size={64} color={DARK_COLORS.textSecondary} />
                    <Text style={styles.emptyText}>Chưa có thông tin sức khỏe</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("HomeList")}
                    >
                        <Text style={styles.buttonText}>Quay lại</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color={DARK_COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Lộ trình cho bạn</Text>
                {hasSavedPlan && (
                    <TouchableOpacity
                        onPress={handleDeletePlan}
                        style={styles.deleteButton}
                    >
                        <Ionicons name="trash-outline" size={22} color={COLORS.red} />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* BMI Card */}
                <View style={styles.bmiCard}>
                    <Text style={styles.bmiLabel}>Chỉ số BMI của bạn</Text>
                    <Text style={styles.bmiValue}>{recommendation.bmi}</Text>
                    <Text style={styles.bmiCategory}>{recommendation.bmiCategory}</Text>
                </View>

                {/* Recommendations */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Đề xuất cho bạn</Text>
                    <View style={styles.recCard}>
                        <View style={styles.recRow}>
                            <Ionicons name="barbell-outline" size={20} color={DARK_COLORS.accent} />
                            <Text style={styles.recText}>Cấp độ: {recommendation.recommendedLevel}</Text>
                        </View>
                        <View style={styles.recRow}>
                            <Ionicons name="time-outline" size={20} color={DARK_COLORS.accent} />
                            <Text style={styles.recText}>Thời lượng: {recommendation.recommendedDuration} phút</Text>
                        </View>
                        <View style={styles.recRow}>
                            <Ionicons name="list-outline" size={20} color={DARK_COLORS.accent} />
                            <Text style={styles.recText}>Loại: {recommendation.recommendedTypes.join(", ")}</Text>
                        </View>
                    </View>
                </View>

                {/* Weekly Plan */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Lộ trình 7 ngày</Text>
                    {recommendation.weeklyPlan.map((day: any, index: number) => {
                        const isExpanded = expandedDay === day.day;

                        return (
                            <MotiView
                                key={day.day}
                                from={{ opacity: 0, translateX: -20 }}
                                animate={{ opacity: 1, translateX: 0 }}
                                transition={{ delay: index * 100 }}
                            >
                                <TouchableOpacity
                                    style={styles.dayCard}
                                    onPress={() => toggleDay(day.day)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.dayHeader}>
                                        <View style={styles.dayBadge}>
                                            <Text style={styles.dayNumber}>Ngày {day.day}</Text>
                                        </View>
                                        <Text style={styles.dayFocus}>{day.focus}</Text>
                                        <Ionicons
                                            name={isExpanded ? "chevron-up" : "chevron-down"}
                                            size={20}
                                            color={DARK_COLORS.textSecondary}
                                        />
                                    </View>

                                    {/* Preview List (Collapsed) */}
                                    {!isExpanded && (
                                        <View style={styles.workoutList}>
                                            {day.exercises && day.exercises.slice(0, 2).map((ex: any, i: number) => (
                                                <View key={i} style={styles.workoutItem}>
                                                    <Ionicons name="checkmark-circle-outline" size={16} color={COLORS.sageGreen} />
                                                    <Text style={styles.workoutText} numberOfLines={1}>
                                                        {ex.name}
                                                    </Text>
                                                </View>
                                            ))}
                                            {day.exercises && day.exercises.length > 2 && (
                                                <Text style={styles.moreText}>+ {day.exercises.length - 2} bài tập khác</Text>
                                            )}
                                        </View>
                                    )}

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <MotiView
                                            from={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ type: 'timing', duration: 300 }}
                                        >
                                            <View style={styles.expandedContent}>
                                                <View style={styles.divider} />

                                                {/* Day Details */}
                                                {day.details && (
                                                    <Text style={styles.dayDetailsText}>{day.details}</Text>
                                                )}

                                                {/* Exercises List */}
                                                <View style={styles.exerciseSection}>
                                                    <Text style={styles.exerciseTitle}>Bài tập chi tiết:</Text>
                                                    {day.exercises && day.exercises.map((ex: any, i: number) => {
                                                        const exerciseId = `ai_${ex.type}_${ex.name.replace(/\s+/g, '_').toLowerCase()}`;
                                                        const isFavorited = favoriteIds.has(exerciseId);

                                                        return (
                                                            <View key={i} style={styles.exerciseCard}>
                                                                <View style={styles.exerciseHeader}>
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 8 }}>
                                                                        <Ionicons
                                                                            name={
                                                                                ex.type === "yoga" ? "body-outline" :
                                                                                    ex.type === "meditation" ? "flower-outline" :
                                                                                        "leaf-outline"
                                                                            }
                                                                            size={20}
                                                                            color={COLORS.sageGreen}
                                                                        />
                                                                        <Text style={styles.exerciseName}>{ex.name}</Text>
                                                                    </View>
                                                                    <TouchableOpacity
                                                                        onPress={() => handleToggleFavorite(ex, day.day, i)}
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
                                                                        <Text style={styles.metaText}>{ex.duration}</Text>
                                                                    </View>
                                                                    {ex.calories && (
                                                                        <View style={styles.metaItem}>
                                                                            <Ionicons name="flame" size={14} color={COLORS.sunsetOrange} />
                                                                            <Text style={styles.metaText}>{ex.calories}</Text>
                                                                        </View>
                                                                    )}
                                                                </View>

                                                                {ex.benefits && (
                                                                    <Text style={styles.exerciseBenefits}>
                                                                        <Text style={{ fontWeight: 'bold' }}>Lợi ích: </Text>
                                                                        {ex.benefits}
                                                                    </Text>
                                                                )}

                                                                {/* Instructions */}
                                                                {ex.instructions && ex.instructions.length > 0 && (
                                                                    <View style={styles.instructionsContainer}>
                                                                        <Text style={styles.instructionsTitle}>Hướng dẫn:</Text>
                                                                        {ex.instructions.map((step: string, stepIndex: number) => (
                                                                            <View key={stepIndex} style={styles.instructionStep}>
                                                                                <Text style={styles.stepNumber}>{stepIndex + 1}.</Text>
                                                                                <Text style={styles.stepText}>{step}</Text>
                                                                            </View>
                                                                        ))}
                                                                    </View>
                                                                )}
                                                            </View>
                                                        )
                                                    })}
                                                </View>

                                                {/* Daily Tips */}
                                                <View style={styles.dailyTip}>
                                                    <Ionicons name="bulb" size={16} color={COLORS.sunsetOrange} />
                                                    <Text style={styles.dailyTipText}>
                                                        {getDailyTip(day.day)}
                                                    </Text>
                                                </View>
                                            </View>
                                        </MotiView>
                                    )}
                                </TouchableOpacity>
                            </MotiView>
                        );
                    })}
                </View>

                {/* Tips */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Lời khuyên</Text>
                    {recommendation.tips.map((tip: string, index: number) => (
                        <View key={index} style={styles.tipCard}>
                            <Ionicons name="bulb-outline" size={20} color={COLORS.sunsetOrange} />
                            <Text style={styles.tipText}>{tip}</Text>
                        </View>
                    ))}
                </View>
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
    },
    backButton: { padding: 8, marginRight: 12 },
    title: {
        fontSize: FONT_SIZES.h3,
        fontWeight: FONT_WEIGHTS.bold,
        color: DARK_COLORS.text,
        flex: 1,
    },
    deleteButton: {
        padding: 8,
    },
    content: { padding: 20, paddingTop: 0 },
    bmiCard: {
        backgroundColor: DARK_COLORS.surface,
        borderRadius: 20,
        padding: 24,
        alignItems: "center",
        marginBottom: 24,
        borderWidth: 1,
        borderColor: DARK_COLORS.border,
    },
    bmiLabel: {
        fontSize: FONT_SIZES.body,
        color: DARK_COLORS.textSecondary,
        marginBottom: 8,
    },
    bmiValue: {
        fontSize: 48,
        fontWeight: FONT_WEIGHTS.bold,
        color: DARK_COLORS.accent,
        marginBottom: 4,
    },
    bmiCategory: {
        fontSize: FONT_SIZES.h3,
        color: DARK_COLORS.text,
        fontWeight: FONT_WEIGHTS.semiBold,
    },
    section: { marginBottom: 24 },
    sectionTitle: {
        fontSize: FONT_SIZES.h3,
        fontWeight: FONT_WEIGHTS.bold,
        color: DARK_COLORS.text,
        marginBottom: 16,
    },
    recCard: {
        backgroundColor: DARK_COLORS.surface,
        borderRadius: 16,
        padding: 20,
        gap: 12,
        borderWidth: 1,
        borderColor: DARK_COLORS.border,
    },
    recRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    recText: {
        fontSize: FONT_SIZES.body,
        color: DARK_COLORS.text,
    },
    dayCard: {
        backgroundColor: DARK_COLORS.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: DARK_COLORS.border,
    },
    dayHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
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
    dayFocus: {
        fontSize: FONT_SIZES.body,
        color: DARK_COLORS.text,
        fontWeight: FONT_WEIGHTS.semiBold,
        flex: 1,
    },
    workoutList: { gap: 8 },
    workoutItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    workoutText: {
        fontSize: FONT_SIZES.body,
        color: DARK_COLORS.textSecondary,
    },
    tipCard: {
        flexDirection: "row",
        backgroundColor: DARK_COLORS.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        gap: 12,
        borderWidth: 1,
        borderColor: DARK_COLORS.border,
    },
    tipText: {
        flex: 1,
        fontSize: FONT_SIZES.body,
        color: DARK_COLORS.text,
        lineHeight: 22,
    },
    expandedContent: {
        marginTop: 12,
        paddingTop: 12,
    },
    divider: {
        height: 1,
        backgroundColor: DARK_COLORS.border,
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: FONT_SIZES.small,
        color: DARK_COLORS.textSecondary,
        marginLeft: 4,
    },
    detailValue: {
        fontSize: FONT_SIZES.small,
        color: DARK_COLORS.text,
        fontWeight: FONT_WEIGHTS.semiBold,
    },
    exerciseSection: {
        marginTop: 12,
    },
    exerciseTitle: {
        fontSize: FONT_SIZES.body,
        fontWeight: FONT_WEIGHTS.semiBold,
        color: DARK_COLORS.text,
        marginBottom: 8,
    },
    exerciseCard: {
        backgroundColor: DARK_COLORS.background,
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: DARK_COLORS.border,
    },
    exerciseHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 6,
    },
    exerciseName: {
        fontSize: FONT_SIZES.body,
        fontWeight: FONT_WEIGHTS.semiBold,
        color: DARK_COLORS.text,
    },
    exerciseDesc: {
        fontSize: FONT_SIZES.small,
        color: DARK_COLORS.textSecondary,
        lineHeight: 18,
        marginBottom: 8,
    },
    exerciseMeta: {
        flexDirection: "row",
        gap: 16,
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
    dailyTip: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
        backgroundColor: DARK_COLORS.background,
        borderRadius: 8,
        padding: 10,
        marginTop: 8,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.sunsetOrange,
    },
    dailyTipText: {
        flex: 1,
        fontSize: FONT_SIZES.small,
        color: DARK_COLORS.textSecondary,
        lineHeight: 18,
        fontStyle: "italic",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
    },
    loadingText: {
        fontSize: FONT_SIZES.h3,
        fontWeight: FONT_WEIGHTS.semiBold,
        color: DARK_COLORS.text,
        marginTop: 24,
        textAlign: "center",
    },
    loadingSubtext: {
        fontSize: FONT_SIZES.body,
        color: DARK_COLORS.textSecondary,
        marginTop: 8,
        textAlign: "center",
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
    },
    emptyText: {
        fontSize: FONT_SIZES.h3,
        color: DARK_COLORS.textSecondary,
        marginTop: 16,
        marginBottom: 24,
    },
    button: {
        backgroundColor: DARK_COLORS.accent,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.body,
        fontWeight: FONT_WEIGHTS.bold,
    },
    moreText: {
        fontSize: FONT_SIZES.small,
        color: DARK_COLORS.textSecondary,
        fontStyle: 'italic',
        marginLeft: 24,
    },
    dayDetailsText: {
        fontSize: FONT_SIZES.body,
        color: DARK_COLORS.text,
        marginBottom: 16,
        lineHeight: 22,
    },
    exerciseBenefits: {
        fontSize: FONT_SIZES.small,
        color: COLORS.sageGreen,
        marginTop: 8,
        fontStyle: 'italic',
    },
    instructionsContainer: {
        marginTop: 12,
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
});

export default PersonalizedPlanScreen;
