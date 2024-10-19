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
    FlatList,
    Modal,
    ScrollView
} from 'react-native'
import PropTypes from 'prop-types'
import Home_ListItemDetail from '../Home_ListItemDetail/Home_ListItemDetail'
import EditorNewsItem from '../Listing_EditorNewsItem/EditorNewsItem'
import Common_ToolsTip from '../Common_ToolsTip/Common_ToolsTip'
import IconMenu from '../Common_IconMenu/Common_IconMenu.js'
import styles from './HomeFeaturedProjectsStyles'
import HomeFeaturedDetailsItem from '../Home_FeaturedDetailsItem/HomeFeaturedDetailsItem'

let imagesData = [];
let launchData = [];
class HomeFeaturedProjects extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: 'none',
        }
        
        this._handleOnPressItem = this._handleOnPressItem.bind(this)
        this._handleMorePress   = this._handleMorePress.bind(this)

        this.style = {
            // default value
            textSize: 13,
            fontFamily: 'Poppins',
            textColor: '#a8abae',
            backgroundColor: '#f1f5f8',
            margin: 10,
            marginTop: 10,
            marginRight: 20,
            marginBottom: 9,
            marginLeft: 20,
            paddingHorizontal: 7.5,
            paddingTop: 5,
            paddingBottom: 5,
        }
        // data for listItemDetail
        this.item = {
            headerTextValue: '',
            subjectTextValue: '',
            contentTextValue: '',
            image: null,
            title: '',
            tooltipMessage: '',
        }
    }
    _initStyle() {
        // init textSize
        if (this.props.textSize && this.props.textSize != this.style.textSize) {
            this.style.textSize = this.props.textSize
        }
        // init fontFamily
        if (this.props.fontFamily && this.props.fontFamily != this.style.fontFamily) {
            this.style.fontFamily = this.props.fontFamily
        }
        // init textColor
        if (this.props.textColor && this.props.textColor != this.style.textColor) {
            this.style.textColor = this.props.textColor
        }
        // init backgroundColor
        if (this.props.backgroundColor && this.props.backgroundColor != this.style.backgroundColor) {
            this.style.backgroundColor = this.props.backgroundColor
        }
        // init margin
        if (this.props.margin && this.props.margin != this.style.margin) {
            this.style.margin = this.props.margin
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
        if(this.props.moreOption != undefined && this.props.moreOption != this.moreOption){
            this.moreOption = this.props.moreOption
        }
    }
    _initItems() {
        // init data
        if (this.props.item) {
            this.item = this.props.item
        }
        // init title
        if (this.props.title && this.props.title != this.item.title) {
            this.item.title = this.props.title
        }
        // init tooltipMessage
        if (this.props.tooltipMessage && this.props.tooltipMessage != this.item.tooltipMessage) {
            this.item.tooltipMessage = this.props.tooltipMessage
        }
    }

    _handleOnPressItem(item, index) {
        if (this.props.onPressItem) {
            this.props.onPressItem(item, index)
        }
        else {
            Alert.alert("Coming Soon", `${this.item.title}, this feature will be coming soon`);
        }
    }

    _handleMorePress() {
        if(this.props.onPressMore) {
            this.props.onPressMore();
        }
    }
    _renderItem(item, index) {
        if(this.props.isEditorNews) {
            if(item) {
                var data = {
                  image: item.image_original,
                }
              imagesData.push(data);
            }  
            return (
                <View>
                    <HomeFeaturedDetailsItem
                        id={`${this.props.title}-${index}`}
                        item={item}
                        isEditor={this.props.isEditorNews}
                        images={imagesData}
                        index={index}
                        onPress={() => this._handleOnPressItem(item, index)}
                    />
                </View>
            )
       } else {
            if(item) {
                var data = {
                  image: item.field_prop_images_txt[0],
                }
              launchData.push(data);
            } 
           return (
                <View>
                    <HomeFeaturedDetailsItem
                        id={`${this.props.title}-${index}`}
                        item={item}
                        isEditor={this.props.isEditorNews}
                        images={launchData}
                        onPress={() => this._handleOnPressItem(item, index)}
                    />
                </View>
            )
       }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (JSON.stringify(nextProps.item) !== JSON.stringify(this.item))
    }

    render() {
        this._initStyle()
        this._initItems()

        var numOfColumn = this.item.length || 2;
        return (
           <View>
            {this.item.length > 0 ?
              <View>
                <View style={styles.newsContainer}>
                   <View style={{ flex: 1 }}>
                    <Text allowFontScaling={false} style={styles.title}>{this.item.title}</Text>
                   </View>
                   <View style={styles.moreTextContainer}>
                    {
                      this.moreOption && 
                      (
                       <TouchableOpacity onPress={()=>this._handleMorePress()}>
                       <Text 
                       allowFontScaling={false}
                       style={{ 
                            fontFamily: 'Poppins-Medium' , 
                            fontSize: 13, 
                            alignItems: 'flex-end', 
                            color:'#488BF8' 
                        }}>
                        {this.props.isEditorNews?"See all":"See all"}
                        </Text>
                       </TouchableOpacity> 
                      )
                    }
                   </View>
                </View>
                <View style={{ paddingLeft: 23 }}>
                <ScrollView horizontal={true} bounces={false}>
                    <FlatList style={{ zIndex: -1 }}
                      numColumns={numOfColumn}
                      flexDirection={'column'}
                      data={this.item}
                      renderItem={({ item, index }) => this._renderItem(item, index)}
                      keyExtractor={(item, index) => item.nid}
                      key={numOfColumn}
                      scrollEnabled = {false}
                  />
                </ScrollView>
              </View>  
              </View>
            : <View></View>}
            </View>
        )
    }
}

export default HomeFeaturedProjects;
