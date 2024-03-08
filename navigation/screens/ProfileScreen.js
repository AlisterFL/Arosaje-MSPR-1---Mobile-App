import React, { useState } from 'react';
import { View, Button } from 'react-native';

import LogInScreen from './UsersScreen/LogInScreen';
import UserInfoScreen from './UsersScreen/UserInfoScreen';
import SignUpScreen from './UsersScreen/SignUpScreen';
import { IP_Server } from '../../components/const'; 

const IP = IP_Server;

const ProfileScreen = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = () => {
    console.log("utilisateur connécté")
  };

  const handleLogout = () => {
    // Réinitialise l'état de l'utilisateur et de la connexion
    setUser(null);
    setIsLoggedIn(false);
  };

  const handleSignUp = () => {
    setIsSignUp(true); // Lorsque l'utilisateur souhaite s'inscrire, passez à true
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {isLoggedIn ? (
        <>
          <UserInfoScreen user={user} />
          <Button title="Logout" onPress={handleLogout} />
        </>
      ) : (
        isSignUp ? (
          <SignUpScreen setIsSignUp={setIsSignUp} />
        ) : (
          <LogInScreen onLogin={handleLogin} onSignUp={handleSignUp} />
        )
      )}
    </View>
  );
};

export default ProfileScreen;