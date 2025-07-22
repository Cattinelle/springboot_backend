import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";

interface SetTargetSectionProps {
  goal: number | null;
  onSetGoal: (goal: number) => void;
  progress?: number; // e.g. books completed this week
}

const SetTargetSection: React.FC<SetTargetSectionProps> = ({
  goal,
  onSetGoal,
  progress = 0,
}) => {
  // step: 'empty' | 'input' | 'set' | 'update'
  const [step, setStep] = useState<"empty" | "input" | "set" | "update">(
    goal == null ? "empty" : "set"
  );
  const [inputValue, setInputValue] = useState("");

  // 1. First login, no goal set
  if (step === "empty") {
    return (
      <View className="p-4 flex-row justify-center items-center mx-auto gap-4 w-[70%]">
        <Text className="text-[70px]">📝</Text>

        <View className="justify-center">
          <Text className="font-bold font-Manrope text-neutral-100 text-BodyRegular mb-1">
            Set your Weekly Goal
          </Text>
          <Text className="text-neutral-70 font-Manrope font-medium text-BodySmallRegular mb-2">
            Stay consistent and measure your progress
          </Text>
          <TouchableOpacity
            onPress={() => setStep("input")}
            activeOpacity={0.6}
            hitSlop={10}
          >
            <Text className="text-primary font-Manrope font-bold text-BodySmallRegular">
              Set Target
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 2. Input for goal
  if (step === "input") {
    const isDisabled =
      !inputValue || isNaN(Number(inputValue)) || Number(inputValue) <= 0;
    return (
      <View className="p-4 flex-row justify-center items-center mx-auto gap-4 w-[95%]">
        <Text className="text-[70px]">📝</Text>
        <View className="flex-1 justify-center">
          <Text className="font-bold font-Manrope text-neutral-100 text-BodyRegular mb-1">
            What's your reading goal for this week?
          </Text>
          <View className="flex-row items-center mb-2 gap-1.5">
            <TextInput
              className="w-16 h-8 border border-neutral-60 rounded-[5px] px-[5px] py-[5px] text-BodySmallRegular bg-transparent"
              keyboardType="numeric"
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="0"
              placeholderTextColor="#888"
            />
            <Text className="text-BodySmallRegular font-Manrope font-medium text-neutral-100">
              books
            </Text>
          </View>
          <TouchableOpacity
            className="self-start"
            disabled={isDisabled}
            activeOpacity={0.6}
            hitSlop={10}
            style={{ opacity: isDisabled ? 0.5 : 1 }}
            onPress={() => {
              onSetGoal(Number(inputValue));
              setInputValue("");
              setStep("set");
            }}
          >
            <Text className="text-primary font-Manrope font-bold text-BodySmallRegular">
              Add Target
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 3. Goal set, show progress
  if (step === "set") {
    const progressPercentage =
      goal && goal > 0 ? Math.min((progress / goal) * 100, 100) : 0;

    return (
      <View className="p-4 flex-row justify-center items-center mx-auto gap-4 w-[95%]">
        <Text className="text-[70px]">🎯</Text>

        <View className="flex-1 justify-center">
          <Text className="font-bold font-Manrope text-neutral-100 text-BodyRegular mb-1">
            This Week's Goal
          </Text>
          <Text className="text-neutral-70 font-Manrope font-medium text-BodySmallRegular mb-2">
            You're on track – keep the pages turning
          </Text>

          {/* Progress Bar */}
          <View className="mb-2">
            <View className="w-2/3 h-[5px] bg-neutral-30 rounded-full overflow-hidden">
              <View
                className="h-full bg-primary rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </View>
          </View>

          <Text className="text-neutral-100 font-Manrope font-medium text-BodySmallRegular mb-2">
            {progress} of {goal} completed
          </Text>
          <TouchableOpacity onPress={() => setStep("update")}>
            <Text className="text-primary font-Manrope font-bold text-BodySmallRegular">
              Update Goal
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 4. Update goal
  if (step === "update") {
    const isDisabled =
      !inputValue || isNaN(Number(inputValue)) || Number(inputValue) <= 0;
    return (
      <View className="p-4 flex-row justify-center items-center mx-auto gap-4 w-[85%]">
        <Text className="text-[65px]">🎯</Text>

        <View className="flex-1 justify-center">
          <Text className="font-bold font-Manrope text-neutral-100 text-BodyRegular mb-1">
            Update number of books for this week
          </Text>
          <Text className="text-neutral-70 font-Manrope font-medium text-BodySmallRegular mb-2">
            Currently reading{" "}
            <Text className="text-neutral-100 font-Manrope font-medium text-BodySmallRegular">
              {goal}
            </Text>{" "}
            books
          </Text>
          <View className="flex-row items-center mb-2 gap-1.5">
            <TextInput
              className="w-16 h-8 border border-neutral-60 rounded-[5px] px-[5px] py-[5px] text-BodySmallRegular bg-transparent"
              keyboardType="numeric"
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="0"
              placeholderTextColor="#888"
            />
            <Text className="text-BodySmallRegular font-Manrope font-medium text-neutral-100">
              books
            </Text>
          </View>
          <TouchableOpacity
            className="self-start"
            disabled={isDisabled}
            style={{ opacity: isDisabled ? 0.5 : 1 }}
            onPress={() => {
              onSetGoal(Number(inputValue));
              setInputValue("");
              setStep("set");
            }}
          >
            <Text className="text-primary font-Manrope font-bold text-BodySmallRegular">
              Save Changes
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return null;
};

export default SetTargetSection;
