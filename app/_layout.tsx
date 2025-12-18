import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";



export default function RootLayout() {

  return (
    <SafeAreaProvider style={{ width: "100%" }}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
