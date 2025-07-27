import booksData from "@/assets/data/books.json";
import BookCard from "@/components/BookCard";
import categoryIcons from "@/constants/categoryIcons";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BOOKS_PER_PAGE = 6;

const CategoryDetails = () => {
  const { category } = useLocalSearchParams();
  const decodedCategory = decodeURIComponent(category as string);
  const Icon = categoryIcons[decodedCategory];

  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const filteredBooks = booksData.filter(
    (book) =>
      book.category === decodedCategory &&
      (book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);
  const currentBooks = filteredBooks.slice(
    currentPage * BOOKS_PER_PAGE,
    (currentPage + 1) * BOOKS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery]);

  useEffect(() => {
    if (currentPage > totalPages - 1) {
      setCurrentPage(Math.max(0, totalPages - 1));
    }
  }, [filteredBooks.length, totalPages]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <SafeAreaView
          edges={["top"]}
          className=" bg-neutral-10 border-b border-neutral-20"
        >
          {/* Header */}
          <View
            className={`flex-column gap-3 w-full bg-neutral-10 border-b ${showSearch ? "pt-7 pb-5" : "py-[25px]"} border-neutral-30`}
          >
            <View className="flex-row gap-10 px-4 justify-around items-center bg-neutral-10">
              <TouchableOpacity onPress={() => router.back()}>
                <AntDesign name="arrowleft" size={24} color="black" />
              </TouchableOpacity>
              <View className="flex-row items-center gap-2">
                {Icon && (
                  <Icon width={22} height={22} style={{ marginLeft: 10 }} />
                )}
                <Text className="text-Heading6 font-Manrope font-medium capitalize">
                  {decodedCategory}
                </Text>
              </View>
              {/* Search icon */}
              <TouchableOpacity onPress={() => setShowSearch((v) => !v)}>
                <Feather name="search" size={22} color="black" />
              </TouchableOpacity>
            </View>
            {showSearch && (
              <View className="w-[90%] pt-5 mx-auto">
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search for a book or author..."
                  className="bg-neutral-10 border border-[#E0E0E0] rounded-lg px-4 py-[10px] text-[15px] font-Manrope"
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
          <View className="flex-1 mx-auto pb-12">
            {/* Book Grid */}
            <FlatList
              data={currentBooks}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                marginHorizontal: "auto",
                alignItems: "center",
                paddingTop: 24,
                paddingBottom: 24, // add space for pagination
              }}
              columnWrapperStyle={{
                justifyContent: "space-between",
              }}
              renderItem={({ item }) => (
                <View className="px-5 py-3 justify-center items-center">
                  <BookCard
                    id={item.id}
                    title={item.title}
                    author={item.author}
                    cover={item.cover}
                  />
                </View>
              )}
              ListFooterComponent={
                filteredBooks.length > BOOKS_PER_PAGE ? (
                  <View className="w-full justify-center items-center">
                    <View className="w-[90%] justify-center items-center mt-2">
                      <View className="py-3 flex-row justify-center items-center gap-3">
                        {/* Left Arrow */}
                        <TouchableOpacity
                          onPress={() =>
                            setCurrentPage((p) => Math.max(0, p - 1))
                          }
                          disabled={currentPage === 0}
                          style={{
                            opacity: currentPage === 0 ? 0.3 : 1,
                            padding: 6,
                          }}
                        >
                          <Feather
                            name="chevron-left"
                            size={24}
                            color="#757575"
                          />
                        </TouchableOpacity>
                        {/* Page Numbers */}
                        {[...Array(totalPages)].map((_, idx) => (
                          <TouchableOpacity
                            key={idx}
                            onPress={() => setCurrentPage(idx)}
                            className={`w-[38px] h-[38px] rounded-lg justify-center items-center ${
                              currentPage === idx
                                ? "bg-neutral-10"
                                : "bg-transparent"
                            }`}
                            style={{
                              shadowColor:
                                currentPage === idx ? "#C2C2C2" : "transparent",
                              shadowOffset: { width: 0, height: 1 },
                              shadowOpacity: currentPage === idx ? 0.5 : 0,
                              shadowRadius: 2,
                            }}
                          >
                            <Text
                              className={`${
                                currentPage === idx
                                  ? "text-neutral-90 font-semibold text-Heading6"
                                  : "text-neutral-50 font-medium text-BodyBold"
                              } font-Manrope`}
                            >
                              {idx + 1}
                            </Text>
                          </TouchableOpacity>
                        ))}
                        {/* Right Arrow */}
                        <TouchableOpacity
                          onPress={() =>
                            setCurrentPage((p) =>
                              Math.min(totalPages - 1, p + 1)
                            )
                          }
                          disabled={currentPage === totalPages - 1}
                          style={{
                            opacity: currentPage === totalPages - 1 ? 0.3 : 1,
                            padding: 6,
                          }}
                        >
                          <Feather
                            name="chevron-right"
                            size={24}
                            color="#757575"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ) : null
              }
              keyboardShouldPersistTaps="handled"
            />
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default CategoryDetails;
