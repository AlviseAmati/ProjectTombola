import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import BouncyCheckboxGroup from "react-native-bouncy-checkbox-group";
import ICheckboxButton from "react-native-bouncy-checkbox-group";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

export default class CreaPartita extends React.Component {
    constructor(props) { //per passare proprieta did ef acnhe il navigation ....
        super(props);
        this.state = {

            tableData1: [
                ['', '', '21', '33', '', '52', '64', '', '84'],
                ['6', '', '25', '', '45', '55', '', '74', ''],
                ['9', '19', '', '38', '', '', '69', '', '89']

            ],
            tableData2: [
                ['', '', '21', '33', '', '52', '64', '', '84'],
                ['6', '', '25', '', '45', '55', '', '74', ''],
                ['9', '19', '', '38', '', '', '69', '', '89']

            ],
            numero: '',
        }

    }
    generaNumero = (numero) => {
        numero = Math.floor(Math.random() * 90) + 1;
        this.setState({ numero: numero })
    }
    _alertIndex(index) {
        Alert.alert(`This is row ${index + 1}`);
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
        const element = (data, index) => (
            <TouchableOpacity onPress={() => this._alertIndex(index)}>
                <View style={styles.btn}>
                    <Text style={styles.btnText}>{data}</Text>
                </View>
            </TouchableOpacity>
        );
        return (

            <View style={styles.containerPartita}>
                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <Table style={styles.tablePartita} borderStyle={{ borderWidth: 2, borderColor: 'black' }}>
                        <Rows data={state.tableData1} style={styles.text} />
                    </Table>
                    <Table style={styles.tablePartita} borderStyle={{ borderWidth: 2, borderColor: 'black' }}>
                        {
                        state.tableData1.map((rowData, index) => (
                            <TableWrapper key={index} style={styles.row}>
                                {
                                    rowData.map((cellData, cellIndex) => (
                                        <Cell key={cellIndex} data={  element(cellData, index) } textStyle={styles.text} />
                                    ))
                                }
                            </TableWrapper>
                        ))}

                    </Table>
                </View>
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