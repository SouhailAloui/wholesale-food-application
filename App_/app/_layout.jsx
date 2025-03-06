
import { Stack } from 'expo-router';

import 'react-native-reanimated';





export default function RootLayout() {


  return (

      <Stack>
        <Stack.Screen name="index" options={{ headerShown: true }} />
        <Stack.Screen name="signUp" options={{ title: "Sign Up" }} />
        <Stack.Screen name="login" options={{ title: "login" }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="(clientSide)" options={{ headerShown:false}} />
        <Stack.Screen name="(wholesalerSide)" options={{ headerShown:false}} />
      </Stack>

  
  );
}
