import React, { Component } from 'React'
import {
  Platform,
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableHighlight,
  Alert,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import Image from '../Common_Image/Common_Image'
export default class ListingDirectionListItem extends Component {

  constructor(props) {
    super(props)
    this._onPress = this._onPress.bind(this)
    this.item = {}
    this.isActive = false

    this.style = {
      // default value
      textColor: 'rgb(39,80,117)',
      textColorActive: 'rgb(255,255,255)',
      marginVertical: 7,
      marginHorizontal: 0,
      paddingVertical: 10,
      paddingHorizontal: 28,
      alignItems: 'flex-start',
      justifyContent: 'center',
      backgroundColor: 'rgb(243,246,249)',
      backgroundColorActive: 'rgb(39,80,117)',
      width: '100%',
      height: 55,
      borderRadius: 5,
      borderColor: 'rgb(39,80,117)',
      borderWidth: 1
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (JSON.stringify(nextProps.item) != JSON.stringify(this.props.item) ||
      nextProps.isActive != this.props.isActive)
  }

  _init() {
    if (this.props.item != undefined && JSON.stringify(this.props.item) != JSON.stringify(this.item)) {
      this.item = this.props.item
    }
    if (this.props.isActive != undefined && JSON.stringify(this.props.isActive) != JSON.stringify(this.isActive)) {
      this.isActive = this.props.isActive
    }
  }

  _onPress() {
    if (this.props.onPress) {
      this.props.onPress(this.item)
    }
  }

  render() {
    this._init()

    return (
      <TouchableOpacity
        onPress={this._onPress}
        style={
          {
            marginVertical: this.style.marginVertical,
            marginHorizontal: this.style.marginHorizontal,
            paddingVertical: this.style.paddingVertical,
            paddingHorizontal: this.style.paddingHorizontal,
            alignItems: this.style.alignItems,
            justifyContent: this.style.justifyContent,
            backgroundColor: this.isActive ? this.style.backgroundColorActive : this.style.backgroundColor,
            width: this.style.width,
            height: this.style.height,
            borderRadius: this.style.borderRadius,
            borderColor: this.style.borderColor,
            borderWidth: this.style.borderWidth,
          }}>
        <View style={{ flexDirection: "row", alignItems: 'center' }}>
          <Image
            style={{ width: 30, height: 30, marginRight: 17.5 }}
            source={this.isActive ? this.item.activeIcon : this.item.icon}
            resizeMode={'contain'} />
          <View>
            <Text allowFontScaling={false} style={
              {
                fontSize: 13,
                fontFamily: 'Poppins-Medium',
                color: this.isActive ? this.style.textColorActive : this.style.textColor,
              }}>
              {`${this.item.duration} by ${this.item.type}`}
            </Text>
            <Text allowFontScaling={false} style={
              {
                fontSize: 12,
                fontFamily: 'Poppins-Regular',
                color: this.isActive ? this.style.textColorActive : this.style.textColor,
              }}>
              {this.item.distance}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}