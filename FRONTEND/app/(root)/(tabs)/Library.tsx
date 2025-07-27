import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import booksData from "@/assets/data/books.json";
// import { useUserStore, Book, LibraryItem } from "@/hooks/useUserStore";
import BookActionModal from "@/components/BookActionModal";
import { SafeAreaView } from "react-native-safe-area-context";
import BookCard from "@/components/BookCard";
import ContinueReading from "@/assets/images/continuereading.png";

type TabType = "reading" | "saved" | "completed";

const Library = () => {
  const [activeTab, setActiveTab] = useState<TabType>("reading");
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Dummy data for demo purposes
  const [reading, setReading] = useState<any[]>(booksData.slice(0, 2));
  const [savedForLater, setSavedForLater] = useState<any[]>(
    booksData.slice(2, 4)
  );
  const [completed, setCompleted] = useState<any[]>(
    booksData
      .slice(4, 6)
      .map((b) => ({ ...b, completedDate: new Date().toISOString() }))
  );

  /*
  // Actual backend logic (commented out for demo)
  const {
    reading,
    savedForLater,
    completed,
    addToReading,
    addToSaved,
    addToCompleted,
    removeFromReading,
    removeFromSaved,
    removeFromCompleted,
    addRecommendation,
    addFavorite,
    removeRecommendation,
    removeFavorite,
    fetchUserData,
  } = useUserStore();

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);
  */

  const tabs = [
    { key: "reading" as TabType, title: "Reading", count: reading.length },
    {
      key: "saved" as TabType,
      title: "Saved for Later",
      count: savedForLater.length,
    },
    {
      key: "completed" as TabType,
      title: "Completed",
      count: completed.length,
    },
  ];

  const getCurrentBooks = () => {
    switch (activeTab) {
      case "reading":
        return reading;
      case "saved":
        return savedForLater;
      case "completed":
        return completed;
      default:
        return [];
    }
  };

  const isBookInCollection = (bookId: string, collection: any[]) => {
    return collection.some((book) => book.id === bookId);
  };

  const handleBookAction = (book: any, action: string) => {
    // Demo: No backend actions, just close modal
    setModalVisible(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderBookItem = (book: any, index: number) => {
    const isReading = activeTab === "reading";
    const isCompleted = activeTab === "completed";
    const libraryItem = book;

    return (
      <View key={book.id} className="mb-4 relative">
        <BookCard
          id={Number(book.id)}
          title={book.title}
          author={book.author}
          cover={book.cover ?? ""}
        />
        <TouchableOpacity
          onPress={() => {
            setSelectedBook(book);
            setModalVisible(true);
          }}
          className="active:bg-neutral-100 absolute bottom-9 right-2 bg-neutral-10 rounded-[8px] p-1.5 shadow-white-shadow"
          activeOpacity={0.8}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  const currentBooks = getCurrentBooks();

  return (
    <View className="flex-1">
      <SafeAreaView edges={["top"]} className="bg-neutral-10">
        {/* Header */}
        <View className="flex-row justify-between items-center px-4 py-5 bg-white">
          <Text className="text-Heading3 font-Manrope font-bold text-secondary">
            Library
          </Text>
        </View>

        {/* Tabs */}
        <View className="flex-row flex-wrap items-start bg-white border-b border-neutral-20">
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              className={`flex-1 py-3 items-center ${
                activeTab === tab.key ? "border-b-2 border-neutral-100" : ""
              }`}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.6}
            >
              <Text
                className={`text-BodyRegular font-Manrope font-semibold ${
                  activeTab === tab.key ? "text-neutral-100" : "text-neutral-70"
                }`}
              >
                {tab.title} {tab.count > 0 && tab.count}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
      <ImageBackground
        source={require("../../../assets/images/vectorbg.png")}
        resizeMode="cover"
        className="flex-1 bg-neutral-10"
        imageStyle={{ opacity: 0.02 }}
      >
        {/* Content */}
        <ScrollView className="flex-1 px-4 pt-4">
          {currentBooks.length === 0 ? (
            <View className="flex-1 items-center justify-center py-20">
              <Ionicons
                name={
                  activeTab === "completed"
                    ? "checkmark-circle"
                    : activeTab === "saved"
                      ? "bookmark-outline"
                      : "book-outline"
                }
                size={64}
                color="#ccc"
              />
              <Text className="text-Heading5 font-Manrope font-bold text-neutral-70 mt-4 mb-2">
                {activeTab === "reading" && "No books in progress"}
                {activeTab === "saved" && "No saved books"}
                {activeTab === "completed" && "No completed books"}
              </Text>
              <Text className="text-BodySmallRegular font-Manrope font-medium text-neutral-60 text-center">
                {activeTab === "reading" &&
                  "Start reading a book to see it here"}
                {activeTab === "saved" &&
                  "Save books for later to see them here"}
                {activeTab === "completed" && "Complete books to see them here"}
              </Text>
            </View>
          ) : (
            <View className="flex-col gap-6 mt-10 px-6">
                <View className="flex-row gap-2 justify-start items-center">
                  {activeTab === "reading" && <Ionicons name="book-outline" size={20} color="#404040" />}
                  {activeTab === "saved" && <Ionicons name="bookmark-outline" size={20} color="#404040" />}
                  {activeTab === "completed" && <Ionicons name="checkmark-circle" size={20} color="#404040" />}
                <Text className="text-Heading6 font-Manrope font-bold text-neutral-90">
                  {activeTab === "reading" && "Continue Reading"}
                  {activeTab === "saved" && "Saved for Later"}
                  {activeTab === "completed" && "Completed"}
                </Text>
              </View>
              <View className="flex-row  justify-around items-start flex-wrap">
                {currentBooks.map((book, index) => renderBookItem(book, index))}
              </View>
            </View>
          )}
        </ScrollView>
        {/* Book Action Modal */}
        <BookActionModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          book={selectedBook}
          onAddToRecommendations={(book) =>
            handleBookAction(book, "addToRecommendations")
          }
          onAddToFavorites={(book) => handleBookAction(book, "addToFavorites")}
          onAddToReading={(book) => handleBookAction(book, "addToReading")}
          onAddToSaved={(book) => handleBookAction(book, "addToSaved")}
          onMarkAsCompleted={(book) =>
            handleBookAction(book, "markAsCompleted")
          }
          onShare={(book) => {
            // TODO: Implement share functionality
            console.log("Share book:", book.title);
            setModalVisible(false);
          }}
          onRemoveFromLibrary={(book) =>
            handleBookAction(book, "removeFromLibrary")
          }
          isInRecommendations={
            selectedBook
              ? isBookInCollection(
                  selectedBook.id,
                  // useUserStore.getState().recommendations // This line was removed
                  [] // Placeholder for recommendations
                )
              : false
          }
          isInFavorites={
            selectedBook
              ? isBookInCollection(
                  selectedBook.id,
                  // useUserStore.getState().favorites // This line was removed
                  [] // Placeholder for favorites
                )
              : false
          }
          isInReading={
            selectedBook ? isBookInCollection(selectedBook.id, reading) : false
          }
          isInSaved={
            selectedBook
              ? isBookInCollection(selectedBook.id, savedForLater)
              : false
          }
          isCompleted={
            selectedBook
              ? isBookInCollection(selectedBook.id, completed)
              : false
          }
        />
      </ImageBackground>
    </View>
  );
};

export default Library;
