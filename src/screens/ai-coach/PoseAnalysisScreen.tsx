import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { useNavigation } from '@react-navigation/native';
import { analyzePose } from '../../services/ai/geminiService';
import { COLORS } from '../../constants/colors';
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/typography';

const POSES = [
    { id: 'tree', name: 'Tree Pose (Vrksasana)', image: require('../../../assets/poses/bing_images/bridge_yoga_pose/tree.jpg') }, // Placeholder
    { id: 'warrior2', name: 'Warrior II (Virabhadrasana II)', image: require('../../../assets/poses/bing_images/bridge_yoga_pose/Warrior_II.jpg') }, // Placeholder
    { id: 'eagle', name: 'Eagle Pose (Garudasana)', image: require('../../../assets/poses/bing_images/bridge_yoga_pose/Eagle.jpg') }, // Placeholder
    { id: 'lotus', name: 'Lotus Pose (Padmasana)', image: require('../../../assets/poses/bing_images/bridge_yoga_pose/Lotus.jpg') }, // Placeholder
];

const PoseAnalysisScreen = () => {
    const navigation = useNavigation();
    const [selectedPose, setSelectedPose] = useState(POSES[0]);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);

    const [imageBase64, setImageBase64] = useState<string | null>(null);

    const pickImage = async (useCamera: boolean) => {
        try {
            let permissionResult;
            if (useCamera) {
                permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            } else {
                permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            }

            if (permissionResult.granted === false) {
                Alert.alert("Permission Required", "App needs permission to access camera/gallery.");
                return;
            }

            let pickerResult;
            const options: ImagePicker.ImagePickerOptions = {
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.5,
                base64: true, // Request base64 directly
            };

            if (useCamera) {
                pickerResult = await ImagePicker.launchCameraAsync(options);
            } else {
                pickerResult = await ImagePicker.launchImageLibraryAsync(options);
            }

            if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
                setImageUri(pickerResult.assets[0].uri);
                setImageBase64(pickerResult.assets[0].base64 || null);
                setResult(null); // Reset previous result
            }
        } catch (error) {
            console.error("Error picking image:", error);
            Alert.alert("Error", "Failed to pick image.");
        }
    };

    const handleAnalyze = async () => {
        if (!imageBase64) {
            Alert.alert("Error", "No image data available for analysis.");
            return;
        }

        setIsAnalyzing(true);
        try {
            const analysis = await analyzePose(imageBase64, selectedPose.name);
            setResult(analysis);
        } catch (error) {
            console.error("Analysis error:", error);
            Alert.alert("Error", "Failed to analyze image. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const renderResult = () => {
        if (!result) return null;

        // Determine color based on score using available constants
        let scoreColor = COLORS.red; // Default/Low
        if (result.score >= 80) scoreColor = COLORS.forestGreen; // Success
        else if (result.score >= 50) scoreColor = COLORS.sunsetOrange; // Warning

        return (
            <View style={styles.resultContainer}>
                <View style={styles.scoreContainer}>
                    <Text style={[styles.scoreText, { color: scoreColor }]}>{result.score}</Text>
                    <Text style={styles.scoreLabel}>/ 100</Text>
                </View>

                <Text style={styles.feedbackText}>{result.feedback}</Text>

                {result.corrections && result.corrections.length > 0 && (
                    <View style={styles.correctionsContainer}>
                        <Text style={styles.sectionTitle}>Corrections:</Text>
                        {result.corrections.map((correction: string, index: number) => (
                            <View key={index} style={styles.correctionItem}>
                                <Ionicons name="alert-circle-outline" size={20} color={COLORS.sunsetOrange} />
                                <Text style={styles.correctionText}>{correction}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>AI Yoga Coach</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.instruction}>Select a pose to practice:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.posesList}>
                    {POSES.map((pose) => (
                        <TouchableOpacity
                            key={pose.id}
                            style={[styles.poseItem, selectedPose.id === pose.id && styles.selectedPose]}
                            onPress={() => setSelectedPose(pose)}
                        >
                            <Text style={[styles.poseName, selectedPose.id === pose.id && styles.selectedPoseText]}>
                                {pose.name.split(' (')[0]}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View style={styles.imageSection}>
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.previewImage} />
                    ) : (
                        <View style={styles.placeholderContainer}>
                            <Ionicons name="camera-outline" size={60} color={COLORS.lightGray} />
                            <Text style={styles.placeholderText}>Take a photo of yourself doing the {selectedPose.name}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => pickImage(true)}>
                        <Ionicons name="camera" size={24} color="white" />
                        <Text style={styles.buttonText}>Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={() => pickImage(false)}>
                        <Ionicons name="images" size={24} color="white" />
                        <Text style={styles.buttonText}>Gallery</Text>
                    </TouchableOpacity>
                </View>

                {imageUri && !isAnalyzing && !result && (
                    <TouchableOpacity style={styles.analyzeButton} onPress={handleAnalyze}>
                        <Text style={styles.analyzeButtonText}>Analyze Pose</Text>
                    </TouchableOpacity>
                )}

                {isAnalyzing && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLORS.deepPurple} />
                        <Text style={styles.loadingText}>AI is analyzing your form...</Text>
                    </View>
                )}

                {renderResult()}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: FONT_SIZES.h2,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textPrimary,
    },
    scrollContent: {
        padding: 20,
    },
    instruction: {
        fontSize: FONT_SIZES.body,
        color: COLORS.charcoal,
        marginBottom: 10,
    },
    posesList: {
        marginBottom: 20,
    },
    poseItem: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        marginRight: 10,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
    },
    selectedPose: {
        backgroundColor: COLORS.deepPurple,
        borderColor: COLORS.deepPurple,
    },
    poseName: {
        color: COLORS.textPrimary,
        fontWeight: FONT_WEIGHTS.medium,
    },
    selectedPoseText: {
        color: COLORS.white,
    },
    imageSection: {
        height: 300,
        backgroundColor: COLORS.white,
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        borderStyle: 'dashed',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    placeholderContainer: {
        alignItems: 'center',
        padding: 20,
    },
    placeholderText: {
        marginTop: 10,
        color: COLORS.lightGray,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    actionButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.sunsetOrange,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        minWidth: 120,
        justifyContent: 'center',
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: FONT_WEIGHTS.bold,
        marginLeft: 8,
    },
    analyzeButton: {
        backgroundColor: COLORS.deepPurple,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    analyzeButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.h3,
        fontWeight: FONT_WEIGHTS.bold,
    },
    loadingContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    loadingText: {
        marginTop: 10,
        color: COLORS.charcoal,
    },
    resultContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 15,
        padding: 20,
        marginBottom: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'center',
        marginBottom: 15,
    },
    scoreText: {
        fontSize: 48,
        fontWeight: FONT_WEIGHTS.bold,
    },
    scoreLabel: {
        fontSize: FONT_SIZES.h3,
        color: COLORS.lightGray,
        marginLeft: 5,
    },
    feedbackText: {
        fontSize: FONT_SIZES.body,
        color: COLORS.textPrimary,
        textAlign: 'center',
        marginBottom: 20,
        fontStyle: 'italic',
    },
    correctionsContainer: {
        borderTopWidth: 1,
        borderTopColor: COLORS.lightGray,
        paddingTop: 15,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.h3,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textPrimary,
        marginBottom: 10,
    },
    correctionItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    correctionText: {
        marginLeft: 10,
        color: COLORS.textPrimary,
        flex: 1,
    },
});

export default PoseAnalysisScreen;
