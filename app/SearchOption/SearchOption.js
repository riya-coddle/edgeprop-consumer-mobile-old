import React, { Component } from 'react'
import {
    View,
    ScrollView,
    PixelRatio,
    Dimensions,
    StyleSheet,
    Text,
    Linking,
    Alert,
    //CheckBox,
    TouchableWithoutFeedback,
    Picker,
    TouchableOpacity,
    Keyboard,
    TextInput,
    Image
} from 'react-native'
import { 

 Dropdown 

} from 'react-native-material-dropdown';
//import MultiSlider from '@ptomasroos/react-native-multi-slider'
import firebase from 'react-native-firebase';
import appsFlyer from 'react-native-appsflyer';
import { CheckBox } from 'react-native-elements';
import { HeaderBackButton } from 'react-navigation'
import StatusBarBackground from '../../components/Common_iOSStatusBar/Common_iOSStatusBar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import HeaderSearch from '../../components/Common_HeaderSearch/Common_HeaderSearch'
import BlockList from '../../components/Common_BlockList/Common_BlockList'
import TextBox from '../../components/Common_TextBox/Common_TextBox'
import Button from '../../components/Common_Button/Common_Button'
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper'
import Common_AutoSuggestion from '../../components/Common_AutoSuggestion/Common_AutoSuggestion'
import DropdownSearch from '../../components/SearchFilterDropdown/SearchFilterDropdown.js'

// data json
import TypeOptions from '../../assets/json/Search_Data/TypeOptions.json'
import DistrictOptions from '../../assets/json/Search_Data/DistrictOptions.json'
import HDBTownOptions from '../../assets/json/Search_Data/HDBTownOptions.json'
import RentalPriceOptions from '../../assets/json/Search_Data/RentalPriceOptions.json'
import SalePriceOptions from '../../assets/json/Search_Data/SalePriceOptions.json'
import SizeOptions from '../../assets/json/Search_Data/SizeOptions.json'
import BedroomOptions from '../../assets/json/Search_Data/BedRoomsOptions.json'
import DealsOptions from '../../assets/json/Search_Data/DealsOptions.json'
import BathroomOptions from '../../assets/json/Search_Data/BathroomOptions.json'
import TenureOptions from '../../assets/json/Search_Data/TenureOptions.json'
import RentalTypeOptions from '../../assets/json/Search_Data/RentalTypeOptions.json'
import FurnishingOptions from '../../assets/json/Search_Data/FurnishingOptions.json'
import CompletionOptions from '../../assets/json/Search_Data/CompletionOptions.json'
import LevelOptions from '../../assets/json/Search_Data/LevelOptions.json'
import RentalYieldOptions from '../../assets/json/Search_Data/RentalYieldOptions.json'
import RentalVolumeOptions from '../../assets/json/Search_Data/RentalVolumeOptions.json'
import SalesVolumeOptions from '../../assets/json/Search_Data/SalesVolumeOptions.json'
import NearbyAmenitiesOptions from '../../assets/json/Search_Data/NearbyAmenitiesOptions.json'
import AmenitiesDistanceOptions from '../../assets/json/Search_Data/AmenitiesDistanceOptions.json'
import PropertyTypeOptions from '../../assets/json/Search_Data/PropertyTypeOptions.json';
import StateList from '../../assets/json/AllStates.json';
import propertyType from '../../assets/json/PropertyType.json';
import furnishedType from '../../assets/json/furnishedTypes.json';


const typeData = [
  { label: 'Buy' , value: 'sale' },
  { label: 'Rent' , value: 'rent' },
  //{ label: 'New Launch' , value: 'new_launch' },
  { label: 'Auction' , value: 'auction' },
];

const bedRooms = [
   { label: 'Bedrooms'    , value: '' },
   { label: 'Studio'    , value: '0' },
   { label: '1 Bedroom' , value: '1'},
   { label: '2 Bedroom' , value: '2'},
   { label: '3 Bedroom' , value: '3'},
   { label: '4 Bedroom' , value: '4' },
   { label: '5 Bedroom' , value: '5' }
];


const screenWidth = Dimensions.get('window').width;
ALLTYPES = 0
APARTMENTCONDO_KEY = 1
HDB_KEY = 2
LANDED_KEY = 3
COMMERCIAL_KEY = 4
INDUSTRIAL_KEY = 5
LOWESTYEAR = 1961
HIGHESTYEAR = (new Date()).getFullYear()

class SearchOption extends Component {

    static navigationOptions = ({ navigation }) => {
        const { state, setParams } = navigation;
        var { params } = state;
        var keyword =  ""
        var _handleChangeKeyword = (text) => {
          keyword = text
        }

        return {
          header:(
            <View style={{padding: 23}}>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <View>
                  <TouchableOpacity onPress={() => (params._handlerOnPress())} style={{paddingTop: 8, paddingBottom: 8, paddingRight: 8}}>
                  <Image
                      style={{ width: 23, height: 23 }}
                      source={require('../../assets/icons/arrow-left.png')}
                    />
                  </TouchableOpacity>  
                </View>
                <View style={{position: 'absolute', left: 0, width: '100%', zIndex: -1, }}>
                  <Text allowFontScaling={false} style={{ textAlign: 'center', fontSize: 20 , fontFamily: 'Poppins-Medium', color:'#414141', paddingVertical: 8  }}>Filter</Text>
                </View>
              </View>
            </View>
          )
        };
      };

