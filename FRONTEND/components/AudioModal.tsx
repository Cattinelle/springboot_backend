import { Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type KeyPoint = {
  id: number;
  title: string;
  summary: string;
  insights?: string[];
};

type AudioModalProps = {
  visible: boolean;
  onClose: () => void;
  bookCover: string;
  bookTitle: string;
  keyPoints: KeyPoint[];
  currentKeyPointId: number;
  onKeyPointChange: (keyPointId: number) => void;
};

export default function AudioModal({
  visible,
  onClose,
  bookCover,
  bookTitle,
  keyPoints,
  currentKeyPointId,
  onKeyPointChange,
}: AudioModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [totalTime, setTotalTime] = useState("2:30");
  const [selectedNarrator, setSelectedNarrator] = useState("Josh");
  const [showNarratorSelect, setShowNarratorSelect] = useState(false);
  const translateY = useRef(new Animated.Value(0));
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const height = Dimensions.get("window").height;

  const currentKeyPointIndex = keyPoints.findIndex(
    (kp) => kp.id === currentKeyPointId
  );
  const currentKeyPoint = keyPoints[currentKeyPointIndex];
  const isFirstKeyPoint = currentKeyPointIndex === 0;
  const isLastKeyPoint = currentKeyPointIndex === keyPoints.length - 1;

  const handleAudioNavigation = (direction: "next" | "prev") => {
    if (direction === "next" && !isLastKeyPoint) {
      const nextKeyPoint = keyPoints[currentKeyPointIndex + 1];
      onKeyPointChange(nextKeyPoint.id);
    } else if (direction === "prev" && !isFirstKeyPoint) {
      const prevKeyPoint = keyPoints[currentKeyPointIndex - 1];
      onKeyPointChange(prevKeyPoint.id);
    }
  };

  // Custom fade animation for narrator select
  React.useEffect(() => {
    if (showNarratorSelect) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [showNarratorSelect, fadeAnim]);

  // --- Pan Responder for Main Modal (drag to close) ---
  // Only closes the main modal
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
          onClose();
          translateY.current.setValue(0);
        } else {
          translateY.current.setValue(Platform.OS === "android" ? 24 : 44);
        }
      },
      onPanResponderTerminate: () => {},
    })
  ).current;

  // --- Pan Responder for Narrator Select Overlay (drag to close overlay only) ---
  const narratorSelectPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dy) > Math.abs(gesture.dx) && gesture.dy > 0,
      onPanResponderGrant: () => {},
      onPanResponderMove: (_, gesture) => {
        // Optionally, you can animate the overlay down here
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 40) {
          setShowNarratorSelect(false);
        }
      },
      onPanResponderTerminate: () => {},
    })
  ).current;

  // --- Narrator Select Modal (overlay) ---
  const NarratorSelectModal = () => (
    <>
      {/* Overlay background with blur, closes overlay on tap */}
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
        pointerEvents={showNarratorSelect ? "auto" : "none"}
      >
        <Pressable
          onPress={() => setShowNarratorSelect(false)}
          className="flex-1"
        >
          <BlurView tint="dark" intensity={10} className="flex-1" />
        </Pressable>
      </Animated.View>
      {/* Narrator select sheet with its own pan responder */}
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
          opacity: fadeAnim,
        }}
        {...narratorSelectPanResponder.panHandlers}
      >
        <View className="flex-1 bg-white border border-neutral-100">
          {/* Drag handle */}
          <View className="w-[22%] h-1 mt-1.5 rounded-full bg-gray-200 mx-auto"></View>
          <View className="flex-1 px-4 py-6">
            <Text className="text-Heading6 font-Manrope font-bold text-neutral-100 mb-0.5">
              Choose a narrator
            </Text>
            <Text className="text-BodySmallRegular font-Manrope font-medium text-neutral-80 mb-4">
              You can change it anytime
            </Text>
            {/* Narrator options */}
            <TouchableOpacity
              className={`flex-row items-center justify-between p-4 rounded-lg mb-3 ${
                selectedNarrator === "Josh"
                  ? "bg-[#FBF1E8] border border-primary"
                  : "bg-gray-50"
              }`}
              onPress={() => {
                setSelectedNarrator("Josh");
                setShowNarratorSelect(false);
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
                setShowNarratorSelect(false);
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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Animated.View
        className="border absolute bottom-0 left-0 right-0 rounded-t-[24px] overflow-hidden border-neutral-30 shadow-white-shadow"
        style={{
          height: height * 0.97,
          zIndex: 9000,
          transform: [{ translateY: translateY.current }],
        }}
        {...panResponder.panHandlers}
      >
        <ImageBackground
          source={require("@/assets/images/vectorbg.png")}
          resizeMode="cover"
          className="flex-1 bg-neutral-10 border shadow-black-shadow"
          imageStyle={{ opacity: 0.02 }}
        >
          <View className="flex-1 justify-center shadow-black-shadow border border-neutral-20">
            <View className="w-[22%] h-1 mt-1.5 rounded-full bg-neutral-100 mx-auto"></View>
            <View className="flex-1 h-[50%] justify-center px-4 py-6">
              {/* Book cover and title */}
              <View className="items-center mb-8">
                <View className="relative">
                  <Image
                    source={{ uri: bookCover }}
                    className="w-[170px] h-[235px] rounded-lg mb-4 border border-neutral-20"
                  />
                  <View className="absolute inset-0 bg-black/[0.03] rounded-lg z-10"></View>
                </View>
                <View className="flex-column items-center justify-center gap-3 mt-5">
                  <Text className="text-primary font-semibold text-BodySmallRegular font-Manrope">
                    KEY POINT {currentKeyPointIndex + 1} OF {keyPoints.length}
                  </Text>
                  <Text className="text-BodyRegular text-center max-w-[80%] font-Manrope font-semibold text-neutral-100">
                    {currentKeyPoint?.title}
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
}
