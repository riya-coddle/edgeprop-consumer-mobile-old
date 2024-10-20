import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert
} from 'react-native';
import Common_IconMenu from '../Common_IconMenu/Common_IconMenu';

const screenWidth = Dimensions.get('window').width;
//Suggestion Search
const PROXY_URL = "?";
const API_DOMAIN = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
const LIMIT_DISTRICTS = 4;
const LIMIT_HDB_TOWNS = 4;
const LIMIT_NEW_LAUNCHES = 2;
const LIMIT_AMENITIES = 2;
const LIMIT_PROJECTS = 12;
const LIMIT_PLACES = 4;
const GOOGLE_PLACES_API_KEY = 'AIzaSyD0Gf8jcdq-X9ElDG-p7aojhnM7E1-fzDI'
const AUTO_SUGGESTION_GROUPS = {
    //auto
    suggestion:{
        name: 'Suggestion',
        url: "key={GOOGLE_PLACES_API_KEY}&location={LOCATION}&radius=2000&keyword={KEYWORD}",
        proxy: { url: PROXY_URL, encode: false },
        limit: 15,
        displayKey: "n",
        optionsInfo: {
          icon: 'https://dkc9trqgco1sw.cloudfront.net/images/icons/web4/Districts.png',
          name: "District",
        }
    }
}

const AUTO_SUGGESTION_ICONS = {
    icon: 'https://dkc9trqgco1sw.cloudfront.net/images/icons/web4/Places.png'
}

class Common_AutoSuggestionGoogle extends Component {
  groups = {};
  searchText = ''; // searched text
  options = {};
  caching = true;
  keyword = ''; // keyword for internal use (generated by `searchText` value)
  location = {};
  cachedSuggestions = {}; // will be used if props.caching = true
  cachedStaticData = {}; // will be used if there are static file as the data source
  fetchCounterPerGroup = [];
  fetchTimeout = setTimeout(() => {
    //initial fetch
  }, 0);
  handlerResultTimeOut = setTimeout(() => {
    //initial result handler
  }, 0);
  constructor(props) {
    super(props);
    this.data = [];
    //this.result = [];
    //this.tempResult = [];
    this.state = {
      text: ''
    };
    this.rightArrow = require('../../assets/icons/Right-arrow.png');
    this.categoryIcon = '';
    this.groups = AUTO_SUGGESTION_GROUPS
  }
  _initItem() {
    //console.log('Common_AutoSuggestion 223 _initItem',this.props.data);
    if (this.props.data != undefined && this.props.data != this.data) {
      this.data = this.props.data;
    }
  }

  //SUGGESTION FEATURES
  getAllSuggestions(value, keyword, location) {
    console.log('location',location);
    this.result = [];
    this.tempResult = [];
    this.fetchCounterPerGroup = [];
    coord = location.latitude+','+location.longitude
    Object.keys(this.groups).map(key => {
      this.getSuggestionsData(key, value, keyword,coord)
    })
    return this.result;
  }
  generateKeyword(value) {
    return value.toLowerCase().replace(/ /g, '_');
  }

