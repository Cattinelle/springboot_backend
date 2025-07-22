import ColoredButton from "@/components/ColoredButton";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  BackHandler,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from "react-native";
import { useAuthStore } from "@/hooks/useAuthStore";

export default function OTPVerification() {
  const router = useRouter();
  const { email, flow, welcome } = useLocalSearchParams<{
    email: string;
    flow: string;
    welcome: string;
  }>();

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false, // disable iOS swipe back
      headerBackVisible: false, // hides back arrow if using header
    });

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true // disables Android back button
    );

    return () => backHandler.remove();
  }, [navigation]);

  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const inputsRefs = useRef([
    React.createRef<TextInput>(),
    React.createRef<TextInput>(),
    React.createRef<TextInput>(),
    React.createRef<TextInput>(),
  ]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const [localError, setLocalError] = useState(false);
  const [countdown, setCountdown] = useState(120); // 2 mins

  // Get auth store
  const { verifyOTP, sendOTP, isLoading, error, clearError } = useAuthStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (/^\d$/.test(value) || value === "") {
      const updated = [...otp];
      updated[index] = value;
      setOtp(updated);
      setLocalError(false);

      if (value && index < 3) {
        inputsRefs.current[index + 1].current?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputsRefs.current[index - 1].current?.focus();
    }
  };

  const validateOTP = (otp: string[]): boolean => {
    const joinedOTP = otp.join("");
    if (otp.some((digit) => digit === "")) {
      Alert.alert("Missing OTP", "Please fill in all 4 digits.");
      return false;
    }

    if (!/^\d{4}$/.test(joinedOTP)) {
      Alert.alert("Invalid OTP", "OTP must be exactly 4 digits.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateOTP(otp)) return;

    const entered = otp.join("");

    try {
      clearError();
      await verifyOTP(email!, entered);

      // If successful, navigate to next step
      router.push({
        pathname: "/(auth)/CreateNewPassword",
        params: { email, flow, welcome },
      });
    } catch (err: any) {
      // Error is handled by the store
      setLocalError(true);
    }
  };

  // Show error alerts when there's an error in the store
  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
      clearError();
    }
  }, [error, clearError]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
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
              {/* Header Text */}
              <View
                className={
                  'gap-1 ${flow === "register" ? pt-[150px] : pt-[167px]} px-4'
                }
              >
                {flow === "register" ? (
                  <>
                    <Text className="text-Heading3 font-Manrope font-bold text-neutral-90">
                      Welcome to{" "}
                      <Text className="text-primary font-bold font-Manrope">
                        QUICKTALES
                      </Text>
                    </Text>
                  </>
                ) : (
                  <>
                    <Text className="text-Heading3 font-Manrope font-bold text-neutral-90">
                      Welcome back 👋
                    </Text>
                  </>
                )}
                {flow === "register" ? (
                  <>
                    <Text className="text-BodyRegular font-Manrope font-medium text-neutral-60 mb-6">
                      Learn something new every day — with short book summaries.
                    </Text>
                  </>
                ) : (
                  <>
                    <Text className="text-BodyRegular font-Manrope font-medium text-neutral-60 mb-6">
                      Good to see you again. Let’s keep learning!
                    </Text>
                  </>
                )}
              </View>

              <View className="bg-neutral-10 flex-1 items-center justify-start gap-6 pt-20 rounded-t-[40px] shadow-sm">
                <View className="flex flex-column items-center gap-3">
                  <Image
                    source={
                      flow === "register"
                        ? require("@/assets/images/verify_otp.png")
                        : require("@/assets/images/forgot_password.png")
                    }
                    className="w-[80px] h-[80px] object-cover"
                  />

                  <View className="gap-2">
                    <Text className="text-center text-Heading3 text-neutral-90 font-Manrope font-bold">
                      {flow === "register" ? "Verify OTP" : "Forgot Password"}
                    </Text>
                    <View className="w-[60%]">
                      <Text className="text-center font-Manrope font-medium text-BodyRegular text-neutral-60 ">
                        Please enter the code sent to{" "}
                        <Text className="text-neutral-90">{email}</Text>
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="w-full items-center gap-6 pb-20">
                  <View className="flex-row gap-3 mb-2">
                    {otp.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={inputsRefs.current[index]}
                        value={digit}
                        onChangeText={(val) => handleChange(index, val)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        onFocus={() => setFocusedIndex(index)}
                        onBlur={() => setFocusedIndex(null)}
                        className={`w-16 h-[70px] text-Heading3 text-center border font-Manrope font-medium rounded-lg
                          ${
                            localError
                              ? "border-secondary"
                              : focusedIndex === index
                                ? "border-primary"
                                : "border-neutral-40"
                          }`}
                      />
                    ))}
                  </View>
                  {localError && (
                    <Text className="text-secondary font-Manrope font-medium text-BodyRegular">
                      Verification failed. Please try again.
                    </Text>
                  )}

                  <View className="flex w-[90%] mx-auto items-center">
                    <ColoredButton
                      text={isLoading ? "Verifying..." : "Submit"}
                      btnClassName="w-full py-3"
                      textClassName=""
                      disabled={countdown === 0 || isLoading}
                      onPress={handleSubmit}
                      icon={
                        isLoading ? (
                          <ActivityIndicator color="#fff" />
                        ) : undefined
                      }
                    />
                  </View>
                  <View>
                    <Text className="text-center text-BodyRegular font-Manrope font-medium text-neutral-80 ">
                      Didn't Receive OTP?
                    </Text>
                    <View className="flex flex-row justify-center mt-2">
                      <TouchableOpacity
                        onPress={async () => {
                          if (countdown === 0) {
                            try {
                              clearError();
                              await sendOTP(email!);
                              setCountdown(120); // Reset countdown
                              setOtp(["", "", "", ""]); // Clear OTP fields
                              setLocalError(false);
                            } catch (err: any) {
                              // Error is handled by the store
                            }
                          }
                        }}
                        disabled={countdown > 0 || isLoading}
                      >
                        <Text
                          className={`font-Manrope font-semibold text-center text-BodyRegular ${
                            countdown > 0 || isLoading
                              ? "text-neutral-50"
                              : "text-secondary"
                          }`}
                        >
                          Resend
                        </Text>
                      </TouchableOpacity>
                      <Text className="font-Manrope font-semibold text-BodyRegular text-neutral-70">
                        {" "}
                        -{" "}
                        {countdown > 0
                          ? `${Math.floor(countdown / 60)}:${String(
                              countdown % 60
                            ).padStart(2, "0")}`
                          : "00:00"}
                      </Text>
                    </View>
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
