import React from 'react';
import { View, Text } from 'react-native';

type TextBoxProps = {
  title: string;
  description: string;
};

export default function TextBox({ title, description }: TextBoxProps) {
  return (
    <View className='flex gap-2 items-center justify-center w-full px-4'>
      <Text className=" text-center font-semibold text-Heading3 text-neutral-90">
        {title}
      </Text>
      <Text className="w-[310px] text-center text-BodyRegular text-neutral-60">
        {description}
      </Text>
    </View>
  );
}
