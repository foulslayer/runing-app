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

/*
useEffect(() => {
  let interval;
  if (isRunning) {
    interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);
  }

  // Cleanup interval when the component unmounts or timer stops
  return () => clearInterval(interval);
}, [isRunning]); // Only re-run this effect when `isRunning` changes

const handleStartStop = () => {
  setIsRunning(!isRunning); // Toggle between start and stop
};

const handleReset = () => {
  setIsRunning(false);
  setSeconds(0); // Reset timer
};*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
