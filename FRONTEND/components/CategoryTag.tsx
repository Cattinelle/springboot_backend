import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { SvgProps } from "react-native-svg";

type Props = {
  label: string;
  Icon: React.FC<SvgProps>;
  onPress: () => void;
};

const CategoryTag = ({ label, Icon, onPress }: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className="border border-neutral-40 bg-neutral-10 rounded-xl px-4 py-5 mr-2 flex-row items-center gap-2"
    >
      <Icon width={20} height={20} />
      <Text className="text-neutral-70 font-Manrope font-medium text-BodySmallRegular">
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryTag;
