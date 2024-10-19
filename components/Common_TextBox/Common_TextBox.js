import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
  Image
} from 'react-native';
import Common_ToolsTip from '../Common_ToolsTip/Common_ToolsTip'

var icon = require('../../assets/icons/search-icon.png');

export default class App extends Component<{}> {
  title = ""
  autoCapitalize = "none"
  secureTextEntry = false
  keyboardType = "default"
  titleHeight = 25
  height = 49
  tintColor = "#003366"
  errorColor = "red"
  isFilled = false
  validationStatus = false
  errorMessage = ""
  maxLength = 200
  value = ""

  constructor(props){
    super(props);
    this.state = {
      value: props.defaultValue || "",
      isFocus: false,
      errorMessage: ""
    }
    this.title = props.title || this.title
    this._handleType = this._handleType.bind(this)
    this._getFocus = this._getFocus.bind(this)
    this._handleToggleFocus = this._handleToggleFocus.bind(this)
    this._handleValidation = this._handleValidation.bind(this)
    this._handleMandatory = this._handleMandatory.bind(this)
    this._handleEmail = this._handleEmail.bind(this)
    this._handleName = this._handleName.bind(this)
    this._handlePhone = this._handlePhone.bind(this)
    this._handleParentOnValidation = this._handleParentOnValidation.bind(this)
    this._handleOnChange = this._handleOnChange.bind(this)
    this._setValidationState = this._setValidationState.bind(this)
    this._setText = this._setText.bind(this)
    this._handleType(props.type)

    this.titleTextStyle = {
      fontFamily: "Poppins-Light",
      fontSize: 15,
      color: "#4a4a4a",
      textAlign: "left",
      // lineHeight: 25
    }
    this.inputContainerStyle = {
      width: "100%",
      flexDirection: "row",
      borderBottomWidth: 1,
      borderColor: "#979797",
      justifyContent: "center",
      paddingBottom: 2
    }
    this.regionCodeStyle = {
      fontFamily: "Poppins-Light",//"Poppins-Regular",
      fontSize: 30,
      color: "#4a4a4a",
      textAlign: "left",
      width: 62,
      color: "#c8c7cc",
      marginRight: 5,
      lineHeight: 45,
      height: 45
    }
    this.inputTextStyle = {
      fontFamily: "Poppins-Light",//"Poppins-Regular",
      fontSize: 30,
      color: "#4a4a4a",
      height: 45,
      flex:1,
      alignItems: 'center',

    }
    this.errorTextStyle = {
      fontSize: 10,
      fontFamily: "Poppins-Light",
      color: this.errorColor,
      marginTop: 3
    }
  }
  _setText(text){
      this.setState({
          value: text
      })
  }
  _setValidationState(status, error){
    this.validationStatus = status
    this.setState({
      errorMessage: error
    })
  }

  _handleType(type){
    if(this.props.type=="phone"){
      this.keyboardType = "phone-pad"
      this.maxLength = 10
    }
    else if(this.props.type=="email"){
      this.keyboardType = "email-address"
    }
    else if(this.props.type=="password"){
      this.secureTextEntry = true
    }
    else if(this.props.type=="name"){
      this.autoCapitalize = "words"
      this.maxLength = 30
    }
  }

  _handleToggleFocus(isFocus){
    this.setState({
      isFocus: isFocus
    })
    if(!isFocus){
      this._handleValidation();
      this._handleParentOnValidation();
    }
  }

  _handleValidation(){
    this._handleMandatory();
    if(this.validationStatus){
      if(this.props.type == 'name') {
        this._handleName();
      }
      else if(this.props.type == 'email') {
        this._handleEmail();
      }
      else if(this.props.type == 'phone') {
        if(this.props.mandatory || this.value.length > 0){
          this._handlePhone();
        }
      }
    }

    if(this.validationStatus){
      this.errorMessage = ""
    }
  }

  _handleMandatory(){
    if(this.props.mandatory){
      if(this.value.length == 0){
        this.validationStatus = false;
        this.errorMessage = "Please enter your " + this.title.toLowerCase()
      }
      else{
        this.validationStatus = true;
      }
    }
    else{
      this.validationStatus = true
    }
  }

  _handleEmail(){
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(re.test(this.value)){
      this.validationStatus = true;
    }else{
      this.validationStatus = false;
      this.errorMessage = "Please enter a valid email address"
    }
  }

  _handleName(){
    var re = /^[a-zA-Z ]{2,30}$/;

    if(re.test(this.value)){
      this.validationStatus = true;
    } else {
      this.validationStatus = false;
      this.errorMessage = "Please enter a valid name"
    }
  }

  _handlePhone(){
    var re = /^[\s()+-]*([0-9][\s()+-]*){8,20}$/;

    if(re.test(this.value)){
      this.validationStatus = true;
    } else {
      this.validationStatus = false;
      this.errorMessage = "Please enter a valid phone number"
    }
  }