  getSuggestions(group, keyword, data) {
    // convert json object to array
    /*if (data instanceof Array === false) {
      data = Object.values(data);
  }*/
    // apply the limit
    // if(this.groups[group].limit && data.length > parseInt(this.groups[group].limit)) {
    //console.log('places',data);
    if (this.groups[group].limit) {
      var limitedData = [];
        data.forEach((d, i) => {
            limitedData.push({...d,t:'g',lat:d.geometry.location.lat,lon:d.geometry.location.lng});
        });

      data = limitedData;

      var handlerData = data.map(value => {
        return value.t;
      });
      //console.log('handlerData',handlerData);
      var handlerTempResult = this.tempResult.map(value => {
        return value.t;
      });

      if (!handlerTempResult.includes(...handlerData)) {
        this.tempResult = [...this.tempResult, ...data];
      }

      //   this.tempResult = [...this.tempResult, ...data];
      clearTimeout(this.handlerResultTimeOut);
      this.handlerResultTimeOut = setTimeout(() => {
        this.result = this.tempResult;
        //console.log('Common_AutoSuggestion 291 this.result',this.result);
        this.props.onGetResult(this.result)
      }, 500);
      this.result = this.tempResult;
      this.props.onGetResult(this.result)
    }

    // ---------
    // IMPORTANT: if the keyword has been changed when response is received, just cache it
    // ---------
    if (keyword == this.keyword) {
      this.afterGetSuggestions(group, keyword, data, true);
    } else {
      this.cacheSuggestions(group, keyword, data);
    }
  }
  searchFromStaticData(data, toSearch, key, sortFunc, limit, removeDuplicates) {
    key = key || 'n';
    limit = limit || 100000; // if limit has not given, just consider this big number
    removeDuplicates = removeDuplicates || false;
    var results = [];
    var re = new RegExp('^' + toSearch, 'i');
    var foundSuggestions = [];

    // searching from the begining
    for (var i = 0; i < data.length; i++) {
      if (data[i][key].match(re) && results.indexOf(data[i]) === -1) {
        results.push(data[i]);
      }
    }
    // searching from beginning of any word
    if (results.length < limit) {
      re = new RegExp('\\b' + toSearch, 'i');
      for (var i = 0; i < data.length; i++) {
        if (data[i][key].match(re) && results.indexOf(data[i]) === -1) {
          results.push(data[i]);
        }
      }
    }
    // searching for any position
    if (results.length < limit) {
      re = new RegExp(toSearch, 'i');
      for (var i = 0; i < data.length; i++) {
        if (data[i][key].match(re) && results.indexOf(data[i]) === -1) {
          results.push(data[i]);
        }
      }
    }

    // sort the results as per the given function
    if (typeof sortFunc === 'function') {
      results.sort(sortFunc);
    }

    // removing the duplicates
    var results2 = results;
    results = [];
    for (var i = 0; i < results2.length; i++) {
      if (
        (removeDuplicates &&
          !foundSuggestions.indexOf(results2[i][key].toLowerCase()) > -1) ||
        !removeDuplicates
      ) {
        results.push(results2[i]); // adding the non-duplicate suggestion to the final output
        foundSuggestions.push(results2[i][key].toLowerCase()); // collecting the suggestions
      }
    }
    results2 = [];
    return results;
  }
  getSuggestionsData(group, value, keyword, coord) {

    if (
      this.cachedSuggestions[group] &&
      this.cachedSuggestions[group][keyword]
    ) {
      this.afterGetSuggestions(
        group,
        keyword,
        this.cachedSuggestions[group][keyword],
        false
      );
    } else if (this.groups[group].static && this.cachedStaticData[group]) {
      var data = this.cachedStaticData[group];
      data = this.searchFromStaticData(
        data,
        value,
        this.groups[group].displayKey,
        this.groups[group].sort,
        this.groups[group].limit,
        this.groups[group].removeDuplicates
      );
      this.getSuggestions(group, keyword, data);
    }
    data = [];
    if (!this.fetchCounterPerGroup.includes(group)) {
      this.fetchCounterPerGroup.push(group);
      //console.log('this.groups[group].url',this.groups[group].url);
      var url = this.groups[group].url.replace(
        '{KEYWORD}',
        encodeURIComponent(value)
      );

      url = url.replace(
        '{LOCATION}',
        encodeURIComponent(coord)
      );

      url = url.replace(
        '{GOOGLE_PLACES_API_KEY}',
        encodeURIComponent(GOOGLE_PLACES_API_KEY)
      );
      //   console.log("URL",url)
      if (
        this.groups[group].proxy &&
        this.groups[group].proxy.url &&
        this.groups[group].proxy.url.length > 0
      ) {
        if (this.groups[group].proxy.encode) {
          url = encodeURIComponent(url);
        }
        url = API_DOMAIN + this.groups[group].proxy.url + url;
        //console.log("URL", url)
      }
      console.log('Common_AutoSuggestionGoogle 281 suggestion',url);
      // fetching data
      //console.log('URL', url,group);
      fetch(url)
        .then(function (response) {
          return response.json();
        })
        .then(
          function (data) {
            // if the data coming through static files
            console.log('data',data)
            if (this.groups[group].static) {
              this.cachedStaticData[group] = data;
              data = this.searchFromStaticData(
                data,
                value,
                this.groups[group].displayKey,
                this.groups[group].sort,
                this.groups[group].limit,
                this.groups[group].removeDuplicates
              );
            } else if (data.results) {
              data = data.results;
            } else if (this.groups[group].for == 'article_tags') {
              var tags = [];
              if (Object.keys(data) && Object.keys(data).length) {
                Object.keys(data).map(d => {
                  tags.push({
                    name: d
                  });
                });
              }
              data = tags;
            }
            this.getSuggestions(group, keyword, data)
          }.bind(this)
        )
        .catch(function (ex) {
          console.log('parsing failed', ex);
        });
    }
  }
  cacheSuggestions(group, keyword, data) {
    if (this.caching) {
      this.cachedSuggestions[group] = this.cachedSuggestions[group] || {};
      this.cachedSuggestions[group][keyword] =
        this.cachedSuggestions[group][keyword] || {};
      this.cachedSuggestions[group][keyword] = data;
    }
  }
  isNoSuggestions() {
    var noSuggestions = true;
    Object.keys(this.groups).map(key => {
      if (this.options[key] && this.options[key].length > 0) {
        noSuggestions = false;
      }
    });

    return noSuggestions;
  }

