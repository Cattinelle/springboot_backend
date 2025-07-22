import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useUserStore, Book, LibraryItem } from "@/hooks/useUserStore";
import BookActionModal from "@/components/BookActionModal";

type TabType = "reading" | "saved" | "completed";

const Library = () => {
  const [activeTab, setActiveTab] = useState<TabType>("reading");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  const isBookInCollection = (bookId: string, collection: Book[]) => {
    return collection.some((book) => book.id === bookId);
  };

  const handleBookAction = (book: Book, action: string) => {
    switch (action) {
      case "addToRecommendations":
        if (
          isBookInCollection(book.id, useUserStore.getState().recommendations)
        ) {
          removeRecommendation(book.id);
        } else {
          addRecommendation(book);
        }
        break;
      case "addToFavorites":
        if (isBookInCollection(book.id, useUserStore.getState().favorites)) {
          removeFavorite(book.id);
        } else {
          addFavorite(book);
        }
        break;
      case "addToReading":
        if (isBookInCollection(book.id, reading)) {
          removeFromReading(book.id);
        } else {
          addToReading({ ...book, progress: 0 });
        }
        break;
      case "addToSaved":
        if (isBookInCollection(book.id, savedForLater)) {
          removeFromSaved(book.id);
        } else {
          addToSaved(book);
        }
        break;
      case "markAsCompleted":
        if (isBookInCollection(book.id, completed)) {
          removeFromCompleted(book.id);
        } else {
          addToCompleted(book);
        }
        break;
      case "removeFromLibrary":
        removeFromReading(book.id);
        removeFromSaved(book.id);
        removeFromCompleted(book.id);
        break;
    }
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

  const renderBookItem = (book: Book | LibraryItem, index: number) => {
    const isReading = activeTab === "reading";
    const isCompleted = activeTab === "completed";
    const libraryItem = book as LibraryItem;

    return (
      <View
        key={book.id}
        className="flex-row items-center mb-4 bg-white rounded-lg p-3 shadow-sm"
      >
        <Image
          source={{ uri: book.cover }}
          className="w-16 h-20 rounded-lg mr-3"
          resizeMode="cover"
        />

        <View className="flex-1">
          <Text
            className="text-BodyRegular font-Manrope font-bold text-neutral-100 mb-1"
            numberOfLines={2}
          >
            {book.title}
          </Text>
          <Text className="text-BodySmallRegular font-Manrope font-medium text-neutral-70 mb-1">
            {book.author}
          </Text>

          {isReading && libraryItem.progress !== undefined && (
            <View className="flex-row items-center mb-1">
              <View className="flex-1 h-1 bg-neutral-30 rounded-full mr-2">
                <View
                  className="h-1 bg-primary rounded-full"
                  style={{ width: `${libraryItem.progress}%` }}
                />
              </View>
              <Text className="text-BodySmallRegular font-Manrope font-medium text-neutral-70">
                {libraryItem.progress}%
              </Text>
            </View>
          )}

          {isCompleted && book.completedDate && (
            <Text className="text-BodySmallRegular font-Manrope font-medium text-neutral-60">
              Completed on {formatDate(book.completedDate)}
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={() => {
            setSelectedBook(book);
            setModalVisible(true);
          }}
          className="p-2"
          activeOpacity={0.6}
        >
          <Ionicons name="ellipsis-vertical" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    );
  };

  const currentBooks = getCurrentBooks();

  return (
    <SafeAreaView className="flex-1 bg-neutral-10">
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
              {tab.title}
            </Text>
            {tab.count > 0 && (
              <View className="bg-primary rounded-full px-2 py-0.5 mt-1">
                <Text className="text-white text-xs font-Manrope font-bold">
                  {tab.count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

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
              {activeTab === "reading" && "Start reading a book to see it here"}
              {activeTab === "saved" && "Save books for later to see them here"}
              {activeTab === "completed" && "Complete books to see them here"}
            </Text>
          </View>
        ) : (
          <View>
            {currentBooks.map((book, index) => renderBookItem(book, index))}
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
        onMarkAsCompleted={(book) => handleBookAction(book, "markAsCompleted")}
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
                useUserStore.getState().recommendations
              )
            : false
        }
        isInFavorites={
          selectedBook
            ? isBookInCollection(
                selectedBook.id,
                useUserStore.getState().favorites
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
          selectedBook ? isBookInCollection(selectedBook.id, completed) : false
        }
      />
    </SafeAreaView>
  );
};

export default Library;
