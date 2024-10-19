import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Map,
  Image
} from 'react-native';
import firebase from 'react-native-firebase';
import { TabNavigator, StackNavigator, TabBarTop, HeaderBackButton } from 'react-navigation';
import ListingDetailTabNavigator from '../components/Common_TabNavigator/Common_TabNavigator.js';
import NavigationHelper from '../components/Common_NavigationHelper/Common_NavigationHelper.js';
import Common_IconMenu from '../components/Common_IconMenu/Common_IconMenu.js';
import MRTData from '../assets/json/MRTData.json';
import ListingDetailInfo from './ListingDetailInfo/ListingDetailInfo';
import Button from '../components/Common_Button/Common_Button';
import ListingDetailData from './ListingDetailData/ListingDetailData';
import MRTSelection from './MRTSelection/MRTSelection';

var clearIcon = require('../assets/icons/Close-white.png');

function _getCategories(item) {
  var temp = {};
  for (i = 0; i < item.length; i++) {
    temp[item[i].line_name + '(' +item[i].line_code + ')'] = { screen: MRTSelection }; //navigationOptions: { title: item[i].title } }
  }
  return temp;
}
tabScreens = _getCategories(MRTData);

const TabNav = TabNavigator(tabScreens, {
  tabBarPosition: 'top',
  tabBarComponent: TabBarTop,
  swipeEnabled: true,
  animationEnabled: true,
  lazy: true,
  tabBarOptions: {
    scrollEnabled: true,
    allowFontScaling: false,
    style: {
      backgroundColor: '#fff'
    },
    labelStyle: {
      fontFamily: 'Poppins-Regular',
      color: 'black',
      fontSize: 14,
      fontWeight: '400'
    },
    indicatorStyle: {
      borderBottomColor: '#ff5222',
      borderBottomWidth: 4
    }
  }
});

class MRTSelectionNav extends Component {
  static navigationOptions = ({ navigation }) => {
    var { state, setParams } = navigation;
    var { params } = state;
    return {      
      headerStyle: {
        backgroundColor: '#FFF',
      },
      headerLeft:(
        <View style={{ padding: 10 }}>
          <View style={
              {
                  flexDirection: 'row',
                  backgroundColor: "#FFF",
                  // marginBottom: 6,
                  height: 50,
                  alignItems: 'center'
              }}>              
              {navigation.goBack!=undefined?
                <HeaderBackButton
                  tintColor={"#414141"}
                  onPress={() => {navigation.goBack()}}
                />:<View/>
              }
              <Text
                allowFontScaling={false} 
                style={{
                  fontSize: 16,
                  fontWeight: '400',
                  fontFamily: 'Poppins-Medium',
                  color: '#414141',
                  textAlign: 'center'
                }}
              >
                Select MRT/LRT
              </Text>
          </View>
        </View>
      ),
      headerRight: (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-end',
            paddingRight: 9
          }}
        >
          <TouchableOpacity
            onPress={() => {
            if(result.length<=50){
              navigation.state.params.handlerData(result);
              navigation.state.params.handleDone(result)
            }
            else{Alert.alert("Maximum 50 selection is allowed")}
            }}
          >
            <Text allowFontScaling={false} style={styles.title}>Done</Text>
          </TouchableOpacity>
        </View>
      ),
    };
  };

  constructor(props) {
    super(props);
    //console.log('MRTSelectionNav');
    this.state = {};
    this._handleDonePress = this._handleDonePress.bind(this)
    this.props.navigation.setParams({
        handleDone: this._handleDonePress
    });
  }
  _handleDonePress(result) {
     //console.log('result',result);
     if(result.length > 0){
         result.map((item, index) => {
            firebase.analytics().logEvent('Search_MRT', { Name: item.name });
         })

         result.t = 'metro'
        //  this.refs.navigationHelper._navigate('ExploreLanding', {
        //      data: result,
        //      title: this.props.navigation.state.params.title,
        // })
        result.listing_type   = this.props.navigation.state.params.propertyType
        result.from     = 'home'
        //console.log('propertyType', this.props.navigation.state.params.propertyType)
        console.log('result from app', this.props.navigation.state.params.title)
        this.props.navigation.navigate('ExploreLanding', {
             data: result,
             title: this.props.navigation.state.params.title,
        })
     }else{
        Alert.alert("Select atleast one station")
     }
     
 }

  render() {
      return (
         <View style={{ flex: 1 }}>
             <NavigationHelper
               ref={'navigationHelper'}
               navigation={this.props.navigation}
             />
             <TabNav />
         </View>
     );
  }
}
export default MRTSelectionNav;
const styles = StyleSheet.create({
  title: {
    fontFamily: 'Poppins-Medium',
    color: 'black',
    fontSize: 15,
    // lineHeight: 25,
    fontWeight: '400',
    textAlign: 'right',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 12
  }
});
