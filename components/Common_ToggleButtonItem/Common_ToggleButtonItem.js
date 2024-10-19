import React, { Component } from 'React'
import {
    TouchableOpacity,
    View,
    Text,
} from 'react-native'

export default class ToggleButtonItem extends Component {

    tintColor = "#275075"
    color = "#ffffff"
    title = ""
    index
    id
    borderRadius = 0
    borderWidth = 1
    borderLeft = true
    borderRight = true
    roundedBorderLeft = false
    roundedBorderRight = false
    isFocused = false
    constructor(props) {
        super(props)
        this.state = {
        }

        this.containerStyle = {
            // backgroundColor: this.color,
            width: 60,
            height: 30,
            paddingVertical: 0,
            paddingHorizontal: 0,
            marginVertical: 0,
            marginHorizontal: 0,
            borderColor: this.tintColor,
            alignItems: 'center',
            justifyContent: 'center'
        }

        this.textStyle = {
            fontFamily: 'Poppins-Regular',
            // color: this.tintColor,
            fontSize: 15
        }

        this._onPress = this._onPress.bind(this)
    }

    _init(){
        if(this.props.containerStyle != undefined){
            this.containerStyle = {...this.containerStyle, ...this.props.containerStyle}
        }
        if(this.props.title != undefined && this.props.title!=this.title){
            this.title = this.props.title
        }
        if(this.props.borderRadius != undefined && this.props.borderRadius!=this.borderRadius){
            this.borderRadius = this.props.borderRadius
        }
        if(this.props.roundedBorderLeft != undefined && this.props.roundedBorderLeft!=this.roundedBorderLeft){
            this.roundedBorderLeft = this.props.roundedBorderLeft
        }
        if(this.props.roundedBorderRight != undefined && this.props.roundedBorderRight!=this.roundedBorderRight){
            this.roundedBorderRight = this.props.roundedBorderRight
        }
        if(this.props.borderLeft != undefined && this.props.borderLeft!=this.borderLeft){
            this.borderLeft = this.props.borderLeft
        }
        if(this.props.borderRight != undefined && this.props.borderRight!=this.borderRight){
            this.borderRight = this.props.borderRight
        }
        if(this.props.isFocused != undefined && this.props.isFocused!=this.isFocused){
            this.isFocused = this.props.isFocused
        }
        if(this.props.index != undefined && this.props.index!=this.index){
            this.index = this.props.index
        }
        if(this.props.id != undefined && this.props.id!=this.id){
            this.id = this.props.id
        }
    }

    _onPress(){
        if(this.props.onPress){
            this.props.onPress(this.index, this.id, this.title)
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        return(nextProps.isFocused != this.props.isFocused)
    }

    render(){
        this._init()
        var containerBorderStyle = {
            borderTopLeftRadius : this.roundedBorderLeft? this.borderRadius: 0,
            borderBottomLeftRadius: this.roundedBorderLeft? this.borderRadius: 0,
            borderTopRightRadius: this.roundedBorderRight? this.borderRadius: 0,
            borderBottomRightRadius: this.roundedBorderRight? this.borderRadius: 0,
        }

        var borderWidth = {}

        if(this.roundedBorderLeft)
        {
          borderWidth = {
            borderLeftWidth: this.borderLeft? this.borderWidth: 0,
            borderTopWidth: this.borderWidth,
            borderBottomWidth: this.borderWidth
          }
        }
        else if(this.roundedBorderRight)
        {
          borderWidth = {
            borderRightWidth: this.borderRight? this.borderWidth: 0,
            borderTopWidth: this.borderWidth,
            borderBottomWidth: this.borderWidth
          }
        }
        else{
          borderWidth = {
            borderTopWidth: this.borderWidth,
            borderBottomWidth: this.borderWidth,
            borderRightWidth: this.borderWidth,
            borderLeftWidth: this.index == 1 ? this.borderWidth : 0,
          }
        }

        var containerStyle = {
            backgroundColor: this.isFocused? this.tintColor : this.color
        }
        var textStyle = {
            color: this.isFocused? this.color: this.tintColor
        }
        return(
            <TouchableOpacity onPress={this._onPress}>
                <View style={[this.containerStyle, borderWidth, containerBorderStyle, containerStyle]}>
                    <Text allowFontScaling={false} style={[this.textStyle, textStyle]}>
                        {this.title}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
}
