import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { useAuth } from '../../components/AuthContext'; // Assurez-vous de fournir le chemin correct

export default function ChatScreen({ navigation }) {
  const { user } = useAuth();

  useEffect(() => {
    // Votre logique ici, peut-être quelque chose qui dépend des informations de l'utilisateur
  }, []);

  return (
    <View>
      <Text>Bienvenue sur la page de chat, {user ? user.first_name : 'Invité'}</Text>
      <Button
        title="Aller à la page de profil"
        onPress={() => navigation.navigate('Profile')}
      />
    </View>
  );
}