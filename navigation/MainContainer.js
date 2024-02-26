import * as React from "react";
import { View, Text } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

// Screens
import HomeScreen from "./screens/HomeScreen";
import ResearchScreen from "./screens/ResearchScreen";
import AddScreen from "./screens/AddScreen";
import ChatScreen from "./screens/ChatScreen";
import ProfileScreen from "./screens/ProfileScreen";

//Screen names
const homeName = "Accueil";
const researchName = "Rechercher";
const addName = "Ajouter";
const chatName = "Message";
const profileName = "Profil";

const Tab = createBottomTabNavigator();

export default function MainContainer() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={homeName}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === homeName) {
              iconName = focused ? "home" : "home-outline";
            } else if (rn === researchName) {
              iconName = focused ? "search" : "search-outline";
            } else if (rn === addName) {
              iconName = focused ? "add-circle" : "add-circle-outline";
            } else if (rn === chatName) {
                iconName = focused ? "chatbubbles" : "chatbubbles-outline";
            } else if (rn === profileName) {
                iconName = focused ? "person" : "person-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#A3D288",
          tabBarInactiveTintColor: "grey",
          tabBarLabelStyle: {paddingBottom: 0, fontSize: 10},
          tabBarStyle: {paddingTop: 10, height: 80}
        })}
      >
        <Tab.Screen name={homeName} component={HomeScreen} />
        <Tab.Screen name={researchName} component={ResearchScreen} />
        <Tab.Screen name={addName} component={AddScreen} />
        <Tab.Screen name={chatName} component={ChatScreen} />
        <Tab.Screen name={profileName} component={ProfileScreen} />

      </Tab.Navigator>
    </NavigationContainer>
  );
}
