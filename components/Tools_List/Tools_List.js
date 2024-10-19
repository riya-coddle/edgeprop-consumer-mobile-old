import React, { Component } from 'react'
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Alert,
    ScrollView,
    Image,
    Dimensions,
    NetInfo,
} from 'react-native'

import Tools_ListItem from '../Tools_ListItem/Tools_ListItem.js'

export default class Tools_List extends Component {
  list={}
  isBorder = false
    constructor(props) {
        super(props)
        this.state = {
        }
        this.containerStyle={
          height: 50,
          borderColor: "#c8c7cc",
          // borderTopWidth: 1,
          // borderBottomWidth: 1,
          backgroundColor: "#f8f8f8",
          paddingLeft: 18,
          paddingRight: 23,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between"
        }
        this.titleTextStyle={
          fontFamily: "Poppins-Light",
          fontSize: 13,
          color: "#4a4a4a",
          textAlign: "left"
        }
        this.contentTextStyle={
          fontFamily: "Poppins-Medium",
          fontSize: 17,
          color: "#4a4a4a",
          textAlign: "right"
        }
    }

    _init(){
        if(this.props.containerStyle != undefined){
            this.containerStyle = {...this.containerStyle, ...this.props.containerStyle}
        }
        if(this.props.titleTextStyle != undefined){
            this.titleTextStyle = {...this.titleTextStyle, ...this.props.titleTextStyle}
        }
        if(this.props.contentTextStyle != undefined){
            this.contentTextStyle = {...this.contentTextStyle, ...this.props.contentTextStyle}
        }
        if(this.props.isBorder != undefined && this.props.isBorder!=this.isBorder){
            this.isBorder = this.props.isBorder
        }
        if(this.props.list != undefined && this.props.list!=this.list){
            this.list = this.props.list
        }
    }

    render() {
      this._init();
      var renderList = () => {
        if(Object.keys(this.list).length>0){
          return Object.keys(this.list).map(index => {
            var borderStyle = {}
            if(this.isBorder){
              borderStyle.borderTopWidth = 1
              if(Object.keys(this.list).indexOf(index) == Object.keys(this.list).length-1){
                borderStyle.borderBottomWidth = 1
              }
            }
            return(
              <Tools_ListItem
                key={this.list[index].id}
                containerStyle={[this.containerStyle,borderStyle]}
                titleTextStyle={this.titleTextStyle}
                contentTextStyle={this.contentTextStyle}
                title={this.list[index].title}
                content={this.list[index].content}>
              </Tools_ListItem>
            )
          })
        }
      }
      return(
        <View>
          {renderList()}
        </View>
      )
    }
}
