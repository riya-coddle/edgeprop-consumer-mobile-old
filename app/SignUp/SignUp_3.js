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
import TextBox from '../../components/Common_TextBox/Common_TextBox.js'
import Button from '../../components/Common_Button/Common_Button.js'

const HOSTNAME = "https://www.edgeprop.sg";
const API_DOMAIN = "https://api.theedgeproperty.com.sg";
export default class SignUp_3 extends Component {
  navigation = {}
  params = {}
  category = ''
  firstData = []
  categoryURL = ''
  didMount = false
  calledData = 0
  page = 1
  totalPage = 1
  size = 20
  formValues = {
    password: {
      id: "password",
      value: "",
      validationStatus: false,
      errorMessage: ""
    },
    confirm_password: {
      id: "confirm_password",
      value: "",
      validationStatus: false,
      errorMessage: ""
    }
  }
  userInfo

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
    this._handleButtonClick = this._handleButtonClick.bind(this)
    this._registerUser = this._registerUser.bind(this)
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
    if(data.userInfo != undefined){
      data.userInfo = {...data.userInfo, ...{
        password: this.formValues.password.value,
        confirm_password: this.formValues.confirm_password.value
      }}
      this.userInfo = data.userInfo
      // console.log(data, this.userInfo);
    }
    this._registerUser()
  }

  _registerUser(){
    //register user
    var first_name = this.userInfo.first_name || ""
    var last_name = this.userInfo.last_name || ""
    var phone = this.userInfo.phone || ""
    var email = this.userInfo.email || ""
    var password = this.userInfo.password || ""
    var confirm_password = this.userInfo.confirm_password || ""
    let param = "url="+ encodeURIComponent("https://www.edgeprop.sg/property_user_reg_popup_submit")
    + "&agent_first_name=" + first_name + "&agent_last_name="+ last_name
    + "&agent_phone=" + phone + "&agent_email=" + email + "&agent_password=" + password
    + "&confirm_password=" + confirm_password + "&chk_confirm=" + true
      + "&form_id=agent_registration_form_popup&is_agent=0";

    fetch(HOSTNAME+'/proxy', {
      method: 'POST',
      headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded'}),
      body: param // <-- Post parameters
    })
    .then((response) => {
      this.refs.button._toggleLoading(false);
      if(response.status == 200){
        Alert.alert(
          "Thank you for signing up",
          "Please check your email to confirm your registration.",
          [
            {text: 'OK', onPress: () => {
              if(this.props.navigation.state.params.data.handleGoBack != undefined){
                this.props.navigation.state.params.data.handleGoBack()
              }
            }, style: 'default'}, //default //cancel //destructive
          ],
          { cancelable: false }
        )
      }
    })
    .catch((error) => {
      console.log(error);
      this.refs.button._toggleLoading(false)
    });
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
      if(allValid && this.formValues.password.value.length > 0 && this.formValues.confirm_password.value.length>0){
        if(this.formValues.password.value != this.formValues.confirm_password.value){
          allValid = false
          this.refs.confirm_password._setValidationState(false, "Passwords do not match")
        }
        else{
          allValid = true
          this.refs.confirm_password._setValidationState(true, "")
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
          width: "100%",
          marginBottom: 23
        }}></View>
        <TextBox
          ref={"password"}
          id={"password"}
          title={"Password"}
          type={"password"}
          mandatory={true}
          onValidation={this._handleValidation}
          onSubmit={this._handleOnSubmit}>
        </TextBox>
        <TextBox
          ref={"confirm_password"}
          id={"confirm_password"}
          title={"Confirm Password"}
          type={"password"}
          mandatory={true}
          onValidation={this._handleValidation}
          onSubmit={this._handleOnSubmit}>
        </TextBox>
        <View style={{position: "absolute", bottom: 0, left: 0, right: 0}}>
          <Button
            ref={"button"}
            marginVertical={5}
            textValue={"DONE"}
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
