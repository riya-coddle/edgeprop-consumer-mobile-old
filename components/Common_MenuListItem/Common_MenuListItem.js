import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    TextInput,
    Text,
    View,
    TouchableHighlight,
    Alert,
    TouchableOpacity,
    Dimensions
} from 'react-native'
import Common_IconMenu from '../Common_IconMenu/Common_IconMenu'
import Common_MenuList from '../Common_MenuList/Common_MenuList'
import Image from '../Common_Image/Common_Image'

class Common_MenuListItem extends Component {
    constructor(props) {
        super(props)
        this._onPress = this._onPress.bind(this)
        this._ShowChildMenu = this._ShowChildMenu.bind(this)
        this.state = {
            show: 'none'
        }

        this.downArrow = require('../../assets/icons/Down-arrow.png');
        this.upArrow = require('../../assets/icons/Up-arrow.png');
        this.rightArrow = require('../../assets/icons/Right-arrow.png');
        this.source = '';

        this.style = {
            fontSize: 15,
            fontWeight: '400',
            textColor: '#4a4a4a',
            fontFamily: 'Poppins-Medium',
            alignItems: 'center',
            paddingTop: this.props.isNearBy?10:10,
            paddingBottom: this.props.isNearBy?10:10,
            paddingLeft: this.props.isNearBy?0:20,
            paddingRight: this.props.isNearBy?0:20,
            childPaddingLeft:0,
            
            imageHeight: 18,
            imageWidth: 18,
            imageResizeMode: 'contain',
            imageBorderRadius: 0,
            imageBorderWidth: 0,
            imageBorderColor: '#fff',
        }
        this.item ={
            title: ''
        }
        this.data = []
    }

