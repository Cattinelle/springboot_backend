import ColoredButton from "@/components/ColoredButton";
import TextInputWithIcon from "@/components/TextInputWithIconProps";
import {
  FontAwesome5,
  Fontisto,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
import { mockGoogleSignIn, mockAppleSignIn } from "@/services/socialAuth";

export default function Login() {
  const [email, setEmail] = useState(""); // For login
  const [password, setPassword] = useState(""); // For login
  const [showPassword, setShowPassword] = useState(false); // For toggling password visibility

  const router = useRouter();
  const navigation = useNavigation();

  // Get auth store
  const { login, googleSignIn, appleSignIn, isLoading, error, clearError } =
    useAuthStore();

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

  // Show error alerts when there's an error in the store
  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
      clearError();
    }
  }, [error, clearError]);

  // Validation functions
  const validateLogin = () => {
    if (!email || !password) {
      Alert.alert("Missing fields", "Please enter both email and password.");
      return false;
    }

    if (!isValidEmail(email)) {
      Alert.alert(
        "Invalid Email Address",
        "Please enter a valid email address."
      );
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

  // For handling login
  const handleLogin = async () => {
    if (!validateLogin()) return;

    try {
      await login(email, password);
      // If successful, the store will handle navigation
      router.replace("/(root)/(tabs)/Home");
    } catch (error) {
      // Error is handled by the store
    }
  };

  // Handle social sign-in
  const handleGoogleSignIn = async () => {
    try {
      clearError();
      const result = await mockGoogleSignIn();
      if (result.success && result.user) {
        // Update the store with the social user
        // For now, we'll just navigate to home
        router.replace("/(root)/(tabs)/Home");
      } else {
        Alert.alert("Error", result.error || "Google sign-in failed");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Google sign-in failed");
    }
  };

  const handleAppleSignIn = async () => {
    try {
      clearError();
      const result = await mockAppleSignIn();
      if (result.success && result.user) {
        // Update the store with the social user
        // For now, we'll just navigate to home
        router.replace({
          pathname: "/(root)/(tabs)/Home",
          params: { welcome: "signin" },
        });
      } else {
        Alert.alert("Error", result.error || "Apple sign-in failed");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Apple sign-in failed");
    }
  };

  // Reset form fields after successful login or registration
  const resetForm = () => {
    setEmail("");
    setPassword("");
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
                <Text className="font-Manrope text-Heading3 font-bold text-neutral-90">
                  Welcome back 👋
                </Text>
                {/* Sub text */}
                <Text className="font-Manrope text-BodyRegular font-medium text-neutral-60 mb-6">
                  Good to see you again. Let’s keep learning!
                </Text>
              </View>
              {/* Inputs*/}
              <View className="bg-neutral-10 flex-1 items-center justify-start gap-6 pt-5 rounded-t-[40px] shadow-sm">
                {/* Toggle Login/Register, Email, Password, and Forget Password */}
                <View className="w-full gap-4">
                  {/* Toggle Login/Register */}
                  <View className="flex-row w-[90%] h-[55px]  px-1.5 justify-between items-center mx-auto mb-1 gap-1.5 bg-neutral-30 rounded-[32px]">
                    {/* Login */}
                    <TouchableOpacity
                      onPress={() => {
                        resetForm();
                      }}
                      className="w-[45%] h-[83%] flex-row justify-center items-center rounded-[32px] bg-neutral-10 shadow-sm"
                    >
                      <Text className="text-center font-Manrope text-BodySmallRegular font-semibold text-neutral-90">
                        Log in
                      </Text>
                    </TouchableOpacity>
                    {/* Register */}
                    <TouchableOpacity
                      onPress={() => {
                        router.push("/Register");
                        resetForm();
                      }}
                      className="w-[45%] h-[83%] flex-row justify-center items-center rounded-[32px] bg-transparent"
                    >
                      <Text className="text-center text-BodySmallRegular font-Manrope font-semibold text-neutral-90">
                        Register
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Email */}
                  <TextInputWithIcon
                    label="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    leftIcon={
                      <Fontisto name="email" size={22} color="#E95B0C" />
                    }
                  />

                  {/* Password */}
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
                    secureTextEntry={!showPassword}
                  />

                  {/* Forgot Password */}
                  <View className="w-[95%] items-end mt-2">
                    <TouchableOpacity
                      onPress={() => router.push("/ForgotPassword")}
                    >
                      <Text className="text-BodySmallRegular font-Manrope font-semibold text-primary">
                        Forgot Password?
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {/* Login Btn, divider, and google or apple sign in */}
                <View className="w-[95%] gap-6 px-4 pb-20">
                  {/* Login Button */}
                  <View className="flex w-full items-center">
                    <ColoredButton
                      text={isLoading ? "Logging in..." : "Log in"}
                      btnClassName="w-full py-3"
                      textClassName=""
                      onPress={handleLogin}
                      disabled={isLoading}
                      icon={
                        isLoading ? (
                          <ActivityIndicator color="#fff" />
                        ) : undefined
                      }
                    />
                  </View>

                  {/* Divider */}
                  <View className="flex-row items-center justify-center gap-3 my-6">
                    <View className=" w-[65px] h-[1px] bg-neutral-70"></View>
                    <Text className="font-Manrope font-medium text-center text-[13px] text-neutral-70">
                      Or login with
                    </Text>
                    <View className=" w-[65px] h-[1px] bg-neutral-70"></View>
                  </View>

                  {/* Google / Apple sign-in */}
                  <View className="flex-row justify-center gap-4">
                    <TouchableOpacity
                      className="border border-neutral-40 flex px-12 py-3 rounded-lg"
                      onPress={handleGoogleSignIn}
                      disabled={isLoading}
                    >
                      <View className="flex-row items-center justify-center gap-2">
                        {isLoading ? (
                          <ActivityIndicator size="small" color="#757575" />
                        ) : (
                          <Image
                            source={require("@/assets/images/google_icon.png")}
                            className="w-5 h-5"
                          />
                        )}
                        <Text className="text-neutral-70 text-BodySmallRegular font-Manrope font-medium">
                          Google
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="border border-neutral-40 flex px-12 py-3 rounded-lg"
                      onPress={handleAppleSignIn}
                      disabled={isLoading}
                    >
                      <View className="flex-row items-center justify-center gap-2">
                        {isLoading ? (
                          <ActivityIndicator size="small" color="#757575" />
                        ) : (
                          <FontAwesome5
                            name="apple"
                            size={20}
                            color="#757575"
                          />
                        )}
                        <Text className="text-neutral-70 text-BodySmallRegular font-Manrope font-medium">
                          Apple
                        </Text>
                      </View>
                    </TouchableOpacity>
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
