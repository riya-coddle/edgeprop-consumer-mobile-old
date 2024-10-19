import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Linking,
  Keyboard
} from 'react-native'
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import AsyncHelper from '../../components/Common_AsyncHelper/Common_AsyncHelper.js'
import TextBox from '../../components/Common_TextBox/Common_TextBox.js'
import Button from '../../components/Common_Button/Common_Button.js'

const HOSTNAME = "https://www.edgeprop.sg";
const API_DOMAIN = "https://api.theedgeproperty.com.sg";
export default class SignUp_2 extends Component {
  navigation = {}
  formValues = {
    email: {
      id: "email",
      value: "",
      validationStatus: false,
      errorMessage: ""
    },
    phone: {
      id: "phone",
      value: "",
      validationStatus: false,
      errorMessage: ""
    }
  }
  emailValid = false
  phoneValid = false
  isAlert = false
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Sign Up".toUpperCase(),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      disableButton: true
    }
    this.navigation = props.navigation
    this._handleValidation = this._handleValidation.bind(this)
    this._handleLogin = this._handleLogin.bind(this)
    this._checkValidity = this._checkValidity.bind(this)
    this._handleButtonClick = this._handleButtonClick.bind(this)
    this._continue = this._continue.bind(this)
    this._handleOnSubmit = this._handleOnSubmit.bind(this)
  }

  _init() {
  }

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

  _handleButtonClick(){
    this.refs.button._toggleLoading(true)
    var data = {}
    if(this.props.navigation.state.params != undefined && this.props.navigation.state.params.data!=undefined && Object.keys(this.props.navigation.state.params.data).length > 0){
      data = this.props.navigation.state.params.data
    }
    if(data.handleGoBack == undefined){
      data.handleGoBack = this.props.navigation.goBack
    }
    this.emailValid = false
    this.phoneValid = false
    this._checkValidity(this.formValues.email.value, "agent_email")
    this._checkValidity(this.formValues.phone.value.replace(/ /g, ""), "agent_phone")
  }

  _continue(){
    var data = {}
    if(this.props.navigation.state.params != undefined && this.props.navigation.state.params.data!=undefined && Object.keys(this.props.navigation.state.params.data).length > 0){
      data = this.props.navigation.state.params.data
    }
    if(data.handleGoBack == undefined){
      data.handleGoBack = this.props.navigation.goBack
    }
    if(data.userInfo != undefined){
      data.userInfo = {...data.userInfo, ...{
        email: this.formValues.email.value,
        phone: this.formValues.phone.value
      }}
    }
    // console.log(data);
    this.refs.navigationHelper._navigate('SignUp_3', {
      data: data
    })
  }

  _alert(type){
    if(type=="email" && !this.isAlert){
      this.isAlert = true
      Alert.alert(
        "Email Already Registered",
        "The email used is already registered, do you want to login?", //, Profile Screen will be coming soon",
        [
          {text: 'Login', onPress: () => {
            this.isAlert = false
            this._handleLogin();
          }, style: 'default'}, //default //cancel //destructive
          {text: 'Cancel', onPress: () => {
            this.isAlert = false
            this.setState({
              disableButton: true
            })
          }, style: 'destructive'}
        ],
        { cancelable: false }
      )
    }
    else if(type=="phone" && !this.isAlert){
      this.isAlert = true
      Alert.alert(
        "Number Already Registered",
        "The phone number is already registered, do you want to login?", //, Profile Screen will be coming soon",
        [
          {text: 'Login', onPress: () => {
            this.isAlert = false
            this._handleLogin();
          }, style: 'default'}, //default //cancel //destructive
          {text: 'Cancel', onPress: () => {
            this.isAlert = false
            this.setState({
              disableButton: true
            })
          }, style: 'destructive'}
        ],
        { cancelable: false }
      )
    }
  }

  _handleLogin(){
    var data = {}
    if(this.props.navigation.state.params != undefined && this.props.navigation.state.params.data!=undefined && Object.keys(this.props.navigation.state.params.data).length > 0){
      data = this.props.navigation.state.params.data
    }
    if(data.navigateToLogin != undefined){
      data.navigateToLogin();
    }
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

  _checkValidity(value, type){
    let param = "url="+ encodeURIComponent("https://www.edgeprop.sg/index.php?option=com_analytica&task=isUserValid") + "&" + type + "=" + value;
    fetch(HOSTNAME+'/proxy', {
      method: 'POST',
      headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded'}),
      body: param // <-- Post parameters
    })
    .then((response) => response.json())
    .then((status) => {
      if(type == "agent_phone"){
        this.phoneValid = status
      }
      else if(type == "agent_email"){
        this.emailValid = status
      }
      if(this.emailValid && this.phoneValid){
        this.refs.button._toggleLoading(false)
        this._continue()
      }
      else{
        this.refs.button._toggleLoading(false)
        if(!status && type=="agent_email"){
          this._alert("email")
        }
        else if(!status && type=="agent_phone"){
          this._alert("phone")
        }
      }
    })
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
    return (
      <View style={{flex: 1}}>
        <NavigationHelper
          ref={"navigationHelper"}
          navigation={this.props.navigation}
        />
        <View style={{
          opacity: 0.5,
          backgroundColor: "#ff5122",
          height: 5,
          width: "66.67%",
          marginBottom: 23
        }}></View>
        <TextBox
          ref={"email"}
          id={"email"}
          title={"Email"}
          mandatory={true}
          type={"email"}
          onValidation={this._handleValidation}
          onSubmit={this._handleOnSubmit}>
        </TextBox>
        <TextBox
          ref={"phone"}
          id={"phone"}
          title={"Phone"}
          type={"phone"}
          onValidation={this._handleValidation}
          onSubmit={this._handleOnSubmit}>
        </TextBox>
        <View style={{position: "absolute", bottom: 0, left: 0, right: 0}}>
          <Button
            ref={"button"}
            marginVertical={5}
            textValue={"CONTINUE WITH SIGN UP"}
            textSize={16}
            fontFamily={"Poppins-SemiBold"}
            backgroundColor={this.state.disableButton? "#e4e7eb": "#ff5122"}
            textColor={"#ffffff"}
            borderRadius = {1}
            disabled = {this.state.disableButton}
            onPress = {()=>this._handleButtonClick()}
          />
        </View>
      </View>
    )
  }
}
