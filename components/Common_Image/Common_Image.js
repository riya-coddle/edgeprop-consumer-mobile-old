import React, { Component } from 'react';
import {CachedImage} from 'react-native-cached-image';
import {View, Image, Text,StyleSheet} from 'react-native'
export default class Common_Image extends React.Component {
    // defaultSource = "https://dkc9trqgco1sw.cloudfront.net/s3fs-public/default_images/no_img.png"
    containerStyle
    propsStyle
    constructor(props){
        super(props)
        this.state = {
            source: props.source || {uri: this.props.defaultSource}
        }
        this._handleOnError = this._handleOnError.bind(this)
        this._handleOnLoad = this._handleOnLoad.bind(this)
        this.containerStyle = {}
        this.propsStyle = props.style

        if(this.propsStyle!=undefined){
          if(Array.isArray(this.propsStyle)){
            for(var index=0; index<this.propsStyle.length; index++){
              if(this.propsStyle[index]!=undefined && typeof(this.propsStyle[index]) == 'object'){
                this._handleCachedImageStyles(this.propsStyle[index], this.containerStyle)
              }
            }
          }
          else if(typeof(this.propsStyle=='object')){
            this._handleCachedImageStyles(this.propsStyle, this.containerStyle)
          }
        }
        this.containerStyle.overflow="hidden"
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.source && nextProps.source != this.props.source){
            this.setState({
                source: nextProps.source
            })
        }
    }

    _handleOnError(error){
        // console.log("error", this.state.source.uri, error);
        this.setState({
            source: {uri: this.props.defaultSource}
        })
        if(this.props.onError){
            this.props.onError(error)
        }
    }

    _handleOnLoad(){
        if(this.props.onLoad){
            this.props.onLoad()
        }
    }

    _moveAttributes(attrArray, firstObj, secondObj){
      for(var index=0; index<attrArray.length; index++){
        var attr = attrArray[index]
        if(firstObj[attr] != undefined){
          secondObj[attr] = firstObj[attr]
          delete firstObj[attr]
        }
      }
    }

    _copyAttributes(attrArray, firstObj, secondObj){
      for(var index=0; index<attrArray.length; index++){
        var attr = attrArray[index]
        if(firstObj[attr] != undefined){
          secondObj[attr] = firstObj[attr]
        }
      }
    }

    _handleCachedImageStyles(propsStyle, containerStyle){
      this._moveAttributes(
        // ["margin", "marginLeft", "marginRight", "marginTop", "marginBottom", "marginHorizontal", "marginVertical"],
        ["margin", "marginLeft", "marginRight", "marginTop", "marginBottom", "marginHorizontal", "marginVertical", "borderColor", "borderRadius", "borderWidth"],
        propsStyle,
        containerStyle
      )
      this._copyAttributes(
        ["width", "height"],
        propsStyle,
        containerStyle
      )
    }

    render() {
        var source = this.state.source
        if(source.uri != undefined){
          source.uri = source.uri.replace("http://","https://")
        }

        return(
          <View style={this.containerStyle}>
            <CachedImage
              style={this.propsStyle}
              source={source}
              onError={(error)=>{
                  this._handleOnError(error);
              }}
              onLoad={this._handleOnLoad}
              resizeMode = {this.props.resizeMode}>
              {this.props.overlayText
                  ?
                  <View style={[styles.containerText]}>
                      <Text allowFontScaling={false} style={[styles.overlayText]}>
                        {this.props.overlayText}
                      </Text>
                  </View>
                  :
                  null
                }
            </CachedImage>
          </View>
        )
    }
}
const styles = StyleSheet.create({
    overlayText: {
        fontSize: 18,
        fontFamily: 'Poppins-Medium',
        color: '#fff',
        lineHeight: 20,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    containerText: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    }
})
