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
Bạn là chuyên gia huấn luyện Yoga và Thiền định chuyên nghiệp. Hãy tạo một kế hoạch tập luyện 7 ngày CỰC KỲ CHI TIẾT và cá nhân hóa dựa trên thông tin sau:

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

**YÊU CẦU QUAN TRỌNG:**
1. Tạo lộ trình 7 ngày với 2-3 bài tập cụ thể MỖI NGÀY (yoga, meditation, hoặc breathing).
2. Mỗi ngày phải có focus (chủ đề) rõ ràng và details mô tả tổng quan.
3. **QUAN TRỌNG NHẤT**: Mỗi bài tập PHẢI có 5-8 bước hướng dẫn CỰC KỲ CHI TIẾT, dễ hiểu.
4. Mỗi bước hướng dẫn phải dài ít nhất 15-25 từ, mô tả rõ ràng động tác, hơi thở, và cảm giác.
5. Đảm bảo instructions thực tế, có thể thực hiện được, phù hợp với cấp độ ${recommendedLevel}.

**VÍ DỤ BÀI TẬP YOGA CHI TIẾT:**
{
  "name": "Tư thế Chào mặt trời (Surya Namaskar)",
  "type": "yoga",
  "duration": "10 phút",
  "calories": "50 kcal",
  "instructions": [
    "Bước 1: Đứng thẳng ở đầu thảm, hai chân khép lại, hai tay chắp trước ngực ở tư thế cầu nguyện (Pranamasana). Hít thở sâu, tập trung vào hơi thở và cảm nhận sự ổn định của cơ thể.",
    "Bước 2: Hít vào sâu, nâng hai tay lên cao qua đầu, lưng cong nhẹ về phía sau (Hasta Uttanasana). Nhìn lên trời, kéo dài cột sống, cảm nhận sự mở rộng ở ngực.",
    "Bước 3: Thở ra, cúi người về phía trước từ hông, đưa hai tay chạm đất bên cạnh hai bàn chân (Hasta Padasana). Giữ đầu gối thẳng nếu có thể, hoặc gập nhẹ nếu cần.",
    "Bước 4: Hít vào, đưa chân phải ra sau thành tư thế lunge, đầu gối trái gập 90 độ. Nhìn lên trước, giữ lưng thẳng, cảm nhận sự kéo dài ở đùi sau chân phải.",
    "Bước 5: Giữ hơi thở, đưa chân trái ra sau, thành tư thế plank (Dandasana). Giữ cơ thể thẳng từ đầu đến gót chân, kích hoạt cơ bụng và cơ lõi.",
    "Bước 6: Thở ra, hạ đầu gối, ngực và cằm xuống đất (Ashtanga Namaskara). Hông nâng cao, tám điểm chạm đất: hai bàn chân, hai đầu gối, hai bàn tay, ngực và cằm.",
    "Bước 7: Hít vào, trượt người về phía trước thành tư thế rắn hổ mang (Bhujangasana). Nâng ngực lên, vai ra sau, nhìn lên trời, cảm nhận sự kéo dài ở cột sống.",
    "Bước 8: Thở ra, nâng hông lên cao thành tư thế chó úp mặt (Adho Mukha Svanasana). Đẩy gót chân xuống đất, kéo dài cột sống, giữ 3-5 nhịp thở sâu."
  ],
  "benefits": "Tăng cường sức mạnh toàn thân, cải thiện tuần hoàn máu, tăng sự linh hoạt, giảm stress và tăng năng lượng cho cả ngày."
}

**FORMAT TRẢ VỀ (JSON):**
{
  "weeklyPlan": [
    {
      "day": 1,
      "focus": "Khởi động và làm quen",
      "details": "Ngày đầu tiên tập trung vào các động tác cơ bản để làm quen với yoga và thiền. Bắt đầu nhẹ nhàng để cơ thể thích nghi.",
      "exercises": [
        { /* Bài tập 1 với 5-8 bước chi tiết */ },
        { /* Bài tập 2 với 5-8 bước chi tiết */ }
      ]
    },
    // ... 6 ngày còn lại
  ],
  "tips": [
    "Lời khuyên cụ thể 1",
    "Lời khuyên cụ thể 2",
    "Lời khuyên cụ thể 3",
    "Lời khuyên cụ thể 4",
    "Lời khuyên cụ thể 5"
  ]
}

**LƯU Ý QUAN TRỌNG:**
- "type" CHỈ được là: "yoga", "meditation", hoặc "breathing"
- MỖI bài tập PHẢI có TỐI THIỂU 5 bước, TỐI ĐA 8 bước trong "instructions"
- MỖI bước phải dài 15-25 từ, mô tả CỰC KỲ CHI TIẾT
- "details" của mỗi ngày phải dài 20-30 từ
- "benefits" phải cụ thể và thuyết phục
- CHỈ trả về JSON hợp lệ, KHÔNG thêm markdown, code block, hoặc text giải thích
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
