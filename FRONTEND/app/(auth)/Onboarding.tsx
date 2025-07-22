import ColoredButton from "@/components/ColoredButton";
import OnBoardingTextBox from "@/components/OnboardingTextBox";
import PageIndicator from "@/components/PageIndicator";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Image, ImageBackground, View } from "react-native";
type ScreenData = {
  title: string;
  description: string;
  image: any;
};

const screens: ScreenData[] = [
  {
    image: require("@/assets/images/onboarding1.jpg"),
    title: "Get Smarter in Just 15 Minutes",
    description: "Quick, powerful book takeaways anytime you want to grow.",
  },
  {
    image: require("@/assets/images/onboarding2.jpg"),
    title: "Make Learning a Daily Habit",
    description: "Short lessons delivered daily to keep you growing.",
  },
  {
    image: require("@/assets/images/onboarding3.jpg"),
    title: "Read or Listen Anywhere",
    description: "At home or on the go — your learning stays with you.",
  },
];

export default function Onboarding() {
  const [index, setIndex] = useState<number>(0);

  const nextScreen = () => {
    if (index < screens.length - 1) {
      setIndex(index + 1);
    } else {
      router.replace("/SelectCategory"); // Navigate to Select Category screen
    }
  };

  const { title, description, image } = screens[index];

  return (
    <ImageBackground
      source={require("@/assets/images/vectorbg.png")}
      resizeMode="cover"
      className="flex-1 "
      imageStyle={{ opacity: 0.02 }}
    >
      <StatusBar style="light" />
      <View className="flex-1 items-center gap-8 font-Manrope">
        {/* Image */}
        <View className="h-[60%] w-full items-center overflow-hidden">
          <Image
            source={image}
            className="h-[100%] w-full rounded-b-[20px] object-fit-cover"
          />
        </View>
        {/* Main Content */}
        <View className="h-[27%] w-full justify-center items-center gap-8 px-4">
          {/* TextBox */}
          <OnBoardingTextBox title={title} description={description} />
          {/* Page Indicator */}
          <PageIndicator index={index} screens={screens} />
          {/* Button */}
          <View className="flex w-full items-center justify-end gap-4">
            <ColoredButton
              text={index === screens.length - 1 ? "Get Started" : "Next"}
              btnClassName="w-[90%] py-3"
              textClassName=""
              onPress={nextScreen}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}
