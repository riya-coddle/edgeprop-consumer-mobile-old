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
  Dimensions,
  PixelRatio,
  TouchableOpacity,
  AsyncStorage,
  PermissionsAndroid,
  Keyboard
} from 'react-native';
import firebase from 'react-native-firebase';
import appsFlyer from 'react-native-appsflyer';
import {HeaderBackButton} from 'react-navigation'
import StatusBarBackground from '../../components/Common_iOSStatusBar/Common_iOSStatusBar';
import HeaderSearch from '../../components/Common_HeaderSearch/Common_HeaderSearch';
import Home_List from '../../components/Home_List/Home_List';
import LandingHighlight from '../../components/Common_LandingHighlight/Common_LandingHighlight.js';
import Common_IconMenu from '../../components/Common_IconMenu/Common_IconMenu.js';
import Common_MenuList from '../../components/Common_MenuList/Common_MenuList';
import dataMenu from '../../assets/json/menuSearch.json';
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js';
import DistrictOptions from '../../assets/json/DistrictOptions.json';
import HDBTownOptions from '../../assets/json/HDBTownOptions.json';
import Common_AutoSuggestion from '../../components/Common_AutoSuggestion/Common_AutoSuggestion'
import styles from './PropertySearchStyle.js'

const screenWidth = Dimensions.get('window').width;
var icon = require('../../assets/icons/menu_more.png');
var menu_icon = require('../../assets/icons/menu.png');
var rightArrow = require('../../assets/icons/Right-arrow.png');
const API_SAVED_SEARCH = "https://alice.edgeprop.my/api/user/v1/get-saved-search";

export async function request_device_location_runtime_permission() {
 
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'Location Permission',
        'message': 'Edgeprop needs access to your location '
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
 
      //Alert.alert("Location Permission Granted.");
    }
    else {
 
      Alert.alert("Location Permission Not Granted");
 
    }
  } catch (err) {
    console.warn(err)
  }
}

export default class PropertySearchMenu extends Component {
  handleData = [];
  constructor(props) {
    super(props);
    this.state = {
      savedSearches: [],
      userInfo: {},
      keyword: '',
      onEmpty:  false,
      hasText: false,
      hintText : this.props.navigation.state.params.data?this.props.navigation.state.params.data.hintText:'Enter a place, address or location',
      proprtyType: this.props.navigation.state.params.data?this.props.navigation.state.params.data.proprtyType? this.props.navigation.state.params.data.proprtyType: 'Buy' :'Buy',
      position: {}
    };
    this._onPressItem = this._onPressItem.bind(this);
    this._onPressCurrentLocation = this._onPressCurrentLocation.bind(this);
    this._handlerOnPressSearch = this._handlerOnPressSearch.bind(this);
    this.navigation = props.navigation;
    this._handleData = this._handleData.bind(this);
    this._getSavedSearches = this._getSavedSearches.bind(this)
    this._getType = this._getType.bind(this)
    this.mySavedSearch = this.mySavedSearch.bind(this)
    this._onBackPress = this._onBackPress.bind(this)
    this._handleQueryChange = this._handleQueryChange.bind(this)
    this._setParamBySuggestionValue = this._setParamBySuggestionValue.bind(this)
    this._getpropertyTypeInfo = this._getpropertyTypeInfo.bind(this)
    this._handleAutoCompleteClick = this._handleAutoCompleteClick.bind(this)
    this._searchResult = this._searchResult.bind(this)
    this._typeFormat = this._typeFormat.bind(this)
    this.refresh = this.refresh.bind()
    this.navigation.setParams({
      _handleTextChange: this._handleQueryChange,
      _handleBackPress: this._onBackPress,
      onGoBack: this.refresh
    })
  }

