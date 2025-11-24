import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DARK_COLORS, COLORS } from "../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    private handleRestart = () => {
        // In a real app, you might want to use RNRestart or just reset state
        this.setState({ hasError: false, error: null });
    };

    public render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <Ionicons name="alert-circle-outline" size={80} color={COLORS.red} />
                    <Text style={styles.title}>Rất tiếc, đã có lỗi xảy ra!</Text>
                    <Text style={styles.message}>
                        Chúng tôi đang nỗ lực khắc phục sự cố này.
                    </Text>
                    <TouchableOpacity style={styles.button} onPress={this.handleRestart}>
                        <Text style={styles.buttonText}>Thử lại</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DARK_COLORS.background,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: FONT_SIZES.h2,
        fontWeight: FONT_WEIGHTS.bold,
        color: DARK_COLORS.text,
        marginTop: 20,
        marginBottom: 10,
        textAlign: "center",
    },
    message: {
        fontSize: FONT_SIZES.body,
        color: DARK_COLORS.textSecondary,
        textAlign: "center",
        marginBottom: 30,
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

export default ErrorBoundary;
