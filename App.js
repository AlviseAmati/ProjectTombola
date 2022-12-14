import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Nickname from './components/componenteMenu.js';
import Menu from './components/componenteMenu.js';
import CreaPartita from './components/componentePartita.js';
import socket from './utils/socket.js';

const Stack = createNativeStackNavigator();

export default function App() {
  var currentIndex = 0;
  return (

    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: true, headerLeft: () => null, headerStyle: {backgroundColor: "#0E5E6F"}, headerTitleStyle: {  color: "#EEEEEE" } }} name="Home" component={Menu} />
        <Stack.Screen options={{headerShown: true, headerLeft: () => null, headerStyle: { backgroundColor: "#0E5E6F"}, headerTitleStyle: { color: "#EEEEEE" }}} name="Partita" component={CreaPartita} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center',
  },
});