import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUserJournalEntries } from "../../services/firebase/firestore";
import { auth } from "../../services/firebase/config";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { COLORS } from "../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import EmptyState from "../../components/common/EmptyState";

// Component con cho mỗi thẻ ghi chú
const JournalEntryCard = ({ item }: { item: any }) => {
  // Ép kiểu thành Date để TypeScript không báo lỗi
  const date: Date = (item.completedAt || item.createdAt).toDate() as Date;

  return (
    <View style={styles.card}>
      <Text style={styles.cardDate}>{format(date, "dddd, DD MMMM, YYYY")}</Text>

      {item.type === "session" && item.workoutTitle && (
        <Text style={styles.cardTitle}>Sau bài tập "{item.workoutTitle}"</Text>
      )}
      {item.type === "mood" && (
        <Text style={styles.cardTitle}>Ghi chú tâm trạng</Text>
      )}

      <Text style={styles.cardNotes}>{item.notes}</Text>
    </View>
  );
};

const JournalScreen = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchEntries = async () => {
      try {
        const data = await getUserJournalEntries(user.uid);
        setEntries(data);
      } catch (error) {
        console.error("Failed to fetch journal entries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, [user]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.deepPurple} />
      </View>
    );
  }

  if (entries.length === 0) {
    return (
      <EmptyState
        icon="book-outline"
        title="Nhật ký của bạn còn trống"
        message="Hãy ghi lại cảm xúc sau mỗi buổi tập hoặc khi theo dõi tâm trạng để bắt đầu hành trình này nhé."
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={entries}
        keyExtractor={(item) =>
          `${item.type}-${(item.completedAt || item.createdAt).toMillis()}`
        }
        renderItem={({ item }) => <JournalEntryCard item={item} />}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.creamWhite,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.creamWhite,
  },
  list: {
    padding: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.deepPurple,
  },
  cardDate: {
    fontSize: FONT_SIZES.caption,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.lightGray,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.charcoal,
    marginBottom: 12,
  },
  cardNotes: {
    fontSize: FONT_SIZES.body,
    color: COLORS.charcoal,
    lineHeight: 24,
  },
});

export default JournalScreen;
