import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';


export default class Nickname extends React.Component {
  
  render() {
    return (
      <View style={styles.containerHome}>
        <Text style={styles.titleHome}>MENU</Text>
       
        <StatusBar style="auto" />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  containerHome: {
    flex: 1,
    backgroundColor: 'yellow',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleHome: {
    position: 'absolute',
    color: 'red',
    fontSize: '40%',
    top: 20,
    fontWeight: 'bold',
    alignItems: 'center',
    
  },
  
  /*style={{padding: 50}}*/
});

