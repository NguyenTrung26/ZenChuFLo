// src/screens/home/HomeScreen.tsx

import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../services/firebase/config";
import { workouts, categories } from "../../data/mockData";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/types";

import WelcomeHeader from "./components/WelcomeHeader";
import DailyCard from "./components/DailyCard";
import CategorySection from "./components/CategorySection";
import { COLORS } from "../../constants/colors";

// Định nghĩa props để nhận navigation từ stack
type Props = NativeStackScreenProps<HomeStackParamList, "HomeList">;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const user = auth.currentUser;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <WelcomeHeader name={user?.displayName ?? null} />

        {/* DailyCard với navigation sang WorkoutDetail */}
        <DailyCard
          workout={workouts[0]}
          onPress={() =>
            navigation.navigate("WorkoutDetail", { workout: workouts[0] })
          }
        />

        {/* Section danh mục */}
        <CategorySection categories={categories} />

        {/* Các section khác như Progress có thể thêm ở đây */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.creamWhite,
    paddingHorizontal: 20,
  },
});

export default HomeScreen;
