// App.js
import "react-native-gesture-handler"; // Import at the top of the entry file
import { GestureHandlerRootView } from "react-native-gesture-handler";

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import HomeStack from "./routes/homeStack";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Wrap with GestureHandlerRootView */}
      <NavigationContainer>
        <HomeStack />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
