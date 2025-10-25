import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from "react-native";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { COLORS } from "../../constants/colors";
import { FONT_SIZES, FONT_WEIGHTS } from "../../constants/typography";
import { signInWithEmail } from "../../services/firebase/auth";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";

// Định nghĩa props cho màn hình
type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, "Login">;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }
    setLoading(true);
    const { user, error } = await signInWithEmail(email, password);
    setLoading(false);

    if (error) {
      Alert.alert("Đăng nhập thất bại", "Email hoặc mật khẩu không chính xác.");
      console.error(error);
    }
    // Khi thành công, useAuth hook sẽ tự động phát hiện và AppNavigator sẽ chuyển màn hình
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Yoga & Meditation</Text>
        <Text style={styles.subtitle}>Tìm bình yên trong bạn</Text>

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="nhapemail@gmail.com"
        />
        <Input
          label="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="********"
        />

        <Button
          title="Đăng nhập"
          onPress={handleLogin}
          loading={loading}
          gradient
          style={{ marginTop: 20 }}
        />

        {/* Phần chuyển sang Signup */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.signupLink}>Đăng ký ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.creamWhite,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: FONT_SIZES.display,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.charcoal,
    textAlign: "center",
  },
  subtitle: {
    fontSize: FONT_SIZES.body,
    color: COLORS.lightGray,
    textAlign: "center",
    marginBottom: 40,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  signupText: {
    fontSize: FONT_SIZES.body,
    color: COLORS.charcoal,
  },
  signupLink: {
    fontSize: FONT_SIZES.body,
    color: COLORS.deepPurple,
    fontWeight: FONT_WEIGHTS.bold,
  },
});

export default LoginScreen;
