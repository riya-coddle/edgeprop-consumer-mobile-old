import React, { Component } from 'react';
import { View, StyleSheet, Image, Platform, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import Button from '../Common_Button/Common_Button'
import { Icons } from 'react-native-fontawesome';

const HOSTNAME = 'https://www.edgeprop.sg';
const PROXY_URL = '/proxy?url=';
const API_DOMAIN = 'https://www.edgeprop.sg'//'https://edge:property@cs.dev.edgeprop.sg';

export default class PannellumView extends Component {
  fullScreenMode = false

  constructor(props){
    super(props)
    // console.log(this.virtual_tour);
    this._onControlClick = this._onControlClick.bind(this)
    this.state={
      showIcon:false
    }
  }

  _onControlClick(control_name){
    if(control_name == "full"){
      if(this.props.toggleFullscreen){
          this.props.toggleFullscreen()
      }
    }
    else{
      this.refs.webview.postMessage(JSON.stringify({
        key:"control",
        data:{control_name:control_name}
      }));
    }
  }

  _initStyle(){
    if(this.props.fullScreenMode != undefined && this.props.fullScreenMode != this.fullScreenMode){
      this.fullScreenMode = this.props.fullScreenMode
    }
  }

  render() {

    this._initStyle();
    var fullscreen = this.fullScreenMode ? "0" : "1"
    this.PannellumHTML = (API_DOMAIN + "/360-mobile-view?" + "width=" + this.props.width + "px&height=" + this.props.height + "px&" + "fullscreen=0" /*+ fullscreen*/ + "&nid=" + this.props.nid)
    var renderControls = () => {
      //comment the fullscreen icon because touch on 360 bring to fullscreen
        var controls = [
          {
            name: "full",
            font: Icons.arrowsAlt
          }
        ]
        return Object.keys(controls).map((index) => {
          var control = controls[index]
          return (
            <Button
              key={control.name}
              textValue={control.font}
              textSize={15}
              width={27}
              height={27}
              marginRight={1}
              borderRadius={5}
              backgroundColor={"#302E2F"}
              borderColor={"#e2ad2f"}
              borderWidth={2}
              fontFamily={"FontAwesome"}
              onPress={()=>{
                this._onControlClick(control.name);
            }}/>
          )
        })
    }
    console.log(this.PannellumHTML);
    return (
      <View style={{width:"100%", height: "100%"}}>
        <WebView
        ref={"webview"}
        source = {{uri:this.PannellumHTML}}
        style={{width:"100%",height:"100%"}}
        onLoadEnd={()=>this.setState({showIcon:true})}
        />
        <View style={{display:this.state.showIcon?'flex':'none',position:"absolute",bottom:1,right:0,marginRight:67,marginBottom:10,flexDirection:"row"}}>
          {renderControls()}
        </View>

      </View>
    );
  }
}

/*import ThumbnailPanel from '../Pannellum_ThumbnailPanel/Pannellum_ThumbnailPanel'

const isAndroid= Platform.OS==='android'
const PannellumHTML = require ('../../PannellumHTML.html')

import ImageGallery from '../Common_ImageGallery/Common_ImageGallery'

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default class PannellumView extends Component {
  fullScreenMode = false
  constructor(props){
    super(props)
    this.virtual_tour = JSON.parse(this.props.virtual_tour_text) //VirtualTour2
    // console.log(this.virtual_tour);
    this._onImageGalleryItemPress = this._onImageGalleryItemPress.bind(this)
    this._onControlClick = this._onControlClick.bind(this)
    this._onMessage = this._onMessage.bind(this)
  }

  _onMessage(m){
    var data = JSON.parse(m.nativeEvent.data)
    for(var i=0; i<this.virtual_tour.length; i++){
      var item = this.virtual_tour[i]
      if(("scene"+item.index) == data.sceneId){
        this.refs.image_gallery._changeFocusIndex(i);
        break;
      }
    }
  }

  _onImageGalleryItemPress(index,item){
    this.refs.webview.postMessage(JSON.stringify({
      key:"gallery",
      data:{index:index,item:item}
    }));
  }

  _onControlClick(control_name){
    if(control_name == "full"){
      if(this.props.toggleFullscreen){
          this.props.toggleFullscreen()
      }
    }
    else{
      this.refs.webview.postMessage(JSON.stringify({
        key:"control",
        data:{control_name:control_name}
      }));
    }
  }

  _stringify = (obj, prop) => {
    var placeholder = '____PLACEHOLDER____';
    var fns = [];
    var json = JSON.stringify(obj, function(key, value) {
      if (typeof value === 'function') {
        fns.push(value);
        return placeholder;
      }
      return value;
    }, 2);
    json = json.replace(new RegExp('"' + placeholder + '"', 'g'), function(_) {
      return fns.shift();
    });
    return json ;
  };

  _init(){
    var currentDomain = "www.edgeprop.sg";
    // if (window.location.hostname) {
    //   currentDomain = window.location.hostname;
    // }
    var scenesObj = {};
    var defaultObj = {};
    var isPanoramaObj = {};
    this.imageGalleryData = []

    var setSceneTitle = function setSceneTitle(hotSpotDiv, args) {
      hotSpotDiv.innerHTML = args.name;
      hotSpotDiv.id = args.hotSpotID + "&&" + args.index + "&&" + args.sceneId;
    }
    this.imageGalleryData = this.virtual_tour.map((item, i) => {
      return {
        image: item.captured_image,
        index: item.index,
        text: item.title
      }
    })

    var currentDomain = "www.edgeprop.sg";
    var proxyUrl = "https://cors-anywhere.herokuapp.com/"
    this.virtual_tour.map((item, i) => {
        var sceneId = "scene" + item.index;
        if (i==0){
          defaultObj = {
              "firstScene": sceneId,
          }
        }
        var panoramaURL = proxyUrl + item.path.replace("https://dkc9trqgco1sw.cloudfront.net/s3fs-public/styles/listing_gallery_full/public",
        "https://" + currentDomain + "/proxy.php?url=https://sg.tepcdn.com/s3fs-public");

        var MAX_WIDTH = 4096;
        var MAX_HEIGHT = 4096;
        var width = item.width;
        var height = item.height;
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
            panoramaURL = proxyUrl + item.path.replace("https://dkc9trqgco1sw.cloudfront.net/s3fs-public/styles/listing_gallery_full/public",
            "https://" + currentDomain + "/proxy.php?url=https://img.tepcdn.com/img-v2-a/n/m-w_" + width + ",g_cm");
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
            panoramaURL = proxyUrl + item.path.replace("https://dkc9trqgco1sw.cloudfront.net/s3fs-public/styles/listing_gallery_full/public",
            "https://" + currentDomain + "/?url=https://img.tepcdn.com/img-v2-a/n/m-w_" + width + ",g_cm");
          }
        }
        var hotSpots=item.linked_hotspot.map((hotspot_data)=>{
          var hotspot = {
            "sceneId":hotspot_data.hotspotID.split("-to-")[1],
            "pitch":hotspot_data.pitch,
            "yaw":hotspot_data.yaw,
            "type":"scene",
            "cssClass": "custom-hotspot",
            "createTooltipFunc": setSceneTitle,
            "createTooltipArgs": {
              name: hotspot_data.name,
            },
          }
          return hotspot
        })

        scenesObj[sceneId] = {
          "title": this.fullScreenMode? item.title : "",
          "haov": item.haov,
          "vaov": item.vaov,
          "pitch": item.pitch,
          "yaw": item.yaw,
          "type": "equirectangular",
          "panorama": panoramaURL,
          "preview": panoramaURL,
          "hotSpots": hotSpots
        }

        isPanoramaObj[sceneId] = item.isPanorama

        // console.log(this._stringify(scenesObj));
      });

    var lockPreview = function lockPreview() {
      if(viewer){
        var isPanorama = false
        var sceneId = viewer.getScene();
        Object.keys(isPanoramaObj).map((index)=>{
          if(index == sceneId){
            isPanorama = isPanoramaObj[index];
          }
        })
        if(!isPanorama){
          // viewer.setPitchBounds([-180, 180]);
        }
        else{
          lockPitch();
          // lockYaw();
          setYawBounds();
          if(fullScreenMode){
            viewer.setHfov(viewer.getHfov() - 9000, 10000);
          }
        }
      }else{
        console.log ("setYawBounds: No viewer");
      }
    };

    var setYawBounds = function setYawBounds(){
        var sceneId = viewer.getScene();
        if(viewer){
          if(viewer_setting){
            var scenes = viewer_setting.scenes;
            if(scenes){
              Object.keys(scenes).map((index)=>{
                var item = scenes[index];
                if(index == sceneId){
                  var haov = item.haov
                  viewer.setYawBounds([-haov/2, haov/2]);
                }
              })
            }
          }
        } else{
          console.log ("setYawBounds: No viewer");
        }
    }

    var lockPitch = function lockPitch() {
        if (viewer) {
            var renderer = viewer.getRenderer();
            if (renderer) {
                var canvas = renderer.getCanvas();
                if (canvas) {
                    var vfov = 2 * Math.atan(Math.tan(viewer.getHfov() / 180 * Math.PI * 0.5) /
                                (canvas.width / canvas.height)) / Math.PI * 180;
                    var minPitch = -vfov / 2;
                    var maxPitch =  vfov / 2;
                    viewer.setPitchBounds([minPitch,maxPitch]);
                    viewer.setPitch(0);
                } else console.log ("lockPitch: No canvas");
            } else console.log ("lockPitch: No renderer");
        } else console.log ("lockPitch: No viewer");
    };

    var lockYaw = function lockYaw() {
        if (viewer) {
                   var hfov = viewer.getHfov();
                   var yaw = viewer.getYaw();
                   var minYaw = yaw + -hfov / 2;
                   var maxYaw =  yaw + (hfov / 2);
                   viewer.setYawBounds([minYaw, maxYaw]);
        } else alert ("lockYaw: No viewer");
    };

    var onControlClick = function onControlClick(value) {
      if(viewer) {
        if(value === 'in') {
          viewer.setHfov(viewer.getHfov() - 10, 10000); // 500 iszoom time in ms, default is 1000ms
        } else if(value === 'out') {
          viewer.setHfov(viewer.getHfov() + 10, 10000);
        } else if(value === 'full'){
          viewer.toggleFullscreen();
        }
      }
    };

    var onSceneChangeListener = function onSceneChangeListener(){
      sceneId = viewer.getScene();
      window.postMessage(JSON.stringify({key:"scene_change",sceneId:sceneId}), "*");
    }

    this.viewer = `
    var viewer_setting = {
      "showControls": false,
      "default": ${this._stringify(defaultObj)},
      "scenes": ${this._stringify(scenesObj)},
      "autoLoad": true
    };
    var isPanoramaObj = ${this._stringify(isPanoramaObj)};
    var fullScreenMode = ${this.fullScreenMode};
    viewer = pannellum.viewer('panorama', viewer_setting);
    ${lockPreview}
    ${lockPitch}
    ${lockYaw}
    ${setYawBounds}
    ${onControlClick}
    ${onSceneChangeListener}
    viewer.on('load', lockPreview);
    viewer.on('scenechange', onSceneChangeListener);

    document.addEventListener("message", function(data) {
      var mData = JSON.parse(data.data);
      if(mData.key=="control"){
        onControlClick(mData.data.control_name);
      }
      else if(mData.key=="gallery"){
        viewer.loadScene("scene"+mData.data.item.index);
      }
    });
    `

    console.log(this.viewer);
  }

  _initStyle(){
    if(this.props.fullScreenMode != undefined && this.props.fullScreenMode != this.fullScreenMode){
      this.fullScreenMode = this.props.fullScreenMode
    }
  }

  render() {
    this._initStyle();
    this._init()

    var renderImageGallery = () => {
      var scrollable = true
      var height = 70
      var separatorWidth = 10
      var width = "60%"
      var buttonDim= 40
      if(this.imageGalleryData.length<=3){
        scrollable = false
        width = (height - 2*separatorWidth) * this.imageGalleryData.length + separatorWidth * (this.imageGalleryData.length+1)//control button width = 40
      }
      var textStyle = {
        fontSize:9,
        fontFamily:"Poppins-Regular",
        color:"white",
        marginBottom:5
      }
      var bottom = 5
      if(this.fullScreenMode){
        bottom = 30
      }
      return (
        <ThumbnailPanel
          style={{position:"absolute",bottom:"6%",left:0,bottom:bottom,width:width+buttonDim,flexDirection:'row'}}>
          <View style={{flex:1}}>
            <ImageGallery
              ref={"image_gallery"}
              items={this.imageGalleryData}
              itemStyle={{borderRadius:5}}
              itemFocusStyle={{
                borderColor:"white",
                borderWidth: 3
              }}
              containerStyle={{backgroundColor:"#10324d"}}
              showSeparator={true}
              separatorBorderWidth={separatorWidth}
              separatorBorderColor={"#10324d"}
              showAnimation={false}
              numTuples={1}
              height={height}
              scrollable={scrollable}
              textStyle={textStyle}
              scrollDirection={"horizontal"}
              buttonDim={40}
              onItemPress={(index,item)=>this._onImageGalleryItemPress(index,item)}
            />
          </View>

        </ThumbnailPanel>
      )
    }

    var renderControls = () => {
      var controls = [
        {
          name: "in",
          font: Icons.plus
        },
        {
          name: "out",
          font: Icons.minus
        }
      ]
      if(!this.fullScreenMode){
        controls.push({
          name: "full",
          font: Icons.arrowsAlt
        })
      }
      return Object.keys(controls).map((index) => {
        var control = controls[index]
        return (
          <Button
            key={control.name}
            textValue={control.font}
            textSize={15}
            width={27}
            height={27}
            margin={1}
            borderRadius={5}
            backgroundColor={"#302E2F"}
            borderColor={"#e2ad2f"}
            borderWidth={2}
            fontFamily={"FontAwesome"}
            onPress={()=>{
              this._onControlClick(control.name);
          }}/>
        )
      })
    }
    return (
      <View style={{width:"100%", height: "100%"}}>
        <WebView
        ref={"webview"}
        source = {PannellumHTML}
        style={{width:"100%",height:"100%"}}
        injectedJavaScript={
          this.viewer
        }
        onMessage = {this._onMessage}
        />
        <View style={{position:"absolute",bottom:0,right:0,marginRight:5,marginBottom:5,flexDirection:"row"}}>
          {renderControls()}
        </View>
        {renderImageGallery()}
        {!this.fullScreenMode?(
          <Image
            style={{position:"absolute", right:0,top:0,marginRight:5, marginTop:5,width:50,height:35}}
            source={{uri:"https://sg.tepcdn.com/public/usr/24l7v6/6ea1d2-360-icon.png"}}/>
        ):<View/>}

      </View>
    );
  }
}*/
