// Modal.js
import React from "react";
import { View, StyleSheet, Button, Dimensions, Image, Text } from "react-native";

const { width, height } = Dimensions.get("window");

const Modal = ({ show, onClose, children, type, price, name, image }) => {
  if (!show) {
    return null; // If 'show' is false, do not render the modal
  }

  return (
    <View style={styles.modalOverlay} onClick={onClose}>
      <View style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <Button style={styles.closeBtn} title="X" className="close-btn" onPress={onClose}>
          X
        </Button>
        <Text>{name}</Text>
        <Image source={typeof image === "number" ? image : { uri: image }} style={{ width: 150, height: 150 }} resizeMode="contain" />
        <Text>{type}</Text>
        <Text>Price: {price}</Text>
        {children}
      </View>
    </View>
  );
};

export default Modal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    position: "absolute", // Covers the whole screen
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    position: "absolute", // To ensure it covers the entire screen
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: "white", // Background for the modal
    padding: 20, // Optional padding for content
  },

  closeBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    fontSize: 24,
    color: "black", // Color for the close button text
  },
});
