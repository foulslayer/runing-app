import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const timer = ({ seconds, isRunning, startTimer, stopTimer, resetTimer }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>Time: {seconds}s</Text>
      <Button title={isRunning ? "Stop" : "Start"} onPress={isRunning ? stopTimer : startTimer} />
      <Button title="Reset" onPress={resetTimer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5fcff",
  },
  timerText: {
    fontSize: 48,
    marginBottom: 20,
  },
});

export default timer;