  clearAllSuggestions() {
    // clear the options
    Object.keys(this.groups).map(key => {
      if (this.options[key]) {
        this.options[key] = [];
      }
    });

  }
  afterGetSuggestions(group, keyword, data, storeInCache) {
    // caching the suggestions
    if (storeInCache && this.caching) {
      this.cacheSuggestions(group, keyword, data);
    }
    this.options[group] = data;
    let newState = {
      options: Object.assign({}, this.options),
      hint: !this.isClicked && this.searchText.length > 1 ? this.getHint() : ''
    };
    if (
      !this.isClicked &&
      this.state.popup != 'show' &&
      !this.isNoSuggestions()
    ) {
      newState = {
        ...newState,
        ...{
          popup: 'show'
        }
      };
    } else if (this.state.popup == 'show' && this.isNoSuggestions()) {
      newState = {
        ...newState,
        ...{
          popup: 'hide'
        }
      };
    }
    this.setState(newState);
  }
  getHint() {
    var hint = '';
    var re = new RegExp('^' + this.searchText, 'i');
    var displayKey = '';

    Object.keys(this.props.groups).map(group => {
      displayKey = this.groups[group].displayKey;
      if (this.options[group]) {
        // searching from the begining
        for (var i = 0; i < this.options[group].length; i++) {
          if (this.options[group][i][displayKey].match(re)) {
            if (hint.length == 0) {
              hint =
                this.searchText +
                this.options[group][i][displayKey].substring(
                  this.searchText.length
                );
            }
          }
        }
      }
    });
    if (hint.length > 0) {
      hint = hint.replace('&#039;', "'");
    }
    return hint;
  }

