import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index"/>
      <Stack.Screen name="notification"/>
      <Stack.Screen name="privacy-policy"/>
      <Stack.Screen
        name="terms-and-conditions"
      />
      <Stack.Screen name="help-and-support"/>
      <Stack.Screen
        name="help-and-support/faqs"
      />
      <Stack.Screen
        name="help-and-support/contact-support"
      />
      <Stack.Screen
        name="help-and-support/suggest-feature"
      />
    </Stack>
  );
}
