import React, { Component } from 'react';
import {HeaderBackButton} from 'react-navigation';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import Common_SelectionList from '../../components/Common_SelectionList/Common_SelectionList';
import Common_IconMenu from '../../components/Common_IconMenu/Common_IconMenu';
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js';
import firebase from 'react-native-firebase';
var clearIcon = require('../../assets/icons/Close-white.png');

class CommonSelection extends Component {
  static navigationOptions = ({ navigation }) => {
    var { state, setParams } = navigation;
    var { params } = state;
    // console.log('ROUTE TO SCREEN', navigation.state.routeName);
    var isDoneVisible = params.checkBox == undefined ? true : params.checkBox;
    var sortArrObjs = (arrObjs) => {
      let compare = (a, b) => {
          return a.index-b.index
      }
      return arrObjs.sort(compare)
    }
    return {
          header:(
            <View style={{ padding: 10 }}>
              <View style={
                  {
                      flexDirection: 'row',
                      backgroundColor: "#FFF",
                      height: 75,
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
                        fontFamily: 'Poppins-SemiBold',
                        color: '#414141',
                        textAlign: 'center',
                    }}>
                    {''}
                    </Text>
                    <View style={{ position:'absolute', right:0 }}>
                    <TouchableOpacity
                      style={{ display: isDoneVisible ? 'flex' : 'none' }}
                      onPress={() => {
                        if (navigation.state.params.isNavigateToListingResult == true) {
                          result = sortArrObjs(params.tempResult());
                          if(result.length > 0){
                            navigation.state.params.handlerData(result);
                            navigation.state.params.handleDone(result);
                          } else{Alert.alert("Please choose District(s)")}
                          //result = [];
                        } else {
                          //console.log('case 212');
                          //console.log('params new',params);
                          result = sortArrObjs(params.tempResult());
                          //console.log('result',result);
                          if(result.length<=50){
                            navigation.state.params.handlerData(result, params.optionType);
                            navigation.goBack(navigation.state.params.goBackKey);
                            result = [];
                          }
                          else{Alert.alert("Maximum 50 selection is allowed")}
                        }
                      }}>
                      <Text allowFontScaling={false} style={styles.title}>Done</Text>
                    </TouchableOpacity>
                    </View>
              </View>
            </View>
          )
    };
  };
  constructor(props) {
    super(props);
    this.tempResult = this._getTempResult();
    this._handleDataSelection = this._handleDataSelection.bind(this);
    this._handleDonePress = this._handleDonePress.bind(this);
    this.props.navigation.setParams({
      handleDone: this._handleDonePress
    });
  }
  _handleDonePress(result) {
   if(this.props.navigation.state.params.title == 'DISTRICTS'){
       if(result.length > 0){
           result.map((item, index) => {
              firebase.analytics().logEvent('Search_District', { Name: item.value });
           })
       }
   }
   else if(this.props.navigation.state.params.title == 'HDB TOWNS'){
       if(result.length > 0){
           result.map((item, index) => {
              firebase.analytics().logEvent('Search_HDBTowns', { Name: item.value });
           })
       }
   } else if(this.props.navigation.state.params.title == 'area'){
      result.listing_type   = this.props.navigation.state.params.propertyType
      result.from     = 'home'
    }
   this.refs.navigationHelper._navigate('ExploreLanding', {
       district: this.props.navigation.state.params.title == 'DISTRICTS' ? {district:result,state:this.props.navigation.state.params.key,t:'Districts'} : this.props.navigation.state.params.title == 'HDB TOWNS' ? {district:result, property_type: { label: 'HDB', key: 2, idList: ['14', '15', '16', '17', '18', '19', '20'] }} : result,
       title: this.props.navigation.state.params.title,
       isCheckBox: this.props.navigation.state.params.title == 'area'?true:false,
       state: this.props.navigation.state.params.key?this.props.navigation.state.params.key:'',
       //fromSearch: true 
   })
  }
  _getTempResult() {
    var navigation = this.props.navigation;
    var { state } = navigation;
    var { params } = state;

    //if(params.existingData){
    if (params.existingData && params.existingData.length > 0) {
      var filterData = this.filterPropertyTypeData(
        params.existingData,
        params.data
      );
      //console.log('filterData',filterData.length);
      //console.log('params.optionType',params.optionType);
      if (!filterData.length > 0 && (params.optionType !='state' && params.optionType !='district')) {
        //console.log('get temp result filterdata not empty');
        return params.data;
      } else {
        //console.log('params.existingData');
        return params.existingData;
      }
    } else if (params.isSelectAll) {

      return params.data;
    } else {
      return [];
    }
}
  _getData(item) {
    var temp = [];
    var result = [];
    if(item){
      for (i = 0; i < item.length; i++) {
        result.push(item[i]);
      }  
    }
    
    return result;
  }
  componentDidMount() {
    this.props.navigation.setParams({
      tempResult: this._handleDataSelection
    });
  }
  _handleDataSelection() {
    //console.log('this is tempresult _handleDataSelection');
    return this.tempResult;
  }
  _getMarginVerticalCheckBox() {
    if (this.props.navigation.state.marginVerticalCheckBox) {
      return this.props.navigation.state.marginVerticalCheckBox;
    } else {
      return 0;
    }
  }
  filterPropertyTypeData(arr1, arr2) {
    if (arr1.length > 0 && arr2.length > 0) {
      newArr2 = arr2.map(obj => obj.id);
      return arr1.filter(obj => newArr2.includes(obj.id));
    }
  }
  render() {
// console.log('EXISTING DATA', this.props.navigation.state.params.existingData);
    let navigation = this.props.navigation;
    let params = navigation.state.params;
    let data = params.data;
    let customSelection = params.customSelection
    let customSelectionVal = params.checkBox ? [] : {}
    let checkBox = params.checkBox == undefined ? true : params.checkBox;
    var renderSelectionList = () => {
      return (
        <Common_SelectionList
          customSelection={customSelection}
          onPressCustomSelection={() => {
              //console.log('onPressCustomSelection');
              params.handlerData(customSelectionVal, params.optionType);
              navigation.goBack();
          }}
          existingData={params.existingData}
          triggerSelection={params.isSelectAll}
          data={this._getData(data)}
          checkBox={checkBox}
          marginVerticalCheckBox={this._getMarginVerticalCheckBox()}
          onPress={(isSelected, result, index) => {
            if (checkBox) {
              if (isSelected != false) {
                this.tempResult.push({index: index, ...result});
              } else {
                // this.tempResult.splice(this.tempResult.indexOf({index: index, ...result}), 1);
                this.tempResult = this.tempResult.filter((obj) => obj.id != result.id)
              }
              //console.log('onPress common selection',this.tempResult);
            } else {
              //console.log('onPress common selction',navigation.state.params.goBackKey);
              params.handlerData(result, params.optionType);
              if(navigation.state.params.goBackKey){
                navigation.goBack(navigation.state.params.goBackKey);
              }else{
                navigation.goBack();
              }

            }
          }}
        />
      );
    };
    return (
       <View>
           <NavigationHelper
             ref={'navigationHelper'}
             navigation={this.props.navigation}
           />
            {renderSelectionList()}
       </View>
   );
  }
}
export default CommonSelection;
const styles = StyleSheet.create({
  title: {
    fontFamily: 'Poppins-SemiBold',
    color: '#414141',
    fontSize: 15,
    fontWeight: 'Bold',
    // lineHeight: 25,
    fontWeight: '400',
    paddingRight: 20,
    textAlign: 'right',
    justifyContent: 'space-between',
    alignItems: 'center',
    //  margin: 12
  }
});
