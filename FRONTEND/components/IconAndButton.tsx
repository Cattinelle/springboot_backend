import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface IconAndButtonProps {
  text: string;
  textClassName: string; //prop required
  ViewClassName: string;
  //iconName?: string;
  iconName: string;
  iconSize: number;
  iconColor?: string;
  iconFamily:
    | "AntDesign"
    | "Entypo"
    | "FontAwesome"
    | "Ionicons"
    | "MaterialIcons";
  disabled?: boolean;
  onPress: () => void;
}

const getIconComponent = (family: IconAndButtonProps["iconFamily"]) => {
  switch (family) {
    case "AntDesign":
      return AntDesign;
    case "Entypo":
      return Entypo;
    case "FontAwesome":
      return FontAwesome;
    case "Ionicons":
      return Ionicons;
    case "MaterialIcons":
      return MaterialIcons;
    default:
      return AntDesign;
  }
};

const IconAndButton: React.FC<IconAndButtonProps> = ({
  text,
  textClassName,
  ViewClassName,
  iconName,
  iconSize,
  iconColor = "#E95B0C", // Default color for the icon
  iconFamily,
  disabled = false,
  onPress,
}) => {
  const Icon = getIconComponent(iconFamily);

  return (
    <Pressable onPress={onPress} disabled={disabled} className="w-fit">
      {({ pressed }) => (
        <View
          className={`flex flex-row justify-center items-center border border-primary text-center text-primary ${
            pressed ? "bg-primary/5" : "bg-transparent"
          }  ${ViewClassName}`}
        >
          {/* Icon */}
          <Icon
            name={iconName as any}
            size={iconSize || 24}
            color={iconColor}
            className="text-primary"
          />
          {/* Text */}
          <Text className={`text-primary ${textClassName}`}>{text}</Text>
        </View>
      )}
    </Pressable>
  );
};

export default IconAndButton;

// type IconButtonProps = {
//   text: string;
//   textClassName: string; // Text for the button
//   //icon: any; // Path to the icon
//   onPress?: () => void; // Function to handle button press
// };

// const IconAndButton = ({
//   text,
//   textClassName,
//   //icon,
//   onPress,
// }: IconButtonProps) => {
//   return (
//
//   );
// };

// export default IconAndButton;
