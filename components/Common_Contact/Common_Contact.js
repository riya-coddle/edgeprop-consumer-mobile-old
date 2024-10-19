import React, { Component } from 'React'
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
    Dimensions
} from 'react-native'
import Common_AvatarIcon from '../Common_AvatarIcon/Common_AvatarIcon'
export default class Common_Contact extends Component {

    constructor(props) {
        super(props)
        this.state = {}

        this.style = {
            // default value
            margin: 0,
            marginTop: 15,
            marginLeft: 15,
            marginRight: 10,
            marginBottom: 20,
            gabSize: 17,
            backgroundColor: '#fff',
            alignItems: 'flex-start',
            textColor: '#4A4A4A',
            fontFamily: 'Poppins-Medium',
            contentFontFamily: 'Poppins-Regular',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: 15,
            contentFontSize: 13,
            lineHeight: 25,
            contentLineHeight: 22,
        }
        this.item = {
            name : '',
            agencyName: '',
            regNumber: '',
            phoneNumber: '',
            image: 'https://sg.tepcdn.com/images/avatar.png',
        }
    }

    _initStyle() {
        // init margin
        if (this.props.margin && this.props.margin != this.style.margin) {
            this.style.margin = this.props.margin
        }
        // init marginTop
        if (this.props.marginTop && this.props.marginTop != this.style.marginTop) {
            this.style.marginTop = this.props.marginTop
        }
        // init marginLeft
        if (this.props.marginLeft && this.props.marginLeft != this.style.marginLeft) {
            this.style.marginLeft = this.props.marginLeft
        }
        // init marginRight
        if (this.props.marginRight && this.props.marginRight != this.style.marginRight) {
            this.style.marginRight = this.props.marginRight
        }
        // init marginBottom
        if (this.props.marginBottom && this.props.marginBottom != this.style.marginBottom) {
            this.style.marginBottom = this.props.marginBottom
        }
        // init gabSize
        if (this.props.gabSize && this.props.gabSize != this.style.gabSize) {
            this.style.gabSize = this.props.gabSize
        }
        // init backgroundColor
        if (this.props.backgroundColor && this.props.backgroundColor != this.style.backgroundColor) {
            this.style.backgroundColor = this.props.backgroundColor
        }
        // init alignItems
        if (this.props.alignItems && this.props.alignItems != this.style.alignItems) {
            this.style.alignItems = this.props.alignItems
        }
        // init textColor
        if (this.props.textColor && this.props.textColor != this.style.textColor) {
            this.style.textColor = this.props.textColor
        }
        // init fontFamily
        if (this.props.fontFamily && this.props.fontFamily != this.style.fontFamily) {
            this.style.fontFamily = this.props.fontFamily
        }
        // init fontStyle
        if (this.props.fontStyle && this.props.fontStyle != this.style.fontStyle) {
            this.style.fontStyle = this.props.fontStyle
        }
        // init fontWeight
        if (this.props.fontWeight && this.props.fontWeight != this.style.fontWeight) {
            this.style.fontWeight = this.props.fontWeight
        }
        // init fontSize
        if (this.props.fontSize && this.props.fontSize != this.style.fontSize) {
            this.style.fontSize = this.props.fontSize
        }
        // init lineHeight
        if (this.props.lineHeight && this.props.lineHeight != this.style.lineHeight) {
            this.style.lineHeight = this.props.lineHeight
        }
        // init contentLineHeight
        if (this.props.contentLineHeight && this.props.contentLineHeight != this.style.contentLineHeight) {
            this.style.contentLineHeight = this.props.contentLineHeight
        }
        // init contentFontFamily
        if (this.props.contentFontFamily && this.props.contentFontFamily != this.style.contentFontFamily) {
            this.style.contentFontFamily = this.props.contentFontFamily
        }
        // init contentFontSize
        if (this.props.contentFontSize && this.props.contentFontSize != this.style.contentFontSize) {
            this.style.contentFontSize = this.props.contentFontSize
        }
    }

    _initStyle() {
        // init name
        if (this.props.data.name && this.props.data.name != this.item.name) {
            this.item.name = this.props.data.name
        }
        // init agencyName
        if (this.props.data.agencyName && this.props.data.agencyName != this.item.agencyName) {
            this.item.agencyName = this.props.data.agencyName.replace("&amp;","&")
        }
        // init regNumber
        if (this.props.data.regNumber && this.props.data.regNumber != this.item.regNumber) {
            this.item.regNumber = this.props.data.regNumber
        }
        // init phoneNumber
        if (this.props.data.phoneNumber && this.props.data.phoneNumber != this.item.phoneNumber) {
            this.item.phoneNumber = this.props.data.phoneNumber
        }
        // init image
        if (this.props.data.image && this.props.data.image != this.item.image) {
            this.item.image = this.props.data.image
        }
    }
    shouldComponentUpdate(nextProps, nextState){
        return (JSON.stringify(nextProps.item) != JSON.stringify(this.item))
    }
    render() {
        this._initStyle()
        this._initStyle()
        if(this.item.name != undefined && this.item.name.length>0){
          return (
              <View style={{
                  borderTopWidth: 0.5,
                  borderTopColor: 'grey',
                  borderBottomWidth: 0.5,
                  borderBottomColor: 'grey'
              }}>
                  <View style={{
                      flexDirection:'row',
                      marginTop: this.style.marginTop,
                      marginLeft: this.style.marginLeft,
                      marginRight: this.style.marginRight,
                      marginBottom: this.style.marginBottom,
                  }}>
                      <Common_AvatarIcon image={{uri: this.item.image}}/>
                      <View style={{marginLeft:this.style.gabSize}}>
                          <Text allowFontScaling={false} style={{
                              fontSize: this.style.fontSize,
                              fontFamily: this.style.fontFamily,
                              lineHeight: this.style.lineHeight,
                              color: this.style.textColor,
                          }}>{this.item.name}</Text>
                          <Text allowFontScaling={false} style={{
                              fontSize: this.style.contentFontSize,
                              fontFamily: this.style.contentFontFamily,
                              lineHeight: this.style.contentLineHeight,
                              color: this.style.textColor
                          }}>{this.item.agencyName+'\nReg number: '+ this.item.regNumber+'\n'+this.item.phoneNumber}</Text>
                      </View>
                  </View>
              </View>
          )
        }
        return(<View/>)
    }
}
