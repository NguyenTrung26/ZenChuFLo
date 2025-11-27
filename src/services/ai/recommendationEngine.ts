// AI Recommendation Engine - Rule-based workout recommendations
import { HealthProfile } from "../../types";
import { Workout } from "../../types";

interface RecommendationResult {
    recommendedLevel: "Beginner" | "Intermediate" | "Advanced";
    recommendedDuration: number; // minutes
    recommendedTypes: string[];
    weeklyPlan: {
        day: number;
        workouts?: string[]; // workout IDs or types (for fallback)
        exercises?: any[]; // detailed exercises from AI
        focus: string;
        details?: string;
    }[];
    bmi: number;
    bmiCategory: string;
    tips: string[];
}

// Calculate BMI
function calculateBMI(weight: number, height: number): number {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
}

// Get BMI category
function getBMICategory(bmi: number): string {
    if (bmi < 18.5) return "Thiếu cân";
    if (bmi < 25) return "Bình thường";
    if (bmi < 30) return "Thừa cân";
    return "Béo phì";
}

// Generate recommendations based on health profile
export async function generateRecommendations(
    profile: HealthProfile,
    useAI: boolean = true
): Promise<RecommendationResult> {
    const { weight = 65, height = 170, age = 25, gender, eatingHabits, activityLevel, goal } = profile;

    const bmi = calculateBMI(weight, height);
    const bmiCategory = getBMICategory(bmi);

    // Determine recommended level
    let recommendedLevel: "Beginner" | "Intermediate" | "Advanced" = "Beginner";
    if (activityLevel === "moderate" || activityLevel === "active") {
        recommendedLevel = "Intermediate";
    }
    if (activityLevel === "active" && age < 40) {
        recommendedLevel = "Advanced";
    }

    // Determine duration
    let recommendedDuration = 10;
    if (goal === "weight_loss") {
        recommendedDuration = bmi > 25 ? 20 : 15;
    } else if (goal === "muscle_gain") {
        recommendedDuration = 20;
    } else if (goal === "relaxation") {
        recommendedDuration = 10;
    }

    // Determine workout types
    const recommendedTypes: string[] = [];
    if (goal === "weight_loss") {
        recommendedTypes.push("Yoga", "Hít thở");
    } else if (goal === "muscle_gain") {
        recommendedTypes.push("Yoga");
    } else if (goal === "flexibility") {
        recommendedTypes.push("Yoga");
    } else if (goal === "relaxation") {
        recommendedTypes.push("Thiền", "Hít thở");
    }

    // Try to use AI if enabled
    if (useAI) {
        try {
            const { generateWorkoutPlanWithAI } = await import('./geminiService');
            const aiPlan = await generateWorkoutPlanWithAI(
                profile,
                Math.round(bmi * 10) / 10,
                bmiCategory,
                recommendedLevel,
                recommendedDuration
            );

            // Use AI-generated plan directly
            return {
                recommendedLevel,
                recommendedDuration,
                recommendedTypes,
                weeklyPlan: aiPlan.weeklyPlan, // Use full AI plan with exercises
                bmi: Math.round(bmi * 10) / 10,
                bmiCategory,
                tips: aiPlan.tips,
            };
        } catch (error) {
            console.warn('Failed to generate AI plan, falling back to rule-based:', error);
            // Fall through to rule-based generation
        }
    }

    // Rule-based generation (fallback or when AI is disabled)
    const weeklyPlan = [
        {
            day: 1,
            workouts: goal === "relaxation" ? ["meditation"] : ["yoga"],
            focus: "Khởi động nhẹ nhàng",
        },
        {
            day: 2,
            workouts: ["breathing"],
            focus: "Thở và thư giãn",
        },
        {
            day: 3,
            workouts: goal === "weight_loss" ? ["yoga", "breathing"] : ["yoga"],
            focus: goal === "weight_loss" ? "Đốt cháy calo" : "Tăng cường sức mạnh",
        },
        {
            day: 4,
            workouts: ["meditation"],
            focus: "Nghỉ ngơi và thiền",
        },
        {
            day: 5,
            workouts: ["yoga"],
            focus: "Tăng cường linh hoạt",
        },
        {
            day: 6,
            workouts: goal === "muscle_gain" ? ["yoga"] : ["breathing", "meditation"],
            focus: goal === "muscle_gain" ? "Xây dựng cơ bắp" : "Thư giãn sâu",
        },
        {
            day: 7,
            workouts: ["meditation", "breathing"],
            focus: "Phục hồi và cân bằng",
        },
    ];

    // Generate tips
    const tips: string[] = [];
    if (bmi < 18.5) {
        tips.push("BMI của bạn thấp. Hãy kết hợp tập luyện với chế độ ăn tăng cân lành mạnh.");
    } else if (bmi > 25) {
        tips.push("BMI của bạn cao. Tập luyện đều đặn và ăn uống lành mạnh sẽ giúp bạn giảm cân.");
    }

    if (eatingHabits === "unhealthy") {
        tips.push("Cải thiện thói quen ăn uống sẽ giúp bạn đạt mục tiêu nhanh hơn.");
    }

    if (activityLevel === "sedentary") {
        tips.push("Bắt đầu với cường độ nhẹ và tăng dần theo thời gian.");
    }

    tips.push("Tập luyện đều đặn 3-5 lần/tuần để có kết quả tốt nhất.");
    tips.push("Uống đủ nước và ngủ đủ giấc để cơ thể phục hồi.");

    return {
        recommendedLevel,
        recommendedDuration,
        recommendedTypes,
        weeklyPlan,
        bmi: Math.round(bmi * 10) / 10,
        bmiCategory,
        tips,
    };
}

// Filter workouts based on recommendations
export function filterWorkoutsByRecommendation(
    workouts: Workout[],
    recommendation: RecommendationResult
): Workout[] {
    return workouts.filter((workout) => {
        const matchesLevel = workout.level === recommendation.recommendedLevel;
        const matchesDuration = Math.abs(workout.durationMinutes - recommendation.recommendedDuration) <= 5;
        const matchesType = recommendation.recommendedTypes.some(
            (type) => workout.type.toLowerCase().includes(type.toLowerCase())
        );

        return matchesLevel && matchesDuration && matchesType;
    });
}
