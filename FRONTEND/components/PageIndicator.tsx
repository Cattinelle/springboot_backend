import { View, Text } from 'react-native'
import React from 'react'

type PageIndicatorProps = {
    index: number;
    screens: object[];
  };
  
const PageIndicator = ({index, screens}: PageIndicatorProps) => {
  return (
   <View className="flex flex-row items-center gap-2">
             {screens.map((_, i) => (
               <View
                 key={i}
                 className={`h-[8px] w-[8px] rounded-full ${
                   index === i ? 'bg-primary' : 'bg-neutral-40'
                 }`}
               />
             ))}
           </View>
  )
}

export default PageIndicator