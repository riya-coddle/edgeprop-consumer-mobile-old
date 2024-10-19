import React, { Component } from 'react'
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Alert,
    ScrollView,
    Image,
    Dimensions,
    NetInfo,
} from 'react-native'
import firebase from 'react-native-firebase';
import appsFlyer from 'react-native-appsflyer';
import IconMenu from '../../components/Common_IconMenu/Common_IconMenu.js'
import LandingHighlight from '../../components/Common_LandingHighlight/Common_LandingHighlight.js'
import ListingPriceInfo from '../../components/Listing_PriceInfo/Listing_PriceInfo.js'
import ListingInfo from '../../components/Listing_ListingInfo/Listing_ListingInfo.js'
import ListingDescription from '../../components/Listing_Description/Listing_Description.js'
import ImageSlider from '../../components/Common_ImageSlider/Common_ImageSlider.js'
import Listing_KeyDetails from '../../components/Listing_KeyDetails/Listing_KeyDetails.js'
import Common_Contact from '../../components/Common_Contact/Common_Contact.js'
import Common_Button from '../../components/Common_Button/Common_Button.js'
import Common_ListIconMenu from '../../components/Common_ListIconMenu/Common_ListIconMenu.js'
import ListingResult_List from '../../components/ListingResult_List/ListingResult_List.js'
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import Loading from '../../components/Common_Loading/Common_Loading.js'

const HOSTNAME = "https://www.edgeprop.sg";
const PROXY_URL = "/proxy?url=";
const API_DOMAIN = "https://www.edgeprop.sg";
const API_DOMAIN_2 = "https://api.theedgeproperty.com.sg";
const API_GET_LISTING_DETAILS = HOSTNAME + PROXY_URL + encodeURIComponent(API_DOMAIN + "/tep-solr/api/getListingDetail.php?");
const API_GET_LISTING_DETAILS_FULL = HOSTNAME + PROXY_URL + encodeURIComponent(API_DOMAIN_2 + "/listings/getlistingdetailsfull?type=web");
const API_GET_RELATED_LISTING = HOSTNAME + PROXY_URL + encodeURIComponent(API_DOMAIN_2 + "/listings/getrelatedlistings?");
const API_GET_NEARBY_LISTING = HOSTNAME + PROXY_URL + encodeURIComponent(API_DOMAIN_2 + "/listings/getnearbylistings?");
const TIMEOUT = 1000;

class ListingDetailInfo extends Component {
    didMount
    constructData
    constructor(props) {
        super(props)
        this.navigation = props.navigation
        this.params = this.navigation.state.params
        this.state = {
            listingHighlight: {},
            floorPlanImage: {},
            listingPriceInfo: {},
            listingInfo: {},
            listingDescription: {},
            listingKeyDetails: {},
            listingContact: {},
            listingFeatures: {},
            listingFacilities: {},
            relatedListing: [],
            nearbyListing: [],
        }
        var { height, width } = Dimensions.get('window')
        this.screenWidth = width,
            this.screenHeight = height
        this.listingDetailURL = ''
        this._callAPI = this._callAPI.bind(this)
        this._handleOnPressListing = this._handleOnPressListing.bind(this);
    }

    componentDidMount() {
        this.didMount = true
        let nid = this.params.data.nid
        this._changeURL()
        this._callAPI(this.listingDetailURL)

        /*relatedListingURL = API_GET_RELATED_LISTING + encodeURIComponent('&nid=' + nid);
        this._callAPI(relatedListingURL, 'relatedListing')

        nearbyListingURL = API_GET_NEARBY_LISTING + encodeURIComponent('&nid=' + nid);
        this._callAPI(nearbyListingURL, 'nearbyListing')*/
    }

    componentWillUnmount(){
      this.didMount = false
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(JSON.stringify(nextProps.screenProps.data.bookmarkList) != JSON.stringify(this.props.screenProps.data.bookmarkList)){
          return true
        }
        return (JSON.stringify(nextState) != JSON.stringify(this.state))
    }

