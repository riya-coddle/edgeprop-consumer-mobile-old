import React, {Component} from 'react'
import {View, Image, Text, StyleSheet, TouchableHighlight, TouchableOpacity} from 'react-native'

class Common_CardMenuListItem extends Component{
    constructor(props){
        super(props)

        this.state= {
        }
        this._onPress = this._onPress.bind(this)
        this.style={
            // default value
            textSize: 13,
            fontFamily: 'Poppins',
            textColor: '#a8abae',
            backgroundColor: '#ffff',
            margin:10,
            marginTop: 5,
            marginRight: 9,
            marginBottom: 5,
            marginLeft: 10,
            paddingHorizontal: 10,
            paddingTop:10,
            paddingBottom:10,
            borderRadius:5,
        }
    }
    _initStyle(){
        // init textSize
        if (this.props.textSize && this.props.textSize != this.style.textSize) {
            this.style.textSize = this.props.textSize
        }
        // init fontFamily
        if (this.props.fontFamily && this.props.fontFamily != this.style.fontFamily) {
            this.style.fontFamily = this.props.fontFamily
        }
        // init textColor
        if (this.props.textColor && this.props.textColor != this.style.textColor) {
            this.style.textColor = this.props.textColor
        }
        // init backgroundColor
        if (this.props.backgroundColor && this.props.backgroundColor != this.style.backgroundColor) {
            this.style.backgroundColor = this.props.backgroundColor
        }
        // init margin
        if (this.props.margin && this.props.margin != this.style.margin) {
            this.style.margin = this.props.margin
        }
        // init marginTop
        if (this.props.marginTop && this.props.marginTop != this.style.marginTop) {
            this.style.marginTop = this.props.marginTop
        }
        // init marginRight
        if (this.props.marginRight && this.props.marginRight != this.style.marginRight) {
            this.style.marginRight = this.props.marginRight
        }
        // init marginBottom
        if (this.props.marginBottom && this.props.marginBottom != this.style.marginBottom) {
            this.style.marginBottom = this.props.marginBottom
        }
        // init marginLeft
        if (this.props.marginLeft && this.props.marginLeft != this.style.marginLeft) {
            this.style.marginLeft = this.props.marginLeft
        }
    }
    _onPress() {
        if(this.props.onPressItem != undefined){
            this.props.onPressItem(this.props.title, this.props.screen)
        }
    }

    render(){
        this._initStyle()
        var source = '';
        if (this.props.title == 'Home Value'){
            source = require('../../assets/icons/HomeValue.png');
        }
        else if (this.props.title == 'Affordability Calculator'){
            source = require('../../assets/icons/AffordabilityCalculator.png');
        }
        var icon = this.props.icon
        return(
            <TouchableOpacity onPress= {this._onPress} style={{
                paddingTop: this.style.paddingTop,
                paddingBottom: this.style.paddingBottom,
                // paddingLeft: this.style.paddingHorizontal,
                // paddingRight: this.style.paddingHorizontal,
                backgroundColor: this.style.backgroundColor,
                borderRadius: this.style.borderRadius,
                marginTop: this.style.marginTop,
                marginBottom: this.style.marginBottom,
                marginLeft: this.style.marginLeft,
                marginRight: this.style.marginRight,
                alignItems:'center'
            }}>
                <View>
                    <Image
                    source={source}
                    style={[styles[this.props.icon]]}
                    />
                </View>
                <Text allowFontScaling={false} style={[styles.title]}>{this.props.title}</Text>
                <Text allowFontScaling={false} style={[styles.title, styles.note]}>{this.props.subTitle}</Text>
            </TouchableOpacity>

        )
    }
}
const styles= StyleSheet.create({
    title: {
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
        fontSize: 18,
        color: "#36597c",
    },
    note:{
        fontFamily:'Poppins-Light',
        fontSize:12,
    },
    home: {
        width: 40,
        height: 40
    },
    calculator: {
        width: 50,
        height: 40
    },
})
export default Common_CardMenuListItem
