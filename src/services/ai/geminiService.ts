// Gemini AI Service for generating personalized workout plans
import { GoogleGenerativeAI } from '@google/generative-ai';
import { HealthProfile } from '../../types';

// Initialize Gemini AI
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

// Debug log để kiểm tra xem Key có được load không (chỉ hiện 4 ký tự đầu để bảo mật)
if (!API_KEY) {
    console.error('❌ LỖI: Không tìm thấy API Key! Vui lòng kiểm tra file .env');
} else {
    console.log(`✅ Đã tìm thấy API Key: ${API_KEY.substring(0, 4)}...`);
}

const genAI = new GoogleGenerativeAI(API_KEY);

export interface Exercise {
    name: string;
    type: 'yoga' | 'meditation' | 'breathing';
    duration: string;
    calories?: string;
    instructions: string[];
    benefits: string;
}

interface GeminiWorkoutPlan {
    weeklyPlan: {
        day: number;
        exercises: Exercise[];
        focus: string;
        details?: string;
    }[];
    tips: string[];
}

/**
 * Generate personalized workout plan using Gemini AI
 */
export async function generateWorkoutPlanWithAI(
    profile: HealthProfile,
    bmi: number,
    bmiCategory: string,
    recommendedLevel: string,
    recommendedDuration: number
): Promise<GeminiWorkoutPlan> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const prompt = `
Bạn là chuyên gia huấn luyện Yoga và Thiền định. Hãy tạo một kế hoạch tập luyện 7 ngày cá nhân hóa dựa trên thông tin sau:

**Thông tin người dùng:**
- Tuổi: ${profile.age || 'không rõ'}
- Giới tính: ${profile.gender === 'male' ? 'Nam' : profile.gender === 'female' ? 'Nữ' : 'Khác'}
- Cân nặng: ${profile.weight || 'không rõ'} kg
- Chiều cao: ${profile.height || 'không rõ'} cm
- BMI: ${bmi} (${bmiCategory})
- Mục tiêu: ${getGoalText(profile.goal)}
- Mức độ hoạt động: ${getActivityLevelText(profile.activityLevel)}
- Thói quen ăn uống: ${getEatingHabitsText(profile.eatingHabits)}
- Cấp độ đề xuất: ${recommendedLevel}
- Thời lượng đề xuất: ${recommendedDuration} phút/ngày

**Yêu cầu:**
1. Tạo lộ trình 7 ngày với các bài tập cụ thể (yoga, meditation, breathing).
2. Mỗi ngày có focus (chủ đề) rõ ràng.
3. Cung cấp hướng dẫn chi tiết từng bước cho mỗi bài tập.

**Format trả về (JSON):**
{
  "weeklyPlan": [
    {
      "day": 1,
      "focus": "Khởi động nhẹ nhàng",
      "details": "Mô tả tổng quan ngày tập",
      "exercises": [
        {
          "name": "Tên bài tập (VD: Chào mặt trời A)",
          "type": "yoga", // hoặc "meditation", "breathing"
          "duration": "10 phút",
          "calories": "50 kcal",
          "instructions": [
            "Bước 1: Đứng thẳng...",
            "Bước 2: Hít vào...",
            "Bước 3: Thở ra..."
          ],
          "benefits": "Lợi ích của bài tập này"
        }
      ]
    },
    ...
  ],
  "tips": [
    "Lời khuyên 1",
    ...
  ]
}

Lưu ý:
- "type" chỉ được là: "yoga", "meditation", "breathing"
- "instructions" phải chi tiết, dễ hiểu, từng bước một.
- Chỉ trả về JSON hợp lệ, không thêm text khác.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Invalid response format from Gemini');
        }

        const parsedData = JSON.parse(jsonMatch[0]);
        return parsedData;

    } catch (error) {
        console.error('Error generating workout plan with Gemini:', error);
        throw error;
    }
}

/**
 * Generate personalized tips using Gemini AI
 */
export async function generateTipsWithAI(
    profile: HealthProfile,
    bmi: number,
    bmiCategory: string
): Promise<string[]> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `
Bạn là chuyên gia sức khỏe và thể hình. Hãy đưa ra 5 lời khuyên thiết thực cho người dùng với thông tin:

- Tuổi: ${profile.age || 'không rõ'}
- BMI: ${bmi} (${bmiCategory})
- Mục tiêu: ${getGoalText(profile.goal)}
- Mức độ hoạt động: ${getActivityLevelText(profile.activityLevel)}
- Thói quen ăn uống: ${getEatingHabitsText(profile.eatingHabits)}

Trả về dưới dạng JSON array:
["Lời khuyên 1", "Lời khuyên 2", "Lời khuyên 3", "Lời khuyên 4", "Lời khuyên 5"]

Lời khuyên phải:
- Cụ thể và dễ thực hiện
- Liên quan đến yoga, thiền, hoặc lối sống lành mạnh
- Ngắn gọn (< 100 ký tự mỗi tip)

Chỉ trả về JSON array, không thêm text khác.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse JSON from response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error('Invalid response format from Gemini');
        }

        const tips = JSON.parse(jsonMatch[0]);
        return tips;

    } catch (error) {
        console.error('Error generating tips with Gemini:', error);
        throw error;
    }
}

// Helper functions to convert enum values to Vietnamese text
function getGoalText(goal?: string): string {
    const goalMap: Record<string, string> = {
        'weight_loss': 'Giảm cân',
        'muscle_gain': 'Tăng cơ',
        'flexibility': 'Tăng sự linh hoạt',
        'relaxation': 'Thư giãn và giảm stress',
    };
    return goalMap[goal || ''] || 'Không xác định';
}

function getActivityLevelText(level?: string): string {
    const levelMap: Record<string, string> = {
        'sedentary': 'Ít vận động',
        'light': 'Vận động nhẹ',
        'moderate': 'Vận động vừa phải',
        'active': 'Vận động nhiều',
    };
    return levelMap[level || ''] || 'Không xác định';
}

function getEatingHabitsText(habits?: string): string {
    const habitsMap: Record<string, string> = {
        'healthy': 'Lành mạnh',
        'normal': 'Bình thường',
        'unhealthy': 'Chưa lành mạnh',
    };
    return habitsMap[habits || ''] || 'Không xác định';
}
