import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DARK_COLORS, COLORS } from "../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { updateHealthProfile } from "../../services/firebase/firestore";
import { auth } from "../../services/firebase/config";
import { useUserStore } from "../../store/userStore";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../navigation/types";
import { CommonActions } from "@react-navigation/native";

type Props = NativeStackScreenProps<ProfileStackParamList, "HealthProfile">;

const HealthProfileScreen: React.FC<Props> = ({ navigation }) => {
    const { fetchProfile } = useUserStore();
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState<"male" | "female" | "other" | null>(null);
    const [eatingHabits, setEatingHabits] = useState<"healthy" | "normal" | "unhealthy" | null>(null);
    const [activityLevel, setActivityLevel] = useState<"sedentary" | "light" | "moderate" | "active" | null>(null);
    const [goal, setGoal] = useState<"weight_loss" | "muscle_gain" | "flexibility" | "relaxation" | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!weight || !height || !age || !gender || !goal) {
            Alert.alert("Thiếu thông tin", "Vui lòng điền đầy đủ thông tin bắt buộc.");
            return;
        }

        setIsSaving(true);
        const healthData = {
            weight: parseFloat(weight),
            height: parseFloat(height),
            age: parseInt(age),
            gender,
            eatingHabits: eatingHabits || "normal",
            activityLevel: activityLevel || "light",
            goal,
        };

        const result = await updateHealthProfile(auth.currentUser?.uid || "", healthData);

        if (result.success) {
            // Refresh profile để có healthProfile mới
            if (auth.currentUser?.uid) {
                await fetchProfile(auth.currentUser.uid);
            }
            setIsSaving(false);

            // Navigate to Home tab, then to PersonalizedPlan
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        {
                            name: "ProfileHome",
                        },
                    ],
                })
            );

            // Navigate to Home tab with PersonalizedPlan
            setTimeout(() => {
                const parent = navigation.getParent();
                if (parent) {
                    parent.navigate("Home", {
                        screen: "PersonalizedPlan",
                    });
                }
            }, 100);
        } else {
            setIsSaving(false);
            Alert.alert("❌ Lỗi", "Không thể lưu thông tin. Vui lòng thử lại.");
        }
    };

    const OptionButton = ({ label, selected, onPress }: any) => (
        <TouchableOpacity
            style={[styles.optionButton, selected && styles.optionButtonSelected]}
            onPress={onPress}
        >
            <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={["bottom"]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Thông tin sức khỏe</Text>
                        <Text style={styles.subtitle}>
                            Giúp chúng tôi đề xuất bài tập phù hợp với bạn
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Cân nặng (kg) *</Text>
                        <Input
                            value={weight}
                            onChangeText={setWeight}
                            placeholder="VD: 65"
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Chiều cao (cm) *</Text>
                        <Input
                            value={height}
                            onChangeText={setHeight}
                            placeholder="VD: 170"
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Tuổi *</Text>
                        <Input
                            value={age}
                            onChangeText={setAge}
                            placeholder="VD: 25"
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Giới tính *</Text>
                        <View style={styles.optionsRow}>
                            <OptionButton label="Nam" selected={gender === "male"} onPress={() => setGender("male")} />
                            <OptionButton label="Nữ" selected={gender === "female"} onPress={() => setGender("female")} />
                            <OptionButton label="Khác" selected={gender === "other"} onPress={() => setGender("other")} />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Thói quen ăn uống</Text>
                        <View style={styles.optionsRow}>
                            <OptionButton label="Lành mạnh" selected={eatingHabits === "healthy"} onPress={() => setEatingHabits("healthy")} />
                            <OptionButton label="Bình thường" selected={eatingHabits === "normal"} onPress={() => setEatingHabits("normal")} />
                            <OptionButton label="Chưa tốt" selected={eatingHabits === "unhealthy"} onPress={() => setEatingHabits("unhealthy")} />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Mức độ hoạt động</Text>
                        <View style={styles.optionsRow}>
                            <OptionButton label="Ít vận động" selected={activityLevel === "sedentary"} onPress={() => setActivityLevel("sedentary")} />
                            <OptionButton label="Nhẹ" selected={activityLevel === "light"} onPress={() => setActivityLevel("light")} />
                        </View>
                        <View style={styles.optionsRow}>
                            <OptionButton label="Trung bình" selected={activityLevel === "moderate"} onPress={() => setActivityLevel("moderate")} />
                            <OptionButton label="Cao" selected={activityLevel === "active"} onPress={() => setActivityLevel("active")} />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Mục tiêu *</Text>
                        <View style={styles.optionsRow}>
                            <OptionButton label="Giảm cân" selected={goal === "weight_loss"} onPress={() => setGoal("weight_loss")} />
                            <OptionButton label="Tăng cơ" selected={goal === "muscle_gain"} onPress={() => setGoal("muscle_gain")} />
                        </View>
                        <View style={styles.optionsRow}>
                            <OptionButton label="Linh hoạt" selected={goal === "flexibility"} onPress={() => setGoal("flexibility")} />
                            <OptionButton label="Thư giãn" selected={goal === "relaxation"} onPress={() => setGoal("relaxation")} />
                        </View>
                    </View>

                    <Button
                        title={isSaving ? "Đang lưu..." : "Lưu và xem lộ trình"}
                        onPress={handleSave}
                        loading={isSaving}
                        disabled={isSaving}
                        gradient
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: DARK_COLORS.background },
    content: { padding: 20, paddingBottom: 40 },
    header: { marginBottom: 30, alignItems: "center" },
    title: {
        fontSize: FONT_SIZES.h2,
        fontWeight: FONT_WEIGHTS.bold,
        color: DARK_COLORS.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: FONT_SIZES.body,
        color: DARK_COLORS.textSecondary,
        textAlign: "center",
    },
    section: { marginBottom: 24 },
    label: {
        fontSize: FONT_SIZES.body,
        fontWeight: FONT_WEIGHTS.bold,
        color: DARK_COLORS.text,
        marginBottom: 12,
    },
    optionsRow: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 8,
    },
    optionButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: DARK_COLORS.surface,
        borderWidth: 1,
        borderColor: DARK_COLORS.border,
        alignItems: "center",
    },
    optionButtonSelected: {
        backgroundColor: DARK_COLORS.accent,
        borderColor: DARK_COLORS.accent,
    },
    optionText: {
        fontSize: FONT_SIZES.small,
        color: DARK_COLORS.textSecondary,
        fontWeight: FONT_WEIGHTS.medium,
    },
    optionTextSelected: {
        color: COLORS.white,
        fontWeight: FONT_WEIGHTS.bold,
    },
});

export default HealthProfileScreen;
