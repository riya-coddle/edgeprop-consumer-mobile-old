import React, { Component } from 'react'
import {
    View,
    ScrollView,
    PixelRatio,
    Dimensions,
    Text,
    ActivityIndicator
} from 'react-native'
import firebase from 'react-native-firebase';
import appsFlyer from 'react-native-appsflyer';
import BookmarkHelper from '../../components/Common_BookmarkHelper/Common_BookmarkHelper.js'
import SearchOption from '../../components/ListingResult_SearchOption/ListingResult_SearchOption'
import ListingResultList from '../../components/ListingResult_List/ListingResult_List'
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import SortListingData from '../../assets/json/SortListingData.json'
import IconMenu from '../../components/Common_IconMenu/Common_IconMenu.js'

const screenWidth = Dimensions.get('window').width;
const HOSTNAME = "https://www.edgeprop.sg";
const PROXY_URL = "/proxy?url=";
const API_DOMAIN = "https://www.edgeprop.sg";
const API_GET_LISTING_RESULT = HOSTNAME + PROXY_URL //+ encodeURIComponent(API_DOMAIN + "/index.php?option=com_analytica&task=mapsearch&mode=list&page=1");
const TIMEOUT = 1000;
const PAGE_SIZE = 10;

class ListingResult extends Component {
    pageCount = 1;
    totalPage = 1;
    totalListing = -1;
    didMount = false
    orderBy = 'posted_desc'
    sortingValue = 'Latest First'

    static navigationOptions = ({ navigation }) => {
        var map_icon = require('../../assets/icons/Map.png');
        var filter_icon = require('../../assets/icons/Filter.png');
        const { state, setParams } = navigation;
        var { params } = state
        return {
            title: (
                <Text
                    style={{
                        fontSize: 16,
                        fontFamily: 'Poppins-SemiBold',
                        color: 'rgb(255,255,255)',
                        textAlign: 'center',
                    }}>
                    {'LIST'}
                </Text>
            ),
            headerStyle: {
                backgroundColor: "#275075",
                // height: 75,
                marginBottom: 6,
            },
            headerRight: (
                <View style={
                    {
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        paddingVertical: 5,
                    }
                }>
                     <IconMenu
                        imageWidth={30}
                        imageHeight={30}
                        paddingVertical={10}
                        paddingHorizontal={0}
                        type={"icon"}
                        imageSource={map_icon}
                        onPress={() => params.handleMap()}
                    />
                   <IconMenu
                        imageWidth={30}
                        imageHeight={30}
                        paddingVertical={10}
                        paddingHorizontal={5}
                        type={"icon"}
                        imageSource={filter_icon}
                        onPress={() => params.hanldeFilter()}
                    />
                </View>
            ),
        };
    };

