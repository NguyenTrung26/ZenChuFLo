import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { DARK_COLORS, COLORS } from "../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<HomeStackParamList, "Breathing">;

const PHASES = [
    { label: "Hít vào", duration: 4000, scale: 1.5, color: "#4ECDC4" },
    { label: "Giữ", duration: 7000, scale: 1.5, color: "#FF6B6B" },
    { label: "Thở ra", duration: 8000, scale: 1, color: "#45B7D1" },
];

const BreathingScreen: React.FC<Props> = ({ navigation }) => {
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(PHASES[0].duration / 1000);

    const currentPhase = PHASES[phaseIndex];

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        // Next phase
                        const nextIndex = (phaseIndex + 1) % PHASES.length;
                        setPhaseIndex(nextIndex);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        return PHASES[nextIndex].duration / 1000;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, phaseIndex]);

    const toggleSession = () => {
        setIsActive(!isActive);
        if (!isActive) {
            // Reset if starting fresh
            setPhaseIndex(0);
            setTimeLeft(PHASES[0].duration / 1000);
        }
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
                <Text style={styles.title}>Thở 4-7-8</Text>
            </View>

            <View style={styles.content}>
                <MotiView
                    animate={{
                        scale: isActive ? currentPhase.scale : 1,
                        backgroundColor: isActive ? currentPhase.color : DARK_COLORS.surface,
                    }}
                    transition={{
                        type: "timing",
                        duration: isActive ? currentPhase.duration : 500,
                    }}
                    style={styles.circle}
                >
                    <Text style={styles.phaseText}>
                        {isActive ? currentPhase.label : "Sẵn sàng?"}
                    </Text>
                    {isActive && (
                        <Text style={styles.timerText}>{Math.ceil(timeLeft)}s</Text>
                    )}
                </MotiView>

                <Text style={styles.instruction}>
                    {isActive
                        ? "Tập trung vào hơi thở của bạn..."
                        : "Kỹ thuật thở giúp giảm căng thẳng và lo âu."}
                </Text>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.button} onPress={toggleSession}>
                    <Text style={styles.buttonText}>
                        {isActive ? "Dừng lại" : "Bắt đầu"}
                    </Text>
                </TouchableOpacity>
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
        justifyContent: "center",
        alignItems: "center",
    },
    circle: {
        width: 200,
        height: 200,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 40,
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.1)",
    },
    phaseText: {
        fontSize: FONT_SIZES.h2,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.white,
        marginBottom: 8,
    },
    timerText: {
        fontSize: 48,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.white,
    },
    instruction: {
        fontSize: FONT_SIZES.body,
        color: DARK_COLORS.textSecondary,
        textAlign: "center",
        paddingHorizontal: 40,
    },
    footer: { padding: 40 },
    button: {
        backgroundColor: DARK_COLORS.accent,
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: "center",
    },
    buttonText: {
        fontSize: FONT_SIZES.h3,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.white,
    },
});

export default BreathingScreen;
