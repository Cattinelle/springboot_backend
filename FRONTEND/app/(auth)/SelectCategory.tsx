import ColoredButton from "@/components/ColoredButton";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ImageBackground, Text, TouchableOpacity, View } from "react-native";

const categories = [
  "Motivation & Self help",
  "Learning & Education",
  "Business & Productivity",
  "Self-Growth",
  "Leadership",
  "Relationships & Love",
  "Finance & Investing",
  "Societies & Tech",
];

const SelectCategory = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  const toggleCategory = (category: string) => {
    setSelected((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };
  const handleContinue = async () => {
    if (selected.length === 0) {
      Alert.alert("Please select at least one category");
      return;
    }

    // Temporarily skip sending to backend
    console.log("Selected Categories:", selected);

    // TODO: Uncomment and use this once your backend is ready
    // try {
    //   await fetch("http://YOUR_API_URL/api/user/categories", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       // Include auth token if needed
    //     },
    //     body: JSON.stringify({ categories: selected }),
    //   });

    //   router.replace("/Login"); // Navigate to Login tab
    // } catch (error) {
    //   console.error("Error saving categories:", error);
    //   Alert.alert("Failed to save categories");
    // }

    // Temporary route
    // router.replace("/Login"); // Replace with actual destination
    router.push("/(auth)/Login");
  };

  return (
    <ImageBackground
      source={require("@/assets/images/vectorbg.png")}
      resizeMode="cover"
      className="flex-1 bg-neutral-10 "
      imageStyle={{ opacity: 0.02 }}
    >
      <View className="flex-1 justify-center items-center px-4 gap-5 font-Manrope">
        {/* Header */}
        <View className="w-[95%] mx-auto">
          <Text className="text-Heading3 font-Manrope font-bold text-neutral-90 ">
            What do you love to read?
          </Text>
          <Text className="text-BodyRegular font-Manrope font-medium text-neutral-60 mt-2 mb-6">
            Choose the genres that interest you. We’ll recommend the best books
            to match your vibe.
          </Text>
        </View>

        {/* Categories */}
        <View className="flex flex-wrap flex-row justify-center gap-3">
          {categories.map((cat, index) => {
            const isSelected = selected.includes(cat);
            return (
              <TouchableOpacity
                key={index}
                onPress={() => toggleCategory(cat)}
                className={`w-[100px] h-[100px] rounded-full border justify-center items-center ${
                  isSelected
                    ? "bg-primary border-primary"
                    : "bg-transparent border-primary"
                }`}
              >
                <Text
                  className={`text-center font-Manrope font-medium text-BodySmallRegular px-2 ${
                    isSelected ? "text-neutral-10" : "text-primary"
                  }`}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Button */}
        <View className="flex w-full items-center mt-8">
          <ColoredButton
            text="Next"
            btnClassName="w-[90%] py-3"
            textClassName=""
            onPress={handleContinue}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

export default SelectCategory;
