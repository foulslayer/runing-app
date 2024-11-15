// routes/homeStack.js
import React, { useState, useEffect, useCallback } from "react";
import { Button, View, ActivityIndicator } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyTabs from "./MyTabs";
import Login from "../screens/login";
import Home from "../screens/home";
import { useFocusEffect } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Start with `null` to indicate "loading"

  const checkToken = async () => {
    const token = await AsyncStorage.getItem("token");
    setIsAuthenticated(!!token); // Set `true` if token exists, `false` otherwise
  };

  useEffect(() => {
    checkToken(); // Initial check on mount
  }, []);

  if (isAuthenticated === null) {
    // Display loading indicator while checking token
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="18" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        <Stack.Screen
          name="Home"
          component={MyTabs}
          options={{
            headerRight: () => (
              <Button
                title="Logout"
                onPress={async () => {
                  await AsyncStorage.removeItem("token");
                  setIsAuthenticated(false); // Update auth state to show Login screen
                }}
              />
            ),
          }}
        />
      ) : (
        <Stack.Screen name="Login">{(props) => <Login {...props} onLoginSuccess={checkToken} />}</Stack.Screen>
      )}
    </Stack.Navigator>
  );
}
