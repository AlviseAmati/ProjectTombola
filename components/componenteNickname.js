import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';


export default class Nickname extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    }
  }
  onChangeTextHandler = (text) => {
    this.setState({ value: text })
  }
  eseguiBottone = () => {

  }
  render() {
    return (
      <View style={styles.containerHome}>
        <Text style={styles.titleHome}>TOMBOLA</Text>
        <TextInput value={this.state.value} style={styles.inputNickname} placeholder="scegli nickname" onChangeText={this.onChangeTextHandler}></TextInput>
        <Button color="red" title='Gioca!' onPress={() => this.props.navigation.navigate('Menu')}></Button>
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
  /*style={{padding: 50}}*/
});

