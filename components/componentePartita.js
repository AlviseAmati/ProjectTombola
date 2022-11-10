import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Alert, TouchableHighlight, useWindowDimensions, Dimensions, TouchableHighlightBase } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import BouncyCheckboxGroup from "react-native-bouncy-checkbox-group";
import ICheckboxButton from "react-native-bouncy-checkbox-group";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import Tabella from "./componenteTabellaSingola"
import Tabellone from "./componenteTabellone"
import AsyncStorage from "@react-native-async-storage/async-storage";
import socket from '../utils/socket';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const initialLayout = { with: Dimensions.get('window').width };

var RandTools = require('./rand_tools.js');



export default class CreaPartita extends React.Component {
    constructor(props) { //per passare proprieta did ef acnhe il navigation
        super(props);

        this.state = {
            tabelle: [this.generaCarta(), this.generaCarta()],
            numero: '',
            listaNumeri: [],
            tabellone: this.createTabellone(),
            listaGiocatori: [],
            index: 0,
            partitaIniziata: false,
            statoBottoneTerno: false,
            statoBottoneCinquina: false,
            statoBottoneTombola: false,
            statoPartitaFinita: false,
            terno: false,
            routes: [
                { key: 'first', title: 'Gioco' },
                { key: 'second', title: 'Tabellone' },
            ]
        }
    }

    createTabellone = () => {
        var arr = []
        for (var i = 0; i < 9; i++) {
            var arr1 = []
            for (var j = 1; j <= 10; j++) {
                if (j != 0) {
                    arr1.push(parseInt(i * 10 + j).toString())
                }
            }
            arr.push(arr1)
        }
        console.log(arr)
        return arr
    }

    /* async prelevaNickname() { //far partire questa funzione a onLOAD pagina
         var username = await AsyncStorage.getItem('username');
         this.setState({ listaGiocatori: username })
     }*/

    generaNumero = (numero) => {
        numero = Math.floor(Math.random() * 90) + 1;
        this.setState({ numero: numero })
    }

    updateTabellone(numeroEstratto) {
        var tabelloneNew = this.state.tabellone
        for (var i = 0; i < tabelloneNew.length; i++) {
            for (var j = 0; j <= tabelloneNew[i].length; j++) {
                if (tabelloneNew[i][j] == numeroEstratto.toString()) {
                    tabelloneNew[i][j] = tabelloneNew[i][j] + "X"
                }
            }
            /*if(i == numeroEstratto){
                tabelloneNew[i] = tabelloneNew[i] + "X"
            }*/
        }
        return tabelloneNew
    }

    async componentDidMount() { //parte all' onLoad
        console.log("COMPONENT DID MOUNT")
        console.log(await AsyncStorage.getItem("username"))
        var id = await AsyncStorage.getItem("id")
        this.props.navigation.setOptions({ title: 'Stanza-' + id })
        console.log(id)

        socket.on("partitaIniziata", () => {
            this.setState({ partitaIniziata: true })
            socket.on("numeroEstratto", (numeroEstratto) => {
                var arrayNumeri = this.state.listaNumeri //creo array per fare il tabellone
                arrayNumeri.push(numeroEstratto)
                var newTabellone = this.updateTabellone(numeroEstratto)
                this.setState({ tabellone: newTabellone })
                this.setState({ numero: numeroEstratto })
                this.setState({ listaNumeri: arrayNumeri })
            })
            socket.on("terno", () =>{
                this.setState({ statoBottoneTerno: !this.state.statoBottoneTerno });
            })
            socket.on("cinquina", () =>{
                this.setState({ statoBottoneCinquina: !this.state.statoBottoneCinquina });
            })
            socket.on("tombola", () =>{
                this.setState({ statoBottoneTombola: !this.state.statoBottoneTombola });
            })
        })

        socket.on("listaUtenti", (players) => {
            //this.setState({numero: numeroEstratto})
            console.log("Nuovi players")
            console.log(players)
            var newArray = players
            this.setState({ listaGiocatori: newArray })
        })
    }

    generaCarta = () => {
        //console.log(await AsyncStorage.getItem("username"))
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

        for (var i = 0; i < card.length; i++) {
            for (var j = 0; j < card[0].length; j++) {
                card[i][j] = card[i][j].toString()
            }
        }
        return card;
    }

