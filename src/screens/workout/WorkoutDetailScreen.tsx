import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { MotiView, MotiText } from "moti";
import { DARK_COLORS, COLORS } from "../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import Button from "../../components/common/Button";
import { useFavorite } from "../../hooks/useFavorite";

type Props = NativeStackScreenProps<HomeStackParamList, "WorkoutDetail">;

const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT = height * 0.5;

const WorkoutDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { workout } = route.params;
  const { isFavorited, loading: loadingFavorite, toggleFavorite } = useFavorite(workout);

  // Mock data for display (since not all fields exist in Workout type yet)
  const calories = useMemo(() => Math.round(workout.durationMinutes * 4.5), [workout.durationMinutes]);
  const equipment = ["Thảm tập", "Khăn", "Nước uống"];

  const renderInfoItem = (icon: string, label: string, value: string) => (
    <View style={styles.infoItem}>
      <View style={styles.infoIconContainer}>
        <Ionicons name={icon as any} size={20} color={COLORS.sageGreen} />
      </View>
      <View>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Immersive Header */}
        <ImageBackground
          source={workout.thumbnailUrl}
          style={styles.headerImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.3)", "transparent", "rgba(16,23,39,0.9)", "#101727"]}
            style={styles.headerGradient}
            locations={[0, 0.4, 0.8, 1]}
          >
            <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
              <View style={styles.headerTopRow}>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={styles.iconButton}
                >
                  <BlurView intensity={30} tint="dark" style={styles.blurButton}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                  </BlurView>
                </TouchableOpacity>

                <View style={styles.headerActions}>
                  <TouchableOpacity
                    onPress={toggleFavorite}
                    disabled={loadingFavorite}
                    style={styles.iconButton}
                  >
                    <BlurView intensity={30} tint="dark" style={styles.blurButton}>
                      <Ionicons
                        name={isFavorited ? "heart" : "heart-outline"}
                        size={24}
                        color={isFavorited ? "#FF6B6B" : "#FFF"}
                      />
                    </BlurView>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.iconButton, { marginLeft: 12 }]}>
                    <BlurView intensity={30} tint="dark" style={styles.blurButton}>
                      <Ionicons name="share-social-outline" size={24} color="#FFF" />
                    </BlurView>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>

            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 600 }}
              style={styles.headerContent}
            >
              <View style={styles.tagContainer}>
                <View style={[styles.tag, { backgroundColor: COLORS.sageGreen }]}>
                  <Text style={styles.tagText}>{workout.type}</Text>
                </View>
                <View style={[styles.tag, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <Text style={styles.tagText}>{workout.level}</Text>
                </View>
              </View>

              <Text style={styles.title}>{workout.title}</Text>

              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{workout.rating || 4.8} ({workout.reviewCount || 120} đánh giá)</Text>
              </View>
            </MotiView>
          </LinearGradient>
        </ImageBackground>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          {/* Info Grid */}
          <View style={styles.infoGrid}>
            {renderInfoItem("time-outline", "Thời gian", `${workout.durationMinutes} phút`)}
            {renderInfoItem("flame-outline", "Đốt cháy", `~${calories} Kcal`)}
            {renderInfoItem("barbell-outline", "Cấp độ", workout.level)}
          </View>

          <View style={styles.divider} />

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Giới thiệu</Text>
            <Text style={styles.description}>
              {workout.description || "Bài tập này được thiết kế để giúp bạn cải thiện sức khỏe thể chất và tinh thần. Hãy tập trung vào hơi thở và lắng nghe cơ thể của bạn."}
            </Text>
          </View>

          {/* Benefits */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lợi ích</Text>
            <View style={styles.benefitList}>
              {["Cải thiện độ linh hoạt", "Giảm căng thẳng & lo âu", "Tăng cường sức bền", "Cân bằng tâm trí"].map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.sageGreen} />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Equipment */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dụng cụ cần thiết</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.equipmentList}>
              {equipment.map((item, index) => (
                <View key={index} style={styles.equipmentItem}>
                  <View style={styles.equipmentIcon}>
                    <Ionicons name="construct-outline" size={24} color={COLORS.sageGreen} />
                  </View>
                  <Text style={styles.equipmentText}>{item}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Bottom Padding for Floating Button */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Sticky Footer Button */}
      <LinearGradient
        colors={["transparent", "rgba(16,23,39,0.8)", "#101727"]}
        style={styles.footerGradient}
        pointerEvents="box-none"
      >
        <Button
          title="Bắt đầu tập ngay"
          onPress={() => navigation.navigate("WorkoutPlayer", { workout })}
          gradient
          haptic="medium"
          style={styles.startButton}
          textStyle={styles.startButtonText}
          icon={<Ionicons name="play" size={20} color="#FFF" style={{ marginRight: 8 }} />}
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerImage: {
    width: width,
    height: HEADER_HEIGHT,
  },
  headerGradient: {
    flex: 1,
    justifyContent: "space-between",
  },
  headerSafeArea: {
    zIndex: 10,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  iconButton: {
    borderRadius: 20,
    overflow: "hidden",
  },
  blurButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  headerActions: {
    flexDirection: "row",
  },
  headerContent: {
    padding: 24,
    paddingBottom: 40,
  },
  tagContainer: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  tagText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ratingText: {
    color: "#DDD",
    fontSize: 14,
    fontWeight: "500",
  },
  contentContainer: {
    marginTop: -24,
    backgroundColor: DARK_COLORS.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
  },
  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    backgroundColor: DARK_COLORS.card,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(86, 171, 145, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 11,
    color: DARK_COLORS.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "700",
    color: DARK_COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginBottom: 24,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: DARK_COLORS.text,
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: DARK_COLORS.textSecondary,
    lineHeight: 24,
  },
  benefitList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 12,
    borderRadius: 12,
  },
  benefitText: {
    fontSize: 15,
    color: DARK_COLORS.text,
  },
  equipmentList: {
    flexDirection: "row",
    marginHorizontal: -4,
  },
  equipmentItem: {
    alignItems: "center",
    marginHorizontal: 8,
    width: 80,
  },
  equipmentIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: DARK_COLORS.card,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  equipmentText: {
    fontSize: 12,
    color: DARK_COLORS.textSecondary,
    textAlign: "center",
  },
  footerGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    justifyContent: "flex-end",
  },
  startButton: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    shadowColor: COLORS.sageGreen,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});

export default WorkoutDetailScreen;
