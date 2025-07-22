import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        animationDuration: 50,
      }}
    >
      <Stack.Screen name="[id]" />
      <Stack.Screen name="[id]/keypoint/[keypointId]" />
    </Stack>
  );
}
