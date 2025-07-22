import React from "react";
import { View, Text, TouchableOpacity, Modal, Image } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Book } from "@/hooks/useUserStore";

interface BookActionModalProps {
  visible: boolean;
  onClose: () => void;
  book: Book | null;
  onAddToRecommendations: (book: Book) => void;
  onAddToFavorites: (book: Book) => void;
  onAddToReading: (book: Book) => void;
  onAddToSaved: (book: Book) => void;
  onMarkAsCompleted: (book: Book) => void;
  onShare: (book: Book) => void;
  onRemoveFromLibrary: (book: Book) => void;
  isInRecommendations?: boolean;
  isInFavorites?: boolean;
  isInReading?: boolean;
  isInSaved?: boolean;
  isCompleted?: boolean;
}

const BookActionModal: React.FC<BookActionModalProps> = ({
  visible,
  onClose,
  book,
  onAddToRecommendations,
  onAddToFavorites,
  onAddToReading,
  onAddToSaved,
  onMarkAsCompleted,
  onShare,
  onRemoveFromLibrary,
  isInRecommendations = false,
  isInFavorites = false,
  isInReading = false,
  isInSaved = false,
  isCompleted = false,
}) => {
  if (!book) return null;

  const actionItems = [
    {
      icon: <MaterialIcons name="share" size={24} color="#333" />,
      title: "Share",
      onPress: () => onShare(book),
      show: true,
    },
    {
      icon: <Ionicons name="bulb-outline" size={24} color="#333" />,
      title: isInRecommendations
        ? "Remove from Suggestions"
        : "Add to Suggestions",
      onPress: () => onAddToRecommendations(book),
      show: true,
    },
    {
      icon: (
        <Ionicons
          name="heart"
          size={24}
          color={isInFavorites ? "#C8150C" : "#333"}
        />
      ),
      title: isInFavorites ? "Remove from Favorites" : "Add to Favorites",
      onPress: () => onAddToFavorites(book),
      show: true,
    },
    {
      icon: <Ionicons name="book-outline" size={24} color="#333" />,
      title: isInReading ? "Remove from Reading" : "Add to Reading",
      onPress: () => onAddToReading(book),
      show: true,
    },
    {
      icon: <Ionicons name="bookmark-outline" size={24} color="#333" />,
      title: isInSaved ? "Remove from Saved" : "Save for Later",
      onPress: () => onAddToSaved(book),
      show: true,
    },
    {
      icon: (
        <Ionicons
          name={isCompleted ? "close-circle" : "checkmark-circle"}
          size={24}
          color={isCompleted ? "#C8150C" : "#333"}
        />
      ),
      title: isCompleted ? "Mark as Incomplete" : "Mark as Completed",
      onPress: () => onMarkAsCompleted(book),
      show: true,
    },
    {
      icon: <Ionicons name="trash-outline" size={24} color="#C8150C" />,
      title: "Remove from Library",
      onPress: () => onRemoveFromLibrary(book),
      show: isInReading || isInSaved || isCompleted,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <TouchableOpacity
          className="flex-1"
          activeOpacity={1}
          onPress={onClose}
        />

        <View className="bg-white rounded-t-3xl p-6">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-Heading4 font-Manrope font-bold text-neutral-100">
              {book.title}
            </Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.6}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Book Info */}
          <View className="flex-row items-center mb-6">
            <Image
              source={{ uri: book.cover }}
              className="w-16 h-20 rounded-lg mr-4"
              resizeMode="cover"
            />
            <View className="flex-1">
              <Text className="text-BodyRegular font-Manrope font-bold text-neutral-100 mb-1">
                {book.title}
              </Text>
              <Text className="text-BodySmallRegular font-Manrope font-medium text-neutral-70">
                {book.author}
              </Text>
            </View>
          </View>

          {/* Action Items */}
          <View className="space-y-4">
            {actionItems
              .filter((item) => item.show)
              .map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className="flex-row items-center py-3"
                  onPress={item.onPress}
                  activeOpacity={0.6}
                >
                  <View className="w-8 mr-4 items-center">{item.icon}</View>
                  <Text className="text-BodyRegular font-Manrope font-medium text-neutral-100 flex-1">
                    {item.title}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>

          {/* Bottom spacing for safe area */}
          <View className="h-4" />
        </View>
      </View>
    </Modal>
  );
};

export default BookActionModal;
