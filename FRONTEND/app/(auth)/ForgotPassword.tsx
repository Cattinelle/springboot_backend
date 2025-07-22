import ColoredButton from "@/components/ColoredButton";
import { Fontisto } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from "react-native";
import { useAuthStore } from "@/hooks/useAuthStore";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  // Get auth store
  const { forgotPassword, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async () => {
    const isValid = validateEmail();
    if (!isValid) return;

    try {
      clearError();
      await forgotPassword(email.trim());
      
      // Navigate to OTP verification
      router.push({
        pathname: "/(auth)/OTPVerification",
        params: { email: email.toLowerCase(), flow: "reset" },
      });
    } catch (err: any) {
      // Error is handled by the store
    }
  };

  // Show error alerts when there's an error in the store
  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
      clearError();
    }
  }, [error, clearError]);

  // Validation functions
  const validateEmail = () => {
    if (!email.trim()) {
      Alert.alert("Missing Email", "Please enter your email address.");
      return false;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const isValidEmail = (email: string) => {
    const allowedDomains = [
      "gmail.com",
      "yahoo.com",
      "icloud.com",
      "outlook.com",
      "mail.com",
      "hotmail.com",
    ];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) return false;

    const domain = email.split("@")[1];
    return allowedDomains.includes(domain);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 10} // adjust as needed
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ImageBackground
            source={require("@/assets/images/vectorbg.png")}
            resizeMode="cover"
            className="flex-1 bg-neutral-10"
            imageStyle={{ opacity: 0.02 }}
          >
            <View className="flex-1 justify-end gap-4">
              {/* Intro */}
              <View className="gap-1 px-4 pt-[167px]">
                {/* Welcome back */}
                <Text className="text-Heading3 font-Manrope font-bold text-neutral-90">
                  Welcome back 👋
                </Text>
                {/* Sub text */}
                <Text className="text-BodyRegular font-Manrope font-medium text-neutral-60 mb-6">
                  Good to see you again. Let’s keep learning!
                </Text>
              </View>
              {/* Inputs*/}
              <View className="bg-neutral-10 flex-1 items-center justify-start gap-6 pt-20 rounded-t-[40px] shadow-sm">
                {/*Image and title */}
                <View className="flex flex-column items-center gap-3 ">
                  {/* Image */}
                  <Image
                    source={require("@/assets/images/forgot_password.png")}
                    className="w-[80px] h-[80px] object-fit-cover"
                  />
                  <View className="gap-2">
                    <Text className="text-center text-Heading3 text-neutral-90 font-Manrope font-bold">
                      Forgot Password?
                    </Text>
                    <View className="w-[60%]">
                      <Text className="text-center font-Manrope font-medium text-BodyRegular text-neutral-60">
                        We'll send you a code to reset your password.
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Email, Send OTP Btn */}
                <View className="w-full gap-6 pb-400">
                  {/* Email */}
                  <View className="flex-row w-[90%] h-[60px] py-2 px-5 items-center mx-auto gap-3 border border-neutral-40 rounded-[32px]">
                    <Fontisto name="email" size={22} color="#E95B0C" />
                    <View className="flex flex-column gap-1 flex-1">
                      <Text className="text-[13px] font-Manrope font-semibold text-primary">
                        Email Address
                      </Text>
                      <TextInput
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        className="text-BodySmallRegular font-Manrope font-medium text-neutral-70 flex-1 h-fit"
                        value={email}
                        onChangeText={setEmail}
                      />
                    </View>
                  </View>
                  {/* Send OTP Button */}
                  <View className="flex w-[90%] mx-auto items-center">
                    <ColoredButton
                      text={isLoading ? "Sending..." : "Send OTP"}
                      btnClassName="w-full py-3"
                      textClassName=""
                      onPress={handleSubmit}
                      disabled={isLoading}
                      icon={
                        isLoading ? <ActivityIndicator color="#fff" /> : undefined
                      }
                    />
                  </View>
                </View>
              </View>
            </View>
          </ImageBackground>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
