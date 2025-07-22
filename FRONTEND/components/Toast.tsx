import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Platform,
  StyleSheet,
  Dimensions,
  PanResponder, // <-- add this
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useToastStore } from "@/hooks/useToastStore";

const { width } = Dimensions.get("window");

const typeStyles = {
  success: {
    backgroundColor: "#E6F9F0",
    borderColor: "#1BC47D",
    icon: <Ionicons name="checkmark-circle" size={28} color="#1BC47D" />,
  },
  info: {
    backgroundColor: "#E6F0FA",
    borderColor: "#2D7FF9",
    icon: <Ionicons name="information-circle" size={28} color="#2D7FF9" />,
  },
  error: {
    backgroundColor: "#FDECEA",
    borderColor: "#F04438",
    icon: <MaterialIcons name="error-outline" size={28} color="#F04438" />,
  },
  default: {
    backgroundColor: "#F5F5F5",
    borderColor: "#E0E0E0",
    icon: <Ionicons name="notifications-outline" size={28} color="#757575" />,
  },
};

const Toast: React.FC = () => {
  const {
    visible,
    type,
    title,
    message,
    points,
    buttonText,
    buttonOnPress,
    hideToast,
    backgroundColor: customBg,
    borderColor: customBorder,
    textColor: customText,
    icon: customIcon,
  } = useToastStore();

  const anim = useRef(new Animated.Value(0)).current;

  // PanResponder for swipe up to dismiss
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 10,
      onPanResponderMove: (_, gesture) => {},
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy < -30) {
          hideToast();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(anim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  const { icon: defaultIcon, ...typeColors } =
    typeStyles[type] || typeStyles.default;
  const icon = customIcon || defaultIcon;

  const toastBg = customBg || typeColors.backgroundColor;
  const toastBorder = customBorder || typeColors.borderColor;
  const toastText = customText || "#222";

  return (
    <SafeAreaView
      pointerEvents="box-none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        width: "100%",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <Animated.View
        {...panResponder.panHandlers} // Attach pan responder here
        style={[
          styles.toast,
          {
            backgroundColor: toastBg,
            borderColor: toastBorder,
            borderWidth: 1.3,
            opacity: anim,
            transform: [
              {
                translateY: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-80, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.icon}>{icon}</View>
        <View style={{ flex: 1 }}>
          {title ? (
            <Text style={[styles.title, { color: toastText }]}>{title}</Text>
          ) : null}
          {message ? (
            <Text style={[styles.message, { color: toastText }]}>
              {message}
            </Text>
          ) : null}
          {points && points.length > 0 && (
            <View style={{ marginTop: 6 }}>
              {points.map((pt, idx) => (
                <View
                  key={idx}
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    marginBottom: 2,
                  }}
                >
                  <Text style={styles.bullet}>{"\u2022"}</Text>
                  <Text style={[styles.pointText, { color: toastText }]}>
                    {pt}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
        {buttonText ? (
          <TouchableOpacity
            style={styles.button}
            onPress={buttonOnPress ? buttonOnPress : hideToast}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        ) : null}
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  toast: {
    flexDirection: "row",
    alignItems: "flex-start",
    minHeight: 60,
    maxWidth: width - 32,
    marginTop: 16,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    shadowColor: "#000",
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  icon: {
    marginRight: 14,
    marginTop: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 2,
    fontFamily: "Manrope-Bold",
  },
  message: {
    fontSize: 14,
    color: "#444",
    fontFamily: "Manrope",
  },
  bullet: {
    fontSize: 16,
    color: "#757575",
    marginRight: 6,
    marginTop: 1,
  },
  pointText: {
    fontSize: 14,
    color: "#444",
    flex: 1,
    fontFamily: "Manrope",
  },
  button: {
    marginLeft: 12,
    backgroundColor: "#F96C00",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    fontFamily: "Manrope-Bold",
  },
});

export default Toast;
