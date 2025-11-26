// Import Workout type
import { Workout, MoodValue } from "../types";

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Workout: undefined;
  Meditation: undefined;
  ProgressTab: undefined;
  Profile: undefined;
};

// Thêm type cho onboarding
export type OnboardingStackParamList = {
  Goal: undefined;
  Level: undefined;
  Duration: undefined;
};

export type HomeStackParamList = {
  HomeList: undefined;
  WorkoutDetail: { workout: Workout };
  WorkoutPlayer: { workout: Workout };
  Completion: { workout: Workout };
  MoodJournal: undefined;
  Breathing: undefined;
  MeditationTimer: undefined;
  Soundscapes: undefined;
  PersonalizedPlan: undefined;
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  EditProfile: undefined;
  Reminders: undefined;
  TermsAndPolicy: undefined;
  HelpAndSupport: undefined;
  Favorites: undefined;
  Journal: undefined;
  HealthProfile: undefined;
  Progress: undefined;
};
