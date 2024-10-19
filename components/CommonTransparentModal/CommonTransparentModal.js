import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    TextInput,
    Text,
    View,
    Image,
    TouchableHighlight,
    Alert,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Modal,
    ActivityIndicator
} from 'react-native'

class CommonTransparentModal extends Component {

    constructor(props) {
      super(props);
      this.state = {
        modalVisible: false
      }
      this._toggleMenu = this._toggleMenu.bind(this)
    }

    shouldComponentUpdate(nextState,nextProps){
        return(JSON.stringify(nextState)!==JSON.stringify(this.state))
    }
    _toggleMenu(){
        this.setState({
           modalVisible: this.state.modalVisible ? false : true,
        });
    }

    render() {
        return(
            <Modal animationType = {"fade"} transparent = {true}
                   visible = {this.state.modalVisible}
                   onRequestClose = {() => {
                    //  console.log("Modal has been closed.")
                   } }>
                   <View style={{display:'flex',position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor:'#fff', opacity:0.5 }}>
                       <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                           <ActivityIndicator
                             animating size='large'
                             style={{
                               height: 80
                             }}
                           />
                       </View>
                   </View>
                </Modal>
        )
    }
}
export default CommonTransparentModal
