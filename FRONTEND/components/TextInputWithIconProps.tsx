import React, { useState } from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

interface TextInputWithIconProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputProps?: TextInputProps;
  secureTextEntry?: boolean;
  showValidationError?: boolean;
  isVerified?: boolean;
  required?: boolean;
}

const TextInputWithIcon: React.FC<TextInputWithIconProps> = ({
  label,
  value,
  onChangeText,
  placeholder = "",
  leftIcon,
  rightIcon,
  inputProps = {},
  secureTextEntry = false,
  showValidationError = false,
  isVerified = false,
  required = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      className={`flex-row w-[90%] h-[60px] py-2 px-5 items-center mx-auto gap-3 rounded-[32px] ${
        isFocused ? "border-primary" : "border-neutral-40"
      } border`}
    >
      {leftIcon}
      <View className="flex-1 gap-1">
        <View className="flex-row items-center gap-1.5">
          <Text className="text-[13px] font-Manrope font-semibold text-primary">
            {label}
          </Text>
          {required && (
            <View className="w-1.5 h-1.5 bg-secondary rounded-full"></View>
          )}
          {isVerified && (
            <Text className="text-[10px] font-Manrope text-secondary bg-tertiary font-semibold px-[10px] py-[3px] rounded-full">
              Verified
            </Text>
          )}
        </View>
        <View className="flex-row justify-between items-center">
          <TextInput
            placeholder={placeholder}
            autoCapitalize="none"
            className="text-BodySmallRegular font-Manrope font-medium text-neutral-70 flex-1"
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            secureTextEntry={secureTextEntry}
            {...inputProps}
          />
          {rightIcon}
        </View>
      </View>
    </View>
  );
};

export default TextInputWithIcon;
