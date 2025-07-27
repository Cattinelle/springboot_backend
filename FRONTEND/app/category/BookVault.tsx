import BookCard from "@/components/BookCard";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore, Book } from "@/hooks/useUserStore";
import { useBookStore } from "@/hooks/useBookStore";

const BOOKS_PER_PAGE = 6;

type BookVaultProps = {
  onBookPress?: (book: Book) => void;
};

const BookVault: React.FC<BookVaultProps> = ({ onBookPress }) => {
  const { books, loading, error, fetchBooks } = useBookStore();

  const router = useRouter();
  const { type } = useLocalSearchParams();
  const { pendingAddType, addRecommendation, addFavorite, setPendingAddType } =
    useUserStore();

  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Fetch books on mount
  useEffect(() => {
    fetchBooks();
  }, []);

  // Filter and paginate books
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
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

  // Handler for selecting a book
  const handleSelectBook = (book: Book) => {
    if (pendingAddType === "recommendation") addRecommendation(book);
    if (pendingAddType === "favorite") addFavorite(book);
    setPendingAddType(null);
    router.back();
  };

  return (
    <ImageBackground
      source={require("@/assets/images/vectorbg.png")}
      resizeMode="cover"
      className="flex-1 bg-neutral-10"
      imageStyle={{ opacity: 0.03 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={0}
        >
          <SafeAreaView className="flex-1">
            {/* Header */}
            <View
              className={`relative w-full border-b border-neutral-40 pt-10 bg-neutral-10 flex-col justify-start items-center ${
                showSearch ? "pb-0" : "pb-7"
              }`}
            >
              <TouchableOpacity
                onPress={() => router.back()}
                className="absolute left-4 top-10"
                hitSlop={20}
              >
                <AntDesign name="arrowleft" size={24} color="black" />
              </TouchableOpacity>
              <Text className="text-Heading6 font-Manrope font-medium">
                Book Vault
              </Text>
              {!showSearch && (
                <TouchableOpacity
                  onPress={() => setShowSearch((prev) => !prev)}
                  className="absolute right-5 top-10"
                  hitSlop={20}
                >
                  <Feather
                    name="search"
                    size={22}
                    color="black"
                    style={{ marginLeft: 8 }}
                  />
                </TouchableOpacity>
              )}
              {showSearch && (
                <View className="w-[90%] py-7">
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search for a book or author..."
                    className=""
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 8,
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      fontSize: 16,
                      borderWidth: 1,
                      borderColor: "#E0E0E0",
                    }}
                    placeholderTextColor="#A0A0A0"
                    autoFocus
                  />
                </View>
              )}
            </View>
            <View style={{ flex: 1, marginHorizontal: "auto" }}>
              {/* Loading/Error State */}
              {loading ? (
                <ActivityIndicator
                  size="large"
                  color="#000"
                  style={{ marginTop: 40 }}
                />
              ) : error ? (
                <View className="flex-1 justify-start items-center mt-10">
                  <MaterialIcons
                    name="error-outline"
                    size={60}
                    color="#C8150C"
                  />
                  <Text className="text-center font-Manrope font-medium mt-5 text-BodyBold text-secondary">
                    {error}
                  </Text>
                </View>
              ) : (
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
                      <TouchableOpacity>
                        <BookCard
                          id={Number(item.id)}
                          title={item.title}
                          author={item.author}
                          cover={
                            item.cover ??
                            "https://i.pinimg.com/736x/d8/94/e9/d894e93575ace5acb3eb4ab2e10f3985.jpg"
                          } // <-- fallback to empty string if undefined
                          onPress={() =>
                            handleSelectBook({
                              ...item,
                              id: String(item.id),
                              cover:
                                item.cover ??
                                "https://i.pinimg.com/736x/d8/94/e9/d894e93575ace5acb3eb4ab2e10f3985.jpg",
                            })
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                  ListFooterComponent={
                    filteredBooks.length > BOOKS_PER_PAGE ? (
                      <View className="w-full justify-center items-center">
                        <View className="w-full justify-center items-center mt-2">
                          <View className="py-3 flex-row justify-center items-center gap-1">
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
                            <View className="flex-row flex-wrap">
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
                                      currentPage === idx
                                        ? "#C2C2C2"
                                        : "transparent",
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity:
                                      currentPage === idx ? 0.5 : 0,
                                    shadowRadius: 2,
                                  }}
                                >
                                  <Text
                                    className={`$${
                                      currentPage === idx
                                        ? "text-neutral-90 font-semibold text-Heading6"
                                        : "text-neutral-50 font-medium text-BodyBold"
                                    } font-Manrope`}
                                  >
                                    {idx + 1}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                            {/* Right Arrow */}
                            <TouchableOpacity
                              onPress={() =>
                                setCurrentPage((p) =>
                                  Math.min(totalPages - 1, p + 1)
                                )
                              }
                              disabled={currentPage === totalPages - 1}
                              style={{
                                opacity:
                                  currentPage === totalPages - 1 ? 0.3 : 1,
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
              )}
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
};

export default BookVault;