  _handleParentOnValidation(){
    if(this.props.onValidation != undefined){
      this.props.onValidation(this.props.id, this.value,
        this.validationStatus, this.errorMessage);
      }
  }

  _handleOnChange(value){
    if(this.props.type=="phone"){
      if(value.length=="5" && value[4] != " "){
        value = value.substring(0,4) + " " + value[4]
      }
    }
    // pull up the updated state.value
    if(this.props.onChangeText){
      this.props.onChangeText(value)
    }
    this.setState({
      value: value
    })
    this.value = value
    this._handleValidation()
    this._handleParentOnValidation();
  }

  _getFocus(){
    if(this.refs.input!=undefined){
      this.refs.input.focus()
    }
    if(this.props.onPress){
      this.props.onPress()
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return (JSON.stringify(nextState) != JSON.stringify(this.state))
  }

  componentDidUpdate(prevProps, prevState){
    if(prevState.isFocus != this.state.isFocus){
      if(this.state.isFocus){
        this.setState({
          errorMessage: ""
        })
      }
      else{
        this.setState({
          errorMessage: this.errorMessage
        })
      }
    }
  }

  _init(){
    if(this.props.title != undefined && this.props.title != this.title){
      this.title = this.props.title
    }
    if(this.props.type != undefined && this.props.type != this.type){
      this.type = this.props.type
    }
  }

  render() {
    this._init()
    var titleStyle = {}
    var inputContainerStyle = {}
    if(this.state.isFocus){
      titleStyle = {
        color: this.tintColor
      }
      inputContainerStyle = {
        borderColor: this.tintColor
      }
    }
    if(this.state.errorMessage.length>0){
      inputContainerStyle = {
        borderColor: this.errorColor
      }
    }
    return (
      <TouchableOpacity
        style={[{
          width: "100%",
          paddingHorizontal: 17
        },this.props.containerStyle]}
        onPress={this._getFocus}>
        <View style={{flexDirection: 'row'}}>
          <Text
            allowFontScaling={false}
            style={[this.titleTextStyle, this.props.titleTextStyle,titleStyle]}>
            {this.title}
          </Text>
          {this.props.tooltip?(
            <View style={{ marginLeft: 5, flexDirection: 'row' }}>
                <Common_ToolsTip
                  message={this.props.tooltipMessage}
                />
            </View>
          ):<View/>}
        </View>
        <View style={[{zIndex:-1},this.inputContainerStyle, this.props.inputContainerStyle, inputContainerStyle]}>
          {this.type=="phone"? (
            <TouchableWithoutFeedback
              underlayColor={"transparent"}
              onPress={this._getFocus}>
              <View>
                <Text allowFontScaling={false} style={[this.regionCodeStyle, this.props.regionCodeStyle]}>+65</Text>
              </View>
            </TouchableWithoutFeedback>
          ):<View/>}
          <View
          style={{
            justifyContent: 'center',
            display:(this.props.prefix!= undefined) ? 'flex' : 'none'}}>
            <Text allowFontScaling={false} style={[
              this.inputTextStyle,
              this.props.inputTextStyle]}
              numberOfLines={1}>
              {this.props.prefix}
            </Text>
          </View>
          <View style={{flex: 1, justifyContent:'center', flexDirection: 'row'}}>
            {this.props.isLocation && (
            <Image
              style={{
                width: 23,
                height: 23,
                marginTop: 10,
                marginLeft: 10,
                marginRight: 10,
                alignItems: 'center'
              }}
              source={icon}
            />
            )}
            <TextInput
              allowFontScaling={false}
              ref={"input"}
              editable={this.props.editable != undefined ? this.props.editable : true}
              pointerEvents={this.props.pointerEvents}
              returnKeyType='done'
              placeholder={this.props.placeholder}
              style={[this.inputTextStyle, this.props.inputTextStyle]}
              maxLength = {this.maxLength}
              autoFocus={this.props.autoFocus}
              autoCorrect = {false}
              spellCheck = {false}
              caretHidden = {false}
              autoCapitalize = {this.autoCapitalize}
              secureTextEntry = {this.secureTextEntry}
              underlineColorAndroid = {"transparent"}
              keyboardType = {this.keyboardType}
              onChangeText={(value) => this._handleOnChange(value)}
              value={this.state.value}
              onBlur={()=>this._handleToggleFocus(false)}
              onFocus={()=>this._handleToggleFocus(true)}
              onSubmitEditing={()=>{
                if(this.props.onSubmit){
                  this.props.onSubmit(this.props.id)
                }
              }}
             ></TextInput>
          </View>
        </View>
        <Text allowFontScaling={false} style={[this.errorTextStyle, this.props.errorTextStyle]}>
          {this.state.errorMessage}
        </Text>
      </TouchableOpacity>
    )
  }
}
