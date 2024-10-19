import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  ScrollView,
  Dimensions,
  ImageBackground, 
  TouchableOpacity,
  TextInput,
  FlatList,
  AsyncStorage  
} from 'react-native';
import Modal from "react-native-modal";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { HeaderBackButton } from 'react-navigation';
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import Loading from '../../components/Common_Loading/Common_Loading'
import styles from './SavedSearchModalStyle.js';

const HOSTNAME  = 'https://alice.edgeprop.my/api/user/v1/save-search' 

export default class SavedSearchModal extends Component {
  
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
      };
  };

  constructor(props) {
      super(props);
      this.state = {
        name: '' ,
        hasError: false,
        userInfo: {} ,
        hasUpdateError: false,
        success: false,            
      };
      this._onTouch = this._onTouch.bind(this)
      this._submitSaveSearch = this._submitSaveSearch.bind(this)
    }

    _onTouch() {
      if(this.state.name == '') {
        this.setState({ hasError : true })
      } else {
        this.setState({ hasError: false },()=> this._submitSaveSearch())
      }
    }

    _submitSaveSearch() {
      if(this.state.name != '') {
        //console.log("name="+this.state.name+"&params="+this.props.type+'?'+this.props.saveParams+"&apiparams="+encodeURIComponent(this.props.saveParams)+"&uid="+this.state.userInfo.uid+"&key="+this.state.userInfo.accesskey);
        fetch(HOSTNAME, {
            method: 'POST',
            headers: new Headers({
                     'Accept' : 'application/json',
                     'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
            }),
            body: "name="+this.state.name+"&params="+this.props.type+'?'+this.props.saveParams+"&apiparams="+encodeURIComponent(decodeURIComponent(this.props.saveParams))+"&uid="+this.state.userInfo.uid+"&key="+this.state.userInfo.accesskey // <-- Post parameters        })
          }).then((response) => response.json())
          .then((responseText) => {
            //console.log(responseText);
            if(responseText.status == 1) {
              this.setState({ success : true, hasUpdateError : false })
            } 
            if(responseText == 0) {
              this.setState({ success : false, hasUpdateError : true })
            }
          })
          .catch((error) => {
              console.error(error);
          });
      }
    }

    async componentDidMount() {
      
      const auth = await AsyncStorage.getItem("authUser");
      if(auth && auth != '') {
        let authItems = JSON.parse(auth);
        //console.log(authItems)
        if(authItems.status == 1) {
          this.setState({ userInfo: authItems })
        }  
      }

    }

    render() {
      //console.log(this.props);
     return (
          <Modal
              isVisible={true}
              onSwipeComplete={() => this.props.closeModal()}
              onRequestClose={() => this.props.closeModal()}
              transparent={true} >
              <View style={styles.modalContainer}>
                
                 <View style={styles.modal}>
                     <View style={styles.modelHeader}>
                       <View style={styles.modelContent}>
                         <Text allowFontScaling={false} style={styles.headerText}>Save Search</Text>
                         <Text allowFontScaling={false} style={styles.headerTextSecond}>Get email alerts when homes that match your search filters hit the market.</Text>
                       </View>
                        <TouchableOpacity onPress={()=> this.props.closeModal()}>
                          <Image style={{width: 18, height: 18}}
                            source={require('../../assets/icons/close-white-2.png')}
                          />
                        </TouchableOpacity>  
                     </View>
                     <KeyboardAwareScrollView style={{ paddingBottom: 20 }}>
                     <View style={styles.modelBody}>
                       <Text allowFontScaling={false} style={styles.modelBodyText}>We will send an email alert whenever we find a new property matching your search criteria </Text>
                        {this.state.hasUpdateError && (
                          <View style={{ marginBottom: -5, backgroundColor: '#F44336', borderRadius: 3, width: '100%', paddingBottom: 15, paddingTop: 15, marginBottom: 20, paddingLeft: 10 }}>
                              <View style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
                                <Text allowFontScaling={false} style={{ fontSize: 15, fontFamily: 'Poppins-Regular', marginLeft: 5, color: '#fff' }}>Something went wrong! Try Again.</Text>
                              </View>
                          </View>  
                        )}
                        {this.state.success && (
                          <View style={{ backgroundColor: '#4CAF50', borderRadius: 3, width: '100%', paddingBottom: 15, paddingTop: 15, marginTop: 15, marginBottom: 20, paddingLeft: 10 }}>
                              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text allowFontScaling={false} style={{ fontSize: 15, fontFamily: 'Poppins-Regular', marginLeft: 5, color: '#fff' }}>Updated successfully!</Text>
                                {/*<TouchableOpacity onPress={() => this.setState({ success: false, hasUpdateError: false })} >
                                  <Image
                                    style={{ width: 10, height: 10, alignSelf: 'center', marginRight: 10, marginTop: 5 }}
                                    source={require('../../assets/icons/close-white-2.png')}
                                  />
                                </TouchableOpacity> */}
                              </View>
                          </View>  
                        )}
                          <View style={styles.inputButton}>
                            {!this.state.success && (
                              <TextInput
                                allowFontScaling={false}
                                style={styles.textInputCustom}
                                placeholder="Name"
                                placeholderTextColor="#888B8E"
                                onChangeText={(val) => this.setState({name:val})}
                                value={this.state.name}
                              />
                            )}
                        </View>

                       {this.state.hasError &&  (
                          <Text allowFontScaling={false} style={{ fontFamily:'Poppins-Regular', marginTop:5, color:'red', fontSize: 13, alignSelf: 'flex-start' }}>Field can't be empty.</Text>
                        )} 
                        {!this.state.success && (
                        <TouchableOpacity style={styles.button} onPress={this._onTouch}>
                          <Text allowFontScaling={false} style={styles.btnText}>Save Search</Text>
                         </TouchableOpacity>  
                        )}
                        {this.state.success && (
                        <TouchableOpacity style={styles.button} onPress={()=>this.props.closeModal()}>
                          <Text allowFontScaling={false} style={styles.btnText}>Ok</Text>
                         </TouchableOpacity>  
                        )}  
                      </View>
                      </KeyboardAwareScrollView>
                 </View>
              </View>
          </Modal>    
        );
      }
}