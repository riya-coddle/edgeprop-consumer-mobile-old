import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  Dimensions,
  ScrollView
} from 'react-native'
import ToggleButton from '../../components/Common_ToggleButton/Common_ToggleButton.js'
import StatusBarBackground from '../../components/Common_iOSStatusBar/Common_iOSStatusBar'
import IconMenu from '../../components/Common_IconMenu/Common_IconMenu.js'
import TransactionData from '../../components/Listing_TransactionData/Listing_TransactionData.js'
import Common_Button from '../../components/Common_Button/Common_Button';
import AsyncHelper from '../../components/Common_AsyncHelper/Common_AsyncHelper'

const HOSTNAME = "https://www.edgeprop.sg";
const API_DOMAIN = "https://www.edgeprop.sg";
const PROXY_URL = "/proxy?url=";
const API_GET_LISTING_TRANSACTIONS_SALE = HOSTNAME + PROXY_URL + encodeURIComponent(API_DOMAIN + "/index.php?option=com_mobile&task=tx&op=data&listing_type=sale&assetid=");
const API_GET_LISTING_TRANSACTIONS_RENT = HOSTNAME + PROXY_URL + encodeURIComponent(API_DOMAIN + "/index.php?option=com_mobile&task=tx&op=data&listing_type=rental&assetid=");
const TIMEOUT = 1000;

export default class ListingDetailData extends Component {
  navigation = {}
  params = {}
  asset_id = ""
  project_name = ""
  didMount = false
  isAPIReturn = false
  protools

  constructor(props) {
    super(props);
    this.navigation = props.navigation
    this.params = this.navigation.state.params
    var {height, width} = Dimensions.get('window')
    //console.log('fastAPI',props.screenProps.data.fastAPI)
    if(props.screenProps.data.fastAPI!=undefined && Object.keys(props.screenProps.data.fastAPI).length >0){
      this.asset_id = '11987';//props.screenProps.data.fastAPI.asset_id
      this.project_name = 'SIM LIM SQUARE';props.screenProps.data.fastAPI.project_name
    }
    this.screenWidth = width;
    this.screenHeight = height;
    this._callAPI = this._callAPI.bind(this);
    this.state = {
        transactionData: {},
    }
    this._getProtools = this._getProtools.bind(this)
  }

  _callAPI(apiUrl, category, stateName) {
      //console.log('url will be',apiUrl+this.asset_id)
      fetch(apiUrl+this.asset_id,
      {
          method: 'GET', timeout: TIMEOUT
      }).
      then((response) => response.json()).
      then((responseJson)=>{
          if(responseJson){
            if(this.didMount){
              this.setState({
                  [stateName]: {...this.state[stateName],...{[category]: responseJson.response}}
              });
            }
            this.isAPIReturn = true
          }
      })
      .catch((error)=>{
          console.error(error)
      })
  }

  componentWillReceiveProps(nextProps, nextState){
    console.log('componentWillReceiveProps')
    //if(nextProps.screenProps.data.fastAPI.asset_id != undefined && nextProps.screenProps.data.fastAPI.asset_id != this.props.screenProps.data.fastAPI.asset_id){
      //if(nextProps.screenProps.data.fastAPI.asset_id.length>0){
        this.asset_id = '11987';//nextProps.screenProps.data.fastAPI.asset_id;
        this.project_name = 'SIM LIM SQUARE';//nextProps.screenProps.data.fastAPI.project_name
        this._callAPI(API_GET_LISTING_TRANSACTIONS_SALE, "sale", "transactionData")
        this._callAPI(API_GET_LISTING_TRANSACTIONS_RENT, "rent", "transactionData")
      //}
    //}
  }

  componentDidMount() {
    //console.log('componentDidMount')
    this.asset_id = '11987';
    this._getProtools()
    this.didMount = true
    //console.log('asset_id',this.asset_id);
    //console.log('asset_id length',this.asset_id.length);
    //console.log('API_GET_LISTING_TRANSACTIONS_SALE',API_GET_LISTING_TRANSACTIONS_SALE)
    //console.log('API_GET_LISTING_TRANSACTIONS_RENT',API_GET_LISTING_TRANSACTIONS_RENT)
    if(this.asset_id.length > 0){
      this._callAPI(API_GET_LISTING_TRANSACTIONS_SALE, "sale", "transactionData")
      this._callAPI(API_GET_LISTING_TRANSACTIONS_RENT, "rent", "transactionData")
    }
  }
  _getProtools(){
    this.refs.asyncHelper._getData("PROTOOLS", (value)=>{
       this.protools = value
    })
  }

  componentWillUnmount() {
    this.didMount = false
  }

  componentDidUpdate(prevProps, prevState) {
  }


  render() {
    return (
      <ScrollView contentContainerStyle={{
          paddingTop: 17,
          paddingBottom: 60
      }}>
            <AsyncHelper ref={"asyncHelper"}/>
            <View style ={{
                width: this.screenWidth,
                height: 55,
                backgroundColor: '#f5f5f5',
                paddingLeft: 12,
                // alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: "#e7e7e7"
            }}>
                <Text allowFontScaling={false} style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 15,
                    color: '#4a4a4a'
                }}>
                    Historical Price & Transaction
                </Text>
            </View>

            <TransactionData
                type={"chart"}
                projectName={this.project_name}
                transactionData={this.state.transactionData}
                screenWidth={this.screenWidth}
                screenHeight={this.screenHeight}
                isAPIReturn ={this.isAPIReturn}
            />

            <TransactionData
                type={"table"}
                projectName={this.project_name}
                transactionData={this.state.transactionData}
                screenWidth={this.screenWidth}
                screenHeight={this.screenHeight}
                isAPIReturn ={this.isAPIReturn}
                isProtools = {this.protools}
            />
        </ScrollView>
    )
  }
}
