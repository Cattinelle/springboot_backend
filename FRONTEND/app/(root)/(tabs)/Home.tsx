import BulbIcon from "@/assets/svgs/bulb_icon.svg";
import StreakIcon from "@/assets/svgs/streak_icon.svg";
import BookCard from "@/components/BookCard";
import CategoryTag from "@/components/CategoryTag";
import MicrolearningCard from "@/components/MicrolearningCard";
import StoryModal from "@/components/StoryModal";
import StreakModal from "@/components/StreakModal";
import categoryIcons from "@/constants/categoryIcons";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { create } from "zustand";
import { useToastStore } from "@/hooks/useToastStore";
import Welcome from "@/assets/svgs/welcome.svg";
import booksData from "@/assets/data/books.json";
import { useBookStore } from "@/hooks/useBookStore";

type Book = {
  id: string;
  title: string;
  author: string;
  cover?: string;
  overview?: string;
  aboutAuthor?: string;
  keyPoints?: {
    id: string;
    title: string;
    summary: string;
    insights: string[];
  }[];
  category: string;
  status?: string;
};

const MICROLEARNING_KEY = "microlearningBooks";
const MICROLEARNING_DATE_KEY = "microlearningBooksDate";
const MICROLEARNING_COMPLETION_KEY = "microlearningCompletion";
const QUICK_READ_KEY = "quickReadBook";
const QUICK_READ_DATE_KEY = "quickReadDate";
const QUOTE_OF_DAY_KEY = "quoteOfDay";
const QUOTE_OF_DAY_DATE_KEY = "quoteOfDayDate";
const QUOTE_SOURCE_KEY = "quoteSource";
// const DAILY_DATE_KEY = "dailyDate";

// const getTodayString = () => {
//   const today = new Date();
//   return today.toISOString().split("T")[0]; // e.g. "2024-05-30"
// };

// const getRandomBooks = (books: Book[], count: number) => {
//   const shuffled = [...books].sort(() => 0.5 - Math.random());
//   return shuffled.slice(0, count);
// };

interface OnboardingState {
  hasSeenWelcomeToast: boolean;
  hasSeenProfileToast: boolean;
  setHasSeenWelcomeToast: (seen: boolean) => void;
  setHasSeenProfileToast: (seen: boolean) => void;
  loadOnboardingFlags: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  hasSeenWelcomeToast: false,
  hasSeenProfileToast: false,
  setHasSeenWelcomeToast: (seen) => {
    set({ hasSeenWelcomeToast: seen });
    AsyncStorage.setItem("hasSeenWelcomeToast", seen ? "1" : "0");
  },
  setHasSeenProfileToast: (seen) => {
    set({ hasSeenProfileToast: seen });
    AsyncStorage.setItem("hasSeenProfileToast", seen ? "1" : "0");
  },
  loadOnboardingFlags: async () => {
    const welcome = await AsyncStorage.getItem("hasSeenWelcomeToast");
    const profile = await AsyncStorage.getItem("hasSeenProfileToast");
    set({
      hasSeenWelcomeToast: welcome === "1",
      hasSeenProfileToast: profile === "1",
    });
  },
}));

