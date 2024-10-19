/** Links:
 *  - http://stackoverflow.com/questions/36368919/scrollable-image-with-pinch-to-zoom
 *  - http://blog.lum.pe/gesture-detection-in-react-native-fixing-unexpected-panning/
 *
 */

import React, {Component} from 'react';
import { Text, Animated, View, PanResponder, Image, Alert } from 'react-native';

class ZoomableImage extends Component {
    defaultSource = "https://dkc9trqgco1sw.cloudfront.net/s3fs-public/default_images/no_img.png"
    zoom = 1
    minZoom = 1
    layoutKnown = true
    isZooming = false
    isMoving = false
    initialDistance = 0
    initialX = 0
    initalY = 0
    offsetTop = 0
    offsetLeft = 0
    initialTop = 0
    initialLeft = 0
    initialTopWithoutZoom = 0
    initialLeftWithoutZoom = 0
    initialZoom = 1
    top = 0
    left = 0
    didMount = false
    onError = false

    constructor(props) {
        super(props);

        this._handleStartShouldSetPanResponder = this._handleStartShouldSetPanResponder.bind(this)
        this._handleMoveShouldSetPanResponder = this._handleMoveShouldSetPanResponder.bind(this)
        this._handlePanResponderMove = this._handlePanResponderMove.bind(this);
        this._handlePanResponderGrant = this._handlePanResponderGrant.bind(this)
        this._handlePanResponderRelease = this._handlePanResponderRelease.bind(this)
        this._handlePanResponderTerminate = this._handlePanResponderTerminate.bind(this)
        this._handlePanResponderTerminationRequest = this._handlePanResponderTerminationRequest.bind(this);

        this._processPinch = this._processPinch.bind(this)
        this._processTouch = this._processTouch.bind(this)
        this.calcDistance = this.calcDistance.bind(this)
        this.calcCenter = this.calcCenter.bind(this)
        this.maxOffset = this.maxOffset.bind(this)
        this.calcOffsetByZoom = this.calcOffsetByZoom.bind(this)
        this._handleSetState = this._handleSetState.bind(this)

        this.state = {
          update: false
        }
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
            onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
            onPanResponderMove: this._handlePanResponderMove,
            onPanResponderGrant: this._handlePanResponderGrant,
            onPanResponderRelease: this._handlePanResponderRelease,
            onPanResponderTerminate: this._handlePanResponderRelease,
            onPanResponderTerminationRequest: this._handlePanResponderTerminationRequest,
            onShouldBlockNativeResponder: (evt, gestureState) => true,
        });

    }

    componentDidMount(){
      this.didMount = true
    }

    componentWillUnmount(){
      this.didMount = false
    }

    _handleSetState(){
      if(this.didMount){
        this.setState({
          update: !this.state.update
        })
      }
    }

    _handleStartShouldSetPanResponder(evt, gestureState){
      // console.log("on start");
      return true;
    }

    _handleMoveShouldSetPanResponder(evt, gestureState){
      // console.log("on move should");
      return true;
    }

    _handlePanResponderTerminationRequest(evt, gestureState){
      // console.log("on pan terminate request", evt);
      if(this.zoom != 1 || evt.nativeEvent.touches.length == 2){
        return false;
      }
      else{
        return true
      }
    }

    _handlePanResponderGrant(evt, gestureState){
        // console.log("on pan grant");
    }

    _handlePanResponderMove(evt, gestureState){
        // console.log("on pan move", evt);
        let touches = evt.nativeEvent.touches;
        if (touches.length == 2) {
            let touch1 = touches[0];
            let touch2 = touches[1];

            this._processPinch(touches[0].pageX, touches[0].pageY,
                touches[1].pageX, touches[1].pageY);
        } else if (touches.length == 1 && !this.isZooming) {
            this._processTouch(touches[0].pageX, touches[0].pageY);
        }
    }

    _handlePanResponderRelease(evt, gestureState){
      // console.log("on pan release");
      this.isZooming = false,
      this.isMoving = false
      // this.setState({
      //     update: !this.state.update
      // });
      // return true
    }

    _handlePanResponderTerminate(evt, gestureState){
      // console.log("on pan terminate");
      // return true
    }

    _processPinch(x1, y1, x2, y2) {
        let distance = this.calcDistance(x1, y1, x2, y2);
        let center = this.calcCenter(x1, y1, x2, y2);

        if (!this.isZooming) {
            let offsetByZoom = this.calcOffsetByZoom(this.props.imageWidth, this.props.imageHeight, this.zoom);
            this.isZooming = true
            this.initialDistance = distance
            this.initialX = center.x
            this.initialY = center.y
            this.initialTop = this.top
            this.initialLeft = this.left
            this.initialZoom = this.zoom
            this.initialTopWithoutZoom = this.top - offsetByZoom.top
            this.initialLeftWithoutZoom = this.left - offsetByZoom.left
            this._handleSetState();

        } else {
            let touchZoom = distance / this.initialDistance;
            let zoom = touchZoom * this.initialZoom > this.minZoom
                ? touchZoom * this.initialZoom : this.minZoom;

            let offsetByZoom = this.calcOffsetByZoom(this.props.imageWidth, this.props.imageHeight, zoom);
            let left = (this.initialLeftWithoutZoom * touchZoom) + offsetByZoom.left;
            let top = (this.initialTopWithoutZoom * touchZoom) + offsetByZoom.top;
            this.zoom = zoom
            this.left = 0
            this.top = 0
            this.left = left > 0 ? 0 : this.maxOffset(left, this.props.imageWidth, this.props.imageWidth * zoom)
            this.top = top > 0 ? 0 : this.maxOffset(top, this.props.imageHeight, this.props.imageHeight * zoom)
            this._handleSetState();
        }
    }

    _processTouch(x, y) {
        if (!this.isMoving) {
            this.isMoving = true,
            this.initialX = x,
            this.initialY = y,
            this.initialTop = this.top,
            this.initialLeft = this.left,
            this._handleSetState();
        } else {
            let left = this.initialLeft + x - this.initialX;
            let top = this.initialTop + y - this.initialY;
            this.left = left > 0 ? 0 : this.maxOffset(left, this.props.imageWidth, this.props.imageWidth * this.zoom),
            this.top = top > 0 ? 0 : this.maxOffset(top, this.props.imageHeight, this.props.imageHeight * this.zoom),
            this._handleSetState();
        }
    }

    calcDistance(x1, y1, x2, y2) {
        let dx = Math.abs(x1 - x2)
        let dy = Math.abs(y1 - y2)
        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }

    calcCenter(x1, y1, x2, y2) {

        function middle(p1, p2) {
            return p1 > p2 ? p1 - (p1 - p2) / 2 : p2 - (p2 - p1) / 2;
        }

        return {
            x: middle(x1, x2),
            y: middle(y1, y2),
        };
    }

    maxOffset(offset, windowDimension, imageDimension) {
        let max = windowDimension - imageDimension;
        if (max >= 0) {
            return 0;
        }
        return offset < max ? max : offset;
    }

    calcOffsetByZoom(imageWidth, imageHeight, zoom) {
        let xDiff = imageWidth * zoom - imageWidth;
        let yDiff = imageHeight * zoom - imageHeight;
        return {
            left: -xDiff/2,
            top: -yDiff/2,
        }
    }

    _handleOnError(error){
        console.log("error", this.props.source, error);
        if(!this.onError){
          this.onError = true
          this.setState({
              update: !this.state.update
          })
        }
        if(this.props.onError){
            this.props.onError(error)
        }
    }

    render() {

        // console.log("render zoomable");
        var source = this.props.source
        if(this.onError){
          source = {uri:this.defaultSource}
        }
        return (
          <View
            style={[this.props.style,
              {overflow: "hidden"}
            ]}
            {...this._panResponder.panHandlers}>
             <Image
               style={{
                    position: 'absolute',
                    top: this.offsetTop + this.top,
                    left: this.offsetLeft + this.left,
                    width: this.props.imageWidth * this.zoom,
                    height: this.props.imageHeight * this.zoom
               }}
               onError={(error)=>{
                   this._handleOnError(error);
               }}
              //  onLoad={()=>{console.log("on load");}}
              //  onLoadEnd={()=>{console.log("on load end");}}
              //  onLoadStart={()=>{console.log("on load start");}}
              //  onProgress={()=>{console.log("on progress");}}
               source={source}
               resizeMode={this.props.resizeMode}/>
          </View>
        );
    }

}

export default ZoomableImage;
