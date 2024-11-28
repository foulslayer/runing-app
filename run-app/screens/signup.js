import React, { useState } from "react";
import { StyleSheet, View, Text, Button, TextInput, Alert } from "react-native";
import fetchApi from "../hooks/useapi"; // Ensure the path and implementation are correct

export default function Signup({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [points, setPoints] = useState("10000");

  const createUser = async () => {
    try {
      const data = await fetchApi("POST", "/users", {
        body: {
          username,
          password,
          email,
          points,
        },
      });
      if (data) {
        navigation.goBack();
      }
      console.log("Data:", data);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View>
      <Button title="Go Back to Login" onPress={() => navigation.goBack()} />
      <View style={styles.container}>
        <Text style={styles.titleText}>username</Text>
        <TextInput style={styles.input} placeholder="username" value={username} onChangeText={(val) => setUsername(val)} />
        <Text style={styles.titleText}> password</Text>
        <TextInput style={styles.input} placeholder="password" secureTextEntry value={password} onChangeText={(val) => setPassword(val)} />
        <Text style={styles.titleText}>email</Text>
        <TextInput style={styles.input} placeholder="email" value={email} onChangeText={(val) => setEmail(val)} />
        <Text style={styles.titleText}>points</Text>
        <TextInput style={styles.input} placeholder="points" value={points} keyboardType="numeric" onChangeText={(val) => setPoints(val)} />
        <Button title="signup" onPress={createUser} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    width: "80%",
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
});
