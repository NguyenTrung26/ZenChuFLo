// src/components/common/Card.tsx

import React from "react";
import { View, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { COLORS } from "../../constants/colors";

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  shadow?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  shadow = true,
}) => {
  const cardStyles = [styles.card, shadow ? styles.shadow : {}, style];

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={cardStyles}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyles}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    width: "100%",
  },
  shadow: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // For Android
  },
});

export default Card;
