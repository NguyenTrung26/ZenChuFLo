import React from "react";
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { FONT_SIZES } from "../../constants/typography";

interface InputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "numeric";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  secureTextEntry?: boolean;
  icon?: string; // hỗ trợ icon
  error?: string; // hỗ trợ hiển thị lỗi
}

const Input: React.FC<InputProps> = ({ label, icon, error, ...props }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        {icon && (
          <Ionicons
            name={icon as any} // ép kiểu cho Ionicons
            size={20}
            color={COLORS.lightGray}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            icon ? { paddingLeft: 40 } : null,
            error ? styles.inputError : null,
          ]}
          placeholderTextColor={COLORS.lightGray}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: FONT_SIZES.caption,
    color: COLORS.charcoal,
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
  },
  icon: {
    position: "absolute",
    left: 12,
    top: 15,
  },
  input: {
    backgroundColor: COLORS.warmGray,
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: FONT_SIZES.body,
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    marginTop: 4,
    fontSize: FONT_SIZES.small,
    color: "red",
  },
});

export default Input;
