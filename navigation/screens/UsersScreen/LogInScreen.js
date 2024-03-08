import React, { useState } from "react";
import bcrypt from "react-native-bcrypt";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { IP_Server } from "../../../components/const";
import { useAuth } from "../../../components/AuthContext";
import ProfileScreen from "../ProfileScreen";
import ButtonEdit from "../../../components/button";

const LogInScreen = ({ onLogin, onSignUp }) => {
  const { isLoggedIn, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const IP = IP_Server;
  const [isLog, setIsLog] = useState(false);

  const handleLogin = () => {
    const url = `${IP}/users/log_infos/${encodeURIComponent(email)}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la tentative de connexion.");
        }
        return response.json();
      })
      .then((data) => {
        if (data.length > 0) {
          const user = data[0];
          const storedHashedPassword = user.password;

          const passwordMatches = bcrypt.compareSync(
            password,
            storedHashedPassword
          );

          console.log("Fetch password:", storedHashedPassword);

          if (passwordMatches) {
            console.log("Connecté");
            onLogin(user);
            login(user);
          } else {
            console.log("Les mots de passe ne correspondent pas");
          }
        } else {
          console.error("Aucun utilisateur trouvé avec cet email.");
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
  };
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
        />
        <View style={styles.sendButtonContainer}>
          <ButtonEdit
            style={styles.sendButton}
            theme="primary-full"
            label="Se connecter"
            onPress={handleLogin}
          />
        </View>
        <View style={styles.sendButtonContainer}>
          <ButtonEdit
            style={styles.sendButton}
            theme="primary-border"
            label="Créer un compte"
            onPress={onSignUp}
          />
        </View>

      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  input: {
    height: 50,
    width: 300,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius:10,
  },
  sendButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
});

export default LogInScreen;
