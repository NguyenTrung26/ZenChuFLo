import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import Button from "../../components/common/Button";

type Props = NativeStackScreenProps<HomeStackParamList, "WorkoutDetail">;

const WorkoutDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { workout } = route.params;

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <ScrollView>
        {/* Header Image */}
        <ImageBackground
          source={{ uri: workout.thumbnailUrl }}
          style={styles.headerImage}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={28} color={COLORS.white} />
          </TouchableOpacity>

          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={styles.headerGradient}
          >
            <Text style={styles.title}>{workout.title}</Text>
            <Text style={styles.meta}>
              🧘 {workout.type} • {workout.durationMinutes} phút •{" "}
              {workout.level}
            </Text>
          </LinearGradient>
        </ImageBackground>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons
                name="heart-outline"
                size={24}
                color={COLORS.charcoal}
              />
              <Text style={styles.actionText}>Yêu thích</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons
                name="share-social-outline"
                size={24}
                color={COLORS.charcoal}
              />
              <Text style={styles.actionText}>Chia sẻ</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Mô tả</Text>
          <Text style={styles.description}>{workout.description}</Text>

          <Text style={styles.sectionTitle}>Lợi ích 🌟</Text>
          <Text style={styles.description}>• Tăng sự linh hoạt</Text>
          <Text style={styles.description}>• Giảm căng thẳng</Text>
          <Text style={styles.description}>• Cải thiện tư thế</Text>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <Button
          title="Bắt đầu tập ngay"
          onPress={() => navigation.navigate("WorkoutPlayer", { workout })}
          gradient
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.creamWhite },
  headerImage: { width: "100%", height: 250, justifyContent: "flex-end" },
  backButton: { position: "absolute", top: 50, left: 20, zIndex: 10 },
  headerGradient: { padding: 20 },
  title: {
    fontSize: FONT_SIZES.h1,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
    marginBottom: 5,
  },
  meta: { fontSize: FONT_SIZES.body, color: COLORS.white },
  content: { padding: 20 },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  actionButton: { alignItems: "center" },
  actionText: {
    marginTop: 5,
    fontSize: FONT_SIZES.body,
    color: COLORS.charcoal,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.h2,
    fontWeight: FONT_WEIGHTS.bold,
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: FONT_SIZES.body,
    color: COLORS.charcoal,
    lineHeight: 22,
    marginBottom: 5,
  },
  footer: { padding: 20 },
});

export default WorkoutDetailScreen;