    constructor(props) {
        super(props);
        this.navigation = props.navigation

        this.state = {
            listingResult: {},
            bookmarkList: []
            // Search data
        }
        this.listingResultURL = ''
        this._callAPI = this._callAPI.bind(this);
        this._handleOnPressListing = this._handleOnPressListing.bind(this);
        this._handleLoadMore = this._handleLoadMore.bind(this);
        this._handleData = this._handleData.bind(this)
        this._onSortPress = this._onSortPress.bind(this)
        this._hanldeFilter = this._hanldeFilter.bind(this);
        this._handleMap = this._handleMap.bind(this);
        this._handleParamSearchOption = this._handleParamSearchOption.bind(this);
        this._setParameterValue1 = this._setParameterValue1.bind(this)
        this._setParameterValue2 = this._setParameterValue2.bind(this)
        this._searchResultFeedback = this._searchResultFeedback.bind(this)
        this._checkBookmark = this._checkBookmark.bind(this)
        this.title = this.props.navigation.state.params.title
        this.tempMRT = ''
        this.parameterFilter = {
            listing_type: this.props.navigation.state.params.data.listing_type || {id: "sale", value: "Buy"},
            property_type_legacy: this.props.navigation.state.params.data.property_type_legacy || [],
            property_type: this.props.navigation.state.params.data.property_type || {label: "All Types", key: 0, idList: Array(0)},
            district: this.props.navigation.state.params.data.district || [],
            bedroom_min: this.props.navigation.state.params.data.bedroom_min || {id: "", value: "Any", index: 0},
            asking_price_min: this.props.navigation.state.params.data.asking_price_min || {},
            asking_price_max: this.props.navigation.state.params.data.asking_price_max || {},
            floor_area_min: this.props.navigation.state.params.data.floor_area_min || {},
            floor_area_max: this.props.navigation.state.params.data.floor_area_max || {},
            land_area_min: this.props.navigation.state.params.data.land_area_min || {},
            land_area_max: this.props.navigation.state.params.data.land_area_max || {},
            tenure: this.props.navigation.state.params.data.tenure || [],
            bathroom: this.props.navigation.state.params.data.bathroom || [{id: "", value: "Any", index: 0}],
            furnishing: this.props.navigation.state.params.data.furnishing|| [],
            completed: this.props.navigation.state.params.data.completed || [],
            level: this.props.navigation.state.params.data.level || [],
            completion_year_min: this.props.navigation.state.params.data.completion_year_min || {},
            completion_year_max: this.props.navigation.state.params.data.completion_year_max || {},
            rental_yield: this.props.navigation.state.params.data.rental_yield || {},
            high_rental_volume: this.props.navigation.state.params.data.high_rental_volume || {},
            high_sales_volume: this.props.navigation.state.params.data.high_sales_volume || {},
            deals: this.props.navigation.state.params.data.deals || {} ,
            nearby_amenities: this.props.navigation.state.params.data.nearby_amenities || [],
            amenities_distance: this.props.navigation.state.params.data.amenities_distance || {id: "500", value: "< 0.5km"},
            rental_type: this.props.navigation.state.params.data.rental_type || [],
            keyword_features: this.props.navigation.state.params.data.keyword_features || "",
            keyword: this.props.navigation.state.params.data.keyword || "",
            a: this.props.navigation.state.params.data.a || "",
            x: this.props.navigation.state.params.data.x || "",
            y: this.props.navigation.state.params.data.y || "",
            t: this.props.navigation.state.params.data.t || "",
            is_search: this.props.navigation.state.params.data.is_search,
        }
        console.log('parameterFilter',this.parameterFilter);
        this.navigation.setParams({
          hanldeFilter: this._hanldeFilter,
          handleMap: this._handleMap,
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (JSON.stringify(nextState) != JSON.stringify(this.state))
    }

    componentDidMount() {
        this.didMount = true
        this._checkBookmark();
        this._changeURL()
        this._callAPI(this.listingResultURL, "listingResult");
    }

    componentWillUnmount() {
      this.didMount = false
    }

    _checkBookmark(){
      this.refs.bookmarkHelper._getBookmarks((nids)=>{
        if(nids!=undefined && Array.isArray(nids)){
          if(this.didMount && JSON.stringify(nids)!=JSON.stringify(this.state.bookmarkList.toString)){
            this.setState({
              bookmarkList: nids
            })
          }
        }
      });
    }

    _validateData(currentData, incomingData, latestSize) {
        // console.log(currentData);
        latestSize = latestSize || currentData.length
        start = currentData.length - latestSize > 0 ? currentData.length - latestSize : 0
        currrentData = currentData.slice(start)
        validatedData = []
        i = 0
        flag = true
        while (i < incomingData.length) {
            j = 0
            flag = true
            while (j < currentData.length && flag) {
                if (incomingData[i].listing_id === currentData[j].listing_id) {
                    flag = false
                }
                j++
            }
            if (flag) {
                validatedData.push(incomingData[i])
            }
            i++
        }
        // console.log(validatedData);
        return validatedData
    }

    _hanldeFilter(){
      this.refs.navigationHelper._navigate('SearchOption', {
          data: this._getAllParameters(),
          title: this.props.navigation.state.params.title,
          searchResultFeedback: this._searchResultFeedback,
      })
    }
    _searchResultFeedback(title, data){
        this.title = title;
        this.parameterFilter= {
            listing_type: data.listing_type,
            property_type_legacy: data.property_type_legacy,
            property_type: data.property_type,
            district: data.district,
            bedroom_min: data.bedroom_min,
            asking_price_min: data.asking_price_min,
            asking_price_max: data.asking_price_max,
            floor_area_min: data.floor_area_min,
            floor_area_max: data.floor_area_max,
            land_area_min: data.land_area_min,
            land_area_max: data.land_area_max,
            tenure: data.tenure,
            bathroom: data.bathroom,
            furnishing: data.furnishing,
            completed: data.completed,
            level: data.level,
            completion_year_min: data.completion_year_min,
            completion_year_max: data.completion_year_max,
            rental_yield: data.rental_yield,
            high_rental_volume: data.high_rental_volume,
            high_sales_volume: data.high_sales_volume,
            deals: data.deals,
            nearby_amenities: data.nearby_amenities,
            amenities_distance: data.amenities_distance,
            rental_type: data.rental_type,
            keyword_features: data.keyword_features,
            keyword: data.keyword,
            a: data.a,
            x: data.x,
            y: data.y,
            t: data.t,
            is_search: data.is_search,
        }

        this.totalListing= -1;
        // this.state.listingResult = {}
        this.setState({
            listingResult : {}
        })
        this._changeURL()
        this._callAPI(this.listingResultURL, "listingResult");
    }
    _getAllParameters() {
        return ({
            listing_type: this.parameterFilter.listing_type,
            property_type: this.parameterFilter.property_type,
            property_type_legacy: this.parameterFilter.property_type_legacy,
            district: this.parameterFilter.district,
            bedroom_min: this.parameterFilter.bedroom_min,
            asking_price_min: this.parameterFilter.asking_price_min,
            asking_price_max: this.parameterFilter.asking_price_max,
            floor_area_min: this.parameterFilter.floor_area_min,
            floor_area_max: this.parameterFilter.floor_area_max,
            land_area_min: this.parameterFilter.land_area_min,
            land_area_max: this.parameterFilter.land_area_max,
            tenure: this.parameterFilter.tenure,
            bathroom: this.parameterFilter.bathroom,
            furnishing: this.parameterFilter.furnishing,
            completed: this.parameterFilter.completed,
            level: this.parameterFilter.level,
            completion_year_min: this.parameterFilter.completion_year_min,
            completion_year_max: this.parameterFilter.completion_year_max,
            rental_yield: this.parameterFilter.rental_yield,
            high_rental_volume: this.parameterFilter.high_rental_volume,
            high_sales_volume: this.parameterFilter.high_sales_volume,
            deals: this.parameterFilter.deals,
            nearby_amenities: this.parameterFilter.nearby_amenities,
            amenities_distance: this.parameterFilter.amenities_distance,
            rental_type: this.parameterFilter.rental_type,
            keyword_features: this.parameterFilter.keyword_features,
            keyword: this.parameterFilter.keyword,
            a: this.parameterFilter.a,
            x: this.parameterFilter.x,
            y: this.parameterFilter.y,
            t: this.parameterFilter.t,
            is_search: this.parameterFilter.is_search
        })
    }

    _handleMap(){
        if(this.parameterFilter.t!='Districts' && this.parameterFilter.t != 'HDB Towns' && (this.parameterFilter.t.length>0 || this.props.navigation.state.params.distance!= undefined || this.tempMRT.length>0) ){
            console.log('region asset')
            this.refs.navigationHelper._navigate('CommonMap', {
                mapURL: this.listingResultURL.replace(encodeURIComponent("mode=list"),encodeURIComponent("mode=map&geo_type=asset")),
                data: this.parameterFilter,
                title: this.props.navigation.state.params.distance!=undefined || this.tempMRT.length>0?'special asset':'asset',
                searchResultFeedback: this._searchResultFeedback,
                selectionFrom: this.title

            })
        }
        else if (this.parameterFilter.t=='Districts' || this.parameterFilter.t == 'HDB Towns' || this.parameterFilter.district.length>0){
            console.log('region planning')
            this.refs.navigationHelper._navigate('CommonMap', {
                mapURL: this.listingResultURL.replace(encodeURIComponent("mode=list"),encodeURIComponent("mode=map&geo_type=district")),
                data: this.parameterFilter,
                title: 'district',
                searchResultFeedback: this._searchResultFeedback,
                selectionFrom: this.title
            })
        }
        else{
            console.log('other')
            this.refs.navigationHelper._navigate('CommonMap', {
                mapURL: this.listingResultURL.replace(encodeURIComponent("mode=list"),encodeURIComponent("mode=map&geo_type=region")),
                data: this.parameterFilter,
                title: 'region',
                searchResultFeedback: this._searchResultFeedback,
                selectionFrom: this.title
            })
        }

    }
    _handleParamSearchOption(data){
        var temp = ''
        let paramSearch = {
            listing_type: this._setParameterValue1(data.listing_type),
            property_type: this._setParameterValue2(data.property_type.idList),
            district: this._setParameterValue2(data.district),
            bedroom_min: this._setParameterValue1(data.bedroom_min),
            asking_price_min: this._setParameterValue1(data.asking_price_min),
            asking_price_max: this._setParameterValue1(data.asking_price_max),
            floor_area_min: this._setParameterValue1(data.floor_area_min),
            floor_area_max: this._setParameterValue1(data.floor_area_max),
            land_area_min: this._setParameterValue1(data.land_area_min),
            land_area_max: this._setParameterValue1(data.land_area_max),
            tenure: this._setParameterValue2(data.tenure),
            bathroom: this._setParameterValue2(data.bathroom),
            furnishing: this._setParameterValue2(data.furnishing),
            completed: this._setParameterValue2(data.completed),
            level: this._setParameterValue2(data.level),
            completion_year_min: this._setParameterValue1(data.completion_year_min),
            completion_year_max: this._setParameterValue1(data.completion_year_max),
            rental_yield: this._setParameterValue1(data.rental_yield),
            high_rental_volume: this._setParameterValue1(data.high_rental_volume),
            high_sales_volume: this._setParameterValue1(data.high_sales_volume),
            deals: this._setParameterValue1(data.deals),
            nearby_amenities: this._setParameterValue2(data.nearby_amenities),
            amenities_distance: this._setParameterValue1(data.amenities_distance),
            rental_type: this._setParameterValue2(data.rental_type),
            keyword_features: data.keyword_features,
            keyword: data.keyword,
            asset_id:data.a,
            resource_type:data.t,
            x:data.x,
            y:data.y,
        }
        if(data.is_search)
        paramSearch['is_search'] = data.is_search

        Object.keys(paramSearch).map((item, index)=>{
                temp+=(item+'='+paramSearch[item]+'&')
            }
        )
        return temp;
    }
    _setParameterValue1(val) {
        // if the data is object
        let tempVal = ''
        if (Object.keys(val).length!==0) {
            tempVal += val.id
        }
        return tempVal
    }

    _setParameterValue2(val) {
        // if the data is array of string, array of object
        let tempVal = ''
        if (val.length > 0) {
            val.map((item, i) => {
                tempVal += (item.id != undefined ? item.id : item) + (i < val.length - 1 ? ',' : '')
            })
        }
        return tempVal
    }

    _callAPI(apiUrl, stateName) {console.log('apiUrl',apiUrl);
        if (!this.state[stateName].results) {
            fetch(apiUrl,
                {
                    method: 'GET', timeout: TIMEOUT
                }).
                then((response) => response.json()).
                then((responseJson) => {
                    if (responseJson) {
                        if (this.totalListing != responseJson.results.total_listings) {
                            this.totalListing = responseJson.results.total_listings
                        }
                        //if (this.totalPage < Math.ceil(this.totalListing / PAGE_SIZE)) {
                          this.totalPage = Math.ceil(this.totalListing / PAGE_SIZE)
                        // }

                        if (this.didMount) {
                            if (this.state[stateName].length > 0) {
                                this.setState({
                                    [stateName]: [...this.state[stateName], ...this._validateData(this.state[stateName], responseJson.results.listings, 2 * this.PAGE_SIZE)]
                                });
                            }
                            else {
                                this.setState({
                                    [stateName]: responseJson.results.listings
                                });
                            }
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    _handleOnPressListing(item, index) {
        firebase.analytics().logEvent('View_Listing', { id: item.listing_id });
        const eventName = "View_Listing";
        const eventValues = {
        };

        appsFlyer.trackEvent(eventName, eventValues,
            (result) => {
                console.log(result);
            },
            (error) => {
                console.error(error);
            }
        )
        this.refs.navigationHelper._navigate('ListingDetailNav', {
            data: {
                nid: item.listing_id
            }
        })
    }
    _handleLoadMore() {
        this.pageCount++;
        if (this.pageCount <= this.totalPage) {
            this._changeURL()
            this._callAPI(this.listingResultURL, "listingResult");
        }
    }

    _changeURL() {
        var dataSelection = this.props.navigation.state.params.data;
        // this.assetId = dataSelection.assetId
        // this.coordinateX = dataSelection.coordinateX
        // this.coordinateY = dataSelection.coordinateY
        // this.resourceType = dataSelection.resourceType
        // assetIdParam = this.assetId ? `asset_id=${this.assetId}` : 'asset_id='
        // coordinateXParam = this.coordinateX ? `x=${this.coordinateX}`: 'x='
        // coordinateYParam = this.coordinateY ? `y=${this.coordinateY}`: 'y='
        // resourceTypeParam = this.resourceType ? `resource_type=${this.resourceType}`: 'resource_type='
        if(this.title=='HDB TOWNS'){
            // this.parameterFilter.district= this.props.navigation.state.params.data
            // this.parameterFilter.property_type= { label: 'HDB', key: 2, idList: ['14', '15', '16', '17', '18', '19', '20'] }
            var tempFilter = this._handleParamSearchOption(this.parameterFilter)
            // var tempHDB = ''
            // for(i=0 ; i < dataSelection.length; i++){
            //     i != dataSelection.length-1
            //      ?
            //         tempHDB += dataSelection[i].id + ','
            //      :
            //         tempHDB += dataSelection[i].id
            // }
            // this.listingResultURL = API_GET_LISTING_RESULT + encodeURIComponent(API_DOMAIN + "/index.php?option=com_analytica&task=mapsearch&mode=list&listing_type=sale&property_type=14%2C15%2C16%2C17%2C18%2C19%2C20&district="+tempHDB+"&bedroom_min=&asking_price_min=&asking_price_max=&floor_area_min=&floor_area_max=&land_area_min=&land_area_max=&tenure=&bathroom=&furnishing=&completed=&level=&completion_year_min=&completion_year_max=&rental_yield=&high_rental_volume=&high_sales_volume=&deals=&nearby_amenities=&amenities_distance=500&rental_type=&keyword_features=&keyword=&asset_id=&resource_type=&x=&y=&radius=500&search_by=&search_by_distance=&search_by_location=&search_by_showmap=true&below_valuation=&map_zoom=&asset_lat=&asset_lng=&page="+this.pageCount+"&pageSize="+ PAGE_SIZE+"&order_by="+this.orderBy+"");

            this.listingResultURL = API_GET_LISTING_RESULT + encodeURIComponent(API_DOMAIN + "/index.php?option=com_analytica&task=mapsearch&mode=list&"+tempFilter+"search_by=&search_by_distance=500&search_by_location=&page="+this.pageCount+"&pageSize="+ PAGE_SIZE+"&order_by="+this.orderBy+"");
        }
        else if(this.title=='DISTRICTS'){
            // this.parameterFilter.district= this.props.navigation.state.params.data
            var tempFilter = this._handleParamSearchOption(this.parameterFilter)

            // var tempDistrict = ''
            // for(i=0 ; i < dataSelection.length; i++){
            //     i != dataSelection.length-1
            //      ?
            //         tempDistrict += dataSelection[i].id + ','
            //      :
            //         tempDistrict += dataSelection[i].id
            // }
            // this.listingResultURL = API_GET_LISTING_RESULT + encodeURIComponent(API_DOMAIN + "/index.php?option=com_analytica&task=mapsearch&mode=list&listing_type=sale&property_type=&district="+tempDistrict+"&bedroom_min=&asking_price_min=&asking_price_max=&floor_area_min=&floor_area_max=&land_area_min=&land_area_max=&tenure=&bathroom=&furnishing=&completed=&level=&completion_year_min=&completion_year_max=&rental_yield=&high_rental_volume=&high_sales_volume=&deals=&nearby_amenities=&amenities_distance=500&rental_type=&keyword_features=&keyword=&asset_id=&resource_type=&x=&y=&radius=500&search_by=&search_by_distance=&search_by_location=&search_by_showmap=true&below_valuation=&map_zoom=&asset_lat=&asset_lng=&page="+this.pageCount+"&pageSize="+ PAGE_SIZE+"&order_by="+this.orderBy+"");

            this.listingResultURL = API_GET_LISTING_RESULT + encodeURIComponent(API_DOMAIN + "/index.php?option=com_analytica&task=mapsearch&mode=list&"+tempFilter+"search_by=&search_by_distance=500&search_by_location=&page="+this.pageCount+"&pageSize="+ PAGE_SIZE+"&order_by="+this.orderBy+"");
        }
        else if(this.title=='MRTSelectionNav'){
            var tempFilter = this._handleParamSearchOption(this.parameterFilter)
            var tempMRT = ''

            for(i=0 ; i < dataSelection.length; i++){
                i != dataSelection.length-1
                 ?
                    tempMRT += dataSelection[i].code + ',' + dataSelection[i].x + ',' + dataSelection[i].y + ',' + dataSelection[i].lat + ',' + dataSelection[i].lon + '|'
                 :
                    tempMRT += dataSelection[i].code + ',' + dataSelection[i].x + ',' + dataSelection[i].y + ',' + dataSelection[i].lat + ',' + dataSelection[i].lon
            }
            this.tempMRT = tempMRT
            // console.log(tempMRT)
            // this.listingResultURL = API_GET_LISTING_RESULT + encodeURIComponent(API_DOMAIN + "/index.php?option=com_analytica&task=mapsearch&mode=list&listing_type=sale&property_type=&district=&bedroom_min=&asking_price_min=&asking_price_max=&floor_area_min=&floor_area_max=&land_area_min=&land_area_max=&tenure=&bathroom=&furnishing=&completed=&level=&completion_year_min=&completion_year_max=&rental_yield=&high_rental_volume=&high_sales_volume=&deals=&nearby_amenities=&amenities_distance=500&rental_type=&keyword_features=&keyword=&asset_id=&resource_type=&x=&y=&radius=500&search_by=mrt&search_by_distance=500&search_by_location="+tempMRT+"&search_by_showmap=true&below_valuation=&map_zoom=&asset_lat=&asset_lng=&page="+this.pageCount+"&pageSize="+ PAGE_SIZE+"&order_by="+this.orderBy+"");

            this.listingResultURL = API_GET_LISTING_RESULT + encodeURIComponent(API_DOMAIN + "/index.php?option=com_analytica&task=mapsearch&mode=list&"+tempFilter+"search_by=mrt&search_by_distance=1000&search_by_location="+tempMRT+"&page="+this.pageCount+"&pageSize="+ PAGE_SIZE+"&order_by="+this.orderBy+"");
            // console.log('url mrt', this.listingResultURL)

        }

        else if(this.title=='SchoolOption'){
            var tempFilter = this._handleParamSearchOption(this.parameterFilter)
            var tempSchool = ''

            for(i=0 ; i < dataSelection.length; i++){
                i != dataSelection.length-1
                 ?
                    tempSchool += ',' + dataSelection[i].x + ',' + dataSelection[i].y + ',' + dataSelection[i].lat + ',' + dataSelection[i].lon + '|'
                 :
                    tempSchool += ',' + dataSelection[i].x + ',' + dataSelection[i].y + ',' + dataSelection[i].lat + ',' + dataSelection[i].lon
            }
            // this.listingResultURL = API_GET_LISTING_RESULT + encodeURIComponent(API_DOMAIN + "/index.php?option=com_analytica&task=mapsearch&mode=list&listing_type=sale&property_type=&district=&bedroom_min=&asking_price_min=&asking_price_max=&floor_area_min=&floor_area_max=&land_area_min=&land_area_max=&tenure=&bathroom=&furnishing=&completed=&level=&completion_year_min=&completion_year_max=&rental_yield=&high_rental_volume=&high_sales_volume=&deals=&nearby_amenities=&amenities_distance=500&rental_type=&keyword_features=&keyword=&asset_id=&resource_type=&x=&y=&radius=500&search_by=school&search_by_distance="+this.props.navigation.state.params.distance+"&search_by_location="+tempSchool+"&search_by_showmap=true&below_valuation=&map_zoom=&asset_lat=&asset_lng=&page="+this.pageCount+"&pageSize="+ PAGE_SIZE+"&order_by="+this.orderBy+"");

            this.listingResultURL = API_GET_LISTING_RESULT + encodeURIComponent(API_DOMAIN + "/index.php?option=com_analytica&task=mapsearch&mode=list&"+tempFilter+"search_by=school&search_by_distance="+this.props.navigation.state.params.distance+"&search_by_location="+tempSchool+"&page="+this.pageCount+"&pageSize="+ PAGE_SIZE+"&order_by="+this.orderBy+"");
        }

        else if(this.title=='searchoption' || this.title== 'CommonMap'){
            this.listingResultURL = API_GET_LISTING_RESULT + encodeURIComponent(API_DOMAIN + "/index.php?option=com_analytica&task=mapsearch&mode=list&"+this._handleParamSearchOption(this.parameterFilter)+"radius=1000&search_by=&search_by_distance=&search_by_location=&search_by_showmap=true&below_valuation=&map_zoom=&asset_lat=&asset_lng=&page="+this.pageCount+"&pageSize="+ PAGE_SIZE+"&order_by="+this.orderBy+"");
        }

    }
    _handleData(data) {
        if(data.id != this.orderBy){
            this.setState({
                listingResult: {},
            });
            this.orderBy = data.id
            this.sortingValue = data.value
            this.totalListing= -1;
            // console.log(this.state.listingResult);
            this._changeURL()
            this._callAPI(this.listingResultURL, "listingResult");
        }
        // this._changeURL()
        // this._callAPI(this.listingResultURL, "listingResult");
    }
    _onSortPress() {
        this.refs.navigationHelper._navigateInMenu('CommonSelection', {
            title: 'Order By',
            data: SortListingData,
            handlerData: this._handleData,
            checkBox: false,
        })
    }
    _formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
      }

    render() {
        //console.log('listing',this.listingResultURL)
        return (
          <View style={{ flex: 1 }}>
            <NavigationHelper
            ref={"navigationHelper"}
            navigation={this.props.navigation} />
            <BookmarkHelper
              ref={"bookmarkHelper"}
              navigation = {this.props.navigation}
            />
                {/* <StatusBarBackground lightContent={true} style={{backgroundColor:'#275075'}}/> */}
                <SearchOption
                    onPress={this._onSortPress}
                    sortingValue={this.sortingValue}
                />
                <View display={this.totalListing<0 ? 'flex' : 'none'}>
                    <ActivityIndicator animating size='large' />
                </View>
                <View style={{display: this.totalListing<0 ? 'none' : 'flex', flex:1}}>
                    <ListingResultList
                        bookmarkList={this.state.bookmarkList}
                        navigation={this.props.navigation}
                        items={this.state.listingResult}
                        onPressItem={this._handleOnPressListing}
                        totalListing = {this._formatNumber(this.totalListing)}
                        onLoadMore={this._handleLoadMore}
                        isEndOfData={this.pageCount >= this.totalPage}
                        onUpdateBookmark={this._checkBookmark}
                    />
                </View>
            </View>
        )
    }
}

export default ListingResult
