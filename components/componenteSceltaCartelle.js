import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import BouncyCheckboxGroup from "react-native-bouncy-checkbox-group";
import ICheckboxButton from "react-native-bouncy-checkbox-group";

export default class SceltaCartelle extends React.Component {

    render() {
        return (

            <View style={styles.containerHome}>
                <Text style={styles.titleHome}>Scegli quante cartelle vuoi:</Text>

                <Button color="red" title='Inizia' onPress={() => this.props.navigation.navigate('Home')}></Button>

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
        top: '5%',
        fontWeight: 'bold',
        alignItems: 'center',

    },
    titleLista: {
        color: 'black',
        fontSize: '20%',
    },
    inputNickname: {
        height: 30,
        margin: '1%',
        borderWidth: 1,
        padding: 5,
        width: 150,
        backgroundColor: 'white',
        borderRadius: 5,
    },
    text: {
        height: 30,
    },
    checkbox: {
        padding: 10,
    },

    /*style={{padding: 50}}*/
});

