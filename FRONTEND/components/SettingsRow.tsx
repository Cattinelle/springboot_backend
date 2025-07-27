import { Text, TouchableOpacity } from "react-native";
import { Entypo, Feather } from "@expo/vector-icons";
import { ReactNode } from "react";

type SettingsRowProps = {
  leftIcon: ReactNode;
  text: string;
  onPress: () => void;
  rightIcon?: ReactNode;
};

const SettingsRow = ({
  leftIcon,
  text,
  onPress,
  rightIcon,
}: SettingsRowProps) => (
  <TouchableOpacity
    className="flex-row items-center bg-white rounded-xl py-5 px-4 mb-1.5 border border-gray-100 shadow-black-shadow"
    onPress={onPress}
  >
    {leftIcon}
    <Text className="flex-1 text-neutral-90 ml-2 text-[15px] font-Manrope font-semibold">
      {text}
    </Text>
    {rightIcon ?? (
      <Entypo
        name="chevron-thin-right"
        size={18}
        color="#9E9E9E"
        className="ml-2"
      />
    )}
  </TouchableOpacity>
);
export default SettingsRow;
