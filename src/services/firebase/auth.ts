import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from './config';

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// Chúng ta sẽ xây dựng hàm signUp sau
// export const signUpWithEmail = ...
// --- HÀM MỚI ---
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
) => {
  try {
    // 1. Tạo người dùng trong Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Tạo một document mới trong collection 'users' của Firestore
    // Đây là nơi chúng ta lưu trữ tất cả thông tin bổ sung của người dùng
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      displayName,
      photoURL: null,
      createdAt: Timestamp.now(),
      onboarding: {
        completed: false, // Người dùng chưa hoàn thành onboarding
      },
      stats: {
        totalMinutes: 0,
        totalSessions: 0,
        currentStreak: 0,
        longestStreak: 0,
      },
      // Thêm các cài đặt mặc định khác nếu cần
    });

    return { user, error: null };
  } catch (error: any) {
    // Xử lý các lỗi phổ biến từ Firebase
    let errorMessage = "Đã xảy ra lỗi. Vui lòng thử lại.";
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Địa chỉ email này đã được sử dụng.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Địa chỉ email không hợp lệ.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu khác mạnh hơn.';
    }
    return { user: null, error: errorMessage };
  }
};
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};