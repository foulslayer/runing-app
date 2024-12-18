// screens/login.js
import signup from "../screens/signup"; // Import the Signup screen
import { StyleSheet, Text, View, Button, TextInput, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// In your component file
import fetchApi from "../hooks/useapi"; // Make sure the path is correct
import { useState } from "react";

export default function Login({ navigation, onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const pressHandler = () => {
    navigation.navigate("Signup");
  };

  const handleLogin = async () => {
    try {
      const data = await fetchApi("POST", "/auth/login", {
        body: {
          username,
          password,
        },
      });
      if (data) {
        await AsyncStorage.setItem("token", data);
        onLoginSuccess(); // Trigger re-check of auth state in HomeStack
        // navigation.navigate("Home"); // Go to Home if login is successful
      } else {
        console.log(data);
        console.log(username);
        console.log(password);
        Alert.alert("Login failed", "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Login Error", "Could not log in. Please try again.");
    }
  };

  const handleButtonPress = async () => {
    try {
      const data = await fetchApi("GET", "/users", {
        authToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJrYXNwZXIiLCJpYXQiOjE3MzA1MDI5MTgsImV4cCI6MTczMDUxMDExOH0.rmGkyh_GXnzHIxE_eWBp24Hl5LKoGQuKFgqQ9MHpCjM", // Optionally include auth token
      });
      console.log("Button Press Data:", data);
    } catch (error) {
      console.error("Button Press Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Login Screen</Text>
      <Button title="fetch users" onPress={handleButtonPress} />

      <Text style={styles.titleText}>username</Text>
      <TextInput style={styles.input} placeholder="username" value={username} onChangeText={(val) => setUsername(val)} />
      <Text style={styles.titleText}>password</Text>
      <TextInput style={styles.input} placeholder="password" secureTextEntry value={password} onChangeText={(val) => setPassword(val)} />
      <Button title="Log In" onPress={handleLogin} />
      <View>
        <Button title="Sign Up" onPress={pressHandler} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  titleText: {
    fontSize: 18,
    width: "80%",
    fontWeight: "bold",
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
});
