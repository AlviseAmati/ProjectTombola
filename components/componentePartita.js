import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Button, TouchableOpacity, Alert, TouchableHighlight, useWindowDimensions, Dimensions, TouchableHighlightBase } from 'react-native';
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
            listaGiocatoriRisultati: ["","",""],
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
            ],
            messaggi: []
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
        //console.log(arr)
        return arr
    }

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
        }
        return tabelloneNew
    }

    async componentDidMount() { //parte all' onLoad
        //console.log("COMPONENT DID MOUNT")
        //console.log(await AsyncStorage.getItem("username"))
        var id = await AsyncStorage.getItem("id")
        this.props.navigation.setOptions({ title: 'Stanza-' + id })
        //console.log(id)

        socket.on("partitaIniziata", () => {
            this.setState({ partitaIniziata: true })
            this.aggiungiMessaggio("Partita iniziata")

            socket.on("numeroEstratto", (numeroEstratto) => {
                var arrayNumeri = this.state.listaNumeri //creo array per fare il tabellone
                arrayNumeri.push(numeroEstratto)
                var newTabellone = this.updateTabellone(numeroEstratto)
                this.setState({ tabellone: newTabellone })
                this.setState({ numero: numeroEstratto })
                this.setState({ listaNumeri: arrayNumeri })
            })

            socket.on("ternoFatto", ({id,username}) => {
                this.setState({ statoBottoneTerno: !this.state.statoBottoneTerno });
                var copyArrRes = this.state.listaGiocatoriRisultati
                copyArrRes[0] = username 

                if(id == socket.id){
                    this.aggiungiMessaggio(`Hai fatto terno!`)
                }else{
                    this.aggiungiMessaggio(`Il giocatore ${username} ha fatto terno!`)
                }

                this.setState({ listaGiocatoriRisultati: copyArrRes})
            })

            socket.on("cinquinaFatta", ({id,username}) => {
                this.setState({ statoBottoneCinquina: !this.state.statoBottoneCinquina });
                var copyArrRes = this.state.listaGiocatoriRisultati
                copyArrRes[1] = username 

                if(id == socket.id){
                    this.aggiungiMessaggio(`Hai fatto cinquina!`)
                }else{
                    this.aggiungiMessaggio(`Il giocatore ${username} ha fatto cinquina!`)
                }
                
                this.setState({ listaGiocatoriRisultati: copyArrRes})
            })

            socket.on("tombolaFatta", ({id,username}) => {
                console.log("Tombola registrata")
                this.setState({ statoBottoneTombola: !this.state.statoBottoneTombola });
                var copyArrRes = this.state.listaGiocatoriRisultati
                copyArrRes[2] = username 

                if(id == socket.id){
                    this.aggiungiMessaggio(`Hai fatto tombola!`)
                }else{
                    this.aggiungiMessaggio(`Il giocatore ${username} ha fatto tombola!`)
                }

                this.setState({ listaGiocatoriRisultati: copyArrRes})
                this.setState({ statoPartitaFinita: true}) //fa vedere menu fine parta
            })

            socket.on("partitaFinita", () => {
                this.setState({ statoPartitaFinita: true})
            })
        })

        socket.on("playerUscito",({id, username}) => {
            console.log("Player uscito")
            if(id == socket.id){
                this.props.navigation.navigate("Home")
            }else{
                this.aggiungiMessaggio(`Il giocatore ${username} è uscito dalla partita :(`)
            }
        })

        socket.on("nuovoPlayerEntrato", (giocatore) => {
            var copy = this.state.listaGiocatori
            copy.push(giocatore)
            
            var msg = `Il giocatore ${giocatore} è entrato!`
            this.aggiungiMessaggio(msg)
            this.setState({listaGiocatori: copy})
        })
    }

    aggiungiMessaggio = (text) => {
        var copy = this.state.messaggi
        copy.push(text)
        this.setState({messaggi: copy})
    }

    esciDallaPartita = () => {
        socket.emit("exitRoom")
        
    }

    generaCarta = () => {
        //riempe tabella tutta di num casuali con il range di quella riga in base colona poi li buca rimuovendoli e per sapere chi clicchi mete x
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

    provaTerno = async() => {
        console.log('bottone terno cliccato')
        for (var i=0; i < this.state.tabelle.length; i++) {
            //console.log('tabella')
            var tabella = this.state.tabelle[i]
            for (var r=0; r < tabella.length; r++) { //ciclo riga
                //console.log('riga')
                var contatoreCelle = 0;
                for (var c=0; c < tabella[r].length; c++) {//ciclo singole celle
                    //console.log('cella')
                    
                    if (tabella[r][c].toString().includes("X")) {
                        var indice = this.state.listaNumeri.indexOf(parseInt(tabella[r][c].toString().split('X')[0])) //controllo se numero e uscito
                        //console.log(indice)
                       if(indice != -1){
                        contatoreCelle++;
                       }
                    }
                }
                if (contatoreCelle >= 3) {
                    console.log("terno")
                    socket.emit('terno')
                    return
                }
            }
        }
    }

    provaCinquina = async() => {
        console.log('bottone cinquina cliccato')
        for (var i=0; i < this.state.tabelle.length; i++) {
            //console.log('tabella')
            var tabella = this.state.tabelle[i]
            for (var r=0; r < tabella.length; r++) { //ciclo riga
                //console.log('riga')
                var contatoreCelle = 0;
                for (var c=0; c < tabella[r].length; c++) {//ciclo singole celle
                    //console.log('cella')
                    
                    if (tabella[r][c].toString().includes("X")) {
                        var indice = this.state.listaNumeri.indexOf(parseInt(tabella[r][c].toString().split('X')[0])) //controllo se numero e uscito
                        //console.log(indice)
                        if(indice != -1){
                            contatoreCelle++;
                        }
                       
                    }
                }
                if (contatoreCelle == 5) {
                    //console.log("cinquina")
                    socket.emit('cinquina')
                    return
                }
            }
        }
      
    }

    provaTombola = async() => {
        console.log('bottone tombola cliccato')
        for (var i=0; i < this.state.tabelle.length; i++) {
            //console.log('tabella')
            var tabella = this.state.tabelle[i]
            var contatoreTotale = 0
            for (var r=0; r < tabella.length; r++) { //ciclo riga
                //console.log('riga')
                var contatoreCelle = 0;
                for (var c=0; c < tabella[r].length; c++) {//ciclo singole celle
                    //console.log('cella')
                    
                    if (tabella[r][c].toString().includes("X")) {
                        var indice = this.state.listaNumeri.indexOf(parseInt(tabella[r][c].toString().split('X')[0])) //controllo se numero e uscito
                        //console.log(indice)
                        if(indice != -1){
                            contatoreCelle++;
                            contatoreTotale++;
                        }
                    }
                }
            }
            if (contatoreTotale == 15) {
                console.log("tombola")
                socket.emit('tombola')
                return
            }
        }
    }

    render() {
        const state = this.state;

        const FirstRoute = () => (
            <View style={[styles.containerPartita]}>
                <View style={styles.buttonIniziaPartita}>
                    {
                        this.state.partitaIniziata == false ?
                            <Button style={styles.buttonIniziaPartita} color="#0E5E6F" title="Inizia partita" onPress={async () => {
                                socket.emit("gameStart", await AsyncStorage.getItem("id"))
                            }}></Button>
                            : <></>
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
                <Text style={styles.divNumero}>E' uscito il numero: </Text>
                <Text style={styles.numero}>{this.state.numero}</Text>
                <View style={styles.viewBottoniPunteggi}>
                    <Button color="#0E5E6F" title="Terno" disabled={this.state.statoBottoneTerno} onPress={() => this.provaTerno()} />
                    <Button color="#0E5E6F" title="Cinquina" disabled={this.state.statoBottoneCinquina} onPress={() => this.provaCinquina()} />
                    <Button color="#0E5E6F" title="Tombola!" disabled={this.state.statoBottoneTombola} onPress={() => this.provaTombola()} />
                </View>
                <ScrollView style={styles.viewLog}>
                    {
                        this.state.messaggi.map((mess) => {
                            return (
                                <Text style={{ color:"#f7fcfc" }}>{mess}</Text>
                            )
                        })
                    }
                </ScrollView>
                <Button color="#0E5E6F" title='Exit' onPress={() => this.esciDallaPartita()}></Button>
            </View>
        );

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
                style={{ backgroundColor: "#0E5E6F" }}
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
                    <Text style={styles.titleNick}>Il giocatore {this.state.listaGiocatoriRisultati[2]} ha fatto TERNO</Text>
                    <Text style={styles.titleNick}>Il giocatore {this.state.listaGiocatoriRisultati[1]} ha fatto CINQUINA</Text>
                    <Text style={styles.titleNick}>Il giocatore {this.state.listaGiocatoriRisultati[0]} ha fatto TOMBOLA</Text>
                    <Text style={styles.titleNick}>Il giocatore {this.state.listaGiocatoriRisultati[0]} ha VINTO</Text>

                    <Button color="#0E5E6F" title='Exit' onPress={() => this.props.navigation.navigate('Home')}></Button>
                    <StatusBar style="auto" />
                </View>
            );
        }
    }
}


const styles = StyleSheet.create({

    containerPartita: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#F2DEBA' },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 2, alignItems: 'center' },
    row: { flexDirection: 'row', backgroundColor: 'white' },

    scene: {
        flex: 1,
    },

    divNumero:{
        textAlign: 'center'
    },  

    numero: {
        //fontSize: '20%',
        fontWeight: 'bold',
        textAlign: 'center'
    },

    buttonIniziaPartita: {
        borderRadius: 5,
        marginBottom: 20
    },

    viewBottoniPunteggi: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '10%'
    },

    viewLog: {
        backgroundColor: "#427580",
        paddingTop: 10,
        paddingLeft: 10,
        height: 100,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 5
    },

    tablePartita: {
        backgroundColor: 'white',
        width: '80%',
        marginTop: '5%',
    },

    containerHome: {
        flex: 1,
        backgroundColor: '#F2DEBA',
        alignItems: 'center',
        justifyContent: 'center',
    },

    containerTabellone: {
        backgroundColor: '#F2DEBA',
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