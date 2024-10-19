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
  AsyncStorage,
  Linking 
} from 'react-native';
import Modal from "react-native-modal";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { HeaderBackButton } from 'react-navigation';
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import Loading from '../../components/Common_Loading/Common_Loading';
import { CheckBox } from 'react-native-elements';
import styles from './PropmallRegisterStyle.js';

const HOSTNAME  = 'https://alice.edgeprop.my/api/vpex/join' 

var emailValidate = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var phoneBasicValidate = /^(?=\d{9,}$)\d{9,10}/;

export default class PropmallRegisterModal extends Component {
  
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
      };
  };

  constructor(props) {
      super(props);
      this.state = {
        name: '' ,
        email: '',
        number: '',
        checked: true,
        hasNameError: false,
        hasPhoneError: false,
        hasEmailError: false,
        userInfo: {} ,
        hasUpdateError: false,
        success: false,
        isLoading: false,
        checkedError: false
      };
      this._submitForm = this._submitForm.bind(this)
      this._directToBrowser = this._directToBrowser.bind(this)
      this._validPhoneNumber = this._validPhoneNumber.bind(this)
      this._submitRequest = this._submitRequest.bind(this)
    }

    _validPhoneNumber(value) {
      if (phoneBasicValidate.test(value)) {
        return false;
      } else {
        return true;
      }
     /* let valStr = value.toString();
      let first  = valStr.charAt(0);
      let len    = valStr.length;
     // Alert.alert(value);
      if((len > 8)&&(len < 13)) {
          if(first != '6'){
           if(first == '0'){
            valStr = '6' + valStr;
            }else if(first == '1'){
              valStr = '60' + valStr;
            }
          }
          var matches = valStr.match(/^601\d{8,9}$/);
          if(matches) {
           return false;
          } else {
            return true
          }
       }else{
        return true
       }*/
    }

    _directToBrowser(type) {
        if(type == 'terms') {
          url = "https://www.edgeprop.my/terms-and-conditions";
        }else if(type == 'privacy') {
          url = "https://www.edgeprop.my/privacy-policy";
        }
        
        if (url.length > 0) {
            Linking.canOpenURL(url).then(supported => {
                if (!supported) {
                    console.log('Can\'t handle url: ' + url);
                } else {
                    return Linking.openURL(url);
                }
            }).catch(err => console.error('An error occurred', err));
        }
    }

     _submitForm() {
      let nameError = phoneError = emailError = checkedError = false;
      if(this.state.name.trim() == '' || this.state.name.length < 3) {
          nameError = true;
      } else {
          nameError = false;
      }
      
      if(this.state.number.trim() == '' || isNaN(this.state.number)) {
        phoneError = true;
      } else {
        phoneError = this._validPhoneNumber(this.state.number);
      }

      if(this.state.checked) {
        checkedError = false
      } else {
        checkedError = true
      }
      

      if(this.state.email.trim() == '' || this.state.email) {
        let isValid = emailValidate.test(this.state.email) 
        if(isValid){
          emailError = false;
        } else {
          emailError = true;
        }
        
      } else {
        emailError = false;
      }

      this.setState({ 
          hasNameError  : nameError,
          hasPhoneError : phoneError,
          hasEmailError : emailError,
          checkedError  : checkedError
        }, 
        () => this._submitRequest(),
      )
     }
     _submitRequest() {
    // console.log(this.state)
      if(!this.state.hasEmailError && !this.state.hasPhoneError && !this.state.hasNameError && !this.state.checkedError) {
        this.setState({ isLoading: true })
        fetch(HOSTNAME, {
        method: 'POST',
        headers: new Headers({
                   'Accept' : 'application/json',
                   'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
          }),
        body: "fullname="+this.state.name+"&number="+this.state.number+"&email="+this.state.email+"&agent_id="+this.props.agentData.uid+"&mid="+this.props.mid+"&nid="+this.state.nid+"&propmall=true" // <-- Post parameters
        })
        .then((response) => response.json())
        .then((responseText) => {
            //console.log(responseText);
            if(responseText.status == 1) {
              this.setState({ 
                success: true, 
                hasRequestError: false,
                name: '',
                email: '',
                number: '',
                checked: true,
                isLoading: false,
                })
            } else {
              this.setState({ success: false, hasRequestError: true, isLoading: false })
            }
        })
        .catch((error) => {
            console.error(error);
        });
        
      }
    }

    render() {
     // console.log(this.props);

     return (
          <Modal
              isVisible={true}
              onSwipeComplete={() => this.props.closeModal()}
              onRequestClose={() => this.props.closeModal()}
              transparent={true} >
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity style={styles.closeModalBtn} onPress={()=> this.props.closeModal()}>
                    <Image style={{width: 18, height: 18}}
                      source={require('../../assets/icons/close-white-2.png')}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.modal}>
                  <KeyboardAwareScrollView style={{ paddingBottom: 20 }}>
                    <View style={styles.interestSection}>
                      <View style={styles.interestHeader}>
                        <Text allowFontScaling={false} style={styles.interestTitle}>Interested on this project?</Text>
                        <Text allowFontScaling={false} style={styles.interestDesc}>Drop us your details and we will send you the complete project description!</Text>
                      </View>
                      {this.state.hasRequestError && (
                        <View style={{ backgroundColor: '#F44336', borderRadius: 3, width: '100%', paddingBottom: 15, paddingTop: 15, marginBottom: 20, paddingLeft: 10 }}>
                              <View style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
                                <Text allowFontScaling={false} style={{ fontSize: 15, fontFamily: 'Poppins-Regular', marginLeft: 5, marginTop: 10,  alignSelf: 'center', color: '#fff' }}>Something went wrong. Try again!</Text>
                              </View>
                          </View>  
                        )}
                        {this.state.success && (
                          <View style={{ backgroundColor: '#4CAF50', borderRadius: 3, width: '100%', paddingBottom: 15, paddingTop: 15, marginBottom: 20, paddingLeft: 10 }}>
                              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text allowFontScaling={false} style={{ fontSize: 15, fontFamily: 'Poppins-Regular', marginLeft: 5, marginTop: 10,  alignSelf: 'center', color: '#fff' }}>Thank you!</Text>
                                <TouchableOpacity onPress={() => this.setState({ success: false, hasUpdateError: false })} >
                                  <Image
                                    style={{ width: 10, height: 10, alignSelf: 'center', marginRight: 10, marginTop: 5 }}
                                    source={require('../../assets/icons/close-white-2.png')}
                                  />
                                </TouchableOpacity>
                              </View>
                          </View>  
                        )}
                      <View style={styles.interestBody}>
                      {this.state.isLoading && (
                          <View style={{ backgroundColor: '#FA477B' }}>
                          <Loading />
                          </View>
                        )}
                        <View style={styles.inputContainer}>
                          <Text allowFontScaling={false} style={styles.inputLabel}>FULL NAME</Text>
                          <TextInput style={styles.input}
                          allowFontScaling={false}
                           underlineColorAndroid = "transparent"
                           placeholder = "Please type here"
                           placeholderTextColor = "#8C96A8"
                           autoCapitalize = "none"
                           value={this.state.name}
                           onChangeText={(name) => this.setState({name: name.trim()})}
                           />
                           {this.state.hasNameError &&  (
                            <Text allowFontScaling={false} style={{ fontFamily:'Poppins-Regular', color:'#FFF', fontSize: 12, alignSelf: 'flex-start' }}>Invalid Name</Text>
                          )}
                        </View>
                        <View style={styles.inputContainer}>
                          <Text allowFontScaling={false} style={styles.inputLabel}>EMAIL</Text>
                          <TextInput style={styles.input}
                          allowFontScaling={false}
                           underlineColorAndroid = "transparent"
                           placeholder = "Please type here"
                           placeholderTextColor = "#8C96A8"
                           autoCapitalize = "none"
                           value={this.state.email}
                           onChangeText={(email) => this.setState({email: email.trim()})}
                           />
                           {this.state.hasEmailError &&  (
                              <Text allowFontScaling={false} style={{ fontFamily:'Poppins-Regular', color:'#FFF', fontSize: 12, alignSelf: 'flex-start' }}>Invalid Email</Text>
                            )}
                        </View>
                        <View style={styles.inputContainer}>
                          <Text allowFontScaling={false} style={styles.inputLabel}>PHONE NUMBER</Text>
                          <TextInput style={styles.input}
                          allowFontScaling={false}
                           underlineColorAndroid = "transparent"
                           placeholder = "Please type here"
                           placeholderTextColor = "#8C96A8"
                           autoCapitalize = "none"
                           value={this.state.number}
                           onChangeText={(number) => this.setState({number: number.trim()})}
                           />
                          {this.state.hasPhoneError &&  (
                            <Text allowFontScaling={false} style={{ fontFamily:'Poppins-Regular', color:'#FFF', fontSize: 12, alignSelf: 'flex-start' }}>Invalid Phone number</Text>
                          )}
                        </View>
                        <View style={styles.checkBoxWrapper}>
                         <CheckBox
                            size={17}
                            title=''
                            checked={this.state.checked}
                            onPress={() => this.setState({checked: !this.state.checked})}
                            uncheckedColor='#fff'
                            checkedColor='#462B5A'
                            containerStyle={{ marginVertical: 15, paddingHorizontal: 2, paddingVertical: 0, width:20, backgroundColor: '#fff', borderRadius: 3 }}
                          />
                          <View style={styles.propcheckDesc}>
                            <Text allowFontScaling={false} style={styles.propcheckText}>I have read and agreed to the</Text>
                            <TouchableOpacity onPress={() => this._directToBrowser('terms')} style={styles.propcheckLink}><Text allowFontScaling={false}>Terms and Conditions</Text></TouchableOpacity>
                            <Text allowFontScaling={false} style={styles.propcheckText}>and</Text>
                            <TouchableOpacity onPress={() => this._directToBrowser('privacy')} style={styles.propcheckLink}><Text allowFontScaling={false}>PDPA Notice.</Text></TouchableOpacity>
                          </View>
                        </View>
                        {this.state.checkedError &&  (
                            <Text allowFontScaling={false} style={{ fontFamily:'Poppins-Regular', color:'#FFF', fontSize: 12, alignSelf: 'flex-start' }}>Please agree to the terms and conditions</Text>
                          )}
                        <View style={styles.formButtonContainer}>
                          <TouchableOpacity onPress={this._submitForm} style={styles.formButton}><Text allowFontScaling={false} style={styles.formButtonText}>Send</Text></TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </KeyboardAwareScrollView>
                </View>
              </View>
          </Modal>    
        );
      }
}