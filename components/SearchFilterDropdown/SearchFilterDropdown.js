import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Image
} from 'react-native'
import IconMenu from '../Common_IconMenu/Common_IconMenu'


var dropdownIcon = require('../../assets/icons/Down-arrow.png')

class SearchFilterDropdown extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.titleStyle = {
            color: 'rgb(47,47,47)',
            fontFamily: 'Poppins-Regular',
            fontSize: 15,
            marginBottom: 3,
        }
        this.valueTextStyle = {
            color: 'rgb(47,47,47)',
            fontFamily: 'Poppins-Light',
            fontSize: 15,
        }
        this.style = {
            backgroundColor: 'rgb(255,255,255)',
            width: '100%',
            height: 32,
            borderRadius: 5,
            borderWidth: 1.5,
            borderColor: 'rgb(238,238,238)',
            underlayColor: 'rgba(0,0,0,0)',
        }
        this.separatorStyle = {
            flexDirection: 'row',
            borderColor: 'rgb(233,233,235)',
            borderWidth: 0.5,
        }
        this.title = 'select'
        this.defaultValue = ''
        this.disabled = false
        this.collapseAble = true
        this.itemOptions = []
        this._onPress = this._onPress.bind(this)
        this._onValueChange = this._onValueChange.bind(this)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.defaultValue !== this.defaultValue)
    }

    _init() {
        if (this.props.backgroundColor && this.props.backgroundColor != this.style.backgroundColor) {
            this.style.backgroundColor = this.props.backgroundColor
        }
        if (this.props.width && this.props.width != this.style.width) {
            this.style.width = this.props.width
        }
        if (this.props.height && this.props.height != this.style.height) {
            this.style.height = this.props.height
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
        if (this.props.borderColor && this.props.borderColor != this.style.borderColor) {
            this.style.borderColor = this.props.borderColor
        }
        if (this.props.fontFamily && this.props.fontFamily != this.style.fontFamily) {
            this.style.fontFamily = this.props.fontFamily
        }
        if (this.props.fontSize && this.props.fontSize != this.style.fontSize) {
            this.style.fontSize = this.props.fontSize
        }
        if (this.props.underlayColor && this.props.underlayColor != this.style.underlayColor) {
            this.style.underlayColor = this.props.underlayColor
        }
        if (this.props.title && this.props.title != this.title) {
            this.title = this.props.title
        }
        if (this.props.defaultValue && this.props.defaultValue != this.defaultValue) {
            this.defaultValue = this.props.defaultValue
        }
        if (this.props.collapseAble != undefined && this.props.collapseAble != this.collapseAble) {
            this.collapseAble = this.props.collapseAble
        }
        if (this.props.itemOptions && JSON.stringify(this.props.itemOptions) != JSON.stringify(this.itemOptions)) {
            this.itemOptions = this.props.itemOptions
        }
    }

    _onPress() {
        if (this.props.onPress) {
            this.props.onPress()
        }
    }

    _onValueChange() {
        if (this.props.onValueChange) {
            this.props.onValueChange()
        }
    }

    render() {
        this._init()
        const containerStyle = {
            backgroundColor: this.style.backgroundColor,
            width: this.style.width,
            height: this.style.height,
            borderRadius: this.style.borderRadius,
            borderWidth: this.style.borderWidth,
            borderColor: this.style.borderColor,
            justifyContent: 'center',
            alignItems: 'center',
            paddingRight: 14,
            paddingLeft: 14,
            borderWidth: 1, 
            borderColor: '#CCCCCC', 
            borderRadius: 3,
            marginBottom: 10,
            height: 45
        }

        var _renderSeperator = (visible) => {
            if (visible)
                return (
                    <View style={this.separatorStyle} />
                )
        }

        var _renderItemOptions = () => {
            _this = this
            return this.itemOptions.map(function (item, index) {
                return (
                    <View key={index}>
                        <Text
                            allowFontScaling={false}
                            style={{
                                fontFamily: _this.style.fontFamily,
                                fontSize: _this.style.fontSize,
                                marginHorizontal: 10,
                                marginVertical: 10,
                            }}>
                            {item}
                        </Text>
                        {_renderSeperator(index !== _this.itemOptions.length - 1)}
                    </View>
                )
            })
        }

        return (
            <View>
                <Text
                    allowFontScaling={false}
                    style={[
                        { display: (this.props.title ? 'flex' : 'none'), },
                        this.titleStyle,
                        this.props.titleStyle
                    ]}>
                    {this.title}
                </Text>
                <TouchableHighlight
                    underlayColor={this.style.underlayColor}
                    style={containerStyle}
                    onPress={this._onPress}>
                    <View style={styles.inline}>
                        <Text allowFontScaling={false} numberOfLines={1} style={[ this.valueTextStyle, this.props.valueTextStyle,]}>
                            {this.defaultValue}
                        </Text>
                        <View style={{}}>
                            <Image
                              style={{ width: 17, height: 16 }}
                              source={require('../../assets/icons/view-all.png')}
                            
                            />
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    inline: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    containerStyle: {
        width: '100%',
    }
})

export default SearchFilterDropdown

