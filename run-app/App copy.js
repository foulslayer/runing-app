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

/*import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { Pedometer } from "expo-sensors";
import Timer from "./components/timer";

export default function App() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState("checking");
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [averageSpeed, setAverageSpeed] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [topspeed, setTopspeed] = useState(0);

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

    // Cleanup interval when the component unmounts or timer stops
    return () => clearInterval(interval);
  }, [isRunning]); // Only re-run this effect when isRunning changes

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

  // Function to update past step count (last 10 secconds))
  const updatePastStepCount = async () => {
    const platform = Platform.OS;

    if (platform === "ios") {
      const end = new Date(); // Current time
      const start = new Date(end); // Create a copy of the end date
      start.setSeconds(start.getSeconds() - 10); // Set start date to 10 seconds ago

      try {
        const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
        if (pastStepCountResult) {
          setPastStepCount(pastStepCountResult.steps);
        }
      } catch (error) {
        console.error("Error fetching step count for iOS:", error.message);
      }
    } else if (platform === "android") {
      // Android: Calculate steps manually by comparing current step count with the last stored past step count
      setPastStepCount(currentStepCount - pastStepCount); // Steps taken in the last interval
    }
  };

  // Effect to update average speed based on current step count and seconds
  useEffect(() => {
    console.log("Current Step Count:", currentStepCount); // Log current step count
    console.log("Seconds:", seconds); // Log elapsed seconds

    if (seconds > 0 && currentStepCount > 0) {
      const speed = ((stepsToMeters(currentStepCount) / seconds) * SECONDS_IN_HOUR) / 1000; // Calculate speed in km/h. we divide by 1000 to convert to km/h
      setAverageSpeed(speed);
      const currentspeed = (stepsToMeters(pastStepCount / 10) * SECONDS_IN_HOUR) / 1000; // Convert to km/h
      setCurrentSpeed(currentspeed);

      if (currentSpeed > topspeed) {
        setTopspeed(currentSpeed);
      }

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

    // Update past step count every 5 seconds
    const interval = setInterval(() => {
      updatePastStepCount();
    }, 5000);

    // Cleanup on component unmount
    return () => {
      if (subscription) {
        subscription.remove();
      }
      clearInterval(interval); // Clear interval on unmount
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>
      <Text>Steps taken in the last 24 hours: {pastStepCount}</Text>
      <Text>Walk! And watch this go up: {currentStepCount}</Text>
      <Text>Average Speed: {averageSpeed.toFixed(2)} km/h</Text>
      <Text>current Speed: {currentSpeed.toFixed(2)} km/h</Text>
      <Text>Top Speed: {topspeed.toFixed(2)} km/h</Text>
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
*/

/**import { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Button, Platform } from "react-native";
import { Pedometer } from "expo-sensors";
import Timer from "./components/timer";

export default function App() {
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
    }
  };

  // Stop timer and pedometer
  const stopTimer = () => {
    setIsRunning(false);
    if (subscription) {
      subscription.remove(); // Unsubscribe from pedometer
      setSubscription(null);
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
    previousStepCount = 0;
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(async () => {
        if (Platform.OS === "ios") {
          const end = new Date(); // Current time
          const start = new Date(end);
          start.setSeconds(start.getSeconds() - 5);

          const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
          if (pastStepCountResult) {
            setPastStepCount(pastStepCountResult.steps);
          }
        } else if (Platform.OS === "android") {
          console.log("currentStepCount:", currentStepCount);
          console.log("previousStepCount:", previousStepCount.current);

          const stepsTakenInLast5Seconds = currentStepCount - previousStepCount.current;
          console.log("Steps taken in last 5 seconds (Android):", stepsTakenInLast5Seconds);

          setPastStepCount(stepsTakenInLast5Seconds);

          // Update the previous step count for the next interval
          previousStepCount.current = currentStepCount;
        }
      }, 5000); // Update every 5 seconds
    }

    return () => clearInterval(interval);
  }, [isRunning, currentStepCount]); // Track isRunning and currentStepCount

  useEffect(() => {
    if (seconds > 0 && currentStepCount > 0) {
      const speed = ((stepsToMeters(currentStepCount) / seconds) * SECONDS_IN_HOUR) / 1000; // Calculate speed in km/h. we divide by 1000 to convert to km/h
      setAverageSpeed(speed);
      const currentspeed = (stepsToMeters(pastStepCount / 5) * SECONDS_IN_HOUR) / 1000; // Convert to km/h

      setCurrentSpeed(currentspeed);
      if (currentSpeed > topspeed) {
        setTopspeed(currentSpeed);
      }
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

  return (
    <View style={styles.container}>
      <Text>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>
      <Text>Steps taken in the last 5 seconds: {pastStepCount}</Text>
      <Text>Current Steps: {currentStepCount}</Text>
      <Text>Average Speed: {averageSpeed.toFixed(2)} km/h</Text>
      <Text>Current Speed: {currentSpeed.toFixed(2)} km/h</Text>
      <Text>Top Speed: {topspeed.toFixed(2)} km/h</Text>

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

// Function to convert steps to meters
const stepsToMeters = (steps) => {
  return steps * 0.8; // Average stride length
};
 */

