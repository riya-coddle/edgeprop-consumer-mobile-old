import React, { Component } from 'react';
import {Animated, StyleSheet, Text, View, Modal, StatusBar, Linking,
        Image, Easing, TouchableHighlight, TouchableOpacity, Dimensions, Alert, Platform} from 'react-native';
import { WebView } from 'react-native-webview';
import ProgressiveImage from '../Common_ProgressiveImage/Common_ProgressiveImage.js';
import PanWithSwipe from '../Common_PanWithSwipe/Common_PanWithSwipe.js'
import PanWithReceiver from '../Common_PanWithReceiver/Common_PanWithReceiver.js'
import Common_Image from '../Common_Image/Common_Image.js'
import ZoomableImage from '../Common_ZoomableImage/Common_ZoomableImage.js'
import HTMLText from '../Common_HTMLText/Common_HTMLText.js'
import IconMenu from '../Common_IconMenu/Common_IconMenu.js'
import CachedImage from '../Common_Image/Common_Image'
import ImageGallery from '../Common_ImageGallery/Common_ImageGallery'
import PannellumView from '../Common_PannellumView/Common_PannellumView'

SHORT_DESCRIPTION_LENGTH = 70
export default class ImageSlider extends React.Component {
  defaultSource = "https://dkc9trqgco1sw.cloudfront.net/s3fs-public/default_images/no_img.png"
  //props
  id = "imageSlider"
  data = []
  transitionInterval = 1
  showInterval = 2
  slideInterval = 0.3
  overlayText = false
  autoPlay = false
  navigation = false
  showIndex = 0
  lazyLoadDuration = 250
  resizeMode = "cover"
  carouselNavigation = false
  belowDescription = false
  belowDescriptionPadding = "16 15 20 15"
  autoResize = false
  backgroundColor = "#CCC"
  //
  duration = 0

  //dimensions
  width = 0
  height = 0
  //image styles
  imageStyles = []
  toggleImages = []
  circleStyles = []
  //no animated styles
  noAnimImageStyles = []
  noAnimToggleImages = []
  noAnimCircleStyles = []
  //autoplay anims & styles
  autoPlayImageAnims = []
  autoPlayImageStyles = []
  autoPlayToggleImages = []
  autoPlayCircleStyles = []
  autoPlayCircleAnims = []

  autoPlayStopped = false

  //slide right anims & styles
  slideRightImageAnims = []
  slideRightImageStyles = []
  slideRightToggleImages = []
  slideRightCircleStyles = []
  slideRightCircleAnims = []

  slideRightSet = false

  //slide left anims & styles
  slideLeftImageAnims = []
  slideLeftImageStyles = []
  slideLeftToggleImages = []
  slideLeftCircleAnims = []
  slideLeftCircleStyles = []

  slideLeftSet = false

  //description below anims & styles
  descriptionAnim
  descriptionBelowStyle

  //timing arrays
  autoPlayAnimsTimingArray = []

  //single image
  singleImage = false
  didMount = false
  allGetSize = false
  dataSetChanged = false

  //dynamic styles
  dynamicStyles = {}

  //fullScreen
  fullScreen = false
  screenWidth
  screenHeight

  //overlay Title style
  isOverlayTitleAutoResize = false
  titleAutoResizeStyle = {
    s : {
      max: 30,
      style : {
        fontSize: 22
      }
    },
    m : {
      max: 60,
      style : {
        fontSize: 19
      }
    },
    l : {
      max: 90,
      style : {
        fontSize: 16
      }
    },
  }

  //style pass to html text
  descriptionStoryStyles = {
    fontFamily: "Poppins-Regular",
    fontSize: 10,
    lineHeight: 17,
    color: "#444444"
  }

