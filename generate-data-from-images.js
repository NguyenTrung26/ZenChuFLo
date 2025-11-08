// generate-data-from-images.js
const fs = require('fs');
const path = require('path');

// 1. ĐỊNH NGHĨA CÁC ĐƯỜNG DẪN
// Thư mục gốc chứa tất cả các bộ sưu tập ảnh yoga
const rootImageDir = path.join(__dirname, 'assets', 'poses');
// Tệp dữ liệu đầu ra
const outputPath = path.join(__dirname, 'src', 'data', 'yoga-data.ts');

const allWorkouts = [];

// 2. TẠO HÀM QUÉT ĐỆ QUY
/**
 * Quét một thư mục để tìm các tệp ảnh, đi sâu vào các thư mục con.
 * @param {string} directory - Thư mục để bắt đầu quét.
 */
function findImagesRecursively(directory) {
    const entries = fs.readdirSync(directory, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            // Nếu là thư mục, tiếp tục quét sâu hơn
            findImagesRecursively(fullPath);
        } else if (/\.(jpg|jpeg|png)$/i.test(entry.name)) {
            // Nếu là tệp ảnh, xử lý nó
            processImageFile(fullPath);
        }
    }
}

// 3. TẠO HÀM XỬ LÝ TỪNG ẢNH
/**
 * Tạo một đối tượng Workout từ đường dẫn của một tệp ảnh.
 * @param {string} imagePath - Đường dẫn đầy đủ đến tệp ảnh.
 */
function processImageFile(imagePath) {
    const id = path.parse(imagePath).name; // Lấy tên file làm ID
    const parentDirName = path.basename(path.dirname(imagePath)); // Tên thư mục cha

    // Tạo title thông minh hơn: 'tree_yoga_pose' -> 'Tree Yoga Pose'
    const title = parentDirName
        .replace(/_/g, ' ') // Thay thế gạch dưới bằng khoảng trắng
        .replace(/\b\w/g, char => char.toUpperCase()); // Viết hoa chữ cái đầu

    // Tạo đường dẫn require() tương đối chính xác từ 'src/data' đến 'assets'
    const relativePath = path.relative(path.join(__dirname, 'src', 'data'), imagePath)
        .replace(/\\/g, '/'); // Đảm bảo dùng dấu gạch chéo '/'

    const workout = {
        id: `local-${parentDirName}-${id}`,
        title: title,
        description: `Mô tả cho ${title} sẽ được cập nhật sớm.`,
        thumbnailUrl: `require('${relativePath}')`,

        // Các trường dữ liệu mẫu khác
        type: 'Yoga',
        level: 'All Levels',
        durationMinutes: Math.floor(Math.random() * 10) + 5,
        videoUrl: "https://videos.pexels.com/video-files/4754028/4754028-hd_1280_720_25fps.mp4",
        rating: (Math.random() * 0.5 + 4.5).toFixed(1),
        reviewCount: Math.floor(Math.random() * 2000) + 500,
    };

    allWorkouts.push(workout);
}

// 4. CHẠY SCRIPT
console.log(`Starting scan in: ${rootImageDir}`);
findImagesRecursively(rootImageDir);
console.log(`Found ${allWorkouts.length} total images.`);

// 5. GHI KẾT QUẢ RA FILE
let fileContent = JSON.stringify(allWorkouts, null, 2);
fileContent = fileContent.replace(/"require\('(.*?)'\)"/g, "require('$1')");

const finalContent = `import { Workout } from '../types';\n\nconst workoutsData: Workout[] = ${fileContent};\n\nexport default workoutsData;\n`;

fs.writeFileSync(outputPath, finalContent);
console.log(`Successfully generated TypeScript data module at: ${outputPath}`);