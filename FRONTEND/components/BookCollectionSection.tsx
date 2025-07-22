import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { AntDesign, Feather, Entypo, Ionicons } from "@expo/vector-icons";
import { Book } from "@/hooks/useUserStore";
import BookCard from "./BookCard";

interface BookCollectionSectionProps {
  title: string;
  books: Book[];
  icon?: React.ReactNode;
  editMode?: boolean;
  onEdit?: () => void;
  onRemove?: (book: Book) => void;
  onAddNew?: () => void;
  onBookPress?: (book: Book) => void;
  emptyText?: string;
  showAddNew?: boolean;
}

const BookCollectionSection: React.FC<BookCollectionSectionProps> = ({
  title,
  books,
  icon,
  editMode = false,
  onEdit,
  onRemove,
  onAddNew,
  onBookPress,
  emptyText = "Add New",
  showAddNew = true,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Show only Add New card if empty
  if (books.length === 0) {
    return (
      <View>
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-2">
            {icon}
            <Text className="text-Heading5 font-Manrope font-bold text-neutral-100">
              {title}
            </Text>
          </View>
        </View>
        {showAddNew && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity onPress={onAddNew} activeOpacity={0.7}>
              <View className="w-[130px] h-[200px] rounded-[10px] items-center justify-center bg-neutral-20">
                <Feather name="plus" size={35} color="black" />
                <Text className="mt-2 text-center text-neutral-100 text-BodySmallRegular font-Manrope">
                  {emptyText}
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    );
  }

  // Non-empty: show books, Add New card, and Edit button
  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-2">
          {icon}
          <Text className="text-Heading5 font-Manrope font-bold text-neutral-100">
            {title}
          </Text>
        </View>
        <>
          {books.length > 0 && onEdit && (
            <TouchableOpacity
              onPress={onEdit}
              activeOpacity={0.6}
              className="flex-row gap-1 items-center"
            >
              <AntDesign
                name={editMode ? "check" : "edit"}
                size={16}
                color="#E95B0C"
              />
              <Text className="text-primary font-Manrope font-bold text-BodySmallRegular">
                {editMode ? "Done" : "Edit"}
              </Text>
            </TouchableOpacity>
          )}
        </>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {/* Books */}
        {books.map((book) => (
          <View key={book.id} className="mr-4 relative">
            <TouchableOpacity
              onPress={() => onBookPress?.(book)}
              activeOpacity={0.7}
            >
              <BookCard
                id={Number(book.id)}
                title={book.title}
                author={book.author}
                cover={book.cover}
                onPress={() => onBookPress?.(book)}
              />
            </TouchableOpacity>
            {/* Three-dot for remove in edit mode */}
            {editMode && (
              <TouchableOpacity
                onPress={() => onRemove?.(book)}
                className="absolute top-1 right-1 bg-white/90 rounded-[10px] shadow-black-shadow p-1.5"
                activeOpacity={0.7}
              >
                <Ionicons name="remove-outline" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>
        ))}
        {/* Add New card always at end, but disables edit mode if active */}
        {showAddNew && books.length < 4 && (
          <TouchableOpacity
            onPress={() => {
              if (editMode && onEdit) onEdit();
              onAddNew && onAddNew();
            }}
            activeOpacity={0.7}
          >
            <View className="w-[130px] h-[200px] rounded-[10px] items-center justify-center bg-neutral-20">
              <Feather name="plus" size={35} color="black" />
              <Text className="mt-2 text-center text-neutral-100 text-BodySmallRegular font-Manrope">
                {emptyText}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default BookCollectionSection;
