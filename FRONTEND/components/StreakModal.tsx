import StreakIcon from "@/assets/svgs/streak_icon.svg";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

const days = ["S", "M", "T", "W", "T", "F", "S"];

type Props = {
  visible: boolean;
  onClose: () => void;
  streakCount: number;
};

const StreakModal = ({ visible, onClose, streakCount }: Props) => {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      {/* Background */}
      <View className="flex-1 justify-center">
        {/* Overlay */}

        <Pressable onPress={onClose} className="flex-1 absolute top-0 left-0 right-0 bottom-0">
          <BlurView tint="dark" intensity={10} className="flex-1" />
        </Pressable>

        {/* White modal content */}
        <View className="z-20 px-6 pb-10">
          <View className="bg-white w-full rounded-2xl p-6">
            {/* Close Icon */}
            <Pressable
              onPress={onClose}
              className="absolute top-3 right-3 z-10"
              hitSlop={10}
            >
              <Ionicons name="close" size={24} color="black" />
            </Pressable>

            {/* Flame Icon */}
            <View className="items-center mt-2">
              <StreakIcon width={90} height={110} />
              <Text className="text-Heading3 font-bold text-neutral-100 mt-3 font-Manrope">
                {streakCount}-day streak
              </Text>
            </View>

            <View className="rounded-xl border border-neutral-40 bg-neutral-10 mt-4">
              {/* Days Row */}
              <View className="flex-row justify-center gap-2 mt-4 border-b border-neutral-40">
                {days.map((day, index) => (
                  <View
                    key={index}
                    className={`w-9 h-9 bg-neutral-10 rounded-full border justify-center items-center mb-3 ${
                      index < streakCount
                        ? "border-secondary"
                        : "border-neutral-40"
                    }`}
                  >
                    <Text
                      className={`font-medium font-Manrope text-sm ${
                        index < streakCount
                          ? "text-secondary"
                          : "text-neutral-60"
                      }`}
                    >
                      {day}
                    </Text>
                  </View>
                ))}
              </View>
              {/* Reminder */}
              <Text className="w-[80%] mx-auto text-center font-semibold my-4 text-BodyRegular font-Manrope text-neutral-90">
                Complete{" "}
                <Text className="text-secondary font-semibold">
                  at least one summary every day
                </Text>{" "}
                to keep streak alive
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default StreakModal;
