import React, { Component } from 'React'

import { TouchableHighlight, View, StyleSheet, Text } from 'react-native'
import Image from '../Common_Image/Common_Image'
/**
 * Common_IconMenu
 * - icon (4-direction) with/without text
 * - text without icon
 * - handle onPress event to navigate to other screen
 */

class Common_IconMenu extends Component {

    constructor(props) {
        super(props)
        this.state = {}
        this._onPress = this._onPress.bind(this)

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
            imageSource: {uri: '/'},
            imageHeight: 20,
            imageWidth: 20,
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
                marginTop: 0,
                marginRight: 1.5,
                marginBottom: 0,
                marginLeft: 1.5,
            },
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if((nextProps.imageSource!= undefined && nextProps.imageSource !== this.style.imageSource) || (nextProps.textValue != undefined && nextProps.textValue!== this.style.textValue)){
            return true
        }
        else{
            return false
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.imageSource !== this.style.imageSource || nextProps.textValue !== this.style.textValue) {
            // do something here
            // console.log('change value on IconMenu')
        }
    }

    _initStyle() {
        if (this.props.height && this.props.height != this.style.height) {
            this.style.height = this.props.height
        }
        if (this.props.width && this.props.width != this.style.width) {
            this.style.width = this.props.width
        }
        if (this.props.backgroundColor && this.props.backgroundColor != this.style.backgroundColor) {
            this.style.backgroundColor = this.props.backgroundColor
        }
        if (this.props.padding && this.props.padding != this.style.padding) {
            this.style.padding = this.props.padding
        }
        if (this.props.paddingVertical && this.props.paddingVertical != this.style.paddingVertical) {
            this.style.paddingVertical = this.props.paddingVertical
        }
        if (this.props.paddingHorizontal && this.props.paddingHorizontal != this.style.paddingHorizontal) {
            this.style.paddingHorizontal = this.props.paddingHorizontal
        }
        if (this.props.borderRadius && this.props.borderRadius != this.style.borderRadius) {
            this.style.borderRadius = this.props.borderRadius
        }
        if (this.props.borderWidth && this.props.borderWidth != this.style.borderWidth) {
            this.style.borderWidth = this.props.borderWidth
        }
        if (this.props.borderColor && this.props.borderColor != this.style.borderColor) {
            this.style.borderColor = this.props.borderColor
        }
        if (this.props.type && this.props.type != this.style.type) {
            this.style.type = this.props.type
        }
        if (this.props.underlayColor && this.props.underlayColor != this.style.underlayColor) {
            this.style.underlayColor = this.props.underlayColor
        }
        if (this.props.imageHeight && this.props.imageHeight != this.style.imageHeight) {
            this.style.imageHeight = this.props.imageHeight
        }
        if (this.props.imageWidth && this.props.imageWidth != this.style.imageWidth) {
            this.style.imageWidth = this.props.imageWidth
        }
        if (this.props.imageResizeMode && this.props.imageResizeMode != this.style.imageResizeMode) {
            this.style.imageResizeMode = this.props.imageResizeMode
        }
        if (this.props.imageSource && this.props.imageSource != this.style.imageSource) {
            this.style.imageSource = this.props.imageSource
        }
        if (this.props.imageBorderRadius && this.props.imageBorderRadius != this.style.imageBorderRadius) {
            this.style.imageBorderRadius = this.props.imageBorderRadius
        }
        if (this.props.imageBorderWidth && this.props.imageBorderWidth != this.style.imageBorderWidth) {
            this.style.imageBorderWidth = this.props.imageBorderWidth
        }
        if (this.props.imageBorderColor && this.props.imageBorderColor != this.style.imageBorderColor) {
            this.style.imageBorderColor = this.props.imageBorderColor
        }
        if (this.props.textValue && this.props.textValue != this.style.textValue) {
            this.style.textValue = this.props.textValue
        }
        if (this.props.textPosition && this.props.textPosition != this.style.textPosition) {
            this.style.textPosition = this.props.textPosition
        }
        if (this.props.textSize && this.props.textSize != this.style.textSize) {
            this.style.textSize = this.props.textSize
        }
        if (this.props.textColor && this.props.textColor != this.style.textColor) {
            this.style.textColor = this.props.textColor
        }
        if (this.props.fontFamily && this.props.fontFamily != this.style.fontFamily) {
            this.style.fontFamily = this.props.fontFamily
        }
        if (this.props.fontStyle && this.props.fontStyle != this.style.fontStyle) {
            this.style.fontStyle = this.props.fontStyle
        }
        if (this.props.textWidth && this.props.textWidth != this.style.textWidth) {
            this.style.textWidth = this.props.textWidth
        }
        if (this.props.gapAround && JSON.stringify(this.props.gapAround) != JSON.stringify(this.style.gapAround)) {
            this.style.gapAround = this.props.gapAround
        }
        if (this.props.textNewStyle && JSON.stringify(this.props.textNewStyle) != JSON.stringify(this.style.textNewStyle)) {
            this.style.textNewStyle = this.props.textNewStyle
        }
        if (this.props.iconStyle && JSON.stringify(this.props.iconStyle) != JSON.stringify(this.style.iconStyle)) {
            this.style.iconStyle = this.props.iconStyle
        }
    }

    _onPress() {
        if (this.props.onPress) {
            this.props.onPress()
        }
    }

    render() { 
        var _renderIcon = () => {
            if (this.style.type === 'icon') {
                return _renderIconWithImageOnly()
            } else if (this.style.type === 'text') {
                return _renderIconWithTextOnly()
            } else if (this.style.type === 'icon-text') {
                return _renderIconWithImageAndText()
            }
        }

        var _renderIconWithTextOnly = () => {
            // console.log('[DEBUG]', 'render text only')
            const textStyle = {
                fontFamily: this.style.fontFamily,
                color: this.style.textColor,
                fontSize: this.style.textSize,
                fontStyle: this.fontStyle,
            }

            return (
                <View>
                    <Text
                        allowFontScaling={false}
                        style={[
                            textStyle
                        ]} >
                        {this.style.textValue}
                    </Text>
                </View>
            )
        }

        var _renderIconWithImageOnly = () => {
           //  console.log('[DEBUG]', 'render image only')
            const imageStyle = {
                height: this.style.imageHeight,
                width: this.style.imageWidth,
                borderRadius: this.style.imageBorderRadius,
                borderWidth: this.style.imageBorderWidth,
                borderColor: this.style.imageBorderColor,
            }

            return (
                <View style={[this.props.isSearch == true ?styles.isSearch: styles.paddingCheck]}>
                    <Image
                        defaultSource={this.props.defaultSource}
                        source={this.style.imageSource}
                        resizeMode={this.style.imageResizeMode}
                        style={ imageStyle } />
                </View>
            )
        }

        var _renderIconWithImageAndText = () => {
            // console.log('[DEBUG]', 'render image with text')
            const textStyle = {
                fontFamily: this.style.fontFamily,
                color: this.style.textColor,
                fontSize: this.style.textSize,
                fontStyle: this.style.fontStyle,
                width: this.style.textWidth,
            }
            const imageStyle = {
                height: this.style.imageHeight,
                width: this.style.imageWidth,
                borderRadius: this.style.imageBorderRadius,
                borderWidth: this.style.imageBorderWidth,
                borderColor: this.style.imageBorderColor,
            }

            if (this.style.textPosition === 'top') {
                return (
                    <View style={[styles.columnLayout]}>
                        <Text
                            allowFontScaling={false}
                            style={{...textStyle,...this.style.gapAround}}>
                            {this.style.textValue}
                        </Text>
                        <Image
                            defaultSource={this.props.defaultSource}
                            source={this.style.imageSource}
                            resizeMode={this.style.imageResizeMode}
                            style={[
                                this.style.gapAround,
                                imageStyle,
                            ]} />
                    </View>
                )
            } else if (this.style.textPosition === 'right') {
                return (
                    <View style={[styles.rowLayout]}>
                        <Image
                            defaultSource={this.props.defaultSource}
                            source={this.style.imageSource}
                            resizeMode={this.style.imageResizeMode}
                            style={[
                                this.style.gapAround,
                                imageStyle,
                                this.style.iconStyle,
                            ]} />
                        <Text
                            allowFontScaling={false}
                            style={{...textStyle,...this.style.gapAround,...this.style.textNewStyle}}>
                            {this.style.textValue}
                        </Text>
                    </View>
                )
            } else if (this.style.textPosition === 'bottom') {
                return (
                    <View style={[styles.columnLayout]}>
                        <Image
                            defaultSource={this.props.defaultSource}
                            source={this.style.imageSource}
                            resizeMode={this.style.imageResizeMode}
                            style={[
                                this.style.gapAround,
                                imageStyle
                            ]} />
                        <Text allowFontScaling={false} style={{...textStyle,...this.style.gapAround}}>
                            {this.style.textValue}
                        </Text>
                    </View>
                )
            } else if (this.style.textPosition === 'left') {
                return (
                    <View
                        style={[styles.rowLayout]}>
                        <Text
                            allowFontScaling={false}
                            ellipsizeMode= {this.props.ellipsize==true ? 'tail' : null}
                            numberOfLines={this.props.ellipsize==true ? 1 : null}
                            style={{...textStyle,...this.style.gapAround}}>
                            {this.style.textValue}
                        </Text>
                        <Image
                            defaultSource={this.props.defaultSource}
                            source={this.style.imageSource}
                            resizeMode={this.style.imageResizeMode}
                            style={
                              [
                                this.style.gapAround,
                                imageStyle,
                            ]
                          } />
                    </View>
                )
            }
        }

        this._initStyle()

        var paddingVertical = this.style.padding, paddingHorizontal = this.style.padding;
        if(this.style.paddingVertical > 0){
          paddingVertical = this.style.paddingVertical
        }
        if(this.style.paddingHorizontal > 0){
          paddingHorizontal = this.style.paddingHorizontal
        }
        var containerStyle = {
            height: this.style.height,
            width: this.style.width,
            backgroundColor: this.style.backgroundColor,
            paddingVertical: paddingVertical,
            paddingHorizontal: this.props.paddingHorizontal? this.props.paddingHorizontal : 48,
            borderRadius: this.style.borderRadius,
            borderWidth: this.style.borderWidth,
            borderColor: this.style.borderColor,
        }

        //console.log('containerStyle', containerStyle);
        // handler if able to press
        if (this.props.onPress) {
            return (
                <TouchableHighlight
                    style={[
                        styles.container,
                        containerStyle
                    ]}
                    // The color of the underlay that will show through when the touch is active
                    underlayColor={this.style.underlayColor}
                    onPress={this._onPress}
                >
                    {_renderIcon()}
                </TouchableHighlight>
            )
        }

        return (
            <View> 
            {this.props.isPropertyList && (
                <View
                style={
                    [
                       styles.container,
                       styles.searchIcons
                     ]
                }>
                {_renderIcon()}
            </View>

            )}
            {!this.props.isPropertyList && this.props.type != 'icon' &&  ( 
                <View
                    style={
                        [
                            styles.container,
                            containerStyle
                        ]
                    }>
                    {_renderIcon()}
                 </View>

            )}
            {!this.props.isPropertyList  && this.props.type == 'icon' && (
                <View
                style={[
                        styles.iconContainer,
                        containerStyle
                    ]}>
                {_renderIcon()}
                </View>
            )}
          </View>  
        )
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchIcons: {
        justifyContent: 'center',
        paddingRight: 8,
        position: 'relative',
        top: -4

   },
    iconContainer : {
        justifyContent: 'flex-start',
    },
    columnLayout: {
        // flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowLayout: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    isSearch: {
        alignItems: 'flex-end',
        backgroundColor: 'red',
    },
    test: {
        backgroundColor: 'red'
    },
    
})

export default Common_IconMenu
