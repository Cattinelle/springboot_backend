import booksData from "@/assets/data/books.json";
import ArrowRight from "@/assets/svgs/arrow_right.svg";
import Clock from "@/assets/svgs/clock.svg";
import Insight from "@/assets/svgs/insight.svg";
import KeyPoints from "@/assets/svgs/key_points.svg";
import RemoveSaved from "@/assets/svgs/remove_saved.svg";
import Save from "@/assets/svgs/save_later.svg";
import BookCard from "@/components/BookCard";
import CategoryTag from "@/components/CategoryTag";
import ColoredButton from "@/components/ColoredButton";
import TransparentButton from "@/components/TransparentButton";
import categoryIcons from "@/constants/categoryIcons";
import {
  Entypo,
  Feather,
  FontAwesome5,
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Linking,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
type BookSummaryProps = {
  id?: string | number;
};

export default function BookSummary({ id }: BookSummaryProps) {
  const router = useRouter();
  const params = useLocalSearchParams();
  const book = booksData.find((b) => b.id === Number(id));
  const [showMenu, setShowMenu] = useState(false);
  const [menuType, setMenuType] = useState<"add" | "remove">("add");
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [showNarratorSelect, setShowNarratorSelect] = useState(false);
  const [selectedNarrator, setSelectedNarrator] = useState("Josh");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("1:25");
  const [totalTime, setTotalTime] = useState("3:05");
  const [currentAudioKeyPoint, setCurrentAudioKeyPoint] = useState(
    book?.keyPoints[0]
  );
  const translateY = useRef(new Animated.Value(0));
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const height = Dimensions.get("window").height;
  if (!book) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-gray-600">Book not found.</Text>
      </SafeAreaView>
    );
  }

  const handleMenuPress = (type: "add" | "remove") => {
    setMenuType(type);
    setShowMenu(true);
  };

  const handleKeyPointPress = (keyPointId: number) => {
    // Navigate to key point detail page
    if (id) {
      router.push({
        pathname: "/summary/[id]/keypoint/[keypointId]",
        params: { id: String(id), keypointId: keyPointId },
      });
    }
  };

  const handleAudioNavigation = (direction: "next" | "prev") => {
    const currentKeyPointIndex = book.keyPoints.findIndex(
      (kp) => kp.id === currentAudioKeyPoint?.id
    );

    if (
      direction === "next" &&
      currentKeyPointIndex < book.keyPoints.length - 1
    ) {
      const nextKeyPoint = book.keyPoints[currentKeyPointIndex + 1];
      setCurrentAudioKeyPoint(nextKeyPoint);
    } else if (direction === "prev" && currentKeyPointIndex > 0) {
      const prevKeyPoint = book.keyPoints[currentKeyPointIndex - 1];
      setCurrentAudioKeyPoint(prevKeyPoint);
    }
  };

  // Get current key point index for audio modal
  const getCurrentKeyPointIndex = () => {
    return book.keyPoints.findIndex((kp) => kp.id === currentAudioKeyPoint?.id);
  };

  const currentKeyPointIndex = getCurrentKeyPointIndex();
  const isFirstKeyPoint = currentKeyPointIndex === 0;
  const isLastKeyPoint = currentKeyPointIndex === book.keyPoints.length - 1;

  // Custom fade animation
  React.useEffect(() => {
    if (showNarratorSelect) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200, // Fast fade in
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150, // Even faster fade out
        useNativeDriver: true,
      }).start();
    }
  }, [showNarratorSelect, fadeAnim]);

  const NavigationBar = () => (
    <View className="flex-row justify-between border-b border-neutral-20 items-center px-3 py-7 bg-neutral-10">
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <View className="flex-row items-center gap-5">
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="share" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleMenuPress("add")}>
          <Ionicons name="ellipsis-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const BookInfoSection = () => (
    <View className="px-4 py-6">
      <View className="flex-column items-center justify-center gap-1.5">
        <View className="relative">
          <Image
            source={{ uri: book.cover }}
            className="w-[155px] h-[235px] rounded-lg shadow-white-shadow border border-neutral-20"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/[0.03] rounded-lg z-10"></View>
        </View>

        <Text className="text-primary font-semibold font-Manrope mt-2.5">
          SUMMARY
        </Text>
        <Text className="text-Heading4 text-center max-w-[80%] font-Manrope font-bold text-neutral-100">
          {book.title}
        </Text>
        <Text className="text-BodyRegular font-Manrope font-medium text-neutral-80">
          {book.author}
        </Text>
        <View className="flex-row justify-center items-center gap-3 mt-4">
          <View className="flex-row justify-center items-center gap-1.5">
            <KeyPoints width={20} height={20} />
            <Text className="text-neutral-80 text-BodySmallRegular font-Manrope font-medium">
              {book.keyPoints.length} key points
            </Text>
          </View>
          <View className="flex-row justify-center items-center gap-1.5">
            <Clock width={20} height={20} />
            <Text className="text-neutral-80 text-BodySmallRegular font-Manrope font-medium">
              12 min
            </Text>
          </View>
          <View className="flex-row justify-center items-center gap-1.5">
            <Insight width={20} height={20} />
            <Text className="text-neutral-80 text-BodySmallRegular font-Manrope font-medium">
              10 insights
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const OverviewSection = () => (
    <View className="px-4 py-4">
      <Text className="font-Manrope font-bold text-Heading6 text-neutral-100 mb-3">
        Overview
      </Text>
      <Text className="text-neutral-80 text-BodySmallRegular font-medium font-Manrope leading-6">
        {book.overview}
      </Text>
    </View>
  );

  const KeyPointsSection = () => (
    <View className="w-full px-4 py-4">
      <Text className="font-Manrope font-bold text-Heading6 text-neutral-100 mb-3">
        Key points
      </Text>
      {book.keyPoints.map((keyPoint, index) => (
        <TouchableOpacity
          key={keyPoint.id}
          onPress={() => handleKeyPointPress(keyPoint.id)}
          activeOpacity={0.6}
          className="flex-row items-center justify-between py-5 border-b border-neutral-30"
        >
          <View className="flex-1 flex-row items-center gap-5">
            <Text className="text-primary text-Heading4 font-semibold font-Manrope">
              {index + 1}
            </Text>
            <Text className="text-neutral-90 w-[80%] font-semibold text-[14.5px] font-Manrope">
              {keyPoint.title}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      ))}
    </View>
  );

  const AboutAuthorSection = () => (
    <View className="px-4 py-4">
      <Text className="font-Manrope font-bold text-Heading6 text-neutral-100 mb-3">
        About {book.author}
      </Text>
      <Text className="text-neutral-80 text-BodySmallRegular font-medium font-Manrope leading-6">
        {book.aboutAuthor}
      </Text>
    </View>
  );

  const MoreFromAuthorSection = () => {
    // Find other books by the same author (excluding the current book)
    const otherBooks = booksData.filter(
      (b) => b.author === book.author && b.id !== book.id
    );

    const handleGetFullBook = () => {
      const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(book.title)}&i=stripbooks`;
      Linking.openURL(amazonUrl);
    };

    return (
      <View className="px-4 py-4 w-full">
        <Text className="font-Manrope font-bold text-Heading6 text-neutral-100">
          More from this author
        </Text>
        {otherBooks.length === 0 ? (
          <Text className="text-neutral-80 text-BodySmallRegular w-[95%] font-medium font-Manrope my-3">
            More books from this author will be available soon.{" "}
            <Text className="text-primary font-semibold">Stay tuned!</Text>
          </Text>
        ) : (
          <View className="flex-row gap-3 my-4">
            {otherBooks.map((b) => (
              <TouchableOpacity
                key={b.id}
                onPress={() =>
                  router.push({
                    pathname: "/summary/[id]",
                    params: { id: String(b.id) },
                  })
                }
              >
                <BookCard
                  id={b.id}
                  title={b.title}
                  author={b.author}
                  cover={b.cover}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <ColoredButton
          text="Get the full book"
          textClassName="text-BodyBold font-bold"
          btnClassName="w-full  h-[40px] mt-4"
          icon={<ArrowRight width={20} height={20} />}
          onPress={handleGetFullBook}
        />
      </View>
    );
  };

  const BottomActionButtons = () => (
    <View className="absolute w-full h-[100px] flex-row justify-center items-start gap-3 bottom-0 rounded-t-[25px] pt-5 px-7 bg-neutral-10 shadow-white-shadow ">
      <TransparentButton
        text="Read"
        textClassName="text-BodyBold font-bold"
        nativewindStyle="w-[115px] h-[45px]"
        icon={<SimpleLineIcons name="book-open" size={18} color="#E95B0C" />}
        onPress={() => {
          if (book.keyPoints && book.keyPoints.length > 0) {
            router.push({
              pathname: "/summary/[id]/keypoint/[keypointId]",
              params: {
                id: String(book.id),
                keypointId: String(book.keyPoints[0].id),
              },
            });
          }
        }}
      />
      <ColoredButton
        text="Listen"
        textClassName="text-white font-semibold text-lg"
        btnClassName="flex-1 h-[45px]"
        icon={<Ionicons name="headset-outline" size={20} color="white" />}
        onPress={() => setShowAudioPlayer(true)}
      />
    </View>
  );

  const MenuModal = () => (
    <Modal
      visible={showMenu}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowMenu(false)}
    >
      <Pressable
        className="flex-1 bg-black/10"
        onPress={() => setShowMenu(false)}
      >
        <View className="flex-1 justify-center items-center">
          <View className={`bg-neutral-20 border-l border-b border-neutral-30 p-4 min-w-[200px] absolute right-0 ${Platform.OS === "ios" ? " top-[120px]" : "top-[75px]"}`}>
            {menuType === "add" ? (
              <>
                <TouchableOpacity hitSlop={10} activeOpacity={0.7} className="py-2 flex-row justify-start items-center gap-1.5">
                  <Ionicons name="add-circle-outline" size={24} color="black" />
                  <Text className="text-neutral-80 text-BodySmallRegular font-Manrope">
                    Add to suggestions
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity hitSlop={10} activeOpacity={0.7} className="py-2 flex-row justify-start items-center gap-1.5">
                  <Ionicons name="add-circle-outline" size={24} color="black" />
                  <Text className="text-neutral-80 text-BodySmallRegular font-Manrope">
                    Add to favorites
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity hitSlop={10} activeOpacity={0.7} className="py-2 flex-row justify-start items-center gap-1.5">
                  <Save width={24} height={24} />
                  <Text className="text-neutral-80 text-BodySmallRegular font-Manrope">
                    Save for later
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity className="py-2 flex-row items-center gap-1.5">
                  <Ionicons
                    name="remove-circle-outline"
                    size={24}
                    color="black"
                  />
                  <Text className="text-gray-700">Remove from suggestions</Text>
                </TouchableOpacity>
                <TouchableOpacity className="py-2 flex-row items-center gap-1.5">
                  <Ionicons
                    name="remove-circle-outline"
                    size={24}
                    color="black"
                  />
                  <Text className="text-gray-700">Remove from favorites</Text>
                </TouchableOpacity>
                <TouchableOpacity className="py-2 flex-row items-center gap-1.5">
                  <RemoveSaved width={24} height={24} />
                  <Text className="text-gray-700">Save for later</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Pressable>
    </Modal>
  );

  // Drag to close
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dy) > Math.abs(gesture.dx) && gesture.dy > 0,
      onPanResponderGrant: () => {},
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          translateY.current.setValue(
            (Platform.OS === "android" ? 24 : 44) + gesture.dy
          );
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 50) {
          setShowAudioPlayer(false);
          translateY.current.setValue(0); // Reset for next open
        } else {
          translateY.current.setValue(Platform.OS === "android" ? 24 : 44);
        }
      },
      onPanResponderTerminate: () => {},
    })
  ).current;

  const AudioPlayerModal = () => (
    <Modal
      visible={showAudioPlayer}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={() => setShowAudioPlayer(false)}
    >
      <Animated.View
        className="border border-neutral-20"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: height * 0.9,
          transform: [{ translateY: translateY.current }],
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          overflow: "hidden",
        }}
        {...panResponder.panHandlers}
      >
        <ImageBackground
          source={require("@/assets/images/vectorbg.png")}
          resizeMode="cover"
          className="flex-1 bg-neutral-10 border border-neutral-20"
          imageStyle={{ opacity: 0.02 }}
        >
          <View className="flex-1 justify-center">
            <View className="flex-1 h-[50%] justify-center  px-4 py-6">
              {/* Book cover and title */}
              <View className="items-center mb-8">
                <View className="relative">
                  <Image
                    source={{ uri: book.cover }}
                    className="w-[170px] h-[235px] rounded-lg mb-4 border border-neutral-20"
                  />
                  <View className="absolute inset-0 bg-black/[0.03] rounded-lg z-10"></View>
                </View>
                <View className="flex-column items-center justify-center gap-3 mt-5">
                  <Text className="text-primary font-bold text-BodySmallRegular font-Manrope">
                    KEY POINT {currentKeyPointIndex + 1} OF{" "}
                    {book.keyPoints.length}
                  </Text>
                  <Text className="text-BodyRegular text-center max-w-[80%] font-Manrope font-semibold text-neutral-100">
                    {currentAudioKeyPoint?.title}
                  </Text>
                </View>
              </View>
              {/* Audio player */}
              <View className="mb-8">
                <View className="flex-row items-center justify-center gap-2 mb-2">
                  <Text className="text-BodySmallRegular font-Manrope font-medium text-neutral-80">
                    {currentTime}
                  </Text>
                  <View className="bg-neutral-20 h-1 w-[75%] rounded-full">
                    <View className="bg-primary h-1 rounded-full w-1/3"></View>
                  </View>
                  <Text className="text-BodySmallRegular font-Manrope font-medium text-neutral-80">
                    {totalTime}
                  </Text>
                </View>
              </View>
              {/* Audio player controls */}
              <View className="flex-row items-center justify-center gap-14 mb-20">
                <TouchableOpacity
                  onPress={() => handleAudioNavigation("prev")}
                  disabled={isFirstKeyPoint}
                  activeOpacity={isFirstKeyPoint ? 1 : 0.6}
                >
                  <Ionicons
                    name="play-skip-back"
                    size={35}
                    color={isFirstKeyPoint ? "#D1D5DB" : "black"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => setIsPlaying(!isPlaying)}
                >
                  <FontAwesome5
                    name={isPlaying ? "pause" : "play"}
                    size={45}
                    color="black"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleAudioNavigation("next")}
                  disabled={isLastKeyPoint}
                  activeOpacity={isLastKeyPoint ? 1 : 0.6}
                >
                  <Ionicons
                    name="play-skip-forward"
                    size={35}
                    color={isLastKeyPoint ? "#D1D5DB" : "black"}
                  />
                </TouchableOpacity>
              </View>
              {/* Narrator select */}
              <TouchableOpacity
                activeOpacity={0.6}
                className="bg-neutral-20 mb-10 w-[32%] mx-auto py-4 rounded-full flex-row items-center justify-center"
                onPress={() => {
                  setShowNarratorSelect(true);
                }}
              >
                <View className="flex-row items-center justify-center px-10">
                  <View className="flex-row items-center justify-center gap-2">
                    <Text className="text-primary text-BodyRegular font-Manrope font-medium">
                      {selectedNarrator}
                    </Text>
                    <Entypo
                      name="dots-three-horizontal"
                      size={15}
                      color="#E95B0C"
                    />
                  </View>
                  <Ionicons
                    name="chevron-down"
                    size={20}
                    color="#E95B0C"
                    className="ml-2"
                  />
                </View>
              </TouchableOpacity>
              {/* Narrator list */}
              {showNarratorSelect && <NarratorSelectModal />}
            </View>
          </View>
        </ImageBackground>
      </Animated.View>
    </Modal>
  );

  const NarratorSelectModal = () => (
    <>
      {/* Pressable full-screen dark blur background */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9998,
          opacity: fadeAnim,
        }}
      >
        <Pressable
          onPress={() => setShowNarratorSelect(false)}
          className="flex-1"
        >
          <BlurView tint="light" intensity={3} className="flex-1" />
        </Pressable>
      </Animated.View>
      <Animated.View
        className="border border-neutral-20"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: height * 0.43,
          transform: [{ translateY: translateY.current }],
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          overflow: "hidden",
          zIndex: 9999,
        }}
        {...panResponder.panHandlers}
      >
        <View className="flex-1 bg-white">
          <View className="w-[22%] h-1 mt-1.5 rounded-full bg-gray-200 mx-auto"></View>
          <View className="flex-1 px-4 py-6">
            <Text className="text-Heading6 font-Manrope font-bold text-neutral-100 mb-0.5">
              Choose a narrator
            </Text>
            <Text className="text-BodySmallRegular font-Manrope font-medium text-neutral-80 mb-4">
              You can change it anytime
            </Text>

            <TouchableOpacity
              className={`flex-row items-center justify-between p-4 rounded-lg mb-3 ${
                selectedNarrator === "Josh"
                  ? "bg-[#FBF1E8] border border-primary"
                  : "bg-gray-50"
              }`}
              onPress={() => {
                setSelectedNarrator("Josh");
              }}
            >
              <View>
                <Text className="text-BodyRegular font-Manrope font-semibold text-neutral-100">
                  Josh
                </Text>
                <Text className="text-BodySmallRegular font-Manrope font-medium text-neutral-80">
                  Male / Featured
                </Text>
              </View>
              {selectedNarrator === "Josh" && (
                <Ionicons name="checkmark-circle" size={22} color="#E95B0C" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-row items-center justify-between p-4 rounded-lg ${
                selectedNarrator === "Amina"
                  ? "bg-[#FBF1E8] border border-primary"
                  : "bg-gray-50"
              }`}
              onPress={() => {
                setSelectedNarrator("Amina");
              }}
            >
              <View>
                <Text className="text-BodyRegular font-Manrope font-semibold text-neutral-100">
                  Amina
                </Text>
                <Text className="text-BodySmallRegular font-Manrope font-medium text-neutral-80">
                  Female
                </Text>
              </View>
              {selectedNarrator === "Amina" && (
                <Ionicons name="checkmark-circle" size={22} color="#E95B0C" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </>
  );

  const ExploreCategoriesSection = () => (
    <View className="w-full px-4 pt-3 mb-28">
      <Text className="font-Manrope font-bold text-Heading6 text-neutral-100 mb-3">
        Explore Category
      </Text>
      <View className="mt-1 items-start">
        <CategoryTag
          label={book.category}
          Icon={categoryIcons[book.category]}
          onPress={() =>
            router.push(`/category/${encodeURIComponent(book.category)}`)
          }
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 relative bg-neutral-10">
      <NavigationBar />
      <ImageBackground
        source={require("@/assets/images/vectorbg.png")}
        resizeMode="cover"
        className="flex-1 bg-neutral-10"
        imageStyle={{ opacity: 0.02 }}
      >
        <ScrollView
          className="flex-1 bg-neutral-10 border border-neutral-30 shadow-black-shadow mx-[10px] mt-[10px] rounded-[10px]"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ alignItems: "center" }}
        >
          <BookInfoSection />
          <OverviewSection />
          <KeyPointsSection />
          <AboutAuthorSection />
          <MoreFromAuthorSection />
          <ExploreCategoriesSection />
        </ScrollView>
      </ImageBackground>
      <BottomActionButtons />

      <MenuModal />
      <AudioPlayerModal />
    </SafeAreaView>
  );
}
