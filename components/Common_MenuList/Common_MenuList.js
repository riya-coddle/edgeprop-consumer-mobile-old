import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    TextInput,
    Text,
    View,
    Image,
    TouchableHighlight,
    Alert,
    TouchableOpacity,
    Dimensions,
} from 'react-native'
import Common_MenuListItem from '../Common_MenuListItem/Common_MenuListItem'
import Common_IconMenu from '../Common_IconMenu/Common_IconMenu'

class Common_MenuList extends Component {

    constructor(props) {
        super(props)
        this.state = {}
        this.close = require('../../assets/icons/Close.png');
        this.style = {
            childPaddingLeft:0,
        }
        this.data = []
        this._onPressItem = this._onPressItem.bind(this)
    }
    _initStyle(){
        //init icon
        if (this.props.close && this.props.close != this.close) {
            this.close = this.props.close
        }
        //init childPaddingLeft
        if (this.props.childPaddingLeft && this.props.childPaddingLeft != this.style.childPaddingLeft) {
            this.style.childPaddingLeft = this.props.childPaddingLeft
        }
    }
    _initItem(){
        //init data
        if (this.props.data && this.props.data != this.data){
            this.data = this.props.data
        }
    }

    _onPressItem(title, screen, params){
      if(this.props.onPressItem!=undefined){
        this.props.onPressItem(title, screen, params)
      }
    }

    shouldComponentUpdate(nextProps){
        return(nextProps.data.MenuItem!=this.props.data.MenuItem || nextProps.totalBookmark != this.props.totalBookmark)
        // return (nextProps.totalBookmark != this.props.totalBookmark)
    }

    render() {
      //console.log("render",this.props.totalBookmark);
        this._initStyle()
        this._initItem()
        var MenuArr = this.data.MenuItem.map((data, index) => {
            //Alert.alert(data.icon)
              return(
                    <Common_MenuListItem
                      isNearBy={this.props.isNearBy}
                      title={data.title}
                      screen={data.screen || ""}
                      params={data.params || ""}
                      menuList={data.MenuItem}
                      accordion={data.accordion}
                      key={index}
                      childPaddingLeft={this.style.childPaddingLeft}
                      icon={data.icon}
                      onPressItem={this._onPressItem}
                      totalBookmark={this.props.totalBookmark}
                    />
                )
          });

        return(
            <View>
                {MenuArr}
            </View>
        )
    }
}
export default Common_MenuList
