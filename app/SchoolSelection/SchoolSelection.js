import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  ScrollView,
  Modal,
  Dimensions
} from 'react-native';
import firebase from 'react-native-firebase';
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js';
import Common_Button from '../../components/Common_Button/Common_Button.js';
import Common_SelectionList from '../../components/Common_SelectionList/Common_SelectionList';
import IconMenu from '../../components/Common_IconMenu/Common_IconMenu';
import SchoolData from '../../assets/json/SchoolData';

result = [];
export default class SchoolSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelectAll: false
    };
    this.tempResult = [];
    this.tempData = [];
    this.navigation = props.navigation;
    this._handleOnPressSearch = this._handleOnPressSearch.bind(this);
    //this._selectionHandler = this._selectionHandler.bind(this)
    this._selectionHandlerToAll = this._selectionHandlerToAll.bind(this);
  }
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'SCHOOLS',
      headerRight: (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingVertical: 5,
            paddingHorizontal: 10
          }}
        >
          <View style={{ paddingRight: 10 }}>
            <IconMenu
              borderRadius={2}
              paddingVertical={2}
              paddingHorizontal={8}
              type={'text'}
              textValue={'None'}
              backgroundColor={'#4a6e8f'}
              fontFamily={'Poppins-Regular'}
              textSize={15}
              textColor={'#fff'}
              onPress={() => navigation.state.params.selectionHandler(false)}
            />
          </View>
          <IconMenu
            borderRadius={2}
            paddingVertical={2}
            paddingHorizontal={14}
            type={'text'}
            textValue={'All'}
            backgroundColor={'#4a6e8f'}
            fontFamily={'Poppins-Regular'}
            textSize={15}
            textColor={'#fff'}
            onPress={() => navigation.state.params.selectionHandler(true)}
          />
        </View>
      )
    };
  };

  _handleOnPressSearch() {
    //result = [...result, ...this.tempResult];
    result  = this.sortArrObjs(this.tempResult);
    if(result.length<=50){
      this.props.navigation.state.params.handlerData(result)
      this.refs.navigationHelper._navigate('ListingResult', {
        data: result,
        distance: this.props.navigation.state.params.data.DistanceOptionResult,
        title: this.props.navigation.state.params.title
      });
      result=[]

      if(result.length > 0){
          result.map((item, index) => {
             firebase.analytics().logEvent('Search_School', { Name: item.name });
          })
      }
    }
    else{
      Alert.alert("Maximum 50 selection is allowed")
    }
    // this.props.navigation.goBack(this.props.navigation.state.params.goBackKey);
    // result = [];
  }

  componentDidMount() {
    this.props.navigation.setParams({
      selectionHandler: this._selectionHandlerToAll
    });
  }
  _selectionHandlerToAll(value) {
    var resultHandler = handler => {
      return this.tempData.map(item => {
          if (handler == true && !this.tempResult.includes(item)) {
            this.tempResult.push(item);
          } else if (handler == false) {
            this.tempResult = [];
            //result.splice(result.indexOf(item.name), 1);
          }
      });
    };
    if (value == true) {
      this.setState({
        isSelectAll: true
      });
      resultHandler(true);
    } else if (value == false) {
      this.setState({
        isSelectAll: false
      });
      resultHandler(false);
    }
  }
  sortArrObjs = (arrObjs) => {
    let compare = (a, b) => {
        return a.index-b.index
    }
    return arrObjs.sort(compare)
  }
  render() {
    _this = this;
    console.log(this.navigation.state.params.data);
    var type = this.navigation.state.params.data.SchoolTypeOptionsResult;
    var cutOff = this.navigation.state.params.data.CutOffPointOptionsResult;
    if (this.navigation.state.params.data.EducationOptionsResult == 'Primary') {
      console.log('primary');
      var schooldata = SchoolData.filter(
        criteria => criteria.level == 'Primary'
      )[0].schools;
      var tempDataPrimary = [];
      schooldata.map(function(item) {
        if (type.indexOf(item.genderType) > -1) {
          tempDataPrimary.push(item);
        } else if (type.indexOf(item.type) > -1) {
          tempDataPrimary.push(item);
        }
        _this.tempData = tempDataPrimary;
      });
    } else {
      console.log('secondary');
      var schooldata = SchoolData.filter(
        criteria => criteria.level == 'Secondary'
      )[0].schools;
      var temp = [];
      var tempDataSecondary = [];

      schooldata.map(function(item) {
        if (type.indexOf(item.genderType) > -1) {
          temp.push(item);
        } else if (type.indexOf(item.type) > -1) {
          temp.push(item);
        }
      });
      if (cutOff == 'All') {
        tempDataSecondary = temp;
      } else if (cutOff == 'Others') {
        tempDataSecondary = temp.filter(criteria => criteria.cutoff == '');
      } else if (cutOff == '<200') {
        tempDataSecondary = temp.filter(criteria => criteria.cutoff < 200);
      } else if (cutOff == '200-225') {
        tempDataSecondary = temp.filter(
          criteria => 200 <= criteria.cutoff <= 225
        );
      } else if (cutOff == '226-250') {
        tempDataSecondary = temp.filter(
          criteria => 226 <= criteria.cutoff <= 250
        );
      } else if (cutOff == '>250') {
        tempDataSecondary = temp.filter(criteria => criteria.cutoff > 250);
      }
      _this.tempData = tempDataSecondary;
    }

    return (
      <View style={{ flex: 1 }}>
      <NavigationHelper
        ref={'navigationHelper'}
        navigation={this.props.navigation}
      />
        <ScrollView>
          <View>
            {_this.tempData.length < 1 ? (
              <Text>No school found</Text>
            ) : (
              <Common_SelectionList
                data={_this.tempData}
                triggerSelection={this.state.isSelectAll}
                borderLeftWidth={0}
                checkBox={true}
                onPress={(isSelected, name) => {
                  if (isSelected != false) {
                    this.tempResult.push(name);
                  } else if(isSelected !=true){
                    this.tempResult.splice(this.tempResult.indexOf(name), 1);
                  }
                }}
              />
            )}
          </View>
        </ScrollView>
        <View>
          <Common_Button
            borderRadius={1}
            textValue={'SEARCH'}
            textSize={16}
            onPress={this._handleOnPressSearch}
          />
        </View>
      </View>
    );
  }
}
