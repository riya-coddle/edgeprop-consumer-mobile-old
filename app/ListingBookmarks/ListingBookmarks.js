import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
} from 'react-native'

import Common_IconMenu from '../../components/Common_IconMenu/Common_IconMenu.js';
import ListingResultList from '../../components/ListingResult_List/ListingResult_List'
import BookmarkHelper from '../../components/Common_BookmarkHelper/Common_BookmarkHelper.js'
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'

export default class ListingBookmarks extends Component {


  static navigationOptions = ({ navigation }) => {
    var menu_icon = require('../../assets/icons/menu.png');
    var share_icon = require('../../assets/icons/share.png');
    var { state, setParams } = navigation;
    var { params } = state
    return {
      title: 'BOOKMARKS',

    };
  };

  constructor(props) {
    super(props);
    this.navigation = props.navigation
    this.params = this.navigation.state.params
    this._handleOnPressListing = this._handleOnPressListing.bind(this);
    this._checkBookmark = this._checkBookmark.bind(this)
    this._handleBack = this._handleBack.bind(this)


    this.state = {
        bookmarkList: this.props.navigation.state.params.bookmarkList
    }
}

componentDidMount() {
    this._checkBookmark();
}

_handleBack(){
    console.log('back');
    this._checkBookmark();
}

componentWillUnmount(){
    console.log('unmount');
    if(this.props.navigation.goBack != undefined){
        console.log('masukk');
      if(this.props.navigation.state.params._handleBack){
           this.props.navigation.state.params._handleBack();
      }
    }
}

_checkBookmark() {
    this.refs.bookmarkHelper._getBookmarks((nids) => {
        if (nids != undefined && Array.isArray(nids)) {
            console.log('masuk', nids);
            if (JSON.stringify(nids) != JSON.stringify(this.state.bookmarkList.toString)) {
                this.setState({
                    bookmarkList: nids
                })
            }
        }
    });
}
_handleOnPressListing(item, index) {
    this.refs.navigationHelper._navigate('ListingDetailNav', {
        data: {
            nid: item.listing_id,
            _handleBack : this._handleBack,
            property_id: (item.nid && item.nid >0)? item.nid: item.mid,
            listing_type:item.field_prop_listing_type.und[0].value,
            key: (item.nid && item.nid >0)? 'n': 'm',
            uid: item.uid
        }
    })
}

  render() {
    var imageStyle = {
              width: '50%',
              height: '30%',
          }
    var textStyle = {
            fontFamily: 'Poppins-Regular',
            fontSize: 14,
            color: '#4a4a4a',
    }
    console.log(this.props.navigation.state.params.data,'ian');
    return (
      <View style={{ flex: 1}}>
          <NavigationHelper
                ref={"navigationHelper"}
                navigation={this.props.navigation} />

          <BookmarkHelper
                ref={"bookmarkHelper"}
                navigation = {this.props.navigation}
          />
        <View style={{
            flex:1,
            alignItems: "center",
            justifyContent: "center",
            display: this.props.navigation.state.params.data.length>0 ? 'none' : 'flex'
        }}>
            <Image
                source={require('../../assets/icons/add-bookmark.png')}
                style={imageStyle}
            />
            <Text allowFontScaling={false} style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 20,
                color: '#275075',
            }}>You have no Bookmarks yet</Text>
            <View style={{flexDirection:'row'}}>
                <Text allowFontScaling={false} style={textStyle}>Tap the </Text>
                <Common_IconMenu
                    imageSource={require('../../assets/icons/bookmark_unselect.png')}
                    imageWidth={14}
                    imageHeight={14}
                    type={'icon'}
                    />
                <Text allowFontScaling={false} style={textStyle}> icon to get started</Text>
            </View>
        </View>
        <View style={{flex:1, display: this.props.navigation.state.params.data.length>0 ? 'flex' : 'none'}}>
            <ListingResultList
                bookmarkList={this.state.bookmarkList}
                navigation={this.props.navigation}
                items={this.props.navigation.state.params.data}
                onPressItem={this._handleOnPressListing}
                totalListing = {this.props.navigation.state.params.data.length}
                // onLoadMore={false}
                // isEndOfData={true}
                onUpdateBookmark={this._checkBookmark}
            />
        </View>
      </View>
  );
  }
}
