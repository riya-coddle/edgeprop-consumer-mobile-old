import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    WebView,
    Image,
    ImageBackground,
    Dimensions,
    TouchableOpacity,
    Platform
} from 'react-native'
import firebase from 'react-native-firebase';
import Icon from '../Common_IconMenu/Common_IconMenu'
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import News_NewsDetailParagraph from '../News_NewsDetailParagraph/News_NewsDetailParagraph'
import NewsList from '../News_List/News_List.js'
import IconMenu from '../../components/Common_IconMenu/Common_IconMenu.js'
import Button from '../../components/Common_Button/Common_Button';
//import Svg, { Circle } from 'react-native-svg';
let {height, width} = Dimensions.get('window')
var backIcon = require('../../assets/icons/back-arrow.png');
const titleSizes =[width * 0.05,width * 0.056,width * 0.062,width * 0.068,width * 0.074,width * 0.080]
const authorSizes =[width * 0.033,width * 0.034,width * 0.038,width * 0.042,width * 0.046,width * 0.050]
const dateSizes =[width * 0.035,width * 0.039,width * 0.043,width * 0.047,width * 0.051,width * 0.055]

class News_NewsDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        this._handleNavigation = this._handleNavigation.bind(this)
        this.style = {
            // default value
            // component
            // backgroundColor: 'rgba(0,0,0,0)',
            // marginTop: 0,
            // marginRight: 0,
            // marginBottom: 0,
            // marginLeft: 0,
            // paddingVertical: 0,
            // paddingHorizontal: 0,
            // borderRadius: 0,
            // borderWidth: 0,
            // borderColor: '#fff',
            // header
            headerTextSize: 13,
            headerTextColor: 'rgb(0,92,152)',
            // text
            fontFamily: 'Poppins-Regular'
        }
        this._handleOnNewsItemPress = this._handleOnNewsItemPress.bind(this);
    }

    _getFormatDate(date){

      var formatDate = ""
      if(date!=undefined){
        var d =     new Date(date*1000)
        var monthNames = [
          "January", "February", "March",
          "April", "May", "June", "July",
          "August", "September", "October",
          "November", "December"
        ];
        if(d.toString().indexOf("Invalid") < 0){
          formatDate = "| " + monthNames[d.getMonth()] + " " + d.getDate()+ ", " + d.getFullYear()
        }
      }
      return formatDate
    }

    _getAuthor(author){
      var label = '';
      if(author)
          label = 'By '+author;
      return label;
    }

    _handleNavigation(screenName, data) {
      if(this.props.handleNavigation){
        if(this.props.darkMode){
          data.darkMode = true;
        }
        this.props.handleNavigation(screenName, data)
      }
      else{
        Alert.alert('Comming soon ', `this navigation feature will be coming soon`)
      }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (JSON.stringify(nextProps.data) != JSON.stringify(this.data) 
          || JSON.stringify(nextProps.relatedData) != JSON.stringify(this.relatedData) 
          || nextProps.darkMode != this.props.darkMode 
          || nextProps.fontFactor != this.props.fontFactor)
    }

    onBackPress() {
        this.refs.navigationHelper._navigate('NewsLanding', {
            data: {
                url: 'https://www.edgeprop.my/NewsLanding',
            }
        })
    } 

    _handleOnNewsItemPress(item) {
        //console.log('item',item);
        var length = 99;
        var trimmedTitle = item.node_title.length > length ?
                    item.node_title.substring(0, length - 3) + "..." :
                    item.node_title;

        // var ParamURL = HOSTNAME + "/" + item.path
        //console.log(trimmedTitle, item);
        firebase.analytics().logEvent('View_Article', { Title: trimmedTitle, Category:item.category });
        appsFlyer.trackEvent("View_Article", {},
            (result) => {
                console.log(result);
            },
            (error) => {
                console.error(error);
            }
        )
        this.refs.navigationHelper._navigate('NewsDetail', {
            data: {
                url: 'https://www.edgeprop.my/'+item.path,
                nid: item.nid
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
        // init headerTextSize
        if (this.props.headerTextSize && this.props.headerTextSize != this.style.headerTextSize) {
            this.style.headerTextSize = this.props.headerTextSize
        }
        // init headerTextColor
        if (this.props.headerTextSize && this.props.headerTextSize != this.style.headerTextSize) {
            this.style.headerTextSize = this.props.headerTextSize
        }
        // init fontFamily
        if (this.props.fontFamily && this.props.fontFamily != this.style.fontFamily) {
            this.style.fontFamily = this.props.fontFamily
        }
        if (this.props.data !=undefined && this.props.data != this.data) {
            this.data = this.props.data
        }
        if (this.props.relatedData !=undefined && this.props.relatedData != this.relatedData) {
            this.relatedData = this.props.relatedData
        }
        if (this.props.handleOnPressListing !=undefined && this.props.handleOnPressListing != this.handleOnPressListing) {
            this.handleOnPressListing = this.props.handleOnPressListing
        }
        if (this.props.formatFeatured !=undefined && this.props.formatFeatured != this.formatFeatured) {
            this.formatFeatured = this.props.formatFeatured
        }
    }

    render() {
    //  console.log('re', this.props)
      const Banner = firebase.admob.Banner;
      const AdRequest = firebase.admob.AdRequest;
      const request = new AdRequest();

      const unitId =
      Platform.OS === 'ios'
        ? 'ca-app-pub-3940256099942544/2934735716'
        : 'ca-app-pub-3940256099942544/6300978111';

      this._init()
      var _renderSeperator = (combstyle) => {
          // combstyle is addtion style to make different effect of this separator
          return (
              <View style={[styles.separator, combstyle]} />
          )
      }

      var _renderYoutube = () => {
        if(this.data.category == 'videos'){
          var string = this.data.video_url;
          var videoId = "ixRDa-jprco" //if something wrong play edgeprop ads
          var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
          var match = string.match(regExp);
          if (match && match[2].length == 11) {
            videoId = match[2];
          } else {
            //error
          }
          //videoId = 'b0guBMlJl0M';
          //console.log('https://www.youtube.com/embed/' + videoId + '?rel=0');
          return (
            <View style={{paddingTop: 17, paddingBottom: 13 }}>
              <WebView
                javaScriptEnabled={true}
                domStorageEnabled={true}
                source={{ uri: 'https://www.youtube.com/embed/' + videoId + '?rel=0' }}
                style={{ alignSelf: 'stretch', height: 300, backgroundColor: 'black' }}
              />
            </View>
          )
        }else{
          return (<View/>);
        }
        
      }

      var _renderBody = () => {
        if(this.data.body!=undefined){
          return Object.keys(this.data.body).map(index => {
            if (this.data.body[index].content == "&nbsp;" && this.data.body[index].content != undefined) {
              return null
            }
            else{
                if(this.data.body[index].content != undefined && this.data.body[index].type!='table' && this.data.body[index].type!='article'){
                    if(this.data.body[index].content != undefined && this.data.body[index].content.includes('https://www.edgeprop.sg/property-news/')){
                        var test = this.data.body[index].content
                        // this.data.body[index].content = "<strong>Also see:&nbspLKY’s house at 38 Oxley Road could be demolished</strong>"
                        // console.log(test.match(new RegExp('https://www.edgeprop.sg/property-news/' + "(.*)" + '"')))
                        var alias = test.match(new RegExp('https://www.edgeprop.sg/' + "(.*)" + '"'))
                        return(
                            <News_NewsDetailParagraph
                              // marginTop={21}
                              key={index}
                              data={this.data.body[index]}
                              alias={alias[1]}
                              nid={this.data.nid}
                              navigation={this.props.navigation}
                              darkMode={this.props.darkMode}
                              fontFactor={this.props.fontFactor}
                              formatFeatured = {this.formatFeatured}
                              handleOnPressListing = {this.handleOnPressListing}
                            />
                        )
                    }
                }
              return(
                <News_NewsDetailParagraph
                  // marginTop={21}
                  key={index}
                  data={this.data.body[index]}
                  title={this.data.title}
                  nid={this.data.nid}
                  navigation={this.props.navigation}
                  darkMode={this.props.darkMode}
                  fontFactor={this.props.fontFactor}
                  formatFeatured = {this.formatFeatured}
                  handleOnPressListing = {this.handleOnPressListing}
                />
              )
            }
          })
        }
      }

      const headlineTitle = {
          fontSize: this.style.headlineTextSize,
          color: this.style.headlineTextColor,
          textAlign: this.style.headlineTextAlign,
          fontFamily: this.style.headlineFontFamily,
          fontStyle: this.style.headlineFontStyle,
          fontWeight: this.style.headlineFontWeight,
      };
      const relatedNewsTitle = {
          paddingLeft: 23,
          paddingTop: 15,
          paddingBottom: 5,
          fontFamily: 'Poppins-Bold',
          color:'#414141',
          fontSize: 16
      };
      const newsTitle = {
          paddingLeft: 5,
          paddingRight: 5,
          marginLeft:18,
          marginRight: 18,
          marginTop:20,
          marginBottom: 10,
          fontWeight: 'bold',
          fontFamily: 'Noto Serif',
          color:'#414141',
          fontSize: 21
        };
      const authorStyle = {
          marginLeft:22,
          marginRight: 20,
          marginBottom: 10,
          fontFamily: 'Noto Serif',
          color:'#414141',
          fontSize: 13,
          fontWeight: 'bold'
        };
      const dateStyle = {
          marginLeft:22,
          marginRight: 20,
          fontWeight: '400',
          fontFamily: 'Noto Serif',
          color:'#414141',
          fontSize: 13
        };    
      const iconStyle = {
        marginTop: 100 +' !important' ,
        backgroundColor: '#FF0000' ,
        zIndex: 999
      }  
      const monthNames = ["January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"
              ];
      let publishedDate = '';
      if(this.props.data.created) {
          var date  = new Date( this.props.data.created * 1000 ).getDate();
          var month = monthNames[new Date( this.props.data.created * 1000 ).getMonth()];
          var year  = new Date( this.props.data.created * 1000 ).getFullYear();

          publishedDate = month+' '+date+', '+year;
      }
      if(this.data){
       var {height, width} = Dimensions.get('window')
        return (
          <View style={{flex: 1, display: 'flex', justifyContent: 'flex-start', backgroundColor: this.props.darkMode? '#1e1e1e': '#ffffff'}}>
              <NavigationHelper
                 ref={"navigationHelper"}
                  navigation={this.props.navigation}
                />
              <View >
                <ImageBackground 
                  source={{ uri: this.data.cover_img }}
                  style={{width: width , height: width * 0.65 }} >
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ padding: 23 }}>
                      <Image
                            style={{ width: 40, height: 40 }}
                            source={backIcon}
                        />
                    </TouchableOpacity>
                </ImageBackground>  
                <Text allowFontScaling={false} style={[newsTitle, {fontSize: titleSizes[this.props.fontFactor], color: this.props.darkMode ? '#bbbbbb' : '#414141'}]}>
                  {this.data.title}
                </Text>
                <Text allowFontScaling={false} style={[authorStyle, {fontSize: authorSizes[this.props.fontFactor], color: this.props.darkMode ? '#bbbbbb' : '#414141'}]}>
                  By {this.data.author}
                </Text>
                <Text allowFontScaling={false} style={[dateStyle, {fontSize: dateSizes[this.props.fontFactor], color: this.props.darkMode ? '#bbbbbb' : '#414141'}]}>
                  {publishedDate}
                </Text>
                {/* body */}
                {_renderBody()}
              </View>
              <View style={{paddingTop: 25, paddingBottom: 25 }}>
                  
              </View>
              <Text allowFontScaling={false} style={[relatedNewsTitle, {color: this.props.darkMode ? '#bbbbbb' : '#414141'}]}>Related Articles</Text>
              {/* related news */}
              <NewsList
                  headerTxtValue={this.relatedData.length>0 ? 'Related News' : ''}
                  items={this.relatedData}
                  isRelated={this.props.isRelated}
                  onItemPress={(item)=>this._handleNavigation("NewsDetail", item)}
                  darkMode={this.props.darkMode}
                />
              <View style={{paddingBottom: 70 }} />   
          </View>
        )
      }
      else{
        return(<View/>)
      }
    }
}

const styles = StyleSheet.create({
    headline: {
        paddingRight: 20,
        paddingLeft: 10,
    },
    footer: {
        marginVertical: 20,
        paddingRight: 20,
        paddingLeft: 10,
    },
    footerTitle: {
        fontSize: 15,
        textAlign: 'left',
        color: 'rgb(74,74,74)'
    },
    headlineTitle: {
        fontSize: 22,
        lineHeight: 30,
        color: 'rgb(74,74,74)',
        textAlign: 'left',
        fontFamily: 'Poppins-Medium',
        marginBottom: 5
    },
    headlineInfo: {
        fontSize: 12,
        lineHeight: 22,
        color: 'rgb(74,74,74)',
        textAlign: 'left',
        fontFamily: 'Poppins-Regular',
    },
    separator: {
        flexDirection: 'row',
        borderColor: 'rgb(233,233,235)',
        height: 1,
        borderWidth: 1,
    },
    separatorHeader: {
        marginTop: 5,
        marginBottom: 15,
    },
    separatorFooter: {
        marginTop: 25,
        marginBottom: 3,
    },
    circle: {
      width: 30,
      padding:30,
      height: 30,
      borderRadius: 100/2,
      backgroundColor: 'red'
    }
})

export default News_NewsDetail