    _constructData(result) {
        var change_date = new Date(result.change_date * 1000)
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        let listingHighlight = {
            images: result.images
        }
        let floorPlanImage ={
            images: result.floorplan_images
        }
        if(result.video_url != undefined && result.video_url.indexOf("https://www.youtube.com/watch")>-1){
          listingHighlight.images.push(result.video_url)
        }
        let listingPriceInfo = {
            listingType: result.listing_type,
            askingPriceType: result.asking_price_type,
            askingPrice: result.asking_price,
            fairValue: result.fair_value,
        }
        let listingInfo = {
            title: result.title,
            assetDistrict: result.asset_district,
            assetStreetName: result.asset_street_name,
            assetPostalCode: result.asset_postal_code,
            assetCity: 'Singapore',
            propertySubType: result.property_sub_type,
            floorLocation: result.floor_location,
            assetYearCompleted: result.asset_year_completed,
            assetTenure: result.asset_tenure,
            bedrooms: result.bedrooms,
            bathrooms: result.bathrooms,
            pricepu: result.price_pu,
            landArea: result.land_area,
            furnished: result.furnished,
        }
        let listingDescription = { info: result.info }
        let listingKeyDetails = {
            type: result.property_sub_type + " For " + result.listing_type,
            size: result.land_area,
            psf: "RM" + result.price_pu,
            top: result.asset_year_completed,
            asset_tenure: result.asset_tenure,
            tenure: result.tenure,
            furnishing: result.furnished,
            floorLevel: result.floor_location,
            reListed: change_date.getDate() + " " + months[change_date.getMonth()] + " " + change_date.getFullYear(),
        }
        listingFeatures = { data: result.features }
        listingFacilities = { data: result.facilities }
        let listingContact = {
            name: result.name,
            agencyName: result.agent_agency_name,
            phoneNumber: result.agent_contact,
            regNumber: result.agent_agency_id,
            image: result.agent_image,
        }

        if(this.didMount){
          this.setState({
              listingHighlight: listingHighlight,
              floorPlanImage: floorPlanImage,
              listingPriceInfo: listingPriceInfo,
              listingInfo: listingInfo,
              listingDescription: listingDescription,
              listingKeyDetails: listingKeyDetails,
              listingContact: listingContact,
              listingFeatures: listingFeatures,
              listingFacilities: listingFacilities,
          })
          this.constructData = true
        }
    }

