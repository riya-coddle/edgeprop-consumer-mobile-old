import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  Modal,
  PanResponder,
  Animated,
  Easing,
  TouchableOpacity
} from 'react-native';

export default class PanWithReceiver extends Component<{}> {
  isSizeKnown = false
  initialImage = {}
  isLayoutKnown = false
  verticalThreshold = 60
  constructor(props){
    super(props);

    this._handleStartShouldSetPanResponder = this._handleStartShouldSetPanResponder.bind(this)
    this._handleMoveShouldSetPanResponder = this._handleMoveShouldSetPanResponder.bind(this)
    this._handlePanResponderGrant = this._handlePanResponderGrant.bind(this)
    this._handlePanResponderMove = this._handlePanResponderMove.bind(this)
    this._handlePanResponderEnd = this._handlePanResponderEnd.bind(this)
    this._setAllowTouchResponse = this._setAllowTouchResponse.bind(this)

    this.allowDirection = props.allowDirection
    var directions = this.allowDirection.split("-")
    this.allowLeft = (directions.indexOf("left") > -1) ? true : false
    this.allowRight = (directions.indexOf("right") > -1) ? true : false
    this.allowUp = (directions.indexOf("up") > -1) ? true : false
    this.allowDown = (directions.indexOf("down") > -1) ? true : false

    this.state = {
      pan: new Animated.ValueXY(0,0),
      allowTouchResponse: true
    }

    this.movedDistanceX = 0;
    this.movedDistanceY = 0;

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });

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

  _handleStartShouldSetPanResponder() {
    if(!this.state.allowTouchResponse){
      return false
    }
    return true;
  }

  _handleMoveShouldSetPanResponder(e, gestureState){
    if(!this.state.allowTouchResponse){
      return false
    }
    //this code is to make touchable child working
    var moveX = gestureState.dx;
    var moveY = gestureState.dy;
    if((Math.abs(moveX) > 30 && (this.allowLeft || this.allowRight))
      || (Math.abs(moveY) > 30 && (this.allowUp || this.allowDown))){
      return true
    }
    else{
      return false
    }
  }

  _handlePanResponderGrant = (e, gestureState) => {
    this.movedDistanceX = 0;
    this.movedDistanceY = 0;
  }

  _handlePanResponderMove = (e, gestureState) => {
    this.movedDistanceX = gestureState.dx
    this.movedDistanceY = gestureState.dy
  }

  _handlePanResponderEnd = (e, gestureState) => {
    this.movedDistanceX = gestureState.dx
    this.movedDistanceY = gestureState.dy
    if(this.props.handleEndTouch){
      this.props.handleEndTouch(this.movedDistanceX, this.movedDistanceY)
    }
  }

  componentWillUnmount() {
  }

  componentDidMount(){
  }

  componentDidUpdate(prevProps, prevState){
  }

  render() {
    return(
      <View style={this.props.style}
        {...this.panResponder.panHandlers}>
        {this.props.children}
      </View>
    )
  }
}
