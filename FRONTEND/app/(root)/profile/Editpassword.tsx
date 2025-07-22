import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import TextInputWithIcon from "@/components/TextInputWithIconProps";

const SetPassword = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    // Mock: password must be 'password123' to succeed
    if (password !== "password123") {
      setError(true);
    } else {
      setError(false);
      // Proceed to next step or show success
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white justify-center items-center px-6">
      {/* Close Button */}
      <TouchableOpacity
        className="absolute top-12 right-6 z-10"
        onPress={() => router.back()}
      >
        <Ionicons name="close" size={28} color="#222" />
      </TouchableOpacity>
      {/* Lock Image */}
      <View className="items-center mb-6 mt-10">
        <Image
          source={require("@/assets/images/new_password.png")}
          className="w-24 h-24"
          resizeMode="contain"
        />
      </View>
      {/* Title */}
      <Text className="text-xl font-bold text-center mb-2 text-neutral-100">
        Enter Your Current Password
      </Text>
      {/* Password Input */}
      <View
        className={`w-full flex-row items-center border rounded-lg px-3 py-2 mt-6 mb-2 ${error ? "border-red-500" : "border-neutral-30"}`}
      >
        <Feather name="lock" size={20} color={error ? "#F44336" : "#757575"} />
        <TextInput
          className="flex-1 ml-2 text-base text-neutral-90"
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
          <Feather
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color="#757575"
          />
        </TouchableOpacity>
      </View>

      <TextInputWithIcon
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        leftIcon={
          <MaterialIcons name="lock-outline" size={22} color="#E95B0C" />
        }
        rightIcon={
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color="#9E9E9E"
            />
          </TouchableOpacity>
        }
        inputProps={{ secureTextEntry: !showPassword }}
      />
      {/* Error Message */}
      {error && (
        <Text className="text-red-500 text-xs w-full mb-2 ml-1">
          Incorrect Password!
        </Text>
      )}
      {/* Submit Button */}
      <TouchableOpacity
        className="w-full bg-primary rounded-lg py-3 mt-2 items-center"
        onPress={handleSubmit}
      >
        <Text className="text-white font-bold text-base">Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SetPassword;
