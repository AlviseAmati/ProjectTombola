import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';


export default class Menu extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            
            <View style={styles.containerHome}>
                <Text style={styles.titleHome}>Ciao, NOME</Text>
                <View style={{position: 'absolute',flexDirection: 'row', top: '20%',}}>
                    <Button color="red" title='Partita Casuale' onPress={() => this.props.navigation.navigate('Menu')}></Button>
                    <Button color="red" title='Crea Partita' onPress={() => this.props.navigation.navigate('CreaPartita')}></Button>
                </View>
                <Text style={styles.titleLista}>lista partite attive</Text>
                <Text style={styles.titleLista}>lista partite attive</Text>
                <Text style={styles.titleLista}>lista partite attive</Text>
                <Text style={styles.titleLista}>lista partite attive</Text>
                
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

    /*style={{padding: 50}}*/
});

