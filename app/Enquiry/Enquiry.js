import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  Dimensions,
  ScrollView,
  Linking,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Image,
  AsyncStorage
} from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import firebase from 'react-native-firebase';
import appsFlyer from 'react-native-appsflyer';
import Button from '../../components/Common_Button/Common_Button.js'
import AvatarIcon from '../../components/Common_AvatarIcon/Common_AvatarIcon'
import IconMenu from '../../components/Common_IconMenu/Common_IconMenu'
import StatusBarBackground from '../../components/Common_iOSStatusBar/Common_iOSStatusBar'
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import Loading from '../../components/Common_Loading/Common_Loading'
import { CheckBox } from 'react-native-elements'


var emailValidate = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var phoneBasicValidate = /^(?=\d{9,}$)\d{9,10}/;
const HOSTNAME = 'https://www.edgeprop.my/jwdmapi/contact-this-agent';
const {width, height} = Dimensions.get('window');

export default class Enquiry extends Component {
  countryCode = "60";
  agentName = ""
  agentContact = ""
  agentImage = "https://sg.tepcdn.com/images/avatar.png"

  closeIcon = require('../../assets/icons/close_gray_white.png');
  constructor(props) {
      super(props)
      this.state = {
        listingDetail : {},
        name: '',
        email: '',
        msg: '',
        phone: '',
        checked: false,
        hasEmailError: false,
        hasNameError: false,
        hasPhoneError: false,
        hasRequestError: false,
        success: false,
        isLoading: false,
        key: this.props.navigation.state.params.data.key,
        nid: this.props.navigation.state.params.data.nid,
        type: this.props.navigation.state.params.data.listingType,
      }

      this.navigation = props.navigation
      this.params = this.navigation.state.params
      this._handleCloseButton = this._handleCloseButton.bind(this)
      this._onContactAgent = this._onContactAgent.bind(this)

      var title = this.params.data.title;
      this.title = 'this property';
      if(title && title != '' ){
        this.title = title;
      }


      var agentInfo = this.params.data.agentInfo
      if(agentInfo.agentName != ''){
        this.agentName = agentInfo.agentName;
        this.agentImage = agentInfo.agentImage || this.agentImage;
        this.agentContact = agentInfo.agentContact;
        this.agencyName = agentInfo.agencyName;
        this.regNumber = agentInfo.regNumber;
      }
      this.makeCall = this.makeCall.bind(this);
      this.formatNumber = this.formatNumber.bind(this);
      this._formatMoney = this._formatMoney.bind(this);
  }

  async componentDidMount() {
    const auth = await AsyncStorage.getItem("authUser");
      if(auth && auth != '') {
        let authItems = JSON.parse(auth);
        let agent = this.agentName? this.agentName : 'Agent';
        this.setState({
          name: authItems.name != 'Anonymous User'? authItems.name: '',
          email: authItems.email? authItems.email: '',
          phone: authItems.phone? authItems.phone: '',
          msg: authItems.name != 'Anonymous User' ? 'Dear '+agent+', \nI would like to check the availability for '+this.title+'. Please acknowledge. \nThank you!' : ''
      });
      }
  }

