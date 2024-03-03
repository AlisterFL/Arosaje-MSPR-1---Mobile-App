import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import bcrypt from "react-native-bcrypt";
import { IP_Server } from "../../../components/const";

const LogInScreen = ({ onLogin, onSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const IP = IP_Server;

  const handleLogin = () => {
    // Hasher le mot de passe avec bcrypt
    const hashedPassword = bcrypt.hashSync(password, 10);
    console.log(hashedPassword)

    // Envoyer les informations à l'API
    fetch(`${IP}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: hashedPassword, 
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la tentative de connexion.');
        }
        return response.json();
      })
      .then(data => {
        // Si la connexion réussit, appeler la fonction onLogin avec les informations de l'utilisateur
        onLogin(data);
      })
      .catch(error => {
        // En cas d'erreur, afficher un message d'erreur
        setErrorMessage(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={text => setEmail(text)}
        value={email}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={text => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Créer un compte" style={styles.signupText} onPress={onSignUp}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  signupText: {
    marginTop: 10,
    color: 'blue',
  },
});

export default LogInScreen;