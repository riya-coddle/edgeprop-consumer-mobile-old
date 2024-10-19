import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
  Keyboard,
  TextInput,
  ScrollView,
  AsyncStorage
} from 'react-native'
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import TextBox from '../../components/Common_TextBox/Common_TextBox.js'
import Button from '../../components/Common_Button/Common_Button.js'
import Loading from '../../components/Common_Loading/Common_Loading'
import WelcomeLanding from '../../app/WelcomeLanding/WelcomeLanding.js'
import { Dropdown } from 'react-native-material-dropdown';
import styles from './SignupStyles.js'

const HOSTNAME = "https://www.edgeprop.my/jwdalice/api/user/v1/register";
const API_DOMAIN = "https://api.theedgeproperty.com.sg";
var phoneValidate = /^(?=\d{9,}$)\d{9,10}/;

const genderTypes = [
  { label:'Male', value: 'male' },
  { label:'Female', value: 'female' }
];

var backIcon = require('../../assets/icons/left-arrow.png');
export default class SignUp_1 extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Sign Up".toUpperCase(),
    };
  };

  constructor(props) {
    super(props);
    let params = this.props.navigation.state.params.data;
    console.log('paramss signup1', params);
    this.state = {
      disableButton: true,
      email: params.emailValue,
      firstName: '',
      lastName: '',
      gender: 'Gender',
      phone: '',
      newPass: '',
      confirmPass: "",
      onFirstStep: false,
      onSecondStep: false,
      hasFirstNameError: false,
      hasPassError: false,
      hasPhoneError: false,
      hasConfPassError: false,
      onSuccess: false,
      responseData: [],
      hasMailError: false,
      hasPasswordError: false,
      hasPhoneNumError: false,
      onLoading: false
    }
    this.navigation = props.navigation
    this._handleValidation = this._handleValidation.bind(this)
    this._handleLogin = this._handleLogin.bind(this)
    this._continue = this._continue.bind(this)
    this._handleOnSubmit = this._handleOnSubmit.bind(this)
    this.onPress = this.onPress.bind(this)
    this.onFirstStepFinish = this.onFirstStepFinish.bind(this)
    this.onSecondStepFinish = this.onSecondStepFinish.bind(this)
    this._onPressSubmit = this._onPressSubmit.bind(this)
    this._registerUser = this._registerUser.bind(this)
    this._backToHome = this._backToHome.bind(this);
  }

  _init() {
  }

  onPress() {
    if(this.props.onBackPress) {
      this.props.onBackPress(this.props.emailValue)
    }
  }
  
  _validPhoneNumber(value) {
    let valStr = value.toString();
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
     }

  }
    
  _onPressSubmit() {
    let nameError = phoneError = passError = confPassError = false;
    if(this.state.firstName.trim() == '' || this.state.firstName.length < 3 ) {
        nameError = true;
    } else {
        nameError = false;
    }
    
    if(this.state.phone.trim() == '' || isNaN(this.state.phone)) {
      phoneError = true;
    } else {
      //phoneError = this._validPhoneNumber(this.state.phone)
      phoneError = !phoneValidate.test(this.state.phone)
    }

    if(this.state.newPass.trim() == '' || this.state.newPass.length < 5) {
      passError = true;
    } else {
      passError = false;
    }

    if(this.state.confirmPass == "" ) {
      confPassError = true;
    } else {
      if(this.state.newPass.trim() != '' && this.state.confirmPass === this.state.newPass ) {
        confPassError = false;
      } else {
        confPassError = true;
      }
    }
    
    this.setState({ 
        hasFirstNameError : nameError,
        hasPassError : passError,
        hasPhoneError: phoneError,
        hasConfPassError: confPassError 
      }, 
      () => this._registerUser(),
    )
  }

  _registerUser(){
    //register user
   // this.setState({ onLoad: true })
    if(this.state.hasFirstNameError === false  && this.state.hasPhoneError === false  && this.state.hasPassError === false  && this.state.hasConfPassError === false ) {
    this.setState({ onLoading : true  })
    let name = this.state.lastName != ''?(this.state.firstName.charAt(0).toUpperCase()+ this.state.firstName.slice(1)+' '+this.state.lastName.charAt(0).toUpperCase()+this.state.lastName.slice(1)):this.state.firstName.charAt(0).toUpperCase()+this.state.firstName.slice(1);
    let signUpOption = 3; // facebook -1 . google - 2. app - 3 
    let param = {
      name : name,
      email: this.state.email,
      phone: this.state.phone,
      pwd: this.state.newPass,
      reg_from: 3,
      login: 1
    };

    fetch(HOSTNAME, {
      method: 'POST',
      headers: new Headers({
                 'Accept' : 'application/json',
                 'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
        }),
      body: "name="+name+"&email="+this.state.email+"&phone="+this.state.phone+"&pwd="+this.state.newPass+"&reg_from="+signUpOption+"&login=1" // <-- Post parameters
      })
      .then((response) => response.json())
      .then((responseText) => {
        
        if(responseText.status == 1) {          
          this.setState({ hasMailError: false,  hasPhoneNumError: false, hasPasswordError: false }) 
          this._setAuthAsyc(responseText.data);
        }
        if(responseText.status[0] == 0) {
          if(responseText.email && responseText.email != '') {
            this.setState({ hasMailError: true })  
          }
          if(responseText.phone && responseText.phone != '') {
            this.setState({ hasPhoneNumError: true })  
          }
          if(responseText.pwd && responseText.pwd != '') {
            this.setState({ hasPasswordError: true })  
          }
          
        }
        //this.setState({ onSuccess : true , responseData : responseText })
        
      })
      .catch((error) => {
          console.error(error);
          //this.setState({ onLoad: false })
      });
    }

  }

  _setAuthAsyc = async (response) => {
    //console.log('response',response)
      try {
        await AsyncStorage.setItem("authUser", JSON.stringify(response))
         .then( ()=>{
            console.log('It was saved successfully')
            this.setState({ onLoading : false })
            this.props.navigation.navigate('WelcomeLanding');
         } )
         .catch( ()=>{
            console.log("There was an error saving the product")
         } )
      } catch (error) {
        // Error saving data
        console.log('error msg');
      }
    };

  _handleOnSubmit(id){
    var next = false
    var indexArray = Object.keys(this.formValues)
    if(id==indexArray[indexArray.length-1]){
      Keyboard.dismiss();
    }
    else{
      var index = indexArray.indexOf(id)
      if(index>-1){
        if(this.refs[indexArray[index+1]]!=undefined){
          this.refs[indexArray[index+1]]._getFocus();
        }
      }
    }
  }

  onFirstStepFinish() {
    if(this.state.firstName != '' && this.state.lastName != '' ) {
      this.setState({ onFirstStep: true })
    }
  }

  onSecondStepFinish() {
    if(this.state.phone) {
      this.setState({ onSecondStep: true })
    }
  }

  _continue(){
    var data = {}
    if(this.props.navigation.state.params != undefined && this.props.navigation.state.params.data!=undefined && Object.keys(this.props.navigation.state.params.data).length > 0){
      data = this.props.navigation.state.params.data
    }
    if(data.handleGoBack == undefined){
      data.handleGoBack = this.props.navigation.goBack
    }
    data.userInfo = {
      first_name: this.formValues.first_name.value,
      last_name: this.formValues.last_name.value
    }
    // console.log(data);
    this.refs.navigationHelper._navigate('SignUp_2', {
      data: data
    })
  }

  _handleValidation(id, value, validationStatus, errorMessage){
    this.formValues[id] = {
      id, value, validationStatus, errorMessage
    }
    if(validationStatus){
      allValid = true
      for(var index in this.formValues){
        if(!this.formValues[index].validationStatus){
          allValid = false;
          break;
        }
      }
      this.setState({
        disableButton: !allValid
      })
    }
    else{
      this.setState({
        disableButton: true
      })
    }
  }

  _handleLogin(){
    var data = {}
    if(this.props.navigation.state.params != undefined && this.props.navigation.state.params.data!=undefined && Object.keys(this.props.navigation.state.params.data).length > 0){
      data = this.props.navigation.state.params.data
    }
    if(data.navigateToLogin != undefined){
      if(this.props.navigation.goBack!=undefined){
        this.props.navigation.goBack()
      }
      data.navigateToLogin();
    }
  }

  _backToHome() {
      let navigation = this.props.navigation;
      navigation.goBack();
    }

  componentWillReceiveProps(nextProps) {
  }

  componentDidMount() {
    this.didMount = true
  }

  componentWillUnmount() {
    this.didMount = false
  }

  render() {    
    this._init();
    /*if(this.state.onSuccess) {
      return (<WelcomeLanding />);
    }*/
    return (
       <KeyboardAwareScrollView style={{ paddingBottom: 50 }} keyboardShouldPersistTaps={'handled'}>

        <TouchableOpacity onPress={this._backToHome} style={{ paddingLeft: 10,paddingTop: 15, display:'flex', flexDirection: 'row', alignItems: 'center'  }}>
            <Image
                  style={{ width: 20, height: 20 }}
                  source={backIcon}
              />
              <Text allowFontScaling={false} style={{ fontSize: 18, marginTop: 2, fontFamily: 'Poppins-Regular', color: '#007AFF' }}>Back</Text>
          </TouchableOpacity>
          
          <View style={styles.testContainer}>
             <Text allowFontScaling={false} style={styles.login}>Sign Up</Text>
             <Text allowFontScaling={false} style={styles.welcomeTest}>What’s your name?</Text>
          </View>
          <View style={styles.containerCustom}>      
               <TextInput
                  allowFontScaling={false}
                  value={this.state.firstName}
                  autoCapitalize = 'none'
                  style={styles.inputCustom}
                  placeholder='First Name'
                  underlineColorAndroid="transparent"
                  onBlur={() => this.onFirstStepFinish()}
                  onChangeText={(firstName) => this.setState({firstName})}
               />
               {this.state.hasFirstNameError &&  (
                  <Text allowFontScaling={false} style={{ fontFamily:'Poppins-Regular', color:'red', fontSize: 12, alignSelf: 'flex-start' }}>Invalid Firstname</Text>
                )}
               <TextInput
                  allowFontScaling={false}
                  value={this.state.lastName}
                  autoCapitalize = 'none'
                  style={styles.inputCustom}
                  placeholder='Last Name'
                  underlineColorAndroid="transparent"
                  onChangeText={(lastName) => this.setState({lastName})}
                  onBlur={() => this.onFirstStepFinish()}
               />
            <View style={{ paddingBottom: 15 }}/>
        </View>
        {this.state.onFirstStep && (
          <View>
            <View style={styles.testContainer}>
              <Text allowFontScaling={false} style={styles.welcomeTest}>A little more information</Text>
            </View>
            <View style={styles.dropdownCustom}>
               <Dropdown
                    allowFontScaling={false}
                    data={genderTypes}
                    value={this.state.gender}
                    baseColor={'#414141'}
                    selectedItemColor={'#414141'}
                    inputContainerStyle={{ borderBottomColor: 'transparent' }}
                    textColor={'#414141'}
                    itemColor={'#414141'}
                    fontFamily={'Poppins-Regular'}
                    dropdownPosition={1}
                    labelHeight={0}
                  />
            </View>
            <View style={{ paddingLeft:25, paddingRight: 25, marginLeft: 5, marginRight: 5 }} >
              <TextInput
                    allowFontScaling={false}
                    value={this.state.phone}
                    autoCapitalize = 'none'
                    keyboardType='numeric'
                    style={styles.inputCustom}
                    placeholder='Phone'
                    underlineColorAndroid="transparent"
                    onChangeText={(phone) => this.setState({phone : phone.trim()})}
                    onBlur={() => this.onSecondStepFinish()}
                 />
              { this.state.hasPhoneError &&  (
                  <Text allowFontScaling={false} style={{ fontFamily:'Poppins-Regular', color:'red', fontSize: 12, alignSelf: 'flex-start' }}>Invalid Phone number</Text>
                )}   
            </View>
            <View style={{ paddingBottom: 15 }}/>   
          </View>  
        )}
        {this.state.onSecondStep && (
          <View>
            <View style={styles.testContainer}>
              <Text allowFontScaling={false} style={styles.welcomeTest}>Create a password</Text>
            </View>
              <View style={styles.containerCustom}>      
                 <TextInput
                    allowFontScaling={false}
                    value={this.state.newPass}
                    autoCapitalize = 'none'
                    style={styles.inputCustom}
                    placeholder='Password'
                    secureTextEntry={true}
                    underlineColorAndroid="transparent"
                    onChangeText={(newPass) => this.setState({newPass})}
                 />
                 { this.state.hasPassError &&  (
                  <Text allowFontScaling={false} style={{ fontFamily:'Poppins-Regular', color:'red', fontSize: 12, alignSelf: 'flex-start' }}>The password must be at least 5 characters</Text>
                )}
                 <TextInput
                    allowFontScaling={false}
                    value={this.state.confirmPass}
                    autoCapitalize = 'none'
                    style={styles.inputCustom}
                    placeholder='Confirm Password'
                    secureTextEntry={true}
                    underlineColorAndroid="transparent"
                    onChangeText={(confirmPass) => this.setState({confirmPass})}
                 />
                { this.state.hasConfPassError &&  (
                  <Text allowFontScaling={false} style={{ fontFamily:'Poppins-Regular', color:'red', fontSize: 12, alignSelf: 'flex-start' }}>Passwords did not match!</Text>
                )}
                { this.state.hasSignupError &&  (
                  <Text allowFontScaling={false} style={{ fontFamily:'Poppins-Regular', color:'red', fontSize: 12, alignSelf: 'flex-start' }}>{this.state.errorMsg?this.state.errorMsg:'Something went wrong! Try Again.'}</Text>
                )}
              
              {(this.state.hasMailError || this.state.hasPasswordError || this.state.hasPhoneNumError) && (
                  <View style={{ backgroundColor: '#ffb2b2', borderWidth: 1, borderColor: '#ACACAC', borderRadius: 3, width: '100%', paddingBottom: 10, paddingTop: 10, marginBottom: 20, paddingLeft: 10 }}>
                    {this.state.hasMailError && (
                      <View style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
                        <Text allowFontScaling={false}>{'\u2022'}</Text>
                        <Text allowFontScaling={false} style={{ fontSize: 13, fontFamily: 'Poppins-Regular', marginLeft: 5 }}>The email has already been taken.</Text>
                      </View>
                    )}
                    {this.state.hasPhoneNumError && (
                      <View style={{flexDirection: 'row'}}>
                        <Text allowFontScaling={false}>{'\u2022'}</Text>
                        <Text allowFontScaling={false} style={{ fontSize: 13, fontFamily: 'Poppins-Regular', marginLeft: 5 }}>The phone has already been taken.</Text>
                      </View>
                    )}
                    {this.state.hasPasswordError && (
                      <View style={{flexDirection: 'row'}}>
                        <Text allowFontScaling={false}>{'\u2022'}</Text>
                        <Text allowFontScaling={false} style={{ fontSize: 13, fontFamily: 'Poppins-Regular', marginLeft: 5 }} >The password must be at least 5 characters.</Text>
                      </View>
                    )}
                </View>  
              )}
              <View style={{ paddingBottom: 15 }}/> 
              <View style={styles.buttonContain}>
               <TouchableOpacity style={styles.fbButtonLast} onPress={this._onPressSubmit}>
                 <Text allowFontScaling={false} style={styles.btnText}>Submit</Text>
              </TouchableOpacity>
              <View style={{ paddingBottom: 30 }}/>
            </View>
            </View>
          </View>  
        )}
      </KeyboardAwareScrollView>
    )
  }
}
