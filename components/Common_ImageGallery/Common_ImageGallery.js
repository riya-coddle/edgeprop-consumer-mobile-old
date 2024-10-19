import React, { PureComponent } from 'react';
import { View, StyleSheet, Image, Text, Dimensions,ScrollView,Alert,TouchableOpacity } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
export default class App extends PureComponent {
  items = []
  scrollDirection="vertical"

  constructor(props){
    super(props)
    this.containerStyle={flex:1}
    this.itemStyle={}
    this.showSeparator=true
    this.separatorBorderWidth=10
    this.itemFocusStyle = {
      borderColor:"grey",
      borderWidth: 3
    }
    this.separatorBorderColor="white"
    this.numTuples=3
    this.scrollable=false
    this.lastRowFill = true
    this.state = {
      lastImageRatio: 0,
      focusIndex: 0
    }
    this._calFixedDimension = this._calFixedDimension.bind(this)
    this._calDynamicDimension = this._calDynamicDimension.bind(this)
    this._calSets = this._calSets.bind(this)

  }

  _calFixedDimension(){
    if(this.scrollDirection=="vertical"){
      this.itemHeight = (this.props.width - this.separatorBorderWidth * (this.numTuples+1))/this.numTuples
    }
    else if(this.scrollDirection=="horizontal"){
      this.itemWidth = (this.props.height - this.separatorBorderWidth * (this.numTuples+1))/this.numTuples
    }
  }

  _calDynamicDimension(numTup){
    if(this.scrollDirection=="vertical"){
      return (this.props.width - this.separatorBorderWidth * (numTup+1))/numTup
    }
    else if(this.scrollDirection=="horizontal"){
      return (this.props.height - this.separatorBorderWidth * (numTup+1))/numTup
    }
  }

  _calSets(){
    this.numSets = Math.ceil(this.items.length/this.numTuples)
    this.lastSet_numTup = this.items.length%this.numTuples
  }

  _changeFocusIndex(index){
    this.setState({
      focusIndex: index
    })
  }

  _init(){
    if (this.props.items && this.props.items != this.items) {
        this.items = this.props.items
    }
    if (this.props.containerStyle != undefined) {
        this.containerStyle = {...this.containerStyle, ...this.props.containerStyle}
    }
    if (this.props.itemFocusStyle != undefined) {
        this.itemFocusStyle = {...this.itemFocusStyle, ...this.props.itemFocusStyle}
    }
    if (this.props.itemStyle != undefined) {
        this.itemStyle = {...this.itemStyle, ...this.props.itemStyle}
    }
    if (this.props.showSeparator && this.props.showSeparator != this.showSeparator) {
        this.showSeparator = this.props.showSeparator
    }
    if (this.props.separatorBorderColor && this.props.separatorBorderColor != this.separatorBorderColor) {
        this.separatorBorderColor = this.props.separatorBorderColor
    }
    if (this.props.numTuples && this.props.numTuples != this.numTuples) {
        this.numTuples = this.props.numTuples
    }
    if (this.props.scrollDirection && this.props.scrollDirection != this.scrollDirection) {
        this.scrollDirection = this.props.scrollDirection
    }
    if (this.props.lastRowFill != undefined && this.props.lastRowFill != this.lastRowFill) {
        this.lastRowFill = this.props.lastRowFill
    }
    if (this.props.scrollable != undefined && this.props.scrollable != this.scrollable) {
        this.scrollable = this.props.scrollable
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.items != undefined && nextProps.items.length>0 && nextProps.items.length%this.numTuples==1 && this.props.lastRowResize){
      this.items = nextProps.items
      var lastImageURL = this.items[this.items.length-1].image
      Image.getSize(lastImageURL, (width, height) => {
        this.setState({
          lastImageRatio: width/height
        })
      });
    }
  }

