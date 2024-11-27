import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import statistik from "../screens/statistik";
import store from "../screens/store";
import home from "../screens/home";

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="home" component={home} options={{ headerShown: false }} />
      <Tab.Screen name="statistik" component={statistik} options={{ headerShown: false }} />
      <Tab.Screen name="store" component={store} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

export default MyTabs;
