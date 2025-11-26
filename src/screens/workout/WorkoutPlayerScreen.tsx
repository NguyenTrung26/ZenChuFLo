import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Video, ResizeMode, Audio, AVPlaybackStatus } from "expo-av";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/types";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { MotiView } from "moti";
import { DARK_COLORS, COLORS } from "../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import { auth } from "../../services/firebase/config";
import {
  createSession,
  updateUserStats,
} from "../../services/firebase/firestore";
import { getWorkoutVideoUrl } from "../../constants/workoutVideos";

type Props = NativeStackScreenProps<HomeStackParamList, "WorkoutPlayer">;

const { width, height } = Dimensions.get("window");

const WorkoutPlayerScreen: React.FC<Props> = ({ route, navigation }) => {
  const { workout } = route.params;
  const video = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | {}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hasFinished = useRef(false);

  // Get video URL from constants
  const videoUrl = workout.videoUrl || getWorkoutVideoUrl(workout.id);

  // Configure audio
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  }, []);

  // Auto-hide controls after 3 seconds
  useEffect(() => {
    if (showControls) {
      const timer = setTimeout(() => {
        const currentStatus = status as AVPlaybackStatus;
        if (currentStatus.isLoaded && currentStatus.isPlaying) {
          setShowControls(false);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showControls, status]);

  const handleCompletion = async () => {
    const user = auth.currentUser;
    if (user) {
      await Promise.all([
        createSession(user.uid, workout, null),
        updateUserStats(user.uid, workout.durationMinutes),
      ]);
    }
    navigation.replace("Completion", { workout });
  };

  const formatTime = (millis: number) => {
    if (!millis) return "0:00";
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const calculateCalories = (positionMillis: number) => {
    const minutes = positionMillis / 1000 / 60;
    return Math.round(minutes * 4.5); // Estimate: 4.5 cal/min
  };

  const currentStatus = status as AVPlaybackStatus;
  const progress = currentStatus.isLoaded
    ? (currentStatus.positionMillis / currentStatus.durationMillis!) * 100
    : 0;
  const calories = currentStatus.isLoaded
    ? calculateCalories(currentStatus.positionMillis)
    : 0;

  return (
    <View style={styles.container}>
      {/* Video Player */}
      <Video
        ref={video}
        style={styles.video}
        source={{ uri: videoUrl }}
        useNativeControls={false}
        resizeMode={ResizeMode.CONTAIN}
        isLooping={false}
        onPlaybackStatusUpdate={(statusUpdate) => {
          setStatus(statusUpdate);

          if ("isLoaded" in statusUpdate && statusUpdate.isLoaded) {
            if (isLoading) setIsLoading(false);

            if (statusUpdate.didJustFinish && !hasFinished.current) {
              hasFinished.current = true;
              handleCompletion();
            }
          }
        }}
        onLoadStart={() => setIsLoading(true)}
        onReadyForDisplay={() => setIsLoading(false)}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.sageGreen} />
          <Text style={styles.loadingText}>Đang tải video...</Text>
        </View>
      )}

      {/* Tap to show/hide controls */}
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        activeOpacity={1}
        onPress={() => setShowControls(!showControls)}
      />

      {/* Top Bar */}
      {showControls && (
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 300 }}
          style={styles.topBar}
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.8)", "transparent"]}
            style={styles.topGradient}
          >
            <SafeAreaView edges={["top"]} style={styles.topSafeArea}>
              <View style={styles.topControls}>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={styles.iconButton}
                >
                  <BlurView intensity={20} tint="dark" style={styles.blurIcon}>
                    <Ionicons name="close" size={24} color="#FFF" />
                  </BlurView>
                </TouchableOpacity>

                <View style={styles.titleContainer}>
                  <Text style={styles.videoTitle} numberOfLines={1}>
                    {workout.title}
                  </Text>
                  <Text style={styles.videoSubtitle}>
                    {workout.type} • {workout.durationMinutes} phút
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => setShowInstructions(!showInstructions)}
                  style={styles.iconButton}
                >
                  <BlurView intensity={20} tint="dark" style={styles.blurIcon}>
                    <Ionicons
                      name={showInstructions ? "close-circle" : "information-circle"}
                      size={24}
                      color="#FFF"
                    />
                  </BlurView>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </LinearGradient>
        </MotiView>
      )}

      {/* Instructions Panel */}
      {showInstructions && (
        <MotiView
          from={{ opacity: 0, translateX: width }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: "timing", duration: 300 }}
          style={styles.instructionsPanel}
        >
          <BlurView intensity={40} tint="dark" style={styles.instructionsBlur}>
            <ScrollView style={styles.instructionsScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.instructionsTitle}>Hướng dẫn</Text>
              <Text style={styles.instructionsText}>
                {workout.description || "Hãy tập trung vào hơi thở và lắng nghe cơ thể của bạn."}
              </Text>

              <Text style={styles.instructionsTitle}>Lợi ích</Text>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.sageGreen} />
                <Text style={styles.benefitText}>Cải thiện độ linh hoạt</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.sageGreen} />
                <Text style={styles.benefitText}>Giảm căng thẳng</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.sageGreen} />
                <Text style={styles.benefitText}>Tăng cường sức bền</Text>
              </View>
            </ScrollView>
          </BlurView>
        </MotiView>
      )}

      {/* Bottom Controls */}
      {showControls && (
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 300 }}
          style={styles.bottomBar}
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.9)"]}
            style={styles.bottomGradient}
          >
            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="flame" size={20} color={COLORS.sunsetOrange} />
                <Text style={styles.statText}>{calories} kcal</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="trending-up" size={20} color={COLORS.sageGreen} />
                <Text style={styles.statText}>{Math.round(progress)}%</Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={
                  currentStatus.isLoaded ? currentStatus.durationMillis! : 0
                }
                value={currentStatus.isLoaded ? currentStatus.positionMillis : 0}
                onSlidingComplete={async (value) => {
                  await video.current?.setPositionAsync(value);
                }}
                minimumTrackTintColor={COLORS.sageGreen}
                maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
                thumbTintColor={COLORS.sageGreen}
              />
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>
                  {formatTime(
                    currentStatus.isLoaded ? currentStatus.positionMillis : 0
                  )}
                </Text>
                <Text style={styles.timeText}>
                  {formatTime(
                    currentStatus.isLoaded ? currentStatus.durationMillis! : 0
                  )}
                </Text>
              </View>
            </View>

            {/* Play/Pause Button */}
            <View style={styles.playButtonContainer}>
              <TouchableOpacity
                style={styles.playButton}
                onPress={() =>
                  currentStatus.isLoaded && currentStatus.isPlaying
                    ? video.current?.pauseAsync()
                    : video.current?.playAsync()
                }
              >
                <LinearGradient
                  colors={COLORS.sunsetGradient as [string, string]}
                  style={styles.playButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons
                    name={
                      currentStatus.isLoaded && currentStatus.isPlaying
                        ? "pause"
                        : "play"
                    }
                    size={32}
                    color="#FFF"
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </MotiView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  loadingText: {
    color: "#FFF",
    fontSize: 16,
    marginTop: 16,
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  topGradient: {
    paddingBottom: 20,
  },
  topSafeArea: {
    paddingHorizontal: 16,
  },
  topControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    borderRadius: 20,
    overflow: "hidden",
  },
  blurIcon: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  videoTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  videoSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    textAlign: "center",
    marginTop: 2,
  },
  instructionsPanel: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: width * 0.85,
    zIndex: 9,
  },
  instructionsBlur: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  instructionsScroll: {
    flex: 1,
    padding: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
  },
  instructionsTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 12,
  },
  instructionsText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 15,
    lineHeight: 24,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  benefitText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 15,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  bottomGradient: {
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    paddingHorizontal: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 32,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  progressContainer: {
    marginBottom: 16,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  timeText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
  playButtonContainer: {
    alignItems: "center",
  },
  playButton: {
    borderRadius: 35,
    overflow: "hidden",
    shadowColor: COLORS.sageGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playButtonGradient: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default WorkoutPlayerScreen;
