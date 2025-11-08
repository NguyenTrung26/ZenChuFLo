// src/screens/profile/HelpScreen.tsx
import React from "react";
import StaticScreen, {
  Title,
  Paragraph,
  ListItem,
} from "../../components/common/StaticScreen";

const HelpScreen = () => {
  return (
    <StaticScreen>
      <Title>Trung tâm Trợ giúp</Title>
      <Paragraph>
        Chào mừng bạn đến với Trung tâm Trợ giúp của chúng tôi. Tìm câu trả lời
        cho các câu hỏi thường gặp và các mẹo để tận dụng tối đa ứng dụng.
      </Paragraph>
      <Paragraph>Cập nhật lần cuối: 26/10/2025</Paragraph>

      <Title>Câu hỏi Thường gặp (FAQs)</Title>

      <Paragraph>Làm cách nào để đặt lại mật khẩu của tôi?</Paragraph>
      <ListItem>
        Bạn có thể đặt lại mật khẩu của mình bằng cách đi tới 'Hồ sơ' '&gt' 'Cài
        đặt' '&gt' 'Thay đổi Mật khẩu'.
      </ListItem>

      <Paragraph>Làm cách nào để hủy đăng ký của tôi?</Paragraph>
      <ListItem>
        Việc hủy đăng ký được quản lý thông qua App Store hoặc Google Play Store
        trong phần cài đặt tài khoản của bạn.
      </ListItem>

      <Paragraph>Ứng dụng có hoạt động ngoại tuyến không?</Paragraph>
      <ListItem>
        Có, bạn có thể tải xuống các buổi tập yêu thích của mình để truy cập
        ngoại tuyến.
      </ListItem>

      <Title>Liên hệ với chúng tôi</Title>
      <Paragraph>
        Nếu bạn không thể tìm thấy câu trả lời ở đây, vui lòng liên hệ với nhóm
        hỗ trợ của chúng tôi.
      </Paragraph>
      <ListItem>
        Gửi email cho chúng tôi tại: support@yogameditation.app
      </ListItem>
      <ListItem>
        Chúng tôi mong muốn trả lời tất cả các câu hỏi trong vòng 48 giờ.
      </ListItem>
    </StaticScreen>
  );
};

export default HelpScreen;
