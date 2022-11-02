import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Alert, TouchableHighlight } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import BouncyCheckboxGroup from "react-native-bouncy-checkbox-group";
import ICheckboxButton from "react-native-bouncy-checkbox-group";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

export default class Tabella extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabella: props.tabella
        }
    }

    renderRow(row,indexRow){
        return(
            <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', maxHeight: 50}}>
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
        return(
            <View style={{ flex: 1, alignSelf: 'stretch', borderWidth: "2px", borderColor: "black", color: "black !important", backgroundColor: "#e28743" }}>
                {
                    cell != "" ? 
                        cell.includes("X") ? 
                            <TouchableHighlight style={{justifyContent: 'center', minHeight: 50}} onPress={() => {this._alertIndex(indexRow,indexCell)}}>
                                <Text style={{color: "black !important", textAlign: "center", paddingBottom: 10, paddingTop: 5, backgroundColor:'red'}}>{cell.replace('X',"")}</Text>
                            </TouchableHighlight>
                        : 
                        <TouchableHighlight style={{justifyContent: 'center', minHeight: 50}} onPress={() => {this._alertIndex(indexRow,indexCell)}}>
                            <Text style={{color: "black !important",textAlign: "center", paddingBottom: 10, paddingTop: 5}}>{cell}</Text>
                        </TouchableHighlight>
                    :
                    <TouchableHighlight><Text></Text></TouchableHighlight>
                }
            </View>
        )
    }

    _alertIndex(indexRow,indexCell) {
        let newArr = [...this.state.tabella];
        if(newArr[indexRow][indexCell].includes("X")){
            newArr[indexRow][indexCell] = newArr[indexRow][indexCell].replace("X","")
        }else{
            newArr[indexRow][indexCell] = newArr[indexRow][indexCell] + "X";
        }
        this.setState({tabella: newArr})
    }

    render(){
        return (
            <View style={{ height: '20%', flexDirection: 'column', alignItems: 'center' }}>
                {
                    this.state.tabella.map((row,index) => {
                        return (
                            this.renderRow(row,index)
                        )
                    })
                }
            </View>
        )      
    }
}