  static navigationOptions = ({ navigation }) => {
    const { state, setParams } = navigation;
    var { params } = state;
    var keyword =  ""
    var _handleChangeKeyword = (text) => {
      keyword = text
    }
    return {
      header:(
        <View style={
              {
               backgroundColor: "#FFF"
              }}>
          <View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'flex-start', width: '100%'}}>              
              {navigation.goBack!=undefined?
                <HeaderBackButton
                  tintColor={"#414141"}
                  onPress={() => {navigation.goBack()}}

                />:<View/>
              }
              <View style={{position: 'absolute', left: 0, top: 12, width: '100%', zIndex: -1, }}>
                  <Text
                    allowFontScaling={false} 
                    style={{
                       fontSize: 20,
                       fontFamily: 'Poppins-SemiBold',
                       color: '#414141',
                       textAlign: 'center'
                         }}
                  >
                    Contact Agent
                  </Text>
            </View>
          </View>
        </View>
      )
      };
  };

  _handleCloseButton(){
    if(this.props.navigation.goBack){
      this.props.navigation.goBack()
    }
  }

  makeCall(caller) {
    this.params.data.callWebAPI('viewcontact');
    Linking.openURL(`tel:${caller}`)
  }

  _validPhoneNumber(value) {
    if (phoneBasicValidate.test(value)) {
        return false;
    } else {
      return true;
    }
   /* let valStr = value.toString();
    let first  = valStr.charAt(0);
    let len    = valStr?valStr.length:0;
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
      //this.setState({ isLoading: true })
      let lid  = new Array ({"id": this.state.nid , "type": this.state.key });                                                                                                                                                      
      fetch(HOSTNAME, {
      method: 'POST',
      headers: new Headers({
                 'Accept' : 'application/json',
                 'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
        }),
      body: "lid[0][id]="+this.state.nid+"&lid[0][type]="+this.state.key+"&url=/buy?&new_launch=1&name="+this.state.name+"&phone="+this.state.phone+"&user_email="+this.state.email+"&message="+this.state.msg+"&l_type="+this.state.type+"&origin=mobile" // <-- Post parameters
      })
      .then((response) => response.json())
      .then((responseText) => {
          console.log('res', responseText);
          if(responseText.status == 1) {
            this.setState({ 
              success: true, 
              hasRequestError: false,
              name: '',
              email: '',
              msg: '',
              phone: '',
              checked: false,
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

  formatNumber(phone){
    var phone = phone.replace(/\d{4}$/, 'XXXX');
    let formated_phone = phone.substring(0,3)+' '+phone.substring(3,6)+" "+phone.substring(6,11);
    return formated_phone;
      
  }
  
  _handleContactAgent(type){
    //this.agentContact = "+6584976895"
    //console.log('this.params.data.aliasURL', this.params.data.aliasURL);
    let price = typeof(this.params.data.propertyDetails.askingPrice) == 'string' ? this.params.data.propertyDetails.askingPrice : this._formatMoney(Math.round(this.params.data.propertyDetails.askingPrice));
    var message = "I am interested in "+this.params.data.title+ ", "+this.params.data.propertyDetails.area+ " @ "+price+ " in EdgeProp.my. Kindly acknowledge. Thank you! \n"+this.params.data.aliasURL+""
    //console.log("message",message);
    if(type=="whatsapp"){
      var contact = '+6'+ this.params.data.agentInfo.agentContact;
      this.params.data.callWebAPI('mobWhatsapp');
      Linking.canOpenURL(
        `whatsapp://send?text=hello&phone=${contact}`
      ).then(supported => {
        if (!supported) {
          Alert.alert('App not installed');
        } else {
          firebase.analytics().logEvent('Enquiries_Whatsapp', { Id: this.params.data.nid, Type: this.params.data.listingType});
          appsFlyer.trackEvent("Enquiries_Whatsapp", {},
              (result) => {
                  console.log(result);
              },
              (error) => {
                  console.error(error);
              }
          )
          return Linking.openURL(
            `whatsapp://send?text=${message}&phone=${contact}`
          );
        }
      });
    }
    else if(type=="message"){
      firebase.analytics().logEvent('Enquiries_Message', { Id: this.params.data.nid, Type: this.params.data.listingType});
      appsFlyer.trackEvent("Enquiries_Message", {},
          (result) => {
              console.log(result);
          },
          (error) => {
              console.error(error);
          }
      )
      var contact = "+" + this.countryCode + this.agentContact;
      if(Platform.OS ==='ios') Linking.openURL(`sms:${contact}&body=${message}`)
      else if(Platform.OS ==='android') Linking.openURL(`sms:${contact}?body=${message}`)
    }
    else if(type=="call"){
      firebase.analytics().logEvent('Enquiries_Call', { Id: this.params.data.nid, Type: this.params.data.listingType});
      appsFlyer.trackEvent("Enquiries_Call", {},
          (result) => {
              console.log(result);
          },
          (error) => {
              console.error(error);
          }
      )
      this.params.data.callWebAPI('viewcontact');
      var contact = "+" + this.countryCode + this.agentContact;
      Linking.openURL(`tel:${contact}`)
    }
  }

  _formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }

    _formatMoney(val) {
        return val ? 'RM ' + this._formatNumber(val) : '-'
    }

  render(){
    let displayPhone = this.formatNumber(this.agentContact);
    return(
      <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'}>
      <NavigationHelper
          ref={"navigationHelper"}
          navigation={this.props.navigation}
        />
      {this.state.isLoading && (
          <Loading />
      )}
      <View style={{flex:1,  paddingLeft: 40, paddingRight: 40}}>
        <StatusBarBackground lightContent={true} style={{ backgroundColor: 'white' }} />
        <View
          source={require('../../assets/icons/agent_profile_bg.jpg')}
          style={{flex: 1}}>
            {/* Contact info*/}
            {this.agentName != 'EdgeProp' &&
            <View style={{
              flex: 1,
              flexDirection: 'row',
            }}>
              <View style={{marginBottom: 10}}>
                <AvatarIcon
                  width={70}
                  height={70}
                  image={{uri: this.agentImage}}
                />
              </View>
              <View style={{paddingLeft: 15, paddingTop: 5}}>
                <Text allowFontScaling={false} style={{
                  fontSize: 16,
                  color: "#393939",
                  fontFamily: "Poppins-Regular",
                }}>
                  {this.agentName}
                </Text>
                <Text allowFontScaling={false} style={{
                  fontSize: 16,
                  color: "#A0ACC1",
                  fontFamily: "Poppins-Light",
                  fontWeight: '400',
                  textTransform: "lowercase"
                  }}>
                  {this.agencyName? this.agencyName : ""}
                </Text>
                <Text allowFontScaling={false} style={{
                  fontSize: 16,
                  color: "#A0ACC1",
                  fontFamily: "Poppins-Light",
                  fontWeight: '400',
                 }}>
                  {this.regNumber? this.regNumber : ""}
                </Text>
            </View>
            </View>
          }

          {this.agentName == 'EdgeProp' &&
            <View style={{ marginTop: height * 0.055 }} />
          }
            <View>
               <TextInput style={inputStyles.input}
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
               <TextInput style={inputStyles.input}
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
               <TextInput style={inputStyles.input}
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
               <TextInput style={inputStyles.inputLarge}
               allowFontScaling={false}
               underlineColorAndroid = "transparent"
               placeholder = "Message"
               placeholderTextColor = "#414141"
               value={this.state.msg}
               multiline = {true}
               autoCapitalize = "none"
               onChangeText={(msg) => this.setState({msg: msg})}
               />

            </View>
            <View style={inputStyles.checkboxSection}>
               <CheckBox
                  checked={this.state.checked}
                  onPress={() => this.setState({ checked: !this.state.checked })}
                   containerStyle={{paddingRight: 0, justifyContent: 'center', width:30, paddingTop:0, paddingBottom: 0, paddingLeft:5, backgroundColor: '#fff', borderRadius: 0, borderWidth:0, borderColor: '#fff' }}
                    
              />
              <View style={inputStyles.checkboxContain}>
                <Text allowFontScaling={false} style={inputStyles.checkboxText}>Yes, keep me posted on new launches, property digest and partner affairs</Text>
              </View>
            </View>
            {this.state.hasRequestError && (
                <View style={{ backgroundColor: '#F44336', borderRadius: 3, width: '100%', paddingBottom: 15, paddingTop: 15, marginBottom: 20, paddingLeft: 10 }}>
                      <View style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
                        <Text allowFontScaling={false} style={{ fontSize: 15, fontFamily: 'Poppins-Regular', marginLeft: 5, color: '#fff' }}>Current password is invalid!</Text>
                      </View>
                  </View>  
                )}
                {this.state.success && (
                  <View style={{ backgroundColor: '#4CAF50', borderRadius: 3, width: '100%', paddingBottom: 15, paddingTop: 15, marginBottom: 20, paddingLeft: 10 }}>
                      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text allowFontScaling={false} style={{ fontSize: 15, fontFamily: 'Poppins-Regular', marginLeft: 5, color: '#fff' }}>Updated successfully!</Text>
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
                <TouchableOpacity onPress={this._onContactAgent}> 
                    <View style={inputStyles.buttonOne}>
                        <Text allowFontScaling={false} style={inputStyles.buttonText}>
                          {'I\'m Interested'}
                        </Text>
                    </View>
                </TouchableOpacity> 
            </View>



            {this.agentName != 'EdgeProp' &&
            <View>
                <TouchableOpacity onPress={()=>this._handleContactAgent('whatsapp')}> 
                    <View style={inputStyles.buttonThree}>
                        <View style={inputStyles.imgStyle}>
                           <Image style={inputStyles.imgCustom} source={require('../../assets/icons/whatsapp_icon.png')}  />
                        </View>
                        <Text allowFontScaling={false} style={inputStyles.buttonTextThree}>
                          {'WhatsApp'}
                        </Text>
                    </View>
                </TouchableOpacity>     
            </View>
          }
         
         {this.agentName != 'EdgeProp' &&
            <View style={inputStyles.belowButton}>
              <Text allowFontScaling={false} style={inputStyles.belowButtonText}>Contact Number</Text>
            </View> 
          }
          {this.agentName != 'EdgeProp' &&
             <View>
                <TouchableOpacity onPress={() => this.makeCall(this.agentContact)}> 
                    <View style={inputStyles.buttonTwo}>
                        <Text allowFontScaling={false} style={inputStyles.buttonTextTwo}>
                          {displayPhone}
                        </Text>
                    </View>
                </TouchableOpacity> 
            </View>
          }
        </View>
      </View>
    </KeyboardAwareScrollView>
    )
  }
}

