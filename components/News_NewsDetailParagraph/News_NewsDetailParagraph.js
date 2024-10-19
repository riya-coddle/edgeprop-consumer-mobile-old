import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    Linking,
    WebView,
    TouchableOpacity,
    Platform
} from 'react-native'
import firebase from 'react-native-firebase';
import ImageSlider from '../Common_ImageSlider/Common_ImageSlider.js'
import HTMLText from '../Common_HTMLText/Common_HTMLText.js'
import NavigationHelper from '../Common_NavigationHelper/Common_NavigationHelper.js'
import Home_List from '../../components/Home_List/Home_List'
import { RNBanner } from 'react-native-dfp';

class News_NewsDetailParagraph extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        var {height, width} = Dimensions.get('window')
        this.screenWidth = width,
        this.screenHeight = height
        this._onPress = this._onPress.bind(this)
        this.navigation = props.navigation
        this.params = this.navigation.state.params
        // if(Platform.OS == 'android'){
        //   this.screenHeight = this.screenHeight - StatusBar.currentHeight
        // }
        this.style = {
            // default value
            // component
            backgroundColor: 'rgba(0,0,0,0)',
            marginTop: 0,
            marginRight: 0,
            marginBottom: 0,
            marginLeft: 0,
            paddingVertical: 0,
            paddingHorizontal: 0,
            borderRadius: 0,
            borderWidth: 0,
            borderColor: '#fff',
            // text
            textSize: 13,
            textColor: 'rgb(68,68,68)',
            textAlign: 'left',
            innerTextPaddingRight: 20,
            innerTextPaddingLeft: 10,
            fontFamily: 'Poppins-Regular',
            fontStyle: 'normal',
            fontWeight: 'normal',
            // image
            imageHeight: 211,
        }
        // "index": 0, -> paragraph number
        // "type": "text", -> text / image
        // "content": "A 936 sq ft unit on the 11th floor of <strong>Emerald Garden </strong>was sold for $1.7 million ($1,815 psf) on Nov 15. Located on Club Street in prime District 1, Emerald Garden is one of the few 999-year leasehold properties in the CBD. The latest sale is the 11th at the condominium this year, a doubling in resale transactions compared with last year.",
        // "description": ""
        this.data = {
            type: 'text',
            content: '',
            description: '',
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (JSON.stringify(nextProps.data) != JSON.stringify(this.data) 
          || nextProps.alias != this.props.alias 
          || nextProps.darkMode != this.props.darkMode
          || nextProps.fontFactor != this.props.fontFactor)
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.data) !== JSON.stringify(this.data)) {
        }
    }
    _onPress(){
        this.refs.navigationHelper._navigate('NewsDetail', {
            data: {
                alias: decodeURI(this.props.alias),
                nid: this.props.nid
            }
        })
    }


    _init() {
        // init backgroundColor
        if (this.props.backgroundColor && this.props.backgroundColor != this.style.backgroundColor) {
            this.style.backgroundColor = this.props.backgroundColor
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
        // init paddingVertical
        if (this.props.paddingVertical && this.props.paddingVertical != this.style.paddingVertical) {
            this.style.paddingVertical = this.props.paddingVertical
        }
        // init paddingHorizontal
        if (this.props.paddingHorizontal && this.props.paddingHorizontal != this.style.paddingHorizontal) {
            this.style.paddingHorizontal = this.props.paddingHorizontal
        }
        // init innerTextPaddingRight
        if (this.props.innerTextPaddingRight && this.props.innerTextPaddingRight != this.style.innerTextPaddingRight) {
            this.style.innerTextPaddingRight = this.props.innerTextPaddingRight
        }
        // init innerTextPaddingLeft
        if (this.props.innerTextPaddingLeft && this.props.innerTextPaddingLeft != this.style.innerTextPaddingLeft) {
            this.style.innerTextPaddingLeft = this.props.innerTextPaddingLeft
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
        // init textSize
        if (this.props.textSize && this.props.textSize != this.style.textSize) {
            this.style.textSize = this.props.textSize
        }
        // init textColor
        if (this.props.textColor && this.props.textColor != this.style.textColor) {
            this.style.textColor = this.props.textColor
        }
        // init textAlign
        if (this.props.textAlign && this.props.textAlign != this.style.textAlign) {
            this.style.textAlign = this.props.textAlign
        }
        // init fontFamily
        if (this.props.fontFamily && this.props.fontFamily != this.style.fontFamily) {
            this.style.fontFamily = this.props.fontFamily
        }
        // init fontStyle
        if (this.props.fontStyle && this.props.fontStyle != this.style.fontStyle) {
            this.style.fontStyle = this.props.fontStyle
        }
        // init fontWeight
        if (this.props.fontWeight && this.props.fontWeight != this.style.fontWeight) {
            this.style.fontWeight = this.props.fontWeight
        }
        // init imageHeight
        if (this.props.imageHeight && this.props.imageHeight != this.style.imageHeight) {
            this.style.imageHeight = this.props.imageHeight
        }
        if (this.props.data!=undefined && this.props.data!=this.data) {
            this.data = this.props.data
        }

        if (this.props.handleOnPressListing !=undefined && this.props.handleOnPressListing != this.handleOnPressListing) {
            this.handleOnPressListing = this.props.handleOnPressListing
        }
        if (this.props.formatFeatured !=undefined && this.props.formatFeatured != this.formatFeatured) {
            this.formatFeatured = this.props.formatFeatured
        }
    }


    render() {
     
      this._init()
      var _renderContent = () => {
          let type = this.data.type
          if (type === 'text') {
              return _renderText()
          } else if (type === 'image') {
              return _renderImage()
          } else if (type === 'slider') {
              return _renderSlideShow()
          } else if (type === 'featured') {
              return _renderFeatured()
          } else if (type === 'embed' && this.data.content.type && this.data.content.type=="youtube") {
              return _renderYoutube()
          } else if(type === 'ads') {
              return <Text></Text>; //_renderAds() // Need to able after the release - 13 Sep 2021
          } else if(type === 'leaderads') {
              return <Text></Text>; //_renderLeaderAds() // Need to able after the release - 13 Sep 2021
          }
      }

      var _renderLeaderAds = () => {
       let unitId = ''
       if( this.data.network_id && this.data. adunit ) {
          unitId = '/'+this.data.network_id+'/'+this.data.adunit
        }
        let sizes = this.data.sizes.split(", ")

        console.log('unit leaderads',sizes )
        console.log('width', width, 'height', width*(110/425) )
        return (
          <View style={{ paddingTop: 15, paddingBottom: -15 }}>
            <View style={{ justifyContent: 'center', flex: 1, backgroundColor: this.props.darkMode ? '#242424' : '#E8E8E8', alignItems: 'center', paddingTop: 12, paddingBottom: 23 }}>
            <Text allowFontScaling={false} style={{ color: this.props.darkMode ? '#dddddd' : '#414141', fontFamily: 'Poppins-Regular', marginTop: -7 , fontSize: 12, textAlign: 'center' }}>ADVERTISEMENT</Text>
            <RNBanner
                style={{ resizeMode: 'contain', height:  width*(Number(sizes[1])/Number(sizes[0])), transform: [{ scaleX: 0.86 }]}}
                onDidFailToReceiveAdWithError={(event) => didFailToReceiveAdWithError(event.nativeEvent.error), console.log('')}
                onAdmobDispatchAppEvent={(event) => admobDispatchAppEvent(event),console.log("")}
                adUnitID={unitId}
                dimensions={{
                  height: Number(sizes[1]),
                  width: Number(sizes[0])
                }}
                bannerSize="banner" />
            </View>
          </View>  
        ) 
       
      }

      var _renderAds = () => {
       // console.log('this.data',this.data)
       let unitId = ''
       if( this.data.network_id && this.data. adunit ) {
          unitId = '/'+this.data.network_id+'/'+this.data.adunit 
       }
       let sizes = this.data.sizes.split(", ")
     // console.log('unit', unitId)
        return (
          <View style={{ paddingTop: 15, paddingBottom: 15 }}>
            <View style={{ justifyContent: 'center', flex: 1, backgroundColor: this.props.darkMode ? '#242424' : '#E8E8E8', alignItems: 'center', paddingTop: 5, paddingBottom: 10 }}>
              <Text allowFontScaling={false} style={{ color: this.props.darkMode ? '#dddddd' : '#414141', fontFamily: 'Poppins-Regular', fontSize: 12, textAlign: 'center' }}>ADVERTISEMENT</Text>
            <RNBanner
                onDidFailToReceiveAdWithError={(event) => didFailToReceiveAdWithError(event.nativeEvent.error), () => {}}
                onAdmobDispatchAppEvent={(event) => admobDispatchAppEvent(event), () => {}}
                adUnitID={unitId}
                style={{ paddingBottom: 10}}
                dimensions={{
                  height: Number(sizes[1]),
                  width: Number(sizes[0])
                }} />
            </View>
          </View>  
        ) 
       
      }

      var _renderYoutube = () => {
        var string = this.data.content.code;
        var videoId = "ixRDa-jprco" //if something wrong play edgeprop ads
        var text = "/embed/"
        var index = string.indexOf(text)
        if(index>-1){
          string = string.substring(index+text.length,string.length)
        }
        var text = "\""
        var index = string.indexOf(text)
        if(index>-1){
          string = string.substring(0,index)
        }
        string = string.split("?")[0]
        if(string.length>0){
          videoId = string
        }
        // console.log(videoId);
        return (
          <View style={{paddingTop: 17, paddingBottom: 13}}>
            <WebView
              source={{uri: 'https://www.youtube.com/embed/' + videoId + '?rel=0'}}
              style={{ alignSelf: 'stretch', height: 300, backgroundColor: 'black' }}
              />
          </View>
        )
      }

      var _renderText = () => {
          const textContainerStyle = {
              paddingRight: 23,
              paddingLeft: 23,
              fontFamily: 'Poppins-Regular',
              fontSize: 18,
              textAlign: 'justify'
          };
          
          if(this.props.alias!=undefined || this.props.alias != null){
              return(
                <View style={{ marginTop: 15 }}>
                <HTMLText
                  textStyle={textContainerStyle}
                  content={this.data.content.replace(/<br\s*\/?>/gi, '\n')}
                  linking={true}
                  alias={this.props.alias}
                  nid={this.props.nid}
                  navigation={this.props.navigation}
                  darkMode={this.props.darkMode? this.props.darkMode : false}
                  fontFactor={this.props.fontFactor? this.props.fontFactor : 0}
                />
                </View>
              )
          }
          else{
              return (
                <View style={{ marginTop: 15 }}>
                <HTMLText
                  // font={"OpenSans"}
                  textStyle={textContainerStyle}
                  content={this.data.content.replace(/<br\s*\/?>/gi, '\n')}
                  navigation={this.props.navigation}
                  darkMode={this.props.darkMode? this.props.darkMode : false}
                  fontFactor={this.props.fontFactor? this.props.fontFactor : 0}
                />
                </View>
              )
          }

      }

      var _renderImage = () => {
          return (
            <View>
              <View style={{ padding: 23, borderRadius: 3 }}>
              <ImageSlider
                width={this.screenWidth * 0.9 }
                height={this.screenWidth * 9/16}
                id = {`imageSlider`}
                transitionInterval = {0.5}
                showInterval = {2}
                slideInterval = {0.3}
                carouselNavigation = {false}
                overlayText = {false}
                showIndex = {0}
                lazyLoad = {false}
                backgroundColor = {"#FFF"}
                resizeMode = {"contain"}
                autoResize = {true}
                belowDescription = {true}
                navigation = {true}
                fullScreen = {false} 
                data={
                  [
                    {
                      image: this.data.content.replace("http://","https://"),
                      description: this.data.description
                    }
                  ]
                }
              />
            </View>
            </View>
          )
      }


      var _renderFeatured = () => {
        var featuredData = this.formatFeatured(this.data.data.property)
          return (
            <View display={featuredData && featuredData.length>0 ? 'flex' : 'none'} style={[styles.hpFirstSec, { paddingLeft: 15, marginBottom: 0 }]}>
                <View
                  style={{
                    borderBottomWidth: 2,
                    borderColor: 'rgb(233,233,235)',
                    borderWidth: 0.5,
                    marginLeft: 5,
                    marginRight: 20,
                    marginTop: 8
                  }}
                />
                <Home_List
                    item={featuredData}
                    title={'TOP PICKS BY EDGEPROP'}
                    tooltip={false}
                    moreOption={false}
                    onPressItem={this.handleOnPressListing}
                    featured={true}
                />
                <View
                  style={{
                    borderBottomWidth: 2,
                    borderColor: 'rgb(233,233,235)',
                    borderWidth: 0.5,
                    marginLeft: 5,
                    marginRight: 20,
                    marginTop: 8
                  }}
                />
              </View>
          )
      }

      var _renderSlideShow = () => {
        var slideShowData = []
        if(this.data.content != undefined && Array.isArray(this.data.content) && this.data.content.length > 0){
          slideShowData = this.data.content.map((item, index) => {
            var description = ""
            if(item.description != undefined && Array.isArray(item.description)){
              description = item.description.map((item,index)=>{
                return item.content
              }).join("\n")
            }
            if(item.type=="image"){
              return {
                image: item.content || "",
                title: item.title || "",
                description
              }
            }
          })
        }

        return (
          <ImageSlider
            width={this.screenWidth}
            height={this.screenWidth*9/16}
            id = {`imageSlider`}
            transitionInterval = {0.5}
            showInterval = {2}
            slideInterval = {0.3}
            navigation = {true}
            autoPlay = {true}
            carouselNavigation = {false}
            overlayText = {false}
            showIndex = {0}
            lazyLoad = {false}
            resizeMode = {"cover"}
            belowDescription = {true}
            fullScreen = {true}
            belowDescriptionPadding = {"11 20 10 10"}
            data={slideShowData}
          />
        )
      }

      const containerStyle = {
          backgroundColor: this.style.backgroundColor,
          borderRadius: this.borderRadius,
          borderWidth: this.style.borderWidth,
          borderColor: this.style.borderColor,
      }

      return (
          <View>
         
              {_renderContent()}
          </View>
      )
    }
}
const styles= StyleSheet.create({
    hpMainContainer: {
        backgroundColor: '#E0E0E0'
    },
    hpFirstSec: {
        backgroundColor: '#fff',
        paddingBottom: 20,
        marginBottom: 10
    }
})

const { width, height } = Dimensions.get('window')

export default News_NewsDetailParagraph
