import React, { Component } from 'react'
import {
    Platform,
    StyleSheet,
    Text,
    TextInput,
    View,
    Alert,
    ScrollView,
    Dimensions,
    TouchableOpacity,
} from 'react-native'

export default class Tools_TextBox extends Component {
    hintColor = "#c8c7cc"
    inputColor = "#4a4a4a"
    keyboardType = "numeric"
    maxLength = 10
    constructor(props) {
        super(props)
        this.state = {
          value: this.props.defaultValue || ""
        }
        this.containerStyle = {
          backgroundColor: "white",
          // marginBottom: 13
        }
        this.titleContainerStyle={
          height: 58,
          alignItems: "flex-start",
          justifyContent: "center",
          paddingLeft: 13,
        }
        this.fieldContainerStyle={
          height: 50,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: "#c8c7cc",
          paddingLeft: 13,
        }
        this.titleTextStyle={
          fontFamily: "Poppins-Regular",
          fontSize: 16,
          lineHeight: 38,
          color: "#275075"
        }
        this.fieldTextStyle={
          fontFamily: "Poppins-Medium",
          fontSize: 15,
          letterSpacing: 0.2,
          lineHeight: 22.5,
          // height: 22.5
        }
        this._handleOnChange = this._handleOnChange.bind(this)
        this._getFocus = this._getFocus.bind(this)
    }

    _init(){
        if(this.props.containerStyle != undefined){
            this.containerStyle = {...this.containerStyle, ...this.props.containerStyle}
        }
        if(this.props.titleContainerStyle != undefined){
            this.titleContainerStyle = {...this.titleContainerStyle, ...this.props.titleContainerStyle}
        }
        if(this.props.fieldContainerStyle != undefined){
            this.fieldContainerStyle = {...this.fieldContainerStyle, ...this.props.fieldContainerStyle}
        }
        if(this.props.titleTextStyle != undefined){
            this.titleTextStyle = {...this.titleTextStyle, ...this.props.titleTextStyle}
        }
        if(this.props.fieldTextStyle != undefined){
            this.fieldTextStyle = {...this.fieldTextStyle, ...this.props.fieldTextStyle}
        }
    }

    _handleOnChange(value){
      this.setState({
        value: value
      })
      if(this.props.onChange != undefined){
        this.props.onChange(this.props.id, value)
      }
    }

    _getFocus(){
      this.refs.input.focus()
    }

    render() {
      this._init()
      return(
        <View style={this.containerStyle}>
          <View style={this.titleContainerStyle}>
            <Text allowFontScaling={false} style={this.titleTextStyle}>
              {this.props.title}
            </Text>
          </View>
          <View style={this.fieldContainerStyle}>
            <View style={{flex: 1, justifyContent: "center"}}>
              <TextInput
                  allowFontScaling={false}
                  ref={"input"}
                  returnKeyType='done'
                  placeholderTextColor={this.hintColor}
                  placeholder={this.props.hint}
                  style={[this.fieldTextStyle, {color:this.inputColor}]}
                  maxLength = {this.maxLength}
                  autoCorrect = {false}
                  spellCheck = {false}
                  caretHidden = {false}
                  underlineColorAndroid = {"transparent"}
                  keyboardType = {this.keyboardType}
                  onChangeText={(value) => this._handleOnChange(value)}
                  value={this.state.value}
                  // onBlur={()=>this._handleToggleFocus(false)}
                  // onFocus={()=>this._handleToggleFocus(true)}
                  onSubmitEditing={()=>{
                    if(this.props.onSubmit){
                      this.props.onSubmit(this.props.id)
                    }
                  }}
                 >
              </TextInput>
            </View>
          </View>
        </View>
      )
    }
}
