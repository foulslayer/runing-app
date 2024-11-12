// screens/ScreenTwo.js
import { PanGestureHandler } from "react-native-gesture-handler";
import React from "react";
import { View, Text } from "react-native";

function ScreenTwo({ navigation }) {
  return (
    <PanGestureHandler
      onGestureEvent={(event) => {
        const { translationX } = event.nativeEvent;
        if (translationX > 50) {
          // Swipe right to go back to previous tab
          navigation.navigate("ScreenOne");
        } else if (translationX < -50) {
          // Swipe left to go to the next tab
          //    navigation.navigate("ScreenThree");
        }
      }}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Screen Two</Text>
      </View>
    </PanGestureHandler>
  );
}

export default ScreenTwo;
