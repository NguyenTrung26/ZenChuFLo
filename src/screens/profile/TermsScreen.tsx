import React from "react";
import StaticScreen, {
  Title,
  SubTitle,
  Paragraph,
  ListItem,
  Highlight,
  InfoBox,
} from "../../components/common/StaticScreen";

const TermsScreen = () => {
  return (
    <StaticScreen>
      <Title>Điều khoản & Chính sách</Title>
      <Paragraph>Cập nhật lần cuối: 26 tháng 10, 2025</Paragraph>

      <SubTitle>Điều khoản Dịch vụ</SubTitle>
      <Paragraph>
        Chào mừng bạn đến với <Highlight>ZenFlow</Highlight>. Bằng cách truy cập
        hoặc sử dụng ứng dụng của chúng tôi, bạn đồng ý bị ràng buộc bởi các
        điều khoản và điều kiện này.
      </Paragraph>

      <ListItem icon="person-circle-outline">
        Bạn phải đủ 13 tuổi để sử dụng ứng dụng này. Nếu bạn dưới 18 tuổi, bạn
        phải có sự cho phép của cha mẹ hoặc người giám hộ.
      </ListItem>
      <ListItem icon="shield-checkmark-outline">
        Bạn chịu trách nhiệm bảo mật thông tin tài khoản của mình và cho mọi
        hoạt động xảy ra dưới tài khoản đó.
      </ListItem>
      <ListItem icon="document-text-outline">
        Tất cả nội dung trong ứng dụng, bao gồm các bài tập, video và văn bản,
        là tài sản của chúng tôi và được bảo vệ bởi luật bản quyền.
      </ListItem>

      <SubTitle>Chính sách Bảo mật</SubTitle>
      <Paragraph>
        Chúng tôi cam kết bảo vệ quyền riêng tư của bạn. Chính sách này mô tả
        cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.
      </Paragraph>
      <ListItem icon="mail-outline">
        Chúng tôi thu thập thông tin bạn cung cấp khi đăng ký, như tên và địa
        chỉ email, để cá nhân hóa trải nghiệm của bạn.
      </ListItem>
      <ListItem icon="analytics-outline">
        Chúng tôi thu thập dữ liệu ẩn danh về hoạt động của bạn (ví dụ: các bài
        tập đã hoàn thành) để cải thiện và phát triển các tính năng mới.
      </ListItem>
      <ListItem icon="lock-closed-outline">
        Chúng tôi không bao giờ bán hoặc chia sẻ thông tin cá nhân của bạn với
        bên thứ ba mà không có sự đồng ý của bạn.
      </ListItem>

      {/* Khối thông tin nổi bật */}
      <InfoBox icon="warning-outline">
        Tuyên bố miễn trừ trách nhiệm Y tế: Ứng dụng này cung cấp thông tin về
        sức khỏe và thể chất chỉ cho mục đích giáo dục. Nội dung này không nhằm
        mục đích thay thế cho lời khuyên, chẩn đoán hoặc điều trị y tế chuyên
        nghiệp.
      </InfoBox>

      <SubTitle>Liên hệ</SubTitle>
      <Paragraph>
        Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ
        với chúng tôi qua email: <Highlight>support@zenflow.app</Highlight>
      </Paragraph>
    </StaticScreen>
  );
};

export default TermsScreen;
