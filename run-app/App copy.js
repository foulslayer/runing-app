import { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Pedometer } from "expo-sensors";
import Timer from "./components/timer";

export default function App() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState("checking");
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [averageSpeed, setAverageSpeed] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [topspeed, setTopspeed] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [subscription, setSubscription] = useState(null);

  const STRIDE_LENGTH_METERS = 0.8; // Average stride length
  const SECONDS_IN_HOUR = 3600; // Seconds in one hour for speed calculation

  // Calculate distance in meters
  const stepsToMeters = (steps) => {
    return steps * STRIDE_LENGTH_METERS;
  };

  // Update past step count
  const updatePastStepCount = useCallback(async () => {
    const end = new Date();
    const start = new Date(end);
    start.setSeconds(start.getSeconds() - 10);

    const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
    setPastStepCount(pastStepCountResult.steps);
  }, []);

  // Timer control functions
  const startTimer = async () => {
    setIsRunning(true);
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(String(isAvailable));

    if (isAvailable) {
      updatePastStepCount(); // Initial past step count update

      // Subscribe to step count updates
      const subscription = Pedometer.watchStepCount((result) => {
        setCurrentStepCount(result.steps);
      });
      setSubscription(subscription); // Store the subscription for cleanup
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (subscription) {
      subscription.remove(); // Unsubscribe from pedometer
      setSubscription(null); // Clear the subscription
    }
  };

  const resetTimer = () => {
    stopTimer();
    setAverageSpeed(0);
    setCurrentSpeed(0);
    setTopspeed(0);
    setPastStepCount(0);
    setCurrentStepCount(0);
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

    return () => clearInterval(interval); // Cleanup interval on unmount or when timer stops
  }, [isRunning]);

  // Effect to update average and current speed
  useEffect(() => {
    if (seconds > 0) {
      const distance = stepsToMeters(currentStepCount);
      const speed = ((distance / seconds) * SECONDS_IN_HOUR) / 1000; // Convert to km/h
      setAverageSpeed(speed);

      const pastDistance = stepsToMeters(pastStepCount / 10);
      const currentspeed = (pastDistance * SECONDS_IN_HOUR) / 1000; // Convert to km/h
      setCurrentSpeed(currentspeed);

      if (currentspeed > topspeed) {
        setTopspeed(currentspeed);
      }
    } else {
      setAverageSpeed(0);
      setCurrentSpeed(0);
    }
  }, [currentStepCount, seconds, pastStepCount]);

  return (
    <View style={styles.container}>
      <Text>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>
      {isPedometerAvailable === "true" ? (
        <>
          <Text>Steps taken in the last 24 hours: {pastStepCount}</Text>
          <Text>Walk! And watch this go up: {currentStepCount}</Text>
          <Text>Average Speed: {averageSpeed.toFixed(2)} km/h</Text>
          <Text>Current Speed: {currentSpeed.toFixed(2)} km/h</Text>
          <Text>Top Speed: {topspeed.toFixed(2)} km/h</Text>
          <Timer seconds={seconds} isRunning={isRunning} startTimer={startTimer} stopTimer={stopTimer} resetTimer={resetTimer} />
        </>
      ) : (
        <Text>Pedometer not available on this device.</Text>
      )}
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
