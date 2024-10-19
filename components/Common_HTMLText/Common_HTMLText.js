import React, { Component } from 'react'
import {View, Linking, Text, Animated, Dimensions} from 'react-native'
import NavigationHelper from '../Common_NavigationHelper/Common_NavigationHelper.js'

let width = Dimensions.get('window').width
const contentSizes =[width * 0.045,width * 0.053,width * 0.058,width * 0.063,width * 0.066,width * 0.069]
let lineHeight = [26,30,34,38,42,46]

export default class HTMLText extends Component{
  animated = false
  font = "Poppins"
  textStyle = {} //always pass props textStyle in json object not in arrays
  constructor(props){
      super(props);
      this.content = props.content || ""
      this.isDesc = props.isDesc || false
  }

  _handleConvertHtmlTagToArrays(htmlTag){
    // console.log(htmlTag);
    // look around (?<=>)((${string})(?=<)|(?=<))
    //string to array of tag and text
    {
      var arrs = [];
      var str = htmlTag
      var exp = new RegExp(/<[^>]+>/)
      var canSplit = true
      while(canSplit){
        var match = str.match(exp)
        if(match){
          var tag = match[0]
          if(match.index>=1){
            arrs.push(str.substring(0,match.index))
          }
          arrs.push(tag)
          str = str.substring(match.index+tag.length,str.length)
        }
        else{
          canSplit = false
        }
      }
      if(str.length>0){
        arrs.push(str)
      }
      // console.log(arrs);
    }
    {
      var htmls = []
      htmls = arrs.map((item,index) => {
        if(item.match(/<[^>]+>/g)!=undefined && item.match(/<[^>]+>/g).length>0){
          var tags = item.split(" ")
          var tagName = tags[0].replace("<","").replace(">","")
          tags.shift()
          var tagType = "open"
          if(tagName.indexOf("/") > -1){
            tagType = "close"
          }
          return{
            type: "tag",
            content: {
              tagName: tagName.replace("/",""),
              tagAttrs: tags,
              tagType
            }
          }
        }
        else{
          return {
            type: "text",
            text: item
          }
        }
      })
      var currTags = []
      var texts = []
      var listIndex = 1
      for(var i=0; i<htmls.length; i++){
        if(htmls[i].type=="tag"){
          if(htmls[i].content.tagType == "open"){
            if(htmls[i].content.tagName=="li"){
              htmls[i].content.listIndex =listIndex
              listIndex++;
            }
            currTags.push(htmls[i].content)
          }
          else if(htmls[i].content.tagType == "close" && currTags.length>=1){
            if(currTags[currTags.length-1].tagName==htmls[i].content.tagName){
              currTags.pop()
            }
          }
        }
        else if(htmls[i].type=="text"){
          texts.push({
            text: htmls[i].text,
            tags: currTags.slice()
          })
        }
      }
    }
    return texts
  }

