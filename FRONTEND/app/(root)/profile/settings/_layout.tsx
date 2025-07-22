import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="notification" options={{ headerShown: false }} />
      <Stack.Screen name="privacy-policy" options={{ headerShown: false }} />
      <Stack.Screen
        name="terms-and-conditions"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="help-and-support" options={{ headerShown: false }} />
      <Stack.Screen
        name="help-and-support/faqs"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="help-and-support/contact-support"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="help-and-support/suggest-feature"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
