import React, { Component } from 'React'
import {
    Platform,
    StyleSheet,
    TextInput,
    Text,
    View,
    // Image,
    TouchableHighlight,
    Alert,
    TouchableOpacity,
    Dimensions
} from 'react-native'
import Image from '../Common_Image/Common_Image'
export default class Common_AvatarIcon extends Component {

    constructor(props) {
        super(props)
        this.state = {}

        this.style = {
            // default value
            margin: 0,
            marginTop: 10,
            backgroundColor: 'transparent',
            borderColor: 'grey',
            width: 60,
            height: 60,
            borderRadius: 30,
            borderWidth:1,
        }
        this.image = {uri: 'https://sg.tepcdn.com/images/avatar.png'}
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
        // init borderRadius
        if (this.props.borderRadius && this.props.borderRadius != this.style.borderRadius) {
            this.style.borderRadius = this.props.borderRadius
        }
        // init borderWidth
        if (this.props.borderWidth && this.props.borderWidth != this.style.borderWidth) {
            this.style.borderWidth = this.props.borderWidth
        }
        // init borderColor
        if (this.props.borderColor && this.props.borderColor != this.style.borderColor) {
            this.style.borderColor = this.props.borderColor
        }
        // init image props
        if (this.props.image && this.props.image != this.image) {
            this.image = this.props.image
        }
    }

    render() {
        this._initStyle()
        var imageStyle = {
                margin: this.style.margin,
                marginTop:this.style.marginTop,
                backgroundColor: this.style.backgroundColor,
                width: this.style.width,
                height: this.style.height,
                borderRadius: (this.style.width/2),
                borderWidth: this.style.borderWidth,
                borderColor:this.style.borderColor
          }
        return (
            <View>
                <Image
                  defaultSource={"https://sg.tepcdn.com/images/avatar.png"}
                  style={imageStyle}
                  source={this.image}/>
            </View>
        );
    }
}
