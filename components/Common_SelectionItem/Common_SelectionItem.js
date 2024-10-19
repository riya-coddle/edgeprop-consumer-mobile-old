import React, { Component } from 'react';
import { View, Text, TouchableOpacity,TouchableHighlight, Alert } from 'react-native';
import Common_SelectionBox from '../Common_SelectionBox/Common_SelectionBox';

export default class Common_SelectionListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.style = {
      paddingLeft: 31,
      paddingVertical: 13.4,
      justifyContent: 'space-between',
      borderStyle: 'solid',
      borderLeftWidth: 0,
      borderColor: '',
      fontSize: 15,
      textColor: '#4a4a4a',
      fontFamily: 'Poppins-Medium',
      width: 270
    };
    this.item = '';
    this._onPress = this._onPress.bind(this);
  }
  _initItem() {
    //init data
    if (this.props.item && this.props.item != this.item) {
      this.item = this.props.item;
    }
  }
  _initStyle() {
    //init style
    if (
      this.props.paddingLeft &&
      this.props.paddingLeft != this.style.paddingLeft
    ) {
      this.style.paddingLeft = this.props.paddingLeft;
    }
    if (
      this.props.paddingVertical &&
      this.props.paddingVertical != this.style.paddingVertical
    ) {
      this.style.paddingVertical = this.props.paddingVertical;
    }
    if (
      this.props.justifyContent &&
      this.props.justifyContent != this.style.justifyContent
    ) {
      this.style.justifyContent = this.props.justifyContent;
    }
    if (
      this.props.borderBottomColor &&
      this.props.borderBottomColor != this.style.borderBottomColor
    ) {
      this.style.borderBottomColor = this.props.borderBottomColor;
    }
    if (
      this.props.borderBottomWidth &&
      this.props.borderBottomWidth != this.style.borderBottomWidth
    ) {
      this.style.borderBottomWidth = this.props.borderBottomWidth;
    }
    if (
      this.props.borderStyle &&
      this.props.borderStyle != this.style.borderStyle
    ) {
      this.style.borderStyle = this.props.borderStyle;
    }
    if (
      this.props.borderLeftWidth &&
      this.props.borderLeftWidth != this.style.borderLeftWidth
    ) {
      this.style.borderLeftWidth = this.props.borderLeftWidth;
    }
    if (
      this.props.borderColor &&
      this.props.borderColor != this.style.borderColor
    ) {
      this.style.borderColor = this.props.borderColor;
    }
    if (this.props.fontSize && this.props.fontSize != this.style.fontSize) {
      this.style.fontSize = this.props.fontSize;
    }
    if (this.props.textColor && this.props.textColor != this.style.textColor) {
      this.style.textColor = this.props.textColor;
    }
    if (
      this.props.fontFamily &&
      this.props.fontFamily != this.style.fontFamily
    ) {
      this.style.fontFamily = this.props.fontFamily;
    }
    if (this.props.width && this.props.width != this.style.width) {
      this.style.width = this.props.width;
    }
  }
  _onPress(isSelected, name) {
    if (this.props.onPress) {
      this.props.onPress(isSelected, name);
    }
  }
  // shouldComponentUpdate(nextProps){
  //   return(this.props.item!==nextProps.item)
  // }
  render() {
    this._initItem();
    this._initStyle();
    return this.props.checkBox == true ? (
      <TouchableHighlight
        onPress={()=>{
          if(this.refs.checkbox!=undefined){
            this.refs.checkbox._onPress();
          }
        }}
        underlayColor={"#fff"}
        activeOpacity={0.2}
        style={{
          borderLeftWidth: this.style.borderLeftWidth,
          borderColor: this.style.borderColor
        }}
      >
        <View
          style={{
            paddingLeft: this.style.paddingLeft,
            paddingVertical: this.style.paddingVertical,
            justifyContent: this.style.justifyContent,
            borderBottomColor: this.style.borderBottomColor,
            borderBottomWidth: this.style.borderBottomWidth,
            borderStyle: this.style.borderStyle,
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
            <View style={{ width: '80%', marginLeft: -10 }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: this.style.fontSize,
                    color: this.style.textColor,
                    fontFamily: this.style.fontFamily,
                    width: this.style.width
                  }}
                >
                  {this.item.value||this.item.name}
                </Text>
            </View>
            <View style={{ width: '20%', right: 0 }}>
              <Common_SelectionBox
                ref={"checkbox"}
                onPress={this._onPress}
                data={this.item}
                marginVertical={this.props.marginVerticalCheckBox}
                triggerSelection = {this.props.triggerSelection}
              />
            </View>
        </View>
      </TouchableHighlight>
    ) : (
      <TouchableOpacity onPress={() => this._onPress(null, this.item)}>
        <View
          style={{
            borderLeftWidth: this.style.borderLeftWidth,
            borderColor: this.style.borderColor
          }}
        >
          <View
            style={{
              paddingLeft: this.style.paddingLeft,
              paddingVertical: this.style.paddingVertical,
              justifyContent: this.style.justifyContent,
              borderBottomColor: this.style.borderBottomColor,
              borderBottomWidth: this.style.borderBottomWidth,
              borderStyle: this.style.borderStyle,
              flexDirection: 'row'
            }}
          >
            <Text
              allowFontScaling={false}
              style={{
                fontSize: this.style.fontSize,
                color: this.style.textColor,
                fontFamily: this.style.fontFamily,
                width: this.style.width
              }}
            >
              {this.item.value || this.item}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
