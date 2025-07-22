import { useLocalSearchParams } from "expo-router";
import booksData from "@/assets/data/books.json";
import { ScrollView, Text, View } from "react-native";
import BookCard from "../BookCard";

const CategoryPage = () => {
  const { category } = useLocalSearchParams();
  const filteredBooks = booksData.filter((book) => book.category === category);

  return (
    <ScrollView className="px-4">
      <Text className="text-xl font-bold my-4">{category}</Text>
      <View className="flex-row flex-wrap justify-between">
        {filteredBooks.map((book) => (
          <BookCard
            key={book.id}
            title={book.title}
            author={book.author}
            cover={book.cover}
            onPress={() => {}}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default CategoryPage;
