// src/navigation/AppNavigator.tsx
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View, Text, StyleSheet } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase/config";
import { useUserStore } from "../store/userStore";

// Navigators
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Screens
import SignupScreen from "../screens/auth/SignupScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import GoalSelectionScreen from "../screens/onboarding/GoalSelectionScreen";
import LevelSelectionScreen from "../screens/onboarding/LevelSelectionScreen";
import DurationSelectionScreen from "../screens/onboarding/DurationSelectionScreen";
import HomeScreen from "../screens/home/HomeScreen";
import WorkoutDetailScreen from "../screens/workout/WorkoutDetailScreen";
import WorkoutPlayerScreen from "../screens/workout/WorkoutPlayerScreen";

const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Profile</Text>
  </View>
);

// Types
import {
  AuthStackParamList,
  OnboardingStackParamList,
  HomeStackParamList,
} from "./types";

// --- Stack & Tab Navigators ---
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator();

// --- Auth Flow ---
function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
}

// --- Onboarding Flow ---
function OnboardingNavigator() {
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
      <OnboardingStack.Screen name="Goal" component={GoalSelectionScreen} />
      <OnboardingStack.Screen name="Level" component={LevelSelectionScreen} />
      <OnboardingStack.Screen
        name="Duration"
        component={DurationSelectionScreen}
      />
    </OnboardingStack.Navigator>
  );
}

// --- Home Stack Navigator (dưới Tab) ---
function HomeNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeList" component={HomeScreen} />
      <HomeStack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
      <HomeStack.Screen
        name="WorkoutPlayer"
        component={WorkoutPlayerScreen}
        options={{ presentation: "modal" }} // Hiển thị dưới dạng modal trượt từ dưới lên
      />
    </HomeStack.Navigator>
  );
}

// --- Main Tab Navigator ---
function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#673ab7",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator} // <- Stack navigator cho Home tab
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ focused, color, size }) => {
            const iconName: keyof typeof Ionicons.glyphMap = focused
              ? "home"
              : "home-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Hồ sơ",
          tabBarIcon: ({ focused, color, size }) => {
            const iconName: keyof typeof Ionicons.glyphMap = focused
              ? "person"
              : "person-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}

// --- App Router: kiểm tra onboarding qua store ---
const AppRouter = () => {
  const { profile, isLoading } = useUserStore();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return profile?.onboarding?.completed ? (
    <MainNavigator />
  ) : (
    <OnboardingNavigator />
  );
};

// --- AppNavigator gốc ---
const AppNavigator = () => {
  const [loadingAuth, setLoadingAuth] = useState(true);
  const { fetchProfile, clearProfile } = useUserStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchProfile(currentUser.uid);
      } else {
        clearProfile();
      }
      if (loadingAuth) setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  if (loadingAuth) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const user = auth.currentUser;

  return (
    <NavigationContainer>
      {user ? <AppRouter /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default AppNavigator;
