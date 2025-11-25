# HƯỚNG DẪN CHUYỂN ĐỔI MARKDOWN SANG WORD

## Phương pháp 1: Sử dụng Pandoc (Khuyến nghị)

### Bước 1: Cài đặt Pandoc
- Tải Pandoc tại: https://pandoc.org/installing.html
- Cài đặt theo hướng dẫn cho Windows

### Bước 2: Chuyển đổi
Mở PowerShell/CMD trong thư mục chứa file và chạy:

```powershell
pandoc BAO_CAO_CUOI_KY.md -o BAO_CAO_CUOI_KY.docx
```

### Bước 3: Tùy chỉnh (Optional)
Để có format đẹp hơn:

```powershell
pandoc BAO_CAO_CUOI_KY.md -o BAO_CAO_CUOI_KY.docx --reference-doc=template.docx
```

## Phương pháp 2: Sử dụng VS Code Extension

### Bước 1: Cài extension
- Mở VS Code
- Tìm và cài extension: "Markdown PDF" hoặc "Markdown All in One"

### Bước 2: Export
- Mở file `BAO_CAO_CUOI_KY.md`
- Nhấn `Ctrl+Shift+P`
- Gõ "Markdown: Export (docx)"
- Chọn vị trí lưu file

## Phương pháp 3: Copy-Paste vào Word

### Bước 1: Mở file Markdown
- Mở `BAO_CAO_CUOI_KY.md` bằng VS Code hoặc text editor

### Bước 2: Preview
- Trong VS Code, nhấn `Ctrl+Shift+V` để xem preview
- Hoặc nhấn vào icon Preview ở góc phải trên

### Bước 3: Copy toàn bộ nội dung
- Select all (`Ctrl+A`) trong preview
- Copy (`Ctrl+C`)

### Bước 4: Paste vào Word
- Mở Microsoft Word
- Paste (`Ctrl+V`)
- Word sẽ tự động format headings, lists, code blocks

### Bước 5: Chỉnh sửa format
- Điều chỉnh font chữ (khuyến nghị: Times New Roman 13pt cho body, 16pt cho headings)
- Thêm page numbers
- Thêm header/footer
- Điều chỉnh margins (2.5cm mỗi bên)
- Thêm page breaks giữa các chương

## Phương pháp 4: Sử dụng Online Converter

### Các trang web hữu ích:
- https://cloudconvert.com/md-to-docx
- https://convertio.co/md-docx/
- https://www.zamzar.com/convert/md-to-docx/

### Các bước:
1. Truy cập một trong các trang trên
2. Upload file `BAO_CAO_CUOI_KY.md`
3. Chọn output format: DOCX
4. Click Convert
5. Download file Word

## Lưu ý sau khi chuyển đổi

### Cần kiểm tra và chỉnh sửa:
- [ ] Trang bìa: Thêm logo trường, khoa
- [ ] Mục lục: Tạo Table of Contents tự động
- [ ] Headings: Đảm bảo đúng cấp độ (Heading 1, 2, 3)
- [ ] Code blocks: Format lại nếu cần
- [ ] Tables: Căn chỉnh và border
- [ ] Page numbers: Thêm số trang
- [ ] Line spacing: 1.5 hoặc theo yêu cầu
- [ ] Font: Times New Roman hoặc Arial
- [ ] Margins: 2.5cm (hoặc theo quy định)
- [ ] Screenshots: Thêm vào Phụ lục B
- [ ] Chữ ký: Thêm vào cuối báo cáo

## Template Word mẫu

Nếu trường có template báo cáo chuẩn:
1. Mở template Word
2. Copy nội dung từ file Markdown đã convert
3. Paste vào đúng vị trí trong template
4. Giữ nguyên format của template

## Công cụ hỗ trợ

### Tạo mục lục tự động trong Word:
1. Đảm bảo tất cả headings đã được style đúng
2. Đặt cursor vào vị trí muốn chèn mục lục
3. References → Table of Contents → Automatic Table

### Thêm số trang:
1. Insert → Page Number
2. Chọn vị trí (Bottom of Page - Plain Number 3)

### Điều chỉnh spacing:
1. Select all (`Ctrl+A`)
2. Home → Line Spacing → 1.5

## Checklist hoàn thiện báo cáo Word

- [ ] Trang bìa đầy đủ thông tin
- [ ] Mục lục tự động
- [ ] Số trang (bắt đầu từ trang Giới thiệu)
- [ ] Header/Footer (tên đồ án, tên sinh viên)
- [ ] Font chữ thống nhất
- [ ] Line spacing 1.5
- [ ] Margins đúng quy định
- [ ] Code blocks được format rõ ràng
- [ ] Tables có border và căn chỉnh đẹp
- [ ] Screenshots chất lượng cao
- [ ] Tài liệu tham khảo đúng format
- [ ] Chữ ký cuối báo cáo
- [ ] Kiểm tra chính tả
- [ ] Export PDF (nếu cần nộp PDF)

## Export PDF từ Word

Sau khi hoàn thiện file Word:
1. File → Save As
2. Chọn "PDF" trong dropdown "Save as type"
3. Click Save

---

**Chúc bạn hoàn thành tốt báo cáo!** 📄✨
