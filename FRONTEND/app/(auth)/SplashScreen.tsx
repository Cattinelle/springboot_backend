import React, { useEffect } from "react";
import { View, Image, Text } from "react-native";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)/Onboarding");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View className="flex-1 bg-[#FBF1E8] items-center justify-center">
      <Image
        source={require("@/assets/images/quicktales_logo.png")}
        className="w-[200px] h-[280px] mb-2.5"
        resizeMode="contain"
          />
          <Text className="tracking-widest text-[30px] font-extrabold font-Montserrat text-secondary">
            QUICKTALES
          </Text>
    </View>
  );
}