  imageContainer = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    // left: 0, //the position depends on animation and showing image
  }

  //virtual_tour
  isVirtualTour = false

  constructor(props){
    super(props);
    var {height, width} = Dimensions.get('window');
    this.screenWidth = width;
    this.screenHeight = height
    this.width = props.width || this.width
    this.height = props.height || this.height
    this.data = props.data || this.data
    this.type = props.type || ''
    this.transitionInterval = props.transitionInterval || this.transitionInterval
    this.showInterval = props.showInterval || this.showInterval
    this.slideInterval = props.slideInterval || this.slideInterval
    this.transitionInterval = props.transitionInterval || this.transitionInterval
    this.overlayText = props.overlayText || false; //bool
    this.autoPlay = props.autoPlay || false; //bool
    this.navigation = props.navigation || false; //bool
    this.carouselNavigation = props.carouselNavigation || false
    this.lazyLoad = props.lazyLoad || false; //bool
    this.lazyLoadDuration = props.lazyLoadDuration || this.lazyLoadDuration;
    this.resizeMode = props.resizeMode || this.resizeMode
    this.showIndex = props.showIndex || this.showIndex
    this.belowDescription = props.belowDescription || false
    this.belowDescriptionPadding = props.belowDescriptionPadding || this.belowDescriptionPadding
    this.autoResize = props.autoResize || false
    this.fullScreen = props.fullScreen || false
    this.backgroundColor = props.backgroundColor || this.backgroundColor
    this.id = props.id || this.id

    this._handleAfterTouchAnimation = this._handleAfterTouchAnimation.bind(this)
    this._handleStartTouchAnimation = this._handleStartTouchAnimation.bind(this)
    this._handleStartSlide = this._handleStartSlide.bind(this)
    this._handleSlideAnimsAndStyles = this._handleSlideAnimsAndStyles.bind(this)
    this._handleAllAutoPlayOrNoAnimsAndStyles = this._handleAllAutoPlayOrNoAnimsAndStyles.bind(this)
    this._toggleFullScreen = this._toggleFullScreen.bind(this)
    this._handleResetState = this._handleResetState.bind(this)
    this._handleSetState = this._handleSetState.bind(this)
    this._handleModalPanReceiverEndTouch = this._handleModalPanReceiverEndTouch.bind(this)
    this._onUpdateShowIndex = this._onUpdateShowIndex.bind(this)
    this._onModalUpdateShowIndex = this._onModalUpdateShowIndex.bind(this)

    if(this.data.length == 1){
      this.singleImage = true
    }
    else if(this.data.length > 1){
      this.singleImage = false
    }
    this._handleInitDynamicStyleAndDefaultAnim();
    if(this.autoResize) {
      this._handleImageSize();
    }

    this.state = {
      animation: (this.autoPlay && !this.singleImage)? 'autoPlay' : 'none',
      fullScreen: false,
      update: false,
      youtubePaused: true
    }
  }

  _initStyle(){
    if(this.props.transitionInterval != undefined && this.props.transitionInterval != this.transitionInterval){
      this.transitionInterval = this.props.transitionInterval
    }
    if(this.props.showInterval != undefined && this.props.showInterval != this.showInterval){
      this.showInterval = this.props.showInterval
    }
    if(this.props.slideInterval != undefined && this.props.slideInterval != this.slideInterval){
      this.slideInterval = this.props.slideInterval
    }
    if(this.props.transitionInterval != undefined && this.props.transitionInterval != this.transitionInterval){
      this.transitionInterval = this.props.transitionInterval
    }
    if(this.props.overlayText != undefined && this.props.overlayText != this.overlayText){
      this.overlayText = this.props.overlayText
    }
    if(this.props.autoPlay != undefined && this.props.autoPlay != this.autoPlay){
      this.autoPlay = this.props.autoPlay;
    }
    if(this.props.navigation != undefined && this.props.navigation != this.navigation){
      this.navigation = this.props.navigation;
    }
    if(this.props.lazyLoad != undefined && this.props.lazyLoad != this.lazyLoad){
      this.lazyLoad = this.props.lazyLoad;
    }
    if(this.props.lazyLoadDuration != undefined && this.props.lazyLoadDuration != this.lazyLoadDuration){
      this.lazyLoadDuration = this.props.lazyLoadDuration;
    }
    if(this.props.resizeMode != undefined && this.props.resizeMode != this.resizeMode){
      this.resizeMode = this.props.resizeMode;
    }
    if(this.props.carouselNavigation != undefined && this.props.carouselNavigation != this.carouselNavigation){
      this.carouselNavigation = this.props.carouselNavigation;
    }
    if(this.props.id != undefined && this.props.id != this.id){
      this.id = this.props.id;
    }
    if(this.props.belowDescription != undefined && this.props.belowDescription != this.belowDescription){
      this.belowDescription = this.props.belowDescription;
    }
    if(this.props.belowDescriptionPadding != undefined && this.props.belowDescriptionPadding != this.belowDescriptionPadding){
      this.belowDescriptionPadding = this.props.belowDescriptionPadding;
    }
    if(this.props.autoResize != undefined && this.props.autoResize != this.autoResize){
      this.autoResize = this.props.autoResize;
    }
    if(this.props.fullScreen != undefined && this.props.fullScreen != this.fullScreen){
      this.fullScreen = this.props.fullScreen;
    }
  }

  _onUpdateShowIndex(){
    if(this.refs.panWithSwipe != undefined){
      if(this.data[this.showIndex].image.virtual_tour_text != undefined && this.data[this.showIndex].image.virtual_tour_text.length>0){
        this.isVirtualTour = true
        this.refs.panWithSwipe._setAllowTouchResponse(false)
      }
      else if(Platform.OS == 'android'){
        if((this.data[this.showIndex].image.indexOf("https://www.youtube.com/watch") > -1 || this.data[this.showIndex].image.indexOf("https://www.youtu.be/") > -1) && this.props.zoomable!=undefined && this.props.zoomable){
          this.refs.panWithSwipe._setAllowTouchResponse(false)
        }
      }
      else{
        this.refs.panWithSwipe._setAllowTouchResponse(true)
      }
    }
    console.log('index', this.showIndex);

    if(this.props.onIndexChanged != undefined){
      this.props.onIndexChanged(this.showIndex)
    }
    if(this.props.onModalUpdateShowIndex != undefined){
      this.props.onModalUpdateShowIndex(this.showIndex)
    }
  }

  _onModalUpdateShowIndex(modalShowIndex){
    if(this.refs.panWithReceiver != undefined){
      if(this.data[modalShowIndex].image.virtual_tour_text != undefined && this.data[modalShowIndex].image.virtual_tour_text.length>0){
        if(this.refs.modalImageSlider && this.refs.modalImageSlider.refs && this.refs.modalImageSlider.refs.panWithSwipe){
          this.refs.modalImageSlider.refs.panWithSwipe._setAllowTouchResponse(false)
        }
        this.refs.panWithReceiver._setAllowTouchResponse(false)
      }
      else if(this.data[modalShowIndex].image.indexOf("https://www.youtube.com/watch") > -1 || this.data[modalShowIndex].image.indexOf("https://youtu.be/") > -1){
          this.refs.panWithReceiver._setAllowTouchResponse(false)
      }
      else{
          this.refs.panWithReceiver._setAllowTouchResponse(true)
      }
    }
  }

  _handleInitAnims(){
    var anims = []
    if(this.data!= undefined && this.data.length > 0){
      Object.keys(this.data).map((index) => {
        anims[index] = new Animated.Value(0);
      })
    }
    return anims
  }

  _handleInitAutoPlayAnims(){
    this.autoPlayImageAnims = this._handleInitAnims()
    this.autoPlayCircleAnims = this._handleInitAnims()
  }

  _handleInitSlideAnims(direction){
    if(direction == "right"){
      this.slideRightImageAnims = [
        new Animated.Value(0),
        new Animated.Value(0)
      ]
      this.slideRightCircleAnims = [
        new Animated.Value(0),
        new Animated.Value(0)
      ]
    }
    else if(direction == "left"){
      this.slideLeftImageAnims = [
        new Animated.Value(0),
        new Animated.Value(0)
      ]
      this.slideLeftCircleAnims = [
        new Animated.Value(0),
        new Animated.Value(0)
      ]
    }
    if(this.descriptionAnim == undefined && this.belowDescription){
      this.descriptionAnim = new Animated.Value(0)
    }
  }

  _handleInitStyles(){
    var styles = []
    if(this.data!= undefined && this.data.length > 0){
      Object.keys(this.data).map((index) => {
        styles[index] = {}
      })
    }
    return styles
  }

  _handleInitToggleImages(){
    var toggler = []
    if(this.data!= undefined && this.data.length > 0){
      Object.keys(this.data).map((index) => {
        toggler[index] = true
      })
    }
    return toggler
  }

  _handleInitDefaultStyles(){
    this.autoPlayImageStyles = this._handleInitStyles();
    this.autoPlayToggleImages = this._handleInitToggleImages();
    this.circleStyles = this._handleInitStyles();
    this.noAnimImageStyles = this._handleInitStyles();
    this.noAnimToggleImages = this._handleInitToggleImages();
    this.noAnimCircleStyles = this._handleInitStyles();
  }

  _handleInitSlideStyles(direction){
    if(direction == "right"){
      this.slideRightImageStyles = this._handleInitStyles();
      this.slideRightToggleImages = this._handleInitToggleImages();
      this.slideRightCircleStyles = this._handleInitStyles();
    }
    else if(direction == "left"){
      this.slideLeftImageStyles = this._handleInitStyles();
      this.slideLeftToggleImages = this._handleInitToggleImages();
      this.slideLeftCircleStyles = this._handleInitStyles();
    }
  }

  _handleReturnAutoPlayImageStyles(){
    var n = 0;
    if(this.data != undefined) {
      n = this.data.length;
    }
    var s = this.showInterval;
    var t = this.transitionInterval;
    var d = (s+t)*n;
    this.duration = d
    if(this.data!= undefined && this.data.length > 0){
      Object.keys(this.data).map((index) => {
        if(this.data[index].image != undefined){
 
          this.autoPlayToggleImages[index] = true

          if(index==0){
            //image 0
            const left = this.autoPlayImageAnims[index].interpolate({
              inputRange: [
                0,
                s/d,
                1/n,//(s+t)/d,
                1-t/d,
                1
              ],
              outputRange: [
                0,
                0,
                -this.width,
                this.width,
                0
              ]
            })
            const opacity = this.autoPlayImageAnims[index].interpolate({
              inputRange: [
                0,
                1/n,
                1/n+parseFloat(0.06/d),//+0.00001,
                1-t/d-parseFloat(0.06/d),
                1-t/d,
                1
              ],
              outputRange: [
                1,
                1,
                0,
                0,
                1,
                1
              ]
            })
            this.autoPlayImageStyles[index] = {
              left: left,
              opacity: opacity
            }
          }
          else{
            var i = index;
            const left = this.autoPlayImageAnims[index].interpolate({
              inputRange: [
                0,
                s/d + (parseInt(i)-1)/n,//s/d + (s+t)*(parseInt(i)-1)/d,
                i/n,//(s+t)*i/d,
                s/d + i/n,//s/d + (s+t)*i/d,
                (parseInt(i)+1)/n,//(s+t)*(parseInt(i)+1)/d,
                1
              ],
              outputRange: [
                this.width,
                this.width,
                0,
                0,
                -this.width,
                -this.width,
              ]
            })
            this.autoPlayImageStyles[index] = {
              left: left,
            }
          }
        }
      })
    }
  }

  _handleReturnAutoPlayCircleStyles(){
    var n = 0;
    if(this.data != undefined) {
      n = this.data.length;
    }
    var s = this.showInterval;
    var t = this.transitionInterval;
    var d = (s+t)*n;
    if(this.data!= undefined && this.data.length > 0){
      Object.keys(this.data).map((index) => {
        if(index == 0){
          const backgroundColor = this.autoPlayCircleAnims[index].interpolate({
            inputRange: [
              0,
              s/d,
              1/n,//(s+t)/d,
              1-t/d,
              1
            ],
            outputRange: [
              'white',
              'white',
              'transparent',
              'transparent',
              'white'
            ]
          })
          this.autoPlayCircleStyles[index] = {
            backgroundColor: backgroundColor,
          }
        }
        else{
          var i = index;
          const backgroundColor = this.autoPlayCircleAnims[index].interpolate({
            inputRange: [
              0,
              s/d + (parseInt(i)-1)/n,//s/d + (s+t)*(parseInt(i)-1)/d,
              i/n,//(s+t)*i/d,
              s/d + i/n,//s/d + (s+t)*i/d,
              (parseInt(i)+1)/n,//(s+t)*(parseInt(i)+1)/d,
              1
            ],
            outputRange: [
              'transparent',
              'transparent',
              'white',
              'white',
              'transparent',
              'transparent',
            ]
          })
          this.autoPlayCircleStyles[index] = {
             backgroundColor: backgroundColor,
          }
        }
      })
    }
  }

  _handleReturnNoAnimCircleStyles(){
    if(this.data!= undefined && this.data.length > 0){
      Object.keys(this.data).map((index) => {
        if(index==0){
          this.noAnimCircleStyles[index] = {
            backgroundColor: 'white'
          }
        }
        else{
          this.noAnimCircleStyles[index] = {
            backgroundColor: 'transparent'
          }
        }
      })
    }
  }

  _handleReturnNoAnimImageStyles(){
    if(this.data!= undefined && this.data.length > 0){
      Object.keys(this.data).map((index) => {
        
        this.noAnimToggleImages[index] = true

        if(index==0){
          this.noAnimImageStyles[index] = {
            left: 0,
          }
        }
        else if(index==1){
          this.noAnimImageStyles[index] = {
            left: this.width,
          }
        }
        else if(index==this.data.length-1){
          this.noAnimImageStyles[index] = {
            left: -this.width,
          }
        }
        else{
          this.noAnimImageStyles[index] = {
            display: 'none'
          }

          this.noAnimToggleImages[index] = false
        }
      })
    }
  }

  _handleReturnSlideImageStyles(direction){
    var n = 0;
    if(this.data != undefined) {
      n = this.data.length;
    }
    var t = this.slideInterval;
    var d = t;
    if(this.data!= undefined && this.data.length > 0){
      if(direction == "right"){
        Object.keys(this.data).map((index) => {
          if(this.data[index].image != undefined){

            this.slideRightToggleImages[index] = true

            if(index==0){
              //image 0
              const left = this.slideRightImageAnims[0].interpolate({
                inputRange: [
                  0,
                  1
                ],
                outputRange: [
                  0,
                  -this.width,
                ]
              })
              this.slideRightImageStyles[index] = {
                left: left
              }
            }
            else if(index==1){
              //image 1
              var i = index;
              const left = this.slideRightImageAnims[1].interpolate({
                inputRange: [
                  0,
                  1
                ],
                outputRange: [
                  this.width,
                  0
                ]
              })
              this.slideRightImageStyles[index] = {
               left: left
              }
            }
            else{
              this.slideRightImageStyles[index] = {
                display: 'none',
              }

              this.slideRightToggleImages[index] = false
            }
          }
        })
      }
      else if(direction == "left"){
        Object.keys(this.data).map((index) => {
          if(this.data[index].image != undefined){
            this.slideLeftToggleImages[index] = true

            if(index==0){
              //image 0
              const left = this.slideLeftImageAnims[0].interpolate({
                inputRange: [
                  0,
                  1
                ],
                outputRange: [
                  0,
                  this.width,
                ]
              })
              this.slideLeftImageStyles[index] = {
                left: left
              }
            }
            else if(index==this.data.length-1){
              //image 1
              var i = index;
              const left = this.slideLeftImageAnims[1].interpolate({
                inputRange: [
                  0,
                  1
                ],
                outputRange: [
                  -this.width,
                  0
                ]
              })
              this.slideLeftImageStyles[index] = {
                left: left
              }
            }
            else{
              this.slideLeftImageStyles[index] = {
                display: 'none',
              }

              this.slideLeftToggleImages[index] = false
            }
          }
        })
      }
      if(this.belowDescription){
        //image 0
        const opacity = this.descriptionAnim.interpolate({
          inputRange: [
            0,
            0.9,
            1
          ],
          outputRange: [
            1,
            0,
            1
          ]
        })
        this.descriptionBelowStyle = {
          opacity: opacity,
        }
      }
    }
  }

  _handleReturnSlideCircleStyles(direction){
    var n = 0;
    if(this.data != undefined) {
      n = this.data.length;
    }
    var t = this.slideInterval;
    var d = t;
    if(this.data!= undefined && this.data.length > 0){
      if(direction == "right"){
        Object.keys(this.data).map((index) => {
          if(this.data[index].image != undefined){
            if(index==0){
              //circle 0
              const backgroundColor = this.slideRightCircleAnims[0].interpolate({
                inputRange: [
                  0,
                  1
                ],
                outputRange: [
                  'white',
                  'transparent',
                ]
              })
              this.slideRightCircleStyles[index] = {
                backgroundColor: backgroundColor
              }
            }
            else if(index==1){
              //circle 1
              var i = index;
              const backgroundColor = this.slideRightCircleAnims[1].interpolate({
                inputRange: [
                  0,
                  1
                ],
                outputRange: [
                  'transparent',
                  'white'
                ]
              })
              this.slideRightCircleStyles[index] = {
                backgroundColor: backgroundColor
              }
            }
            else{
              this.slideRightCircleStyles[index] = {
                backgroundColor: 'transparent'
              }
            }
          }
        })
      }
      else if(direction == "left"){
        Object.keys(this.data).map((index) => {
          if(this.data[index].image != undefined){
            if(index==0){
              //circle 0
              const backgroundColor = this.slideLeftCircleAnims[0].interpolate({
                inputRange: [
                  0,
                  1
                ],
                outputRange: [
                  'white',
                  'transparent',
                ]
              })
              this.slideLeftCircleStyles[index] = {
                backgroundColor: backgroundColor
              }
            }
            else if(index==this.data.length-1){
              //circle 1
              var i = index;
              const backgroundColor = this.slideLeftCircleAnims[1].interpolate({
                inputRange: [
                  0,
                  1
                ],
                outputRange: [
                  'transparent',
                  'white'
                ]
              })
              this.slideLeftCircleStyles[index] = {
                backgroundColor: backgroundColor
              }
            }
            else{
              this.slideLeftCircleStyles[index] = {
                backgroundColor: 'transparent'
              }
            }
          }
        })
      }
    }
  }

  _handleReturnDefaultStyles(){
    if(this.autoPlay && !this.singleImage){
      this._handleReturnAutoPlayImageStyles();
      this._handleReturnAutoPlayCircleStyles();
    }
    this._handleReturnNoAnimImageStyles();
    this._handleReturnNoAnimCircleStyles();
  }

  _handleReturnSlideStyles(direction){
    this._handleReturnSlideImageStyles(direction);
    this._handleReturnSlideCircleStyles(direction);
  }

  _handleCreateAnimationTiming(anim, toValue, duration, easing, delay){
    return Animated.timing(
      anim,
      {
        toValue: toValue,
        duration,
        easing,
        delay,
      }
    )
  }

  _handleReturnAutoPlayAnimsTiming(){
    var autoPlayAnimsTimingArray = []
    var circleAutoPlayAnimsTimingArray = []
    if(this.data!= undefined && this.data.length > 0){
      this.duration = (this.showInterval + this.transitionInterval)*(this.data.length)
      Object.keys(this.data).map((index) => {
        autoPlayAnimsTimingArray[index] = this._handleCreateAnimationTiming(this.autoPlayImageAnims[index], 1, this.duration*1000, Easing.linear, 0);
        circleAutoPlayAnimsTimingArray[index] = this._handleCreateAnimationTiming(this.autoPlayCircleAnims[index], 1, this.duration*1000, Easing.linear, 0);
      })
    }
    autoPlayAnimsTimingArray = [...autoPlayAnimsTimingArray, ...circleAutoPlayAnimsTimingArray];
    this.autoPlayAnimsTimingArray = autoPlayAnimsTimingArray;
  }

  _handleReturnSlideAnimsTiming(direction){
    if(this.belowDescription){
      var descriptionAnimTiming = this._handleCreateAnimationTiming(this.descriptionAnim, 1, this.slideInterval*1000, Easing.linear, 0);
    }
    if(direction == "right"){
      var slideRightAnimsTimingArray = []
      var circleSlideRightAnimsTimingArray = []
      if(this.slideRightImageAnims!= undefined && this.slideRightImageAnims.length > 0
      && this.slideRightCircleAnims!= undefined && this.slideRightCircleAnims.length > 0){
        Object.keys(this.slideRightImageAnims).map((index) => {
          slideRightAnimsTimingArray[index] = this._handleCreateAnimationTiming(this.slideRightImageAnims[index], 1, this.slideInterval*1000, Easing.linear, 0);
        })
        Object.keys(this.slideRightCircleAnims).map((index) => {
          circleSlideRightAnimsTimingArray[index] = this._handleCreateAnimationTiming(this.slideRightCircleAnims[index], 1, this.slideInterval*1000, Easing.linear, 0);
        })
      }
      slideRightAnimsTimingArray = [...slideRightAnimsTimingArray, ...circleSlideRightAnimsTimingArray, descriptionAnimTiming];
      return slideRightAnimsTimingArray;
    }
    else if(direction == "left"){
      var slideLeftAnimsTimingArray = []
      var circleSlideLeftAnimsTimingArray = []
      if(this.slideLeftImageAnims!= undefined && this.slideLeftImageAnims.length > 0
      && this.slideLeftCircleAnims!= undefined && this.slideLeftCircleAnims.length > 0){
        Object.keys(this.slideLeftImageAnims).map((index) => {
          slideLeftAnimsTimingArray[index] = this._handleCreateAnimationTiming(this.slideLeftImageAnims[index], 1, this.slideInterval*1000, Easing.linear, 0);
        })
        Object.keys(this.slideLeftCircleAnims).map((index) => {
          circleSlideLeftAnimsTimingArray[index] = this._handleCreateAnimationTiming(this.slideLeftCircleAnims[index], 1, this.slideInterval*1000, Easing.linear, 0);
        })
      }
      slideLeftAnimsTimingArray = [...slideLeftAnimsTimingArray, ...circleSlideLeftAnimsTimingArray, descriptionAnimTiming];
      return slideLeftAnimsTimingArray;
    }
    else {
      return []
    }
  }

  _handleStartAutoPlay(){
    // console.log("start autoPlay");
    var showIndex = this.showIndex
    if(this.data!= undefined && this.data.length>0){
      Object.keys(this.data).map((index)=>{
        this.autoPlayImageAnims[index].setValue(0)
        this.autoPlayCircleAnims[index].setValue(0);
        var time = (parseInt(index) + parseInt(1)) * (this.transitionInterval + this.showInterval) - 2/3*this.transitionInterval;
        setTimeout(()=>{
          if(!this.autoPlayStopped){
            var showingIndex = parseInt(index) + parseInt(showIndex)+parseInt(1)
            if(showingIndex >= this.data.length){
              showingIndex = showingIndex % this.data.length
            }
            this.showIndex = showingIndex
          }
        }, (time * 1000))
      })
      this._handleReturnAutoPlayAnimsTiming();
      Animated.parallel(this.autoPlayAnimsTimingArray).start(()=>{
          if(!this.autoPlayStopped){
            this._handleStartAutoPlay()
          }
      })
    }
  }

  _handleStartSlide(direction){
    // console.log("start slide", direction);
    var showIndex = this.showIndex
    if(this.slideRightImageAnims!= undefined && this.slideRightImageAnims.length > 0
    && this.slideRightCircleAnims!= undefined && this.slideRightCircleAnims.length > 0
    && direction == "right"){
      Object.keys(this.slideRightImageAnims).map((index) => {
        this.slideRightImageAnims[index].setValue(0)
      })
      Object.keys(this.slideRightCircleAnims).map((index) => {
        this.slideRightCircleAnims[index].setValue(0);
      })
      //description animation
      if(this.belowDescription){
        this.descriptionAnim.setValue(0);
      }
      //set time out to update
      var time = this.slideInterval/3
      setTimeout(()=>{
        var showingIndex = parseInt(showIndex)+parseInt(1)
        if(showingIndex >= this.data.length){
          showingIndex = 0
        }
        this.showIndex = showingIndex
        this._onUpdateShowIndex();
      }, (time * 1000))
    }
    if(this.slideLeftImageAnims!= undefined && this.slideLeftImageAnims.length > 0
    && this.slideLeftCircleAnims!= undefined && this.slideLeftCircleAnims.length > 0
    && direction == "left"){
      Object.keys(this.slideLeftImageAnims).map((index) => {
        this.slideLeftImageAnims[index].setValue(0)
      })
      Object.keys(this.slideLeftCircleAnims).map((index) => {
        this.slideLeftCircleAnims[index].setValue(0);
      })
      //set time out to update
      var time = this.slideInterval/3
      setTimeout(()=>{
        var showingIndex = parseInt(showIndex)-parseInt(1)
        if(showingIndex < 0){
          showingIndex += this.data.length
        }
        this.showIndex = showingIndex
        this._onUpdateShowIndex();
      }, (time * 1000))
    }

    var slideAnimsTiming = this._handleReturnSlideAnimsTiming(direction);
    Animated.parallel(slideAnimsTiming).start(()=>{
      if(this.state.animation == 'slideRight' || this.state.animation == "slideLeft"){
        /*if(this.autoPlay){
          this.setState({
            animation: 'autoPlay'
          })
        }*/
        // else{
          this._handleSetState({
            animation: 'none'
          })
        // }
      }
    })
  }

  _handleSlideAnimsAndStyles(direction){
    if(direction == "right"){
      if(!this.slideRightSet){
        this._handleInitSlideAnims(direction);
        this._handleInitSlideStyles(direction);
        this._handleReturnSlideStyles(direction);
      }
      this._handleStartSlide(direction);
      this.slideRightSet = true
      this._handleSetState({
        animation: 'slideRight',
      })
    }
    else if(direction == "left"){
      if(!this.slideLeftSet){
        this._handleInitSlideAnims(direction);
        this._handleInitSlideStyles(direction);
        this._handleReturnSlideStyles(direction);
      }
      this._handleStartSlide(direction);
      this.slideLeftSet = true
      this._handleSetState({
        animation: 'slideLeft',
      })
    }
  }

  _handleAllAutoPlayOrNoAnimsAndStyles(){
    if(this.autoPlay && !this.singleImage){
      this._handleInitAutoPlayAnims();
      this._handleInitDefaultStyles();
      this._handleStartAutoPlay();
      this._handleReturnDefaultStyles();
    }
    else{
      this._handleReturnDefaultStyles();
    }
  }

  _handleSlide(direction){
    //stop autoPlay animation
    if(this.state.animation == "autoPlay"){
      this.autoPlayStopped = true
      Object.keys(this.autoPlayAnimsTimingArray).map((index) => {
        this.autoPlayAnimsTimingArray[index].stop();
      })
    }
    this._handleSlideAnimsAndStyles(direction);
  }

  _handleOnPress(index, image, link){
    // console.log("_handle navigation", index);
    if(this.props.isGalleryMode){
      this.showIndex = index
    }
    if(this.state.animation == "autoPlay"){
      this.autoPlayStopped = true
      Object.keys(this.autoPlayAnimsTimingArray).map((index) => {
        this.autoPlayAnimsTimingArray[index].stop();
      })
      this._handleSetState({
        animation: 'none'
      })
    }
    if(this.fullScreen){
      this._toggleFullScreen();
    }
    else if(this.props.handleNavigation != undefined){
      this.props.handleNavigation(this.id, index, link)
    }
  }

  _toggleFullScreen(){
    if(Platform.OS == 'ios'){
      StatusBar.setHidden(!this.state.fullScreen)
    }
    this._handleSetState({
      fullScreen: !this.state.fullScreen
    });
  }

  _handleDynamicStyles(width,height){
    var imageSizeStyle = {}

    if(this.props.isGalleryMode){
      width = (this.screenWidth-this.props.separatorBorderWidth)/this.props.numTuples
      heigh = width
      imageSizeStyle = {
        width: "100%",
        height: "100%"
      };
    }

    else{
      imageSizeStyle={
        width: this.width,
        height: this.height
      }
    }

    var titleSizeStyle = {
      fontSize: Math.floor(width/17),
      lineHeight: Math.floor(width/15),
    };
    var descriptionSizeStyle = {
      fontSize: Math.floor(width/25)
    };
    //slider style
    var sliderImageSize = Math.floor(width/17);
    var paddingVertical = Math.floor(width/18);
    var sliderContainerHeight = sliderImageSize+paddingVertical*2;
    sliderContainerHeight =  sliderContainerHeight<36? 36 : sliderContainerHeight
    sliderContainerHeight =  sliderContainerHeight>47? 47 : sliderContainerHeight
    sliderImageSize = sliderImageSize < 16? 16: sliderImageSize
    var sliderPositionVertical = Math.floor((height - sliderContainerHeight)/2)
    var sliderContainerStyle = {
      // width: 100,
      width: sliderContainerHeight,//sliderImageSize + 4 < 36 ? 36 : sliderImageSize + 4,
      top: sliderPositionVertical,
      bottom: sliderPositionVertical,
    };
    var sliderImageStyle = {
      width: sliderImageSize,
      height: sliderImageSize
    };
    //navigation style
    var circleSize = Math.floor(width/40);
    var marginSize = Math.floor(circleSize/3);
    if(circleSize < 5){
      circleSize = 5;
      marginSize = 1.5
    };
    var circleStyle = {
      width: circleSize,
      height: circleSize,
      marginLeft: marginSize,
      marginRight: marginSize,
    };
    var belowDescriptionPaddings = this.belowDescriptionPadding.split(" ")
    var descriptionBelowStyle = {
      paddingTop: parseInt(belowDescriptionPaddings[0]),
      paddingRight: parseInt(belowDescriptionPaddings[1]),
      paddingBottom: parseInt(belowDescriptionPaddings[2]),
      paddingLeft: parseInt(belowDescriptionPaddings[3]),
    }
    return {
      imageSizeStyle,
      titleSizeStyle,
      descriptionSizeStyle,
      descriptionBelowStyle,
      sliderContainerStyle,
      sliderImageStyle,
      circleStyle,
      // navigationStyle,
      circleSize,
      marginSize,
    }
  }

  _handleNavigationStyle(){
    const {circleSize, marginSize} = this.dynamicStyles
    var navigationStyle = {}
    if(this.data.length>=18){
      navigationStyle = {
        left: this.width*0.1,
        width: this.width*0.8,
        overflow: 'hidden',
        backgroundColor: "transparent"
      }
    }
    else{
      var navigationWidth = this.data.length * (circleSize+marginSize*2)
      var navigationPositionHorizontal = Math.floor((this.width - navigationWidth)/2)
      navigationStyle = {
        right: navigationPositionHorizontal,
        left: navigationPositionHorizontal,
      }
    }
    return navigationStyle
  }

  _handleImageSize(){
    this.imageSizes = []
    if(this.data != undefined && this.data.length > 0){
      var needResize = false
      Object.keys(this.data).map((index)=>{
        if(this.data[index].image != undefined){
          Image.getSize(this.data[index].image, (width, height) => {
            this.imageSizes[index] = {
              getSize: true,
              width: width,
              height: height
            }
            if((this.width/this.height) < (this.imageSizes[index].width/this.imageSizes[index].height)){
              this.height = this.imageSizes[index].height/this.imageSizes[index].width * this.width;
              this._handleInitDynamicStyleAndDefaultAnim();
              needResize = true
            }
            var allGetSize = true
            for(var i=0; i<this.data.length; i++){
              if(this.imageSizes[i] == undefined || this.imageSizes[i].getSize == undefined){
                allGetSize = false;
                break
              }
            }
            this.allGetSize = allGetSize
            if(allGetSize && needResize){
              this._handleResetState();
            }
        }, (error) => {
            console.log(error);
        })
        }
      })
    }
  }

  _handleResetState(){
    this._handleSetState({
        animation: (this.autoPlay && !this.singleImage)? 'autoPlay' : 'none',
        update: !this.state.update
    })
  }

  _handleSetState(newState){
      if(this.didMount){
          this.setState(newState)
      }
  }

  _handleInitDynamicStyleAndDefaultAnim(){
    // console.log('init dynamic styles, default anims and styles');
    //x,y
    this.dynamicStyles = this._handleDynamicStyles(this.width,this.height);
    this.dynamicStyles.navigationStyle = this._handleNavigationStyle();
    this._handleAllAutoPlayOrNoAnimsAndStyles();
  }

  _handleGetDimension(layout){
    // console.log('_handleGetDimension');
    //x,y
    this.width = layout.width;
    this.height = layout.height;
    this.dynamicStyles = this._handleDynamicStyles(this.width,this.height);
    this._handleAllAutoPlayOrNoAnimsAndStyles();
  }

  _handleStartTouchAnimation(){
    if(this.state.animation == "autoPlay"){
      this.autoPlayStopped = true
      Object.keys(this.autoPlayAnimsTimingArray).map((index) => {
        this.autoPlayAnimsTimingArray[index].stop();
      })
      this._handleSetState({
        animation: 'none'
      })
    }
  }

  _handleAfterTouchAnimation(animatedValueX, animatedValueY){
    if(animatedValueX == -this.width){
      this.showIndex = this.showIndex + 1
      if(this.showIndex >= this.data.length){
        this.showIndex = 0;
      };
      this._handleSetState(
        {
          animation: 'none',
          update: !this.state.update
        }
      )
      if(this.refs && this.refs.panWithSwipe){
        this.refs.panWithSwipe._resetPosition()
      }
    }
    else if(animatedValueX == this.width){
      this.showIndex = this.showIndex - 1
      if(this.showIndex < 0){
        this.showIndex = this.data.length - 1;
      }
      this._handleSetState(
        {
          animation: 'none',
          update: !this.state.update
        }
      )
      if(this.refs && this.refs.panWithSwipe){
        this.refs.panWithSwipe._resetPosition()
      }
    }
    this._onUpdateShowIndex();
  }

  _removeSpecialCharacter(string){
    return string.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, "\"")
  }

  _handleModalPanReceiverEndTouch(movedDistanceX, movedDistanceY){
    var verticalThreshold = 60
    if(Math.abs(movedDistanceY)>verticalThreshold){
      this._toggleFullScreen()
    }
  }

  componentWillReceiveProps(nextProps){
    // console.log("receive props");
    if(nextProps.showIndex != undefined && nextProps.showIndex != this.showIndex){
      this.showIndex = nextProps.showIndex
      this._onUpdateShowIndex();
    }
    if(nextProps.data != undefined && JSON.stringify(nextProps.data) != JSON.stringify(this.data)){
      var oldLength = this.data.length
      this.dataSetChanged = true
      this.autoPlayStopped = true
      if(nextProps.data.length == 1){
        this.singleImage = true
      }
      else if(nextProps.data.length > 1){
        this.singleImage = false
      }

      this.data = nextProps.data;
      if(oldLength != this.data.length){
        this._handleAllAutoPlayOrNoAnimsAndStyles();
        this.dynamicStyles.navigationStyle = this._handleNavigationStyle();
      }
      if(this.autoResize) {
        this._handleImageSize();
      }
      this._handleResetState()
    }
  }

  componentDidMount(){
    this.didMount = true
  }

  componentDidUpdate(){
    if(this.dataSetChanged){
      if(this.autoPlay && !this.singleImage){
        this.autoPlayStopped = false
        this._handleSetState({
          animation: 'autoPlay'
        })
      }
      this.dataSetChanged = false
    }
    this._onUpdateShowIndex();
    if(this.state.fullScreen){
      if(this.refs.modalImageSlider){
        this.refs.modalImageSlider._onUpdateShowIndex();
      }
    }
    /*Object.keys(this.autoPlayAnimsTimingArray).map((index) => {
      this.autoPlayAnimsTimingArray[index].stop()
    })
    this.autoPlayStopped = true*/
  }

  componentWillUnmount(){
    this.didMount = false
    // Object.keys(this.autoPlayImageAnims).map((index) => {
    //   this.autoPlayImageAnims[index].removeAllListeners()
    // })
  }

  shouldComponentUpdate(nextProps, nextState){
    if(nextProps.width != undefined && nextProps.width != this.width){
      return true
    }
    if(nextProps.height != undefined && nextProps.height != this.height){
      return true
    }
    return JSON.stringify(nextState) != JSON.stringify(this.state)
  }

  render(){
    this._initStyle();
    const {imageSizeStyle, titleSizeStyle, descriptionSizeStyle, sliderContainerStyle, sliderImageStyle,
      circleStyle, navigationStyle, descriptionBelowStyle} = this.dynamicStyles
    var renderPopup = () => {
      if(this.fullScreen){
        return(
          <Modal
            animationType={"fade"}
            visible={this.state.fullScreen || false}
            onRequestClose={this._toggleFullScreen}>
            <PanWithReceiver
              ref={"panWithReceiver"}
              style={{
                flex: 1,
                backgroundColor: "black",
                alignItems: "center",
                justifyContent: "center"
              }}
              allowDirection={"up-down"}
              handleEndTouch={this._handleModalPanReceiverEndTouch}>
              <ImageSlider
                ref={"modalImageSlider"}
                width={this.screenWidth}
                height={this.screenHeight}
                id = {`imageSlider`}
                nid = {this.props.nid}
                zoomable = {true}
                transitionInterval = {0.5}
                showInterval = {2}
                slideInterval = {0.3}
                navigation = {false}
                carouselNavigation = {false}
                overlayText = {this.props.overlayText}
                showIndex = {this.showIndex}
                lazyLoad = {this.lazyLoad}
                resizeMode = {"contain"}
                backgroundColor = {"black"}
                fullScreen = {false}
                data={this.data}
                onModalUpdateShowIndex = {this._onModalUpdateShowIndex}
              />
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 48,
                  height: 48,
                  flexDirection: 'row'
                }}>
                <IconMenu
                    imageWidth={32}
                    imageHeight={32}
                    padding={10}
                    type={"icon"}
                    imageSource={require('../../assets/icons/close_icon_round_blackbg.png')}
                    onPress={()=>this._toggleFullScreen()}
                />
              </View>
            </PanWithReceiver>
          </Modal>
        )
      }
    }

    var renderAnimatedImage = (index, data, style) => {
      //inside animated are image and overlay text
      var resizeMode = this.resizeMode;
      // if(this.autoResize){
      //   resizeMode = (this.imageSizes[index].height >= this.imageSizes[index].width)? "contain" : resizeMode
      // }
      var renderImageAndText = () => {
        var autoAdjustTitleStyle = {}
        if(this.props.isOverlayTitleAutoResize && data.title!=undefined && data.title.length>0){
          if(data.title.length<this.titleAutoResizeStyle.s.max){
            autoAdjustTitleStyle = this.titleAutoResizeStyle.s.style
          }
          else if(data.title.length<this.titleAutoResizeStyle.m.max){
            autoAdjustTitleStyle = this.titleAutoResizeStyle.m.style
          }
          else /*if(data.title.length<this.titleAutoResizeStyle.l.max)*/{
            autoAdjustTitleStyle = this.titleAutoResizeStyle.l.style
          }
        }
        return(
          <View
            style = {[{flex:1}]}>
            {renderLazyLoadImage()}
            {this.overlayText && (data.title != undefined || data.description != undefined)?
              (
              <View
                style={styles.overlayTextContainer}>
                {(data.title != undefined && data.title.length>0) ?
                  <Text
                    style={[{width:this.width*0.75},styles.title, titleSizeStyle,autoAdjustTitleStyle]}>
                    {data.title}
                  </Text>
                  :
                  (<View/>)
                }
                {(data.description != undefined && data.description.length>0) ?
                  <Text
                    style={[{width:this.width*0.7},styles.description, descriptionSizeStyle]}>
                    {data.description}
                  </Text>
                  :
                  (<View/>)
                }
              </View>
              ):
              (<View></View>)
            }

            {(data.category) ? _renderCategory(data, style) : null}

          </View>
        )
      }

      var _renderCategory = (data, style) => {
        console.log("data", data)
        
        return (<View
          style={[
            styles.labelContainer,
            { display: (data.category) ? 'flex' : 'none' }]}>
          <Text
            style={styles.labelText}>
            {data.category}
          </Text>
        </View>)
      }

      var _renderYoutube = (videoURL) => {
        var videoId = "ixRDa-jprco" //edgeprop video
        videoId = videoURL.split('v=')[1] || videoURL.split('youtu.be/')[1];
        var ampersandPosition = videoId.indexOf('&');
        if(ampersandPosition != -1) {
          video_id = videoId.substring(0, ampersandPosition);
        }
        if(Platform.OS == 'android') {
          return (
              <WebView
                style={imageSizeStyle}
                javaScriptEnabled={true}
                source={{ html: renderYoutubeHTML(videoId, imageSizeStyle.width, imageSizeStyle.height) }}
                onMessage={event => {
                  /*if the video is playing (videoEvent_1 = playing)*/
                  if(event.nativeEvent.data === "videoEvent_1") {
                    this.setState({
                      youtubePaused: false
                    })
                  }
                  else {
                    this.setState({
                      youtubePaused: true
                    })
                  }
                }}
              />
          )
        }
        else {
          return (
            <WebView
              style={imageSizeStyle}
              javaScriptEnabled={true}
              source={{ uri: 'https://www.youtube.com/embed/' + videoId + '/rel=0&controls=1&autohide=0' }}
            />
          )
        }
      }

      var renderYoutubeHTML = (videoID, width, height) => {
        const htmlValue = `<!DOCTYPE html>
          <html>
          <head>

        <meta name="viewport" content="initial-scale=1.0">
          </head>
          <body style="margin: 0px;background-color:#000;">
              <!-- 1. The <iframe> (and video player) will replace this <div> tag. -->
              <div id="player"></div>

              <script>
                // 2. This code loads the IFrame Player API code asynchronously.
                var tag = document.createElement('script');

                tag.src = "https://www.youtube.com/iframe_api";
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

                // 3. This function creates an <iframe> (and YouTube player)
                //    after the API code downloads.
                var player;
                function onYouTubeIframeAPIReady() {
                  player = new YT.Player('player', {
                    height: '` +
            height +
            `',
                    width: '` +
            width +
            `',
                    videoId: '` +
            videoID +
            `',
                    events: {
                      'onReady': onPlayerReady,
                      'onStateChange': onPlayerStateChange
                    }
                  });
                }

                function onPlayerReady(event) {
                  event.target.playVideo();
                }

                // 4. The API calls this function when the player's state changes..
                var done = false;
                function onPlayerStateChange(event) {
                  window.postMessage("videoEvent_"+JSON.stringify(event.data))
                }
              </script>
            </body>
          </html>`;
          return htmlValue;
      }

      //image is rendered by lazyload
      var renderLazyLoadImage = () => {
        if(data.image.virtual_tour_text != undefined && data.image.virtual_tour_text.length>0){
          if (data.image.virtual_tour_text.indexOf('[{') > -1 && data.image.virtual_tour_text.indexOf('}]') > -1) {
            var fullScreenMode = this.props.onModalUpdateShowIndex!=undefined
            var mHeight= this.height
            if(fullScreenMode){
              if(Platform.OS == 'android'){
                mHeight = mHeight - StatusBar.currentHeight;
              }
            }
            return(
                <View style={{width:this.width,height:mHeight}}>
                  <PannellumView
                    nid={this.props.nid}
                    width={this.width}
                    height={mHeight}
                    virtual_tour_text={data.image.virtual_tour_text}
                    toggleFullscreen={this._toggleFullScreen}
                    fullScreenMode={fullScreenMode}
                  />
                  {renderOverlay360(true)}
                </View>
            )
          }
        }
        else if(data.image.indexOf("https://www.youtube.com/watch")>-1 || data.image.indexOf("https://youtu.be/")>-1){
          var fullScreenVideoStyle = {
            paddingTop: (this.props.zoomable!=undefined && this.props.zoomable)? 48 : 0,
            paddingBottom: (this.props.zoomable!=undefined && this.props.zoomable)? 7 : 0,
          }
          return(
            <View
              pointerEvents = {(this.props.zoomable!=undefined && this.props.zoomable?'auto':'none')}
              style={{...this.imageContainer, ...imageSizeStyle, ...fullScreenVideoStyle}}>
              {_renderYoutube(data.image)}
            </View>
          )
        }
        else if(this.props.zoomable!=undefined && this.props.zoomable){
          return(
            <ZoomableImage
              resizeMode={"contain"}
              style={[this.imageContainer, imageSizeStyle]}
              source={{uri: data.image}}
              imageWidth={this.width}
              imageHeight={this.height}>
            </ZoomableImage>
          )
        }
        else if(!this.lazyLoad || data.thumbnail == undefined){
          return (
            <Common_Image
              style={[this.imageContainer, imageSizeStyle]}
              source={{uri: data.image}}
              resizeMode = {resizeMode}
              defaultSource={"https://dkc9trqgco1sw.cloudfront.net/s3fs-public/default_images/no_img.png"}>
            </Common_Image>
          )
        }
        else if(this.lazyLoad && data.thumbnail != undefined){
          return (
            <ProgressiveImage
              style={[this.imageContainer, imageSizeStyle]}
              source={{uri: data.image}}
              thumbnail={{uri: data.thumbnail}}
              duration = {this.lazyLoadDuration}
              resizeMode = {resizeMode}>
            </ProgressiveImage>
          )
        }
      }

      var transformStyle = this.props.isGalleryMode ? {} : {
        transform: [
          {translateX: this.width},
          {translateY: this.height}
        ],
        backgroundColor: this.backgroundColor
      }
      return(
        <Animated.View
          key={`image-${index}`}
          style={[styles.animatedImageContainer, imageSizeStyle, style, transformStyle]}>
          {(!(data.image.virtual_tour_text != undefined && data.image.virtual_tour_text.length>0))&&this.navigation ?
            (
              <TouchableHighlight
                // disabled = {data.image.indexOf("https://www.youtube.com/watch")>-1}
                style = {[{flex:1}]}
                underlayColor = {"transparent"}
                onPress={()=>this._handleOnPress(index, data.image, data.link)}>
                {renderImageAndText()}
              </TouchableHighlight>
            )
            :
            (
              <View
                style={{flex:1}}>
                {renderImageAndText()}
              </View>
            )
          }
          {/* <View
            style={{flex:1}}>
            {renderImageAndText()}
          </View> */}
        </Animated.View>
      )
    }

    if(this.props.isGalleryMode){
      return(
        <View style={{flex:1}}>
          <ImageGallery
            items={this.props.data}
            itemStyle={this.props.itemStyle}
            itemFocusStyle={this.props.itemFocusStyle}
            showSeparator={this.props.showSeparator}
            separatorBorderWidth={this.props.separatorBorderWidth}
            separatorBorderColor={this.props.separatorBorderColor}
            data={this.items}
            numTuples={this.props.numTuples}
            lastRowFill={false}
            width={this.width}
            height={this.height}
            renderItem={(index,item,width,height) => {
              return (
                <View style={{flex:1}}>
                  {renderAnimatedImage(index,item,imageSizeStyle)}
                </View>
              )
            }}
          />
          {renderPopup()}
        </View>
      )
    }

    else if(this.width != 0 && this.height != 0 /*&& (this.autoResize && this.allGetSize || !this.autoResize)*/) {
      {
        //image styles
        if(this.imageStyles == undefined || this.imageStyles.length <= 0){
          this.imageStyles = this._handleInitStyles();
        }
        if(this.toggleImages == undefined || this.toggleImages.length <= 0){
          this.toggleImages = this._handleInitToggleImages();
        }
        if(this.circleStyles == undefined || this.circleStyles.length <= 0){
          this.circleStyles = this._handleInitStyles();
        }
        //map to autoPlay styles
        if(this.state.animation == 'autoPlay'){
          // this.imageStyles = this.autoPlayImageStyles;
          Object.keys(this.data).map((index)=>{
            var i = index - this.showIndex;
            if(i<0){
              i = i + this.autoPlayImageStyles.length
            }
            this.imageStyles[index] = this.autoPlayImageStyles[i];
            this.toggleImages[index] = this.autoPlayToggleImages[i];
            this.circleStyles[index] = this.autoPlayCircleStyles[i];
          })
        }
        //map to no anim styles
        else if(this.state.animation == 'none'){
          Object.keys(this.data).map((index)=>{
            var i = index - this.showIndex;
            if(i<0){
              i = i + this.data.length
            }
            this.imageStyles[index] = this.noAnimImageStyles[i];
            this.toggleImages[index] = this.noAnimToggleImages[i];
            this.circleStyles[index] = this.noAnimCircleStyles[i];
          })
        }
        //map to slide right styles
        else if(this.state.animation == 'slideRight'){
          Object.keys(this.data).map((index)=>{
            var i = index - this.showIndex;
            if(i<0){
              i = i + this.data.length
            }
            this.imageStyles[index] = this.slideRightImageStyles[i];
            this.toggleImages[index] = this.slideRightToggleImages[i];
            this.circleStyles[index] = this.slideRightCircleStyles[i];
          })
        }
        //map to slide right styles
        else if(this.state.animation == 'slideLeft'){
          Object.keys(this.data).map((index)=>{
            var i = index - this.showIndex;
            if(i<0){
              i = i + this.data.length
            }
            this.imageStyles[index] = this.slideLeftImageStyles[i];
            this.toggleImages[index] = this.slideLeftToggleImages[i];
            this.circleStyles[index] = this.slideLeftCircleStyles[i];
          })
        }
      }

      var renderImages = () => {
        if(this.data != undefined && this.data.length > 0){
          //container is an animated view
          var renderAnimatedImages = () => {
            return Object.keys(this.data).map((index)=>{
              return(
                <View key={index}>
                  { this.toggleImages[index] || (this.showIndex == 0 && index == 0) ? renderAnimatedImage(index, this.data[index], this.imageStyles[index]) : null }
                </View>
              )
            })
          }
          return(
            <View>
              {renderAnimatedImages()}
              {/* render extra animated image in the left side of the view if only 2 images */}
              {(this.data.length == 2)? (
                <View>
                  {renderAnimatedImage("extra",this.data[1-this.showIndex],{left: -this.width})}
                </View>
              ):(
                <View/>
              )}
            </View>
          )
        }
      }

      var renderSliderLeft = () => {
        if(!this.singleImage && this.state.youtubePaused){
          return(
            <View
              style={[styles.sliderContainer, styles.leftSliderContainer, sliderContainerStyle]}>
                <TouchableHighlight
                  // underlayColor={"hsla(0,0%,4%,.5)"}
                  style={[styles.touchableSlideContainer,
                  //  {alignItems:'flex-start'}
                 ]}
                  onPress = {()=>this._handleSlide("left")}>
                  <CachedImage
                    source={require('../../assets/icons/slide-left.png')}
                    style={[styles.sliderImage, sliderImageStyle]}
                  />
                </TouchableHighlight>
            </View>
          )
        }
      }

      var renderSliderRight = () => {
        if(!this.singleImage && this.state.youtubePaused){
          return(
            <View
              style={[styles.sliderContainer, styles.rightSliderContainer, sliderContainerStyle]}>
              <TouchableHighlight
                // underlayColor={"hsla(0,0%,4%,.5)"}
                style={[styles.touchableSlideContainer,
                //  {alignItems:'flex-end'}
               ]}
                onPress = {()=>this._handleSlide("right")}>
                <CachedImage
                  source={require('../../assets/icons/slide-right.png')}
                  style={[styles.sliderImage, sliderImageStyle]}
                />
              </TouchableHighlight>
            </View>
          )
        }
      }

      var renderNavigation = () => {
        if(!this.singleImage && this.carouselNavigation){
          var renderDots = () => {
            if(this.data != undefined && this.data.length>0){
              return Object.keys(this.data).map((index) => {
                return(
                  <Animated.View
                    key={`navigation-${index}`}
                    style={[styles.circle, circleStyle, this.circleStyles[index]]}>
                  </Animated.View>
                )
              })
            }
          }
          return(
            <View style = {[styles.navigationContainer, navigationStyle]}>
              {renderDots()}
            </View>
          )
        }
      }

      var renderDescriptionBelow = () => {
        if(this.belowDescription && this.data[this.showIndex] != undefined){
          if((this.data[this.showIndex].title != undefined && this.data[this.showIndex].title.length > 0) || (this.data[this.showIndex].description != undefined && this.data[this.showIndex].description.length > 0)){
            return(
              <Animated.View style={[styles.descriptionContainer, descriptionBelowStyle /*this.descriptionBelowStyle*/]}>
              {this.type=='newsCategorySlider'&&
              <TouchableOpacity  onPress={()=>this._handleOnPress(this.showIndex, this.data.image, this.data.link)}>
                <View>
                  <Animated.Text style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 13,
                  lineHeight: 23,
                  width: this.width*0.75,
                  color: '#005C98'}}>
                    {this.data[this.showIndex].category}
                  </Animated.Text>
                <Animated.Text style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 18,
                  lineHeight: 23,
                  width: this.width*0.75,
                  color: "#4a4a4a"}}>
                    {this.data[this.showIndex].title}
                </Animated.Text>
                </View>
              </TouchableOpacity>
              }
                {this.type!='newsCategorySlider' && this.data[this.showIndex].title != undefined && this.data[this.showIndex].title.length > 0 ?
                  <Animated.Text style = {[styles.descriptionTitle,this.descriptionBelowStyle,{textAlign: this._removeSpecialCharacter(this.data[this.showIndex].title.replace(/<[^>]+>/g, '')).length>=SHORT_DESCRIPTION_LENGTH? "left": "center"}]}>
                    {this.data[this.showIndex].title}
                  </Animated.Text>
                :<View/>
                }
                {this.data[this.showIndex].description != undefined && this.data[this.showIndex].description.length > 0 ?
                  <HTMLText
                    animated = {true}
                    textStyle={{...this.descriptionStoryStyles,...this.descriptionBelowStyle, ...{textAlign: this._removeSpecialCharacter(this.data[this.showIndex].description.replace(/<[^>]+>/g, '')).length>=SHORT_DESCRIPTION_LENGTH? "left": "center"}}}
                    content={this.data[this.showIndex].description}
                  />
                  :<View/>
                }
              </Animated.View>
            )
          }
        }
      }

      var renderOverlay360 = (boolVal) => {
        if(boolVal){
          return(
            <Image
              style={{position:"absolute",top:5,right:5,width:"20%",height:"20%"}}
              source={require('../../assets/icons/360_image.png')}
              resizeMode={"contain"}
            />
          )
        }
      }

      return(
        <View>
          <View style = {imageSizeStyle}>
            <View style={[this.imageContainer, styles.panResponderContainer, imageSizeStyle,
                {backgroundColor: this.singleImage? this.backgroundColor: "black"}
            ]}>
              <PanWithSwipe
                ref={"panWithSwipe"}
                initialPanPosition={0}
                allowTouchResponse={this.singleImage? false: true}
                allowDirection={"left-right"}
                horizontalThreshold={this.width*0.2}
                // verticalThreshold={this.height/2}
                width={this.width}
                height={this.height}
                handleParentAfterTouchAnimation={this._handleAfterTouchAnimation}
                handleParentStartTouchAnimation={this._handleStartTouchAnimation}
                handleParentTouchValueAnimation={this._handleTouchValueAnimation}
                // handleParentShortTouch={()=>this._handleOnPress(this.showIndex, this.data[this.showIndex].link)}
                >
                {renderImages()}
              </PanWithSwipe>
            </View>
            {renderNavigation()}
          </View>
          {renderDescriptionBelow()}
          {renderPopup()}
          {renderOverlay360(this.props.shouldOverlay360Icon)}
        </View>
      )
    }
    else{
      return(
        <View></View>
      )
    }

    //code to get dimension if width and height is not provided
    /*if(!this.didMount){
      return (
        <View
          style = {styles.container}
          onLayout={(event) => {this._handleGetDimension(event.nativeEvent.layout)}}>
        </View>
      )
    }*/
  }
}