  render() {

    this._init()
    this._calFixedDimension()
    this._calSets()

    var renderItem = (index,width,height,i,j) => {
      var item = this.items[index]
      // console.log(item,width,height);
      var imageStyle = {
        width:width,
        height:height,
      }
      var marginStyle = {}
      if(this.scrollDirection=="vertical"){
        marginStyle = {
          marginLeft:j==0?this.separatorBorderWidth:0,
          marginRight:this.separatorBorderWidth,
        }
      }
      else if(this.scrollDirection=="horizontal"){
        marginStyle = {
          marginTop:j==0?this.separatorBorderWidth:0,
          marginBottom:this.separatorBorderWidth,
        }
      }
      var imageAllStyle = {...imageStyle,...marginStyle, ...this.itemStyle}
      if(index==this.state.focusIndex){
        imageAllStyle = {...imageAllStyle, ...this.itemFocusStyle}
      }

      if(this.props.renderItem!=undefined){
        return(
          <View style={[imageStyle,marginStyle]}>
            {this.props.renderItem(index,item,width,height)}
          </View>
        )
      }
      return (
        <View style={{alignItems:"center"}}>
          <TouchableOpacity
            style={imageAllStyle}
            onPress={()=>{if(this.props.onItemPress!=undefined){
              this.setState({
                focusIndex: index
              })
              this.props.onItemPress(index,item)
            }}}>
            <Image
              style={{flex:1}}
              source={{uri:item.image}}>
            </Image>
          </TouchableOpacity>
          {(item.text!=undefined&&item.text.length>0)?
          <Text
            style={this.props.textStyle}
            numberOfLines={1}
            ellipsizeMode={"tail"}>
            {item.text}
            </Text>
          :null}
        </View>
      )
    }

    var renderSet = (i,width,height,numTup) => {
      var obj2 = {}
      for(var j=0;j<numTup;j++){
        obj2[j]=j
      }
      return Object.keys(obj2).map((index2) => {
        var j = obj2[index2]
        var index = i*this.numTuples+j
        return (
          <View key={"item"+i+j}>
            {renderItem(index,width,height,i,j)}
          </View>
        )
      })
    }

    var renderSets = () => {
      if(this.numSets<=0){
        return <View/>
      }
      else{
        var obj1 = {}
        for(var i=0;i<this.numSets;i++){
          obj1[i]=i
        }
        return Object.keys(obj1).map((index1) => {
          var i = obj1[index1]
          var numTup = this.numTuples
          if(i==this.numSets-1 && this.lastSet_numTup>0){
            numTup = this.lastSet_numTup
          }
          if(this.scrollDirection=="vertical"){
            var width = this.lastRowFill? this._calDynamicDimension(numTup) : this._calDynamicDimension(this.numTuples)
            var height = this.itemHeight
            if(i==this.numSets-1 && this.state.lastImageRatio>0){
              height=this.props.width/this.state.lastImageRatio
            }
            var setStyle = {
              height: height,
              width: "100%",
              marginTop:i==0?this.separatorBorderWidth:0,
              marginBottom:this.separatorBorderWidth,
              flexDirection:'row',
            }
          }
          else if(this.scrollDirection=="horizontal"){
            var width = this.itemWidth
            var height = this._calDynamicDimension(numTup)
            var setStyle = {
              height:"100%",
              width: this.itemWidth,
              marginLeft:i==0?this.separatorBorderWidth:0,
              marginRight:this.separatorBorderWidth,
              flexDirection:'column'
            }
          }
          return(
            <View key={"set"+i} style={setStyle}>
             {renderSet(i,width,height,numTup)}
            </View>
          )
        })
      }

    }

    if(this.scrollable==false){
      return (
        <View
          style={{...this.containerStyle,...{
              flexDirection:this.scrollDirection=="horizontal"?"row":"column"}}}>
          {renderSets()}
        </View>
      )
    }

    return (
      <ScrollView
        style={{...this.containerStyle,...{width:"100%",height:"100%"}}}
        horizontal={this.scrollDirection=="horizontal"?true:false}>
        {renderSets()}
      </ScrollView>
    );
  }
}
