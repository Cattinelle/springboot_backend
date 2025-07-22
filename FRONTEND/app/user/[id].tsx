import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import BookCollectionSection from "@/components/BookCollectionSection";
import { useUserStore, Book } from "@/hooks/useUserStore";
import { SafeAreaView } from "react-native-safe-area-context";
import TransparentButton from "@/components/TransparentButton";
import RequestPending from "../../assets/svgs/requestpending.svg";
// Mock user data fetch
const mockFetchUser = async (id: string) => {
  // Replace with real API call
  return {
    id,
    name: "Ariana Lee",
    country: "Australia",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    bio: "Always chasing that one quote that changes everything. 🐾",
    joinDate: "2024-08-01T00:00:00Z",
    recommendations: [
      {
        id: "1",
        title: "The Internet is NOT the Answer",
        author: "Andrew Keen",
        cover: "https://covers.openlibrary.org/b/id/10523338-L.jpg",
      },
      {
        id: "2",
        title: "How to Talk to Anyone",
        author: "Leil Lowndes",
        cover: "https://covers.openlibrary.org/b/id/10523339-L.jpg",
      },
      {
        id: "3",
        title: "The 5AM Club",
        author: "Robin Sharma",
        cover: "https://covers.openlibrary.org/b/id/10523340-L.jpg",
      },
    ],
    favorites: [
      {
        id: "4",
        title: "Before I Say I Do",
        author: "Vicki Bradley",
        cover: "https://covers.openlibrary.org/b/id/10523341-L.jpg",
      },
      {
        id: "5",
        title: "If Something Happens to Me",
        author: "Alex Finlay",
        cover: "https://covers.openlibrary.org/b/id/10523342-L.jpg",
      },
      {
        id: "6",
        title: "The Fear of Failure",
        author: "Wilda Hale",
        cover: "https://covers.openlibrary.org/b/id/10523343-L.jpg",
      },
    ],
    streak: 12,
    booksCompleted: 30,
    friends: [
      {
        id: "friend1",
        name: "Friend 1",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      },
      {
        id: "friend2",
        name: "Friend 2",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      },
      {
        id: "friend3",
        name: "Friend 3",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      },
      {
        id: "friend4",
        name: "Friend 4",
        avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      },
    ],
  };
};

