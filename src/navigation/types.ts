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
  WorkoutPlan: undefined;
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
  MoodJournal: { mood?: MoodValue };
  Breathing: undefined;
  MeditationTimer: undefined;
  Soundscapes: undefined;
  PersonalizedPlan: undefined;
  PoseAnalysis: undefined;
};

export type WorkoutPlanStackParamList = {
  PlanList: undefined;
  DayDetail: {
    day: number;
    exercises: any[];
    focus: string;
    details?: string;
  };
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
