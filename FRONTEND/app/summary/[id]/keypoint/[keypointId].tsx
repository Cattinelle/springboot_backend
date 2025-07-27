import booksData from "@/assets/data/books.json";
import InsightIcon from "@/assets/svgs/insight.svg";
import AudioModal from "@/components/AudioModal";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  BackHandler,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function KeyPointDetailPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const bookId = Number(params.id);
  const keyPointId = Number(params.keypointId);

  const book = booksData.find((b) => b.id === bookId);
  const keyPoint = book?.keyPoints.find((kp) => kp.id === keyPointId);
  const currentIndex =
    book?.keyPoints.findIndex((kp) => kp.id === keyPointId) ?? 0;

  const insightIndex = params.insightIndex ? Number(params.insightIndex) : 0;

  // Audio state
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [currentAudioKeyPointId, setCurrentAudioKeyPointId] =
    useState(keyPointId);

  useEffect(() => {
    const onBackPress = () => true; // Prevent default back action
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );
    return () => subscription.remove();
  }, []);

  if (!book || !keyPoint) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-gray-600">Key point not found.</Text>
      </SafeAreaView>
    );
  }

  const goToNextKeyPoint = () => {
    if (currentIndex < book.keyPoints.length - 1) {
      const nextKeyPoint = book.keyPoints[currentIndex + 1];
      router.replace({
        pathname: "/summary/[id]/keypoint/[keypointId]",
        params: { id: String(bookId), keypointId: String(nextKeyPoint.id) },
      });
    }
  };

  const goToPreviousKeyPoint = () => {
    if (currentIndex > 0) {
      const prevKeyPoint = book.keyPoints[currentIndex - 1];
      router.replace({
        pathname: "/summary/[id]/keypoint/[keypointId]",
        params: { id: String(bookId), keypointId: String(prevKeyPoint.id) },
      });
    }
  };

  const handleAudioPlay = () => {
    setCurrentAudioKeyPointId(keyPointId);
    setShowAudioPlayer(true);
  };

  const NavigationBar = () => (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
      <TouchableOpacity
        onPress={() =>
          router.replace({
            pathname: "/summary/[id]",
            params: { id: String(bookId) },
          })
        }
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleAudioPlay}
        activeOpacity={0.5}
        hitSlop={10}
      >
        <SimpleLineIcons name="control-play" size={22} color="black" />
      </TouchableOpacity>
    </View>
  );

  const InsightBox = () => (
    <View className="bg-[#FBF1E8] p-4 rounded-lg mb-6 flex-row items-start gap-2">
      <InsightIcon width={20} height={20} />
      <Text className="text-orange-800 flex-1 leading-5">
        {keyPoint.insights && keyPoint.insights.length > 0
          ? keyPoint.insights[0]
          : "No key insight available for this point."}
      </Text>
    </View>
  );

  const ShareButton = () => (
    <TouchableOpacity
      activeOpacity={0.6}
      className="bg-gray-100 py-3 px-4 rounded-lg flex-row gap-1 items-center justify-center mb-6"
    >
      <Ionicons name="share-outline" size={20} color="#616161" />
      <Text className="text-neutral-80 text-BodySmallRegular font-medium font-Manrope">
        Share
      </Text>
    </TouchableOpacity>
  );

  const Pagination = () => (
    <View className="flex-row items-center justify-center pt-4 gap-3">
      <TouchableOpacity
        onPress={goToPreviousKeyPoint}
        disabled={currentIndex === 0}
        activeOpacity={0.5}
        className={`p-2 ${currentIndex === 0 ? "opacity-50" : ""} bg-neutral-20 rounded-lg`}
      >
        <Ionicons name="chevron-back" size={24} color="#616161" />
      </TouchableOpacity>

      <Text className="mx-4 text-neutral-80 text-BodyRegular font-medium font-Manrope">
        {currentIndex + 1} of {book.keyPoints.length}
      </Text>

      <TouchableOpacity
        onPress={goToNextKeyPoint}
        disabled={currentIndex === book.keyPoints.length - 1}
        className={`p-2 ${currentIndex === book.keyPoints.length - 1 ? "opacity-50" : ""} bg-neutral-20 rounded-lg`}
      >
        <Ionicons name="chevron-forward" size={24} color="#616161" />
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground
      source={require("@/assets/images/vectorbg.png")}
      resizeMode="cover"
      className="flex-1 bg-neutral-10"
      imageStyle={{ opacity: 0.8 }}
    >
      <SafeAreaView className="flex-1 bg-white">
        <NavigationBar />
        <ScrollView
          className="flex-1 bg-neutral-10 border  px-4 py-5 border-neutral-30 shadow-black-shadow mx-[10px] mt-[10px] rounded-[10px]"
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-Heading6  font-Manrope font-bold text-neutral-100 mb-3">
            <Text>{keyPoint.id}.</Text> {keyPoint.title}
          </Text>

          <View className="mb-6">
            <Text className="text-neutral-80 text-BodySmallRegular font-medium font-Manrope leading-6">
              {keyPoint.summary}
            </Text>
          </View>

          <InsightBox />
          <ShareButton />
          {keyPoint.insights && keyPoint.insights.length > 1 && (
            <View className="mb-10">
              <Text className="text-BodyRegular font-Manrope font-bold text-neutral-100 mb-3">
                Other Key Insights:
              </Text>
              {keyPoint.insights.slice(1).map((insight, index) => (
                <View key={index} className="bg-gray-50 p-3 rounded-lg mb-2">
                  <Text className="text-neutral-80 text-BodySmallRegular font-medium font-Manrope italic">
                    "{insight}"
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        <Pagination />

        <AudioModal
          visible={showAudioPlayer}
          onClose={() => setShowAudioPlayer(false)}
          bookCover={book.cover}
          bookTitle={book.title}
          keyPoints={book.keyPoints}
          currentKeyPointId={currentAudioKeyPointId}
          onKeyPointChange={setCurrentAudioKeyPointId}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}
