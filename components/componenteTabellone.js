import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Alert, TouchableHighlight } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import BouncyCheckboxGroup from "react-native-bouncy-checkbox-group";
import ICheckboxButton from "react-native-bouncy-checkbox-group";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

export default class Tabellone extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabella: props.tabella
        }
    }

    renderRow(row,indexRow){
        console.log(row)
        return(
            <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', maxHeight: 50}}>
                {
                    row.map((cell,indexCell) => {
                        console.log(cell)
                        return (
                            this.renderCell(cell,indexRow,indexCell, this.state.tabella.length)
                        )
                    })
                }
            </View>
        )
    }

    renderCell(cell,indexRow,indexCell,length){
        return(
            <View style={{ flex: 1, alignSelf: 'stretch', borderWidth: "1px", borderColor: "black", color: "black !important", backgroundColor: "#e28743" }}>
                {
                    cell != "" ? 
                        cell.includes("X") ? 
                            <TouchableHighlight style={{justifyContent: 'center', minHeight: 50}} onPress={() => {this._alertIndex(indexRow,indexCell)}}>
                                <Text style={{color: "red !important",borderRadius:"15px", textAlign: "center",  backgroundColor:'red'}}>{cell.replace('X',"")}</Text>
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

    render(){
        console.log(this.state.tabella)
        return (
            <View style={{ height: '100%', flexDirection: 'column', alignItems: 'center' }}>
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