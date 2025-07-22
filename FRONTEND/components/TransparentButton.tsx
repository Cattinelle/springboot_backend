import React from "react";
import {
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface TransparentButtonProps {
  text: string;
  textClassName: string;
  style?: StyleProp<ViewStyle | TextStyle>;
  nativewindStyle?: string;
  disabled?: boolean;
  onPress: () => void;
  icon?: React.ReactNode; // New prop for icon
}

const TransparentButton: React.FC<TransparentButtonProps> = ({
  text,
  textClassName,
  style,
  nativewindStyle,
  disabled = false,
  onPress,
  icon,
}) => {
  return (
    <Pressable onPress={onPress} disabled={disabled} className="w-fit">
      {({ pressed }) => (
        <View
          className={`${nativewindStyle} flex-row rounded-lg items-center justify-center ${pressed ? "bg-primary/5" : "bg-transparent"} border border-primary`}
          style={style as StyleProp<ViewStyle>}
        >
          {icon && <View className="mr-1.5">{icon}</View>}
          <Text className={`text-center text-primary font-Manrope ${textClassName}`}>
            {text}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

export default TransparentButton;