    disabilitaBottoneTerno = async() => {
        console.log('bottone terno cliccato')
        for (var i=0; i < this.state.tabelle.length; i++) {
            console.log('tabella')
            var tabella = this.state.tabelle[i]
            for (var r=0; r < tabella.length; r++) { //ciclo riga
                console.log('riga')
                var contatoreCelle = 0;
                for (var c=0; c < tabella[r].length; c++) {//ciclo singole celle
                    console.log('cella')
                    
                    if (tabella[r][c].toString().includes("X")) {
                        var indice = this.state.listaNumeri.indexOf(parseInt(tabella[r][c].toString().split('X')[0])) //controllo se numero e uscito
                        console.log(indice)
                       if(indice != -1){
                            //trovato numero nel tabellone
                            contatoreCelle++;
                       }
                       
                    }
                }
                if (contatoreCelle >= 3) {
                    socket.emit('terno',await AsyncStorage.getItem("id"))
                    return
                }
            }
        }
       
    }
    disabilitaBottoneCinquina = async() => {
        for (var i; i < this.state.tabelle.length; i++) {
            var tabella = this.state.tabelle[i]
            for (var r; r < tabella.lengt; r++) { //ciclo riga
                var contatoreCelle = 0;
                for (var c; c < tabella[r].lengt; c++) {//ciclo singole celle
                    var indice = this.state.listaNumeri.indexOf(parseInt(tabella[r][c].toString().split('X')[0])) //controllo se numero e uscito
                    if(indice != -1){
                         //trovato numero nel tabellone
                         contatoreCelle++;
                    }
                }
                if (contatoreCelle >= 5) {
                    socket.emit('cinquina',await AsyncStorage.getItem("id"))
                    console.log('cinquina')
                    return
                }
            }
        }
      
    }
    disabilitaBottoneTombola = async() => {
        for (var i; i < this.state.tabelle.length; i++) {
            var tabella = this.state.tabelle[i]
            var contatoreTotale =0;
            for (var r; r < tabella.lengt; r++) { //ciclo riga
                var contatoreCelle = 0;
                for (var c; c < tabella[r].lengt; c++) {//ciclo singole celle
                    var indice = this.state.listaNumeri.indexOf(parseInt(tabella[r][c].toString().split('X')[0])) //controllo se numero e uscito
                    if(indice != -1){
                         //trovato numero nel tabellone
                         contatoreCelle++;
                    }
                }
                contatoreTotale += contatoreCelle
               
            }
            if (contatoreTotale = 15) {
                socket.emit('tombola',await AsyncStorage.getItem("id"))
                console.log('tombola')
                return
            }
        }
      
    }
    cambiaViewPunteggio = () => {
        var variabile = true;
        this.setState({ statoPartitaFinita: variabile });

    }

    render() {
        const state = this.state;

        const FirstRoute = () => (
            <View style={[styles.containerPartita]}>
                <View>
                    {
                        this.state.partitaIniziata == false ?
                            <Button color="red" title="Inizia partita" onPress={async () => {
                                socket.emit("gameStart", await AsyncStorage.getItem("id"))
                            }}></Button>
                            : <></>
                    }
                    {
                        this.state.listaGiocatori.map((nome) => {
                            return (
                                <Text style={{ marginBottom: '5%' }}>{nome}</Text>
                            )
                        })
                    }
                </View>
                {
                    this.state.tabelle.map((tabella) => {
                        return (
                            <>
                                <Tabella tabella={tabella} />
                                <View style={{ height: 25 }} />
                            </>
                        )
                    })
                }
                <Text style={styles.titleNick}>il numero e: <Text style={styles.numero}>{this.state.numero}</Text></Text>
                <View style={styles.viewBottoniPunteggi}>
                    <Button color="red" title="Terno" disabled={this.state.statoBottoneTerno} onPress={() => this.disabilitaBottoneTerno()} />
                    <Button color="red" title="Cinquina" disabled={this.state.statoBottoneCinquina} onPress={() => this.disabilitaBottoneCinquina()} />
                    <Button color="red" title="Tombola!" disabled={this.state.statoBottoneTombola} onPress={() => this.disabilitaBottoneTombola()} />
                </View>

                <Button color="red" title='Exit Prova' onPress={() => this.cambiaViewPunteggio()}></Button>
            </View>
        );
        /*const SecondRoute = () => (
            <View style={[styles.scene, { backgroundColor: 'yellow' }]} >
                <Text style={styles.titleNick}>il numero e: {this.state.listaNumeri.join(", ")}</Text>
            </View>
        );*/

        const SecondRoute = () => {
            return (
                <View style={styles.containerTabellone}>
                    <Tabellone tabella={this.state.tabellone} />
                    <View style={{ height: 25 }} />
                </View>
            )
        }

        const renderTabBar = (props) => (
            <TabBar
                {...props}
                style={{ backgroundColor: "red" }}
            />
        );
        if (this.state.statoPartitaFinita == false) {
            return (
                <TabView
                    navigationState={this.state}
                    renderScene={SceneMap({
                        first: FirstRoute,
                        second: SecondRoute,
                    })}
                    onIndexChange={index => this.setState({ index })}
                    initialLayout={{ width: Dimensions.get('window').width }}
                    renderTabBar={renderTabBar}

                />

            );
        }
        else { //view fine partita
            return (
                <View style={styles.containerHome} >
                    <Text style={styles.titleHome}>PUNTEGGIO:</Text>
                    <Text style={styles.titleNick}>il vincitore e: </Text>
                    <Button color="red" title='Exit' onPress={() => this.props.navigation.navigate('Home')}></Button>
                    <StatusBar style="auto" />
                </View>
            );
        }
    }
}


const styles = StyleSheet.create({

    containerPartita: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: 'yellow' },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 2, alignItems: 'center' },
    row: { flexDirection: 'row', backgroundColor: 'white' },

    scene: {
        flex: 1,
    },

    numero: {
        //fontSize: '20%',
        fontWeight: 'bold'
    },

    viewBottoniPunteggi: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: '30%',
        marginTop: '10%'
    },

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

    containerTabellone: {
        backgroundColor: 'yellow',
        height: '100%'
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