    constructor(props) {
        super(props)
        this.result=[];
        const { params } = this.props.navigation.state
        this.state = {
            modalVisible: false,
            keyword: params.data.keyword || '',
            isAdvancedOptions: params.data.isAdvancedOptions || false,
            transactionType: params.data.listing_type || { ...TypeOptions[0], index: 0 },
            propertyType: params.data.property_type_legacy || [],
            propertyTypeLabel: params.data.property_type || { label: 'All Types', key: 0, idList: [] },
            district: params.data.district || [],
            state: params.data.state || 'Kuala Lumpur',
            bedrooms: params.data.bedroom_min || { ...BedroomOptions[0], index: 0 },
            minPrice: params.data.asking_price_min || {},
            maxPrice: params.data.asking_price_max || {},
            minFloorSize: params.data.build_up_min || {},
            maxFloorSize: params.data.build_up_max || {},
            belowValuation: params.data.deals || {},
            bathroom: params.data.bathroom || { ...BathroomOptions[0], index: 0 },
            tenure: params.data.tenure || [],
            rentalType: params.data.rental_type || [],
            minLandArea: params.data.land_area_min || {},
            maxLandArea: params.data.land_area_max || {},
            furnishing: params.data.furnishing || [],
            completion: params.data.completed || [],
            minYearsOfCompletion: params.data.completion_year_min || {},
            maxYearsOfCompletion: params.data.completion_year_max || {},
            levels: params.data.level || [],
            rentalYield: params.data.rental_yield || {},
            rentalVolume: params.data.high_rental_volume || {},
            salesVolume: params.data.high_sales_volume || {},
            amenities: params.data.nearby_amenities || [],
            distance: params.data.amenities_distance || AmenitiesDistanceOptions[0],
            asset_id: params.data.asset_id || '',
            lat:params.data.lat || '',
            lng:params.data.lng || '',
            resourceType: params.data.t || '',
            new_launch: params.data.new_launch || false,
            comyr: params.data.comyr || {},
            sliderOneChanging: false,
            sliderOneValue: [5],
            sliderTwoValue: [100],
            sliderTwoChanging: false,
            multiSliderValue: this._typeChangeValue(this.props.navigation.state.params.data.listingType),
            multiSliderChaning: false,
           // nonCollidingMultiSliderValue: [0, 100],
            //rentalType: propertyType[0].value,
            //type:typeData[0].label,
            rentalType: this.props.navigation.state.params.data.rental_type != undefined ? this._getRentalType(this.props.navigation.state.params.data.rental_type)  : this._getRentalType(),
            type:this.props.navigation.state.params.data.listing_type ? this._getListingType(this.props.navigation.state.params.data.listing_type):'sale',
            //furnishedType: furnishedType[1].label,
            furnishedType: this.props.navigation.state.params.data.furnishing != undefined ? this._getFurnishedType(this.props.navigation.state.params.data.furnishing)  : this._getFurnishedType(),
            sliderBuiltValue: [250, 10000],
            sliderLandValue: [250, 10000],
            stateValue: this.props.navigation.state.params.data.state?this.props.navigation.state.params.data.state:StateList[1].label,
            bedRoom: this.props.navigation.state.params.data.bedroom_min? this._getBedRooms(this.props.navigation.state.params.data.bedroom_min): bedRooms[0].label,
            min: this.props.navigation.state.params.data.listing_type == "rent" ? 500:100000,
            max: this.props.navigation.state.params.data.listing_type == "rent" ? 15000:5000000,
            stations: params.data.stations?params.data.stations:'',
            poi_lon: params.data.poi_lon?params.data.poi_lon:'',
            poi_lat: params.data.poi_lat?params.data.poi_lat:'',
        }
 
//console.log('this.state',this.state)
        
        this.defaultKeywordFeatures = params.data.keyword_features || ''

        this._handleKeyword = this._handleKeyword.bind(this)
        this._suggestion = this._suggestion.bind(this)
        this._searchResult = this._searchResult.bind(this)
        this._resetData = this._resetData.bind(this)
        this._handleData = this._handleData.bind(this)
        this._handlePropertyTypeData = this._handlePropertyTypeData.bind(this)
        this._handleStateData = this._handleStateData.bind(this)
        this._handleOnSetTransactionType = this._handleOnSetTransactionType.bind(this)
        this._handleOnSetPropertyType = this._handleOnSetPropertyType.bind(this)
        this._handleOnSetStateType = this._handleOnSetStateType.bind(this)
        this._handleOnSetDistrict = this._handleOnSetDistrict.bind(this)
        this._handleOnSetBedrooms = this._handleOnSetBedrooms.bind(this)
        this._handleOnSetComYr = this._handleOnSetComYr.bind(this)
        this._handleOnSetMinPrice = this._handleOnSetMinPrice.bind(this)
        this._handleOnSetMaxPrice = this._handleOnSetMaxPrice.bind(this)
        this._handleOnSetMinFloorSize = this._handleOnSetMinFloorSize.bind(this)
        this._handleOnSetMaxFloorSize = this._handleOnSetMaxFloorSize.bind(this)
        this._handleOnSetBelowValuation = this._handleOnSetBelowValuation.bind(this)
        this._handleOnSetBathrooms = this._handleOnSetBathrooms.bind(this)
        this._handleOnSetTenure = this._handleOnSetTenure.bind(this)
        this._handleOnSetRentalType = this._handleOnSetRentalType.bind(this)
        this._handleOnSetFurnishing = this._handleOnSetFurnishing.bind(this)
        this._handleOnSetCompletion = this._handleOnSetCompletion.bind(this)
        this._handleOnSetMinYearsOfCompletion = this._handleOnSetMinYearsOfCompletion.bind(this)
        this._handleOnSetMaxYearsOfCompletion = this._handleOnSetMaxYearsOfCompletion.bind(this)
        this._handleOnSetLevels = this._handleOnSetLevels.bind(this)
        this._handleOnSetRentalYield = this._handleOnSetRentalYield.bind(this)
        this._handleOnSetMinLandArea = this._handleOnSetMinLandArea.bind(this)
        this._handleOnSetMaxLandArea = this._handleOnSetMaxLandArea.bind(this)
        this._handleOnSetRentalVolume = this._handleOnSetRentalVolume.bind(this)
        this._handleOnSetSalesVolume = this._handleOnSetSalesVolume.bind(this)
        this._handleOnSetAmenities = this._handleOnSetAmenities.bind(this)
        this._handleOnSetDistance = this._handleOnSetDistance.bind(this)
        this._handleAdvanceOptionsOnPress = this._handleAdvanceOptionsOnPress.bind(this)
        this._handleResult = this._handleResult.bind(this);
        this._handleOnSetLanuch = this._handleOnSetLanuch.bind(this);
        this._handleAutoState = this._handleAutoState.bind(this);
        this._clearFilters    = this._clearFilters.bind(this);
        this._getDropdownValue = this._getDropdownValue.bind(this)
        //dropdown changes handlers
        this.onChangeType = this.onChangeType.bind(this);
        this.changeState  = this.changeState.bind(this);
        this.rentalTypeChange = this.rentalTypeChange.bind(this);
        this.furnishedTypeChange = this.furnishedTypeChange.bind(this);
        this.bedRoomChange  = this.bedRoomChange.bind(this);


        this.sliderOneValuesChangeStart = this.sliderOneValuesChangeStart.bind(this);
        this.sliderOneValuesChange = this.sliderOneValuesChange.bind(this);
        this.sliderOneValuesChangeFinish = this.sliderOneValuesChangeFinish.bind(this);

        this.sliderTwoValuesChangeStart = this.sliderTwoValuesChangeStart.bind(this);
        this.sliderTwoValuesChange = this.sliderTwoValuesChange.bind(this);
        this.sliderTwoValuesChangeFinish = this.sliderTwoValuesChangeFinish.bind(this);

        this.multiSliderChangeStart = this.multiSliderChangeStart.bind(this);
        this.multiSliderValueChange = this.multiSliderValueChange.bind(this);
        this.multiSliderChangeFinish = this.multiSliderChangeFinish.bind(this);
        this.sliderLandValuesChange = this.sliderLandValuesChange.bind(this);
        this.sliderBuiltValuesChange = this.sliderBuiltValuesChange.bind(this);
        this._formatNumber = this._formatNumber.bind(this);
        this._formatMoney  = this._formatMoney.bind(this);
        this._formatArea   = this._formatArea.bind(this);
        this._getRentalType = this._getRentalType.bind(this);
        this._getFurnishedType = this._getFurnishedType.bind(this);
        this._getListingType = this._getListingType.bind(this);
        this._handlerOnPressSearch = this._handlerOnPressSearch.bind(this)
        this.props.navigation.setParams({
            handleKeyword: this._handleKeyword,
            suggestion: this._suggestion,
            handleResult: this._handleResult,
            handleAutoState: this._handleAutoState,
            stateKey: this.state.state,
            handleBackPress: this._handleOnBackPress,
            _handlerOnPress: this._handlerOnPressSearch,
        })
        
    }

    _getListingType(value = null) {
        let listingType = typeData[0].value;
       // console.log('value',value)
        if (value !== null) {
            if (typeof value === 'object') {
                if (value.value === 'Sale') {
                    return "Buy";
                } else {
                    return value.value;
                }
            } else  {
                //console.log('value',value)
                if(value == 'new_launch' ) {
                    return 'New Launch';
                }
                if(value == 'rent' || value == 'rental'){
                    return 'Rent'    
                }
                if(value == 'auction') {
                    return 'Auction'    
                }
                if( value == 'sale') {
                    return 'Buy'
                }
                
            }
        }
       
    }

    componentDidMount() {

        if(this.props.navigation.state.params.data.listing_type != this.props.navigation.state.params.data.chosenType) {
            this.setState({
                minPrice: {},
                maxPrice: {}
            });
        }
    }

    _getDropdownValue(stateName) {
        if(typeof this.state[stateName] === 'object' && this.state[stateName].constructor === Object && this._isEmptyObject(this.state[stateName])) {
            return 'Any'
        } else {
            return this.state[stateName].value
        }
    }

    _handlerOnPressSearch() {
        /*this.refs.navigationHelper._navigate('ExploreLanding', {
            data: {
                listing_type: this._getType(),
            },
            searchBack: true
        })*/
        let navigation = this.props.navigation
        navigation.goBack();
    }

    _getBedRooms(val) {
         for (var i = 0; i < bedRooms.length; i++) {
            if(bedRooms[i].label == val) {
                return bedRooms[i].value
            } 
            if(bedRooms[i].value == val) {
 
                return bedRooms[i].value
            }
        } 
    }

    _handleAutoState(flag,ref){
        //console.log('search option state',this.state)
        //console.log('this.refs',ref)
        if(flag){
            //this.refs.headerSearch.setState(this.state.state)
        }else{
            //this.refs.headerSearch.setState('Kuala Lumpur')
        }
    }
    _typeChangeValue(val) {
        let multiSliderValue = [];
        if(val == 'rent') {
            // multiSliderValue[0] = 500;
            // multiSliderValue[1] = 15000;
            // this.setState({'min':500,'max':15000});
            return ([500,15000])
        } else {
            // multiSliderValue[0] = 100;
            // multiSliderValue[1] = 500;
            // this.setState({'min':100,'max':500});
            return ([100000,5000000])
        }
        
    }
    _getRentalType(value = undefined) {
        let propertyTypeLabel = propertyType[1].label;
        if (value != undefined) {
            let result = propertyType.map((item, i) => {
            if (item.value == value) {
              propertyTypeLabel = item.label;
            }
          });
        } 
            return (propertyTypeLabel);
        
    }
    _getFurnishedType(value = undefined) {
        let furnishedLabel = furnishedType[0].label;
        if (value != undefined) {
            let result = furnishedType.map((item, i) => {
            if (item.value == value) {
              furnishedLabel = furnishedType[i].label;
            }
          });
        }
            
        return (furnishedLabel);        
    }
    //Dropdwon change states 
    onChangeType(text) {
      //  console.log('text',text);
        this.setState({ type: text });
        if(text == 'rent') {
            this.setState({
                minPrice: {},
                maxPrice: {}
            });
            
        } else {
            this.setState({
                minPrice: {},
                maxPrice: {}
            });
        }
    }

    changeState(text) {
      this.setState({ stateValue : text });
    }

    rentalTypeChange(text) {
      this.setState({ rentalType: text });
    }

    furnishedTypeChange(text) {
      this.setState({ furnishedType : text });
    }

