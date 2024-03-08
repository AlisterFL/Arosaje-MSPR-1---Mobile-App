import React, { useState } from "react";
import bcrypt from "react-native-bcrypt";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { IP_Server } from "../../../components/const";
import { useAuth } from "../../../components/AuthContext";
import ProfileScreen from "../ProfileScreen";
import ButtonEdit from "../../../components/button";

const UserInfoScreen = ({ onLogin, onSignUp }) => {
  const { isLoggedIn, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const IP = IP_Server;

    return (
      <View style={styles.container}>
        <text>TEST</text>
      </View>
    );
  }

const styles = StyleSheet.create({
});

export default UserInfoScreen;
