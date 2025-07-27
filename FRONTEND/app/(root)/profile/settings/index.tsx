import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import SettingsRow from "@/components/SettingsRow";
import TransparentButton from "@/components/TransparentButton";

const Settings = () => {
  const router = useRouter();

  return (
    <View className="flex-1">
      <SafeAreaView
        edges={["top"]}
        className="bg-neutral-10 border-b border-neutral-30"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between bg-neutral-10 border-b border-neutral-30 px-4 py-6">
          <Text className="text-Heading5 font-Manrope font-bold text-secondary">
            Settings
          </Text>
          <TouchableOpacity onPress={() => router.push("../../Profile")}>
            <Ionicons name="close" size={24} color="#404040" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <ImageBackground
        source={require("@/assets/images/vectorbg.png")}
        resizeMode="cover"
        className="flex-1 bg-neutral-10"
        imageStyle={{ opacity: 0.03 }}
      >
        <View className="flex-column gap-y-96">
          <View className="gap-1 px-5 pt-2.5">
            {/* Settings Options */}

            <SettingsRow
              leftIcon={<Feather name="bell" size={20} color="#F96C00" />}
              text="Notifications"
              onPress={() => router.push("./notification")}
            />
            <SettingsRow
              leftIcon={<Feather name="shield" size={20} color="#F96C00" />}
              text="Privacy Policy"
              onPress={() => router.push("./privacy-policy")}
            />
            <SettingsRow
              leftIcon={<Feather name="shield" size={20} color="#F96C00" />}
              text="Terms & Conditions"
              onPress={() => router.push("./terms-and-conditions")}
            />
            <SettingsRow
              leftIcon={
                <Feather name="help-circle" size={20} color="#F96C00" />
              }
              text="Help & Support"
              onPress={() => router.push("./help-and-support")}
            />
          </View>
          <View className="mx-auto w-[100px]">
            <TransparentButton
              textClassName="text-[15px] font-Manrope font-bold"
              text="Log out"
              onPress={() => router.push("./logout")}
              nativewindStyle="px-[10px] py-[10px]"
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Settings;
