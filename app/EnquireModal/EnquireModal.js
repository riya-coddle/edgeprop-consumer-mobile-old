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
import { HeaderBackButton } from 'react-navigation';
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import Loading from '../../components/Common_Loading/Common_Loading'
import styles from './EnquireModalStyle.js';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { CheckBox } from 'react-native-elements'

const HOSTNAME  = 'https://www.edgeprop.my/jwdmapi/contact-this-agent' 
const BOOKMARK_API = 'https://alice.edgeprop.my/api/user/v1/shortlist';
var phoneBasicValidate = /^(?=\d{9,}$)\d{9,10}/;
var emailValidate = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default class EnquireModal extends Component {
  
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
      };
  };

  constructor(props) {
      super(props);
      this.state = {
        name: this.props.userInfo.name != 'Anonymous User' ? this.props.userInfo.name : '',
        email: this.props.userInfo.email ? this.props.userInfo.email : '',
        msg: '',
        phone: this.props.userInfo.phone ? this.props.userInfo.phone : '',
        checked: false,
        userInfo: {},
        hasEmailError: false,
        hasNameError: false,
        hasPhoneError: false,
        hasRequestError: false,
        success: false,
        isLoading: false,       
      };
      this._onContactAgent = this._onContactAgent.bind(this)
      this._submitRequest  = this._submitRequest.bind(this)
    }

    _validPhoneNumber(value) {
      if (phoneBasicValidate.test(value)) {
        return false;
      } else {
        return true;
      }
      /*let valStr = value.toString();
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

    async componentDidMount() {
      const auth = await AsyncStorage.getItem("authUser");
      if(auth && auth != '') {
        let authItems = JSON.parse(auth);
        console.log("authItems",authItems);
        if(authItems.status == 1) {
          this.setState({ userInfo: authItems })
        }  
      }
    }

    _onContactAgent() {
      let nameError = phoneError = emailError = false;
      if(this.state.name.trim() == '') {
          nameError = true;
      } else {
          nameError = false;
      }
      
      if(this.state.phone.trim() == '' || isNaN(this.state.phone)) {
        phoneError = true;
      } else {
        phoneError = this._validPhoneNumber(this.state.phone);
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
          hasEmailError : emailError
        }, 
        () => this._submitRequest(),
      )
    }

    _submitRequest() {
      if(!this.state.hasEmailError && !this.state.hasPhoneError && !this.state.hasNameError) {
        this.setState({ isLoading: true })
      //  console.log(this.props.checkedValues[0]);   
        
        let lid = '' 
        for (var i = 0; i< this.props.checkedValues.length; i++) {
          lid+= "lid["+i+"][id]="+this.props.checkedValues[i]+"&lid["+i+"][type]=n&";
        }
        console.log(lid);   
        console.log(lid+"url=/buy&name="+this.state.name+"&phone="+this.state.phone+"&user_email="+this.state.email+"&message="+this.state.msg+"&l_type=sale&origin=list")         
       // Alert.alert(lid.toString())                                                                                                                                                                                                                                                
        fetch(HOSTNAME, {
        method: 'POST',
        headers: new Headers({
                   'Accept' : 'application/json',
                   'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
          }),
        body: lid+"&url=/buy&name="+this.state.name+"&phone="+this.state.phone+"&user_email="+this.state.email+"&message="+this.state.msg+"&l_type="+this.state.type+"&origin=mobile" // <-- Post parameters
        })
        .then((response) => response.json())
        .then((responseText) => {
            console.log(responseText);
            if(responseText.status == 1) {
              this.setState({ 
                success: true, 
                hasRequestError: false,
                name: '',
                email: '',
                msg: '',
                phone: '',
                checked: false,
                isLoading: false,
                })
            } else {
              this.setState({ success: false, hasRequestError: true })
            }
        })
        .catch((error) => {
            console.error(error);
        });
        
      }
    }

    render() {
      return (
          <Modal
              isVisible={true}
              onSwipeComplete={() => this.props.closeModal()}
              onRequestClose={() => this.props.closeModal()}
              transparent={true} >
              <View style={styles.modalContainer}>
                 <View style={styles.modal}>
                    <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'}>
                    <View style={styles.modelHeader}>
                     <Text allowFontScaling={false} style={styles.headerText}>Contact Agent</Text>
                      <TouchableOpacity onPress={()=> this.props.closeModal()}>
                        <Image style={{width: 18, height: 18}}
                          source={require('../../assets/icons/close-white-2.png')}
                        />
                      </TouchableOpacity>  
                     </View>
                      <View style={{padding: 20 }}>
                        {this.state.hasRequestError && (
                          <View style={{ backgroundColor: '#F44336', borderRadius: 3, width: '100%', paddingBottom: 15, paddingTop: 15, marginBottom: 20, paddingLeft: 10 }}>
                                <View style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
                                  <Text allowFontScaling={false}  style={{ fontSize: 15, fontFamily: 'Poppins-Regular', marginLeft: 5, color: '#fff' }}>Something went wrong. Try again!</Text>
                                </View>
                            </View>  
                          )}
                          {this.state.isLoading && (
                            <Loading />
                          )}
                          {this.state.success && (
                            <View style={{ backgroundColor: '#4CAF50', borderRadius: 3, width: '100%', paddingBottom: 15, paddingTop: 15, marginBottom: 20, paddingLeft: 10 }}>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                  <Text allowFontScaling={false} style={{ fontSize: 15, fontFamily: 'Poppins-Regular', marginLeft: 5, color: '#fff' }}>Thank you!</Text>
                                  <TouchableOpacity onPress={() => this.setState({ success: false, hasUpdateError: false })} >
                                    <Image
                                      style={{ width: 10, height: 10, alignSelf: 'center', marginRight: 10, marginTop: 5 }}
                                      source={require('../../assets/icons/close-white-2.png')}
                                    />
                                  </TouchableOpacity>
                                </View>
                            </View>  
                          )}                      
                         <View>
                          <TextInput style={styles.input}
                            allowFontScaling={false} 
                             underlineColorAndroid = "transparent"
                             placeholder = "Name"
                             value={this.state.name}
                             placeholderTextColor = "#414141"
                             autoCapitalize = "none"
                             onChangeText={(name) => this.setState({name: name.trim()})}
                          />
                          {this.state.hasNameError &&  (
                            <Text allowFontScaling={false} style={{ fontFamily:'Poppins-Regular', color:'red', fontSize: 12, alignSelf: 'flex-start' }}>Invalid Name</Text>
                          )}
                        </View>
                        <View>
                          <TextInput style={styles.input}
                          allowFontScaling={false} 
                           underlineColorAndroid = "transparent"
                           placeholder = "Mobile Number"
                           value={this.state.phone}
                           placeholderTextColor = "#414141"
                           autoCapitalize = "none"
                           onChangeText={(phone) => this.setState({phone: phone.trim()})}
                          />
                          {this.state.hasPhoneError &&  (
                            <Text allowFontScaling={false} style={{ fontFamily:'Poppins-Regular', color:'red', fontSize: 12, alignSelf: 'flex-start' }}>Invalid Phone number</Text>
                          )}
                        </View>
                        <View>
                           <TextInput style={styles.input}
                           allowFontScaling={false} 
                           underlineColorAndroid = "transparent"
                           placeholder = "Email"
                           value={this.state.email}
                           placeholderTextColor = "#414141"
                           autoCapitalize = "none"
                           onChangeText={(email) => this.setState({email: email.trim()})}
                           />
                           {this.state.hasEmailError &&  (
                              <Text allowFontScaling={false} style={{ fontFamily:'Poppins-Regular', color:'red', fontSize: 12, alignSelf: 'flex-start' }}>Invalid Email</Text>
                            )}
                        </View>
                        <View>
                           <TextInput style={styles.inputLarge}
                           allowFontScaling={false} 
                           underlineColorAndroid = "transparent"
                           placeholder = "Message"
                           value={this.state.msg}
                           placeholderTextColor = "#414141"
                           multiline = {true}
                           autoCapitalize = "none"
                           onChangeText={(msg) => this.setState({msg: msg.trim()})}
                           />
                        </View>
                        <View style={styles.checkboxSection}>
                           <CheckBox
                              checked={this.state.checked}
                              checkedColor='#488BF8'
                              onPress={() => this.setState({ checked: !this.state.checked })}
                              containerStyle={{paddingRight: 0, justifyContent: 'center', width:30, paddingTop:0, paddingBottom: 0, paddingLeft:5, backgroundColor: '#fff', borderRadius: 0, borderWidth:0, borderColor: '#fff' }}    
                            />
                          <View>
                            <Text allowFontScaling={false} style={styles.checkboxText}>Yes, keep me posted on new launches, property digest and partner affairs</Text>
                          </View>
                        </View>
                          <TouchableOpacity onPress={this._onContactAgent}> 
                              <View style={styles.buttonOne}>
                                  <Text allowFontScaling={false} style={styles.buttonText}>
                                    I'm Interested
                                  </Text>
                              </View>
                          </TouchableOpacity>
                        </View>
                    </KeyboardAwareScrollView>
                  </View>
              </View>
          </Modal>    
        );
      }
}