/**import { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Button, Platform } from "react-native";
import { Pedometer } from "expo-sensors";
import Timer from "./components/timer";

export default function App() {
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

  // Update past step count (last 5 seconds)
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
      console.log("currentStepCount:", currentStepCount);
      console.log("previousStepCount:", previousStepCount.current);
      const stepsTakenInLast5Seconds = currentStepCount - previousStepCount.current;
      console.log("Steps taken in last 5 seconds (Android):", stepsTakenInLast5Seconds);
      setPastStepCount(stepsTakenInLast5Seconds);

      // Update the previous step count for the next interval
      previousStepCount.current = currentStepCount;
    }
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(updatePastStepCount, 5000); // Update every 5 seconds
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (seconds > 0 && currentStepCount > 0) {
      const speed = ((stepsToMeters(currentStepCount) / seconds) * SECONDS_IN_HOUR) / 1000; // Calculate speed in km/h. we divide by 1000 to convert to km/h
      setAverageSpeed(speed);
      const currentspeed = (stepsToMeters(pastStepCount / 5) * SECONDS_IN_HOUR) / 1000; // Convert to km/h

      setCurrentSpeed(currentspeed);
      if (currentSpeed > topspeed) {
        setTopspeed(currentSpeed);
      }
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

  return (
    <View style={styles.container}>
      <Text>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>
      <Text>Steps taken in the last 5 seconds: {pastStepCount}</Text>
      <Text>Current Steps: {currentStepCount}</Text>
      <Text>Average Speed: {averageSpeed.toFixed(2)} km/h</Text>
      <Text>Current Speed: {currentSpeed.toFixed(2)} km/h</Text>
      <Text>Top Speed: {topspeed.toFixed(2)} km/h</Text>

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

// Function to convert steps to meters
const stepsToMeters = (steps) => {
  return steps * 0.8; // Average stride length
};
 */

/**import { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { Pedometer } from "expo-sensors";
import Timer from "./components/timer";

export default function App() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState("checking");
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [averageSpeed, setAverageSpeed] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [topspeed, setTopspeed] = useState(0);

  const STRIDE_LENGTH_METERS = 0.8; // Average stride length
  const SECONDS_IN_HOUR = 3600; // Seconds in one hour for speed calculation
  const previousStepCount = useRef(0); // use for android

  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [subscription, setSubscription] = useState(null); // Store subscription

  const startTimer = async () => {
    setIsRunning(true);

    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(String(isAvailable));

    if (isAvailable) {
      const subscription = Pedometer.watchStepCount((result) => {
        setCurrentStepCount(result.steps); // Track steps in real-time
      });
      setSubscription(subscription);
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
  };

  const resetTimer = () => {
    stopTimer();
    setSeconds(0);
    setAverageSpeed(0);
    setCurrentSpeed(0);
    setTopspeed(0);
    setPastStepCount(0);
    setCurrentStepCount(0);
    previousStepCount.current = 0;
  };

  // Update every 5 seconds
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        if (Platform.OS === "ios") {
          const end = new Date();
          const start = new Date(end);
          start.setSeconds(start.getSeconds() - 5);

          Pedometer.getStepCountAsync(start, end).then((pastStepCountResult) => {
            if (pastStepCountResult) {
              setPastStepCount(pastStepCountResult.steps);
            }
          });
        } else if (Platform.OS === "android") {
          console.log("currentStepCount:", currentStepCount);
          console.log("previousStepCount:", previousStepCount.current);
          const stepsTakenInLast5Seconds = currentStepCount - previousStepCount.current;
          console.log("stepsTakenInLast5Seconds:", stepsTakenInLast5Seconds);
          setPastStepCount(stepsTakenInLast5Seconds);

          previousStepCount.current = currentStepCount;
        }
      }, 5000); // Run every 5 seconds
    }

    return () => clearInterval(interval);
  }, [isRunning, currentStepCount]);

  // Calculate speed and update state
  useEffect(() => {
    if (seconds > 0 && currentStepCount > 0) {
      const totalDistanceMeters = stepsToMeters(currentStepCount); // Convert total steps to meters
      const speed = (totalDistanceMeters / seconds) * (SECONDS_IN_HOUR / 1000); // Convert to km/h
      setAverageSpeed(speed);

      const currentSpeedValue = (stepsToMeters(pastStepCount / 5) * SECONDS_IN_HOUR) / 1000; // Speed over the last 5 seconds
      setCurrentSpeed(currentSpeedValue);

      if (currentSpeedValue > topspeed) {
        setTopspeed(currentSpeedValue);
      }
    } else {
      setAverageSpeed(0);
    }
  }, [currentStepCount, pastStepCount, seconds]);

  // Increment the timer every second when running
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <View style={styles.container}>
      <Text>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>
      <Text>Steps taken in the last 5 seconds: {pastStepCount}</Text>
      <Text>Current Steps: {currentStepCount}</Text>
      <Text>Average Speed: {averageSpeed.toFixed(2)} km/h</Text>
      <Text>Current Speed: {currentSpeed.toFixed(2)} km/h</Text>
      <Text>Top Speed: {topspeed.toFixed(2)} km/h</Text>

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

const stepsToMeters = (steps) => steps * 0.8; // Average stride length
 */