    bedRoomChange(text) {
      this.setState({ bedRoom: text });
    }
    _clearFilters() {
        this.setState({ 
            sliderOneChanging: false,
            sliderOneValue: [5],
            sliderTwoValue: [100],
            sliderTwoChanging: false,
            multiSliderValue: [500, 15000],
            multiSliderChaning: false,
            //nonCollidingMultiSliderValue: [0, 100],
            rentalType: propertyType[1].value,
            type: typeData[0].value,
            furnishedType: furnishedType[0].label,
            sliderBuiltValue: [250, 10000],
            sliderLandValue: [250, 10000],
            stateValue: StateList[1].label,
            bedRoom: bedRooms[0].label,
            minPrice: {},
            maxPrice: {},
            minFloorSize: {},
            maxFloorSize: {},
            minLandArea: {},
            maxLandArea: {},
            keyword: '',
            stations: '',
            district: []
        });
    }
    _formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }
    _formatArea(val) {
        return val ? this._formatNumber(val) : '-'
    }
    _formatMoney(val) {
        //let formatted = this._formatNumber(val);
        if(val.toString().length > 3 ){
            let item = parseFloat(val * 0.001).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')
            return item+' K';
        }
        return val;
    }
    sliderOneValuesChangeStart(){
        this.setState({
            sliderOneChanging: true,
        });
    }
    sliderOneValuesChange(values) {
        let newValues = [0];
        newValues[0] = values[0];
        this.setState({
            sliderOneValue: newValues,
        });
    }
    sliderOneValuesChangeFinish(){
        this.setState({
            sliderOneChanging: false,
        });
    }  
    sliderTwoValuesChangeStart(){
        this.setState({
            sliderTwoChanging: true,
        });
    }
    sliderTwoValuesChange(values) {
        let newValues = [0];
        newValues[0] = values[0];
        this.setState({
            sliderTwoValue: newValues,
        });
    }
    sliderTwoValuesChangeFinish(){
        this.setState({
            sliderTwoChanging: false,
        });
    }

    multiSliderChangeStart(){
        this.setState({
            multiSliderChaning: true,
        });
    }
    multiSliderValueChange(values) {
       let items =  this._formatMoney(values)
       this.setState({
            multiSliderValue: values,
        });       
    }
    multiSliderChangeFinish(){
        this.setState({
            multiSliderChaning: false,
        });
    }
    sliderLandValuesChange(values) {
        let items =  this._formatMoney(values)
        this.setState({
            sliderLandValue: values,
        }); 
    }
    sliderBuiltValuesChange(values) {
        let items =  this._formatMoney(values)
        this.setState({
            sliderBuiltValue: values,
        }); 
    } 
    _handleResult(result){
        //console.log('SearchOption 215 _handleResult',result);
        this.result = result
    }
    _suggestion(visible){
        //console.log('SearchOptions 219 _suggestion',visible)
        this.setState({
            modalVisible: visible,
         });
    }
    _resetFieldValue(type, propertyTypeKey) {
        /**
         * special condition to reset the field value, if those are hidden,
         * use negation of condition of hide/show field
         */
        tempVal = {}

        if (!(propertyTypeKey !== COMMERCIAL_KEY && propertyTypeKey !== INDUSTRIAL_KEY)) {
            tempVal['bedrooms'] = { ...BedroomOptions[0], index: 0 }
            tempVal['bathroom'] = { ...BathroomOptions[0], index: 0 }
            tempVal['furnishing'] = []
            tempVal['minYearsOfCompletion'] = {}
            tempVal['maxYearsOfCompletion'] = {}
        }
        if (!(this.state.transactionType.value === type && propertyTypeKey === LANDED_KEY)) {
            tempVal['minLandArea'] = {}
            tempVal['maxLandArea'] = {}
        }
        if (!(this.state.transactionType.value === type)) {
            tempVal['tenure'] = []
        }
        if (!(this.state.transactionType.value === type && propertyTypeKey !== HDB_KEY)) {
            tempVal['completion'] = []
        }
        if (!(propertyTypeKey !== LANDED_KEY && propertyTypeKey !== COMMERCIAL_KEY && propertyTypeKey !== INDUSTRIAL_KEY)) {
            tempVal['levels'] = []
        }
        if (!(this.state.transactionType.value === type && propertyTypeKey !== HDB_KEY && propertyTypeKey !== COMMERCIAL_KEY && propertyTypeKey !== INDUSTRIAL_KEY)) {
            tempVal['rentalYield'] = {}
        }
        if (!(this.state.transactionType.value === type && propertyTypeKey === APARTMENTCONDO_KEY)) {
            tempVal['rentalVolume'] = {}
            tempVal['salesVolume'] = {}
        }
        if (!(this.state.transactionType.value === type && propertyTypeKey !== COMMERCIAL_KEY && propertyTypeKey !== INDUSTRIAL_KEY)) {
            tempVal['belowValuation'] = {}
        }
        if (!(this.state.transactionType.value === type)) {
            tempVal['rentalType'] = []
        }
        if (propertyTypeKey === HDB_KEY) {
            if (propertyTypeKey !== this.state.propertyTypeLabel.key) tempVal['district'] = []
        }
        else {
            if (this.state.propertyTypeLabel.key === HDB_KEY) tempVal['district'] = []
        }

        return tempVal
    }

    _resetAllFieldValue() {
        return {
            //district: [],
            //bedrooms: { ...BedroomOptions[0], index: 0 },
            //minPrice: {},
            //maxPrice: {},
            //minFloorSize: {},
            //maxFloorSize: {},
            belowValuation: {},
            //bathrooms: [{ ...BathroomOptions[0], index: 0 }],
            tenure: [],
            rentalType: [],
            minLandArea: {},
            maxLandArea: {},
            //furnishing: [],
            completion: [],
            //minYearsOfCompletion: {},
            //maxYearsOfCompletion: {},
            //levels: [],
            rentalYield: {},
            rentalVolume: {},
            salesVolume: {},
            //amenities: [],
            //distance: AmenitiesDistanceOptions[0],
        }
    }

    _searchResult() {
        let itemValue = this.state.furnishedType;
        let bedRoomChosen = this.state.bedRoom;

        for (var i = 0; i < furnishedType.length; i++) {
            if(furnishedType[i].label == this.state.furnishedType) {
                itemValue = furnishedType[i].value;
            }
        }

        for (var i = 0; i < bedRooms.length; i++) {
            if(bedRooms[i].label == this.state.bedRoom) {
                bedRoomChosen = bedRooms[i].value
            } 
            if(bedRooms[i].value == this.state.bedRoom) {
                bedRoomChosen = bedRooms[i].value
            }
        }
//console.log('qqq', bedRoomChosen)
        let navigation = this.props.navigation
        let { params } = navigation.state
        let title = this.props.navigation.state.params.title || 'searchoption'
        if(title == 'New Launches')
            title = 'searchoption'
        let data = this._getAllParameters()
        data['asset_id']= this.state.asset_id
        data['lat']= this.state.lat
        data['lng']= this.state.lng
        data['t']= this.state.resourceType
        data['is_search']= false
        data['furnishedType'] = itemValue
        data['title'] = 'searchoption'
        data['bedRoomSelected'] = bedRoomChosen
        data['new_launch'] = this.state.type == 'new_launch'?1:0
        data['bedroom_min'] = bedRoomChosen
        data['chosenType'] = this.state.type
//console.log('sartae',data)
       /* if(data.district.length > 0){
            data.district.map((item, index) => {
               firebase.analytics().logEvent('Search_District', { Name: item.value });
            })
        }
        firebase.analytics().logEvent('Search_Button',{Type : data.listing_type.value, PropertyType: data.property_type.label, Bedroom: data.bedRoomChosen, MinPrice: data.asking_price_min.value || 'Any', MaxPrice: data.asking_price_max.value||'Any' , MinFloorSize: data.build_up_min.value||'Any', MaxFloorSize: data.build_up_max.value||'Any' , EdgeFairValue: data.deals.value||'Any'});

        appsFlyer.trackEvent("Search", {},
            (result) => {
                console.log(result);
            },
            (error) => {
                console.error(error);
            }
        )
        
        if (params.searchResultFeedback != undefined) {
            params.searchResultFeedback(title, data)
            navigation.goBack()
        }
        else { */
         // console.log('values ', data)  
           // Keyboard.dismiss()
            this.refs.navigationHelper._navigate('ExploreLanding', {
                title: title,
                data: data,
                fromSearch: true
            })
       // }
    }

    _resetData() {
        this.refs.keywordFeatures._setText('')
        this.props.navigation.setParams({
          data: {...this.props.navigation.state.data,...{
            keyword: ''
          }}
        })
        this.setState({
            // transactionType: { ...TypeOptions[0], index: 0 },
            ...this._resetDataField()
        })
    }
    _resetDataField(){
        return {
            transactionType: { ...TypeOptions[0], index: 0 },
            propertyType: [],
            propertyTypeLabel: { label: 'All Types', key: 0, idList: [] },
            district: [],
            state: 'Kuala Lumpur',
            bedrooms: { ...BedroomOptions[0], index: 0 },
            minPrice: {},
            maxPrice: {},
            minFloorSize: {},
            maxFloorSize: {},
            belowValuation: {},
            bathroom: { ...BathroomOptions[0], index: 0 },
            tenure: [],
            rentalType: [],
            minLandArea: {},
            maxLandArea: {},
            furnishing: [],
            completion: [],
            minYearsOfCompletion: {},
            maxYearsOfCompletion: {},
            levels: [],
            rentalYield: {},
            rentalVolume: {},
            salesVolume: {},
            amenities: [],
            distance: AmenitiesDistanceOptions[0],
            keyword_features: '',
            keyword: '',
            asset_id: '',
            lat: '',
            lng: '',
            resourceType: '',
            new_launch: false,
            comyr: ''
        }
    }
    _handleData(data, optionType) {
        this.setState({ [optionType]: data })
    }

    _handleKeyword(text){
        this.setState({
            keyword: text
        })
        // if(text==''){
            this.setState({
                asset_id: '',
                lat: '',
                lng: '',
                resourceType: ''
           })
        // }
    }

    _handleStateData(data, optionType, state) {
        // set state property type data, and its label
        this.setState({
            [optionType]: state,
            district: data
        })
        //console.log('state',state);

        this.props.navigation.setParams({
          stateKey: state,
          data: {keyword:this.state.keyword}
        })
    }

    _handlePropertyTypeData(data, optionType, propertyTypeKey) {
        // set state property type data, and its label
        this.setState({
            [optionType]: data,
            propertyTypeLabel: this._getPropertyType(data, propertyTypeKey),
            ...this._resetFieldValue(this.state.transactionType.value, propertyTypeKey)
        })
    }

    _directToSelection(optionType, title, optionData, checkbox, customSelection) {
        Keyboard.dismiss()
        this.refs.navigationHelper._navigateInMenu('CommonSelection', {
            existingData: this.state[optionType],
            customSelection: customSelection,
            optionType: optionType,
            title: title,
            data: optionData,
            handlerData: this._handleData,
            checkBox: checkbox,
        })
    }

    _handleOnSetTransactionType(undefined, value, index, id) {
        this.setState({
            transactionType: { id: id, value: value , index: index},
            ...this._resetAllFieldValue()
        })
    }

    _handleOnSetStateType() {
        Keyboard.dismiss()
        this.refs.navigationHelper._navigateInMenu('StateMenu', {
            optionType: 'state',
            existingData: this.state.district,
            key: this.state.state,
            isSelectAll: false,
            isRetrieveSelection: true,
            title: "DISTRICTS",
            handlerData: this._handleStateData
        })

        /*this.refs.navigationHelper._navigateInMenu('StateMenu', {
            optionType: 'state',
            existingData: [],
            key: 'Kuala Lumpur',
            isSelectAll: false,
            isRetrieveSelection: true,

            data: this._dataWrapper(DistrictOptions),
            handlerData: this._handleDistrictData,
            marginVerticalCheckBox: 15,
            isNavigateToListingResult: true,
        })*/
    }

    _handleOnSetPropertyType() {
        Keyboard.dismiss()
        this.refs.navigationHelper._navigateInMenu('PropertyTypeMenu', {
            optionType: 'propertyType',
            existingData: this.state.propertyType,
            key: this.state.propertyTypeLabel.key,
            isSelectAll: true,
            isRetrieveSelection: true,
            handlerData: this._handlePropertyTypeData
        })
    }

    _handleOnSetDistrict() {
        let dataWrapper = (item) => {
            let temp = []
            let source = DistrictOptions.filter(data=> data.category.id==this.state.state);
            for (i = 0; i < source.length; i++) {
                temp = [...temp, ...source[i].items.map(data => data)];
            }
            return temp
        }
        let dataDistrict = this.state.propertyTypeLabel.key === HDB_KEY ? dataWrapper(HDBTownOptions) : dataWrapper(DistrictOptions)
        this._directToSelection('district', 'DISTRICT', dataDistrict, true, 'All District')
    }

    _handleOnSetBedrooms(undefined, value, index, id) {
        this.setState({
            bedrooms : { id: id, value: value, index: index }
        })
    }

    _handleOnSetComYr(undefined, value, index, id) {
        this.setState({
            comyr : { id: id, value: value, index: index }
        })
    }
    _handleOnSetMinPrice() {
        let transactionType = this.state.type
        let maxPrice = this.state.maxPrice
        let priceOptions = this.state.type.toLowerCase() === 'rent' ? RentalPriceOptions : SalePriceOptions
        let startPrice = priceOptions[0].id
        let endPrice = this._isEmptyObject(maxPrice) ? priceOptions[priceOptions.length - 1].id : maxPrice.id
        let priceList = this._getRangeList(startPrice, endPrice, priceOptions)
        this._directToSelection('minPrice', 'MIN PRICE', priceList, false, 'Any')
    }
    _handleOnSetMaxPrice() {
        let transactionType = this.state.type
        let minPrice = this.state.minPrice
        let priceOptions = this.state.type.toLowerCase() === 'rent' ? RentalPriceOptions : SalePriceOptions
        let startPrice = this._isEmptyObject(minPrice) ? priceOptions[0].id : minPrice.id
        let endPrice = priceOptions[priceOptions.length - 1].id
        let priceList = this._getRangeList(startPrice, endPrice, priceOptions)
        this._directToSelection('maxPrice', 'MAX PRICE', priceList, false, 'Any')
    }
    _handleOnSetMinFloorSize() {
        let maxFloorSize = this.state.maxFloorSize
        let startSize = SizeOptions[0].id
        let endSize = this._isEmptyObject(maxFloorSize) ? SizeOptions[SizeOptions.length - 1].id : maxFloorSize.id
        sizeList = this._getRangeList(startSize, endSize, SizeOptions)
        this._directToSelection('minFloorSize', 'MIN BUILD UP SIZE', sizeList, false, 'Any')
    }
    _handleOnSetMaxFloorSize() {
        let minFloorSize = this.state.minFloorSize
        let startSize = this._isEmptyObject(minFloorSize) ? SizeOptions[0].id : minFloorSize.id
        let endSize = SizeOptions[SizeOptions.length - 1].id
        let sizeList = this._getRangeList(startSize, endSize, SizeOptions)
        this._directToSelection('maxFloorSize', 'MAX BUILD UP SIZE', sizeList, false, 'Any')
    }
    _handleOnSetBelowValuation() {
        this._directToSelection('belowValuation', '% below Edge Fair Value', DealsOptions, false, 'Any')
    }
    _handleOnSetBathrooms(isSelected, value, index, id) {
        /*let bathrooms = []
        bathrooms = this.state.bathrooms
        if (id === '') {
            bathrooms = [{ ...BathroomOptions[0], index: 0 }]
        }
        else {
            if (isSelected) {
                bathrooms.push({ id: id, value: value, index: index })
                bathrooms = bathrooms.filter((obj) => obj.id !== '')
            } else {
                bathrooms = bathrooms.filter((obj) => obj.value !== value)
            }
        }
        if (bathrooms.length === 0) {
            bathrooms = [{ ...BathroomOptions[0], index: 0 }]
        }
        this.setState({ bathrooms: bathrooms })*/
        this.setState({
            bathroom : { id: id, value: value, index: index }
        })
    }
    _handleOnSetTenure() {
        this._directToSelection('tenure', 'TENURE', TenureOptions, true, 'Any')
    }
    _handleOnSetRentalType() {
        this._directToSelection('rentalType', 'RENTAL TYPE', RentalTypeOptions, true, 'Any')
    }
    _handleOnSetFurnishing() {
        this._directToSelection('furnishing', 'FURNISHING', FurnishingOptions, false, 'Any')
    }
    _handleOnSetCompletion() {
        this._directToSelection('completion', 'COMPLETION', CompletionOptions, true, 'Any')
    }
    _handleOnSetMinYearsOfCompletion() {
        let maxYearsOfCompletion = this.state.maxYearsOfCompletion
        let startYear = LOWESTYEAR
        let endYear = this._isEmptyObject(maxYearsOfCompletion) ? HIGHESTYEAR : parseInt(maxYearsOfCompletion.value)
        let yearsList = this._getYearsList(startYear, endYear)
        this._directToSelection('minYearsOfCompletion', 'MIN YEARS OF COMPLETION', yearsList, false, 'Any')
    }
    _handleOnSetMaxYearsOfCompletion() {
        let minYearsOfCompletion = this.state.minYearsOfCompletion
        let startYear = this._isEmptyObject(minYearsOfCompletion) ? LOWESTYEAR : parseInt(minYearsOfCompletion.value)
        let endYear = HIGHESTYEAR
        yearsList = this._getYearsList(startYear, endYear)
        this._directToSelection('maxYearsOfCompletion', 'MAX YEARS OF COMPLETION', yearsList, false, 'Any')
    }
    _handleOnSetLevels() {
        this._directToSelection('levels', 'LEVELS', LevelOptions, true, 'Any')
    }
    _handleOnSetRentalYield() {
        this._directToSelection('rentalYield', 'RENTAL YIELD', RentalYieldOptions, false, 'Any')
    }
    _handleOnSetMinLandArea() {
        let maxLandArea = this.state.maxLandArea
        let startSize = SizeOptions[0].id
        let endSize = this._isEmptyObject(maxLandArea) ? SizeOptions[SizeOptions.length - 1].id : maxLandArea.id
        let sizeList = this._getRangeList(startSize, endSize, SizeOptions)
        this._directToSelection('minLandArea', 'MIN LAND AREA', sizeList, false, 'Any')
    }
    _handleOnSetMaxLandArea() {
        let minLandArea = this.state.minLandArea
        let startSize = this._isEmptyObject(minLandArea) ? SizeOptions[0].id : minLandArea.id
        let endSize = SizeOptions[SizeOptions.length - 1].id
        let sizeList = this._getRangeList(startSize, endSize, SizeOptions)
        this._directToSelection('maxLandArea', 'MAX LAND AREA', sizeList, false, 'Any')
    }
    _handleOnSetRentalVolume() {
        this._directToSelection('rentalVolume', 'RENTAL VOLUME', RentalVolumeOptions, false, 'Any')
    }
    _handleOnSetSalesVolume() {
        this._directToSelection('salesVolume', 'SALES VOLUME', SalesVolumeOptions, false, 'Any')
    }
    _handleOnSetAmenities() {
        this._directToSelection('amenities', 'AMENITIES', NearbyAmenitiesOptions, true, 'Any')
    }
    _handleOnSetDistance() {
        this._directToSelection('distance', 'DISTANCE', AmenitiesDistanceOptions, false, 'Any')
    }

    _handleAdvanceOptionsOnPress() {
        firebase.analytics().logEvent('Search_Advance_Options');
        this.setState({
            isAdvancedOptions: true,
        })
    }

    _handleOnSetLanuch() {
        this.setState({
            new_launch: !this.state.new_launch,
            comyr: ''
        })
    }

    _isEmptyObject(obj) {
        if(typeof obj === 'object') {
            return (Object.keys(obj).length === 0 && obj.constructor === Object)
        }
        else {
            return true;
        }
    }

    _isCompleteSet(idList, staticIdList) {
        let flag = false
        let i = 0
        if (idList.length === staticIdList.length) {
            flag = true
            while (i < idList.length && flag) {
                flag = (staticIdList.includes(idList[i]))
                i++
            }
        }
        return flag
    }

    _isPropertyTypeItem(idList1, idList2) {
        i = 0
        flag = false
        while (!flag && (i < idList1.length)) {
            flag = (idList2.includes(idList1[i]))
            i++
        }

        return flag
    }

    _getPropertyType(propertyType, key) {
        /**
         * configurations type key:
         * 0: Any
         * 1: Apartment/Condo
         * 2: HDB
         * 3: Landed
         * 4: Commercial
         * 5: Industrial
         */
        let idList = []
        let labeledVal = ''
        // handle empty value
        if (propertyType == undefined || propertyType.length === 0) return { label: 'All Types', key: 0, idList: [] }

        // get only id in list
        idList = [propertyType.id];

        // set value for labeled field
        labeledVal = propertyType.value;


        if (key === APARTMENTCONDO_KEY) {
            APARTMENTCONDOList=[]
            PropertyTypeOptions[APARTMENTCONDO_KEY].sub.map((obj, i) => {
                APARTMENTCONDOList.push(obj.id)
                return APARTMENTCONDOList
            })
            if (this._isCompleteSet(idList, APARTMENTCONDOList)) {
                return { label: 'Apartment/Condo', key: APARTMENTCONDO_KEY, idList: idList }
            }
            return { label: labeledVal, key: APARTMENTCONDO_KEY, idList: idList }
        }

        if (key === HDB_KEY) {
            HDBList=[]
            PropertyTypeOptions[HDB_KEY].sub.map((obj, i) => {
                HDBList.push(obj.id)
                return HDBList
            })
            if (this._isCompleteSet(idList, HDBList)) {
                return { label: 'HDB', key: HDB_KEY, idList: idList }
            }
            return { label: labeledVal, key: HDB_KEY, idList: idList }
        }
        // if (this._isPropertyTypeItem(idList, LANDED_ID_LIST)) {
        if (key === LANDED_KEY) {
            LANDEDList=[]
            PropertyTypeOptions[LANDED_KEY].sub.map((obj, i) => {
                LANDEDList.push(obj.id)
                return LANDEDList
            })
            if (this._isCompleteSet(idList, LANDEDList)) {
                return { label: 'Landed', key: LANDED_KEY, idList: idList }
            }
            return { label: labeledVal, key: LANDED_KEY, idList: idList }
        }
        // if (this._isPropertyTypeItem(idList, COMMERCIAL_ID_LIST)) {
        if (key === COMMERCIAL_KEY) {
            COMMERCIALList=[]
            PropertyTypeOptions[COMMERCIAL_KEY].sub.map((obj, i) => {
                COMMERCIALList.push(obj.id)
                return COMMERCIALList
            })
            if (this._isCompleteSet(idList, COMMERCIALList)) {
                return { label: 'Commercial', key: COMMERCIAL_KEY, idList: idList }
            }
            return { label: labeledVal, key: COMMERCIAL_KEY, idList: idList }
        }
        // if (this._isPropertyTypeItem(idList, INDUSTRIAL_ID_LIST)) {
        if (key === INDUSTRIAL_KEY) {
            INDUSTRIALList=[]
            PropertyTypeOptions[INDUSTRIAL_KEY].sub.map((obj, i) => {
                INDUSTRIALList.push(obj.id)
                return INDUSTRIALList
            })
            if (this._isCompleteSet(idList, INDUSTRIALList)) {
                return { label: 'Industrial', key: INDUSTRIAL_KEY, idList: idList }
            }
            return { label: labeledVal, key: INDUSTRIAL_KEY, idList: idList }
        }

        return { label: 'All Types', key: 0, idList: idList }
    }

    _getSelectedValueWithMultiSelect(stateName, defaultValue) {
        let objState = this.state[stateName]
        let idList = []
        let labeledVal = ''

        // handle empty value
        if (objState == undefined || objState.length === 0) return defaultValue

        // get only id in list
        idList = objState.map((obj, i) => {
            return obj['id']
        })
        // set value for labeled field
        objState.map((obj, i) => {
            if (i < objState.length - 1) {
                labeledVal += obj.value + ', '
            }
            else {
                labeledVal += obj.value
            }
        })
        return labeledVal
    }

    _getSelectedValueWithSingleSelect(stateName, defaultValue) {
        let objState = this.state[stateName]
        // handle empty value
        if (this._isEmptyObject(objState) || objState == undefined || objState.length === 0) return defaultValue
        return objState.value
    }

    _getYearsList(start, end) {
        vStart = start || LOWESTYEAR
        vEnd = end || HIGHESTYEAR
        arr = []
        for (i = vStart; i <= vEnd; i++) {
            yearStr = i.toString()
            arr.push({ id: yearStr, value: yearStr })
        }
        return arr
    }

    _getRangeList(start, end, fullData) {
        vStart = parseInt(start)
        vEnd = parseInt(end)

        return fullData.filter((obj) => (vStart <= parseInt(obj.id) && parseInt(obj.id) <= vEnd))
    }

    _setParameterValue1(val) {
        // if the data is object
        tempVal = ''
        if (!this._isEmptyObject(val)) {
            tempVal += val.id
        }

        return tempVal
    }

    _setParameterValue2(val) {
        // if the data is array of string, array of object
        tempVal = ''
        if (val.length > 0) {
            val.map((item, i) => {
                tempVal += (item.id || item) + (i < val.length - 1 ? ',' : '')
            })
        }

        return tempVal
    }

    _returnRentalType(value) {
        //console.log('va',value)
        let propertyTypeLabel;
        if (value != undefined) {
            let result = propertyType.map((item, i) => {
            if (item.value == value) {
              propertyTypeLabel = item.value;
            } 
            if (item.label == value) {
              propertyTypeLabel = item.value;
            }
          });
        } 
        return (propertyTypeLabel);
    }
    
    _getType() {
        let type = 'sale'
        if(this.state.type == 'Rent' || this.state.type == 'rent') {
            type = 'rental'
        } else if(this.state.type == 'New Launch' || this.state.type == 'new_launch') {
            type = 'new_launch'
        } else if(this.state.type == 'Auction' || this.state.type == 'auction') {
            type = 'auction'
        } 
        return type;
    }
   
    _getAllParameters() {
        return ({
            listing_type: this._getType(),
            property_type_legacy: this.state.propertyType,
            property_type: this.state.propertyTypeLabel,
            district: this.state.district,
            state: this.state.stateValue,
            bedroom_min: this.state.bedRoom,
            asking_price_min: this.state.minPrice,
            asking_price_max: this.state.maxPrice,
            build_up_min: this.state.minFloorSize,
            build_up_max: this.state.maxFloorSize,
            land_area_min: this.state.minLandArea,
            land_area_max: this.state.maxLandArea,
            tenure: this.state.tenure,
            bathroom: this.state.bathroom,
            furnishing: this.state.furnishing,
            completed: this.state.completion,
            level: this.state.levels,
            completion_year_min: this.state.minYearsOfCompletion,
            completion_year_max: this.state.maxYearsOfCompletion,
            rental_yield: this.state.rentalYield,
            high_rental_volume: this.state.rentalVolume,
            high_sales_volume: this.state.salesVolume,
            deals: this.state.belowValuation,
            nearby_amenities: this.state.amenities,
            amenities_distance: this.state.distance,
            rental_type: this._returnRentalType(this.state.rentalType),
            keyword_features: (this.refs.keywordFeatures ? this.refs.keywordFeatures.state.value : ''),
            keyword: this.state.keyword,
            asset_id: this.state.asset_id,
            lat: this.state.lat,
            lng: this.state.lng,
            t: this.state.resourceType,
            is_search: false,
            new_launch: this.state.new_launch,
            comyr: this.state.comyr,
            stations: this.state.stations,
            poi_lon: this.state.poi_lon,
            poi_lat: this.state.poi_lat
        })
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

    _getLaunchYear = () => {
        let years = [
            {
              "id":"",
              "value": "Any"
            }
        ];
        let currentYear = new Date().getFullYear(), index=0;

        while ( index <= 5 ) {
            years.push({
              "id":Number(currentYear)+index,
              "value":Number(currentYear)+index
            });
            index++;
        }

        return years;
        /*return [
          {
            "id":"2018",
            "value": "2018"
          },
          {
            "id":"2019",
            "value": "2019"
          },
          {
            "id":"2020",
            "value": "2020"
          },
          {
            "id":"2021",
            "value": "2021"
          },
          {
            "id":"2022",
            "value": "2022"
          },
          {
            "id":"2023",
            "value": "2023"
          }
      ]*/
    }

    render() {
        //console.log(this.props.navigation.state.params.data)
       // console.log('stat', this.state);
        const blockListItemStyle = {
            height: 45,
            backgroundColorSelected: 'rgb(243,246,249)',
            textSize: 15,
            textColor: 'rgb(47,47,47)',
            textColorSelected: 'rgb(39,80,117)',
            fontFamily: 'Poppins-Light',
            fontFamilySelected: 'Poppins-Medium',
            borderColor: 'rgb(238,238,238)',
            borderWidth: 1,
            borderRadius: 5,
            fontStyle: 'normal',
        }

        const titleStyle = {
            marginTop: 3,
             marginBottom: 3,
            fontFamily: "Poppins-Medium",
            fontSize: 12,
            color: "rgb(47,47,47)",
            alignItems: 'center'

        }
        const { width } = Dimensions.get('window');
        optionalPadding = 43;
        const mySliderLength = width - 2 * optionalPadding;

        var _renderPropertyTypesOption = () => {
           let min = 500;
           let max = 15000;
           if(this.state.type == 'rent') {
            min = 100000;
            max = 5000000;
           }
           //console.log(min, max);
            return (
           <View style={styles.filterContainer}>
               <View style={styles.dropdownCustom}>
                   <Dropdown
                        allowFontScaling={false}
                        data={typeData}
                        value={this.state.type}
                        baseColor={'#414141'}
                        selectedItemColor={'#414141'}
                        inputContainerStyle={{ borderBottomColor: 'transparent' }}
                        textColor={'#414141'}
                        itemColor={'#414141'}
                        onChangeText={this.onChangeType}
                        fontFamily={'Poppins-Regular'}
                        dropdownPosition={1}
                        labelHeight={0}
                      />
                    
                </View>   
                 <View style={styles.dropdownCustom}>
                   <Dropdown
                        allowFontScaling={false}
                        data={StateList}
                        value={this.state.stateValue}
                        baseColor={'#414141'}
                        selectedItemColor={'#414141'}
                        inputContainerStyle={{ borderBottomColor: 'transparent' }}
                        textColor={'#414141'}
                        itemColor={'#414141'}
                        onChangeText={this.changeState}
                        fontFamily={'Poppins-Regular'}
                        dropdownPosition={1}
                        labelHeight={0}
                      />
                </View>
                <View style={styles.dropdownCustom}>
                   <Dropdown
                        allowFontScaling={false}
                        data={bedRooms}
                        value={this.state.bedRoom}
                        baseColor={'#414141'}
                        selectedItemColor={'#414141'}
                        inputContainerStyle={{ borderBottomColor: 'transparent' }}
                        textColor={'#414141'}
                        itemColor={'#414141'}
                        onChangeText={this.bedRoomChange}
                        fontFamily={'Poppins-Regular'}
                        dropdownPosition={1}
                        labelHeight={0}
                      />
                </View>
                <View style={{ flex: 1,justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.rangeContainerFirst}>
                       <Text allowFontScaling={false} style={styles.rangeTitle}>Price</Text>
                        <View style={[styles.inline, styles.oneRowContainer]}>
                            <View style={{ width: '48%' }}>
                                <DropdownSearch
                                    title={'MIN PRICE'}
                                    titleStyle={titleStyle}
                                    defaultValue={this._getDropdownValue('minPrice')?this._getDropdownValue('minPrice'):'Any'}
                                    collapseAble={false}
                                    height={40}
                                    onPress={this._handleOnSetMinPrice} />
                            </View>
                            <View style={{ width: '48%' }}>
                            <DropdownSearch
                                title={'MAX PRICE'}
                                titleStyle={titleStyle}
                                defaultValue={this._getDropdownValue('maxPrice')?this._getDropdownValue('maxPrice'):'Any'}
                                collapseAble={false}
                                height={40}
                                onPress={this._handleOnSetMaxPrice} />
                            </View>
                        </View>
                    </View>
                  </View>
            </View>   
            )
        }
         
        var _renderStateOption = () => {
            return (
            <View style={styles.filterContainer}>
                <View style={styles.dropdownCustom}>
                   <Dropdown
                        allowFontScaling={false}
                        data={propertyType}
                        value={this.state.rentalType}
                        baseColor={'#414141'}
                        selectedItemColor={'#414141'}
                        inputContainerStyle={{ borderBottomColor: 'transparent' }}
                        textColor={'#414141'}
                        itemColor={'#414141'}
                        onChangeText={this.onChangeText}
                        fontFamily={'Poppins-Regular'}
                        dropdownPosition={1}
                        labelHeight={0}
                      />
                </View>
            </View> 
            )
        }

        var _renderDistrictOption = () => {
            return (
            <View style={styles.filterContainer}>
               <View style={styles.dropdownCustom}>
                   <Dropdown
                        allowFontScaling={false}
                        data={propertyType}
                        value={this.state.rentalType}
                        baseColor={'#414141'}
                        selectedItemColor={'#414141'}
                        inputContainerStyle={{ borderBottomColor: 'transparent' }}
                        textColor={'#414141'}
                        itemColor={'#414141'}
                        onChangeText={this.rentalTypeChange}
                        fontFamily={'Poppins-Regular'}
                        dropdownPosition={1}
                        labelHeight={0}
                      />
                </View>
            </View>
            )
        }
        var _renderBedroomsOption = () => {
            let isDisplay = (() => {
                if (this.state.propertyTypeLabel.key === ALLTYPES) return true
                return (this.state.propertyTypeLabel.key !== COMMERCIAL_KEY && this.state.propertyTypeLabel.key !== INDUSTRIAL_KEY)
            })
            return (
                <View style={styles.filterContainer}>
                    <View style={styles.dropdownCustom} >
                       <Dropdown
                        allowFontScaling={false}
                        data={furnishedType}
                        value={this.state.furnishedType}
                        baseColor={'#414141'}
                        selectedItemColor={'#414141'}
                        inputContainerStyle={{ borderBottomColor: 'transparent' }}
                        textColor={'#414141'}
                        itemColor={'#414141'}
                        onChangeText={this.furnishedTypeChange}
                        fontFamily={'Poppins-Regular'}
                        dropdownPosition={1}
                        labelHeight={0}
                      />
                    </View>
                    

                    <View style={{ flex: 1,justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.rangeContainerFirst}>
                       <Text allowFontScaling={false} style={styles.rangeTitle}>Built-up Area </Text>
                       <View>
                          <View style={[styles.inline, styles.oneRowContainer]}>
                            <View style={{ width: '48%' }}>
                                <DropdownSearch
                                    title={'MIN FLOOR SIZE'}
                                    titleStyle={titleStyle}
                                    defaultValue={this._getDropdownValue('minFloorSize')}
                                    collapseAble={false}
                                    height={45}
                                    onPress={this._handleOnSetMinFloorSize} />
                            </View>
                            <View style={{ width: '48%' }}>
                            <DropdownSearch
                                title={'MAX FLOOR SIZE'}
                                titleStyle={titleStyle}
                                defaultValue={this._getDropdownValue('maxFloorSize')}
                                collapseAble={false}
                                height={45}
                                onPress={this._handleOnSetMaxFloorSize} />
                            </View>
                        </View>
                        </View>
                    </View>
                  </View>

                  <View style={{ flex: 1,justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.rangeContainerFirst}>
                       <Text allowFontScaling={false} style={styles.rangeTitle}>Land Area</Text>
                       <View style={[{ display: (isDisplay() ? 'flex' : 'none') }, styles.inline, styles.oneRowContainer]}>
                        <View style={{ width: '48%' }}>
                            <DropdownSearch
                                title={'MIN LAND SIZE'}
                                titleStyle={titleStyle}
                                defaultValue={this._getSelectedValueWithSingleSelect('minLandArea', 'Any')}
                                collapseAble={false}
                                height={45}
                                onPress={this._handleOnSetMinLandArea} />
                        </View>
                        <View style={{ width: '48%' }}>
                            <DropdownSearch
                                title={'MAX LAND SIZE'}
                                titleStyle={titleStyle}
                                defaultValue={this._getSelectedValueWithSingleSelect('maxLandArea', 'Any')}
                                collapseAble={false}
                                height={45}
                                onPress={this._handleOnSetMaxLandArea} />
                        </View>
                    </View>
                    </View>
                  </View>

                    
                </View>       
            )
        }

        var _renderPriceOption = () => {
            return (
               <View style={styles.dropdownCustom}>
               <Picker
                 itemStyle={{ backgroundColor: "grey", fontSize:17, color: 'red' }}
                  selectedValue={this.state.language}
                   onValueChange={(itemValue, itemIndex) =>
                  this.setState({language: itemValue})
                  }>
                  <Picker.Item label="Lorem" value="Lorem" />
                  <Picker.Item label="Lorem" value="LOrem" />
               </Picker>
            </View>   
            )
        }

        var _renderBelowValuationOption = () => {
            let isDisplay = (() => {
                if (this.state.propertyTypeLabel.key === ALLTYPES) return (this.state.transactionType.value === 'Sale')
                return (this.state.transactionType.value === 'Sale' && this.state.propertyTypeLabel.key !== COMMERCIAL_KEY && this.state.propertyTypeLabel.key !== INDUSTRIAL_KEY)
            })
            return (
                <View style={[{ display: (isDisplay() ? 'flex' : 'none') }, styles.oneRowContainer]}>
                    <Dropdown
                        allowFontScaling={false}
                        title={'% BELOW EDGE FAIR VALUE'}
                        titleStyle={titleStyle}
                        defaultValue={this._getSelectedValueWithSingleSelect('belowValuation', 'Any')}
                        collapseAble={false}
                        height={45}
                        onPress={this._handleOnSetBelowValuation} />
                </View>
            )
        }

        var _renderFloorSizeOption = () => {
            return (
                
                <View style={styles.buttonOneContainer}>
                  <TouchableOpacity onPress={this._searchResult}> 
                     <View style={styles.buttonOne}> 
                        <Text allowFontScaling={false} style={styles.buttonText}>
                           Search 
                         </Text>
                     </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this._clearFilters}>   
                     <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 20 }}>
                        <Text allowFontScaling={false} style={{ color: '#488BF8', fontFamily: 'Poppins-SemiBold', fontSize: 16 }}>
                           Clear Filter
                         </Text>
                     </View>
                  </TouchableOpacity> 
                </View>
            )
        }

        var _renderBathroomsOption = () => {
            let isDisplay = (() => {
                if (this.state.propertyTypeLabel.key === ALLTYPES) return true
                return (this.state.propertyTypeLabel.key !== COMMERCIAL_KEY && this.state.propertyTypeLabel.key !== INDUSTRIAL_KEY)
            })
            return (
                <View style={[{ display: (isDisplay() ? 'flex' : 'none') }, styles.oneRowContainer]}>
                    <BlockList
                        criteria={'MINI BATHROOMS'}
                        initFocusIndex={this.state.bathroom.index}
                        data={BathroomOptions}
                        toggle={true}
                        numOfColumn={BathroomOptions.length}
                        disable={false}
                        marginLeft={0}
                        marginTop={titleStyle.marginTop}
                        marginBottom={titleStyle.marginBottom}
                        color={titleStyle.color}
                        fontSize={titleStyle.fontSize}
                        fontFamily={titleStyle.fontFamily}
                        isRounded={true}
                        style={blockListItemStyle}
                        onPress={this._handleOnSetBathrooms}
                    />
                </View>
            )
        }

        var _renderTenureAndFurnishingOption = () => {
            let isDisplay1 = (() => {
                return (this.state.transactionType.value === 'Sale')
            })
            let isDisplay2 = (() => {
                if (this.state.propertyTypeLabel.key === ALLTYPES) return true
                return (this.state.propertyTypeLabel.key !== COMMERCIAL_KEY && this.state.propertyTypeLabel.key !== INDUSTRIAL_KEY)
            })
            return (
                <View style={[styles.inline, styles.oneRowContainer]}>
                    <View style={{ display: (isDisplay2() ? 'flex' : 'none'), width: '48%' }}>
                        <Dropdown
                            allowFontScaling={false}
                            title={'FURNISHING'}
                            titleStyle={titleStyle}
                            defaultValue={this._getSelectedValueWithSingleSelect('furnishing', 'Any')}
                            collapseAble={false}
                            height={45}
                            onPress={this._handleOnSetFurnishing} />
                    </View>
                </View>
            )
        }

        var _renderRentalType = () => {
            let isDisplay = (() => {
                return (this.state.transactionType.value === 'Rent')
            })
            return (
                <View style={[{ display: (isDisplay() ? 'flex' : 'none') }, styles.inline, styles.oneRowContainer]}>
                    <View style={{ width: '48%' }}>
                        <Dropdown
                            allowFontScaling={false}
                            title={'RENTAL TYPE'}
                            titleStyle={titleStyle}
                            defaultValue={this._getSelectedValueWithMultiSelect('rentalType', 'Any')}
                            collapseAble={false}
                            height={45}
                            onPress={this._handleOnSetRentalType} />
                    </View>
                </View>
            )
        }

        var _renderCompletionOption = () => {
            let isDisplay = (() => {
                if (this.state.propertyTypeLabel.key === ALLTYPES) return (this.state.transactionType.value === 'Sale')
                return (this.state.transactionType.value === 'Sale' && this.state.propertyTypeLabel.key !== HDB_KEY)
            })
            return (
                <View style={[{ display: (isDisplay() ? 'flex' : 'none') }, styles.inline, styles.oneRowContainer]}>
                    <View style={{ width: '48%' }}>
                        <Dropdown
                            allowFontScaling={false}
                            title={'COMPLETION'}
                            titleStyle={titleStyle}
                            defaultValue={this._getSelectedValueWithMultiSelect('completion', 'Any')}
                            collapseAble={false}
                            height={50}
                            onPress={this._handleOnSetCompletion} />
                    </View>
                </View>
            )
        }

        var _renderYearsOfCompletionOption = () => {
            let isDisplay = (() => {
                if (this.state.propertyTypeLabel.key === ALLTYPES) return true
                return (this.state.propertyTypeLabel.key !== COMMERCIAL_KEY && this.state.propertyTypeLabel.key !== INDUSTRIAL_KEY)
            })
            return (
                <View style={[{ display: (isDisplay() ? 'flex' : 'none') }, styles.inline, styles.oneRowContainer]}>
                    <View style={{ width: '48%' }}>
                        <Dropdown
                            allowFontScaling={false}
                            title={'MIN YEARS OF COMPLETION'}
                            titleStyle={titleStyle}
                            defaultValue={this._getSelectedValueWithSingleSelect('minYearsOfCompletion', 'Any')}
                            collapseAble={false}
                            height={45}
                            onPress={this._handleOnSetMinYearsOfCompletion} />
                    </View>
                    <View style={{ width: '48%' }}>
                        <Dropdown
                            allowFontScaling={false}
                            title={'MAX YEARS OF COMPLETION'}
                            titleStyle={titleStyle}
                            defaultValue={this._getSelectedValueWithSingleSelect('maxYearsOfCompletion', 'Any')}
                            collapseAble={false}
                            height={45}
                            onPress={this._handleOnSetMaxYearsOfCompletion} />
                    </View>
                </View>
            )
        }

        var _renderLevelsAndRentalYieldOption = () => {
            let isDisplay1 = (() => {
                if (this.state.propertyTypeLabel.key === ALLTYPES) return true
                return (this.state.propertyTypeLabel.key !== LANDED_KEY && this.state.propertyTypeLabel.key !== COMMERCIAL_KEY && this.state.propertyTypeLabel.key !== INDUSTRIAL_KEY)
            })
            let isDisplay2 = (() => {
                if (this.state.propertyTypeLabel.key === ALLTYPES) return (this.state.transactionType.value === 'Sale')
                return (this.state.transactionType.value === 'Sale' && this.state.propertyTypeLabel.key !== HDB_KEY && this.state.propertyTypeLabel.key !== COMMERCIAL_KEY && this.state.propertyTypeLabel.key !== INDUSTRIAL_KEY)
            })
            return (
                <View style={[styles.inline, styles.oneRowContainer]}>
                    <View style={[{ display: (isDisplay1() ? 'flex' : 'none') }, { width: '48%' }]}>
                        <Dropdown
                            allowFontScaling={false}
                            title={'LEVELS'}
                            titleStyle={titleStyle}
                            defaultValue={this._getSelectedValueWithMultiSelect('levels', 'Any')}
                            collapseAble={false}
                            height={45}
                            onPress={this._handleOnSetLevels} />
                    </View>
                    <View style={[{ display: (isDisplay2() ? 'flex' : 'none') }, { width: '48%' }]}>
                        <Dropdown
                            allowFontScaling={false}
                            title={'RENTAL YIELD'}
                            titleStyle={titleStyle}
                            defaultValue={this._getSelectedValueWithSingleSelect('rentalYield', 'Any')}
                            collapseAble={false}
                            height={45}
                            onPress={this._handleOnSetRentalYield} />
                    </View>
                </View>
            )
        }

        var _renderLandArea = () => {
            let isDisplay = (() => {
                if (this.state.propertyTypeLabel.key === ALLTYPES) return (this.state.transactionType.value === 'Sale')
                return (this.state.transactionType.value === 'Sale' && this.state.propertyTypeLabel.key === LANDED_KEY)
            })

            return (
                <View style={[{ display: (isDisplay() ? 'flex' : 'none') }, styles.inline, styles.oneRowContainer]}>
                    <View style={{ width: '48%' }}>
                        <DropdownSearch
                            title={'MIN LAND SIZE'}
                            titleStyle={titleStyle}
                            defaultValue={this._getSelectedValueWithSingleSelect('minLandArea', 'Any')}
                            collapseAble={false}
                            height={45}
                            onPress={this._handleOnSetMinLandArea} />
                    </View>
                    <View style={{ width: '48%' }}>
                        <DropdownSearch
                            title={'MAX LAND SIZE'}
                            titleStyle={titleStyle}
                            defaultValue={this._getSelectedValueWithSingleSelect('maxLandArea', 'Any')}
                            collapseAble={false}
                            height={45}
                            onPress={this._handleOnSetMaxLandArea} />
                    </View>
                </View>
            )
        }

        var _renderRentalAndSalesVolumeOption = () => {
            let isDisplay = (() => {
                if (this.state.propertyTypeLabel.key === ALLTYPES) return (this.state.transactionType.value === 'Sale')
                return (this.state.transactionType.value === 'Sale' && this.state.propertyTypeLabel.key === APARTMENTCONDO_KEY)
            })
            return (
                <View style={[{ display: (isDisplay() ? 'flex' : 'none'), }, styles.inline, styles.oneRowContainer]}>
                    <View style={{ width: '48%' }}>
                        <Dropdown
                            allowFontScaling={false}
                            title={'RENTAL VOLUME'}
                            titleStyle={titleStyle}
                            defaultValue={this._getSelectedValueWithSingleSelect('rentalVolume', 'Any')}
                            collapseAble={false}
                            height={45}
                            onPress={this._handleOnSetRentalVolume} />
                    </View>
                    <View style={{ width: '48%' }}>
                        <Dropdown
                            allowFontScaling={false}
                            title={'SALES VOLUME'}
                            titleStyle={titleStyle}
                            defaultValue={this._getSelectedValueWithSingleSelect('salesVolume', 'Any')}
                            collapseAble={false} height={45}
                            onPress={this._handleOnSetSalesVolume} />
                    </View>
                </View>
            )
        }

        var _renderAmenitiesAndDistanceOption = () => {
            return (
                <View style={[styles.oneRowContainer,]}>
                    <View style={[
                        styles.inline,
                        {
                            borderColor: 'rgb(200,199,204)',
                            borderWidth: 1,
                            paddingTop: 5,
                            paddingBottom: 11,
                            paddingHorizontal: 10,
                            marginVertical: 8,
                        }
                    ]}>
                        <View style={{ width: '48%' }}>
                            <Dropdown
                                allowFontScaling={false}
                                title={'AMENITIES'}
                                titleStyle={titleStyle}
                                defaultValue={this._getSelectedValueWithMultiSelect('amenities', 'Any')}
                                collapseAble={false}
                                height={45}
                                onPress={this._handleOnSetAmenities} />
                        </View>
                        <View style={{ width: '48%' }}>
                            <Dropdown
                                allowFontScaling={false}
                                title={'DISTANCE'}
                                titleStyle={titleStyle}
                                defaultValue={this._getSelectedValueWithSingleSelect('distance', 'Any')}
                                collapseAble={false}
                                height={45}
                                onPress={this._handleOnSetDistance} />
                        </View>
                    </View>
                </View>
            )
        }

        var _renderKeywordFeaturesOption = () => {
            return (
                <View style={[{ display: 'none' }, styles.oneRowContainer]}>
                    <TextBox
                        ref={'keywordFeatures'}
                        defaultValue={this.defaultKeywordFeatures}
                        placeholder={"Dual Key, Sea View"}
                        inputContainerStyle={{
                            paddingHorizontal: 14,
                            flexDirection: "row",
                            borderWidth: 1,
                            borderColor: "rgb(238,238,238)",
                            borderRadius: 5,
                            justifyContent: "center",
                            paddingBottom: 0,
                            height: 45,
                        }}
                        containerStyle={{
                            paddingHorizontal: 0,
                            paddingBottom: 0,
                        }}
                        inputTextStyle={{
                            fontFamily: "Poppins-Light",
                            fontSize: 15,
                            color: "rgb(47,47,47)",
                            textAlign: "left",
                            padding: 0,
                            height: null,
                        }}
                        tooltip={true}
                        tooltipMessage={"Use comma ( , ) as separator, eg. Dual Key, Sea View"}
                        errorTextStyle={{ display: 'none' }}
                        titleTextStyle={titleStyle}
                        title={'KEYWORDS'} />
                </View>
            )
        }

        var _renderNewLaunch = () => {
            return (
                <View style={[styles.oneRowContainer]}>
                    <CheckBox
                      containerStyle={[styles.checkBoxContainer]}
                      title="New Launcher Only"
                      checked={this.state.new_launch}
                      onPress={this._handleOnSetLanuch}
                    />
                </View>

            )
        }

        var _renderNewLaunchYear = () => {
            let isDisplay = (() => {
                return this.state.new_launch;
            })
            let yearList = this._getLaunchYear();

            return (
                <View style={[{ display: (isDisplay() ? 'flex' : 'none') }, styles.oneRowContainer]}>
                    <BlockList
                        criteria={'New Launches Completion Year'}
                        data={yearList}
                        initFocusIndex={this.state.comyr.index}
                        toggle={true}
                        numOfColumn={yearList.length}
                        disable={false}
                        marginLeft={0}
                        marginTop={titleStyle.marginTop}
                        marginBottom={titleStyle.marginBottom}
                        color={titleStyle.color}
                        fontSize={titleStyle.fontSize}
                        fontFamily={titleStyle.fontFamily}
                        isRounded={true}
                        style={blockListItemStyle}
                        onPress={this._handleOnSetComYr} />
                </View>
            )
        }

        var _renderAdvanceOptions = () => {
            return (
                <View>
                    {/* bathrooms */}
                    {_renderBathroomsOption()}
                    {/* tenure & furnihing */}
                    {_renderTenureAndFurnishingOption()}
                    {/* rental type */}

                    {/* completion */}

                    {/* years of completion */}

                    {/* levels & rental yield */}

                    {/* land area */}
                    {_renderLandArea()}
                    {/* rental volume & sales volume */}

                    {/* amenities & distance */}

                    {/* keywords */}
                    {_renderKeywordFeaturesOption()}
                    {/* new launch  */}
                    {_renderNewLaunch()}
                    {/* new launch competion */}
                    {_renderNewLaunchYear()}
                </View>
            )
        }

        var _renderSeparator = () => {
            return (
                <View
                    style={
                        {
                            flex: 1,
                            flexDirection: 'row',
                            borderColor: 'rgb(231,231,231)',
                            borderWidth: 1,
                            marginTop: 7,
                            marginBottom: 1,
                        }
                    } />
            )
        }

        var _renderButton = () => {
            return (
                <View style={[styles.oneRowContainer, { marginTop: 11 }]}>
                    <View style={{ display: !this.state.isAdvancedOptions ? 'flex' : 'none' }}>
                        <Button
                            onPress={this._handleAdvanceOptionsOnPress}
                            textValue={'ADVANCE OPTIONS'}
                            borderRadius={5}
                            textColor={'rgb(39,80,117)'}
                            borderWidth={1}
                            borderColor={'rgb(39,80,117)'}
                            backgroundColor={'rgb(255,255,255)'} />
                    </View>
                    <View style={{ marginTop: 8 }}>
                        <Button
                            textValue={'RESET'}
                            borderRadius={5}
                            textColor={'rgb(39,80,117)'}
                            borderWidth={1}
                            borderColor={'rgb(39,80,117)'}
                            backgroundColor={'rgb(255,255,255)'}
                            onPress={this._resetData} />
                    </View>
                    <View style={{ marginTop: 8 }}>
                        <Button
                            textValue={'SEARCH'}
                            borderRadius={5}
                            onPress={this._searchResult} />
                    </View>
                </View>
            )
        }
        return (
            <KeyboardAwareScrollView bounces={false} keyboardShouldPersistTaps={'always'} style={{ paddingBottom: 40 }}>
                <NavigationHelper
                    ref={'navigationHelper'}
                    navigation={this.props.navigation}
                />
                {this.state.modalVisible && this.result.length>0?
                     <Common_AutoSuggestion
                     data={this.result}
                     keyword={this.state.keyword}
                     selectedData={(value,index)=>{
                         Keyboard.dismiss()
                         firebase.analytics().logEvent('Search_Field_Populated', { keyword: value.name, resourceType: value.t});
                         this.props.navigation.setParams({
                             data: {keyword:value.name}
                         })
                         let paramSuggestion = this._setParamBySuggestionValue(value.t,value.name,value)
                         this.setState({
                             modalVisible:false,
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
                :
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={{ flex: 1, paddingTop: 6 }}>
                        {/* property types options */}
                        {_renderPropertyTypesOption()}
                        {/* state */}
                        {/* district */}
                        {_renderDistrictOption()}
                        {/* bedrooms */}
                        {_renderBedroomsOption()}
                        {/* price */}

                        {/* floor size */}
                        {_renderFloorSizeOption()}
                        {/* % below valuation */}

                        {/* show more options if isAdvancedOptions is true */}
                        
                        <View style={{ display: this.state.isAdvancedOptions ? 'flex' : 'none' }}>
                            {_renderAdvanceOptions()}
                        </View>
                        {/* button */}
                        {_renderButton()}
                    </View>
                </TouchableWithoutFeedback>
                }
            </KeyboardAwareScrollView>
        )
    }
}

const styles = StyleSheet.create({
    inline: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    filterContainer: {
        paddingLeft: 22,
        paddingRight: 22
    },
    oneRowContainer: {
        marginBottom: 3,
        paddingHorizontal: 2,
    },
    checkBoxContainer: {
        marginLeft:0,
        marginRight:0,
    },
    dropdownCustom: {
       height: 55, 
       borderWidth: 1, 
       borderColor: '#D3D3D3', 
       marginBottom: 15, 
       borderRadius: 3, 
       paddingRight: 12,
       paddingLeft: 17,
       width: '100%',
       paddingTop: 15,
     },
     rangeSeperator: {
        marginLeft: 7,
        marginRight: 7,
        color: '#D3D3D3',
        fontWeight: 'bold',
        fontSize: 34,
        alignSelf: 'flex-end',
        marginBottom: 24
     },
     dropdownCustomSlider: {
       borderWidth: 1, 
       borderColor: '#D3D3D3', 
       marginBottom: 18, 
       borderRadius: 3, 
       paddingRight: 12,
       paddingLeft: 17,
       width: '100%',
       paddingTop: 15,
     },
  
    buttonOne: {
    backgroundColor: '#488BF8',
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    justifyContent: 'center',
    marginLeft: 22,
    marginRight: 22,
    borderRadius: 4
  }, 
    buttonText: {
      color: '#fff',
      fontWeight: '500',
      fontSize: 18,
      letterSpacing: 2,
      width: '100%',
      textAlign: 'center'
      //overFlow: 'visible'
   },
   rangeContainer: {
    borderColor: '#D3D3D3',
    borderWidth: 1,
    borderRadius: 3,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 30,
    paddingBottom: 0,
    marginBottom: 15,
   },
   rangeTitle: {
    color: '#414141',
    fontSize: 17,
    paddingBottom: 4,
    fontFamily: 'Poppins-Regular'
   },
  rangeSlider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
   },
  rangeText: {
    color: '#414141',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'left'
   },
   inputRange: {
    width: '100%',
    borderColor: '#D3D3D3',
    borderWidth: 1,
    borderRadius: 3
   },
  rangeInnerContainer:{
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 1
   },
    rangeContainerFirst:{
    borderColor: '#D3D3D3',
    borderWidth: 1,
    borderRadius: 3,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 5,
    marginBottom: 15,
    width: '100%'
    },
   rangeTextFirst: {
    color: '#414141',
    fontSize: 19,
    paddingBottom: 4,
    fontFamily: 'Poppins-Regular'
  },
  rangeDigit: {
   flexDirection: 'row',
   justifyContent: 'flex-end'
  },
   rangeContainerThird:{
    borderColor: '#D3D3D3',
    borderWidth: 1,
    borderRadius: 3,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 15,
    marginBottom: 8
   }
  


})

export default SearchOption
