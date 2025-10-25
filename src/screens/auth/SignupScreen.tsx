// src/screens/auth/SignupScreen.tsx

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
import { signUpWithEmail } from "../../services/firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types"; // tạo tệp này nếu chưa có

type SignupScreenProps = NativeStackScreenProps<AuthStackParamList, "Signup">;

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!displayName || !email || !password) {
      Alert.alert("Thiếu thông tin", "Vui lòng điền đầy đủ các trường.");
      return;
    }

    setLoading(true);
    const { user, error } = await signUpWithEmail(
      email.trim(),
      password,
      displayName
    );
    setLoading(false);

    if (error) {
      Alert.alert("Đăng ký thất bại", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back-outline"
            size={28}
            color={COLORS.charcoal}
          />
        </TouchableOpacity>

        <Text style={styles.title}>Tạo tài khoản</Text>
        <Text style={styles.subtitle}>
          Bắt đầu hành trình chánh niệm của bạn
        </Text>

        <Input
          label="Tên hiển thị"
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Tên của bạn"
          icon="person-outline" // đã thêm icon? string trong InputProps
        />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="nhapemail@gmail.com"
          icon="mail-outline"
        />
        <Input
          label="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Tối thiểu 6 ký tự"
          icon="lock-closed-outline"
        />

        <Button
          title="Đăng Ký"
          onPress={handleSignup}
          loading={loading}
          gradient
          style={{ marginTop: 20 }}
        />

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}>Đăng nhập</Text>
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
    padding: 24,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  title: {
    fontSize: FONT_SIZES.display,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.charcoal,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FONT_SIZES.body,
    color: COLORS.lightGray,
    textAlign: "center",
    marginBottom: 40,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  loginText: {
    fontSize: FONT_SIZES.body,
    color: COLORS.charcoal,
  },
  loginLink: {
    fontSize: FONT_SIZES.body,
    color: COLORS.deepPurple,
    fontWeight: FONT_WEIGHTS.bold,
  },
});

export default SignupScreen;
