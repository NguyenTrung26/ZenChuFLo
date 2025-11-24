import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { DARK_COLORS, COLORS } from "../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/types";
import Button from "../../components/common/Button";

type Props = NativeStackScreenProps<HomeStackParamList, "MeditationTimer">;

const DURATIONS = [5, 10, 15, 20];

const MeditationTimerScreen: React.FC<Props> = ({ navigation }) => {
    const [selectedDuration, setSelectedDuration] = useState(10); // minutes
    const [timeLeft, setTimeLeft] = useState(10 * 60);
    const [isActive, setIsActive] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        setTimeLeft(selectedDuration * 60);
        setIsActive(false);
        setIsCompleted(false);
    }, [selectedDuration]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            setIsCompleted(true);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(selectedDuration * 60);
        setIsCompleted(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="close" size={28} color={DARK_COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Thiền định</Text>
            </View>

            <View style={styles.content}>
                {!isActive && !isCompleted && (
                    <View style={styles.durationSelector}>
                        <Text style={styles.label}>Chọn thời gian (phút)</Text>
                        <View style={styles.durations}>
                            {DURATIONS.map((min) => (
                                <TouchableOpacity
                                    key={min}
                                    style={[
                                        styles.durationButton,
                                        selectedDuration === min && styles.durationButtonActive,
                                    ]}
                                    onPress={() => setSelectedDuration(min)}
                                >
                                    <Text
                                        style={[
                                            styles.durationText,
                                            selectedDuration === min && styles.durationTextActive,
                                        ]}
                                    >
                                        {min}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                <View style={styles.timerContainer}>
                    <MotiView
                        from={{ scale: 1, opacity: 0.8 }}
                        animate={{
                            scale: isActive ? 1.1 : 1,
                            opacity: isActive ? 1 : 0.8,
                        }}
                        transition={{
                            type: "timing",
                            duration: 2000,
                            loop: isActive,
                        }}
                        style={styles.timerCircle}
                    >
                        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                    </MotiView>
                    {isCompleted && (
                        <Text style={styles.completedText}>Đã hoàn thành! 🙏</Text>
                    )}
                </View>
            </View>

            <View style={styles.footer}>
                {!isCompleted ? (
                    <Button
                        title={isActive ? "Tạm dừng" : "Bắt đầu"}
                        onPress={toggleTimer}
                        gradient={!isActive}
                        style={isActive ? styles.stopButton : undefined}
                    />
                ) : (
                    <Button title="Hoàn tất" onPress={() => navigation.goBack()} gradient />
                )}
                {(isActive || isCompleted) && (
                    <TouchableOpacity style={styles.resetButton} onPress={resetTimer}>
                        <Text style={styles.resetText}>Đặt lại</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: DARK_COLORS.background },
    header: {
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    backButton: { position: "absolute", left: 20, padding: 8 },
    title: {
        fontSize: FONT_SIZES.h3,
        fontWeight: FONT_WEIGHTS.bold,
        color: DARK_COLORS.text,
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    durationSelector: {
        alignItems: "center",
        marginBottom: 40,
    },
    label: {
        color: DARK_COLORS.textSecondary,
        marginBottom: 16,
        fontSize: FONT_SIZES.body,
    },
    durations: {
        flexDirection: "row",
        gap: 12,
    },
    durationButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: DARK_COLORS.border,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: DARK_COLORS.surface,
    },
    durationButtonActive: {
        backgroundColor: DARK_COLORS.accent,
        borderColor: DARK_COLORS.accent,
    },
    durationText: {
        color: DARK_COLORS.textSecondary,
        fontWeight: FONT_WEIGHTS.bold,
    },
    durationTextActive: {
        color: COLORS.white,
    },
    timerContainer: {
        alignItems: "center",
    },
    timerCircle: {
        width: 240,
        height: 240,
        borderRadius: 120,
        borderWidth: 4,
        borderColor: "rgba(255,255,255,0.1)",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: DARK_COLORS.surface,
        marginBottom: 20,
    },
    timerText: {
        fontSize: 64,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.white,
        fontVariant: ["tabular-nums"],
    },
    completedText: {
        fontSize: FONT_SIZES.h2,
        color: COLORS.sageGreen,
        fontWeight: FONT_WEIGHTS.bold,
    },
    footer: { padding: 30, gap: 16 },
    stopButton: {
        backgroundColor: DARK_COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.red,
    },
    resetButton: {
        alignItems: "center",
        padding: 10,
    },
    resetText: {
        color: DARK_COLORS.textSecondary,
    },
});

export default MeditationTimerScreen;
