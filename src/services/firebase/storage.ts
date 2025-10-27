// src/services/firebase/storage.ts
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./config";

// Hàm để tải một file (dạng blob) lên Storage
export const uploadImageAndGetURL = async (uri: string, path: string) => {
  try {
    // Chuyển đổi URI của file ảnh thành một đối tượng Blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Tạo một tham chiếu đến vị trí lưu file trên Storage
    const storageRef = ref(storage, path);

    // Tải blob lên
    const snapshot = await uploadBytes(storageRef, blob);
    console.log("Uploaded a blob or file!");

    // Lấy URL công khai để có thể hiển thị ảnh
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};
