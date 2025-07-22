import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ColoredButtonProps {
  text: string;
  btnClassName?: string;
  textClassName?: string;
  disabled?: boolean;
  onPress: () => void;
  icon?: React.ReactNode; // New prop for icon
}

const ColoredButton: React.FC<ColoredButtonProps> = ({
  text,
  btnClassName,
  textClassName,
  disabled = false,
  onPress,
  icon,
}) => {
  return (
    <TouchableOpacity
      onPress={!disabled ? onPress : undefined}
      activeOpacity={0.9}
      disabled={disabled}
      className={`${disabled ? "bg-neutral-30" : "bg-primary"} rounded-lg items-center justify-center ${btnClassName}`}
    >
      <View className="flex-row items-center justify-center">
        {icon && <View className="mr-2">{icon}</View>}
        <Text
          className={`font-bold font-Manrope  ${disabled ? "text-neutral-60" : "text-neutral-10"} text-center text-BodyBold ${textClassName}`}
        >
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ColoredButton;
