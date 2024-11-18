import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { LineChart } from "react-native-chart-kit";
import fetchApi from "../hooks/useapi"; // Make sure the path is correct

const rundata = {
  dates: ["2023-10-01"], // Example dates
  avgSpeed: [10, 2], // Example average speed in km/h
  topSpeed: [12.3], // Example top speed in km/h
  Time: [3600, 1800, 900, 1500], // Example dates
  distance: [8000, 5000, 1323, 4000], // Example average speed in km/h
};

const screenWidth = Dimensions.get("window").width;

function ScreenOne({ navigation }) {
  const [loading, setLoading] = useState(true);
  const initialData = {
    distance: [],
    averagespeed: [],
    topspeed: [],
    time: [],
    date: [],
  };

  const [historik, setHistorik] = useState(initialData);
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array means it runs once when the component mounts

  // Function to fetch data
  const fetchData = async () => {
    try {
      const data = await fetchApi("GET", "/historik", {
        authToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJrYXNwZXIiLCJpYXQiOjE3MzE1ODgyOTMsImV4cCI6MTczMTc2MTA5M30.vnddACzfePZnoy0-mjlmlagOUxRUT7ifI8wFm9aDIOI", // Optionally include auth token
      });
      const parsedData = {
        distance: data.map((entry) => entry.distance),
        averagespeed: data.map((entry) => parseFloat(entry.averagespeed)),
        topspeed: data.map((entry) => parseFloat(entry.topspeed)),
        time: data.map((entry) => entry.time),
        date: data.map((entry) => new Date(entry.date).toLocaleDateString()), // Format date
      };

      console.log(" Data:", parsedData);
      setHistorik(parsedData);
      setLoading(false);
    } catch (error) {
      console.error(" Error:", error);
      setLoading(false);
    }
  };
  return loading ? (
    <View>
      <Text>Loading data...</Text>
    </View>
  ) : (
    <PanGestureHandler
      onGestureEvent={(event) => {
        const { translationX } = event.nativeEvent;
        if (translationX > 50) {
          navigation.navigate("home"); // Swipe right to go back
        } else if (translationX < -50) {
          navigation.navigate("ScreenTwo"); // Swipe left to next screen
        }
      }}
    >
      <ScrollView Vertical={true}>
        {/* Wrapper View as the sole child of PanGestureHandler */}
        <View style={styles.container}>
          <View style={[styles.orange, { flexDirection: "row" }]}>
            <View style={styles.orangeView}></View>
            <Text style={styles.text}>top speed </Text>
            <View style={styles.blueView}></View>
            <Text style={styles.text}>average speed</Text>
          </View>
          <LineChart
            data={{
              labels: historik.date, // X-axis labels
              datasets: [
                { data: historik.averagespeed, color: () => "rgba(134, 65, 244, 1)", label: "Avg Speed" },
                { data: historik.topspeed, color: () => "rgba(244, 95, 65, 1)", label: "Top Speed" },
              ],
            }}
            width={screenWidth} // Adjust width based on screen size
            height={500}
            yAxisLabel=""
            yAxisSuffix="km/h"
            xAxisLabel=""
            xAxisSuffix=""
            verticalLabelRotation={90} // Rotates labels vertically
            chartConfig={{
              backgroundColor: "#f2f2f2",
              backgroundGradientFrom: "#f2f2f2",
              backgroundGradientTo: "#f2f2f2",
              decimalPlaces: 1, // Optional: Number of decimal places for y-axis labels
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
              // Add padding to prevent labels from getting cut off
              paddingTop: 16,
              paddingRight: 24,
              paddingBottom: 16,
              paddingLeft: 24,
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
        <LineChart
          data={{
            //   labels: rundata.dates, // x-axis labels
            labels: historik.date, // x-axis labels
            datasets: [
              {
                data: historik.distance, // y-axis data points
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // line color
                strokeWidth: 2,
              },
            ],
          }}
          width={screenWidth} // responsive width
          height={500}
          yAxisSuffix="m"
          yAxisInterval={1} // optional, adjust grid density
          verticalLabelRotation={90}
          chartConfig={{
            backgroundColor: "#f2f2f2",
            backgroundGradientFrom: "#f2f2f2",
            backgroundGradientTo: "#f2f2f2",
            decimalPlaces: 1, // for 1 decimal place
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
        />
      </ScrollView>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 32,
    marginHorizontal: 12,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  orangeView: {
    width: 25,
    height: 25,
    backgroundColor: "orange",
    marginRight: 10,
  },
  blueView: {
    width: 25,
    height: 25,
    backgroundColor: "blue",
    marginRight: 10,
  },
});

export default ScreenOne;
