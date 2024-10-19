import React, { Component } from 'react'
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    Dimensions,
    TouchableOpacity
} from 'react-native'
import ImageSlider from '../Common_ImageSlider/Common_ImageSlider.js';
import IconMenu from '../Common_IconMenu/Common_IconMenu.js';

class LandingHighlight extends Component {
    //props
    data = {}
    dataImageKey = "image"
    dataPathKey = "url"
    type = ""
    imagesData = []
    width
    imageheight
    landingTitle = ""
    imageLabel = ""
    id = ""
    imageOverlayText = true
    moreOption = true
    title = true
    titleBelow = false
    category = ""

    //
    textTitleBelow = ""

    getDimension = false

    constructor(props) {
      super(props);
      this._handleNavigateNext = this._handleNavigateNext.bind(this)
      this._handleImageSliderNavigation = this._handleImageSliderNavigation.bind(this)
      var {height, width} = Dimensions.get('window')
      this.width = width
      this.imageHeight = width*9/16
    }

    _initStyle(){
      if(this.props.landingTitle != undefined && this.props.landingTitle != this.landingTitle){
        this.landingTitle = this.props.landingTitle
      }
      if(this.props.moreOption != undefined && this.props.moreOption != this.moreOption){
        this.moreOption = this.props.moreOption
      }
      if(this.props.imageLabel != undefined && this.props.imageLabel != this.imageLabel){
        this.imageLabel = this.props.imageLabel
      }
      if(this.props.id != undefined && this.props.id != this.id){
        this.id = this.props.id
      }
      if(this.props.imageOverlayText != undefined && this.props.imageOverlayText != this.imageOverlayText){
        this.imageOverlayText = this.props.imageOverlayText
      }
      if(this.props.title != undefined && this.props.title != this.title){
        this.title = this.props.title
      }
      if(this.props.titleBelow != undefined && this.props.titleBelow != this.titleBelow){
        this.titleBelow = this.props.titleBelow
      }
      if(this.props.type != undefined && this.props.type != this.type){
        this.type = this.props.type
      }
    }

    _handleGetDimension(layout){
      //x,y
      this.width = layout.width;
      this.height = layout.height;
      this.getDimension = true
    }

    _handleNavigateNext(){
      if(this.props.onPressMore!=undefined){
        this.props.onPressMore();
      }
      else{
        Alert.alert('Comming Soon','More News touched, this feature will be coming soon...')
      }
    }

    _handleImageSliderNavigation(id, index, link){
      if(this.props.handleImageSliderNavigation!=undefined){
        this.props.handleImageSliderNavigation(id, index, link);
      }
      else{
        Alert.alert("Comming Soon", `Image Touched, (link: ${link}), this feature will be coming soon`);
      }
    }

    shouldComponentUpdate(nextProps, nextState){
      if(JSON.stringify(nextProps.data) != JSON.stringify(this.props.data)){
        return true
      }
      return nextState != this.state
    }

    render() {
      if(this.props.data.length > 0){
        this._initStyle();
        this.data = this.props.data
        this.imagesData = []
        if(this.type=="newsCategory"){
          this.dataImageKey = "thumbnail";
          this.dataPathKey = "path"
          this.imagesData = [
            {
              image: this.data[0][this.dataImageKey] || "",
              title: this.imageOverlayText? this.data[0].title : "",
              description: this.imageOverlayText? this.data[0].caption : "",
              link: this.data[0][this.dataPathKey] || "",
            }
          ]
          if(this.titleBelow){
            this.textTitleBelow = this.data[0].title
            this.category = this.data[0].category || ""
          }
        }
        else{
          Object.keys(this.data).map((index) => {
            var item = {
              image: this.data[index][this.dataImageKey],
              title: this.imageOverlayText? this.data[index].title : "",
              description: this.imageOverlayText? this.data[index].caption : "",
              link: this.data[index][this.dataPathKey] || "",
            }
            this.imagesData.push(item)
          })
        }
        return(
          <View style={{
            paddingBottom: 9
          }}>
            {/* render title */}
            {this.title? (
              <View
                style={[styles.titleContainer, {
                  width: this.width,
                }]}>
                <Text
                  allowFontScaling={false}
                  style={styles.title}>
                  {this.landingTitle}
                </Text>
                {
                  this.moreOption?
                  (<IconMenu
                    paddingHorizontal={10}
                    type={"text"}
                    textValue={"More"}
                    fontFamily={'Poppins-Medium'}
                    // fontWeight={"500"}
                    lineHeight={21}
                    marginRight={5}
                    textSize={13}
                    textColor={"#275075"}
                    onPress={this._handleNavigateNext}>
                  </IconMenu>):
                  (<View/>)
                }
              </View>
            ) : (<View/>)}

            {/* render image slider*/}
            {this.imagesData != undefined && this.imagesData.length>0 ?(
              <View
                style={{
                  width: this.width,
                  height: this.imageHeight,
                }}>
                <ImageSlider
                  id = {`home-landingHighLight-imageSlider`}
                  width = {this.width}
                  height = {this.imageHeight}
                  isOverlayTitleAutoResize={this.props.isOverlayTitleAutoResize}
                  data = {this.imagesData}
                  transitionInterval = {0.5}
                  showInterval = {2}
                  slideInterval = {0.3}
                  overlayText = {this.imageOverlayText}
                  autoPlay = {true}
                  navigation = {true}
                  carouselNavigation = {true}
                  handleNavigation = {this._handleImageSliderNavigation}
                  showIndex = {0}
                  lazyLoad = {false}
                  resizeMode = {"cover"}>
                </ImageSlider>
                {this.imageLabel.length>0?
                (
                  <View
                    style={styles.labelContainer}>
                    <Text
                      allowFontScaling={false}
                      style={styles.labelText}>
                      What's New
                    </Text>
                  </View>
                ):
                (
                  <View/>
                )}
              </View>
            ):<View/>}

            {/* render title below */}
            {(this.titleBelow && this.category!= undefined && this.category.length>0)? (
              <TouchableOpacity onPress={this._handleImageSliderNavigation} style={{
                paddingLeft: 12,
                paddingTop: 9,
              }}>
                <Text allowFontScaling={false} style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 11,
                  lineHeight: 23,
                  color: "#005c98"
                }}>{this.category.toUpperCase()}</Text>
                <Text allowFontScaling={false} style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 18,
                  lineHeight: 23,
                  width: this.width*0.75,
                  color: "#4a4a4a",
                }}>{this.textTitleBelow}</Text>
              </TouchableOpacity>
            ) : (<View/>)}
          </View>
        )
      }
      else{
        return (<View></View>)
      }

    }
}

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 29
  },
  title: {
    fontFamily: 'Poppins-Light',
    fontWeight: '400',
    lineHeight: 21,
    fontSize: 13,
    marginLeft: 10,
    color: "#4a4a4a",
  },
  labelContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 100,
    height: 22,
    backgroundColor: "#f4b122",
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  labelText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    marginLeft: 10
  }
})
export default LandingHighlight
