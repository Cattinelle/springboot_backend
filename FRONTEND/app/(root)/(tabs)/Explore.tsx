import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import categoryIcons from "@/constants/categoryIcons";
import UserMicroCard from "@/components/UserMicroCard";
import booksData from "@/assets/data/books.json";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import BookCard from "@/components/BookCard";
import { useUserStore } from "@/hooks/useUserStore";
import CategoryTag from "@/components/CategoryTag";

// Helper to get N random users from an array
function getRandomUsers<T>(users: T[], n: number): T[] {
  const shuffled = [...users].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { allUsers, fetchAllUsers } = useUserStore();
  const [randomUsers, setRandomUsers] = useState<
    Array<{ id: string; avatar: string; name: string; country: string }>
  >([]);

  // Fetch users on mount
  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  // Pick 6 random users whenever allUsers changes
  useEffect(() => {
    if (allUsers.length > 0) {
      setRandomUsers(getRandomUsers(allUsers, 6));
    }
  }, [allUsers]);

  // Filter books for search
  const searchResults = booksData.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter books for latest summaries
  const latestSummaries = booksData.filter(
    (book) => book.status === "new_release"
  );

  if (searchQuery.trim()) {
    // Show only search results
    return (
      <SafeAreaView className="flex-1 bg-neutral-10">
        {/* Header */}
        <View className="flex-row justify-between border-b border-neutral-20 items-center px-3 py-2 bg-neutral-10">
          <TouchableOpacity
            className="flex-row items-center gap-1"
            onPress={() => router.push("/")}
          >
            <Image
              source={require("../../../assets/images/quicktales_logo.png")}
              className="object-cover w-[50px] h-[60px]"
            />
            <Text className="text-lg font-extrabold font-Montserrat tracking-widest text-secondary">
              QUICKTALES
            </Text>
          </TouchableOpacity>
        </View>
        <ImageBackground
          source={require("../../../assets/images/vectorbg.png")}
          resizeMode="cover"
          className="flex-1 bg-neutral-10"
          imageStyle={{ opacity: 0.02 }}
        >
          <ScrollView className="flex-1 bg-white">
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Type title, author, or category"
              className="m-4 px-4 py-3 rounded-lg bg-neutral-20 text-base"
            />
            <View className="px-4">
              <Text className="font-bold text-base mb-2">Search Results</Text>
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View className="mb-4">
                    {/* Replace with your BookCard */}
                    <Text>
                      {item.title} by {item.author}
                    </Text>
                  </View>
                )}
              />
            </View>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  // Main Explore page
  return (
    <SafeAreaView className="flex-1 bg-neutral-10">
      {/* Header */}
      <View className="flex-row justify-between border-b border-neutral-20 items-center px-3 py-2 bg-neutral-10">
        <TouchableOpacity
          className="flex-row items-center gap-1"
          onPress={() => router.push("/")}
        >
          <Image
            source={require("../../../assets/images/quicktales_logo.png")}
            className="object-cover w-[50px] h-[60px]"
          />
          <Text className="text-lg font-extrabold font-Montserrat tracking-widest text-secondary">
            QUICKTALES
          </Text>
        </TouchableOpacity>
      </View>
      <ImageBackground
        source={require("../../../assets/images/vectorbg.png")}
        resizeMode="cover"
        className="flex-1 bg-neutral-10"
        imageStyle={{ opacity: 0.02 }}
      >
        <ScrollView
          className="flex-1 pt-5 pb-40"
          showsVerticalScrollIndicator={false}
        >
          {/* Search Input */}
          <View className="bg-neutral-10 border border-[#E0E0E0] mx-4 mt-2 mb-6 rounded-[10px] px-4 py-1 flex-row items-center gap-2">
            <Ionicons name="search-sharp" size={20} color="#C2C2C2" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Type title, author, or category"
              className="flex-1 bg-transparent placeholder:text-neutral-50 py-3 rounded-lg text-BodySmallRegular font-Manrope font-medium"
            />
          </View>

          {/* Show Me Books On */}
          <View className="gap-5 mb-7">
            <Text className="text-BodyRegular font-Manrope text-neutral-90 font-bold ml-4">
              Show me books on
            </Text>

            <View className="ml-4">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-column">
                  {/* First row */}
                  <View className="flex-row mb-2">
                    {Object.entries(categoryIcons)
                      .slice(0, 4)
                      .map(([name, Icon]) => (
                        <View key={name}>
                          <CategoryTag
                            label={name}
                            Icon={Icon}
                            onPress={() =>
                              router.push(
                                `/category/${encodeURIComponent(name)}`
                              )
                            }
                          />
                        </View>
                      ))}
                  </View>
                  {/* Second row */}
                  <View className="flex-row">
                    {Object.entries(categoryIcons)
                      .slice(4, 8)
                      .map(([name, Icon]) => (
                        <View key={name}>
                          <CategoryTag
                            label={name}
                            Icon={Icon}
                            onPress={() =>
                              router.push(
                                `/category/${encodeURIComponent(name)}`
                              )
                            }
                          />
                        </View>
                      ))}
                  </View>
                </View>
              </ScrollView>
            </View>
            {/* <View className="flex-column gap-2">
              {/* First row: first 4 categories, horizontal scroll */}
            {/* <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="ml-4"
              >
                {Object.entries(categoryIcons)
                  .slice(0, 4)
                  .map(([name, Icon]) => (
                    <CategoryTag
                      key={name}
                      label={name}
                      Icon={Icon}
                      onPress={() =>
                        router.push(`/category/${encodeURIComponent(name)}`)
                      }
                    />
                  ))}
              </ScrollView> */}
            {/* Second row: next 4 categories, horizontal scroll */}
            {/* <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="ml-4"
              >
                {Object.entries(categoryIcons)
                  .slice(4, 8)
                  .map(([name, Icon]) => (
                    <CategoryTag
                      key={name}
                      label={name}
                      Icon={Icon}
                      onPress={() =>
                        router.push(`/category/${encodeURIComponent(name)}`)
                      }
                    />
                  ))}
              </ScrollView> */}
            {/* </View> */}
          </View>
          {/* Find Friends */}
          <View className=" gap-2 mb-3">
            <View className="mx-4 flex-row justify-between items-center">
              <Text className="text-BodyRegular font-Manrope text-neutral-90 font-bold">
                Find Friends
              </Text>
              <TouchableOpacity
                className="flex-row items-center gap-1"
                onPress={() => router.push("/findfriends")}
                activeOpacity={0.6}
                hitSlop={10}
              >
                <Text className="text-primary font-bold text-BodySmallRegular font-Manrope">
                  Explore
                </Text>
                <FontAwesome6
                  name="arrow-right-to-bracket"
                  size={16}
                  color="#E95B0C"
                />
              </TouchableOpacity>
            </View>
            <View className="mb-3 ml-4">
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={randomUsers}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => router.push(`/user/${item.id}`)}
                  >
                    <UserMicroCard
                      id={item.id}
                      avatar={item.avatar}
                      name={item.name}
                      country={item.country}
                    />
                  </TouchableOpacity>
                )}
                className="mt-2 py-2"
              />
            </View>
          </View>
          {/* Latest Summaries */}
          <View className=" gap-5 pb-28">
            <View className="ml-4">
              <Text className="text-BodyRegular font-Manrope text-neutral-90 font-bold">
                Latest Summaries
              </Text>
              <Text className="text-neutral-80 text-BodySmallRegular font-medium font-Manrope">
                Newly added summaries we picked for you
              </Text>
            </View>

            <View className="ml-4">
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={latestSummaries}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View className="mr-3.5">
                    <BookCard
                      id={item.id}
                      title={item.title}
                      author={item.author}
                      cover={item.cover}
                    />
                  </View>
                )}
                contentContainerStyle={{ paddingRight: 30 }}
              />
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Explore;
