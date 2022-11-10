import Modal from "react-native-modal";
import { StyleSheet, Text, View, TextInput, Button, Pressable, Alert, TouchableHighlight } from 'react-native';
import React, { useState,useEffect } from 'react';

export default class ModalErrore extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            
        }
    }

    render(){
        return (
            <Modal            
            animationType = {"fade"}  
            transparent = {true}  
            visible = {true}  
            onRequestClose = {() =>{ console.log("Modal has been closed.") } }>  
            {/*All views of Modal*/}  
                <View style = {styles.modal}>  
                <Text style = {styles.text}>Errore.. partita già iniziata!</Text>  
                <Button style={{}} title="Ok" onPress = {() => { this.props.disableModal() }} />  
            </View>  
          </Modal>  
          );
    }
}

const styles = StyleSheet.create({  
    container: {  
      flex: 1,  
      alignItems: 'center',  
      justifyContent: 'center',  
      backgroundColor: '#ecf0f1',  
    },  
    modal: {  
    justifyContent: 'center',  
    alignItems: 'center',   
    backgroundColor : "#00BCD4",   
    height: 300 ,  
    width: '80%',  
    borderRadius:10,  
    borderWidth: 1,  
    borderColor: '#fff',    
    marginTop: 80,  
    marginLeft: 40,  
     
     },  
     text: {  
        color: '#3f2949',  
        marginTop: 10  
     }  
  });  