  _isShow(category) {
    // DISTRICTS
    //console.log('Common_AutoSuggestion 540 category',category);
    //console.log('Common_AutoSuggestion 541 this.props.',this.props);
    if (category == 'Districts' && (this.props.district != undefined)) {
      return this.props.district
    }
    // HDB_TOWNS
    if (category == 'HDB Towns' && (this.props.hdbtowns != undefined)) {
      return this.props.hdbtowns
    }
    // NEW_LAUNCHES
    if (category == 'New Launches' && (this.props.newlaunches != undefined)) {
      return this.props.newlaunches
    }
    // AMENITIES
    if (category == 'Amenities' && (this.props.amenities != undefined)) {
      return this.props.amenities
    }
    // PROJECTS
    if (['LRTs', 'Schools', 'MRTs', 'Shopping Malls'].includes(category) && (this.props.projects != undefined)) {
      return this.props.projects
    }
    // PLACES
    if (category == 'place' && (this.props.place != undefined)) {
      return this.props.place
    }
    return true
  }

  render() {
    this._initItem();
    var getCategoryName = category => {
      if (category == 'p') return 'Project';
      if (category == 'j') return 'Street';
      if (category == 'a') return 'District';
      if (category == 'g') return 'Travel Time';
      else {
        return category;
      }
    };

    var getIcon = (data, category) => {
      //console.log('category',category);
      var getCategoryIcon = Object.values(data);
      if (category.t == 'p'){
          if (['i', 'l', 'r', 'c'].includes(category.ty)){
              return data.p[category.ty].icon;
          }else{
              return data.p.common.icon;
          }
      }
      if (['j', 'a', 'g'].includes(category.t))
        return data[category.t].icon;

    };

    var _renderText = (text, keyword) => {
      var tempChar = '';
      var arrChar = text.split('');
      return arrChar.map((char, index) => {
        tempChar = '';
        if (keyword.toLowerCase().includes(char.toLowerCase())) {
          tempChar = keyword.toLowerCase();
        }
        return (
          <Text
            allowFontScaling={false}
            key={index}
            style={{
              fontSize: 15,
              fontFamily:
                keyword.toLowerCase() == tempChar
                  ? 'Poppins-Bold'
                  : 'Poppins-Regular'
            }}
          >
            {char}
          </Text>
        );
      });
    };
    var renderItem = this.data.map((value, index) => (
      value.t!= 'New Launches'? //Temporary Hide New Launches Category
      <TouchableOpacity
        style={{ display: this._isShow(value.t) ? 'flex' : 'none' }}
        key={index}
        onPress={() => this.props.selectedData(value, index)}
      >
        <ScrollView
          keyboardShouldPersistTaps={"always"}
          keyboardDismissMode={"on-drag"}
          contentContainerStyle={{
            flexDirection: 'row',
            paddingVertical: 10,
            borderBottomColor: '#C8C7CC',
            borderBottomWidth: 1,
            borderStyle: 'solid'
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <Common_IconMenu
              imageSource={{
                uri: AUTO_SUGGESTION_ICONS.icon
              }}
              type={'icon'}
              imageHeight={35}
              imageWidth={30}
              paddingHorizontal={20}
            />
            <Text
              allowFontScaling={false}
              style={{ paddingTop: 10, width: '44%', color: value.t == 'MRTs' ? Object.values(AUTO_SUGGESTION_GROUPS)[3].optionsInfo.MRTs.color[value.s] : '#4a4a4a' }}
              ellipsizeMode={'tail'}
              numberOfLines={1}
            >
              {_renderText(value.name, this.props.keyword)}
            </Text>
            <Text
              allowFontScaling={false}
              style={[{
                fontFamily: 'Poppins-Regular',
                fontSize: 13,
                color: '#4a4a4a',
                fontWeight: '400',
                width: '25%',
                paddingLeft: 10,
                paddingTop: 12
              },
              this.props.textCategoryStyle]}>
              {getCategoryName(value.t)}
            </Text>
            <View style={{ paddingRight: 15, paddingLeft: 10, justifyContent: 'center' }}>
              <Common_IconMenu
                imageSource={this.rightArrow}
                type={'icon'}
                imageHeight={30}
                imageWidth={20}
              />
            </View>
          </View>
        </ScrollView>
      </TouchableOpacity>:null
    ));

    return <View>{renderItem}</View>;
  }
}
export default Common_AutoSuggestionGoogle;
