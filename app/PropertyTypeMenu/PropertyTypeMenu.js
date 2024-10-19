import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Dimensions
} from 'react-native';
import StatusBarBackground from '../../components/Common_iOSStatusBar/Common_iOSStatusBar';
import Common_MenuList from '../../components/Common_MenuList/Common_MenuList';
import dataMenu from '../../assets/json/PropertyType.json';
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js';

//import DistrictOptions from '../../assets/json/DistrictOptions.json';
//import HDBTownOptions from '../../assets/json/HDBTownOptions.json';
import PropertyTypeOptions from '../../assets/json/Search_Data/PropertyTypeOptions.json';

const screenWidth = Dimensions.get('window').width;

const APARTMENTCONDO_KEY = 1
const HDB_KEY = 2
const LANDED_KEY = 3
const COMMERCIAL_KEY = 4
const INDUSTRIAL_KEY = 5

export default class PropertySearchMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.key = '';
    this._onPressItem = this._onPressItem.bind(this);
    this.navigation = props.navigation;
    this._handleData = this._handleData.bind(this);
    this.navigation.setParams({
      _handlerOnPress: this._handlerOnPressSearch
    });
  }
  static navigationOptions = ({ navigation }) => {
    const { state, setParams } = navigation;
    var { params } = state;
    var keyword = '';
    return {
      title: (
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 16,
            fontFamily: 'Poppins-SemiBold',
            color: 'rgb(255,255,255)',
            textAlign: 'center'
          }}
        >
          PROPERTY TYPE
        </Text>
      )
    };
  };
  _handleData(result, optionType) {
    this.props.navigation.state.params.handlerData(result, optionType, this.key)
    // console.log('HANDLE RESULT PROPERTY TYPE', this.handleData);
  }
  _onPressItem(item, screen, params) {
      console.log('item',item);
      console.log('params',params);
    if (screen != undefined) {
      //check if next screen is same as current screen
      console.log('goBackKey prop',this.props.navigation.state.key)
      if (item == 'Apartment/Condo') {
        this.key = APARTMENTCONDO_KEY;
        this.refs.navigationHelper._navigateInMenu(screen, {
          existingData: (this.props.navigation.state.params.key && this.props.navigation.state.params.key===1) ? this.props.navigation.state.params.existingData : [],
          //isSelectAll: this.props.navigation.state.params.isSelectAll,
          optionType: this.props.navigation.state.params.optionType,
          data: PropertyTypeOptions[1].sub.map(data => data),
          handlerData: this._handleData,
          goBackKey: this.props.navigation.state.key,
          checkBox: false,
        });
      } else if (item == 'Landed') {
        this.key = LANDED_KEY;
        this.refs.navigationHelper._navigateInMenu(screen, {
          existingData: (this.props.navigation.state.params.key && this.props.navigation.state.params.key===3) ? this.props.navigation.state.params.existingData : [],
          //isSelectAll: this.props.navigation.state.params.isSelectAll,
          optionType: this.props.navigation.state.params.optionType,
          data: PropertyTypeOptions[3].sub.map(data => data),
          handlerData: this._handleData,
          goBackKey: this.props.navigation.state.key,
          checkBox: false,
        });
      } else if (item == 'HDB') {
        this.key = HDB_KEY;
        this.refs.navigationHelper._navigateInMenu(screen, {
          existingData: (this.props.navigation.state.params.key && this.props.navigation.state.params.key===2) ? this.props.navigation.state.params.existingData : [],
          //isSelectAll: this.props.navigation.state.params.isSelectAll,
          optionType: this.props.navigation.state.params.optionType,
          data: PropertyTypeOptions[2].sub.map(data => data),
          handlerData: this._handleData,
          goBackKey: this.props.navigation.state.key,
          checkBox: false,
        });

      } else if (item == 'Commercial') {
        this.key = COMMERCIAL_KEY;
        this.refs.navigationHelper._navigateInMenu(screen, {
          existingData: (this.props.navigation.state.params.key && this.props.navigation.state.params.key===4) ? this.props.navigation.state.params.existingData : [],
          //isSelectAll: this.props.navigation.state.params.isSelectAll,
          optionType: this.props.navigation.state.params.optionType,
          data: PropertyTypeOptions[4].sub.map(data => data),
          handlerData: this._handleData,
          goBackKey: this.props.navigation.state.key,
          checkBox: false,
        });
      }
      else if (item == 'Industrial') {
        this.key = INDUSTRIAL_KEY;
        this.refs.navigationHelper._navigateInMenu(screen, {
          existingData: (this.props.navigation.state.params.key && this.props.navigation.state.params.key===5) ? this.props.navigation.state.params.existingData : [],
          //isSelectAll: this.props.navigation.state.params.isSelectAll,
          optionType: this.props.navigation.state.params.optionType,
          data: PropertyTypeOptions[5].sub.map(data => data),
          handlerData: this._handleData,
          goBackKey: this.props.navigation.state.key,
          checkBox: false,
        });
      }
      else {
        this.refs.navigationHelper._navigateInMenu(screen, {
          //isSelectAll: this.props.navigation.state.params.isSelectAll,
          optionType: this.props.navigation.state.params.optionType,
          data: params,
          handlerData: this._handleData,
          goBackKey: this.props.navigation.state.key,
          checkBox: false,
        });
      }
    } else {
      this.props.navigation.state.params.handlerData(result, this.props.navigation.state.params.optionType);
      this.props.navigation.goBack();
    }
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <NavigationHelper
          ref={'navigationHelper'}
          navigation={this.props.navigation}
        />
        <Common_MenuList data={dataMenu} onPressItem={this._onPressItem} />
      </View>
    );
  }
}
