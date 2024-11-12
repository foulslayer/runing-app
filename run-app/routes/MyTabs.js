import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ScreenOne from "../screens/ScreenOne";
import ScreenTwo from "../screens/ScreenTwo";
import home from "../screens/home";

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="home" component={home} />
      <Tab.Screen name="ScreenOne" component={ScreenOne} />
      <Tab.Screen name="ScreenTwo" component={ScreenTwo} />
    </Tab.Navigator>
  );
}

export default MyTabs;
