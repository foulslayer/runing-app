import React from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { LineChart } from "react-native-chart-kit"; // React Native compatible LineChart

const rundata = {
  dates: ["2023-10-01", "2023-10-02", "2023-10-03", "2023-10-04"], // Example dates
  avgSpeed: [10, 11, 10.5, 11.2], // Example average speed in km/h
  topSpeed: [12, 13, 13.5, 14], // Example top speed in km/h
  Time: [3600, 1800, 900, 1500], // Example dates
  distance: [8000, 5000, 1323, 4000], // Example average speed in km/h
};

const screenWidth = Dimensions.get("window").width;

function ScreenOne({ navigation }) {
  return (
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
            <Text style={styles.text}>average speed </Text>
            <View style={styles.blueView}></View>
            <Text style={styles.text}>average speed</Text>
          </View>

          <LineChart
            data={{
              labels: rundata.dates, // X-axis labels
              datasets: [
                { data: rundata.avgSpeed, color: () => "rgba(134, 65, 244, 1)", label: "Avg Speed" },
                { data: rundata.topSpeed, color: () => "rgba(244, 95, 65, 1)", label: "Top Speed" },
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
            labels: rundata.dates, // x-axis labels
            datasets: [
              {
                data: rundata.distance, // y-axis data points
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
