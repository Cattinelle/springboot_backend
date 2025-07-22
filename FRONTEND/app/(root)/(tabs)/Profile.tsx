import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import SetTargetSection from "@/components/SetTargetSection";
import BookCollectionSection from "@/components/BookCollectionSection";
import { useUserStore, Book } from "@/hooks/useUserStore";
import { SafeAreaView } from "react-native-safe-area-context";
import TransparentButton from "@/components/TransparentButton";
import FindFriends from "@/assets/svgs/find_friends.svg";
import { useToastStore } from "@/hooks/useToastStore";
import { useOnboardingStore } from "@/hooks/useUserStore";

const Profile = () => {
  const router = useRouter();

  // Get state from store
  const {
    profile,
    joinDate,
    readingGoal,
    streak,
    booksCompleted,
    recommendations,
    favorites,
    setReadingGoal,
    addRecommendation,
    addFavorite,
    removeRecommendation,
    removeFavorite,
    fetchUserData,
    pendingAddType,
    setPendingAddType,
  } = useUserStore();

  const { hasSeenProfileToast, setHasSeenProfileToast, loadOnboardingFlags } =
    useOnboardingStore();

  // Local state for edit mode
  const [editRecommendations, setEditRecommendations] = useState(false);
  const [editFavorites, setEditFavorites] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    loadOnboardingFlags();
  }, []);

  useEffect(() => {
    if (
      !hasSeenProfileToast &&
      (!profile.name || !profile.country || !profile.bio)
    ) {
      useToastStore.getState().showToast({
        type: "info",
        title: "Complete your profile",
        message: "Almost there! Finish setting up your profile.",
        buttonText: "Set Up Now",
        icon: <Ionicons name="person-outline" size={28} color="#E95B0C" />,
        backgroundColor: "#FFF7E6",
        borderColor: "#E95B0C",
        textColor: "#222",
        duration: 5000,
        buttonOnPress: () => {
          router.push("/profile/Editprofile");
          setHasSeenProfileToast(true);
        },
        onDismiss: () => {
          setHasSeenProfileToast(true);
        },
      });
    }
  }, [
    hasSeenProfileToast,
    setHasSeenProfileToast,
    profile.name,
    profile.country,
    profile.bio,
  ]);

  // Format join date
  const formatJoinDate = (dateString: string | null) => {
    if (!dateString) return "Jan 2025";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };
  const avatars = [
    "https://i.pinimg.com/736x/2f/f1/23/2ff1237e3e0239caa4096bc0247ed1f1.jpg",
    "https://i.pinimg.com/736x/2f/f1/23/2ff1237e3e0239caa4096bc0247ed1f1.jpg",
    "https://i.pinimg.com/736x/2f/f1/23/2ff1237e3e0239caa4096bc0247ed1f1.jpg",
  ];

  // Handler to open Book Vault for adding
  const handleAddNew = (type: "recommendation" | "favorite") => {
    setPendingAddType(type);
    router.push("/category/BookVault");
  };

  // Handler to remove book
  const handleRemove = (type: "recommendation" | "favorite", book: Book) => {
    if (type === "recommendation") removeRecommendation(book.id);
    if (type === "favorite") removeFavorite(book.id);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between px-4 py-5 bg-neutral-10 border-b border-neutral-20  items-center">
        <Text className="text-Heading3 font-Manrope font-bold text-secondary">
          My Profile
        </Text>
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.push("/profile/Settings")}>
            <Ionicons name="settings-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <ImageBackground
        source={require("../../../assets/images/vectorbg.png")}
        resizeMode="cover"
        className="flex-1 bg-neutral-10"
        imageStyle={{ opacity: 0.02 }}
      >
        <ScrollView
          className="flex-1 "
          contentContainerStyle={{ paddingBottom: 65 }}
        >
          {/* Profile Section */}
          <View className="mx-3 mt-3 flex-column gap-5 bg-neutral-10 border border-neutral-30 shadow-black-shadow p-4 rounded-[10px]">
            {/* Profile Card */}
            <View className="flex-row justify-start gap-8 items-center">
              {/* Profile Picture */}
              <Image
                source={{
                  uri:
                    profile.profilePic && profile.profilePic.trim() !== ""
                      ? profile.profilePic
                      : "https://i.pinimg.com/736x/2f/f1/23/2ff1237e3e0239caa4096bc0247ed1f1.jpg",
                }}
                className="w-[100px] h-[100px] rounded-full"
              />
              {/* Profile Details */}
              <View className="flex-column items-start gap-1">
                <Text className="text-Heading3 font-Manrope font-bold text-neutral-90">
                  {profile.name || "Your Name"}
                </Text>
                <Text className="text-BodyRegular font-Manrope font-medium text-neutral-70">
                  <SimpleLineIcons
                    name="location-pin"
                    size={16}
                    color="#757575"
                  />
                  {profile.country || "Country"}
                </Text>
                <TransparentButton
                  text="Edit profile"
                  nativewindStyle="mt-1"
                  textClassName="text-BodySmallRegular font-medium px-[10px] py-[5px] font-Manrope text-neutral-90"
                  onPress={() => {
                    router.push("/profile/Editprofile");
                  }}
                />
              </View>
            </View>

            {/* Bio Section */}
            <View className="flex-column justify-between items-start">
              <Text className="text-BodyRegular font-Manrope font-bold text-neutral-100">
                Bio
              </Text>
              <Text className="text-BodyRegular font-Manrope font-medium text-neutral-70">
                {profile.bio && profile.bio.trim() !== ""
                  ? profile.bio
                  : "Add your bio here..."}
              </Text>
            </View>

            {/* Friends Section */}
            <View className="flex-column gap-3">
              <View className="flex-row justify-between items-center">
                {/* Friends Title and count */}
                <View className="flex-row items-center">
                  <Text className="text-BodyRegular font-Manrope font-bold text-neutral-100">
                    Friends
                  </Text>
                  <View className="bg-transparent border border-primary rounded-full py-0.5 px-2 ml-2">
                    <Text className="text-primary font-Manrope text-BodyRegular font-bold">
                      0
                    </Text>
                  </View>
                </View>
                {/* Find Friends Button */}
                <TouchableOpacity
                  className="flex-row items-center gap-1"
                  activeOpacity={0.6}
                  onPress={() => router.push("/findfriends")}
                  // TODO: Implement /findfriends page and routing
                >
                  <Text className="text-primary font-Manrope text-BodyRegular font-semibold">
                    Find Friends
                  </Text>
                  <FindFriends width={18} height={18} />
                </TouchableOpacity>
              </View>
              {/* Friends Profile pics  */}
              <View className="flex-row items-center">
                {avatars.map((uri, idx) => (
                  <Image
                    key={idx}
                    source={{ uri }}
                    className={`w-[45px] h-[45px] rounded-full ${idx !== 0 ? "-ml-3" : ""}`}
                    style={{ zIndex: avatars.length + idx }}
                  />
                ))}
              </View>

              {/* Friend Requests */}
              <TouchableOpacity
                className="active:bg-gray-50 rounded-lg"
                activeOpacity={0.6}
                onPress={() => router.push("/profile/Friendrequests")}
              >
                <View className="flex-row justify-between items-center py-3">
                  <Text className="text-BodyRegular font-Manrope font-bold text-neutral-100">
                    Friend Requests
                  </Text>
                  <SimpleLineIcons
                    name="arrow-right"
                    size={16}
                    color="#9E9E9E"
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {/* Other sections */}
          <View className="mx-3 my-3 flex-column gap-5 bg-neutral-10 border border-neutral-30 shadow-black-shadow p-4 rounded-[10px]">
            {/* Set Target Section (handles both first login and returning user) */}
            <SetTargetSection goal={readingGoal} onSetGoal={setReadingGoal} />
            {/* Milestones Section */}
            <Text className="text-Heading5 font-Manrope font-bold text-neutral-100 ">
              Milestones
            </Text>
            <View className="flex-row justify-around mb-1">
              <View className="items-center">
                <Text className="text-Heading5 font-bold font-Manrope text-primary">
                  {streak}
                </Text>
                <Text className="text-neutral-70 font-Manrope font-medium text-BodySmallRegular mb-2">
                  Daily Streak
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-Heading5 font-bold font-Manrope text-primary">
                  {booksCompleted}
                </Text>
                <Text className="text-neutral-70 font-Manrope font-medium text-BodySmallRegular mb-2">
                  Books Completed
                </Text>
              </View>
            </View>

            {/* Recommendations Section */}
            <BookCollectionSection
              title="My Recommendations"
              books={recommendations}
              emptyText="Add New Recommendation"
              editMode={editRecommendations}
              onEdit={() => setEditRecommendations((v) => !v)}
              onRemove={(book) => handleRemove("recommendation", book)}
              onAddNew={() => handleAddNew("recommendation")}
              onBookPress={(book) => {
                router.push({
                  pathname: "/summary/[id]",
                  params: { id: String(book.id) },
                });
              }}
            />

            {/* Favorite Books Section */}
            <BookCollectionSection
              title="Favorite Books"
              books={favorites}
              icon={<Ionicons name="heart" size={20} color="#C8150C" />}
              emptyText="Add New Favorite"
              editMode={editFavorites}
              onEdit={() => setEditFavorites((v) => !v)}
              onRemove={(book) => handleRemove("favorite", book)}
              onAddNew={() => handleAddNew("favorite")}
              onBookPress={(book) => {
                router.push({
                  pathname: "/summary/[id]",
                  params: { id: String(book.id) },
                });
              }}
            />

            {/* Member Since */}
            <Text className="text-neutral-90 font-Manrope font-semibold text-BodySmallRegular ">
              Member since:{" "}
              <Text className="text-primary">{formatJoinDate(joinDate)}</Text>
            </Text>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Profile;
