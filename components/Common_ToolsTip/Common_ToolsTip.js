import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    TextInput,
    Text,
    View,
    Image,
    TouchableHighlight,
    Alert,
    TouchableOpacity
} from 'react-native'
import Common_IconMenu from '../Common_IconMenu/Common_IconMenu'

class Common_ToolsTip extends Component {
    showTime = 3 //in seconds
    constructor(props) {
        super(props)

        this._onPress = this._onPress.bind(this)
        this.state={
            show : false
        }

        this.style = {
            // default value style icon
            imagewidth:15,
            imageheight:15,
            iconborderRadius: 100,

            //default value style css
            position: 'absolute',
            left:30,
            top: 0,
            //top:-20,
            opacity:0.7,
            backgroundColor:'black',
            width:150,
            height:70,
            // alignItems:'center',
            justifyContent: 'center',
            borderRadius:9,
            zIndex:1,
        }
        this.item = {
            message: '',
        }
    }

    _initStyle(){
        // init imageheight
        if (this.props.imageheight && this.props.imageheight != this.style.imageheight) {
            this.style.imageheight = this.props.imageheight
        }
        // init imagewidth
        if (this.props.imagewidth && this.props.imagewidth != this.style.imagewidth) {
            this.style.imagewidth = this.props.imagewidth
        }
        // init iconborderRadius
        if (this.props.iconborderRadius && this.props.iconborderRadius != this.style.iconborderRadius) {
            this.style.iconborderRadius = this.props.iconborderRadius
        }

        // init position
        if (this.props.position && this.props.position != this.style.position) {
            this.style.position = this.props.position
        }
        // init left
        if (this.props.left && this.props.left != this.style.left) {
            this.style.left = this.props.left
        }
        // init top
        if (this.props.top && this.props.top != this.style.top) {
            this.style.top = this.props.top
        }
        // init opacity
        if (this.props.opacity && this.props.opacity != this.style.opacity) {
            this.style.opacity = this.props.opacity
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
        // init alignItems
        if (this.props.alignItems && this.props.alignItems != this.style.alignItems) {
            this.style.alignItems = this.props.alignItems
        }
        // init borderRadius
        if (this.props.borderRadius && this.props.borderRadius != this.style.borderRadius) {
            this.style.borderRadius = this.props.borderRadius
        }
        // init justifyContent
        if (this.props.justifyContent && this.props.justifyContent != this.style.justifyContent) {
            this.style.justifyContent = this.props.justifyContent
        }
        // init zIndex
        if (this.props.zIndex && this.props.zIndex != this.style.zIndex) {
            this.style.zIndex = this.props.zIndex
        }
    }
    _initItems(){
        // init message
        if (this.props.message && this.props.message != this.item.message) {
            this.item.message = this.props.message
        }
    }

    _onPress() {
      if(!this.state.show){
        this.setState({
          show: true
        });
        setTimeout(()=>{
            this.setState({
              show: false
            })
        },this.showTime*1000)
      }
    }

    render() {
    //   console.log("render");
        this._initStyle()
        this._initItems()
        var Tooltip = require('../../assets/icons/Tooltip.png');
        var renderTooltip = () => {
            return(
                <View style={{
                    display:this.state.show?"flex":"none",
                    position: this.style.position,
                    left: this.style.left,
                    top: this.style.top,
                    backgroundColor: this.style.backgroundColor,
                    width: this.style.width,
                    height: this.style.height,
                    opacity: this.style.opacity,
                    alignItems: this.style.alignItems,
                    borderRadius: this.style.borderRadius,
                    justifyContent: this.style.justifyContent,
                    zIndex: this.style.zIndex,
                }}>
                    <Text allowFontScaling={false} style={{
                        fontSize:13,
                        fontFamily:'Poppins-Regular',
                        color:'white',
                        marginLeft: 10,
                        textAlign: 'left'
                    }}>
                        {this.item.message}
                    </Text>
                </View>
            )
        }
        return(
            <View>
                <TouchableOpacity onPress={this._onPress}>
                  <Common_IconMenu
                    imageSource={Tooltip}
                    type={'icon'}
                    imageHeight={this.style.imageHeight}
                    imageWidth={this.style.imageWidth}
                    borderRadius={this.style.iconborderRadius}
                  />
                </TouchableOpacity>
                {renderTooltip()}
            </View>
        )
    }
}

export default Common_ToolsTip