  static navigationOptions = ({ navigation }) => {
    const { state, setParams } = navigation;
    var { params } = state;
    var keyword =  ""
    var _handleChangeKeyword = (text) => {
      keyword = text
    }
    //console.log('paramSuggestion', params)
    return {
      header:(
        <View style={{ padding: 10, backgroundColor: '#FFF'}}>
          <StatusBarBackground lightContent={true} style={{ backgroundColor: '#FFF' }} />
          <View style={
              {
                  flexDirection: 'row',
                  backgroundColor: "#FFF",
                  // marginBottom: 6,
                  //height: 75,
                  alignItems: 'center'
              }}>
              {navigation.goBack!=undefined?
                <HeaderBackButton
                  tintColor={"#414141"}
                  onPress={() => {params._handleBackPress()}}
                />:<View/>
              }
              <View style={
                  {
                      flex: 1,
                      paddingRight: 10,
                      shadowColor: '#e4e1e1',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 1,
                      shadowRadius: 10,
                      elevation: 4,

                  }}>
                  <HeaderSearch
                      // hintText={'Enter Project, Street Name or Address'}
                      hintText={'Enter Project, Street Name or Address'}
                      editable={true}
                      defaultText={params.data.hintText?params.data.hintText:''}
                      fontSize={15}
                      fontFamily={'Poppins-Regular'}
                      height={45}
                      needsEdit={true}
                      textInputColor={'rgb(249,249,249)'}
                      showIconSearch={true}
                      onChangeText={params._handleTextChange}
                  />
              </View>
          </View>
        </View>
      )
    };
  };

  _onBackPress() {
    let navigation = this.props.navigation;
      navigation.goBack()
    if(navigation.state.params.onGoHome){
      if(this.state.userInfo.uid != 0) {
        navigation.state.params.onGoHome()
      } else {
        navigation.goBack()
      }
    }
    /*this.refs.navigationHelper._navigateInMenu("ExploreLanding", {
         data: {}
       })*/
  }

  _handleQueryChange(val, result, hasText) {
   // console.log(val, result, hasText);
    if(result.length == 0 && val && hasText) {
      //console.log('ddd', val, result);
      this.setState({ onEmpty: true, keyword: val, hasText })
    } else {
      this.setState({ result, keyword: val, onEmpty: false, hasText })  
    }
    
  }

