import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import bcrypt from "react-native-bcrypt";
import { IP_Server } from "../../../components/const";

const IP = IP_Server;
const SignupScreen = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [street, setStreet] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigation = useNavigation();

  const handleSubmit = () => {
    if (
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      city.trim() === "" ||
      postalCode.trim() === "" ||
      street.trim() === ""
    ) {
      setErrorMessage("Tous les champs doivent être remplis");
      return;
    }

    bcrypt.hash(password, 10, function (err, hash) {
      if (err) {
        console.error("Error hashing password:", error);
        return;
      }

      const userData = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: hash,
        address_city: city,
        address_postal_code: postalCode,
        address_street: street,
      };

      fetch(`${IP}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          setTimeout(() => {
            navigation.goBack();
          }, 2000);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={{ color: "blue" }}>Retour</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Prénom"
          onChangeText={(text) => setFirstName(text)}
          value={firstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Nom"
          onChangeText={(text) => setLastName(text)}
          value={lastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Adresse"
          onChangeText={(text) => setStreet(text)}
          value={street}
        />
        <TextInput
          style={styles.input}
          placeholder="Ville"
          onChangeText={(text) => setCity(text)}
          value={city}
        />
        <TextInput
          style={styles.input}
          placeholder="Code Postal"
          onChangeText={(text) => setPostalCode(text)}
          value={postalCode}
          keyboardType="numeric"
        />
        <Text style={styles.errorMessage}>{errorMessage}</Text>
        <Button title="S'inscrire" onPress={handleSubmit} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  backButton: {
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  errorMessage: {
    color: "red",
    marginBottom: 10,
  },
  requiredFields: {
    marginBottom: 10,
  },
});

export default SignupScreen;