export default function UserProfile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const {
    friends,
    sentRequests,
    receivedRequests,
    sendFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    removeFriend,
  } = useUserStore();

  useEffect(() => {
    if (typeof id === "string") {
      mockFetchUser(id).then(setUser);
    }
  }, [id]);

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  // Relationship logic
  const isFriend = friends.includes(user.id);
  const isSent = sentRequests.includes(user.id);
  const isReceived = receivedRequests.includes(user.id);

  // Handlers
  const handleAddFriend = async () => await sendFriendRequest(user.id);
  const handleCancelPending = async () => await cancelFriendRequest(user.id);
  const handleAccept = async () => await acceptFriendRequest(user.id);
  const handleRemoveFriend = async () => await removeFriend(user.id);

  // Format join date
  const formatJoinDate = (dateString: string | null) => {
    if (!dateString) return "Jan 2025";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row px-4 py-5 bg-neutral-10 border-b border-neutral-20  items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center gap-1"
        >
          <Ionicons name="arrow-back" size={20} color="black" />
          <Text className="text-Heading5 font-Manrope font-bold text-secondary">
            {user.name.split(" ")[0].charAt(0).toUpperCase() +
              user.name.split(" ")[0].slice(1).toLowerCase()}
          </Text>
        </TouchableOpacity>
      </View>
      <ImageBackground
        source={require("../../assets/images/vectorbg.png")}
        resizeMode="cover"
        className="flex-1 bg-neutral-10 mt-2"
        imageStyle={{ opacity: 0.02 }}
      >
        <ScrollView className="flex-1 " showsVerticalScrollIndicator={false}>
          {/* Profile Card */}
          <View className="mx-3 flex-column gap-5 bg-neutral-10 border border-neutral-30 shadow-black-shadow p-4 rounded-[10px]">
            <View className="flex-row justify-start gap-8 items-center">
              <Image
                source={{ uri: user.avatar }}
                className="w-[100px] h-[100px] rounded-full"
              />
              <View className="flex-column items-start gap-1 flex-1">
                <Text className="text-Heading3 font-Manrope font-bold text-neutral-90">
                  {user.name}
                </Text>
                <Text className="text-BodyRegular font-Manrope font-medium text-neutral-70">
                  <Ionicons name="location-outline" size={16} color="#757575" />{" "}
                  {user.country}
                </Text>
                {/* Friend Action Button (moved under name/location) */}
                <View className="mt-2">
                  {isFriend ? (
                    <TransparentButton
                      text="Friends"
                      textClassName="text-primary font-Manrope font-medium text-BodySmallRegular"
                      nativewindStyle="flex-row items-center bg-neutral-20 px-[10px] py-[5px] rounded-lg"
                      onPress={handleRemoveFriend}
                      icon={
                        <Ionicons name="person" size={18} color="#E95B0C" />
                      }
                    />
                  ) : isSent ? (
                    <TransparentButton
                      text="Pending"
                      textClassName="text-primary font-Manrope font-medium text-BodySmallRegular"
                      nativewindStyle="flex-row items-center bg-neutral-20 px-[10px] py-[5px] rounded-lg"
                      onPress={handleCancelPending}
                      icon={<RequestPending width={18} height={18} />}
                    />
                  ) : isReceived ? (
                    <TransparentButton
                      text="Accept"
                      textClassName="text-green-700 font-Manrope font-medium text-BodySmallRegular"
                      nativewindStyle="flex-row items-center bg-neutral-20 px-[10px] py-[5px] rounded-lg"
                      onPress={handleAccept}
                      icon={
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={18}
                          color="#E95B0C"
                        />
                      }
                    />
                  ) : (
                    <TransparentButton
                      text="Add Friend"
                      textClassName="text-primary font-Manrope font-medium text-BodySmallRegular"
                      nativewindStyle="flex-row items-center bg-neutral-20 px-[10px] py-[5px] rounded-lg"
                      onPress={handleAddFriend}
                      icon={
                        <Ionicons
                          name="person-add-outline"
                          size={18}
                          color="#E95B0C"
                        />
                      }
                    />
                  )}
                </View>
              </View>
            </View>
            {/* Bio Section */}
            <View className="flex-column justify-between items-start">
              <Text className="text-BodyRegular font-Manrope font-bold text-neutral-100">
                Bio
              </Text>
              <Text className="text-BodyRegular font-Manrope font-medium text-neutral-70">
                {user.bio}
              </Text>
            </View>
            {/* Friends Section */}
            <View className="flex-column gap-3">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Text className="text-BodyRegular font-Manrope font-bold text-neutral-100">
                    Friends
                  </Text>
                  <View className="bg-transparent border border-primary rounded-full py-0.5 px-2 ml-2">
                    <Text className="text-primary font-Manrope text-BodyRegular font-bold">
                      {user.friends ? user.friends.length : 0}
                    </Text>
                  </View>
                </View>
                {/* See all button */}
                <TouchableOpacity
                  className="flex-row items-center gap-1"
                  activeOpacity={0.6}
                  onPress={() =>
                    router.push({
                      pathname: "/user/[id]/friends",
                      params: { id: user.id, name: user.name },
                    })
                  }
                >
                  <Text className="text-primary font-Manrope text-BodySmallRegular font-semibold">
                    See all
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#E95B0C" />
                </TouchableOpacity>
              </View>
              {/* Friends Profile pics  */}
              <View className="flex-row items-center mt-1">
                {(user.friends && user.friends.slice(0, 4)).map(
                  (friend: any, idx: number) => (
                    <Image
                      key={friend.id || idx}
                      source={{
                        uri:
                          friend.avatar ||
                          "https://randomuser.me/api/portraits/men/32.jpg",
                      }}
                      className={`w-[45px] h-[45px] rounded-full ${idx !== 0 ? "-ml-3" : ""}`}
                      style={{ zIndex: 10 + idx }}
                    />
                  )
                )}
              </View>
            </View>
          </View>
          {/* Milestones Section */}
          <View className="mx-3 my-3 flex-column gap-5 bg-neutral-10 border border-neutral-30 shadow-black-shadow p-4 rounded-[10px]">
            <Text className="text-Heading5 font-Manrope font-bold text-neutral-100 ">
              Milestones
            </Text>
            <View className="flex-row justify-around mb-1">
              <View className="items-center">
                <Text className="text-Heading5 font-bold font-Manrope text-primary">
                  {user.streak}
                </Text>
                <Text className="text-neutral-70 font-Manrope font-medium text-BodySmallRegular mb-2">
                  Daily Streak
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-Heading5 font-bold font-Manrope text-primary">
                  {user.booksCompleted}
                </Text>
                <Text className="text-neutral-70 font-Manrope font-medium text-BodySmallRegular mb-2">
                  Books Completed
                </Text>
              </View>
            </View>
            {/* Recommendations Section (read-only, no edit) */}
            <BookCollectionSection
              title={`${user.name.split(" ")[0]}'s Suggestions`}
              books={user.recommendations}
              emptyText="No Suggestions"
              editMode={false}
              showAddNew={false}
              onBookPress={(book) => {
                router.push({
                  pathname: "/summary/[id]",
                  params: { id: String(book.id) },
                });
              }}
            />
            {/* Favorite Books Section (read-only, no edit) */}
            <BookCollectionSection
              title={`${user.name.split(" ")[0]}'s Favorite`}
              books={user.favorites}
              icon={<Ionicons name="heart" size={20} color="#C8150C" />}
              emptyText="No Favorites"
              editMode={false}
              showAddNew={false}
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
              <Text className="text-primary">
                {formatJoinDate(user.joinDate)}
              </Text>
            </Text>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
