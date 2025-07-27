import { AntDesign, Feather } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

type Props = {
  visible: boolean;
  onClose: (completed: boolean) => void;
  insights: string[];
  book?: {
    title: string;
    author: string;
    image: string;
    id?: number;
  };
  onBookPress?: (bookId: number) => void;
  initialInsightIndex?: number;
};

const StoryModal = ({
  visible,
  onClose,
  insights,
  book,
  onBookPress,
  initialInsightIndex = 0,
}: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timer = useRef<number | null>(null);
  const { height } = Dimensions.get("window");
  const translateY = useRef(new Animated.Value(height)).current;

  // Animate modal open
  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialInsightIndex);
      animateIn();
      startTimer();
    } else {
      animateOut();
    }

    return () => clearTimer();
  }, [visible, initialInsightIndex]);

  const animateIn = () => {
    Animated.timing(translateY, {
      toValue: Platform.OS === "android" ? 24 : 44, // just below status bar
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const animateOut = () => {
    Animated.timing(translateY, {
      toValue: height,
      duration: 250,
      useNativeDriver: true,
    }).start(() => onClose(currentIndex >= insights.length - 1));
  };

  const startTimer = () => {
    clearTimer();
    timer.current = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev < insights.length - 1) {
          return prev + 1;
        } else {
          clearTimer();
          setTimeout(() => onClose(true), 0);
          return prev;
        }
      });
    }, 6500);
  };

  const clearTimer = () => {
    if (timer.current) clearInterval(timer.current);
  };

  const handleClose = () => {
    clearTimer();
    onClose(currentIndex >= insights.length - 1);
  };

  const goToNext = () => {
    if (currentIndex < insights.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      clearTimer();
      onClose(true);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      clearTimer();
      onClose(true);
    }
  };

  // Drag to close
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dy) > Math.abs(gesture.dx) && gesture.dy > 0,
      onPanResponderGrant: () => {
        clearTimer();
      },
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          translateY.setValue(
            (Platform.OS === "android" ? 24 : 44) + gesture.dy
          );
        }
      },
      onPanResponderRelease: (_, gesture) => {
        const screenWidth = Dimensions.get("window").width;
        // Tap: very small movement
        if (Math.abs(gesture.dx) < 10 && Math.abs(gesture.dy) < 10) {
          if (gesture.moveX < screenWidth / 2) {
            goToPrev();
          } else {
            goToNext();
          }
        } else if (gesture.dy > 10) {
          // Drag down
          animateOut();
        } else {
          animateIn();
        }
      },
      onPanResponderTerminate: () => {
        if (visible) {
          startTimer();
        }
      },
    })
  ).current;

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <Animated.View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: height * 0.99,
          backgroundColor: "#E0B7FF",
          transform: [{ translateY }],
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 32,
          overflow: "hidden",
        }}
        {...panResponder.panHandlers}
      >
        {/* Header */}
        <View className="flex-column justify-between items-start gap-5 mb-4">
          {/* Progress Bar */}
          <View className="flex-1 flex-row gap-1">
            {insights.map((_, i) => (
              <View
                key={i}
                className={`flex-1 h-1 rounded-full ${
                  i < currentIndex
                    ? "bg-neutral-90"
                    : i === currentIndex
                      ? "bg-neutral-90/60"
                      : "bg-neutral-90/20"
                }`}
              />
            ))}
          </View>
          {/* Close Button */}
          <TouchableOpacity
            onPress={handleClose}
            className="absolute top-4 z-50"
            hitSlop={10}
            activeOpacity={0.6}
          >
            <AntDesign name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 justify-end flex-column gap-52 mb-16">
          <View>
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <Image
                  source={require("@/assets/images/quicktales_logo.png")}
                  className="object-cover w-[30px] h-[45px]"
                />
                <Text className="text-secondary font-Montserrat font-bold text-sm mb-1 tracking-widest">
                  QUICKTALES
                </Text>
              </View>
              <Text className="text-secondary font-Manrope font-bold text-[13px]">
                INSIGHT
              </Text>
            </View>

            <Text className="text-neutral-100 font-Manrope font-bold text-Heading3 leading-8 mb-6 w-[90%]">
              {insights[currentIndex]}
            </Text>

            {/* Share Button */}
            <TouchableOpacity className="flex-row items-center gap-1 bg-neutral-30 px-[10px] py-[10px] rounded-[5px] shadow w-24">
              <Feather name="share" size={18} color="#404040" />
              <Text className="text-neutral-90 font-Manrope font-bold text-BodySmallRegular">
                Share
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer Book Info */}
          {book && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                if (onBookPress && book.id !== undefined) {
                  onBookPress(book.id);
                }
              }}
              className="relative flex-row justify-between items-center px-6 z-50"
            >
              {/* Overlapping Book Image */}
              <View className="flex-row gap-3 items-center z-20 flex-1">
                <Image
                  source={{ uri: book.image }}
                  className="w-[60px] h-[85px] rounded-md"
                />
                {/* Card Background */}
                <View className="bg-transparent py-4 flex-1">
                  <Text
                    className="text-neutral-10 w-[95%] font-Manrope font-semibold text-BodySmallRegular"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {book.title}
                  </Text>
                  <Text
                    className="text-neutral-50 w-[75%] font-medium font-Manrope text-[13px]"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {book.author}
                  </Text>
                </View>
              </View>
              <AntDesign name="right" size={16} color="#fff" className="z-20" />
              <View className="absolute bg-neutral-80 inset-3 z-0 rounded-xl"></View>
            </TouchableOpacity>
          )}
        </View>

        {/* Main Content */}

        {/* Tap Zones */}
        <Pressable onPress={goToPrev}>
          <View className="absolute top-0 left-0 bottom-0 w-1/2 z-30" />
        </Pressable>
        <TouchableWithoutFeedback onPress={goToNext}>
          <View className="absolute top-0 right-0 bottom-0 w-1/2 z-30" />
        </TouchableWithoutFeedback>
      </Animated.View>
    </Modal>
  );
};

export default StoryModal;
