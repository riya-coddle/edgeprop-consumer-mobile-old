import React, { Component } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  Image,
  Easing,
  TouchableHighlight,
  PanResponder,
  TouchableOpacity,
  Alert
} from 'react-native';

const FLOOR_TIME = 30;
const CEIL_TIME = 800;
const DURATION = 200;
// const SHORT_TOUCH_TIME = 50;

export default class Custom_PanResponder extends React.Component {
  // timingAnim
  animPlaying = false

  //props
  width = 0
  height = 0
  horizontalThreshold = 0
  verticalThreshold = 0
  allowTouchResponse = true
  allowLeft = allowRight = allowUp = allowDown = true
  allowDirection = "left-right-up-down"

  previousAnimatedValueX = 0;
  previousAnimatedValueY = 0;
  animatedValueX = 0
  animatedValueY = 0

  shouldStartResponse = false
  constructor(props){
    super(props);
    this.width = props.width;
    this.height = props.height;
    this.movingDirection = props.movingDirection;
    this.allowTouchResponse = props.allowTouchResponse;
    this.horizontalThreshold = props.horizontalThreshold;
    this.verticalThreshold = props.verticalThreshold;
    this.horizontalShortTouchThreshold = this.width * 0.1
    this.verticalShortTouchThreshold = this.height * 0.1

    this.allowDirection = props.allowDirection
    this.allowLeft = (this.allowDirection.indexOf("left") > -1) ? true : false
    this.allowRight = (this.allowDirection.indexOf("right") > -1) ? true : false
    this.allowUp = (this.allowDirection.indexOf("up") > -1) ? true : false
    this.allowDown = (this.allowDirection.indexOf("down") > -1) ? true : false

    /***Important Note: need to constantly sync between Native Props Styles and component (Animated) Dynamic Styles***/
    this.pan = new Animated.ValueXY(0)
    this.panStyles = {
      style: {
        transform: [
          {translateX: 0},
          {translateY: 0}
        ],
      }
    };
    this.state = {
      allowTouchResponse: true
    }

    this.pan.x.addListener((value) => this.animatedValueX = value.value);
    this.pan.y.addListener((value) => this.animatedValueY = value.value);

    this.width = props.width
    this.height = props.height

    this._updateNativeStyles = this._updateNativeStyles.bind(this);

    this._handlePanResponderEnd = this._handlePanResponderEnd.bind(this);
    this._handlePanResponderMove = this._handlePanResponderMove.bind(this);
    this._handlePanResponderGrant = this._handlePanResponderGrant.bind(this);
    this._handleMoveShouldSetPanResponder = this._handleMoveShouldSetPanResponder.bind(this);
    this._handleStartShouldSetPanResponder = this._handleStartShouldSetPanResponder.bind(this);
    this._handleAnimationAfterRelease = this._handleAnimationAfterRelease.bind(this);
    this._resetPosition = this._resetPosition.bind(this)
    this._setAllowTouchResponse = this._setAllowTouchResponse.bind(this)

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
      onPanResponderTerminationRequest: (evt, gestureState) => true,
    });
  }

  _updateNativeStyles() {
    if(this.panView){
      this.panView && this.panView.setNativeProps(this.panStyles)
    };
  }

  initStyle(){
    if(this.props.allowTouchResponse != undefined && this.props.allowTouchResponse != this.allowTouchResponse){
      this.allowTouchResponse = this.props.allowTouchResponse
    }
    if(this.props.width != undefined && this.props.width != this.width){
      this.width = this.props.width
    }
    if(this.props.height != undefined && this.props.height != this.height){
      this.height = this.props.height
    }
    if(this.props.horizontalThreshold != undefined && this.props.horizontalThreshold != this.horizontalThreshold){
      this.horizontalThreshold = this.props.horizontalThreshold
    }
    if(this.props.verticalThreshold != undefined && this.props.height != this.verticalThreshold){
      this.verticalThreshold = this.props.verticalThreshold
    }
    if(this.props.allowDirection != undefined && this.props.allowDirection != this.allowDirection){
      this.allowDirection = this.props.allowDirection
      var directions = this.allowDirection.split("-")
      this.allowLeft = (directions.indexOf("left") > -1) ? true : false
      this.allowRight = (directions.indexOf("right") > -1) ? true : false
      this.allowUp = (directions.indexOf("up") > -1) ? true : false
      this.allowDown = (directions.indexOf("down") > -1) ? true : false
    }
  }

  _setAllowTouchResponse(flag){
    if(flag != this.state.allowTouchResponse){
      this.setState({
        allowTouchResponse: flag
      })
    }
  }

  _handleStartShouldSetPanResponder(e, gestureState){
    // console.log("pan responder start");
    // Should we become active when the user presses down on the pan?
    // Pan Responder will recognize the touch and set Native Props Styles
    if(!this.state.allowTouchResponse){
      return false
    }
    if(!this.shouldStartResponse){
      this._handleAllowStartResponse(e, gestureState);
    }
    return (true && this.allowTouchResponse);
  }

  _handleMoveShouldSetPanResponder(e, gestureState){
    // console.log("pan responder should move");
     // Should we become active when the user moves a touch over the pan?
    if(!this.state.allowTouchResponse){
      return false
    }
    if(!this.shouldStartResponse){
      this._handleAllowStartResponse(e, gestureState);
    }

    //this code is to make touchable child working
    var moveX = gestureState.dx;
    var moveY = gestureState.dy;
    if((Math.abs(moveX) > 30 && (this.allowLeft || this.allowRight))
      || (Math.abs(moveY) > 30 && (this.allowUp || this.allowDown))){
      return (true && this.allowTouchResponse)
    }
    else{
      // if(this.props.handleParentShortTouch != undefined){
      //   this.props.handleParentShortTouch();
      // }
      return false
    }
  }

  _handleAllowStartResponse(e, gestureState){
    if(this.props.handleParentStartTouchAnimation != undefined){
      this.props.handleParentStartTouchAnimation();
    }
    this.startTouch = e.timeStamp;
    if(this.timingAnim != undefined && this.animPlaying){
      //sync from component style to native props
      this.timingAnim.stop();
      this.previousAnimatedValueX = this.animatedValueX;
      this.previousAnimatedValueY = this.animatedValueY;
      this.panStyles.style.transform = [
        {translateX: this.previousAnimatedValueX},
        {translateY: this.previousAnimatedValueY}
      ]
      this._updateNativeStyles();
    }
    this.shouldStartResponse = true
  }

  _handlePanResponderGrant(e, gestureState) {
    // console.log("pan responder grant");
  }

  _handlePanResponderMove(e, gestureState) {
    // console.log("pan responder move");
    // Pan Responder will recognize the Touch and set Native Props Styles
    this.newValueX = 0;
    this.newValueY = 0;
    this.newValueX = gestureState.dx + this.previousAnimatedValueX
    if((this.newValueX>0 && !this.allowRight)
    || (this.newValueX<0 && !this.allowLeft)
    || (Math.abs(this.newValueX)>this.width)){
      this.newValueX = this.previousAnimatedValueX
    }

    this.newValueY = gestureState.dy + this.previousAnimatedValueY
    if((this.newValueY>0 && !this.allowUp)
    || (this.newValueY<0 && !this.allowDown)
    || (Math.abs(this.newValueY)>this.height)){
      this.newValueY = this.previousAnimatedValueY
    }

    this.panStyles.style.transform = [
      {translateX: this.newValueX},
      {translateY: this.newValueY}
    ];
    this._updateNativeStyles();
    this.movedDistanceX = this.newValueX - this.previousAnimatedValueX
    this.movedDistanceY = this.newValueY - this.previousAnimatedValueY
  };

  _handlePanResponderEnd(e, gestureState) {
    // console.log("pan responder end");
    this.shouldStartResponse = false
    this._handlePanResponderMove(e, gestureState);
    //update previousAnimatedValueX,previousAnimatedValueY
    this.previousAnimatedValueX = this.newValueX
    this.previousAnimatedValueY = this.newValueY
    this.endTouch = e.timeStamp;
    this.touchTime = this.endTouch - this.startTouch
    this.endTouch = 0
    this.startTouch = 0

    this._handleAnimationAfterRelease(e, gestureState)
  };

  _handleAnimationAfterRelease(e, gestureState){

    //After PanResponder Touch ends, sync the Native Props Styles to component (Animated) Dynamic Styles
    var width = 0;
    var height = 0;

    this.pan.setValue({
      x: this.previousAnimatedValueX,
      y: this.previousAnimatedValueY
    })

    //handle Animation afterwards
    //default animate to neareast edge
    var endValueX = (Math.round(this.previousAnimatedValueX/this.width))*this.width
    var endValueY = (Math.round(this.previousAnimatedValueY/this.height))*this.height

    if(this.allowLeft||this.allowRight){
      var shouldAnimate = (this.touchTime >= FLOOR_TIME && this.touchTime <= CEIL_TIME && Math.abs(this.movedDistanceX) >= this.width*0.1) || Math.abs(this.movedDistanceX) >= this.horizontalThreshold
      if(shouldAnimate){
        endValueX = this.movedDistanceX>=0
        ? (Math.ceil(this.previousAnimatedValueX/this.width))*this.width
        : (Math.floor(this.previousAnimatedValueX/this.width))*this.width
      }
      this.movedDistanceX = 0
    }
    if(this.allowUp||this.allowDown){
      var shouldAnimate = (this.touchTime >= FLOOR_TIME && this.touchTime <= CEIL_TIME && Math.abs(this.movedDistanceY) >= this.height*0.1) || Math.abs(this.movedDistanceY) >= this.verticalThreshold
      if(shouldAnimate){
        endValueY = this.movedDistanceX>=0
        ? (Math.ceil(this.previousAnimatedValueY/this.height))*this.height
        : (Math.floor(this.previousAnimatedValueY/this.height))*this.height
      }
      this.movedDistanceY = 0
    }
    this.timingAnim = Animated.timing(
      this.pan,
      {
        toValue: {
          x: endValueX,
          y: endValueY
        },
        // friction: 5,
        // velocity: 0.5,
        duration: DURATION
      }
    )
    this.animPlaying = true
    this.timingAnim.start(() => {
      //sync from component style to native props
      this.previousAnimatedValueX = this.animatedValueX;
      this.previousAnimatedValueY = this.animatedValueY;
      this.panStyles.style.transform = [
        {translateX: this.previousAnimatedValueX},
        {translateY: this.previousAnimatedValueY}
      ]
      this._updateNativeStyles();
      this.animPlaying = false
      if(this.props.handleParentAfterTouchAnimation != undefined){
        this.props.handleParentAfterTouchAnimation(endValueX, endValueY);
      }
    })
  }

  componentWillReceiveProps(nextProps){
  }

  componentWillMount() {
  };

  componentWillUnmount(){
    this.pan.x.removeAllListeners();
    this.pan.y.removeAllListeners();
  }

  componentDidMount() {
  };

  _resetPosition(){
    //reset position
    this.previousAnimatedValueX = 0;
    this.previousAnimatedValueY = 0;
    this.pan.setValue({
      x: 0,
      y: 0
    })
    this.panStyles.style.transform = [
      {translateX: this.previousAnimatedValueX},
      {translateY: this.previousAnimatedValueY}
    ];
    this._updateNativeStyles();
  }

  render() {
    // console.log("render");
    this.initStyle();
    var containerStyle = {
      width: this.width*3,
      height: this.height*3,
    }
    return (
      <Animated.View
        ref={(panView) => {
          this.panView = panView;
        }}
        style = {[/*this.props.style*/containerStyle,
          {
            transform: this.pan.getTranslateTransform()
          }]}
        {...this.panResponder.panHandlers}>
        {this.props.children}
      </Animated.View>
    )
  };
}

const styles = StyleSheet.create({
})