const Home = () => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [initialInsightIndex, setInitialInsightIndex] = useState(0);
  const [showStoryModal, setShowStoryModal] = useState(false);


  // For the microlearnig stories modal
  const handleOpenStory = (index: number) => {
    setCurrentStoryIndex(index);
    setShowStoryModal(true);
  };

  // For the streak modal
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [streakCount, setStreakCount] = useState(3);
  /*
useEffect(() => {
  const fetchStreak = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/streak");
      const data = await res.json();
      setStreakCount(data.streak);
    } catch (error) {
      console.error("Failed to fetch streak count", error);
    }
  };

  fetchStreak();
}, []);
*/

  //const { books, loading, error, fetchBooks } = useBookStore();
  const books = booksData.map((b) => ({
    ...b,
    id: String(b.id),
    keyPoints: b.keyPoints?.map((kp) => ({ ...kp, id: String(kp.id) })) ?? [],
  }));
  const [microlearningBooks, setMicrolearningBooks] = useState<Book[]>([]);
  const [storyData, setStoryData] = useState<{ completed: boolean }[]>([]);
  const [quickReadBook, setQuickReadBook] = useState<Book | null>(null);
  const [quoteOfDay, setQuoteOfDay] = useState<{
    quote: string;
    author: string;
  } | null>(null);
  const [quoteSource, setQuoteSource] = useState<{
    bookId: string;
    keyPointIndex: number;
    insightIndex: number;
  } | null>(null);

  useEffect(() => {
    // fetchBooks(); // No longer needed
  }, []);

  useEffect(() => {
    const setupQuickRead = async () => {
      const today = new Date().toISOString().split("T")[0];
      const storedDate = await AsyncStorage.getItem(QUICK_READ_DATE_KEY);
      const storedBookId = await AsyncStorage.getItem(QUICK_READ_KEY);

      if (storedDate === today && storedBookId) {
        const book = books.find((b) => String(b.id) === storedBookId);
        setQuickReadBook(book || null);
      } else if (books.length > 0) {
        // Pick a new random book
        const randomBook = books[Math.floor(Math.random() * books.length)];
        setQuickReadBook(randomBook);
        await AsyncStorage.setItem(QUICK_READ_KEY, String(randomBook.id));
        await AsyncStorage.setItem(QUICK_READ_DATE_KEY, today);
      }
    };
    if (books.length > 0) {
      setupQuickRead();
    }
  }, [books]);

  useEffect(() => {
    const setupQuoteOfDay = async () => {
      const today = new Date().toISOString().split("T")[0];
      const storedDate = await AsyncStorage.getItem(QUOTE_OF_DAY_DATE_KEY);
      const storedQuote = await AsyncStorage.getItem(QUOTE_OF_DAY_KEY);
      const storedSource = await AsyncStorage.getItem(QUOTE_SOURCE_KEY);

      if (storedDate === today && storedQuote && storedSource) {
        setQuoteOfDay(JSON.parse(storedQuote));
        setQuoteSource(JSON.parse(storedSource));
      } else if (books.length > 0) {
        // Gather all insights with their book and key point indices
        const allFirstInsights: {
          quote: string;
          author: string;
          bookId: string;
          keyPointId: string;
        }[] = [];

        books.forEach((book) => {
          book.keyPoints?.forEach((kp) => {
            if (kp.insights && kp.insights.length > 0) {
              allFirstInsights.push({
                quote: kp.insights[0], // Only the first insight
                author: book.author,
                bookId: book.id,
                keyPointId: kp.id,
              });
            }
          });
        });

        if (allFirstInsights.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * allFirstInsights.length
          );
          const selected = allFirstInsights[randomIndex];
          setQuoteOfDay({ quote: selected.quote, author: selected.author });
          setQuoteSource({
            bookId: selected.bookId,
            keyPointIndex: 0, // Assuming keyPointIndex is 0 for the first insight
            insightIndex: 0, // Assuming insightIndex is 0 for the first insight
          });
          await AsyncStorage.setItem(
            QUOTE_OF_DAY_KEY,
            JSON.stringify({ quote: selected.quote, author: selected.author })
          );
          await AsyncStorage.setItem(
            QUOTE_SOURCE_KEY,
            JSON.stringify({
              bookId: selected.bookId,
              keyPointIndex: 0,
              insightIndex: 0,
            })
          );
          await AsyncStorage.setItem(QUOTE_OF_DAY_DATE_KEY, today);
        }
      }
    };

    if (books.length > 0) {
      setupQuoteOfDay();
    }
  }, [books]);

  useEffect(() => {
    const setupMicrolearning = async () => {
      const today = new Date().toISOString().split("T")[0];
      const storedDate = await AsyncStorage.getItem(MICROLEARNING_DATE_KEY);
      const storedBooks = await AsyncStorage.getItem(MICROLEARNING_KEY);
      if (storedDate === today && storedBooks) {
        const parsed = JSON.parse(storedBooks);
        setMicrolearningBooks(parsed);
        setStoryData(parsed.map(() => ({ completed: false })));
      } else if (books.length > 0) {
        // Pick 10 random books with at least one keyPoint with insights
        const eligibleBooks = books.filter(
          (b) =>
            Array.isArray(b.keyPoints) &&
            b.keyPoints.some(
              (kp: any) => Array.isArray(kp.insights) && kp.insights.length > 0
            )
        );
        const shuffled = [...eligibleBooks].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 10);
        setMicrolearningBooks(selected);
        setStoryData(selected.map(() => ({ completed: false })));
        await AsyncStorage.setItem(MICROLEARNING_KEY, JSON.stringify(selected));
        await AsyncStorage.setItem(MICROLEARNING_DATE_KEY, today);
      }
    };
    if (books.length > 0) {
      setupMicrolearning();
    }
  }, [books]);

  const productivityBooks = books.filter((book) =>
    book.category.includes("Productivity")
  );

  const financeBooks = books.filter((book) =>
    book.category.includes("Finance")
  );

  const router = useRouter();
  const { welcome } = useLocalSearchParams(); // 'signup' or 'signin'

  const categories = Object.entries(categoryIcons).map(([name, Icon]) => ({
    name,
    icon: Icon,
  }));

  const { hasSeenWelcomeToast, setHasSeenWelcomeToast, loadOnboardingFlags } =
    useOnboardingStore();

  useEffect(() => {
    loadOnboardingFlags(); // Load flags on mount
  }, []);

  useEffect(() => {
    if (!hasSeenWelcomeToast && welcome) {
      if (welcome === "signup") {
        useToastStore.getState().showToast({
          type: "success",
          title: "Welcome to QuickTales!",
          message: "Let's turn pages into progress.",
          duration: 3000,
          backgroundColor: "#FBF1E8",
          borderColor: "#E95B0C",
          textColor: "#222",
          icon: <Welcome width={40} height={40} />,
          onDismiss: () => setHasSeenWelcomeToast(true),
        });
      } else if (welcome === "signin") {
        useToastStore.getState().showToast({
          type: "success",
          title: "Welcome Back!",
          message: "Ready to continue your reading journey?",
          duration: 3000,
          backgroundColor: "#FBF1E8",
          borderColor: "#E95B0C",
          textColor: "#222",
          icon: <Welcome width={40} height={40} />,
          onDismiss: () => setHasSeenWelcomeToast(true),
        });
      }
    }
  }, [hasSeenWelcomeToast, setHasSeenWelcomeToast, welcome]);

  // if (loading) // No longer needed
  //   return (
  //     <View className="flex-1 items-center justify-center bg-neutral-10">
  //       <Text>Loading books...</Text>
  //     </View>
  //   );
  // if (error) // No longer needed
  //   return (
  //     <View className="flex-1 justify-center items-center mt-10">
  //       <MaterialIcons name="error-outline" size={60} color="#C8150C" />
  //       <Text className="text-center font-Manrope font-medium mt-5 text-BodyBold text-secondary">
  //         {error}
  //       </Text>
  //     </View>
  //   );

  return (
    <View className="flex-1 bg-neutral-10">
      <SafeAreaView
        edges={["top"]}
        className="bg-neutral-10 border-b border-neutral-20"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-3 py-2">
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

          <TouchableOpacity onPress={() => setShowStreakModal(true)}>
            <View className="flex-row gap-1 items-center pr-3">
              <StreakIcon width={16} height={20} />
              <Text className="text-neutral-90 text-Heading6 font-Manrope font-bold">
                {streakCount}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <ImageBackground
        source={require("../../../assets/images/vectorbg.png")}
        resizeMode="cover"
        className="flex-1 bg-neutral-10"
        imageStyle={{ opacity: 0.02 }}
      >
        <ScrollView
          className="flex-1 pt-5"
          showsVerticalScrollIndicator={false}
        >
          {/* Quote of the Day */}
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-[#FBF1E8] mx-4 p-4 rounded-xl mb-5"
            onPress={() => {
              if (quoteSource) {
                const book = books.find((b) => b.id === quoteSource.bookId);
                const keyPointId =
                  book?.keyPoints?.[quoteSource.keyPointIndex]?.id;
                if (keyPointId) {
                  router.push({
                    pathname: "/summary/[id]/keypoint/[keypointId]",
                    params: {
                      id: String(quoteSource.bookId),
                      keypointId: String(keyPointId),
                      // insightIndex: String(quoteSource.insightIndex), // optional, not needed for your use case
                    },
                  });
                }
              }
            }}
          >
            <View className="flex-row items-center justify-between w-full">
              <View className="flex-1 pr-4">
                <View className="flex-row items-center gap-1.5 mb-1">
                  <BulbIcon width={15} height={22} />
                  <Text className="text-neutral-90 font-Manrope tracking-wider text-[13px] font-bold mb-1">
                    QUOTE OF THE DAY
                  </Text>
                </View>

                <Text className="text-BodySmallRegular items-center font-medium text-neutral-80 font-Manrope ">
                  {quoteOfDay ? `"${quoteOfDay.quote}"` : "Loading quote..."}
                </Text>
                <Text className="font-Manrope font-medium text-secondary text-BodySmallRegular mt-2">
                  ~ {quoteOfDay?.author || "Loading..."}
                </Text>
              </View>
              <AntDesign name="right" size={18} color="#404040" />
            </View>
          </TouchableOpacity>

          {/* Quick Read */}
          <TouchableOpacity
            activeOpacity={0.8}
            className="rounded-xl mb-7 mx-4 overflow-hidden"
            onPress={() => {
              if (quickReadBook) {
                router.push({
                  pathname: "/summary/[id]",
                  params: { id: String(quickReadBook.id) },
                });
              }
            }}
          >
            <LinearGradient
              colors={["#F6780C", "#D42B22"]}
              start={{ x: 0.8, y: 1 }}
              end={{ x: 0, y: 0 }}
              className="rounded-xl"
            >
              <View className="flex-row py-4  justify-between px-8 items-center gap-4">
                <View className="w-1/2 flex-column gap-3">
                  <Text className="text-neutral-10 font-semibold text-Heading3 leading-9 font-Manrope">
                    Today's Quick Read
                  </Text>
                  <View className="flex-row items-center gap-1 mt-2">
                    <Text className="text-neutral-10 text-[14px] font-medium font-Manrope">
                      Read now
                    </Text>
                    <AntDesign
                      name="arrowright"
                      size={14}
                      color="white"
                      className="mt-1"
                    />
                  </View>
                </View>
                <Image
                  source={{
                    uri:
                      quickReadBook?.cover ||
                      "https://i.pinimg.com/736x/3d/1c/c9/3d1cc980876a3f04a7f41c9e3bb6a023.jpg",
                  }}
                  className="w-[87px] h-[135px] rounded-md rotate-12"
                  resizeMode="cover"
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Recommended for You */}
          <View className=" gap-5 mb-7">
            <View className="ml-4">
              <Text className="text-BodyRegular font-Manrope text-neutral-90 font-bold">
                Recommended for You
              </Text>
              <Text className="text-neutral-80 text-BodySmallRegular font-medium font-Manrope">
                Popular reads, specially selected for you
              </Text>
            </View>

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={books.filter((book) => book.status === "popular")}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (
                <View
                  key={index}
                  className={`${index === 0 ? "ml-4" : ""} mr-3.5`}
                >
                  <BookCard
                    id={Number(item.id)}
                    title={item.title}
                    author={item.author}
                    cover={item.cover ?? ""}
                  />
                </View>
              )}
              contentContainerStyle={{ paddingRight: 30 }}
            />
          </View>

          {/* Categories you're interested in */}
          <View className="gap-5 mb-7">
            <Text className="text-BodyRegular font-Manrope text-neutral-90 font-bold ml-4">
              Categories you're interested in
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.slice(0, 5).map((cat, index) => (
                <View
                  key={index}
                  className={`${index === 0 ? "ml-4" : ""}`}
                >
                  <CategoryTag
                    key={index}
                    label={cat.name}
                    Icon={cat.icon}
                    onPress={() =>
                      router.push(
                        `../../category/${encodeURIComponent(cat.name)}`
                      )
                    }
                  />
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Daily Microlearning */}
          <View className="gap-4 mb-7">
            <View className="ml-4">
              <Text className="text-BodyRegular font-Manrope text-neutral-90 font-bold">
                Daily microlearning session
              </Text>
              <Text className="text-neutral-80 text-BodySmallRegular font-medium font-Manrope">
                Gain 10 insights in under 5 minutes
              </Text>
            </View>
            <View className="my-2">
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={microlearningBooks}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <View
                    key={index}
                    className={`${index === 0 ? "ml-4" : ""} mr-3.5`}
                  >
                    <MicrolearningCard
                      image={item.cover ?? ""}
                      insights={
                        Array.isArray(item.keyPoints)
                          ? item.keyPoints.flatMap((kp: any) =>
                              Array.isArray(kp.insights) ? kp.insights : []
                            )
                          : []
                      }
                      onPress={() => handleOpenStory(index)}
                      completed={storyData[index]?.completed}
                    />
                  </View>
                )}
                contentContainerStyle={{ paddingRight: 16 }}
              />
            </View>
          </View>

          {/* More to create wealth */}
          <View className=" gap-5 mb-7">
            <View className="ml-4">
              <Text className="text-BodyRegular font-Manrope text-neutral-90 font-bold">
                More to create wealth
              </Text>
              <Text className="text-neutral-80 text-BodySmallRegular font-medium font-Manrope">
                You might like these summaries for this goal
              </Text>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={financeBooks}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (
                <View
                  key={index}
                  className={`${index === 0 ? "ml-4" : ""} mr-3.5`}
                >
                  <BookCard
                    id={Number(item.id)}
                    title={item.title}
                    author={item.author}
                    cover={item.cover ?? ""}
                  />
                </View>
              )}
              contentContainerStyle={{ paddingRight: 16 }}
            />
          </View>

          {/* More to increase productivity */}
          <View className=" gap-5 pb-40">
            <View className="ml-4">
              <Text className="text-BodyRegular font-Manrope text-neutral-90 font-bold">
                More to increase productivity
              </Text>
              <Text className="text-neutral-80 text-BodySmallRegular font-medium font-Manrope">
                You might like these summaries for this goal
              </Text>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={productivityBooks}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (
                <View
                  key={index}
                  className={`${index === 0 ? "ml-4" : ""} mr-3.5`}
                >
                  <BookCard
                    id={Number(item.id)}
                    title={item.title}
                    author={item.author}
                    cover={item.cover ?? ""}
                  />
                </View>
              )}
              contentContainerStyle={{ paddingRight: 16 }}
            />
          </View>
        </ScrollView>
      </ImageBackground>

      <StoryModal
        visible={showStoryModal}
        onClose={async (completed) => {
          setShowStoryModal(false);
          if (completed) {
            setStoryData((prev) => {
              // No longer needed
              const updated = prev.map((item, idx) =>
                idx === currentStoryIndex ? { ...item, completed: true } : item
              );
              // Persist completion state
              AsyncStorage.setItem(
                MICROLEARNING_COMPLETION_KEY,
                JSON.stringify(updated.map((item) => item.completed))
              );
              return updated;
            });
          }
        }}
        insights={
          microlearningBooks[currentStoryIndex]?.keyPoints?.flatMap(
            // No longer needed
            (kp) => kp.insights
          ) || []
          // No longer needed
        }
        book={{
          id: Number(microlearningBooks[currentStoryIndex]?.id),
          title: microlearningBooks[currentStoryIndex]?.title,
          author: microlearningBooks[currentStoryIndex]?.author,
          image: microlearningBooks[currentStoryIndex]?.cover ?? "",
        }}
        onBookPress={(bookId) => {
          setShowStoryModal(false);
          router.push({
            pathname: "/summary/[id]",
            params: { id: String(bookId) },
          });
        }}
      />

      <StreakModal
        visible={showStreakModal}
        onClose={() => setShowStreakModal(false)}
        streakCount={streakCount}
      />
    </View>
  );
};

export default Home;
