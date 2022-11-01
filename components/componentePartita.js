import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Alert, TouchableHighlight } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import BouncyCheckboxGroup from "react-native-bouncy-checkbox-group";
import ICheckboxButton from "react-native-bouncy-checkbox-group";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import Tabella from "./componenteTabellaSingola"

var RandTools = require('./rand_tools.js');

export default class CreaPartita extends React.Component {
    constructor(props) { //per passare proprieta did ef acnhe il navigation
        super(props);
        this.state = {
            tabelle: [this.generaCarta(),this.generaCarta(),this.generaCarta()],
            numero: '',
        }
    }

    generaNumero = (numero) => {
        numero = Math.floor(Math.random() * 90) + 1;
        this.setState({ numero: numero })
    }

    generaCarta = () => {
       
        const tools = new RandTools(); 
        const extract_pool = [];
        var card = [[], [], []];

        for (var i = 0; i < 9; i++) {
            extract_pool[i] = new RandTools();
            extract_pool[i].distRandInit((i * 10) + 11, (i * 10) + 1);
        }

        for (var i = 0; i < 9; i++) {
            card[0].push(extract_pool[i].distRandNext());
            card[1].push(extract_pool[i].distRandNext());
            card[2].push(extract_pool[i].distRandNext());
        }

        tools.distRandInit(9);
        for (var i = 0; i < 4; i++) card[0][tools.distRandNext()] = "";

        tools.distRandInit(9);
        for (var i = 0; i < 4; i++) card[1][tools.distRandNext()] = "";

        tools.distRandInit(9);
        var buchi = 0;
        while (buchi < 4) {
            const hit = tools.distRandNext();

            if (card[0][hit] != -1 || card[1][hit] != -1) {
                card[2][hit] = "";
                buchi++;
            }
        }

        for(var i = 0; i < card.length; i++){
            for(var j = 0; j < card[0].length; j++){ 
                card[i][j] = card[i][j].toString()
            }
        }
        return card;
    }

    render() {
        const state = this.state;
        const verticalStaticData = [
            {
                id: 0,
                text: 'Ambo',
            },
            {
                id: 1,
                text: 'Terno',
            },
            {
                id: 2,
                text: 'Quaterna',
            },
            {
                id: 3,
                text: 'Cinquina',
            },
            {
                id: 4,
                text: 'Tombola!',
            },
        ];

        return (

            <View style={styles.containerPartita}>
                {
                    this.state.tabelle.map((tabella) => {
                        return (
                            <>
                                <Tabella tabella={tabella} />
                                <View  style={{height: 25}}/>
                            </>
                        )
                    })
                }
                <Text style={styles.titleNick}>il numero e: {this.state.numero}</Text>
                <Button color="red" title='Genera Numero' onPress={() => this.generaNumero()}></Button>
                <BouncyCheckboxGroup style={{ color: 'red', marginBottom: '5%', marginTop: '5%', flexDirection: 'row', justifyContent: 'center' }}
                    data={verticalStaticData}
                    onChange={(selectedItem) => {
                        console.log("SelectedItem: ", JSON.stringify(selectedItem));
                    }}
                />
                <Button color="red" title='Exit' onPress={() => this.props.navigation.navigate('Home')}></Button>
            </View>

        );
    }
}


const styles = StyleSheet.create({

    containerPartita: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: 'yellow' },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 2, alignItems: 'center' },
    row: { flexDirection: 'row', backgroundColor: 'white' },

    tablePartita: {
        backgroundColor: 'white',
        width: '80%',
        marginTop: '5%',
    },

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
    checkbox: {
        padding: 10,
    },

    /*style={{padding: 50}}*/
});