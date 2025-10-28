// Import Workout type
import { Workout } from "../types";
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Workout: undefined;
  Meditation: undefined;
  Progress: undefined;
  Profile: undefined;
};
// Thêm type cho onboarding
export type OnboardingStackParamList = {
  Goal: undefined;
  Level: undefined;
  Duration: undefined;
};
export type HomeStackParamList = {
  HomeList: undefined; // Màn hình danh sách chính (HomeScreen của chúng ta)
  WorkoutDetail: { workout: Workout }; // Màn hình chi tiết, nhận một đối tượng workout
  WorkoutPlayer: { workout: Workout };
  Completion: { workout: Workout };
};
export type ProfileStackParamList = {
  ProfileHome: undefined;
  EditProfile: undefined;
  Reminders: undefined;
};
