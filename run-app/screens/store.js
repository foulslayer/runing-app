// screens/ScreenTwo.js
import { PanGestureHandler } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "../components/modal"; // Import Modal component
import { useState } from "react";
import React from "react";
import { View, Text, StyleSheet, Image, Button } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { BlurView } from "expo-blur";
import runner from "../assets/video_preview_0000.avif";
import { useVideo } from "../hooks/usevideo";

function ScreenTwo({ navigation }) {
  /*const saveVideoSource = async (videoSource) => {
    try {
      await AsyncStorage.setItem("videoSource", videoSource);
      console.log("Video source saved:", videoSource);
    } catch (error) {
      console.error("Error saving video source:", error);
    }
  };*/

  const { setRunner } = useVideo();

  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const [modalData, setModalData] = useState({
    name: "",
    type: "",
    price: "",
    image: "",
  });

  const toggleModal = (data = {}) => {
    setModalData(data);
    setShowModal(!showModal);
  };

  /*
  const toggleModal = () => {
    setShowModal(!showModal);
  };*/

  return (
    <PanGestureHandler
      onGestureEvent={(event) => {
        const { translationX } = event.nativeEvent;
        if (translationX > 50) {
          // Swipe right to go back to previous tab
          navigation.navigate("statistik");
        } else if (translationX < -50) {
          // Swipe left to go to the next tab
          //    navigation.navigate("ScreenThree");
        }
      }}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.cardText}>Card 1</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardText}>Card s1</Text>
        </View>

        <View style={styles.card}>
          <BlurView intensity={50} style={styles.blur} tint="light" />
          <Image source={require("../assets/video_preview_0000.avif")} style={styles.Image} blurRadius={20} />
          {isLoggedIn ? (
            <>
              <FontAwesomeIcon icon={faLock} size={48} style={styles.lockImage} />
              <Button
                title="Open Modal"
                onPress={() =>
                  toggleModal({
                    name: "Product Name",
                    type: "Product Type",
                    price: "$100",
                    image: require("../assets/pexels-photo-8380510.jpeg"),
                  })
                }
              />

              <Button title="Use" style={styles.use} onPress={() => setRunner("femalerunner")} />
            </>
          ) : (
            <Button title="Use" style={styles.use} onPress={() => setRunner("femalerunner")} />
          )}
        </View>
        <View style={styles.card}>
          <BlurView intensity={50} style={styles.blur} tint="light" />
          <Image source={require("../assets/pexels-photo-8380510.jpeg")} style={styles.Image} blurRadius={20} />
          {isLoggedIn ? (
            <>
              <FontAwesomeIcon icon={faLock} size={48} style={styles.lockImage} />
              <Button title="open model" onPress={toggleModal}></Button>
              <Button title="Use" style={styles.use} onPress={() => setRunner("malerunner")} />
            </>
          ) : (
            <Button title="Use" style={styles.use} onPress={() => setRunner("malerunner")} />
          )}
        </View>

        <Modal show={showModal} onClose={toggleModal} name={modalData.name} type={modalData.type} price={modalData.price} image={modalData.image} />
      </View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    justifyContent: "center", // Center the row
    alignItems: "center", // Vertically align items
    flexWrap: "wrap",
  },
  card: {
    marginHorizontal: 5, // Horizontal spacing between cards
    marginVertical: 5, // Vertical spacing
    backgroundColor: "#fff",

    borderRadius: 10,
    width: "45%",
    height: "25%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  cardText: {
    fontSize: 16,
    color: "#333",
  },
  Image: {
    width: "100%",
    height: "100%",
  },
  lockImage: {
    fontSize: 48,
    width: 200,
    height: 200,
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
    position: "absolute",
    //bottom: 10, // Positions lock near the bottom of the base image
    //right: 10, // Positions lock near the right side
    backgroundColor: "transparent",
  },
  use: {
    display: "none",
  },
});
export default ScreenTwo;
