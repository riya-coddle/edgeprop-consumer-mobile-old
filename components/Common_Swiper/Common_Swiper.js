import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  Alert,
  StatusBar,
  Dimensions,
  TouchableWithoutFeedback,
  Modal,
  Platform,
  TouchableOpacity
} from 'react-native'
import Swiper from 'react-native-swiper'
import ZoomableImage from '../Common_ZoomableImage/Common_ZoomableImage.js'
import IconMenu from '../Common_IconMenu/Common_IconMenu.js'
import PanWithReceiver from '../Common_PanWithReceiver/Common_PanWithReceiver.js'
import ImageSlider from '../Common_ImageSlider/Common_ImageSlider.js'
const { width, height } = Dimensions.get('window')

const defaultImg = 'https://dkc9trqgco1sw.cloudfront.net/s3fs-public/default_images/no_img.png'

const styles = {
  wrapper: {
  },

  slide: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  container: {
    width: '100%',
    height: 180,
  },

  imgBackground: {
    width,
    height,
    backgroundColor: 'transparent',
    position: 'absolute'
  },

  image: {
    width : width,
    height: 180,
  },
  navDots: {
    width: '100%',
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    zIndex: 2
  },
  navDot: {
    width: 6,
    height: 6,
    backgroundColor: '#fff',
    borderRadius: 5,
    margin: 2,
    opacity: 0.75
  }
}

export default class Common_Swiper extends Component {
  //fullScreen
  fullScreen = false
  screenWidth
  screenHeight
  didMount = false
  showIndex = 0
  constructor(props) {
      super(props)
      var {height, width} = Dimensions.get('window');
      this.screenWidth = width;
      this.screenHeight = height
      this.fullScreen = props.fullScreen || false

      this._onPress = this._onPress.bind(this)
      this._toggleFullScreen = this._toggleFullScreen.bind(this)
      this._handleModalPanReceiverEndTouch = this._handleModalPanReceiverEndTouch.bind(this)
      this._handleSetState = this._handleSetState.bind(this)
      this._onIndexChanged = this._onIndexChanged.bind(this)
      this._onModalUpdateShowIndex = this._onModalUpdateShowIndex.bind(this)
      this._shareItem = this._shareItem.bind(this);

      this.state = {
          imgList : this.props.data?this.props.data:[],
          flag : false,
          width: this.props.width?this.props.width:width,
          height: this.props.height?this.props.height:180,
          fullScreen: false,
          imageSize: []
      }
      
  }
  _onPress() {
    if(this.fullScreen){
      this._toggleFullScreen();
    }
    else if(this.props.handleNavigation) {
      this.props.handleNavigation()
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
  _handleSetState(newState){
      if(this.didMount){
          this.setState(newState)
      }
  }
  _handleModalPanReceiverEndTouch(movedDistanceX, movedDistanceY){
    var verticalThreshold = 60
    if(Math.abs(movedDistanceY)>verticalThreshold){
      this._toggleFullScreen()
    }
  }

  _shareItem(){
    if(this.props.shareItem){
      this.props.shareItem(this.showIndex);
    }
  }

  _onModalUpdateShowIndex(modalShowIndex){
     if(this.refs.panWithReceiver != undefined){
        this.refs.panWithReceiver._setAllowTouchResponse(true)
      }
  }

  _onIndexChanged(index){
    if(this.props.gallery != undefined && index >= this.props.gallery.length) {
      index -=this.props.gallery.length;
    }
    console.log('new index', index);
    this.showIndex = index;
  }

  _init(){
    if(this.props.fullScreen != undefined && this.props.fullScreen != this.fullScreen){
      this.fullScreen = this.props.fullScreen;
    }
  }

  componentDidMount(){
    this.didMount = true
  }

  componentWillUnmount(){
    this.didMount = false
  }

  render () {
    this._init();

    var renderPopup = () => {
        if(this.fullScreen){
          let slideShowData = this.props.gallery;
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
                  width={this.screenWidth}
                  height={this.screenHeight}
                  id = {`imageSlider`}
                  zoomable = {true}
                  transitionInterval = {0.5}
                  showInterval = {2}
                  slideInterval = {0.3}
                  navigation = {false}
                  carouselNavigation = {false}
                  overlayText = {false}
                  showIndex = {this.showIndex}
                  lazyLoad = {false}
                  resizeMode = {"contain"}
                  backgroundColor = {"black"}
                  data={slideShowData}
                  onModalUpdateShowIndex = {this._onModalUpdateShowIndex}
                  shareItem={this.props.shareItem}
                  onIndexChanged={this._onIndexChanged}
                >
                </ImageSlider>
                <View
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 40,
                    width: 48,
                    height: 48,
                    flexDirection: 'row'
                  }}>
                  <IconMenu
                      imageWidth={28}
                      imageHeight={28}
                      padding={15}
                      type={"icon"}
                      imageSource={require('../../assets/icons/close-grey.png')}
                      onPress={()=>this._toggleFullScreen()}
                  />

                </View>
                <View 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'row', 
                    width: 40, 
                    opacity: 1, 
                    position:'absolute',  
                    right: 32, 
                    zIndex: 10,
                    bottom: 10 }}>
                  <TouchableOpacity  
                    onPress={() => this._shareItem()} 
                    activeOpacity={1} 
                    style={{
                      padding: 15,
                    }}>
                    <Image 
                        style={{width: 40, height: 40 }}
                        source={require('../../assets/icons/share-grey.png')}
                    />
                  </TouchableOpacity>    
                </View>
              </PanWithReceiver>
            </Modal>
          )
        }
      }

    //image is rendered by lazyload
            var renderLazyLoadImage = (index, uri) => {
              if(this.props.zoomable!=undefined && this.props.zoomable){
                return(
                  <ZoomableImage
                    resizeMode={"contain"}
                    style={[{position: 'absolute',
                      top: 0,
                      right: 0,
                      bottom: 0,
                      // left: 0, //the position depends on animation and showing image
                    }, { width: this.state.width , height : this.state.height }]}
                    source={{uri: uri}}
                    imageWidth={this.width}
                    imageHeight={this.height}>
                  </ZoomableImage>
                )
              }
              else{
               // console.log('hi') ;
                return (
                  <Image
                    key={i}
                    style={{ width: this.state.width , height : this.state.height }}
                    source={{uri: uri }}
                    resizeMode={this.props.resizeMode? this.props.resizeMode : 'cover'}
                  />
                )
              }
            }
    return (
      <View style={{ width: this.state.width , height : this.state.height, position: 'relative' }}>
        <StatusBar barStyle='light-content' />
        
        <Swiper style={styles.wrapper}
          showsPagination={false}
          loop={true}
          onIndexChanged={this._onIndexChanged}>
          {this.props.data.length > 0 && this.props.data.map((item,i) => {
           let uri = item.image?item.image:defaultImg
            return (
              <TouchableWithoutFeedback disabled={this.props.isDisabled} onPress={this._onPress} style={styles.slide} key={i} >
              {/*<Image
                key={i}
                style={{ width: this.state.width , height : this.state.height }}
                source={{uri: uri }}
                resizeMode={this.props.resizeMode? this.props.resizeMode : 'cover'}
              />*/}
              {renderLazyLoadImage(i,uri)}
            </TouchableWithoutFeedback>
            )
          })}
        </Swiper>
        {this.props.showDot && (<View style={styles.navDots}>
          <View style={styles.navDot} />
          <View style={styles.navDot}  />
          <View style={styles.navDot}  />
        </View>)}
        {renderPopup()}
      </View>
    )
  }
}