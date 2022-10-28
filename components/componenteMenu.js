import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';


export default class Menu extends React.Component {
  constructor(props) { //per passare proprieta did ef acnhe il navigation
    super(props);
    this.state = {
      value: '',
      usernameScelto: false,
      partitaCreata: false,
    }
  }
  onChangeTextHandler = (text) => {
    this.setState({ value: text })
  }
  eseguiBottoneNick = () => {
    this.setState({ usernameScelto: !this.state.usernameScelto })
  }
  eseguiBottonePartita = () => {
    this.setState({ partitaCreata: !this.state.partitaCreata })
  }
  render() {
    if (this.state.usernameScelto == false) {
      return (
        <View style={styles.containerHome}>
          <Text style={styles.titleHome}>TOMBOLA</Text>
          <TextInput value={this.state.value} style={styles.inputNickname} placeholder="scegli nickname" onChangeText={this.onChangeTextHandler}></TextInput>
          <Button color="red" title='Gioca!' onPress={() => this.eseguiBottoneNick()}></Button>
          <StatusBar style="auto" />
        </View>
      );
    }
    else if (this.state.partitaCreata == false) {
      return (
        <View style={styles.containerHome}>
          <Text style={styles.titleNick}>il tuo username e: {this.state.value}</Text>
          <View style={{ position: 'absolute',/*flexDirection: 'row',*/ top: '20%', }}>
            <Button color="red" title='Crea Partita' onPress={() => this.eseguiBottonePartita()}></Button>
          </View>
          <Text style={styles.titleLista}>lista partite attive</Text>
          <Text style={styles.titleLista}>lista partite attive</Text>
          <Text style={styles.titleLista}>lista partite attive</Text>
          <Button color="red" title='Indietro' onPress={() => this.eseguiBottoneNick()}></Button>
        </View>
      );
    }
    else {
      return (

        <View style={styles.containerHome}>
          <Text style={styles.titleHome}>Creazione Partita</Text>

          <View style={{   }}>
            <TextInput value={this.state.value} style={styles.inputNickname} placeholder="Nome Partita Automatico" onChangeText={this.onChangeTextHandler}></TextInput>
          </View>

          <Button color="red" title='Crea' onPress={() => this.props.navigation.navigate('CreaPartita')}></Button>
          <Button color="red" title='Indietro' onPress={() => this.eseguiBottoneNick()}></Button>
          <StatusBar style="auto" />
        </View>

      );
    }
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

