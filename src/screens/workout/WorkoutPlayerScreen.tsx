// src/screens/workout/WorkoutPlayerScreen.tsx
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Video, ResizeMode, Audio, AVPlaybackStatus } from "expo-av";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/types";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { COLORS } from "../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import { auth } from "../../services/firebase/config";
import {
  createSession,
  updateUserStats,
} from "../../services/firebase/firestore";

type Props = NativeStackScreenProps<HomeStackParamList, "WorkoutPlayer">;

const WorkoutPlayerScreen: React.FC<Props> = ({ route, navigation }) => {
  const { workout } = route.params;
  const video = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | {}>({});
  const [isLoading, setIsLoading] = useState(true);
  const hasFinished = useRef(false); // đảm bảo chỉ chạy 1 lần

  // ⚙️ Cấu hình audio để có thể phát trong nền
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  }, []);

  // 🧘 Xử lý khi video hoàn thành
  const handleCompletion = async () => {
    const user = auth.currentUser;
    if (user) {
      await Promise.all([
        createSession(user.uid, workout),
        updateUserStats(user.uid, workout.durationMinutes),
      ]);
    }
    navigation.replace("Completion", { workout });
  };

  // ⏱️ Định dạng thời gian hiển thị
  const formatTime = (millis: number) => {
    if (!millis) return "0:00";
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const currentStatus = status as AVPlaybackStatus;

  return (
    <SafeAreaView style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        source={{
          uri: workout.videoUrl || "",
        }}
        useNativeControls={false}
        resizeMode={ResizeMode.CONTAIN}
        isLooping={false} // ⚠️ đổi false để video có thể kết thúc
        onPlaybackStatusUpdate={(statusUpdate) => {
          setStatus(statusUpdate);

          // Khi video load xong
          if ("isLoaded" in statusUpdate && statusUpdate.isLoaded) {
            if (isLoading) setIsLoading(false);

            // 🚀 Kiểm tra video kết thúc
            if (statusUpdate.didJustFinish && !hasFinished.current) {
              hasFinished.current = true;
              handleCompletion();
            }
          }
        }}
        onLoadStart={() => setIsLoading(true)}
        onReadyForDisplay={() => setIsLoading(false)}
      />

      {isLoading && (
        <ActivityIndicator
          size="large"
          color={COLORS.white}
          style={StyleSheet.absoluteFill}
        />
      )}

      {/* 🌫️ Lớp phủ mờ cho UI điều khiển */}
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={32} color={COLORS.white} />
        </TouchableOpacity>

        <View style={styles.controlsContainer}>
          <Text style={styles.title}>{workout.title}</Text>

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
              minimumTrackTintColor={COLORS.white}
              maximumTrackTintColor="rgba(255, 255, 255, 0.5)"
              thumbTintColor={COLORS.white}
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

          <TouchableOpacity
            style={styles.playButton}
            onPress={() =>
              currentStatus.isLoaded && currentStatus.isPlaying
                ? video.current?.pauseAsync()
                : video.current?.playAsync()
            }
          >
            <Ionicons
              name={
                currentStatus.isLoaded && currentStatus.isPlaying
                  ? "pause"
                  : "play"
              }
              size={40}
              color={COLORS.charcoal}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// 💅 STYLE
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    justifyContent: "center",
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "space-between",
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 20,
    padding: 10,
    zIndex: 1,
  },
  controlsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  title: {
    color: COLORS.white,
    fontSize: FONT_SIZES.h2,
    fontWeight: FONT_WEIGHTS.bold,
    textAlign: "center",
    marginBottom: 20,
  },
  progressContainer: {
    marginBottom: 20,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  timeText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.small,
  },
  playButton: {
    backgroundColor: COLORS.white,
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});

export default WorkoutPlayerScreen;