const inputStyles = StyleSheet.create({
  input: {
      marginBottom: 11,
      borderColor: '#D3D3D3',
      borderWidth: 1,
      borderRadius: 4,
      fontSize: 17,
      height: 44,
      paddingHorizontal: 16
   },
   inputLarge: {
      marginBottom: 11,
      borderColor: '#D3D3D3',
      borderWidth: 1,
      borderRadius: 4,
      paddingTop: 15,
      fontSize: 17,
      textAlign: 'left',
      textAlignVertical: 'top',
      paddingHorizontal: 16,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      height: 140
   },
   checkboxSection: {
     flexDirection: 'row',
     marginBottom: 20, 
     width: '100%'
    },
    checkboxContain: {
      flex: 1
    },
   checkboxText: {
     color: '#A0ACC1',
     fontSize: 15,
     flex: 1,
     flexWrap: 'wrap',
     width: '100%'
    },
   buttonOne: {
    backgroundColor: '#488BF8',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 57,
    borderRadius: 4
  },  
   buttonTwo: {
    backgroundColor: '#F1F1F1',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 57,
    borderRadius: 4,
    borderColor: '#A0ACC1',
    borderWidth: 1,
    marginBottom: 20
  },  
   buttonText: {
       color: '#fff',
       fontWeight: '500',
       fontSize: 18,
       //letterSpacing: 2,
       width: '100%',
       textAlign: 'center'
   },
    buttonTextTwo: {
       color: '#414141',
       fontWeight: '400',
       fontSize: 18,
       letterSpacing: 2,
       width: '100%',
       textAlign: 'center'
   },
   belowButton: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingVertical: 15
   },
   belowButtonText: {
      color: '#414141',
      fontSize: 18
   },
   buttonThree: {
     backgroundColor: '#33CC66',
     flexDirection: 'row',
     justifyContent: 'center',
     alignItems: 'center',
     height: 57,
     borderRadius: 4,
     borderColor: '#20B93A',
     borderWidth: 1,
     marginVertical: 14,
     marginBottom: 25 

   },
    buttonTextThree: {
       color: '#fff',
       fontWeight: '500',
       fontSize: 18,
       //letterSpacing: 2,
       textAlign: 'left',
       minWidth: 100
     },
   imgStyle: {
    paddingRight: 16
   },
   imgCustom: {
    width: 34,
    height: 34

   } 

});


 