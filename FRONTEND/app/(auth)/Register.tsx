import ColoredButton from "@/components/ColoredButton";
import TextInputWithIcon from "@/components/TextInputWithIconProps";
import {
  Entypo,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  FlatList,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from "react-native";
import { useAuthStore } from "@/hooks/useAuthStore";

export default function Register() {
  const [fullName, setFullName] = useState(""); // For registration
  const [registerEmail, setRegisterEmail] = useState(""); // For registration
  const [country, setCountry] = useState(""); // For registration
  const [phoneNumber, setPhoneNumber] = useState(""); // For registration
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null); // For phone code
  const [agreed, setAgreed] = useState(false); // Checkbox for terms and conditions
  const [showCountryPicker, setShowCountryPicker] = useState(false); // For country picker modal
  const [countries, setCountries] = useState<Country[]>([]);
  const [search, setSearch] = useState("");
  const navigation = useNavigation();

  // Get auth store
  const { registerInitial, isLoading, error, clearError } = useAuthStore();

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

  type Country = {
    name: string;
    flag: string;
    phoneCode?: string;
  };
  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.phoneCode && c.phoneCode.toLowerCase().includes(search.toLowerCase()))
  );

  useEffect(() => {
    const loadCountries = async () => {
      const cached = await AsyncStorage.getItem("countries");
      if (cached) {
        setCountries(JSON.parse(cached));
      } else {
        try {
          const res = await fetch(
            "https://restcountries.com/v3.1/all?fields=name,flags,idd"
          );
          const data = await res.json();
          const countryList: Country[] = data
            .map((item: any) => ({
              name: item.name.common,
              flag: item.flags?.png || "https://flagcdn.com/w320/un.png", // fallback image
              phoneCode: item.idd?.root
                ? `${item.idd.root}${item.idd.suffixes?.[0] || ""}`
                : undefined,
            }))
            .filter(Boolean); // remove undefined/null
          const sorted = countryList.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          await AsyncStorage.setItem("countries", JSON.stringify(sorted));
          setCountries(sorted);
        } catch (err) {
          console.error("Failed to fetch countries:", err);
        }
      }
    };

    loadCountries();
  }, []);

  const router = useRouter();

  // Validation functions
  const validateRegister = () => {
    if (
      !fullName.trim() ||
      !registerEmail.trim() ||
      !country ||
      !phoneNumber.trim() ||
      !agreed
    ) {
      Alert.alert(
        "Missing Fields",
        "Please fill all fields and accept the Terms."
      );
      return false;
    }
    if (!isValidEmail(registerEmail.trim())) {
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

  // For handling registration
  const handleRegister = async () => {
    if (!validateRegister()) return;
    if (!agreed) {
      Alert.alert(
        "Terms Required",
        "Please agree to the Terms and Privacy Policy to continue."
      );
      return;
    }
    try {
      clearError();

      // Call the registerInitial function from the store
      await registerInitial(
        registerEmail.trim().toLowerCase(),
        fullName.trim(),
        country
      );

      // If successful, navigate to OTP verification
      router.replace({
        pathname: "/(auth)/OTPVerification",
        params: {
          email: registerEmail.toLowerCase(),
          flow: "register",
          welcome: "signup",
        },
      });
    } catch (err: any) {
      // Error is handled by the store
    }

    // try {
    //   const response = await fetch(
    //     "http://YOUR_BACKEND_URL/api/auth/register",
    //     {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({ fullName, registerEmail, country }),
    //     }
    //   );

    //   const data = await response.json();

    //   if (response.ok) {
    //     // Registration successful
    //     router.replace({
    //       pathname: "/(auth)/CreateNewPassword",
    //       params: { email: registerEmail.toLowerCase() },
    //     });
    //   } else if (
    //     response.status === 400 &&
    //     data.message?.toLowerCase().includes("email already exists")
    //   ) {
    //     Alert.alert(
    //       "Registration Failed",
    //       "An account with this email already exists."
    //     );
    //   } else {
    //     Alert.alert(
    //       "Registration Failed",
    //       data.message || "Something went wrong."
    //     );
    //   }
    // } catch (error) {
    //   console.error("Registration error:", error);
    //   Alert.alert(
    //     "Network Error",
    //     "Please check your connection and try again."
    //   );
    // }
  };

  // Reset form fields after successful login or registration
  const resetForm = () => {
    setFullName("");
    setRegisterEmail("");
    setCountry("");
    setPhoneNumber("");
    setSelectedCountry(null);
    setAgreed(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 10} // Adjust this value
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
            <View className="flex-1 gap-4 pt-[150px] font-Manrope">
              {/* Intro */}
              <View className="gap-2 px-4">
                {/* Welcome back */}
                <Text className="text-Heading3 font-Manrope font-bold text-neutral-90">
                  Welcome to{" "}
                  <Text className="text-primary font-Manrope font-bold">
                    QUICKTALES
                  </Text>
                </Text>
                {/* Sub text */}
                <Text className="text-BodyRegular font-Manrope font-medium text-neutral-60 mb-6">
                  Learn something new every day — with short book summaries.
                </Text>
              </View>
              {/* Inputs*/}
              <View className="bg-neutral-10 flex-1 items-center justify-start gap-6 pt-5 rounded-t-[40px] shadow-sm">
                <View className="w-full gap-4">
                  {/* Toggle Login/Register */}
                  <View className="flex-row w-[90%] h-[55px]  px-1.5 justify-between items-center mx-auto mb-1 gap-1.5 bg-neutral-30 rounded-[32px]">
                    {/* Login */}
                    <TouchableOpacity
                      onPress={() => {
                        router.replace("/Login"); // Navigate to Select Category screen
                        resetForm();
                      }}
                      className="w-[45%] h-[83%] flex-row justify-center items-center rounded-[32px] bg-transparent"
                    >
                      <Text className="text-center text-BodySmallRegular font-Manrope font-semibold text-neutral-90">
                        Log in
                      </Text>
                    </TouchableOpacity>
                    {/* Register */}
                    <TouchableOpacity
                      onPress={() => {
                        resetForm();
                      }}
                      className="w-[45%] h-[83%] flex-row justify-center items-center rounded-[32px] bg-neutral-10 shadow-sm"
                    >
                      <Text className="text-center text-BodySmallRegular font-Manrope font-semibold text-neutral-90">
                        Register
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Register Full Name */}
                  <TextInputWithIcon
                    label="Full Name"
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Enter your full name"
                    leftIcon={
                      <Octicons name="person" size={22} color="#E95B0C" />
                    }
                  />

                  {/* Register Email */}
                  <TextInputWithIcon
                    label="Email Address"
                    value={registerEmail}
                    onChangeText={setRegisterEmail}
                    placeholder="Enter your email"
                    leftIcon={
                      <Fontisto name="email" size={22} color="#E95B0C" />
                    }
                  />

                  {/* Register Phone Number */}
                  <TextInputWithIcon
                    label="Phone Number"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    placeholder={selectedCountry?.phoneCode || "+1"}
                    leftIcon={
                      <MaterialIcons name="phone" size={22} color="#E95B0C" />
                    }
                    inputProps={{ keyboardType: "phone-pad" }}
                  />

                  {/* Register Country/Region */}
                  <View className="flex-row w-[90%] h-[60px] py-2 px-5 items-center mx-auto gap-3 border border-neutral-40 rounded-[32px]">
                    <MaterialCommunityIcons
                      name="map-search-outline"
                      size={22}
                      color="#E95B0C"
                    />
                    <View className="flex flex-column  flex-1">
                      <Text className="text-[13px] font-Manrope font-semibold text-primary">
                        Country
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setShowCountryPicker(true);
                        }}
                        className="flex-row w-[96%] justify-between items-center"
                      >
                        <Text className="text-BodySmallRegular font-Manrope font-medium text-neutral-70">
                          {country || "Choose your country"}
                        </Text>
                        <TouchableOpacity
                          className="px-4"
                          onPress={() => {
                            setShowCountryPicker(true);
                          }}
                        >
                          <Entypo
                            name="chevron-small-down"
                            size={24}
                            color="#9E9E9E"
                          />
                        </TouchableOpacity>
                      </TouchableOpacity>

                      {/* Modal for country picker */}
                      <Modal
                        visible={showCountryPicker}
                        animationType="slide"
                        onRequestClose={() => {
                          setShowCountryPicker(false);
                          Keyboard.dismiss();
                        }} // this handles Android back button
                      >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                          <SafeAreaView className="flex-1 bg-neutral-10 mx-3">
                            <View className="flex-row justify-between items-center mt-5 mb-4">
                              <Text className="text-Heading6 font-Manrope font-bold text-neutral-90 ">
                                Select your country
                              </Text>
                              <TouchableOpacity
                                onPress={() => setShowCountryPicker(false)}
                              >
                                <Text className="text-primary text-BodySmallRegular font-Manrope font-bold">
                                  Cancel
                                </Text>
                              </TouchableOpacity>
                            </View>
                            <TextInput
                              placeholder="Search countries or phone codes"
                              placeholderTextColor="#9E9E9E"
                              value={search}
                              onChangeText={setSearch}
                              className="border border-neutral-30 font-Manrope font-medium text-neutral-90 px-4 py-3 rounded-lg mb-4"
                            />

                            <FlatList
                              data={filteredCountries}
                              keyExtractor={(item) => item.name}
                              renderItem={({ item }) => (
                                <TouchableOpacity
                                  onPress={() => {
                                    setCountry(item.name);
                                    setSelectedCountry(item);
                                    setShowCountryPicker(false);
                                  }}
                                  className="py-3.5 border-b border-neutral-20 flex-row items-center gap-3"
                                >
                                  <Image
                                    source={{ uri: item.flag }}
                                    style={{
                                      width: 26,
                                      height: 18,
                                    }}
                                    resizeMode="cover"
                                  />
                                  <View className="flex-1">
                                    <Text className="text-BodyRegular text-neutral-90 font-Manrope font-medium">
                                      {item.name}
                                    </Text>
                                    {item.phoneCode && (
                                      <Text className="text-BodySmallRegular font-Manrope text-neutral-60">
                                        {item.phoneCode}
                                      </Text>
                                    )}
                                  </View>
                                </TouchableOpacity>
                              )}
                            />
                          </SafeAreaView>
                        </TouchableWithoutFeedback>
                      </Modal>
                    </View>
                  </View>
                </View>
                {/* Agreement Terms and Register Btn*/}
                <View className="w-[95%] gap-6 px-4 pb-20">
                  {/* Agreement Terms */}
                  <View className="flex-row items-center justify-center w-fit gap-2 mt-4">
                    {/* Checkbox */}
                    <TouchableOpacity
                      onPress={() => setAgreed(!agreed)}
                      className={`w-5 h-5 mt-[3px] rounded-sm border-2 ${
                        agreed
                          ? "bg-primary border-primary"
                          : "border-neutral-40"
                      }`}
                    >
                      {agreed && (
                        <View className="flex-1 items-center justify-center">
                          <Ionicons
                            name="checkmark"
                            size={14}
                            color="#ffffff"
                          />
                        </View>
                      )}
                    </TouchableOpacity>

                    {/* Text with Links */}
                    <View className="flex-row flex-wrap items-center justify-start w-[90%]">
                      <Text className="text-BodySmallRegular text-neutral-70 font-Manrope font-medium">
                        By signing up, you agree to our{" "}
                      </Text>
                      <Text className="text-BodySmallRegular font-Manrope font-semibold text-primary">
                        Terms of Service
                      </Text>
                      <Text className="text-BodySmallRegular text-neutral-70 font-Manrope font-medium">
                        and{" "}
                      </Text>
                      <Text className="text-BodySmallRegular font-Manrope font-semibold text-primary">
                        Privacy Policy
                      </Text>
                    </View>
                  </View>

                  {/* Register Button */}
                  <View className="flex w-full items-center">
                    <ColoredButton
                      text={isLoading ? "Registering..." : "Register"}
                      btnClassName="w-full py-3"
                      textClassName=""
                      onPress={handleRegister}
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
