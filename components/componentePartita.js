import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Alert, TouchableHighlight } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import BouncyCheckboxGroup from "react-native-bouncy-checkbox-group";
import ICheckboxButton from "react-native-bouncy-checkbox-group";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

export default class CreaPartita extends React.Component {
    constructor(props) { //per passare proprieta did ef acnhe il navigation
        super(props);
        this.state = {

            tableData1: [
                ['', '', '21', '33', '', '52', '64', '', '84'],
                ['6', '', '25', '', '45', '55', '', '74', ''],
                ['9', '19', '', '38', '', '', '69', '', '89'],
            ],
            numero: '',
        }

    }
    generaNumero = (numero) => {
        numero = Math.floor(Math.random() * 90) + 1;
        this.setState({ numero: numero })
    }

    _alertIndex(indexRow,indexCell) {
        //Alert.alert(`This is row ${index + 1}`);
        let newArr = [...this.state.tableData1]; // copying the old datas array
        // a deep copy is not needed as we are overriding the whole object below, and not setting a property of it. this does not mutate the state. // 
        if(newArr[indexRow][indexCell].includes("X")){
            newArr[indexRow][indexCell] = newArr[indexRow][indexCell].replace("X","")
        }else{
            newArr[indexRow][indexCell] = newArr[indexRow][indexCell] + "X";
        }
        this.setState({tableData1: newArr})
    }

    renderRow(row,indexRow){
        return(
            <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row' }}>
                {
                    row.map((cell,indexCell) => {
                        console.log(cell)
                        return (
                            this.renderCell(cell,indexRow,indexCell)
                        )
                    })
                }
            </View>
        )
    }

    renderCell(cell,indexRow,indexCell){
        console.log(cell)
        return(
            <View style={{ flex: 1, alignSelf: 'stretch', borderWidth: "2px", borderColor: "black", color: "black !important", backgroundColor: "#e28743" }}>
                {
                    cell != "" ? 
                        cell.includes("X") ? 
                            <TouchableHighlight onPress={() => {this._alertIndex(indexRow,indexCell)}}>
                                <Text style={{color: "black !important", textAlign: "center", paddingBottom: "5px", paddingTop: "5px"}}>X</Text>
                            </TouchableHighlight>
                        : 
                        <TouchableHighlight onPress={() => {this._alertIndex(indexRow,indexCell)}}>
                            <Text style={{color: "black !important",textAlign: "center", paddingBottom: "5px", paddingTop: "5px"}}>{cell}</Text>
                        </TouchableHighlight>
                    :
                    <TouchableHighlight><Text></Text></TouchableHighlight>
                }
            </View>
        )
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
                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    {
                        this.state.tableData1.map((row,index) => {
                            return (
                                this.renderRow(row,index)
                            )
                        })
                    }
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