    _initStyle(){
        //init downArrow
        if (this.props.downArrow && this.props.downArrow != this.downArrow) {
            this.downArrow = this.props.downArrow
        }
        //init upArrow
        if (this.props.upArrow && this.props.upArrow != this.upArrow) {
            this.upArrow = this.props.upArrow
        }
        //init fontSize
        if (this.props.fontSize && this.props.fontSize != this.style.fontSize) {
            this.fontSize = this.props.fontSize
        }
        // init fontWeight
        if (this.props.fontWeight && this.props.fontWeight != this.style.fontWeight) {
            this.style.fontWeight = this.props.fontWeight
        }
        // init textColor
        if (this.props.textColor && this.props.textColor != this.style.textColor) {
            this.style.textColor = this.props.textColor
        }
        // init fontFamily
        if (this.props.fontFamily && this.props.fontFamily != this.style.fontFamily) {
            this.style.fontFamily = this.props.fontFamily
        }
        // init alignItems
        if (this.props.alignItems && this.props.alignItems != this.style.alignItems) {
            this.style.alignItems = this.props.alignItems
        }
        // init paddingTop
        if (this.props.paddingTop && this.props.paddingTop != this.style.paddingTop) {
            this.style.paddingTop = this.props.paddingTop
        }
        // init paddingBottom
        if (this.props.paddingBottom && this.props.paddingBottom != this.style.paddingBottom) {
            this.style.paddingBottom = this.props.paddingBottom
        }
        // init paddingLeft
        if (this.props.paddingLeft && this.props.paddingLeft != this.style.paddingLeft) {
            this.style.paddingLeft = this.props.paddingLeft
        }
        // init paddingRight
        if (this.props.paddingRight && this.props.paddingRight != this.style.paddingRight) {
            this.style.paddingRight = this.props.paddingRight
        }
        // init childPaddingLeft
        if (this.props.childPaddingLeft && this.props.childPaddingLeft != this.style.childPaddingLeft) {
            this.style.childPaddingLeft = this.props.childPaddingLeft
        }
    }
    _initItem(){
        //init title
        if (this.props.title && this.props.title != this.title) {
            this.item.title = this.props.title
        }
        if (this.props.screen && this.props.screen != this.screen) {
            this.item.screen = this.props.screen
        }
        if (this.props.params && this.props.params != this.params) {
            this.item.params = this.props.params
        }
        //init data
        if (this.props.menuList && this.props.menuList != this.data) {
            this.data = this.props.menuList
        }
    }
    _ShowChildMenu(){
        this.setState({
            show : this.state.show == 'none' ? 'flex' : 'none'
        })
    }
    _onPress() {
        if(this.props.accordion==true){
            this.setState({
                show : this.state.show == 'none' ? 'flex' : 'none'
            })
        }
        else{
          if(this.props.onPressItem != undefined){
            this.props.onPressItem(this.item.title, this.item.screen, this.item.params)
          }
        }
    }
    shouldComponentUpdate(nextState,nextProps){
        if(nextProps.data!==this.props.data){
            return true
        }
        return(JSON.stringify(nextState.show)!==JSON.stringify(this.state.show))
    }
    render() {
    //   console.log("render");
        this._initStyle()
        this._initItem()

        const imageStyle = {
                height: this.style.imageHeight,
                width: this.style.imageWidth,
                borderRadius: this.style.imageBorderRadius,
                borderWidth: this.style.imageBorderWidth,
                borderColor: this.style.imageBorderColor,
                marginLeft: -5,
            }

        console.log('icon', this.props);
        if (this.props.icon == 'MRT'){
            this.source = require('../../assets/icons/MRT_new.png');
        }
        else if (this.props.icon == 'Area'){
            this.source = require('../../assets/icons/allocation.png');
        }
        else if (this.props.icon == 'school'){
            this.source = require('../../assets/icons/school.png');
        }
        else if (this.props.icon == 'HDBtown'){
            this.source = require('../../assets/icons/HDBtown.png');
        }
        else if (this.props.icon == 'District'){
            this.source = require('../../assets/icons/District.png');
        }
        else if (this.props.icon == 'Bookmarks'){
            this.source = require('../../assets/icons/bookmark_unselect.png');
        }


        return(
            <View>
                <TouchableOpacity onPress= {this._onPress}>
                    <View style={{
                        flexDirection:'row',
                        paddingTop: this.style.paddingTop,
                        paddingLeft: this.style.paddingLeft+this.style.childPaddingLeft,
                        paddingBottom: this.style.paddingBottom,
                        paddingRight: this.style.paddingRight,
                        alignItems: this.style.alignItems,
                        justifyContent:'space-between'
                    }}>
                    <View style={{
                        flexDirection:'row',
                        justifyContent:'space-between'
                    }}>
                        
                        <View style={{justifyContent: 'center'}}>
                            {this.props.isNearBy && (
                            <Text allowFontScaling={false} style={{
                                fontSize: 14,
                                fontWeight: 'normal',
                                color: '#414141',
                                fontFamily: 'Poppins-Regular'
                            }}>
                                {this.item.title}
                            </Text>       
                            )}
                            { (this.props.icon == 'MRT' || this.props.icon == 'Area') ? (
                                <View style={[styles.rowLayout]}>
                                    <Image
                                        defaultSource={this.props.defaultSource}
                                        source={this.source}
                                        resizeMode={this.style.imageResizeMode}
                                        style={[imageStyle
                                        ]} 
                                    />
                                    <Text allowFontScaling={false} style={{
                                        fontSize: 14,
                                        fontWeight: 'normal',
                                        color: '#414141',
                                        fontFamily: 'Poppins-Regular',
                                        marginLeft: 10,
                                        }}>
                                        {this.item.title}
                                    </Text>
                                </View>

                            ): (
                              <Text allowFontScaling={false} style={{
                                fontSize: 14,
                                fontWeight: 'normal',
                                color: '#414141',
                                fontFamily: 'Poppins-Light'
                            }}>
                                {this.item.title}
                            </Text> 

                            )}

                            
                            {
                                this.props.totalBookmark!=undefined && this.props.totalBookmark>=0
                                ?
                                <Text allowFontScaling={false} style={{
                                    fontSize:13,
                                    color: this.style.textColor,
                                    fontFamily: 'Poppins-Light',
                                }}>
                                     {this.props.totalBookmark+' saved'}
                                </Text>
                                :
                                null
                            }

                        </View>
                    </View>
                        {this.props.accordion == true
                          ?
                          this.state.show == 'none'
                            ?
                            <Common_IconMenu
                              imageSource={this.downArrow}
                              type={'icon'}
                              imageHeight={15}
                              imageWidth={15}
                              onPress={this._ShowChildMenu}
                              isPropertyList={true}
                            />
                            :
                            <Common_IconMenu
                              imageSource={this.upArrow}
                              type={'icon'}
                              imageHeight={15}
                              imageWidth={15}
                              onPress={this._ShowChildMenu}
                              isPropertyList={true}
                            />
                          :
                          this.props.accordion == 'search'
                            ?
                            
                            <Common_IconMenu
                              imageSource={this.rightArrow}
                              type={'icon'}
                              imageHeight={30}
                              imageWidth={20}
                              isPropertyList={true}
                            />
                            
                            :
                            this.props.accordion == 'right'
                            ?
                            <Common_IconMenu
                              imageSource={this.rightArrow}
                              type={'icon'}
                              imageHeight={30}
                              imageWidth={20}
                              isPropertyList={true}
                            />
                            :
                            <Text allowFontScaling={false}>{''}</Text>
                        }
                    </View>
                </TouchableOpacity>
                {!this.props.isNearBy && (
                    <View style={{ paddingLeft: 20, paddingRight: 20 }}>
                        <View  style={{ borderBottomColor: '#F4F4F6', borderBottomWidth: 1, borderStyle: 'solid' }} />
                    </View>
                )}
                {this.props.isNearBy && (
                    <View style={{ width: '75%' }}>
                        <View  style={{ borderBottomColor: '#ACACAC', borderBottomWidth: 1, borderStyle: 'solid' }} />
                    </View>
                )}    
                <View style={{
                    display:this.state.show,
                    flexDirection:'column',
                    // paddingTop: this.style.paddingTop,
                    // paddingLeft: 20,
                    // paddingBottom: this.style.paddingBottom,
                    // paddingRight: this.style.paddingRight,
                    //alignItems: this.style.alignItems,
                    //backgroundColor:'red',
                    //justifyContent:'space-between',
                    //  borderTopColor: '#C8C7CC',
                    //  borderTopWidth: StyleSheet.hairlineWidth,
                    }}>
                        <Common_MenuList
                          data={{MenuItem:this.data}}
                          childPaddingLeft={20}
                          onPressItem={this.props.onPressItem}
                        />
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchIcons: {
        justifyContent: 'center',
        paddingRight: 8,
        position: 'relative',
        top: -4

   },
    iconContainer : {
        justifyContent: 'flex-start',
    },
    columnLayout: {
        // flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowLayout: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    isSearch: {
        alignItems: 'flex-end',
        backgroundColor: 'red',
    },
})

export default Common_MenuListItem
