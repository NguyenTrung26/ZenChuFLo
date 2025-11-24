import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { DARK_COLORS, COLORS } from "../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import { generateRecommendations } from "../../services/ai/recommendationEngine";
import { useUserStore } from "../../store/userStore";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<HomeStackParamList, "PersonalizedPlan">;

const PersonalizedPlanScreen: React.FC<Props> = ({ navigation }) => {
    const { profile } = useUserStore();
    const [recommendation, setRecommendation] = useState<any>(null);

    useEffect(() => {
        if (profile?.healthProfile) {
            const rec = generateRecommendations(profile.healthProfile);
            setRecommendation(rec);
        }
    }, [profile]);

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
                            <View style={styles.dayCard}>
                                <View style={styles.dayHeader}>
                                    <View style={styles.dayBadge}>
                                        <Text style={styles.dayNumber}>Ngày {day.day}</Text>
                                    </View>
                                    <Text style={styles.dayFocus}>{day.focus}</Text>
                                </View>
                                <View style={styles.workoutList}>
                                    {day.workouts.map((workout: string, i: number) => (
                                        <View key={i} style={styles.workoutItem}>
                                            <Ionicons name="checkmark-circle-outline" size={16} color={COLORS.sageGreen} />
                                            <Text style={styles.workoutText}>{workout === "yoga" ? "Yoga" : workout === "meditation" ? "Thiền" : "Hít thở"}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
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
        padding: 20,
    },
    backButton: { padding: 8, marginRight: 12 },
    title: {
        fontSize: FONT_SIZES.h3,
        fontWeight: FONT_WEIGHTS.bold,
        color: DARK_COLORS.text,
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
});

export default PersonalizedPlanScreen;
