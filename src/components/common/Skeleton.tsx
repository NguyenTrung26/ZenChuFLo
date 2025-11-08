// src/components/common/Skeleton.tsx
import React from "react";
import { Dimensions, ViewStyle } from "react-native";
import { MotiView } from "moti";
import { COLORS } from "../../constants/colors";

interface SkeletonProps {
  width: number | string; // có thể là number hoặc "100%"...
  height: number;
  borderRadius?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  borderRadius = 8,
}) => {
  const screenWidth = Dimensions.get("window").width;

  // Convert string % thành number, ví dụ "100%" => screenWidth
  const resolvedWidth: number =
    typeof width === "string" && width.endsWith("%")
      ? (parseFloat(width) / 100) * screenWidth
      : (width as number); // nếu là number thì dùng thẳng

  const style: ViewStyle = {
    width: resolvedWidth,
    height,
    borderRadius,
    backgroundColor: COLORS.warmGray, // fallback màu
  };

  return (
    <MotiView
      from={{ backgroundColor: COLORS.warmGray }}
      animate={{ backgroundColor: "#E5E5E5" }}
      transition={{
        type: "timing",
        duration: 1000,
        loop: true,
      }}
      style={style}
    />
  );
};

export default Skeleton;
