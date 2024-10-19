import React, {Component} from 'react'
import {View, Image, Text, StyleSheet, TouchableHighlight} from 'react-native'

class Common_Card extends Component{
    constructor(props){
        super(props)

        this.state= { 
        }

        this.style={
            // default value
            textSize: 13,
            fontFamily: 'Poppins',
            textColor: '#a8abae',
            backgroundColor: '#ffff',
            margin:10,
            marginTop: 10,
            marginRight: 9,
            marginBottom: 9,
            marginLeft: 10,
            paddingHorizontal: 10,
            paddingTop:9,
            paddingBottom:20,
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

    render(){
        this._initStyle()
        return(
            <View style={{
                paddingTop: this.style.paddingTop,
                paddingBottom: this.style.paddingBottom,
                paddingLeft: this.style.paddingHorizontal,
                paddingRight: this.style.paddingHorizontal,
                backgroundColor: this.style.backgroundColor,
                borderRadius: this.style.borderRadius,
                marginTop: this.style.marginTop,
                marginLeft: this.style.marginLeft,
                marginRight: this.style.marginRight,
                alignItems:'center'
            }}>
                <Image 
                source={require('../../assets/icons/listing_interior.png')}
                style={{width: 50, height: 50}}
                />
                <Text allowFontScaling={false} style={[styles.title]}>{this.props.name}</Text>
                <Text allowFontScaling={false} style={[styles.title, styles.note]}>{this.props.note}</Text>
            </View>

        )
    }
}
const styles= StyleSheet.create({
    title: {
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
        fontWeight: '400',
        //lineHeight: 21,
        fontSize: 18,
        //paddingLeft:90,
        //paddingRight:0,
        paddingTop:0,
        paddingBottom:0,
        color: "#36597c",
    },
    note:{
        //textAlign:'center',
        fontFamily:'Poppins-Light',
        fontSize:12,
        paddingTop:0,
        paddingBottom:0
        //color: "#36597c",


    }
})
export default Common_Card