  async componentDidMount() {
    const auth = await AsyncStorage.getItem("authUser");
      if(auth && auth != '') {
        let authItems = JSON.parse(auth);
        if(authItems.status == 1) {
          this.setState({ userInfo: authItems },()=>this._getSavedSearches())
        }  
      }

    if(Platform.OS === 'android')
    {
 
      await request_device_location_runtime_permission();
 
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        let data = [];
        data['poi_lat']  = position.coords? position.coords.latitude: ''
        data['poi_lon']  = position.coords? position.coords.longitude: ''
        data['listing_type']   = this.state.proprtyType? this.state.proprtyType: 'sale'
        data['from']     = 'home'
        this.setState({
          position: position
        })
      },
      error => {
        Alert.alert(error.message)
      },
      { enableHighAccuracy: false, timeout: 30000 }
    );
  }

  _handleAutoCompleteClick(val, index) {
   // console.log('hello!', val, index);
    let data = [];
    data['asset_id']  = val.id?val.id:''
    data['lat']       = val.latitude?val.latitude:''
    data['lng']       = val.longitude?val.longitude:''
    data['state']     = val.state?val.state:''
    data['district']  = val.area?val.area:''
    data['keyword']   = val.n?val.n:(val.name?val.name:this.state.keyword)
    data['title']     = 'searchoption'
    data['listing_type']   = this.state.proprtyType? this.state.proprtyType: 'sale'
    data['from']     = 'home'
    data['t']        = 'location'

    this.props.navigation.navigate('ExploreLanding', {
        title: 'searchoption',
        data: data
    });

  }

  mySavedSearch() {
      this.refs.navigationHelper._navigateInMenu("MySavedSearch", {
        data: this.state.userInfo,
        onGoBack: this.refresh
       })
    }

    refresh = (item) => {
      console.log("bccvcbcvbc");
      this._getSavedSearches();
    }

  _getType(id) {
      let propertyType = [
        {
            "label": "All Types",
            "value": ""
        },
        {
            "label": "Residential",
            "value": "rl"
        },
        {
            "label": "Residential (landed only)",
            "value": "l-36"
        },
        {
            "label": "Residential (non landed only)",
            "value": "r-33"
        },
        {
            "label": "Commercial",
            "value": "c-60"
        },
        {
            "label": "Industrial",
            "value": "i-70"
        },
      ];

      var result = propertyType.map((item, i) => {
        if (item.value == id) {
          //console.log(item.label)
          return item.label;
        } 
      });
      //console.log('res123', result)
      result = result.filter(function( element ) {
         return element !== undefined  ;
      });
      //console.log('res', result)
      if (result != undefined) {
        return result;
      } else {
        return "";
      }
    }

    _formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }

    _formatMoney(val) {
        return val ? 'RM ' + this._formatNumber(val) : '-'
    }

  _getSavedSearches() {

    fetch(API_SAVED_SEARCH, {
          method: 'POST',
          headers: new Headers({
                   'Accept' : 'application/json',
                   'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
          }),
          body: "uid="+this.state.userInfo.uid // <-- Post parameters        })
        }).then((response) => response.json())
          .then((responseText) => {
            let dataArray = [];
            if (responseText.status != undefined && responseText.status == 1) {
              for (i=0 ; i < responseText.data.length; i++) {
                dataArray[i] = responseText.data[i];
                if (i == 2) {
                  break;
                }
              }
              this.setState({ savedSearches: dataArray });
            } else {
              this.setState({ savedSearches: [] })
            }
          })
        .catch((error) => {
            console.error(error);
        });

  }

  _handlerOnPressSearch() {
    this.refs.navigationHelper._navigate('SearchOption', {
        data: ''
    })
  }
  
  _handleData(params) {
    this.handleData = [...params];
    //console.log('HANDLE RESULT', this.handleData);
  }

  _handleDistrictData(params, optionType, state) {
      //console.log('data',params)
      //console.log('optionType',optionType);
      //console.log('state',state);
      let values = [] ;
      values.push([...params])
      values.push({['state']: state});
      console.log(values);
    this.handleData = [values];
    console.log('HANDLE RESULT', this.handleData);
  }
  _dataWrapper(item){
    let temp = []
    for (i = 0; i < item.length; i++) {
      temp = [...temp, ...item[i].items.map(data => data)];
    }
    return temp
  }
  _onPressItem(item, screen, params) {
    if (screen != undefined) {
      //check if next screen is same as current screen
      if (item == 'Search by Area') {
        //console.log('screen',screen);
        /*this.refs.navigationHelper._navigateInMenu(screen, {
          title: "DISTRICTS",
          data: this._dataWrapper(DistrictOptions),
          handlerData: this._handleData,
          marginVerticalCheckBox: 15,
          isNavigateToListingResult: true,
      });*/

        this.refs.navigationHelper._navigateInMenu('StateMenu', {
            optionType: 'state',
            existingData: [],
            key: 'Kuala Lumpur',
            isSelectAll: false,
            isRetrieveSelection: true,
            title: "area",
            data: this._dataWrapper(DistrictOptions),
            handlerData: this._handleDistrictData,
            marginVerticalCheckBox: 15,
            isNavigateToListingResult: true,
            propertyType: this.state.proprtyType? this.state.proprtyType: 'sale'
        })

      } else if (item == 'Search by HDB Towns') {
        this.refs.navigationHelper._navigateInMenu(screen, {
          title: "HDB TOWNS",
          data: this._dataWrapper(HDBTownOptions),
          handlerData: this._handleData,
          isNavigateToListingResult: true,
        });
      } else {
        this.refs.navigationHelper._navigateInMenu(screen, {
          title: screen,
          data: params,
          handlerData: this._handleData,
          propertyType: this.state.proprtyType? this.state.proprtyType: 'sale'
        });
      }
    } 
  }

  _getpropertyTypeInfo(type){
        let info = { label: 'All Types', key: 0, idList: []};
        switch(type){
            case 'l':
                info = { label: 'All Landed', key: 3, idList: ["l-36"]};
                break;
            case 'r':
                info = { label: 'All Non Landed', key: 1, idList: ["r-33"]};
                break;
            case 'i':
                info = { label: 'All Industrial', key: 5, idList: ["i-70"]};
                break;
            case 'c':
                info = { label: 'All Commercial', key: 4, idList: ["c-60"]};
                break;
        }
        return info;
    }

  _setParamBySuggestionValue(type,name,data){
        let params = {
            asset_id: '',
            lat: '',
            lng: ''
        };
        let dataWrapper = (item) => {
            let temp = []
            for (i = 0; i < item.length; i++) {
                temp = [...temp, ...item[i].items.map(data => data)];
            }
            return temp
        }
        if(type == 'p'){
            params.keyword = data.name;
            params.propertyTypeLabel = this._getpropertyTypeInfo(data.ty)
            params.asset_id=data.id;
        }else if(type == 'j'){
            params.keyword = data.name;
        }else if(type == 'a'){
            let district = dataWrapper(DistrictOptions).filter((item)=>item.value == data.area);
            //console.log('area',data.area);
            //console.log('district',district);
            params.state = data.state;
            params.district = district;
        }else if(type == 'g'){
            params.lat = data.geo.location.lat;
            params.lng = data.geo.location.lng;
        }
        //console.log('params',params);
        //districts = [HDBTownOptions,DistrictOptions]
        /*if(['HDB Towns','h'].includes(value)){
            ListHDB=[]
            PropertyTypeOptions[HDB_KEY].sub.map((obj, i) => {
                ListHDB.push(obj.id)
                return ListHDB
            })
            propertyTypeLabel = { label: 'HDB', key: HDB_KEY, idList: ListHDB}

            district = dataWrapper(HDBTownOptions).filter((item)=>item.value == value1)
        }
        if(value == 'i'){
            ListIndustri=[]
            PropertyTypeOptions[INDUSTRIAL_KEY].sub.map((obj, i) => {
                ListIndustri.push(obj.id)
                return ListIndustri
            })
            propertyTypeLabel = { label: 'Industrial', key: INDUSTRIAL_KEY, idList: ListIndustri}
            district = dataWrapper(DistrictOptions).filter((item)=>item.id == value2)
        }
        if(value == 'l'){
            ListLanded=[]
            PropertyTypeOptions[LANDED_KEY].sub.map((obj, i) => {
                ListLanded.push(obj.id)
                return ListLanded
            })
            propertyTypeLabel = { label: 'Landed', key: LANDED_KEY, idList: ListLanded}
            district = dataWrapper(DistrictOptions).filter((item)=>item.id == value2)
        }
        if(value == 'r'){
            ListCondo=[]
            PropertyTypeOptions[APARTMENTCONDO_KEY].sub.map((obj, i) => {
                ListCondo.push(obj.id)
                return ListCondo
            })
           propertyTypeLabel = { label: 'Apartment/Condo', key: APARTMENTCONDO_KEY, idList: ListCondo}
           district = dataWrapper(DistrictOptions).filter((item)=>item.id == value2)
        }
        if(value == 'c'){
            ListComercial=[]
            PropertyTypeOptions[COMMERCIAL_KEY].sub.map((obj, i) => {
                ListComercial.push(obj.id)
                return ListComercial
            })
           propertyTypeLabel = { label: 'Commercial', key: COMMERCIAL_KEY, idList: ListComercial}
           district = dataWrapper(DistrictOptions).filter((item)=>item.id == value2)
        }
        if(value == 'Districts'){
            district = dataWrapper(DistrictOptions).filter((item)=>item.value == value1)
        }
        return {
            propertyTypeLabel: propertyTypeLabel,
            district: district
        }*/
        return params;
    }

  _onPressCurrentLocation() {
    //Alert.alert('Coming Soon....', `this feature will be coming soon`);
    console.log('im here');
    navigator.geolocation.getCurrentPosition(
      position => {
        console.log('position', position);
        const location = JSON.stringify(position);

        let data = [];
        data['poi_lat']  = position.coords? position.coords.latitude: ''
        data['poi_lon']  = position.coords? position.coords.longitude: ''
        data['listing_type']   = this.state.proprtyType? this.state.proprtyType: 'sale'
        data['t'] = 'location'
        this.setState({
          position: position
        })
        //console.log('auto comp= ',data)
        
        /*this.refs.navigationHelper._navigate('ExploreLanding', {
            title: 'searchoption',
            data: data
        })*/

        this.props.navigation.navigate('ExploreLanding', {
            title: 'searchoption',
            data: data
        });
      },
      error => {
        console.log('error', error)
        Alert.alert(error.message)
      },
      { enableHighAccuracy: false, timeout: 30000 }
    );
  }

  _typeFormat(type, params) {
    console.log("type,params",type, params)
      let itemList = '';
      type = params.listing_type?params.listing_type:''
      if(params.state != undefined && params.state != '') {
        itemList += params.state?'State: '+params.state+',':'Kuala Lumpur '+' '
      }
      if(!params.state) {
        itemList +=  'State:  Kuala Lumpur '
      }
      if(type) {
        if(type == 'sale' ) {
          itemList += ' Buy, '  
        }else if(type == 'rent' || type == 'rental') {
          itemList += ' Rent, '
        } else if (type == 'new_launch') {
           itemList += ' New Launch,' 
        }else {
          itemList += type.charAt(0).toUpperCase() + type.slice(1) + ', ';
        }
      }
      
      if(params.property_type != undefined && params.property_type != '') {
        itemList += params.property_type? this._getType(params.property_type) + ', ' : ''
      }

      if(params.asking_price_min != undefined && params.asking_price_min != '') {
        itemList += params.asking_price_min ? ' Min Price: '+this._formatMoney(params.asking_price_min)+' sqft, ' : ''
      }

      if(params.beds != undefined && params.beds != '') {
        itemList += params.beds  != "0"?'Beds: '+params.beds + ', ':' Studio '
      }
      if(params.build_up_max != undefined && params.build_up_max != '') {
        itemList += 'Buildup Max: '+params.build_up_max+' sqft, '
      }
      if(params.build_up_min != undefined && params.build_up_min != '') {
        itemList += 'Buildup Min: '+params.build_up_min+' sqft, '
      }
      if(params.keyword != undefined && params.keyword != '') {
        itemList += params.keyword+','
      }
      return itemList.replace(/(^[,\s]+)|([,\s]+$)/g, '');
    }


  _searchResult(searchParam, searchName, propertyType){
  var items = {};
  var parts = propertyType.apiparams.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        items[key] = value;
    });
 // console.log('parts',items)
      this.refs.navigationHelper._navigate('ExploreLanding', {
          data: {
            state: searchParam.state != undefined ? searchParam.state: '',
            // district: searchParam.district != undefined ? searchParam.district: '',
            // keyword: searchParam.keyword != undefined ? searchParam.keyword: searchName,
            // property_type: searchParam.propertyType != undefined ? searchParam.propertyType: '',
            listing_type: items.listing_type?(items.new_launch?(items.new_launch==1?'new_launch':items.listing_type):items.listing_type):'sale',
            //state: items.state?items.state:'Kuala Lumpur',
            bedroom_min: items.beds?items.beds:'',
            asking_price_min: items.asking_price_min?Number(items.asking_price_min):{},
            asking_price_max: items.asking_price_max?Number(items.asking_price_max):{},
            build_up_min: items.build_up_min?Number(items.build_up_min):{},
            build_up_max: items.build_up_max?Number(items.build_up_max):{},
            land_area_min: items.land_area_min?Number(items.land_area_min):{},
            land_area_max: items.land_area_max?Number(items.land_area_max):{},
            furnishing: items.furnished?items.furnished:'',
            rental_type: items.property_type?items.property_type:'rl',
            keyword: items.keyword?items.keyword:'',
            asset_id: items.asset_id?items.asset_id:'',
            new_launch: items.new_launch?1:0, 
            poi_lat: items.poi_lat? items.poi_lat : '',
            poi_lon: items.poi_lon? items.poi_lon : ''
          }
        })
    }

  render() {
    //console.log(this.state);
    return (
      <View style={{ flex: 1, padding: 10 }}>
        <NavigationHelper
          ref={'navigationHelper'}
          navigation={this.props.navigation}
        />
        <View>
        <Common_AutoSuggestion
          data={this.state.result}
          isEmpty={this.state.onEmpty}
          keyword={this.state.keyword}
          hasText={this.state.hasText}
          onItemPress={this._handleAutoCompleteClick}
          selectedData={(value,index)=>{
           Keyboard.dismiss()
           firebase.analytics().logEvent('Search_Field_Populated', { keyword: value.name, resourceType: value.t});
           this.props.navigation.setParams({
               data: {keyword:value.name}
           })
           let paramSuggestion = this._setParamBySuggestionValue(value.t,value.name,value)
           this.setState({
               //modalVisible:false,
               //keyword: value.name,
               //asset_id: value.id || '',
               //coordinateX: value.x || '',
               //coordinateY: value.y || '',
               resourceType: value.t || '',
               ...paramSuggestion
          })
          if(value.u){
              Linking.openURL("https://www.edgeprop.sg/"+value.u)
          }
          }}

           />
        </View>  
          
        {this.state.savedSearches.length > 0 && (
          <View style={{
            borderTopColor: '#E0E0E0',
            borderTopWidth: 6,
            borderStyle: 'solid',
            marginRight: -10,
            marginLeft: -10
          }}>
            <View style={styles.savedSearches}>
             <View style={styles.savedSearchesHead}>
                <Text allowFontScaling={false} style={styles.searchesHeading}>Saved Searches</Text>
                <TouchableOpacity onPress={this.mySavedSearch}>
                <Text
                 allowFontScaling={false} 
                 style={{
                      fontFamily: 'Poppins-Medium' ,
                      fontSize: 13,
                      alignItems: 'flex-end',
                      color:'#488BF8'
                  }}>
                  See all
                  </Text>
                </TouchableOpacity>  
             </View>
             {this.state.savedSearches.map((item, i) => {
                return (
                <View style={[styles.searchesSection, {marginLeft: 0, marginRight: 25}]} key={i}>
                  <TouchableOpacity onPress={() => this._searchResult(item.params, item.name, item)}>
                    <View style={styles.searchWrapper}>
                        <View style={styles.searchIconContainer}>
                          <Image
                            style={{width: 17, height: 17}}
                            source={require('../../assets/icons/search-icon.png')}
                           />
                        </View>
                        <View style={styles.searchContentContainer}>
                             <Text allowFontScaling={false} style={styles.searchesIconHeading}>{item.name}</Text>
                             <Text allowFontScaling={false} style={styles.searchesIconText}>
                              {this._typeFormat(item.type,item.params)}
                              </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                  )
                })
              }
            </View>
          </View>)}

        <View style={{
                width:screenWidth,
                alignItems:'flex-start',
                borderBottomColor: '#E0E0E0',
                borderBottomWidth: 6,
                borderTopColor: '#E0E0E0',
                borderTopWidth: 6,
                borderStyle: 'solid',
                marginRight: -10,
                marginLeft: -10
            }}>
            <View style={{
                    width: '100%',
                    alignItems:'flex-start',
                    paddingLeft: 35
                }}>
                    <Common_IconMenu
                        type={'icon-text'}
                        textPosition={'right'}
                        imageSource={require('../../assets/icons/current-location.png')}
                        imageHeight={17}
                        imageWidth={17}
                        textValue={'Current Location'}
                        textSize={screenWidth * 0.034}
                        fontFamily={'Poppins-Medium'}
                        fontStyle={'normal'}
                        textColor={'#333333'}
                        onPress={this._onPressCurrentLocation}
                        paddingHorizontal={1}
                        textNewStyle={{
                          marginTop: 3,
                          width: '100%',
                        }}
                        iconStyle={{
                          marginLeft: 35,
                        }}
                        gapAround={{
                          marginRight: 10,
                        }}
                        paddingVertical={8}
                    />
                    {/*<Text allowFontScaling={false} style={{paddingVertical: 3}}> Longitude : {this.state.position.coords? this.state.position.coords.longitude : ''} </Text>
                    <Text allowFontScaling={false} style={{paddingVertical: 3}}> Latitude : {this.state.position.coords? this.state.position.coords.latitude : ''} </Text>*/}
            </View>
        </View>
        <View style={{ paddingLeft: 23, paddingRight: 23,  paddingBottom: 5 }}>
                    
        </View>  
        <View style={{
           marginLeft: 10, marginRight: -10
        }}>
          <Common_MenuList data={dataMenu} onPressItem={this._onPressItem} />
        </View>
      </View>
    );

  }
}
