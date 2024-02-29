import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import LogInScreen from './UsersScreen/LogInScreen';
import UserInfoScreen from './UsersScreen/UserInfoScreen';
import { IP_Server } from '../../components/const'; 

const IP = IP_Server;

const ProfileScreen = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  const handleLogin = async (email, password) => {
    try {
      // Appel à votre API pour authentifier l'utilisateur
      const response = await fetch(`${IP}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      // Vérifie si la connexion est réussie
      if (response.ok) {
        // Met à jour l'état avec les données de l'utilisateur connecté
        setUser(data.user);
        setIsLoggedIn(true);
      } else {
        // Gère les cas où la connexion échoue (par exemple, mauvais email/mot de passe)
        console.error('Login failed:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogout = () => {
    // Réinitialise l'état de l'utilisateur et de la connexion
    setUser(null);
    setIsLoggedIn(false);
  };

  const handleSignUp = () => {
    navigation.navigate('SignupScreen');
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {isLoggedIn ? (
        <>
          <UserInfoScreen user={user} />
          <Button title="Logout" onPress={handleLogout} />
        </>
      ) : (
        <LogInScreen onLogin={handleLogin} onSignUp={handleSignUp} />
      )}
    </View>
  );
};

export default ProfileScreen;