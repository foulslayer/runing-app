import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Pedometer } from "expo-sensors";
import Timer from "./components/timer";

export default function App() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState("checking");
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [averageSpeed, setAverageSpeed] = useState(0);

  const STRIDE_LENGTH_METERS = 0.8; // Average stride length
  const SECONDS_IN_HOUR = 3600; // Seconds in one hour for speed calculation

  // Calculate distance in meters
  const stepsToMeters = (steps) => {
    return steps * STRIDE_LENGTH_METERS;
  };

  /////////////////////////////// // Timer state and logic////////////////////////////////////////////////////
  const [seconds, setSeconds] = useState(0); // Track time in App.js
  const [isRunning, setIsRunning] = useState(false); // Track if timer is running

  // Timer control functions
  const startTimer = () => setIsRunning(true);
  const stopTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1); // Increment seconds
      }, 1000);
    }

    // Cleanup interval when the component unmounts or timer stops
    return () => clearInterval(interval);
  }, [isRunning]); // Only re-run this effect when `isRunning` changes

  /////////////////////////////// // Timer state and logic////////////////////////////////////////////////////

  // Function to subscribe to step counting
  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(String(isAvailable));

    if (isAvailable) {
      updatePastStepCount(); // Initial past step count update

      // Watch current step count in real time
      return Pedometer.watchStepCount((result) => {
        setCurrentStepCount(result.steps);
      });
    }
    return null;
  };

  // Function to update past step count (last 24 hours)
  const updatePastStepCount = async () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 1); // Set start date to 24 hours ago

    const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
    if (pastStepCountResult) {
      setPastStepCount(pastStepCountResult.steps);
    }
  };

  // Calculate current speed (steps in the last 10 seconds)
  /* const currentSpeed = () => {
    const timeIntervalInSeconds = 10;
    const stepsInLastInterval = (currentStepCount - pastStepCount);
    const distance = stepsToMeters(stepsInLastInterval);
    const speed = (distance / timeIntervalInSeconds) * SECONDS_IN_HOUR; // Convert to meters/hour

    return speed;
  };*/

  const Topspeed = () => {};

  // Effect to update average speed based on current step count and seconds
  useEffect(() => {
    console.log("Current Step Count:", currentStepCount); // Log current step count
    console.log("Seconds:", seconds); // Log elapsed seconds

    if (seconds > 0 && currentStepCount > 0) {
      const speed = ((stepsToMeters(currentStepCount) / seconds) * SECONDS_IN_HOUR) / 1000; // Calculate speed in km/h. we divide by 1000 to convert to km/h
      setAverageSpeed(speed);
      console.log("Average Speed:", speed); // Log average speed
    } else {
      setAverageSpeed(0);
    }
  }, [currentStepCount, seconds]);

  useEffect(() => {
    let subscription;
    const setupSubscription = async () => {
      subscription = await subscribe();
    };
    setupSubscription(); // Call subscription when the component mounts

    // Update past step count every 10 seconds
    const interval = setInterval(updatePastStepCount, 10000);

    // Cleanup on component unmount
    return () => {
      if (subscription) {
        subscription.remove();
      }
      clearInterval(interval); // Clear interval on unmount
    };
  }, []);

  console.log("isPedometerAvailable", isPedometerAvailable);
  console.log("pastStepCount", pastStepCount);
  console.log("currentStepCount", currentStepCount);

  return (
    <View style={styles.container}>
      <Text>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>
      {/* <Text>Steps taken in the last 24 hours: {pastStepCount}</Text>*/}
      <Text>Walk! And watch this go up: {currentStepCount}</Text>
      <Text>Average Speed: {averageSpeed.toFixed(2)} km/h</Text>
      <Timer seconds={seconds} isRunning={isRunning} startTimer={startTimer} stopTimer={stopTimer} resetTimer={resetTimer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});
