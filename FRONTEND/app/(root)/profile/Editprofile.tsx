import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Ionicons,
  Feather,
  MaterialIcons,
  Fontisto,
  MaterialCommunityIcons,
  Entypo,
  AntDesign,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import TextInputWithIcon from "@/components/TextInputWithIconProps";
import PasswordChangeModal from "@/components/PasswordChangeModal";
import CountrySelectionModal from "@/components/CountrySelectionModal";
import ColoredButton from "@/components/ColoredButton";
import { useUserStore } from "@/hooks/useUserStore";
import { useAuthStore } from "@/hooks/useAuthStore";
import ArrowsExchange from "@/assets/svgs/arrows_exchange.svg";

interface Country {
  name: string;
  flag: string;
  phoneCode?: string;
}

const Editprofile = () => {
  const router = useRouter();
  const { profile, updateProfile, uploadProfilePicture } = useUserStore();
  const { user } = useAuthStore();

  const [form, setForm] = useState({
    name: profile.name || "",
    email: user?.email || "",
    dob: "",
    country: profile.country || "",
    phone: "",
    bio: profile.bio || "",
  });
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // When user selects a country from the modal
  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setForm((prev) => ({ ...prev, country: country.name }));
  };

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: boolean;
  }>({});

  const validateForm = () => {
    const errors: { [key: string]: boolean } = {};

    if (!form.name.trim()) errors.name = true;
    if (!form.dob.trim()) errors.dob = true;
    if (!form.phone.trim()) errors.phone = true;

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageUpload = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to upload a profile picture."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setIsLoading(true);
        try {
          // Convert image to base64 for upload
          const response = await fetch(result.assets[0].uri);
          const blob = await response.blob();
          const reader = new FileReader();

          reader.onload = async () => {
            const base64 = reader.result as string;
            await uploadProfilePicture(base64);
            setIsLoading(false);
          };

          reader.readAsDataURL(blob);
        } catch (error) {
          setIsLoading(false);
          Alert.alert(
            "Upload Failed",
            "Failed to upload profile picture. Please try again."
          );
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to access photo library.");
    }
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile({
        name: form.name.trim(),
        country: selectedCountry?.name || form.country,
        bio: form.bio.trim(),
      });

      Alert.alert("Success", "Profile updated successfully!");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <SafeAreaView className="flex-1 bg-neutral-10">
        {/* Header */}
        <View className="flex-row items-center px-4 py-[20px] border-b border-neutral-30 bg-neutral-10">
          <TouchableOpacity
            activeOpacity={0.6}
            hitSlop={10}
            onPress={() => router.push("../Profile")}
          >
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <Text className="flex-1 text-Heading5 text-center font-Manrope font-bold text-secondary">
            Edit profile
          </Text>
          <View style={{ width: 24 }} />
        </View>
        <ImageBackground
          source={require("../../../assets/images/vectorbg.png")}
          resizeMode="cover"
          className="flex-1 bg-neutral-10"
          imageStyle={{ opacity: 0.02 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
              {/* Avatar */}
              <View className="items-center gap-3 my-10">
                <TouchableOpacity
                  onPress={handleImageUpload}
                  disabled={isLoading}
                  className="relative"
                  activeOpacity={0.6}
                  hitSlop={10}
                >
                  <View className="w-[120px] h-[120px] items-center justify-center">
                    {profile.profilePic ? (
                      <Image
                        source={{ uri: profile.profilePic }}
                        className="w-[120px] h-[120px] rounded-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <Image
                        source={{
                          uri: "https://i.pinimg.com/736x/2f/f1/23/2ff1237e3e0239caa4096bc0247ed1f1.jpg",
                        }}
                        className="w-[120px] h-[120px] rounded-full"
                        resizeMode="cover"
                      />
                    )}
                    {isLoading && (
                      <View className="absolute inset-0 bg-black/50 rounded-full items-center justify-center">
                        <ActivityIndicator color="#fff" />
                      </View>
                    )}
                  </View>

                  <View className="absolute bottom-0 right-0 bg-neutral-10 rounded-full p-1.5 border border-neutral-30">
                    <AntDesign name="edit" size={24} color="#9e9e9e" />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row items-center justify-center"
                  onPress={handleImageUpload}
                  activeOpacity={0.4}
                  hitSlop={10}
                >
                  <Text className="text-BodySmallRegular font-Manrope font-semibold text-secondary">
                    Upload profile picture
                  </Text>
                  <Entypo name="chevron-small-right" size={24} color="#C8150C" />
                </TouchableOpacity>
              </View>
              <View className="flex-column gap-5 bg-neutral-10 shadow-white-shadow rounded-t-[40px] pt-5">
                {/* Form Fields */}
                <TextInputWithIcon
                  label="Full Name"
                  value={form.name}
                  onChangeText={(v) => setForm({ ...form, name: v })}
                  placeholder="Full Name"
                  showValidationError={validationErrors.name}
                  required
                />

                <TextInputWithIcon
                  label="Email Address"
                  value={form.email}
                  onChangeText={() => {}} // Read-only
                  placeholder="Email Address"
                  inputProps={{ editable: false }}
                  isVerified={user?.isEmailVerified}
                />

                <TextInputWithIcon
                  label="Date of Birth"
                  value={form.dob}
                  onChangeText={(v) => setForm({ ...form, dob: v })}
                  placeholder="dd/mm/yyyy"
                  showValidationError={validationErrors.dob}
                  required
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
                      onPress={() => setShowCountryModal(true)}
                      className="flex-row w-[96%] justify-between items-center"
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        {selectedCountry && (
                          <Image
                            source={{ uri: selectedCountry.flag }}
                            style={{ width: 26, height: 18, marginRight: 8 }}
                          />
                        )}
                        <Text className="text-BodySmallRegular font-Manrope font-medium text-neutral-90">
                          {selectedCountry
                            ? `${selectedCountry.name} (${selectedCountry.phoneCode || ""})`
                            : "Select Country"}
                        </Text>
                      </View>
                      <TouchableOpacity
                        className="px-4"
                        onPress={() => setShowCountryModal(true)}
                      >
                        <Entypo
                          name="chevron-small-down"
                          size={24}
                          color="#9E9E9E"
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </View>
                </View>

                <TextInputWithIcon
                  label="Phone Number"
                  value={form.phone}
                  onChangeText={(v) => setForm({ ...form, phone: v })}
                  placeholder={selectedCountry?.phoneCode || "+1"}
                  leftIcon={
                    <MaterialIcons name="phone" size={22} color="#E95B0C" />
                  }
                  showValidationError={validationErrors.phone}
                  required
                />

                {/* Bio */}
                <View
                  className={`flex-row w-[90%] h-[85px] py-2 px-5 items-center mx-auto gap-3 border border-neutral-40 rounded-[15px] ${
                    isActive ? "border-primary" : "border-neutral-40"
                  }`}
                >
                  <View className="flex flex-column gap-1 flex-1">
                    <Text className="text-[13px] font-Manrope font-semibold text-primary">
                      Bio
                    </Text>
                    <TextInput
                      placeholder="Tell us a bit about yourself... your love for books, favorite genres, or anything fun!"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      multiline={true}
                      numberOfLines={4}
                      className="text-BodySmallRegular font-Manrope font-medium text-neutral-70 flex-1 h-full"
                      value={form.bio}
                      onChangeText={(v) => setForm({ ...form, bio: v })}
                      onFocus={() => setIsActive(true)}
                      onBlur={() => setIsActive(false)}
                    />
                  </View>
                </View>

                {/* Change Password */}
                <TouchableOpacity
                  className="flex-row items-center justify-center gap-1"
                  onPress={() => setShowPasswordModal(true)}
                  activeOpacity={0.6}
                  hitSlop={10}
                >
                  <Text className="text-secondary text-BodyBold font-Manrope font-bold">
                    Change Password
                  </Text>
                  <ArrowsExchange width={22} height={22} />
                </TouchableOpacity>

                {/* Save Button */}
                <ColoredButton
                  text={isLoading ? "Saving..." : "Save Changes"}
                  btnClassName="w-[90%] mx-auto py-3 mt-2 mb-8"
                  onPress={handleSaveChanges}
                  disabled={isLoading}
                  icon={
                    isLoading ? <ActivityIndicator color="#fff" /> : undefined
                  }
                />
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </ImageBackground>

        {/* Modals */}
        <PasswordChangeModal
          visible={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
        />

        <CountrySelectionModal
          visible={showCountryModal}
          onClose={() => setShowCountryModal(false)}
          onSelect={handleCountrySelect}
          selectedCountry={selectedCountry || undefined}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Editprofile;
