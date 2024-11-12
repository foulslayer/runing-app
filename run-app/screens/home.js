import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Button, Platform } from "react-native";
import { Pedometer } from "expo-sensors";
import Timer from "../components/timer";
import { Video } from "expo-av";
import runner from "../assets/27756690_MotionElements_runner-enjoy-run-sunny-day_preview.mp4";

import { PanGestureHandler } from "react-native-gesture-handler";
import Logout from "../components/logout";

export default function App({ navigation }) {
  const video = useRef(null);
  const [status, setStatus] = useState({});

  const [isPedometerAvailable, setIsPedometerAvailable] = useState("checking");
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [averageSpeed, setAverageSpeed] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [topspeed, setTopspeed] = useState(0);
  const STRIDE_LENGTH_METERS = 0.8; // Average stride length
  const SECONDS_IN_HOUR = 3600; // Seconds in one hour for speed calculation
  const previousStepCount = useRef(0); // use for android

  // Timer state
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [subscription, setSubscription] = useState(null); // Store subscription

  // Start timer and pedometer
  const startTimer = async () => {
    setIsRunning(true);

    // Subscribe to step count updates
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(String(isAvailable));

    if (isAvailable) {
      const subscription = Pedometer.watchStepCount((result) => {
        setCurrentStepCount(result.steps);
      });
      setSubscription(subscription);

      // Initial past step count update
      updatePastStepCount();
    }
  };

  // Stop timer and pedometer
  const stopTimer = () => {
    setIsRunning(false);
    if (subscription) {
      subscription.remove(); // Unsubscribe from pedometer
      setSubscription(null);
    }

    if (video) {
      video.current.pauseAsync();
    }
  };

  // Reset timer and states
  const resetTimer = () => {
    stopTimer();
    setSeconds(0);
    setAverageSpeed(0);
    setCurrentSpeed(0);
    setTopspeed(0);
    setPastStepCount(0);
    setCurrentStepCount(0);
  };

  const updatePastStepCount = async () => {
    if (Platform.OS === "ios") {
      const end = new Date(); // Current time
      const start = new Date(end);
      start.setSeconds(start.getSeconds() - 5);

      const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
      if (pastStepCountResult) {
        setPastStepCount(pastStepCountResult.steps);
      }
    } else if (Platform.OS === "android") {
      const stepsTakenInLast5Seconds = currentStepCount - previousStepCount.current;
      console.log("Steps taken in last 5 seconds (Android):", stepsTakenInLast5Seconds);
      ("");
      setPastStepCount(stepsTakenInLast5Seconds.steps);

      // Update the previous step count for the next interval
      previousStepCount.current = currentStepCount;
    }
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(updatePastStepCount, 4000); // Update every 3 seconds
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    console.log("Current Step Count:", currentStepCount); // Log current step count
    console.log("Seconds:", seconds); // Log elapsed seconds

    if (seconds > 0 && currentStepCount > 0) {
      const speed = ((stepsToMeters(currentStepCount) / seconds) * SECONDS_IN_HOUR) / 1000; // Calculate speed in km/h. we divide by 1000 to convert to km/h
      setAverageSpeed(speed);
      const currentspeed = (stepsToMeters(pastStepCount / 5) * SECONDS_IN_HOUR) / 1000; // Convert to km/h

      setCurrentSpeed(currentspeed);
      if (currentSpeed > topspeed) {
        setTopspeed(currentSpeed);
      }
      console.log("Average Speed:", speed); // Log average speed
    } else {
      setAverageSpeed(0);
    }
  }, [currentStepCount, seconds]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1); // Increment seconds
      }, 1000);
    }
    return () => clearInterval(interval); // Cleanup on unmount
  }, [isRunning]);

  useEffect(() => {
    if (isRunning) {
      if (currentSpeed > 0) {
        video.current.playAsync(); // Play video if there's movement
      } else {
        video.current.pauseAsync(); // Pause video if no movement
      }
    } else {
      video.current.pauseAsync(); // Ensure video pauses if timer is stopped
    }
  }, [currentSpeed, isRunning]);

  return (
    <PanGestureHandler
      onGestureEvent={(event) => {
        const { translationX } = event.nativeEvent;
        if (translationX < -50) {
          // Swipe left to go to the next tab
          navigation.navigate("ScreenOne");
        }
      }}
    >
      <View style={styles.container}>
        {/* Information Display */}
        <View style={styles.infoContainer}>
          <View style={styles.item}>
            <Text>
              Distance: {"\n"} {stepsToMeters(currentStepCount).toFixed(0)} m
            </Text>
          </View>
          <View style={styles.item}>
            <Text>
              Average Speed: {"\n"} {averageSpeed.toFixed(2)} km/h
            </Text>
          </View>
          <View style={styles.item}>
            <Text>
              Current Speed:{"\n"} {currentSpeed.toFixed(2)} km/h
            </Text>
          </View>
          <View style={styles.item}>
            <Text>
              Top Speed: {"\n"} {topspeed.toFixed(2)} km/h
            </Text>
          </View>
        </View>

        {/* Video Player */}
        <View style={styles.videoContainer}>
          <Video ref={video} style={styles.video} source={runner} useNativeControls isLooping onPlaybackStatusUpdate={setStatus} shouldPlay />
        </View>

        <Logout />

        {/* Timer */}
        <Timer seconds={seconds} isRunning={isRunning} startTimer={startTimer} stopTimer={stopTimer} resetTimer={resetTimer} />
      </View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f5fcff",
  },
  videoContainer: {
    width: "100%",
    height: "50%",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    flexWrap: "wrap",
    flexDirection: "row", // Items will be laid out horizontally
    width: "100%",

    justifyContent: "space-around", // Evenly distribute space between items
    alignItems: "center", // Center items vertically
  },
  item: {
    //whiteSpace: "pre-wrap",
    borderColor: "#28a745", // Dark green border
    borderWidth: 2, // Width of the border
    padding: 10, // Padding inside each item
    backgroundColor: "#d4edda", // Light green background
    width: "50%", // Width for better spacing
  },
});

// Function to convert steps to meters
const stepsToMeters = (steps) => {
  return steps * 0.8; // Average stride length
};
