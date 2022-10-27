import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import BouncyCheckboxGroup from "react-native-bouncy-checkbox-group";
import  ICheckboxButton from "react-native-bouncy-checkbox-group";

export default class CreaPartita extends React.Component {
    constructor(props) { //per passare proprieta did ef acnhe il navigation
        super(props);
        this.state = {
            value: '',
        }
      
    }
    onChangeTextHandler = (text) => {
        this.setState({ value: text })
    }
   
    eseguiBottone = () => {

    }
    render() {
        return (

            <View style={styles.containerHome}>
                <Text style={styles.titleHome}>Nuova Partita</Text>
                <View style={{ position: 'absolute', flexDirection: 'column', top: '20%', }}>
                    <TextInput value={this.state.value} style={styles.inputNickname} placeholder="Nome Partita" onChangeText={this.onChangeTextHandler}></TextInput>
                </View>
               
                <Button color="red" title='Crea' onPress={() => this.props.navigation.navigate('SceltaCartelle')}></Button>

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

