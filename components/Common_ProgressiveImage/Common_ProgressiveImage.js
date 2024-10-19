import React, { Component } from 'react';
import {Animated, View, Alert, Image, StyleSheet} from 'react-native';
import {CachedImage} from 'react-native-cached-image';
import Common_Image from '../Common_Image/Common_Image.js'
export default class ProgressiveImage extends React.Component{

  imageLoaded = false
  duration = 250
  resizeMode = "cover"
  defaultSource = "https://dkc9trqgco1sw.cloudfront.net/s3fs-public/default_images/no_img.png"

  constructor(props){
    super(props);
    this.state = {
      imageAnim: new Animated.Value(0),
      thumbnailLoaded : false
    }
    this.imageAnimValue = 0
    this.onLoad = this.onLoad.bind(this);
    this.onThumbnailLoad = this.onThumbnailLoad.bind(this);
  }

  initStyle(){
    if(this.props.duration != undefined && this.props.duration != this.duration){
      this.duration = this.props.duration
    }
    if(this.props.resizeMode != undefined && this.props.resizeMode != this.resizeMode){
      this.resizeMode = this.props.resizeMode
    }
  }

  onLoad(){
    this.imageLoaded = true
    // console.log("image loaded", this.props.name);
    Animated.timing(this.state.imageAnim, {
      toValue: 0,
      duration: this.duration
    }).start();
  }

  onThumbnailLoad(){
    // console.log("thumbnail loaded", this.props.name);
    if(!this.imageLoaded){
      Animated.timing(this.state.imageAnim, {
        toValue: 1,
        duration: this.duration
      }).start();
    }
  }

  componentDidMount(){
    // console.log("did mount");
  }

  componentDidUpdate(){
    // console.log("did update");
  }

  render(){
    // console.log("render");
    this.initStyle();
    var fadeStyle = {
      opacity: this.state.imageAnim
    }

    containerStyle = this.props.style
    const AnimatedCachedImage = Animated.createAnimatedComponent(CachedImage);

    return(
      <View style={styles.container, containerStyle}>
            <CachedImage
              resizeMode={this.resizeMode}
              style={[
                {
                  position: 'absolute',
                },
                this.props.style]}
              source={this.props.thumbnail}>
            </CachedImage>
            <Common_Image
              resizeMode={this.resizeMode}
              style={[
                {
                  position: 'absolute',
                },
                this.props.style
              ]}
              source={this.props.source}
              defaultSource={"https://dkc9trqgco1sw.cloudfront.net/s3fs-public/default_images/no_img.png"}
              onLoad={this.onLoad}>
            </Common_Image>
            <AnimatedCachedImage
              resizeMode={this.resizeMode}
              style={[{
                position: 'absolute',
              },fadeStyle, this.props.style]}
              source={this.props.thumbnail}
              onLoad={this.onThumbnailLoad}>
            </AnimatedCachedImage>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor : "#CCC"
  }
})
