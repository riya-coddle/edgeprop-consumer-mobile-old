import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';
import { CachedImage } from 'react-native-cached-image';
//import Image from '../Common_Image/Common_Image';

export default class Common_PinMarker extends Component {
  constructor(props) {
    super(props);
    this.state={
      showText:false
    }
    this._onPress = this._onPress.bind(this);
    this._onLongPress = this._onLongPress.bind(this);
    this.style = {
      // default value
      // component
      backgroundColor: 'rgba(0,0,0,0)',
      padding: 0,
      paddingHorizontal: 0,
      paddingVertical: 0,
      borderRadius: 0,
      borderWidth: 0,
      borderColor: '#fff',
      type: 'icon', // icon , text ,icon-text
      underlayColor: 'rgba(0,0,0,0)',
      // icon
      imageSource: { uri: '/' },
      imageHeight: 30,
      imageWidth: 30,
      imageResizeMode: 'contain',
      imageBorderRadius: 0,
      imageBorderWidth: 0,
      imageBorderColor: '#fff',
      // text
      textValue: '',
      textPosition: 'top', // top, right , botton, left
      textSize: 12,
      textColor: '#000',
      fontFamily: 'Poppins-Medium',
      fontStyle: 'normal',
      textWidth: null,
      gapAround: {
        marginTop: 1.5,
        marginRight: 1.5,
        marginBottom: 1.5,
        marginLeft: 1.5
      }
    };
  }

  _onPress() {
    if (this.props.onPress) {
      this.props.onPress();
    }
  }

  _onLongPress() {
    if (this.props.onLongPress) {
      this.props.onLongPress();
    }
  }

  _init() {
    if (this.props.height && this.props.height != this.style.height) {
      this.style.height = this.props.height;
    }
    if (this.props.width && this.props.width != this.style.width) {
      this.style.width = this.props.width;
    }
    if (
      this.props.backgroundColor &&
      this.props.backgroundColor != this.style.backgroundColor
    ) {
      this.style.backgroundColor = this.props.backgroundColor;
    }
    if (this.props.padding && this.props.padding != this.style.padding) {
      this.style.padding = this.props.padding;
    }
    if (
      this.props.paddingVertical &&
      this.props.paddingVertical != this.style.paddingVertical
    ) {
      this.style.paddingVertical = this.props.paddingVertical;
    }
    if (
      this.props.paddingHorizontal &&
      this.props.paddingHorizontal != this.style.paddingHorizontal
    ) {
      this.style.paddingHorizontal = this.props.paddingHorizontal;
    }
    if (
      this.props.borderRadius &&
      this.props.borderRadius != this.style.borderRadius
    ) {
      this.style.borderRadius = this.props.borderRadius;
    }
    if (
      this.props.borderWidth &&
      this.props.borderWidth != this.style.borderWidth
    ) {
      this.style.borderWidth = this.props.borderWidth;
    }
    if (
      this.props.borderColor &&
      this.props.borderColor != this.style.borderColor
    ) {
      this.style.borderColor = this.props.borderColor;
    }
    if (this.props.type && this.props.type != this.style.type) {
      this.style.type = this.props.type;
    }
    if (
      this.props.underlayColor &&
      this.props.underlayColor != this.style.underlayColor
    ) {
      this.style.underlayColor = this.props.underlayColor;
    }
    if (
      this.props.imageHeight &&
      this.props.imageHeight != this.style.imageHeight
    ) {
      this.style.imageHeight = this.props.imageHeight;
    }
    if (
      this.props.imageWidth &&
      this.props.imageWidth != this.style.imageWidth
    ) {
      this.style.imageWidth = this.props.imageWidth;
    }
    if (
      this.props.imageResizeMode &&
      this.props.imageResizeMode != this.style.imageResizeMode
    ) {
      this.style.imageResizeMode = this.props.imageResizeMode;
    }
    if (
      this.props.imageSource &&
      this.props.imageSource != this.style.imageSource
    ) {
      this.style.imageSource = this.props.imageSource;
    }
    if (
      this.props.imageBorderRadius &&
      this.props.imageBorderRadius != this.style.imageBorderRadius
    ) {
      this.style.imageBorderRadius = this.props.imageBorderRadius;
    }
    if (
      this.props.imageBorderWidth &&
      this.props.imageBorderWidth != this.style.imageBorderWidth
    ) {
      this.style.imageBorderWidth = this.props.imageBorderWidth;
    }
    if (
      this.props.imageBorderColor &&
      this.props.imageBorderColor != this.style.imageBorderColor
    ) {
      this.style.imageBorderColor = this.props.imageBorderColor;
    }
    if (this.props.textValue && this.props.textValue != this.style.textValue) {
      this.style.textValue = this.props.textValue;
    }
    if (
      this.props.textPosition &&
      this.props.textPosition != this.style.textPosition
    ) {
      this.style.textPosition = this.props.textPosition;
    }
    if (this.props.textSize && this.props.textSize != this.style.textSize) {
      this.style.textSize = this.props.textSize;
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
    if (this.props.fontStyle && this.props.fontStyle != this.style.fontStyle) {
      this.style.fontStyle = this.props.fontStyle;
    }
    if (this.props.textWidth && this.props.textWidth != this.style.textWidth) {
      this.style.textWidth = this.props.textWidth;
    }
    if (
      this.props.gapAround &&
      JSON.stringify(this.props.gapAround) !=
        JSON.stringify(this.style.gapAround)
    ) {
      this.style.gapAround = this.props.gapAround;
    }
  }

  render() {
    this._init();
    const imageStyle = {
      height: this.style.imageHeight,
      width: this.style.imageWidth,
      borderRadius: this.style.imageBorderRadius,
      borderWidth: this.style.imageBorderWidth,
      borderColor: this.style.imageBorderColor
    };
    return (
      <View>
        <CachedImage onLoad={()=>{this.setState({showText:true})}} style={[imageStyle]} source={this.style.imageSource}>
          <View display={this.state.showText?"flex":"none"} style={{ flex: 1, alignItems: 'center', paddingTop: 10 }}>
            <Text
              allowFontScaling={false}
              style={{
                color: '#ffff',
                fontSize: 11,
                fontFamily: 'Poppins-SemiBold'
              }}
            >
              {this.props.overlayText}
            </Text>
          </View>
        </CachedImage>
        {/* <Image
          source={this.style.imageSource}
          style={[this.style.gapAround,imageStyle]}
          overlayText={"test"}
        /> */}
      </View>
    );
  }
}
