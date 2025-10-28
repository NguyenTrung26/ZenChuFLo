// src/screens/home/components/CategorySection.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Category } from "../../../types";
import { COLORS } from "../../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../../constants/typography";

interface CategorySectionProps {
  categories: Category[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ categories }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Khám phá</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardIcon}>{item.icon}</Text>
            <Text style={styles.cardText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.h2,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.charcoal,
  },
  seeAll: {
    fontSize: FONT_SIZES.body,
    color: COLORS.sageGreen,
  },
  card: {
    backgroundColor: COLORS.creamWhite,
    padding: 16,
    marginRight: 12,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
    shadowColor: COLORS.charcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  cardText: {
    fontSize: FONT_SIZES.body,
    color: COLORS.charcoal,
    textAlign: "center",
  },
});

export default CategorySection;
