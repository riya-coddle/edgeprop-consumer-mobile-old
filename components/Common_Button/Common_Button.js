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
export default class Common_Button extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false
        }
        this._onPress = this._onPress.bind(this)
        this._toggleLoading = this._toggleLoading.bind(this)

        this.style = {
            // default value
            margin: 0,
            backgroundColor: '#FFA700',
            width: '50%',
            height: 45,
            borderRadius: 5,
            textValue: 'Add to Shortlist',
            textSize: 15,
            alignItems: 'center',
            justifyContent: 'center',
            textColor: '#fff',
            fontFamily: 'Poppins-SemiBold',
            borderColor: "transparent",
            borderWidth: 0,
            marginVertical: 0,
            marginTop:0,
            fontStyle: 'normal',
            // fontWeight: 'normal', //fontWeight makes fontFamily not render properly in android
        }
    }

    _initStyle() {
        // init margin
        if (this.props.margin && this.props.margin != this.style.margin) {
            this.style.margin = this.props.margin
        }
        // init backgroundColor
        if (this.props.backgroundColor && this.props.backgroundColor != this.style.backgroundColor) {
            this.style.backgroundColor = this.props.backgroundColor
        }
        // init width
        if (this.props.width && this.props.width != this.style.width) {
            this.style.width = this.props.width
        }
        // init height
        if (this.props.height && this.props.height != this.style.height) {
            this.style.height = this.props.height
        }
        // init textValue
        if (this.props.textValue && this.props.textValue != this.style.textValue) {
            this.style.textValue = this.props.textValue
        }
        // init textSize
        if (this.props.textSize && this.props.textSize != this.style.textSize) {
            this.style.textSize = this.props.textSize
        }
        // init alignItems
        if (this.props.alignItems && this.props.alignItems != this.style.alignItems) {
            this.style.alignItems = this.props.alignItems
        }
        // init justifyContent
        if (this.props.justifyContent && this.props.justifyContent != this.style.justifyContent) {
            this.style.justifyContent = this.props.justifyContent
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
        // init borderRadius
        if (this.props.borderRadius && this.props.borderRadius != this.style.borderRadius) {
            this.style.borderRadius = this.props.borderRadius
        }
        // init borderWidth
        if (this.props.borderWidth && this.props.borderWidth != this.style.borderWidth) {
            this.style.borderWidth = this.props.borderWidth
        }
        // init fontWeight
        // if (this.props.fontWeight && this.props.fontWeight != this.style.fontWeight) {
        //     this.style.fontWeight = this.props.fontWeight
        // }
        // init borderWidth
        if (this.props.borderWidth && this.props.borderWidth != this.style.borderWidth) {
            this.style.borderWidth = this.props.borderWidth
        }
        // init borderColor
        if (this.props.borderColor && this.props.borderColor != this.style.borderColor) {
            this.style.borderColor = this.props.borderColor
        }
        // init borderColor
        if (this.props.marginVertical && this.props.marginVertical != this.style.marginVertical) {
            this.style.marginVertical = this.props.marginVertical
        }
        // init borderColor
        if (this.props.marginTop && this.props.marginTop != this.style.marginTop) {
            this.style.marginTop = this.props.marginTop
        }
    }

    _toggleLoading(loading) {
        this.setState({
            loading: loading
        })
    }

    _onPress() {
        if (this.props.onPress) {
            this.props.onPress()
        }
    }

    render() {
        this._initStyle()

        return (
            <TouchableOpacity
                onPress={this._onPress}
                disabled={this.props.disabled||this.state.loading}>
               {/* <View style={
                    {
                        margin: this.style.margin,
                        marginVertical: this.style.marginVertical,
                        marginTop: this.style.marginTop,
                        alignItems: this.style.alignItems,
                        justifyContent: this.style.justifyContent,
                        backgroundColor: this.style.backgroundColor,
                        width: this.style.width,
                        height: this.style.height,
                        borderRadius: this.style.borderRadius,
                        borderColor: this.style.borderColor,
                        borderWidth: this.style.borderWidth,
                        flexDirection: "row"
                    }}>
                    {this.state.loading ? <Image
                        style={{ width: 24, height: 24, marginRight: 10 }}
                        source={{ uri: "https://sg.tepcdn.com/web4/public/img/icons/loading.gif" }}>
                    </Image> : <View />}

                    {this.props.iconUrl?
                      <Image
                        style={{ width: 30, height: 30, marginRight: 10 }}
                        source={this.props.iconUrl} >
                      </Image> : <View />
                    }
                    {
                        this.props.children ||
                        (<Text allowFontScaling={false} style={
                            {
                                fontSize: this.style.textSize,
                                // fontWeight: this.style.fontWeight,
                                fontStyle: this.style.fontStyle,
                                fontFamily: this.style.fontFamily,
                                color: this.style.textColor
                            }}>
                            {this.state.loading ? "Loading" : this.style.textValue}
                        </Text>)
                    }
                </View>*/}
               
            </TouchableOpacity>
        );
    }
}
