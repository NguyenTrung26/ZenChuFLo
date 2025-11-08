// src/screens/home/components/HomeScreenLoader.tsx
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Skeleton from "../../../components/common/Skeleton";

const { width } = Dimensions.get("window");

const HomeScreenLoader = () => {
  return (
    <View style={styles.container}>
      {/* Skeleton for Welcome Header */}
      <Skeleton width={200} height={24} borderRadius={8} />
      <Skeleton width={250} height={18} borderRadius={8} />
      <View style={styles.moodsContainer}>
        <Skeleton width={48} height={48} borderRadius={24} />
        <Skeleton width={48} height={48} borderRadius={24} />
        <Skeleton width={48} height={48} borderRadius={24} />
        <Skeleton width={48} height={48} borderRadius={24} />
        <Skeleton width={48} height={48} borderRadius={24} />
      </View>

      {/* Skeleton for Daily Card */}
      <Skeleton width={"100%"} height={200} borderRadius={20} />

      {/* Skeleton for Workout List */}
      <View style={{ marginTop: 30 }}>
        <Skeleton width={150} height={28} borderRadius={8} />
        <View style={styles.listContainer}>
          <Skeleton width={width * 0.6} height={180} borderRadius={16} />
          <Skeleton width={width * 0.6} height={180} borderRadius={16} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 40 },
  moodsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 24,
  },
  listContainer: { flexDirection: "row", marginTop: 16, gap: 16 },
});

export default HomeScreenLoader;