    _callAPI(apiUrl, stateName) {
        console.log('apiUrl',apiUrl);
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                //fetch function
                fetch(apiUrl,
                    {
                        method: 'GET', timeout: TIMEOUT
                    }).
                    then((response) => response.json()).
                    then((responseJson) => {
                        if (responseJson) {
                            if(stateName=='relatedListing' || stateName == 'nearbyListing'){
                              if(this.didMount){
                                this.setState({
                                  [stateName]: responseJson.response.length > 0 ? responseJson.response.slice(0, 2): []
                                });
                              }
                            }else{
                                this.constructData = true
                                this._constructData(responseJson.response)
                                if (this.props.screenProps.data.handleFullAPIReturn) {
                                    this.props.screenProps.data.handleFullAPIReturn(responseJson.response)
                                }
                            }
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        });
    }

    _changeURL() {
        let nid = this.params.data.nid
        this.listingDetailURL = API_GET_LISTING_DETAILS_FULL + encodeURIComponent('&nid=' + nid)
        // this.relatedListingURL = API_GET_RELATED_LISTING + encodeURIComponent('&nid=' + nid)
    }

    _wrapHighlightData(images) {
        if (!images) return []
        let wrappedImages = images.map(function (item) {
            return { image: item }
        })

        return wrappedImages
    }

    _isArrayContain(array, item){
      if(array!= undefined && Array.isArray(array)){
        if(item!=undefined && array.indexOf(item.toString()) > -1){
          return true
        }
        else{
          return false
        }
      }
    }

    _mapListing(stateName){
        return(
            this.state[stateName].map((listing,index)=>{
                return(
                    {
                    listing_id:listing.nid,
                    agent_name: listing.name,
                    agent_photo: listing.agent_image,
                    images: listing.images,
                    asking_price: listing.asking_price,
                    title: listing.title,
                    bedrooms: listing.bedrooms,
                    bathrooms: listing.bathrooms,
                    district_name: listing.asset_district,
                    street_name: listing.field_prop_street_value,
                    floor_area_sqft: listing.price_pu,
                    floor_area_sqm: listing.land_area,
                }
                )
            })
        );
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
                nid: item.listing_id,
                isBookmark: this._isArrayContain(this.props.screenProps.data.bookmarkList, item.listing_id),
                onBack: this.props.screenProps.data.checkBookmark,
            }
        })
    }

    render() {
        var _renderSlideShow = () => {
            var slideShowData = []
            let listingHighlight = this.state.listingHighlight
            let floorPlanImage = this.state.floorPlanImage
            if (listingHighlight.images != undefined && listingHighlight.images.length > 0) {
                slideShowData = listingHighlight.images.map((item, index) => {
                    return {
                        image: item || "",
                        title: "",
                        description: ""
                    }
                })
                if(floorPlanImage.images != undefined && floorPlanImage.images.length > 0){
                    floorPlanImage.images.map((item, index) => {
                        var obj={}
                        obj["image"] = item || ""
                        obj["title"] = ""
                        obj["description"] = ""

                        slideShowData.push(obj)
                    })
                }
            }
            else{
                if(this.constructData){
                    slideShowData = [{image: "https://dkc9trqgco1sw.cloudfront.net/s3fs-public/default_images/no_img.png", title: "", description: ""}]
                }
            }

            return (
                <ImageSlider
                    width={this.screenWidth}
                    height={this.screenWidth * 9 / 16}
                    id={`imageSlider`}
                    transitionInterval={0.5}
                    showInterval={2}
                    slideInterval={0.3}
                    navigation={true}
                    autoPlay={true}
                    carouselNavigation={false}
                    overlayText={false}
                    showIndex={0}
                    lazyLoad={false}
                    resizeMode={"cover"}
                    belowDescription={true}
                    fullScreen={true}
                    belowDescriptionPadding={"11 20 10 10"}
                    data={slideShowData}
                />
            );
        }
        return (
            <View style={{ flex: 1 }}>
                <NavigationHelper
                  ref={"navigationHelper"}
                  navigation={this.props.navigation}
                />
                <ScrollView contentContainerStyle={{
                    paddingBottom: 75
                }}>
                    {_renderSlideShow()}
                    <ListingPriceInfo
                      priceInfo={this.state.listingPriceInfo}
                      onPressMortgage={()=>{
                        if(this.refs.navigationHelper != undefined){
                          this.refs.navigationHelper._navigate('MortgageCalculator', {
                              data: {
                                asking_price_value: this.state.listingPriceInfo.askingPrice
                              }
                              // title: this.props.navigation.state.params.title
                          })
                        }
                      }}
                    />
                    <ListingInfo
                      listingInfo={this.state.listingInfo}
                    />
                    <Listing_KeyDetails keydetails={this.state.listingKeyDetails} />
                    <ListingDescription item={this.state.listingDescription} />
                    <Common_ListIconMenu data={this.state.listingFeatures} title={'HOME FEATURE'} />
                    <Common_ListIconMenu data={this.state.listingFacilities} title={'FACILITIES'} />
                    <View display={this.state.relatedListing.length>0 ? 'flex' : 'none'}
                        style={{
                        marginBottom:15
                    }}>
                        <ListingResult_List
                            bookmarkList={this.props.screenProps.data.bookmarkList}
                            navigation={this.props.navigation}
                            headerTitle={'Related Listings'}
                            items={this._mapListing("relatedListing")}
                            onPressItem={this._handleOnPressListing}
                            onUpdateBookmark={this.props.screenProps.data.checkBookmark}
                        />
                    </View>
                    <View display={this.state.nearbyListing.length>0 ? 'flex' : 'none'}>
                        <ListingResult_List
                            bookmarkList={this.props.screenProps.data.bookmarkList}
                            navigation={this.props.navigation}
                            headerTitle={'Nearby Listings'}
                            items={this._mapListing("nearbyListing")}
                            onPressItem={this._handleOnPressListing}
                            onUpdateBookmark={this.props.screenProps.data.checkBookmark}
                        />
                    </View>
                    <Common_Contact data={this.state.listingContact} />
                </ScrollView>
                {Object.keys(this.state.listingHighlight).length==0?(
                    <Loading/>
                ):<View/>}
            </View>
        )
    }
}
const { width, height } = Dimensions.get('window')
export default ListingDetailInfo
