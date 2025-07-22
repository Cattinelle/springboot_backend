import ColoredButton from "@/components/ColoredButton";
import TextInputWithIcon from "@/components/TextInputWithIconProps";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from "react-native";
import { useAuthStore } from "@/hooks/useAuthStore";

export default function CreateNewPassword() {
  const router = useRouter();
  const { email, flow } = useLocalSearchParams<{
    email: string;
    flow?: string;
  }>();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Get auth store
  const { resetPassword, register, isLoading, error, clearError } =
    useAuthStore();

  const handleSubmit = async () => {
    // 1. Empty and whitespace check
    if (!password.trim() || !confirm.trim()) {
      Alert.alert("Missing Fields", "Please fill in all password fields.");
      return;
    }

    // 2. Length check
    if (password.length < 6) {
      Alert.alert(
        "Password Too Short",
        "Password must be at least 6 characters."
      );
      return;
    }

    // 3. Strength check: at least one uppercase, number, and special char
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Weak Password",
        "Password must contain:\n• At least one uppercase letter\n• One number\n• One symbol (e.g. !, @, #)"
      );
      return;
    }

    // 4. Match check
    if (password !== confirm) {
      Alert.alert("Mismatch", "Passwords do not match.");
      return;
    }

    // 5. Call the appropriate store function
    try {
      clearError();

      if (flow === "register") {
        // For registration flow, we need to complete the registration
        // This should call the register function with the password
        await register(email, password, "User"); // We'll need to get the name from somewhere
        Alert.alert(
          "Congratulations",
          "Your account has been successfully created."
        );
        router.replace({
          pathname: "/(root)/(tabs)/Home",
          params: { welcome: "signup" },
        });
      } else {
        // For password reset flow
        await resetPassword(email, password);
        Alert.alert("Success", "Your password has been reset.");
        router.replace({
          pathname: "/(auth)/Login"
        });
      }
    } catch (err: any) {
      // Error is handled by the store
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
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
                    <Text className="font-Manrope text-Heading3 font-bold text-neutral-90">
                      Welcome to{" "}
                      <Text className="text-primary font-Manrope font-bold">
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
                      Good to see you again. Let's keep learning!
                    </Text>
                  </>
                )}
              </View>

              {/* Password Inputs */}
              <View className="bg-neutral-10 flex-1 items-center justify-start pt-[40px] gap-6 rounded-t-[40px] shadow-sm">
                {/* Title */}
                <View className="flex items-center gap-3 ">
                  <Image
                    source={require("@/assets/images/new_password.png")}
                    className="w-[90px] h-[90px] object-cover"
                  />
                  <View className="gap-2">
                    <Text className="text-center text-Heading3 text-neutral-90 font-Manrope font-bold">
                      {flow === "register"
                        ? "Set Your Password"
                        : "Reset Your Password"}
                    </Text>
                    <View className="w-[70%] self-center">
                      <Text className="text-center text-BodyRegular font-Manrope font-medium text-neutral-60">
                        Password must include a capital letter, a number, and a
                        symbol.
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Form */}
                <View className="w-full gap-6 pb-20">
                  <TextInputWithIcon
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    leftIcon={
                      <MaterialIcons
                        name="lock-outline"
                        size={22}
                        color="#E95B0C"
                      />
                    }
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <Ionicons
                          name={showPassword ? "eye" : "eye-off"}
                          size={20}
                          color="#9E9E9E"
                        />
                      </TouchableOpacity>
                    }
                    inputProps={{ secureTextEntry: !showPassword }}
                  />
                  {/* Confirm Password Field */}
                  <TextInputWithIcon
                    label="Confirm Password"
                    value={confirm}
                    onChangeText={setConfirm}
                    placeholder="Confirm your password"
                    leftIcon={
                      <MaterialIcons
                        name="lock-outline"
                        size={22}
                        color="#E95B0C"
                      />
                    }
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => setShowConfirm(!showConfirm)}
                      >
                        <Ionicons
                          name={showConfirm ? "eye" : "eye-off"}
                          size={20}
                          color="#9E9E9E"
                        />
                      </TouchableOpacity>
                    }
                    inputProps={{ secureTextEntry: !showConfirm }}
                  />

                  {/* Submit Button */}
                  <View className="w-[90%] mx-auto items-center">
                    <ColoredButton
                      text={isLoading ? "Submitting..." : "Submit"}
                      btnClassName="w-full py-3"
                      textClassName=""
                      onPress={handleSubmit}
                      disabled={isLoading}
                      icon={
                        isLoading ? (
                          <ActivityIndicator color="#fff" />
                        ) : undefined
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
