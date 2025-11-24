import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { DARK_COLORS, COLORS } from "../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<HomeStackParamList, "Soundscapes">;

const SOUNDSCAPES = [
    { id: "rain", name: "Mưa", emoji: "🌧️", color: "#4A90E2" },
    { id: "ocean", name: "Đại dương", emoji: "🌊", color: "#00B4D8" },
    { id: "forest", name: "Rừng", emoji: "🌲", color: "#52B788" },
    { id: "fire", name: "Lửa", emoji: "🔥", color: "#FF6B35" },
    { id: "wind", name: "Gió", emoji: "💨", color: "#90E0EF" },
    { id: "birds", name: "Chim hót", emoji: "🐦", color: "#FFD60A" },
];

const SoundscapesScreen: React.FC<Props> = ({ navigation }) => {
    const [playing, setPlaying] = useState<string | null>(null);

    const toggleSound = (id: string) => {
        if (playing === id) {
            setPlaying(null);
            // TODO: Stop audio
        } else {
            setPlaying(id);
            // TODO: Play audio
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
                <Text style={styles.title}>Âm thanh thiên nhiên</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.subtitle}>
                    Chọn một âm thanh để thư giãn và tập trung
                </Text>

                <View style={styles.grid}>
                    {SOUNDSCAPES.map((sound, index) => {
                        const isPlaying = playing === sound.id;
                        return (
                            <MotiView
                                key={sound.id}
                                from={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 100 }}
                            >
                                <TouchableOpacity
                                    style={[
                                        styles.soundCard,
                                        { borderColor: sound.color },
                                        isPlaying && { backgroundColor: sound.color },
                                    ]}
                                    onPress={() => toggleSound(sound.id)}
                                >
                                    <Text style={styles.emoji}>{sound.emoji}</Text>
                                    <Text
                                        style={[
                                            styles.soundName,
                                            isPlaying && { color: COLORS.white },
                                        ]}
                                    >
                                        {sound.name}
                                    </Text>
                                    {isPlaying && (
                                        <MotiView
                                            from={{ scale: 1 }}
                                            animate={{ scale: 1.2 }}
                                            transition={{
                                                type: "timing",
                                                duration: 1000,
                                                loop: true,
                                            }}
                                            style={styles.playingIndicator}
                                        >
                                            <Ionicons name="volume-high" size={20} color={COLORS.white} />
                                        </MotiView>
                                    )}
                                </TouchableOpacity>
                            </MotiView>
                        );
                    })}
                </View>

                <View style={styles.info}>
                    <Ionicons name="information-circle-outline" size={20} color={DARK_COLORS.textSecondary} />
                    <Text style={styles.infoText}>
                        Âm thanh sẽ phát liên tục. Nhấn lại để dừng.
                    </Text>
                </View>
            </ScrollView>
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
        padding: 20,
    },
    subtitle: {
        fontSize: FONT_SIZES.body,
        color: DARK_COLORS.textSecondary,
        textAlign: "center",
        marginBottom: 30,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 16,
    },
    soundCard: {
        width: "48%",
        aspectRatio: 1,
        backgroundColor: DARK_COLORS.surface,
        borderRadius: 20,
        borderWidth: 2,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    emoji: {
        fontSize: 48,
        marginBottom: 12,
    },
    soundName: {
        fontSize: FONT_SIZES.body,
        fontWeight: FONT_WEIGHTS.bold,
        color: DARK_COLORS.text,
    },
    playingIndicator: {
        position: "absolute",
        top: 12,
        right: 12,
    },
    info: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 30,
        padding: 16,
        backgroundColor: DARK_COLORS.surface,
        borderRadius: 12,
    },
    infoText: {
        flex: 1,
        fontSize: FONT_SIZES.small,
        color: DARK_COLORS.textSecondary,
    },
});

export default SoundscapesScreen;
