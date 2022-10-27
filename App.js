import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Nickname from './components/componenteNickname.js';
import Menu from './components/componenteMenu.js';
import CreaPartita from './components/componentePartita.js';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
      
      <NavigationContainer>
         <Stack.Navigator>
            <Stack.Screen /*options={{ headerShown: false }}*/ name="Home" component={Nickname} />
            <Stack.Screen /*options={{ headerShown: false }}*/ name="Menu" component={Menu} />
            <Stack.Screen /*options={{ headerShown: false }}*/ name="CreaPartita" component={CreaPartita} />
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