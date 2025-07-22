import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="Editprofile" options={{ headerShown: false }} />
      <Stack.Screen name="Friendrequests" options={{ headerShown: false }} />
      <Stack.Screen name="Settings" options={{ headerShown: false }} />
    </Stack>
  );
}