  _handleHyperLink(aTag){
    //find all content between double quote and remove the double quote
    var urlArrays = aTag.match(/"([^"]*)"/g).map(str => str.replace(/"/g, ''))
    for(var j=0; j<urlArrays.length; j++){
      var url = urlArrays[j]
      if(url.length > 0 && this.props.linking!=true){
        Linking.canOpenURL(url).then(supported => {
          if (!supported) {
            console.log('Can\'t handle url: ' + url);
          } else {
            return Linking.openURL(url);
          }
        }).catch(err => console.error('An error occurred', err));
      }
      if(this.props.linking){
          this.refs.navigationHelper._navigate('NewsDetail', {
              data: {
                  alias: decodeURI(this.props.alias),
                  nid: this.props.nid
              }
          })
      }
    }
  }

  _removeSpecialCharacter(string){
    return string.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, "\"")
  }

  _init(){
    if(this.props.content!=undefined && this.props.content!=this.content){
      this.content = this.props.content
    }
    if(this.props.animated!=undefined && this.props.animated!=this.animated){
      this.animated = this.props.animated
    }
    if(this.props.font!=undefined && this.props.font!=this.font){
      this.font = this.props.font
    }
  }

  render(){
    this._init();
    var _renderTextContent = (content) => {
      /* expression to match all tags, only left with it content /<[^>]+>/g*/
      /* expression to match all tag including it contents /<(\w+)[^>]*>.*<\/\1>/gi*/
      /* expression to match all a tag including it contents /<\s*a[^>]*>(.*?)<\s*\/\s*a>/g*/
      /* expression to match all content between double quote /"([^"]*)"/g*/

      var listIndex = 0
      var texts = this._handleConvertHtmlTagToArrays(content)
      return Object.keys(texts).map(index => {
        var text = texts[index].text
        // var font = "Poppins-"
        var font = this.font+"-"
        var isLink = false
        var hyperLink = ""
        var fontSize = 13
        if(this.props.textStyle!=undefined&&this.props.textStyle.fontSize!=undefined){
          fontSize = this.props.textStyle.fontSize
        }
        var isStrong = false
        var isItalic = false
        var isList = false
        var isNextLine = false
        var isOrderList = false
        var listChar = ""
        for(var i=0; i<texts[index].tags.length; i++){
          if(texts[index].tags[i].tagName=='a'){
            isLink = true
            for(var j=0; j<texts[index].tags[i].tagAttrs.length; j++){
              if(texts[index].tags[i].tagAttrs[j].indexOf('href')>-1){
                hyperLink = texts[index].tags[i].tagAttrs[j];
                break;
              }
            }
          }
          else if(texts[index].tags[i].tagName=='strong'){
            isStrong = true
          }
          else if(texts[index].tags[i].tagName=='h1'){
            fontSize = 18
          }
          else if(texts[index].tags[i].tagName=='h2'){
            fontSize = 16
          }
          else if(texts[index].tags[i].tagName=='li'){
            isList = true;
            if(texts[index].tags[i].listIndex > listIndex){
              listIndex++;
              isNextLine = true
            }
          }
          else if(texts[index].tags[i].tagName=='ul'){
            isOrderList = false
            listChar = "\u2022"
            for(var j=0; j<texts[index].tags[i].tagAttrs.length; j++){
              if(texts[index].tags[i].tagAttrs[j].indexOf('style')>-1){
                if(texts[index].tags[i].tagAttrs[j].indexOf('circle')>-1){
                  listChar = "\u2218";
                  break;
                }
              }
            }
          }
          else if(texts[index].tags[i].tagName=='ol'){
            isOrderList = true
          }
        }

        if(isNextLine){
          if(isOrderList){
            listChar = listIndex.toString()+")";
          }
        }

        if(isStrong){
          font+="SemiBold"
        }
        if(isItalic){
          font+="Italic"
        }
        if(font==this.font+"-"){
          font = this.font+"-"+"Regular"
        }
        if(isList && isNextLine){
          text = listChar + " " + text
          if(listIndex>1){
            text = "\n"+text
          }
        }

        return (
          <Text
            allowFontScaling={false}
            key={index}
            style={{
              color: isLink ? '#005c98' : this.props.darkMode ? '#dddddd' : '#414141',
              fontFamily: 'Noto Serif, serif',
              fontSize: this.isDesc? 0.03*width : contentSizes[this.props.fontFactor? this.props.fontFactor : 0],
              lineHeight: this.isDesc? 16 :lineHeight[this.props.fontFactor? this.props.fontFactor : 0],
            }}
            onPress={() => {
              if(isLink){
                this._handleHyperLink(hyperLink)
              }
            }}>
            {this._removeSpecialCharacter(text)}
          </Text>
        )
      })
    }
    if(this.animated){
      return (
        <Animated.Text style={this.props.textStyle}>
          {_renderTextContent(this.content)}
        </Animated.Text>
      )
    } else{
      if(this.props.navigation!=undefined){
          return(
             <View>
                 <NavigationHelper
                   ref={"navigationHelper"}
                   navigation={this.props.navigation}
                 />
                <Text allowFontScaling={false} style={{ fontFamily: 'Poppins-Regular', fontSize: 16, color: this.props.darkMode ? '#dddddd' : '#414141', lineHeight: 30 , paddingHorizontal: 20 }}>
                  {_renderTextContent(this.content)}
                </Text>
            </View>
          )
      }
      else{
          return(
            <Text allowFontScaling={false} style={{ fontFamily: 'Poppins-Regular', fontSize: 16, color: this.props.darkMode ? '#dddddd' : '#414141', lineHeight: 16, paddingHorizontal: 20, }}>
              {_renderTextContent(this.content)}
            </Text>
          )
      }

    }
  }
}
