import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UserCard from "@/components/UserCard";
import { Ionicons, Feather, AntDesign, FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import { useUserStore } from "@/hooks/useUserStore";

const FindFriends = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { allUsers, fetchAllUsers } = useUserStore();

  // Fetch all users on mount
  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  // Filter users by name or country
  const filteredUsers = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
      accessible={false}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <View className="flex-1">
          <SafeAreaView
            edges={["top"]}
            className=" bg-neutral-10 border-b border-neutral-20"
          >
            {/* Header with search button */}
            <View
              className={`flex-column w-full bg-neutral-10 border-b ${showSearch ? "pt-7 pb-5 " : "py-[25px]"} border-neutral-30`}
            >
              <View className="flex-row gap-10 px-4 items-center">
                <TouchableOpacity
                  onPress={() => router.back()}
                  activeOpacity={0.6}
                  hitSlop={10}
                >
                  <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <View className="flex-1 items-center justify-center">
                  <Text className="text-Heading5 text-center font-Manrope font-bold text-secondary">
                    Find Friends
                  </Text>
                  {!showSearch && (
                    <Text className="text-neutral-70 text-center font-Manrope text-BodySmallRegular">
                      Connect with other readers
                    </Text>
                  )}
                </View>
                {/* Search icon */}
                <TouchableOpacity onPress={() => setShowSearch((v) => !v)}>
                  <Feather name="search" size={22} color="black" />
                </TouchableOpacity>
              </View>
              {/* Search input (appears when showSearch is true) */}

              {showSearch && (
                <View className="w-[90%] pt-6 mx-auto">
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search for a user by name or country..."
                    className={`bg-neutral-10 border rounded-lg px-4 py-[10px] font-Manrope border-[#E0E0E0] text-[15px]`}
                    placeholderTextColor="#A0A0A0"
                    autoFocus
                  />
                </View>
              )}
            </View>
          </SafeAreaView>
          <ImageBackground
            source={require("@/assets/images/vectorbg.png")}
            resizeMode="cover"
            className="flex-1 bg-neutral-10"
            imageStyle={{ opacity: 0.02 }}
          >
            <ScrollView
              className="flex-1 px-3 pt-5"
              showsVerticalScrollIndicator={false}
            >
              {filteredUsers.length === 0 ? (
                <View className="flex-1 flex-column                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          items-center justify-center mt-20">
                  <FontAwesome6
                    name="user-large-slash"
                    size={60}
                    color="#404040"
                  />
                  <Text className="text-neutral-90 text-Heading6 font-Manrope font-bold                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               z mt-4 mb-2">
                    No users found.
                  </Text>
                </View>
              ) : (
                filteredUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))
              )}
            </ScrollView>
          </ImageBackground>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default FindFriends;