const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
  },
  container:{
    flex: 1,
    overflow: 'hidden'
  },
  panResponderContainer:{
    // backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  //image styles
  animatedImageContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },

  //overlay text styles
  overlayTextContainer:{
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'rgba(0,0,0,.2)',
  },
  title:{
    fontFamily: 'Poppins-SemiBold',
    color: "white",
    // fontSize: 22,
    // lineHeight: 25,
    // fontWeight: '600',
    textAlign: 'center',
  },
  description:{
    fontFamily: 'Poppins-Medium',
    color: "white",
    // fontSize: 13,
    // fontWeight: '500',
    textAlign: 'center'
  },

  //slider styles
  sliderContainer:{
    position: 'absolute',
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  touchableSlideContainer:{
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "hsla(0,0%,4%,.5)"
  },
  leftSliderContainer:{
    left:0,
  },
  rightSliderContainer:{
    right:0,
  },
  sliderImage: {
    // shadowColor: '#1a1a1a',
    // shadowColor: 'black',
    // shadowOffset: {
    //   width: 5,
    //   height: 5
    // },
    // shadowOpacity: 0.5,
    // shadowRadius: 10,
    // width: 24,
    // height: 24,
  },

  //navigation styles
  navigationContainer:{
    position: 'absolute',
    bottom: 0,
    height: 12,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 7,
  },
  circle: {
    borderRadius: 40,
    borderColor: 'white',
    borderWidth: 1,
    // width: 6,
    // height: 6,
    // marginLeft: 2,
    // marginRight: 2,
  },

  //description below styles
  descriptionContainer:{
    backgroundColor: "#f8f8f8",
    // paddingTop: 16,
    // paddingLeft: 15,
    // paddingBottom: 20,
    // paddingRight: 15
  },
  descriptionTitle:{
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
    lineHeight: 17,
    color: "#444444"
  },
  labelContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    // width: '100',
    height: 22,
    backgroundColor: "#f4b122",
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  labelText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    marginHorizontal: 10
  }
})
