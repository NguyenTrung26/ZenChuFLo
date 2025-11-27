import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { useFocusEffect } from "@react-navigation/native";
import { DARK_COLORS, COLORS } from "../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { WorkoutPlanStackParamList } from "../../navigation/types";
import { auth } from "../../services/firebase/config";
import { getWorkoutPlan, deleteWorkoutPlan, saveWorkoutPlan } from "../../services/firebase/firestore";
import { generateRecommendations } from "../../services/ai/recommendationEngine";
import { useUserStore } from "../../store/userStore";

type Props = NativeStackScreenProps<WorkoutPlanStackParamList, "PlanList">;

const WorkoutPlanScreen: React.FC<Props> = ({ navigation }) => {
    const { profile } = useUserStore();
    const [recommendation, setRecommendation] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [hasSavedPlan, setHasSavedPlan] = useState(false);

    // Auto-reload plan when screen is focused
    useFocusEffect(
        useCallback(() => {
            console.log("🔄 WorkoutPlanScreen focused - reloading plan...");
            loadPlan();
        }, [])
    );

    const loadPlan = async () => {
        if (!auth.currentUser) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const savedPlan = await getWorkoutPlan(auth.currentUser.uid);

            if (savedPlan && savedPlan.recommendation) {
                setRecommendation(savedPlan.recommendation);
                setHasSavedPlan(true);
            } else {
                // No saved plan
                setRecommendation(null);
                setHasSavedPlan(false);
            }
        } catch (error) {
            console.error("Error loading plan:", error);
        } finally {
            setLoading(false);
        }
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
                            console.error("Error deleting plan:", err);
                            Alert.alert("Lỗi", "Không thể xóa lộ trình. Vui lòng thử lại.");
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Lộ trình của bạn</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <MotiView
                        from={{ rotate: "0deg" }}
                        animate={{ rotate: "360deg" }}
                        transition={{ type: "timing", duration: 1000, loop: true }}
                    >
                        <Ionicons name="sync" size={48} color={DARK_COLORS.accent} />
                    </MotiView>
                    <Text style={styles.loadingText}>Đang tải lộ trình...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!recommendation) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Lộ trình của bạn</Text>
                </View>
                <View style={styles.emptyState}>
                    <Ionicons name="calendar-outline" size={64} color={DARK_COLORS.textSecondary} />
                    <Text style={styles.emptyText}>Chưa có lộ trình</Text>
                    <Text style={styles.emptySubtext}>
                        Hãy cập nhật thông tin sức khỏe để AI tạo lộ trình cho bạn
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Lộ trình của bạn</Text>
                {hasSavedPlan && (
                    <TouchableOpacity onPress={handleDeletePlan} style={styles.deleteButton}>
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
                    {recommendation.weeklyPlan.map((day: any, index: number) => (
                        <MotiView
                            key={day.day}
                            from={{ opacity: 0, translateX: -20 }}
                            animate={{ opacity: 1, translateX: 0 }}
                            transition={{ delay: index * 100 }}
                        >
                            <TouchableOpacity
                                style={styles.dayCard}
                                onPress={() =>
                                    navigation.navigate("DayDetail", {
                                        day: day.day,
                                        exercises: day.exercises || [],
                                        focus: day.focus,
                                        details: day.details,
                                    })
                                }
                                activeOpacity={0.7}
                            >
                                <View style={styles.dayHeader}>
                                    <View style={styles.dayBadge}>
                                        <Text style={styles.dayNumber}>Ngày {day.day}</Text>
                                    </View>
                                    <Text style={styles.dayFocus}>{day.focus}</Text>
                                    <Ionicons
                                        name="chevron-forward"
                                        size={20}
                                        color={DARK_COLORS.textSecondary}
                                    />
                                </View>

                                {day.exercises && day.exercises.length > 0 && (
                                    <View style={styles.exercisePreview}>
                                        <Text style={styles.exerciseCount}>
                                            {day.exercises.length} bài tập
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </MotiView>
                    ))}
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
        justifyContent: "space-between",
        padding: 20,
    },
    title: {
        fontSize: FONT_SIZES.h2,
        fontWeight: FONT_WEIGHTS.bold,
        color: DARK_COLORS.text,
    },
    deleteButton: {
        padding: 8,
    },
    content: { padding: 20, paddingTop: 0 },
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
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
    },
    emptyText: {
        fontSize: FONT_SIZES.h3,
        color: DARK_COLORS.text,
        marginTop: 16,
        fontWeight: FONT_WEIGHTS.semiBold,
    },
    emptySubtext: {
        fontSize: FONT_SIZES.body,
        color: DARK_COLORS.textSecondary,
        marginTop: 8,
        textAlign: "center",
    },
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
    exercisePreview: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: DARK_COLORS.border,
    },
    exerciseCount: {
        fontSize: FONT_SIZES.small,
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
});

export default WorkoutPlanScreen;
