import { StatusBar } from 'expo-status-bar';
import React, { useState,useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Pressable, Alert, TouchableHighlight } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import AsyncStorage from "@react-native-async-storage/async-storage";
import socket from "../utils/socket"
import ModalErrore from './modalErrore';
import { timingSafeEqual } from 'crypto';

export default class Menu extends React.Component {
  constructor(props) { //per passare proprieta did ef acnhe il navigation
    super(props);
    console.log("MENU init")
    console.log(props)
    this.getData();
    this.state = {
      usernameScelto: false,
      partitaCreata: false,
      username: '',
      stanze: null,
      errorePartita: false
    }
  }
  
  componentWillUnmount(){

  }

  componentDidMount(){
    socket.on("roomsList",(rooms) => {
      this.setState({stanze: rooms})
      console.log("Nuove partite")
      console.log(rooms)
    })
	}

  makeRequest = () => {
    const fetchGroups = () => {
			fetch("http://192.168.1.128:4000/api") // err 404 faild to fetch
				.then((res) => res.json())
				.then((data) => {
          console.log("Stanze")
          console.log(data)
          this.setState({stanze: data})
        })
				.catch((err) => console.error(err));
		}
		fetchGroups();
  }

  getData = async () => { //per leggere i dati salvati
    try {
      const chiave = await AsyncStorage.getItem('token')
      const username = await AsyncStorage.getItem('username');
      if(chiave !== null){
        this.setState({token: chiave})
      }
      if(username !== null){
        this.setState({username})
      }
    } catch (e) {
      Alert.alert("Error! While saving username");
    }
  }

  removeValue = async () => {  //per eliminare i dati es se uno si slogga
    try {
      
      AsyncStorage.removeItem('token', 'abc123')
    }
    catch (e) {
      
    }
    console.log('rimosso dato')
  }

  onChangeTextHandler = (text) => {
    this.setState({ username: text });
    console.log(this.state.username)
  }

  eseguiBottoneNick = async() => {
    try {
      //METTERE VALUE UGUALE USERNAME
      await AsyncStorage.setItem('username', this.state.username)
    }
    catch (err) {
      console.log(err)
    }
    
    this.setState({ usernameScelto: !this.state.usernameScelto });
    if (this.state.username == null) {
      Alert.alert("Username is required.");
    } else {
      //salvare nel server user
    }

    this.makeRequest()
    setInterval(this.makeRequest, 5000)

    //socket.emit("newMessage", {});
  }

  eseguiBottonePartita = () => {
    //this.setState({ partitaCreata: !this.state.partitaCreata })
    socket.emit("createRoom","Stanza")
  }

  enterRoom = async(id) => {
    socket.emit("enterRoom",{id: id, username: this.state.username})
    socket.on("roomEntered",async (idRoom) => {
      console.log("Accesso alla stanza completato")
      console.log(idRoom)
      await AsyncStorage.setItem("id",idRoom)
      this.props.navigation.navigate("Partita")
    })

    socket.on("erroreEnterRoom",() => {
      this.setState({errorePartita: true})
    })
  }

  disableModal = () => {
    this.setState({errorePartita: false})
  }

  render() {
    console.log("RENDER HOME")
    if (this.state.usernameScelto == false) {
      return (
        <View style={styles.containerHome} >
          <Text style={styles.titleHome}>TOMBOLA</Text>
          <TextInput username={this.state.username} style={styles.inputNickname} placeholder="scegli nickname" onChangeText={this.onChangeTextHandler}></TextInput>
          <Button color="#373F51" title='Gioca!' onPress={() => this.eseguiBottoneNick()}></Button>
          <StatusBar style="auto" />
        </View>
      );
    }
    else if (this.state.partitaCreata == false) {
      return (
        <View style={styles.containerHome}>
          <Text style={styles.titleNick}>il tuo username e: {this.state.username}</Text>
          <View style={{ position: 'absolute',/*flexDirection: 'row',*/ top: '20%', }}>
            <Button color="red" title='Crea Partita' onPress={() => this.eseguiBottonePartita()}></Button>
          </View>
          {
            this.state.errorePartita ? <ModalErrore disableModal={this.disableModal}/> : <></>
          }
          {
            this.state.stanze != null ? 
              this.state.stanze.map((stanza) => {
                return (
                  <TouchableHighlight onPress={() => this.enterRoom(stanza.id)}>
                    <View>
                      <Text>{stanza.name}-{stanza.id}</Text>
                    </View>
                  </TouchableHighlight>
                )
              })
            : console.log("Caricamento in corso")
          }
          <Button color="red" title='Indietro' onPress={() => this.eseguiBottoneNick()}></Button>
        </View>
      );
    }else{
      <></>
    }
  }
}


const styles = StyleSheet.create({
  containerHome: {
    flex: 1,
    backgroundColor: '#58A4B0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleHome: {
    color: 'red',
    fontSize: '40%',
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
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
  titleNick: {
    position: 'absolute',
    color: 'red',
    fontSize: '20%',
    fontWeight: 'bold',
    alignItems: 'center',
    top: '10%',
  },
  titleLista: {
    color: 'black',
    fontSize: '20%',
  },
  /*style={{padding: 50}}*/
});

