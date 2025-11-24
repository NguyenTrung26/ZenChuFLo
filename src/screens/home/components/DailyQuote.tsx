import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { MotiView } from "moti";
import { COLORS, DARK_COLORS } from "../../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../../constants/typography";

const QUOTES = [
    { text: "Yoga is the journey of the self, through the self, to the self.", author: "The Bhagavad Gita" },
    { text: "Meditation is not a way of making your mind quiet. It is a way of entering into the quiet that is already there.", author: "Deepak Chopra" },
    { text: "Inhale the future, exhale the past.", author: "Unknown" },
    { text: "The body benefits from movement, and the mind benefits from stillness.", author: "Sakyong Mipham" },
    { text: "Yoga does not just change the way we see things, it transforms the person who sees.", author: "B.K.S. Iyengar" },
];

const DailyQuote = () => {
    const quote = useMemo(() => {
        const index = Math.floor(Math.random() * QUOTES.length);
        return QUOTES[index];
    }, []);

    return (
        <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600, delay: 300 }}
            style={styles.container}
        >
            <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
                <Text style={styles.quoteIcon}>❝</Text>
                <Text style={styles.text}>{quote.text}</Text>
                <Text style={styles.author}>— {quote.author}</Text>
            </BlurView>
        </MotiView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginBottom: 24,
        borderRadius: 16,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
    },
    blurContainer: {
        padding: 16,
        backgroundColor: "rgba(21, 25, 50, 0.6)",
    },
    quoteIcon: {
        fontSize: 24,
        color: DARK_COLORS.accent,
        marginBottom: 4,
        opacity: 0.8,
    },
    text: {
        fontSize: FONT_SIZES.body,
        color: DARK_COLORS.text,
        fontStyle: "italic",
        lineHeight: 22,
        marginBottom: 8,
    },
    author: {
        fontSize: FONT_SIZES.caption,
        color: DARK_COLORS.textSecondary,
        textAlign: "right",
        fontWeight: FONT_WEIGHTS.semiBold,
    },
});

export default DailyQuote;
